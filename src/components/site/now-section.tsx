"use client";

import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Section } from "./section";

// Greets by the reader's own clock.
function greetingFor(hour: number) {
  if (hour >= 5 && hour < 12) return "Good morning!";
  if (hour >= 12 && hour < 17) return "Good afternoon!";
  if (hour >= 17 && hour < 22) return "Good evening!";
  return "Hello, night owl!";
}

export function NowSection() {
  // null until the reader's clock is known; the band holds its height meanwhile
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setGreeting(greetingFor(new Date().getHours()))
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Section
      id="now"
      label="Now"
      serif
      title={
        // fades in once instead of swapping "Hello!" for the real greeting
        <span
          className={cn(
            "motion-safe:transition-opacity motion-safe:duration-500",
            greeting ? "opacity-100" : "opacity-0"
          )}
        >
          {greeting ?? "Hello!"}
        </span>
      }
    >
      <ul className="space-y-4 px-5 pb-4 pt-5 sm:px-8">
        {DATA.now.map((item) => (
          <li key={item.lead} className="relative pl-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
            <span
              aria-hidden
              className="absolute left-0.5 top-[0.7em] size-1.5 rounded-full bg-muted-foreground/60"
            />
            <span className="font-medium text-foreground">{item.lead}</span>
            <span
              aria-hidden
              className="mx-2 inline-grid size-6 -rotate-6 place-items-center rounded-md border border-border bg-panel align-[-0.35em] text-signal"
            >
              <item.icon className="size-3.5" />
            </span>
            {item.body}
          </li>
        ))}
      </ul>
    </Section>
  );
}
