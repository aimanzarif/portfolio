"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Stamp } from "@/components/motion-bits";

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

export function TicketQueue({
  tickets,
}: {
  tickets: readonly { title: string; fix: string; channel: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const timer = window.setInterval(() => {
      setCount((n) => {
        if (n >= tickets.length) window.clearInterval(timer);
        return Math.min(n + 1, tickets.length);
      });
    }, 420);
    return () => window.clearInterval(timer);
  }, [inView, reduced, tickets.length]);

  const resolved = reduced ? tickets.length : count;
  const open = tickets.length - resolved;

  return (
    <div ref={ref} className="overflow-hidden rounded-xl border-2 border-line bg-card">
      <div className="flex items-center justify-between border-b-2 border-line px-5 py-3 font-mono text-xs text-muted-foreground">
        <span className="font-bold text-foreground">QUEUE · a normal day</span>
        <span aria-live="polite" className={open === 0 ? "font-bold text-accent" : undefined}>
          {open === 0 ? "0 open. Kopi time!" : `${open} open`}
        </span>
      </div>
      <ul className="divide-y divide-line">
        {tickets.map((ticket, index) => {
          const done = index < resolved;
          return (
            <li
              key={ticket.title}
className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3"
            >
              <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
                #{String(index + 1).padStart(3, "0")}
              </span>
              <div className="min-w-0 flex-1 basis-48">
                <p className="font-medium">&ldquo;{ticket.title}&rdquo;</p>
                <p className="text-sm text-muted-foreground">{ticket.fix}</p>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground uppercase">{ticket.channel}</span>
              <span className="relative inline-grid w-[5.5rem] place-items-center">
                {!done ? (
                  <span className="col-start-1 row-start-1 rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                    OPEN
                  </span>
                ) : null}
                <Stamp on={done} className="col-start-1 row-start-1">
                  RESOLVED
                </Stamp>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
