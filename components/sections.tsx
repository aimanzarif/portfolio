import { CloudflareEmailOff } from "@/components/cloudflare-email-off";
import { Shine } from "@/components/animate-ui/primitives/effects/shine";
import { Reveal } from "@/components/reveal";
import {
  AboutHighlights,
  ContactActions,
  EducationGrid,
  ExperienceTimeline,
  SkillsPanel,
  WorkSwitcher,
} from "@/components/sections-client";
import { Container, Section, SectionHeading } from "@/components/site";
import { profile } from "@/lib/profile";

export function About() {
  return (
    <Section id="about">
      <Reveal>
        <SectionHeading eyebrow="About" title="A QA mindset shaped in a live software house." />
      </Reveal>
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{profile.summary}</p>
        </Reveal>
        <AboutHighlights />
      </div>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience">
      <Reveal>
        <SectionHeading eyebrow="Experience" title="One year, six concurrent streams." />
      </Reveal>
      <Reveal>
        <ExperienceTimeline />
      </Reveal>
    </Section>
  );
}

export function Work() {
  return (
    <Section id="work">
      <Reveal>
        <SectionHeading
          eyebrow="Selected work"
          title="Three deliveries, one quality bar."
          copy="Pick a project. Notes stay in view so you can read the testing, APIs, and production detail without scrolling a long list."
        />
      </Reveal>
      <WorkSwitcher />
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills">
      <Reveal>
        <SectionHeading eyebrow="Skills" title="A practical toolkit." />
      </Reveal>
      <SkillsPanel />
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education">
      <Reveal>
        <SectionHeading eyebrow="Education" title="Study, papers, and languages." />
      </Reveal>
      <EducationGrid />
    </Section>
  );
}

export function Contact() {
  return (
    <Section id="contact">
      <Reveal>
        <Shine enableOnHover color="rgba(162, 123, 92, 0.35)" duration={1100}>
          <div className="rounded-[1.5rem] border border-line bg-card/80 px-5 py-10 sm:rounded-[2rem] sm:px-6 sm:py-12 md:px-14 md:py-16">
            <p className="text-xs tracking-[0.22em] text-accent uppercase">Contact</p>
            <h2 className="font-display mt-4 max-w-2xl text-[1.85rem] leading-tight tracking-tight sm:text-4xl md:text-6xl">
              If quality work matters on your team, write to me.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Based in {profile.location}. Open to graduate QA roles with structured testing,
              documentation, and a path into Playwright.
            </p>
            <CloudflareEmailOff>
              <ContactActions />
            </CloudflareEmailOff>
          </div>
        </Shine>
      </Reveal>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-2 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {profile.shortName}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a href={profile.github} target="_blank" rel="noreferrer" className="transition hover:text-foreground">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="transition hover:text-foreground">
            LinkedIn
          </a>
          <p>Johor, Malaysia</p>
        </div>
      </Container>
    </footer>
  );
}
