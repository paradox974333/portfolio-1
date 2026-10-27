/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DATA } from "@/data/resume";
import { ChevronDown } from "lucide-react";

export function ExperienceList() {
  return (
    <Accordion type="single" collapsible>
      {DATA.work.map((work) => (
        <AccordionItem
          key={work.company + work.title}
          value={work.company + work.title}
          className="border-b border-border last:border-b-0"
        >
          <AccordionTrigger className="group min-w-0 gap-3 px-5 py-3.5 text-[0.875rem] hover:bg-panel hover:no-underline focus-visible:bg-panel focus-visible:-outline-offset-2 sm:px-8 sm:text-[0.9375rem] [&>svg]:hidden">
            <span className="flex min-w-0 flex-1 items-center gap-3">
              <img
                src={work.logoUrl}
                alt=""
                className="size-7 flex-none rounded-md bg-white object-contain p-0.5 ring-1 ring-border"
              />
              <span className="flex min-w-0 flex-col gap-x-2 sm:flex-row sm:items-baseline">
                <span className="font-medium text-foreground">{work.company}</span>
                <span className="truncate font-normal text-muted-foreground">
                  {work.title}
                </span>
              </span>
            </span>
            <span className="flex flex-none items-center gap-2 text-xs font-normal tabular-nums text-muted-foreground">
              <span className="hidden sm:inline">
                {work.start} to {work.end}
              </span>
              <ChevronDown
                aria-hidden
                className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-4 sm:px-8">
            <p className="text-xs tabular-nums text-muted-foreground sm:hidden">
              {work.start} to {work.end}, {work.location}
            </p>
            <p className="mt-1 max-w-[62ch] pl-0 leading-relaxed text-muted-foreground sm:mt-0 sm:pl-10">
              <span className="hidden text-foreground/80 sm:inline">{work.location}. </span>
              {work.description}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
