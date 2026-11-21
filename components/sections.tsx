import { CloudflareEmailOff } from "@/components/cloudflare-email-off";
import { ExperienceStreams } from "@/components/sections-client";
import { Reveal } from "@/components/reveal";
import { Container, Section, SectionHeading } from "@/components/site";
import {
  certifications,
  currentRole,
  education,
  experience,
  homelab,
  languages,
  profile,
  projects,
  skillGroups,
} from "@/lib/profile";
import { cn } from "@/lib/utils";

const cardStyles = [
  {
    card: "bg-background text-foreground shadow-[8px_8px_0_var(--accent)]",
    muted: "text-muted-foreground",
    meta: "text-muted-foreground",
    stack: "text-accent",
    link: "border-accent",
  },
  {
    card: "bg-accent text-accent-foreground shadow-[8px_8px_0_var(--band-foreground)]",
    muted: "text-accent-foreground/85",
    meta: "text-accent-foreground",
    stack: "text-accent-foreground",
    link: "border-accent-foreground",
  },
  {
    card: "border-2 border-band-foreground bg-transparent text-band-foreground shadow-[8px_8px_0_var(--band-foreground)]",
    muted: "text-band-foreground/80",
    meta: "text-band-foreground/80",
    stack: "text-band-foreground",
    link: "border-band-foreground",
  },
] as const;

