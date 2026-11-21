"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion";
import { experience } from "@/lib/profile";

const experienceStreams = [
  { id: "ymbi", title: "YMBI client modules", focus: "Full-stack" },
  { id: "jerai-qa", title: "Jerai Hill mobile QA", focus: "Testing" },
  { id: "docs", title: "Requirements & API specs", focus: "CPRE" },
  { id: "streams", title: "Six concurrent streams", focus: "Delivery" },
  { id: "excel", title: "Excel import pipelines", focus: "Automation" },
] as const;

export function ExperienceStreams() {
  return (
    <Accordion type="single" collapsible defaultValue="ymbi" className="mt-8 w-full">
      {experienceStreams.map((stream, index) => (
        <AccordionItem key={stream.id} value={stream.id} className="border-line">
          <AccordionTrigger className="py-3.5 hover:no-underline">
            <span className="flex min-w-0 flex-1 items-start gap-3 pr-3 text-left">
              <span className="mt-0.5 shrink-0 font-mono text-xs text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 text-sm font-medium sm:text-base">{stream.title}</span>
              <span className="hidden font-mono text-xs tracking-wide text-muted-foreground uppercase sm:inline">
                {stream.focus}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-base leading-7 text-muted-foreground">
            {experience.bullets[index]}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
