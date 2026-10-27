/* eslint-disable @next/next/no-img-element */
"use client";

import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const CITY = DATA.location.split(",")[0];

// Reads the clock where Manoj is, not where the visitor is.
function useHomeClock() {
  const [clock, setClock] = useState<{ time: string; hour: number } | null>(null);
  useEffect(() => {
    const time = new Intl.DateTimeFormat("en-IN", {
      timeZone: DATA.timezone,
      hour: "numeric",
      minute: "2-digit",
    });
    const hour = new Intl.DateTimeFormat("en-US", {
      timeZone: DATA.timezone,
      hour: "numeric",
      hourCycle: "h23",
    });
    const tick = () => {
      const now = new Date();
      setClock({ time: time.format(now), hour: Number(hour.format(now)) });
    };
    const frame = requestAnimationFrame(tick);
    const timer = setInterval(tick, 30_000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, []);
  return clock;
}

export function SiteFooter() {
  const clock = useHomeClock();
  const awake = clock ? clock.hour >= 9 && clock.hour < 23 : null;

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-border">
      <div className="relative z-10 flex flex-col items-center px-6 pt-14 text-center">
        <blockquote className="max-w-md text-balance font-serif text-[1.75rem] italic leading-[1.15] sm:text-[2.125rem]">
          {DATA.quote.text}
        </blockquote>
        <p className="mt-3 text-xs text-muted-foreground">{DATA.quote.author}</p>

        <a
          href={`mailto:${DATA.contact.email}`}
          className="mt-9 inline-flex items-center gap-2.5 rounded-full border border-border bg-panel py-1.5 pl-1.5 pr-4 text-left transition-colors hover:border-muted-foreground/40"
        >
          <span className="relative flex-none">
            <img src={DATA.avatarUrl} alt="" className="size-8 rounded-full object-cover" />
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-panel",
                awake === null ? "bg-muted-foreground" : awake ? "bg-[#28c840]" : "bg-flag"
              )}
            />
          </span>
          <span className="flex flex-col">
            <span className="text-[0.8125rem] font-medium leading-tight text-foreground">
              {awake === false ? "Away from the keyboard" : "Probably at the keyboard"}
            </span>
            <span className="text-xs leading-tight text-muted-foreground" suppressHydrationWarning>
              {clock ? `${clock.time} in ${CITY}. Email me.` : `Email me from ${CITY}.`}
            </span>
          </span>
        </a>

        <p className="mt-6 text-xs text-muted-foreground">
          Built in {CITY} on filter coffee
        </p>
      </div>

      <div className="relative -mt-4 h-44 sm:h-52">
        <FlickeringGrid
          className="absolute inset-0"
          squareSize={3}
          gridGap={5}
          flickerChance={0.2}
          maxOpacity={0.45}
          color="#4c8dff"
          style={{
            maskImage: "linear-gradient(to top, black 15%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(to top, black 15%, transparent 95%)",
          }}
        />
      </div>
    </footer>
  );
}
