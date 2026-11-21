import Link from "next/link";
import { Container } from "@/components/site";
import { Terminal } from "@/components/terminal";
import { profile, ticker } from "@/lib/profile";

export function Hero() {
  return (
    <section id="top" className="relative">
      <Container className="flex flex-wrap items-center gap-14 pt-28 pb-10 md:pt-36 md:pb-14">
        <div className="min-w-0 flex-[999_1_38rem]">
          {/* Hero motion is pure CSS so the text paints before JavaScript loads (faster LCP on phones). */}
          <div>
            <p className="css-fade-up font-mono text-[13px] tracking-[0.06em] text-muted-foreground uppercase">
              {profile.firstName} · {profile.title} · {profile.location}
            </p>
            <h1 className="font-display mt-7 text-[clamp(3.5rem,10vw,9.5rem)] leading-[0.9] font-extrabold tracking-[-0.045em]">
              <span className="block">
                {["I", "keep", "things"].map((word, i) => (
                  <span key={word} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <span className="css-rise inline-block" style={{ animationDelay: `${i * 70}ms` }}>
                      {word}
                      {i < 2 ? "\u00A0" : null}
                    </span>
                  </span>
                ))}
              </span>
              <span className="css-wipe inline-block bg-accent px-[0.12em] text-accent-foreground">running.</span>
            </h1>
            <p className="css-fade-up mt-10 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl md:leading-9">
              {profile.intro}
            </p>
            <div className="css-fade-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href="#work"
                className="inline-flex min-h-12 items-center rounded-full bg-foreground px-7 font-semibold text-background transition hover:opacity-90"
              >
                See what I&apos;ve built
              </a>
              <a
                href={profile.cvHref}
                target="_blank"
                rel="noreferrer"
                className="border-b-2 border-accent pb-0.5 font-medium"
              >
                {profile.cvLabel} (PDF)
              </a>
              <Link href="/resume" className="font-mono text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
                recruiter? plain version →
              </Link>
            </div>
          </div>
        </div>

        <Terminal />
      </Container>

      <Ticker />
    </section>
  );
}

function Ticker() {
  const items = [...ticker, ...ticker];
  return (
    <div className="overflow-hidden py-5" aria-hidden>
      <div className="-mx-10 -rotate-[1.5deg] overflow-hidden bg-accent py-4 text-accent-foreground">
        <div className="marquee-track flex w-max gap-7 font-mono text-base font-bold tracking-[0.06em] whitespace-nowrap uppercase">
          {[...items, ...items].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-7">
              {item}
              <span>●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
