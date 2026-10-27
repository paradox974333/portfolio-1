import { ContributionSection } from "@/components/site/contribution-graph";
import { ConnectGrid } from "@/components/site/connect-grid";
import { EducationGrid } from "@/components/site/education-grid";
import { ExperienceList } from "@/components/site/experience-list";
import { MarginNote } from "@/components/site/margin-note";
import { NowSection } from "@/components/site/now-section";
import { ScrollRuler } from "@/components/site/scroll-ruler";
import { Section } from "@/components/site/section";
import { StackTable } from "@/components/site/stack-table";
import { StickerDesk } from "@/components/site/sticker-desk";
import { WorkList } from "@/components/site/work-list";
import { WritingList } from "@/components/site/writing-list";
import { DATA } from "@/data/resume";
import { Globe } from "lucide-react";
import Link from "next/link";

const inlineLink =
  "underline decoration-muted-foreground/45 decoration-[1.5px] underline-offset-[5px] transition-colors hover:decoration-signal";

export default function Page() {
  return (
    <main data-bleed>
      <ScrollRuler />

      <section
        id="intro"
        data-ruler="Intro"
        aria-label="Introduction"
        className="relative px-5 pt-1 sm:px-8"
      >
        <MarginNote className="top-24">Drag these around</MarginNote>
        <StickerDesk />
        <p className="mt-5 font-serif text-[1.625rem] italic leading-none">
          Hello, I&apos;m {DATA.name}
        </p>
        <h1 className="mt-3 max-w-[36ch] text-pretty text-[1.375rem] font-semibold leading-snug tracking-tight sm:text-[1.625rem]">
          I write{" "}
          <Link href="#experience" className={inlineLink}>
            real-time C++
          </Link>{" "}
          for surgical navigation and ship{" "}
          <Link href="#work" className={inlineLink}>
            agentic AI
          </Link>{" "}
          to production.
        </h1>
        <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          {DATA.intro}
        </p>
        <a
          href={DATA.locationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Globe aria-hidden className="size-3.5" />
          {DATA.location}
        </a>
      </section>

      <Section id="work" label="Work" note={<MarginNote>Hover a row for a peek</MarginNote>}>
        <WorkList />
      </Section>

      <Section id="experience" label="Experience">
        <ExperienceList />
      </Section>

      <Section id="connect" label="Connect" note={<MarginNote side="left">Say hello</MarginNote>}>
        <ConnectGrid />
      </Section>

      <Section id="stack" label="Stack">
        <StackTable />
      </Section>

      <NowSection />

      <ContributionSection />

      <Section id="writing" label="Writing">
        <WritingList />
      </Section>

      <Section id="education" label="Education">
        <EducationGrid />
      </Section>
    </main>
  );
}
