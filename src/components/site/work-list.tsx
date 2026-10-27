/* eslint-disable @next/next/no-img-element */
"use client";

import { DATA } from "@/data/resume";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import { useFinePointer } from "./use-fine-pointer";

type Project = (typeof DATA.projects)[number];

const yearOf = (dates: string) => dates.match(/\d{4}/)?.[0] ?? "Earlier";

const GROUPS = DATA.projects
  .reduce<[string, Project[]][]>((groups, project) => {
    const year = yearOf(project.dates);
    const group = groups.find(([y]) => y === year);
    if (group) group[1].push(project);
    else groups.push([year, [project]]);
    return groups;
  }, [])
  .sort(([a], [b]) => b.localeCompare(a));

function FolderIcon() {
  return (
    <svg viewBox="0 0 28 22" aria-hidden className="h-[22px] w-7 drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]">
      <path d="M2 5a2 2 0 0 1 2-2h6l2.5 2.5H24a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" fill="#c98f2e" />
      <rect x="5" y="6" width="17" height="9" rx="1" fill="#f5f5f2" />
      <path d="M7.5 8.5h11" stroke="#9aa3ae" strokeWidth="1" />
      <path d="M2 12a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" fill="#f2b441" />
    </svg>
  );
}

export function WorkList() {
  const finePointer = useFinePointer();
  const [preview, setPreview] = useState<Project | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 450, damping: 38 });
  const y = useSpring(pointerY, { stiffness: 450, damping: 38 });

  const show = (project: Project, event: React.PointerEvent) => {
    if (!preview) {
      // first hover: appear at the cursor instead of gliding in from the last spot
      x.jump(event.clientX);
      y.jump(event.clientY);
    }
    setPreview(project);
  };

  return (
    <div
      className="px-3 py-5 sm:px-5"
      onPointerMove={(event) => {
        pointerX.set(event.clientX);
        pointerY.set(event.clientY);
      }}
      onPointerLeave={() => setPreview(null)}
    >
      {GROUPS.map(([year, projects]) => (
        <div key={year} className="mb-6 last:mb-0">
          <div className="mb-1 flex items-center gap-2.5 px-2 sm:px-3">
            <FolderIcon />
            <span className="rounded-md bg-panel px-2 py-0.5 font-serif text-[1.25rem] italic leading-tight">
              {year}
            </span>
          </div>
          <ul>
            {projects.map((project) => {
              const live = project.active && project.href;
              const content = (
                <>
                  <span className="flex min-w-0 flex-1 flex-col gap-x-3 sm:flex-row sm:items-baseline">
                    <span className="shrink-0 font-medium text-foreground">
                      {project.title}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                      {project.tagline}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 self-center">
                    {live && (
                      <span className="rounded bg-flag-bg px-1.5 py-px text-[0.6875rem] font-medium text-flag">
                        live
                      </span>
                    )}
                    {project.href && (
                      <ArrowUpRight
                        aria-hidden
                        className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-foreground"
                      />
                    )}
                  </span>
                </>
              );
              const row =
                "group flex items-start gap-3 rounded-lg px-2 py-2 sm:px-3 hover:bg-panel";
              return (
                <li
                  key={project.title}
                  onPointerEnter={(event) => show(project, event)}
                >
                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={row}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className={row}>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <AnimatePresence>
        {finePointer && preview?.image && (
          <motion.div
            key="preview"
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-50"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            exit={{ opacity: 0, scale: 0.9, rotate: -6 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div className="ml-6 w-52 -translate-y-1/2 rounded-md bg-[#f5f5f2] p-1.5 shadow-[0_14px_30px_-8px_rgba(0,0,0,0.55)]">
              <img
                key={preview.image}
                src={preview.image}
                alt=""
                className="aspect-[4/3] w-full rounded-[3px] object-cover object-top"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