export function Work() {
  return (
    <section id="work" className="bg-band text-band-foreground">
      <Container className="py-24 md:py-32">
        <Reveal>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-4 md:mb-16">
            <h2 className="font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.9] font-extrabold tracking-[-0.04em]">
              Selected
              <br />
              work.
            </h2>
            <p className="max-w-xs opacity-80">
              Three projects. What I did, what I used, and where you can poke at it yourself.
            </p>
          </div>
        </Reveal>

        <div className="space-y-7">
          {projects.map((project, index) => {
            const style = cardStyles[index % cardStyles.length];
            const links = "links" in project ? project.links : [];
            const isLive = links.some((link) => link.label === "Live demo");
            return (
              <Reveal key={project.id}>
                <article
                  className={cn(
                    "lift-card flex flex-wrap gap-10 rounded-[1.25rem] p-6 sm:p-10",
                    style.card,
                  )}
                >
                  <div className="min-w-0 flex-[1_1_22rem]">
                    <p className={cn("flex items-center gap-2.5 font-mono text-xs", style.meta)}>
                      {isLive ? <span className="led size-2 rounded-full bg-current" aria-hidden /> : null}
                      U{String(index + 1).padStart(2, "0")}
                      {isLive ? " · LIVE" : ""} · {project.period}
                    </p>
                    <h3 className="font-display mt-5 text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[0.98] font-extrabold tracking-[-0.03em]">
                      {project.name}
                    </h3>
                    <p className={cn("mt-4 text-lg leading-7", style.muted)}>{project.summary}</p>
                    <p className={cn("mt-6 font-mono text-xs tracking-wide uppercase", style.stack)}>
                      {project.stack.join(" · ")}
                    </p>
                    {links.length > 0 ? (
                      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 font-semibold">
                        {links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target={link.href.startsWith("http") || link.href.endsWith(".pdf") ? "_blank" : undefined}
                            rel="noreferrer"
                            className={cn("border-b-2 pb-0.5", style.link)}
                          >
                            {link.label} ↗
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <ul className={cn("min-w-0 flex-[1_1_22rem] space-y-3 text-[15px] leading-6", style.muted)}>
                    {project.bullets.slice(0, 3).map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span aria-hidden className="font-mono">—</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function Homelab() {
  return (
    <Section id="homelab">
      <div className="flex flex-wrap items-start gap-16">
        <Reveal className="min-w-0 flex-[1_1_26rem]">
          <SectionHeading
            eyebrow="How this site runs"
            title="A laptop with a rack's habits."
            copy={homelab.intro}
            className="mb-10 md:mb-12"
          />
          <div className="grid gap-7">
            {homelab.notes.map((note) => (
              <div key={note.title} className="border-t border-line pt-4">
                <h3 className="text-base font-semibold">{note.title}</h3>
                <p className="mt-1.5 text-[15px] leading-6 text-muted-foreground">{note.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="min-w-0 max-w-xl flex-[1_1_26rem]">
          <p className="mb-2.5 text-center font-mono text-xs text-muted-foreground">▼ INTERNET</p>
          <div className="rounded-md border-2 border-line bg-card px-[18px] shadow-[inset_0_0_0_6px_var(--background)]">
            {homelab.rack.map((unit) => (
              <div
                key={unit.unit}
                className={cn(
                  "flex items-center gap-4 border-b border-line",
                  unit.tall ? "py-8" : "py-[18px]",
                )}
              >
                <span className="led size-2.5 shrink-0 rounded-full bg-accent" aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[11px] text-muted-foreground">
                    {unit.unit} · {unit.tag}
                  </div>
                  <div className="text-lg font-semibold">{unit.name}</div>
                </div>
                <div className="text-right font-mono text-[11px] text-muted-foreground">
                  {unit.unit === "U01" ? (
                    <a href={homelab.statusHref} target="_blank" rel="noreferrer">
                      {unit.spec} ↗
                    </a>
                  ) : (
                    unit.spec
                  )}
                </div>
              </div>
            ))}
            <div aria-hidden className="vent my-3.5 h-11 opacity-70" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" className="pt-4 md:pt-8">
      <Reveal>
        <SectionHeading title="Where I've been." />
      </Reveal>
      <Reveal>
        <div className="flex flex-wrap gap-x-12 gap-y-4 border-t border-line py-9">
          <p className="font-display text-[2.5rem] leading-none font-extrabold tracking-[-0.03em] text-accent sm:basis-56">
            2026 → now
          </p>
          <div className="min-w-0 flex-[1_1_28rem]">
            <h3 className="text-xl font-semibold">
              {currentRole.role} · {currentRole.company}
            </h3>
            <p className="mt-1 text-muted-foreground">{currentRole.location}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4 border-y border-line py-9">
          <p className="font-display text-[2.5rem] leading-none font-extrabold tracking-[-0.03em] sm:basis-56">
            2025 – 26
          </p>
          <div className="min-w-0 flex-[1_1_28rem]">
            <h3 className="text-xl font-semibold">
              {experience.role} · {experience.company}
            </h3>
            <p className="mt-1 text-muted-foreground">
              {experience.period} · {experience.location}
            </p>
            <ExperienceStreams />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education" className="pt-4 md:pt-8">
      <Reveal>
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="font-mono text-[15px] font-semibold text-accent">EDUCATION</h3>
            <ul className="mt-4 space-y-4 text-[15px] leading-6">
              {education.map((item) => (
                <li key={item.credential}>
                  <p className="font-medium">{item.credential}</p>
                  <p className="text-muted-foreground">
                    {item.school}, {item.year}. {item.meta}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[15px] font-semibold text-accent">CERTIFICATIONS</h3>
            <ul className="mt-4 space-y-4 text-[15px] leading-6">
              {certifications.map((item) => (
                <li key={item.name}>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground">
                    {item.year} · {item.meta}
                  </p>
                </li>
              ))}
            </ul>
            <h3 className="mt-10 font-mono text-[15px] font-semibold text-accent">LANGUAGES</h3>
            <p className="mt-4 text-[15px] text-muted-foreground">
              {languages.map((item) => `${item.name} (${item.level})`).join(" · ")}
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[15px] font-semibold text-accent">TOOLBOX</h3>
            <dl className="mt-4 space-y-4 text-[15px] leading-6">
              {skillGroups.map((group) => (
                <div key={group.id}>
                  <dt className="font-medium">{group.label}</dt>
                  <dd className="text-muted-foreground">{group.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="bg-accent text-accent-foreground">
      <Container className="pt-24 pb-12 md:pt-32">
        <Reveal>
          <h2 className="font-display text-[clamp(3.5rem,11vw,10.5rem)] leading-[0.88] font-extrabold tracking-[-0.05em]">
            Something
            <br />
            keep breaking?
          </h2>
          <CloudflareEmailOff>
            <a
              href={`mailto:${profile.email}`}
              className="font-display mt-10 inline-block border-b-4 border-accent-foreground text-[clamp(1.75rem,4vw,3.5rem)] font-bold tracking-[-0.03em] break-all"
            >
              {profile.email} →
            </a>
          </CloudflareEmailOff>
        </Reveal>
        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 text-[15px] font-semibold">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={profile.cvHref} target="_blank" rel="noreferrer">
            CV (PDF) ↗
          </a>
          <a href={profile.phoneHref}>{profile.phone}</a>
        </div>
        <p className="mt-14 font-mono text-xs pb-[env(safe-area-inset-bottom)]">
          © {new Date().getFullYear()} {profile.shortName} · Served from a laptop in Klang
        </p>
      </Container>
    </section>
  );
}
