"use client";

import { DATA } from "@/data/resume";
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
  const [greeting, setGreeting] = useState("Hello!");

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setGreeting(greetingFor(new Date().getHours()))
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Section id="now" label="Now" title={greeting} serif>
      <ul className="space-y-4 px-5 py-6 sm:px-8">
        {DATA.now.map((item) => (
          <li key={item.lead} className="relative pl-5 leading-relaxed text-muted-foreground">
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
