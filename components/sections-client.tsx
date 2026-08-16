"use client";

import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, FileCode, FileText } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { CopyButton } from "@/components/animate-ui/components/buttons/copy";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion";
import { Highlight } from "@/components/animate-ui/primitives/effects/highlight";
import { Magnetic } from "@/components/animate-ui/primitives/effects/magnetic";
import { Shine } from "@/components/animate-ui/primitives/effects/shine";
import { Tilt, TiltContent } from "@/components/animate-ui/primitives/effects/tilt";
import { SlidingNumber } from "@/components/animate-ui/primitives/texts/sliding-number";
import {
  certifications,
  education,
  experience,
  languages,
  profile,
  projects,
  skillGroups,
} from "@/lib/profile";
import { ease } from "@/lib/easing";
import { useFinePointer } from "@/hooks/use-fine-pointer";
import { cn } from "@/lib/utils";

const experienceStreams = [
  { id: "ymbi", title: "YMBI client modules", focus: "Full-stack" },
  { id: "jerai-qa", title: "Jerai Hill mobile QA", focus: "Testing" },
  { id: "docs", title: "Requirements & API specs", focus: "CPRE" },
  { id: "streams", title: "Six concurrent streams", focus: "Delivery" },
  { id: "excel", title: "Excel import pipelines", focus: "Automation" },
] as const;

export function AboutHighlights() {
  const reduced = useReducedMotion();
  const [activeTitle, setActiveTitle] =
    useState<(typeof profile.highlights)[number]["title"]>(profile.highlights[0].title);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {profile.highlights.map((item, index) => {
        const selected = item.title === activeTitle;
        return (
          <motion.button
            key={item.title}
            type="button"
            onClick={() => setActiveTitle(item.title)}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.07, ease }}
            whileHover={reduced ? undefined : { y: -6 }}
            whileTap={{ scale: 0.98 }}
            className="h-full text-left"
          >
            <Shine enableOnHover color="rgba(162, 123, 92, 0.45)" duration={900}>
              <article
                className={cn(
                  "h-full rounded-2xl border bg-card/70 p-5 transition-colors",
                  selected ? "border-accent" : "border-line",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId="about-active"
                    className="mb-3 block h-0.5 w-8 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : (
                  <span className="mb-3 block h-0.5 w-8 rounded-full bg-transparent" />
                )}
                <p className="font-display inline-flex items-baseline text-3xl tracking-tight">
                  {item.prefix}
                  <SlidingNumber number={item.number} inView />
                  {item.suffix}
                </p>
                <h3 className="mt-2 text-sm font-medium">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </article>
            </Shine>
          </motion.button>
        );
      })}
    </div>
  );
}

