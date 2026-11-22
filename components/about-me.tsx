import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { Container, SectionHeading } from "@/components/site";

/*
 * "More about me": the off-the-clock part of the page (travel list, what's playing, the playlist),
 * set apart from the work sections in its own tinted band with a tear line above it.
 */

const JUMPS = [
  { href: "#travel", path: "travel" },
  { href: "#now-listening", path: "now-listening" },
  { href: "#playlist", path: "playlist" },
];

export function AboutMe({ children }: { children: ReactNode }) {
  return (
    <div id="about" className="relative mt-10 border-t-2 border-dashed border-line bg-accent/[0.05] pb-6 md:mt-16">
      <span
        aria-hidden
        className="absolute -top-[0.8rem] left-1/2 -translate-x-1/2 bg-background px-3 font-mono text-[12px] tracking-widest text-muted-foreground uppercase"
      >
        ✂ off the clock
      </span>
      <Container className="pt-14 md:pt-20">
        <Reveal>
          <SectionHeading
            className="mb-0 md:mb-0"
            eyebrow="Not on the CV"
            title="More about me."
            copy="The work stuff is above. Down here is the rest of me: where I want to go when gaji masuk, what's in my headphones right now, and the slow pop I fix things to at 2am."
          />
          <nav aria-label="More about me" className="mt-6 flex flex-wrap gap-2 font-mono text-[14px]">
            {JUMPS.map((j) => (
              <a key={j.href} href={j.href} className="rounded-full border border-line px-3 py-1.5 text-muted-foreground transition-colors hover:border-accent hover:text-foreground">
                <span className="text-accent">./</span>
                {j.path}
              </a>
            ))}
          </nav>
        </Reveal>
      </Container>
      {children}
    </div>
  );
}
