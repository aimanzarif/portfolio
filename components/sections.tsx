import Image from "next/image";
import { CloudflareEmailOff } from "@/components/cloudflare-email-off";
import { ExperienceStreams } from "@/components/sections-client";
import { Reveal } from "@/components/reveal";
import { StatusPanel } from "@/components/status-panel";
import { Container, Section, SectionHeading } from "@/components/site";
import {
  alsoBuilt,
  certifications,
  currentRole,
  education,
  experience,
  homelab,
  incident,
  languages,
  profile,
  projects,
  skillGroups,
  tickets,
} from "@/lib/profile";
import { cn } from "@/lib/utils";

const cardStyles = [
  {
    card: "bg-background text-foreground shadow-[8px_8px_0_var(--accent)]",
    muted: "text-muted-foreground",
    accent: "text-accent",
    link: "border-accent",
    frame: "border-line",
  },
  {
    card: "bg-accent text-accent-foreground shadow-[8px_8px_0_var(--band-foreground)]",
    muted: "text-accent-foreground/85",
    accent: "text-accent-foreground",
    link: "border-accent-foreground",
    frame: "border-accent-foreground/40",
  },
  {
    card: "border-2 border-band-foreground bg-transparent text-band-foreground shadow-[8px_8px_0_var(--band-foreground)]",
    muted: "text-band-foreground/80",
    accent: "text-band-foreground",
    link: "border-band-foreground",
    frame: "border-band-foreground/40",
  },
] as const;