export function ExperienceTimeline() {
  const reduced = useReducedMotion();

  return (
    <article className="relative pl-6 md:pl-8">
      <motion.span
        aria-hidden
        className="absolute top-2 bottom-2 left-0 w-px origin-top bg-accent/70"
        initial={reduced ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease }}
      />
      <motion.span
        initial={reduced ? false : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        className="absolute top-2.5 -left-1.25 h-2.5 w-2.5 rounded-full bg-accent"
      />
      <p className="text-xs tracking-[0.18em] text-accent uppercase">{experience.period}</p>
      <h3 className="font-display mt-2 text-2xl tracking-tight sm:text-3xl">{experience.role}</h3>
      <p className="mt-1 text-muted-foreground">{experience.company}</p>
      <Accordion type="single" collapsible defaultValue="ymbi" className="mt-8 w-full">
        {experienceStreams.map((stream, index) => (
          <AccordionItem key={stream.id} value={stream.id} className="border-line">
            <AccordionTrigger className="py-3.5 hover:no-underline">
              <span className="flex min-w-0 flex-1 items-start gap-3 pr-3 text-left">
                <span className="font-display mt-0.5 shrink-0 text-xs text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 text-sm font-medium sm:text-base">{stream.title}</span>
                <span className="hidden text-xs tracking-wide text-muted-foreground uppercase sm:inline">
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
    </article>
  );
}

export function WorkSwitcher() {
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const [activeId, setActiveId] = useState<(typeof projects)[number]["id"]>(projects[0].id);
  const activeIndex = projects.findIndex((project) => project.id === activeId);
  const active = projects[activeIndex] ?? projects[0];

  const go = (direction: number) => {
    const next = (activeIndex + direction + projects.length) % projects.length;
    setActiveId(projects[next].id);
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  };

  return (
    <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="flex flex-col" onKeyDown={onListKeyDown}>
        {projects.map((project, index) => {
          const selected = project.id === activeId;
          return (
            <motion.button
              key={project.id}
              type="button"
              onClick={() => setActiveId(project.id)}
              onMouseEnter={() => {
                if (finePointer) setActiveId(project.id);
              }}
              whileHover={reduced || !finePointer ? undefined : { x: 6 }}
              className="relative min-h-14 border-t border-line py-4 text-left last:border-b sm:py-5"
            >
              {selected ? (
                <motion.span
                  layoutId="work-line"
                  className="absolute top-0 bottom-0 left-0 w-0.5 bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              ) : null}
              <span className="flex items-baseline justify-between gap-4 pl-4">
                <span className="font-display text-xl tracking-tight sm:text-2xl md:text-3xl">{project.name}</span>
                <span className="text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="mt-1 block pl-4 text-sm text-muted-foreground">{project.kind}</span>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease }}
          className="h-full"
        >
          <div className="relative z-10 h-full rounded-3xl border border-line bg-card/80 p-5 sm:p-6 md:p-8">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <p className="text-[11px] tracking-[0.18em] text-accent uppercase sm:text-xs">{active.period}</p>
              <div className="relative z-20 flex gap-1">
                <button
                  type="button"
                  aria-label="Previous project"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    go(-1);
                  }}
                  className="rounded-full border border-line p-2 text-muted-foreground transition hover:border-accent hover:text-foreground"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next project"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    go(1);
                  }}
                  className="rounded-full border border-line p-2 text-muted-foreground transition hover:border-accent hover:text-foreground"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
            <h3 className="font-display mt-3 text-2xl tracking-tight sm:text-3xl">{active.name}</h3>
            <p className="mt-4 leading-7 text-muted-foreground">{active.summary}</p>
            <Highlight
              hover
              click={false}
              mode="parent"
              containerClassName="mt-5 flex flex-wrap gap-2"
              className="rounded-full bg-primary"
              itemsClassName="rounded-full data-[active=true]:text-primary-foreground"
            >
              {active.stack.map((item) => (
                <span key={item} className="px-3 py-1 text-xs text-muted-foreground">
                  {item}
                </span>
              ))}
            </Highlight>
            {"links" in active && active.links.length > 0 ? (
              <div className="relative z-20 mt-6 flex flex-wrap gap-2">
                {active.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    onPointerDown={(event) => event.stopPropagation()}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-background px-3 text-sm font-medium transition hover:border-accent hover:text-accent"
                  >
                    {link.label === "GitHub" ? (
                      <FileCode className="size-3.5" />
                    ) : (
                      <FileText className="size-3.5" />
                    )}
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
            <ul className="mt-6 space-y-3">
              {active.bullets.map((bullet, index) => (
                <motion.li
                  key={bullet}
                  initial={reduced ? false : { opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05, ease }}
                  className="text-sm leading-6 text-muted-foreground"
                >
                  {bullet}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SkillChips({ items }: { items: readonly string[] }) {
  const reduced = useReducedMotion();

  return (
    <Highlight
      hover
      click={false}
      mode="parent"
      containerClassName="mt-3 flex flex-wrap gap-2"
      className="rounded-full bg-primary"
      itemsClassName="rounded-full data-[active=true]:text-primary-foreground"
    >
      {items.map((item, index) => (
        <motion.span
          key={item}
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: index * 0.03, ease }}
          className="inline-block px-3 py-1.5 text-sm"
        >
          {item}
        </motion.span>
      ))}
    </Highlight>
  );
}

export function SkillsPanel() {
  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-6 flex h-auto w-full max-w-full flex-nowrap justify-start gap-1 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] sm:mb-8 sm:flex-wrap [&::-webkit-scrollbar]:hidden">
        <TabsTrigger value="all" className="shrink-0 px-3">
          All
        </TabsTrigger>
        {skillGroups.map((group) => (
          <TabsTrigger key={group.id} value={group.id} className="shrink-0 px-3">
            {group.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContents>
        <TabsContent value="all">
          <div className="grid gap-8 md:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.id}>
                <h3 className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                  {group.label}
                </h3>
                <SkillChips items={group.items} />
              </div>
            ))}
          </div>
        </TabsContent>
        {skillGroups.map((group) => (
          <TabsContent key={group.id} value={group.id}>
            <h3 className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              {group.label}
            </h3>
            <SkillChips items={group.items} />
          </TabsContent>
        ))}
      </TabsContents>
    </Tabs>
  );
}

export function EducationGrid() {
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-2">
      {education.map((item, index) => (
        <motion.div
          key={item.credential}
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.08, ease }}
          className="h-full"
        >
          <Tilt maxTilt={reduced || !finePointer ? 0 : 6} className="h-full">
            <TiltContent className="h-full">
              <Shine enableOnHover color="rgba(162, 123, 92, 0.4)" duration={900}>
                <article className="h-full rounded-3xl border border-line bg-card/70 p-6">
                  <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{item.year}</p>
                  <h3 className="font-display mt-3 text-xl tracking-tight sm:text-2xl">{item.school}</h3>
                  <p className="mt-2 text-sm leading-7 sm:text-base">{item.credential}</p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    <div>
                      <p className="text-xs tracking-wide text-muted-foreground uppercase">CGPA</p>
                      <p className="font-display mt-1 inline-flex items-baseline text-3xl tracking-tight">
                        <SlidingNumber number={item.cgpa} decimalPlaces={2} inView />
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dean&apos;s List · {item.deansList} semesters
                    </p>
                  </div>
                </article>
              </Shine>
            </TiltContent>
          </Tilt>
        </motion.div>
      ))}
      <Accordion type="single" collapsible defaultValue="cpre" className="h-full rounded-3xl border border-line bg-card/70 px-6">
        {certifications.map((item, index) => (
          <AccordionItem key={item.name} value={index === 0 ? "cpre" : "microsoft"} className="border-line">
            <AccordionTrigger className="py-3.5 hover:no-underline">
              <span className="min-w-0 pr-3 text-left">
                <span className="block text-xs tracking-[0.16em] text-accent uppercase">{item.year}</span>
                <span className="mt-1 block text-sm font-medium sm:text-base">{item.name}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{item.meta}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <motion.article
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="h-full rounded-3xl border border-line bg-card/70 p-6"
      >
        <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Languages</p>
        <ul className="mt-5 space-y-5">
          {languages.map((item) => (
            <li key={item.name}>
              <div className="mb-2 flex justify-between text-base">
                <span>{item.name}</span>
                <span className="text-muted-foreground">{item.level}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.span
                  className="block h-full origin-left rounded-full bg-accent"
                  initial={reduced ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: item.proficiency / 100 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease }}
                />
              </div>
            </li>
          ))}
        </ul>
      </motion.article>
    </div>
  );
}

export function ContactActions() {
  return (
    <>
      <Magnetic strength={0.18} range={120} className="mt-8 block max-w-full sm:mt-10 sm:inline-block">
        <a
          href={`mailto:${profile.email}`}
          className="font-display block max-w-full text-lg leading-snug tracking-tight break-all underline decoration-line underline-offset-8 transition hover:decoration-foreground sm:text-2xl md:text-4xl"
        >
          {profile.email}
        </a>
      </Magnetic>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button asChild hoverScale={1.04} className="w-full rounded-full sm:w-auto">
          <a href={`mailto:${profile.email}`}>Email me</a>
        </Button>
        <Button variant="outline" asChild hoverScale={1.03} className="w-full rounded-full sm:w-auto">
          <a href={profile.cvHref} target="_blank" rel="noreferrer">
            {profile.cvLabel}
          </a>
        </Button>
        <Button variant="outline" asChild hoverScale={1.03} className="w-full rounded-full sm:w-auto">
          <a href={profile.phoneHref}>{profile.phone}</a>
        </Button>
        <Button variant="outline" asChild hoverScale={1.03} className="w-full rounded-full sm:w-auto">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </Button>
        <Button variant="outline" asChild hoverScale={1.03} className="w-full rounded-full sm:w-auto">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </Button>
        <CopyButton content={profile.email} variant="outline" aria-label="Copy email" />
      </div>
    </>
  );
}
