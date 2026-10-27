"use client";

import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { useActiveSection } from "./use-active-section";

// A ruler in the left gutter: one long tick per section, two short ones between.
// The section being read gets the longest, brightest tick.
export function ScrollRuler() {
  const { marks, active } = useActiveSection();
  if (marks.length === 0) return null;

  return (
    <nav
      aria-label="Page sections"
      className="fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 flex-col py-2 lg:flex"
    >
      {marks.map((mark, index) => {
        const current = mark.id === active;
        return (
          <Fragment key={mark.id}>
            <a
              href={`#${mark.id}`}
              aria-current={current ? "location" : undefined}
              className="group flex h-3 items-center gap-3 pr-4"
            >
              <span
                className={cn(
                  "h-px transition-all duration-300",
                  current
                    ? "w-10 bg-foreground"
                    : "w-6 bg-muted-foreground/60 group-hover:w-8 group-hover:bg-foreground/80"
                )}
              />
              <span
                className={cn(
                  "text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                  current && "text-foreground"
                )}
              >
                {mark.label}
              </span>
            </a>
            {index < marks.length - 1 && (
              <div aria-hidden className="flex flex-col">
                <span className="flex h-3 items-center">
                  <span className="h-px w-3.5 bg-muted-foreground/25" />
                </span>
                <span className="flex h-3 items-center">
                  <span className="h-px w-3.5 bg-muted-foreground/25" />
                </span>
              </div>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