export function Work() {
  return (
    <section id="work" className="bg-band text-band-foreground">
      <Container className="py-24 md:py-32">
        <Reveal>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-4 md:mb-16">
            <h2 className="font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.9] font-extrabold tracking-[-0.04em]">
              Things I
              <br />
              built (or keep alive).
            </h2>
            <p className="max-w-xs opacity-80">
              Two are live on my laptop right now. Go on, click them. I&apos;ll know if it goes down.
            </p>
          </div>
        </Reveal>

        <div className="space-y-7">
          {projects.map((project, index) => {
            const style = cardStyles[index % cardStyles.length];
            return (
              <Reveal key={project.id}>
                <article className={cn("lift-card flex flex-wrap gap-10 rounded-[1.25rem] p-6 sm:p-10", style.card)}>
                  <div className="min-w-0 flex-[1_1_22rem]">
                    <p className={cn("flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs", style.muted)}>
                      {project.live ? <span className="led size-2 rounded-full bg-current" aria-hidden /> : null}
                      <span>U{String(index + 1).padStart(2, "0")}</span>
                      {project.live ? <span>· LIVE</span> : null}
                      <span>· {project.period}</span>
                      <span className={cn("rounded-full border px-2 py-0.5 font-bold", style.frame)}>
                        {project.role.toUpperCase()}
                      </span>
                    </p>
                    <h3 className="font-display mt-5 text-[clamp(2.5rem,5vw,3.75rem)] leading-[0.95] font-extrabold tracking-[-0.03em]">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-lg font-semibold">{project.tagline}</p>
                    <p className={cn("mt-4 text-[17px] leading-7", style.muted)}>{project.story}</p>
                    <p className={cn("mt-6 font-mono text-xs tracking-wide uppercase", style.accent)}>
                      {project.stack.join(" · ")}
                    </p>
                    {project.links.length > 0 ? (
                      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 font-semibold">
                        {project.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className={cn("border-b-2 pb-0.5", style.link)}
                          >
                            {link.label} ↗
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-[1_1_22rem]">
                    {project.image ? (
                      <div className={cn("relative aspect-[16/10] overflow-hidden rounded-xl border-2", style.frame)}>
                        <Image
                          src={project.image.src}
                          alt={project.image.alt}
                          fill
                          sizes="(min-width: 1024px) 560px, 100vw"
                          className="object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div className={cn("rounded-xl border-2 border-dashed p-6 font-mono text-sm", style.frame)}>
                        <p className="font-bold">BUG PRIORITY, MY WAY</p>
                        <ol className={cn("mt-4 space-y-2", style.muted)}>
                          <li>1. The app is broken → fix now</li>
                          <li>2. The app is wrong → fix next</li>
                          <li>3. The app is a bit ugly → fix later</li>
                        </ol>
                        <p className={cn("mt-4", style.muted)}>
                          Cosmetic bugs are real bugs. They just wait their turn.
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <p className="mt-12 max-w-3xl opacity-80">{alsoBuilt}</p>
        </Reveal>
      </Container>
    </section>
  );
}

export function HelpDesk() {
  return (
    <Section id="helpdesk">
      <div className="flex flex-wrap items-start gap-16">
        <Reveal className="min-w-0 flex-[1_1_24rem]">
          <SectionHeading
            eyebrow="Day job · ServerFreak"
            title="What lands on my desk."
            copy={currentRole.blurb}
            className="mb-0 md:mb-0"
          />
        </Reveal>
        <Reveal className="min-w-0 flex-[1_1_30rem]">
          <div className="overflow-hidden rounded-xl border-2 border-line bg-card">
            <div className="flex items-center justify-between border-b-2 border-line px-5 py-3 font-mono text-xs text-muted-foreground">
              <span className="font-bold text-foreground">QUEUE · a normal day</span>
              <span>{tickets.length} open → 0 open</span>
            </div>
            <ul className="divide-y divide-line">
              {tickets.map((ticket, index) => (
                <li key={ticket.title} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5">
                  <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
                    #{String(index + 1).padStart(3, "0")}
                  </span>
                  <div className="min-w-0 flex-1 basis-48">
                    <p className="font-medium">&ldquo;{ticket.title}&rdquo;</p>
                    <p className="text-sm text-muted-foreground">{ticket.fix}</p>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground uppercase">{ticket.channel}</span>
                  <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[11px] font-bold text-accent-foreground">
                    RESOLVED
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export function Homelab() {
  return (
    <Section id="homelab" className="pt-4 md:pt-8">
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
                className={cn("flex items-center gap-4 border-b border-line", unit.tall ? "py-8" : "py-[18px]")}
              >
                <span className="led size-2.5 shrink-0 rounded-full bg-accent" aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[11px] text-muted-foreground">
                    {unit.unit} · {unit.tag}
                  </div>
                  <div className="text-lg font-semibold">{unit.name}</div>
                </div>
                <div className="text-right font-mono text-[11px] text-muted-foreground">{unit.spec}</div>
              </div>
            ))}
            <div aria-hidden className="vent my-3.5 h-11 opacity-70" />
          </div>
          <StatusPanel statusHref={homelab.statusHref} />
        </Reveal>
      </div>
    </Section>
  );
}

export function Incident() {
  return (
    <Section id="incident" className="pt-4 md:pt-8">
      <Reveal>
        <article className="rounded-xl border-2 border-foreground bg-card p-6 shadow-[8px_8px_0_var(--accent)] sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <span className="font-bold">INCIDENT REPORT · {incident.id}</span>
            <span className="rounded-full bg-accent px-2.5 py-0.5 font-bold text-accent-foreground">RESOLVED</span>
          </div>
          <h2 className="font-display mt-6 text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] font-extrabold tracking-[-0.04em]">
            {incident.title}
          </h2>
          <dl className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {incident.rows.map((row) => (
              <div key={row.label} className="border-t border-line pt-3">
                <dt className="font-mono text-xs text-muted-foreground uppercase">{row.label}</dt>
                <dd className="mt-1 text-lg">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 font-mono text-sm text-muted-foreground">{incident.status}</p>
        </article>
      </Reveal>
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
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Help desk, hosting and server support. See the queue above.
            </p>
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
            <p className="mt-1 text-muted-foreground">{experience.period}</p>
            <p className="mt-3 max-w-2xl text-muted-foreground">{experience.blurb}</p>
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
            broken? Jom.
          </h2>
          <p className="mt-8 max-w-xl text-lg">
            Hiring, collaborating, or just want to talk servers. Email works best. Introvert, but a very responsive
            one.
          </p>
          <CloudflareEmailOff>
            <a
              href={`mailto:${profile.email}`}
              className="font-display mt-8 inline-block border-b-4 border-accent-foreground text-[clamp(1.75rem,4vw,3.5rem)] font-bold tracking-[-0.03em] break-all"
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
        <p className="mt-14 pb-[env(safe-area-inset-bottom)] font-mono text-xs">
          © {new Date().getFullYear()} {profile.shortName} · Served from a laptop in Klang. If it&apos;s down, it&apos;s
          probably updating.
        </p>
      </Container>
    </section>
  );
}
