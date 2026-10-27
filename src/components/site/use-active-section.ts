"use client";

import { useEffect, useState } from "react";

export type SectionMark = { id: string; label: string };

// Tracks the [data-ruler] sections on the page and which one is being read:
// the last one whose top has crossed a line a third of the way down the screen.
// `page` re-scans after client-side navigation, where the caller outlives the page.
export function useActiveSection(page?: string) {
  const [marks, setMarks] = useState<SectionMark[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ruler]")
    );

    let frame = 0;
    if (sections.length === 0) {
      frame = requestAnimationFrame(() => {
        setMarks([]);
        setActive(null);
      });
      return () => cancelAnimationFrame(frame);
    }

    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      // short trailing sections never reach the line, so the page end claims the last one
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atEnd) current = sections[sections.length - 1].id;
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    frame = requestAnimationFrame(() => {
      setMarks(
        sections.map((section) => ({
          id: section.id,
          label: section.dataset.ruler ?? section.id,
        }))
      );
      measure();
    });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [page]);

  return { marks, active };
}
