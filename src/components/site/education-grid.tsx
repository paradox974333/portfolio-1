/* eslint-disable @next/next/no-img-element */
import { DATA } from "@/data/resume";

// a focused link lights up its whole cell, not just its words
const cell =
  "relative flex items-start gap-3 bg-background px-5 py-3.5 sm:px-8 has-[a:focus-visible]:bg-panel";

export function EducationGrid() {
  return (
    <div className="grid gap-px border-b border-border bg-border sm:grid-cols-2">
      {DATA.education.map((school) => (
        <div key={school.school} className={`${cell} transition-colors hover:bg-panel`}>
          <img
            src={school.logoUrl}
            alt=""
            className="mt-0.5 size-7 flex-none rounded-md bg-white object-contain p-0.5 ring-1 ring-border"
          />
          <div className="min-w-0">
            <a
              href={school.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-signal"
            >
              {school.school}
            </a>
            <p className="text-sm text-muted-foreground">{school.degree}</p>
            <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
              {school.start} to {school.end}
            </p>
          </div>
        </div>
      ))}
      {DATA.hackathons.map((hackathon) => (
        <div key={hackathon.title} className={`${cell} sm:col-span-2`}>
          <img
            src={hackathon.image}
            alt=""
            className="mt-0.5 size-7 flex-none rounded-md bg-white object-contain p-0.5 ring-1 ring-border"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              {hackathon.title}
              <span className="mt-0.5 block text-xs font-normal tabular-nums text-muted-foreground sm:ml-2 sm:mt-0 sm:inline">
                {hackathon.dates}
              </span>
            </p>
            <p className="mt-0.5 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
              {hackathon.description}
            </p>
            <div className="mt-2 flex gap-3">
              {hackathon.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {link.icon}
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
