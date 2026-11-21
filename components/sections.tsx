import Image from "next/image";
import { CloudflareEmailOff } from "@/components/cloudflare-email-off";
import { ExperienceStreams, TicketQueue } from "@/components/sections-client";
import { SplitText, Stamp } from "@/components/motion-bits";
import { Reveal } from "@/components/reveal";
import { RackVent } from "@/components/rack-vent";
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
      <Container className="py-16 md:py-24">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-12">
            <h2 className="font-display text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[0.9] font-extrabold tracking-[-0.04em]">
              <SplitText text={"Things I built\n(or keep alive)."} />
            </h2>
            <p className="max-w-sm text-xl leading-8 font-medium">
              <span className="mb-2 flex items-center gap-2 font-mono text-sm font-bold tracking-wide uppercase">
                <span className="led size-2.5 rounded-full bg-accent" aria-hidden />2 live right now
              </span>
              Click lah, don&apos;t shy. They run on my laptop, and if they go down, confirm I know one.
            </p>
          </div>
        </Reveal>

        <div className="space-y-7">
          {projects.map((project, index) => {
            const style = cardStyles[index % cardStyles.length];
            return (
              <Reveal key={project.id} tilt>
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
                      <div className={cn("group relative aspect-[16/10] overflow-hidden rounded-xl border-2", style.frame)}>
                        <Image
                          src={project.image.src}
                          alt={project.image.alt}
                          fill
                          sizes="(min-width: 1024px) 560px, 100vw"
                          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      </div>
                    ) : (
                      <div className={cn("rounded-xl border-2 border-dashed p-6 font-mono text-sm", style.frame)}>
                        <p className="font-bold">BUG PRIORITY, MY WAY</p>
                        <ol className={cn("mt-4 space-y-2", style.muted)}>
                          <li>1. App rosak → fix now</li>
                          <li>2. App salah → fix next</li>
                          <li>3. App ugly sikit → later lah</li>
                        </ol>
                        <p className={cn("mt-4", style.muted)}>
                          Cosmetic bug also bug. Just need to queue.
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
          <article className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 rounded-[1.25rem] border-2 border-dashed border-band-foreground/50 p-6 sm:p-8">
            <div className="min-w-0 flex-[1_1_18rem]">
              <p className="font-mono text-xs font-bold tracking-wide uppercase opacity-80">Also built · {alsoBuilt.where}</p>
              <h3 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.03em]">{alsoBuilt.name}</h3>
            </div>
            <div className="min-w-0 flex-[2_1_24rem]">
              <p className="text-lg leading-7 opacity-85">{alsoBuilt.story}</p>
              <p className="mt-3 font-mono text-xs tracking-wide uppercase opacity-80">{alsoBuilt.stack.join(" · ")}</p>
            </div>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}

export function HelpDesk() {
  return (
    <Section id="helpdesk">
      <div className="flex flex-wrap items-start gap-12">
        <Reveal className="min-w-0 flex-[1_1_24rem]">
          <SectionHeading
            eyebrow="Day job · ServerFreak"
            title="What lands on my desk."
            copy={currentRole.blurb}
            className="mb-0 md:mb-0"
          />
        </Reveal>
        <Reveal className="min-w-0 flex-[1_1_30rem]">
          <TicketQueue tickets={tickets} />
        </Reveal>
      </div>
    </Section>
  );
}

export function Homelab() {
  return (
    <Section id="homelab">
      <div className="flex flex-wrap items-start gap-12">
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
          <div className="relative rounded-md border-2 border-line bg-card px-[18px] shadow-[inset_0_0_0_6px_var(--background)]">
            <div className="relative">
            <div aria-hidden className="pointer-events-none absolute top-10 bottom-10 left-1 w-px bg-line">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className="packet absolute -left-[3px] size-[7px] rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"
                  style={{ animationDelay: `${n * 1.07}s` }}
                />
              ))}
            </div>
            {homelab.rack.map((unit, unitIndex) => (
              <div
                key={unit.unit}
                className={cn("flex items-center gap-4 border-b border-line", unit.tall ? "py-8" : "py-[18px]")}
              >
                <span
                  className="led relative size-2.5 shrink-0 rounded-full bg-accent"
                  style={{ animationDelay: `${unitIndex * 0.6}s` }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[11px] text-muted-foreground">
                    {unit.unit} · {unit.tag}
                  </div>
                  <div className="text-lg font-semibold">{unit.name}</div>
                </div>
                <div className="text-right font-mono text-[11px] text-muted-foreground">{unit.spec}</div>
              </div>
            ))}
            </div>
            <RackVent />
          </div>
          <StatusPanel statusHref={homelab.statusHref} />
        </Reveal>
      </div>
    </Section>
  );
}

export function Incident() {
  return (
    <Section id="incident">
      <Reveal tilt>
        <article className="rounded-xl border-2 border-foreground bg-card p-6 shadow-[8px_8px_0_var(--accent)] sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <span className="font-bold">INCIDENT REPORT · {incident.id}</span>
            <Stamp className="text-xs">RESOLVED</Stamp>
          </div>
          <h2 className="font-display mt-6 text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] font-extrabold tracking-[-0.04em]">
            <SplitText text={incident.title} />
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
    <Section id="experience">
      <Reveal>
        <SectionHeading title="Where I've been." />
      </Reveal>
      <Reveal>
        <div className="flex flex-wrap gap-x-12 gap-y-4 border-t border-line py-7">
          <p className="font-display text-[2.5rem] leading-none font-extrabold tracking-[-0.03em] text-accent sm:basis-56">
            2026 → now
          </p>
          <div className="min-w-0 flex-[1_1_28rem]">
            <h3 className="text-xl font-semibold">
              {currentRole.role} · {currentRole.company}
            </h3>
            <p className="mt-1 text-muted-foreground">{currentRole.location}</p>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Help desk, hosting and server support.{" "}
              <a href="#helpdesk" className="font-medium text-foreground underline decoration-accent decoration-2 underline-offset-4">
                See what a normal day looks like ↑
              </a>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4 border-y border-line py-7">
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
    <Section id="education">
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
      <Container className="pt-16 pb-10 md:pt-24">
        <Reveal>
          <h2 className="font-display text-[clamp(3.5rem,11vw,10.5rem)] leading-[0.88] font-extrabold tracking-[-0.05em]">
            <SplitText text={"Something\nbroken? Jom."} />
          </h2>
          <p className="mt-8 max-w-xl text-lg">
            Hiring, collab, or just want to borak pasal servers. Email is best. Introvert, but I reply fast one,
            promise.
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
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[15px] font-semibold">
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
        <p className="mt-10 pb-[env(safe-area-inset-bottom)] font-mono text-xs">
          © {new Date().getFullYear()} {profile.shortName} · Served from a laptop in Klang. If down, probably updating lah,
          relax.
        </p>
      </Container>
    </section>
  );
}
