"use client";

import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Section } from "./section";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type Contributions = { total: number; days: Day[] };

const USERNAME = DATA.url.split("github.com/")[1];
const CELL = 13;
const WEEKS = 53;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const dayLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function layout(days: Day[]) {
  // weeks run Sunday to Saturday, like GitHub's own graph
  const offset = days.length ? new Date(days[0].date).getUTCDay() : 0;
  const cells = days.map((day, i) => ({
    ...day,
    col: Math.floor((i + offset) / 7),
    row: (i + offset) % 7,
  }));
  const months: { col: number; label: string }[] = [];
  for (const cell of cells) {
    const date = new Date(cell.date);
    // no label at either edge, where it would be clipped
    if (date.getUTCDate() <= 7 && cell.row === 0 && cell.col > 0 && cell.col < WEEKS - 2) {
      months.push({ col: cell.col, label: MONTHS[date.getUTCMonth()] });
    }
  }
  const weeks = cells.length ? cells[cells.length - 1].col + 1 : WEEKS;
  return { cells, months, weeks };
}

// Until the data lands, an empty year holds the space.
const PLACEHOLDER = layout(
  Array.from({ length: WEEKS * 7 }, (_, i) => ({
    date: new Date(Date.UTC(2026, 0, 4 + i)).toISOString().slice(0, 10),
    count: 0,
    level: 0 as const,
  }))
);

export function ContributionSection() {
  const [data, setData] = useState<Contributions | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((json) => {
        if (live) setData({ total: json.total.lastYear, days: json.contributions });
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, []);

  const { cells, months, weeks } = data ? layout(data.days) : PLACEHOLDER;
  const width = weeks * CELL;

  return (
    <Section
      id="github"
      label="GitHub"
      title="Commits this year"
      aside={data ? `${data.total.toLocaleString("en-US")} contributions` : undefined}
    >
      <div className="px-5 pb-4 pt-5 sm:px-8">
        {failed ? (
          <p className="text-sm text-muted-foreground">
            The contribution graph didn&apos;t load. The same activity is on{" "}
            <a href={DATA.url} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4">
              GitHub
            </a>
            .
          </p>
        ) : (
          <figure aria-busy={!data} aria-label={data ? `${data.total} GitHub contributions in the last year` : "Loading GitHub contributions"}>
            <div className="relative mb-1.5 h-4 text-[0.6875rem] text-muted-foreground">
              {months.map((month, i) => (
                <span
                  key={`${month.col}-${month.label}`}
                  // phones get every other month so the labels never touch
                  className={cn("absolute", i % 2 === 1 && "hidden sm:inline")}
                  style={{ left: `${(month.col / weeks) * 100}%` }}
                >
                  {month.label}
                </span>
              ))}
            </div>
            <svg
              viewBox={`0 0 ${width} ${7 * CELL}`}
              className={cn("block h-auto w-full", !data && "motion-safe:animate-pulse")}
            >
              {cells.map((cell) => (
                <circle
                  key={cell.date}
                  cx={cell.col * CELL + CELL / 2}
                  cy={cell.row * CELL + CELL / 2}
                  r={4.4}
                  style={{ fill: `var(--heat-${cell.level})` }}
                >
                  {data && (
                    <title>
                      {cell.count === 1 ? "1 contribution" : `${cell.count} contributions`} on{" "}
                      {dayLabel.format(new Date(cell.date))}
                    </title>
                  )}
                </circle>
              ))}
            </svg>
            <figcaption className="mt-3 flex items-center justify-end gap-1.5 text-[0.6875rem] text-muted-foreground">
              Less
              {[0, 1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className="size-2 rounded-full"
                  style={{ background: `var(--heat-${level})` }}
                />
              ))}
              More
            </figcaption>
          </figure>
        )}
      </div>
    </Section>
  );
}
