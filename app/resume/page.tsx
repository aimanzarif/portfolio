import type { Metadata } from "next";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { PrintButton } from "@/components/print-button";
import { PhoneReveal } from "@/components/phone-reveal";
import {
  certifications,
  currentRole,
  education,
  experience,
  languages,
  profile,
  resume,
  skillGroups,
} from "@/lib/profile";

export const metadata: Metadata = {
  title: `${profile.shortName} — Résumé`,
  description: `${profile.shortName}: IT Support in Klang, Malaysia. Experience, projects, skills and education.`,
  alternates: { canonical: "/resume" },
};

function Heading({ children }: { children: string }) {
  return (
    <h2 className="mb-4 border-b border-line pb-2 font-mono text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">
      {children}
    </h2>
  );
}

export default function ResumePage() {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line print:hidden">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-8">
          <Link href="/" className="font-mono text-[15px] font-bold">
            zarep.my <span className="text-accent">~/resume$</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <ModeToggle mode="hr" className="flex" />
            <PrintButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16 print:p-0">
        <section aria-labelledby="name">
          <h1 id="name" className="font-display text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-2 text-xl">IT Support · QA · Self-hosting</p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[15px] text-muted-foreground">
            <li>{profile.location}</li>
            <li>
              <a href={`mailto:${profile.email}`} className="underline underline-offset-4">
                {profile.email}
              </a>
            </li>
            <li>
              <PhoneReveal label="show phone number" className="underline underline-offset-4" />
            </li>
            <li>
              <a href={profile.linkedin} className="underline underline-offset-4">
                {profile.linkedinLabel}
              </a>
            </li>
            <li>
              <a href={profile.github} className="underline underline-offset-4">
                {profile.githubLabel}
              </a>
            </li>
          </ul>
          <p className="mt-6 max-w-3xl text-[17px] leading-7">{resume.summary}</p>
          <p className="mt-4 print:hidden">
            <a
              href={profile.cvHref}
              target="_blank"
              rel="noreferrer"
              className="border-b-2 border-accent pb-0.5 font-medium"
            >
              Download the PDF CV
            </a>
          </p>
        </section>

        <section className="mt-12" aria-label="Experience">
          <Heading>Experience</Heading>
          <article className="break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-lg font-semibold">
                {currentRole.role} · {currentRole.company}
              </h3>
              <p className="font-mono text-sm text-muted-foreground">{currentRole.period}</p>
            </div>
            <p className="text-muted-foreground">{currentRole.location}</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-6">
              {resume.serverfreak.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
          <article className="mt-8 break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-lg font-semibold">
                {experience.role} · {experience.company}
              </h3>
              <p className="font-mono text-sm text-muted-foreground">{experience.period}</p>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-6">
              {experience.bullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-12" aria-label="Projects">
          <Heading>Projects</Heading>
          <div className="grid gap-6 md:grid-cols-2">
            {resume.projects.map((project) => (
              <article key={project.name} className="break-inside-avoid">
                <h3 className="font-semibold">
                  {"href" in project ? (
                    <a href={project.href} className="underline decoration-accent decoration-2 underline-offset-4">
                      {project.name}
                    </a>
                  ) : (
                    project.name
                  )}
                </h3>
                <p className="font-mono text-xs text-muted-foreground">{project.meta}</p>
                <p className="mt-2 text-[15px] leading-6">{project.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-label="Skills">
          <Heading>Skills</Heading>
          <dl className="grid gap-x-8 gap-y-3 text-[15px] md:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.id}>
                <dt className="font-semibold">{group.label}</dt>
                <dd className="text-muted-foreground">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 grid gap-10 md:grid-cols-2" aria-label="Education and certifications">
          <div>
            <Heading>Education</Heading>
            <ul className="space-y-4 text-[15px]">
              {education.map((item) => (
                <li key={item.credential}>
                  <p className="font-semibold">{item.credential}</p>
                  <p className="text-muted-foreground">
                    {item.school}, {item.year} · {item.meta}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Heading>Certifications</Heading>
            <ul className="space-y-4 text-[15px]">
              {certifications.map((item) => (
                <li key={item.name}>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-muted-foreground">
                    {item.year} · {item.meta}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Heading>Languages</Heading>
              <p className="text-[15px]">{languages.map((item) => `${item.name} (${item.level})`).join(" · ")}</p>
            </div>
          </div>
        </section>

        <p className="mt-16 font-mono text-xs text-muted-foreground print:hidden">
          Prefer the fun version?{" "}
          <Link href="/" className="text-foreground underline underline-offset-4">
            Back to zarep.my
          </Link>
        </p>
      </main>
    </div>
  );
}
