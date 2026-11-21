import { Container } from "@/components/site";
import { Reveal } from "@/components/reveal";
import { profile, ticker } from "@/lib/profile";

const terminal = [
  { cmd: "whoami", out: "zarif, IT support, ex-QA" },
  { cmd: "cat /etc/os-release | head -1", out: "Red Hat Enterprise Linux 10" },
  { cmd: "docker ps --format names", out: "portfolio · ikango · smartroute" },
  { cmd: "curl -sI zarep.my | head -1", out: "HTTP/2 200" },
] as const;

export function Hero() {
  return (
    <section id="top" className="relative">
      <Container className="flex flex-wrap items-center gap-14 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="min-w-0 flex-[999_1_38rem]">
          <Reveal>
            <p className="font-mono text-[13px] tracking-[0.06em] text-muted-foreground uppercase">
              {profile.shortName} · {profile.title} · {profile.location}
            </p>
            <h1 className="font-display mt-7 text-[clamp(3.5rem,10vw,9.5rem)] leading-[0.9] font-extrabold tracking-[-0.045em]">
              I keep things{" "}
              <span className="inline-block -rotate-[1.5deg] bg-accent px-[0.12em] text-accent-foreground">
                running.
              </span>
            </h1>
            <p className="mt-10 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl md:leading-9">
              {profile.intro}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href="#work"
                className="inline-flex min-h-12 items-center rounded-full bg-foreground px-7 font-semibold text-background transition hover:opacity-90"
              >
                See the work
              </a>
              <a
                href={profile.cvHref}
                target="_blank"
                rel="noreferrer"
                className="border-b-2 border-accent pb-0.5 font-medium"
              >
                {profile.cvLabel} (PDF)
              </a>
            </div>
          </Reveal>
        </div>

        <aside
          aria-label="Terminal"
          className="min-w-0 max-w-lg flex-[1_1_20rem] overflow-hidden rounded-xl border border-line bg-card"
        >
          <div className="flex items-center gap-2 border-b border-line px-4 py-3 font-mono text-xs text-muted-foreground">
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="ml-2">zarep@voyager: ~</span>
          </div>
          <div className="space-y-2 p-5 pb-6 font-mono text-[13px] leading-6">
            {terminal.map((line) => (
              <div key={line.cmd}>
                <div>
                  <span className="text-accent">$</span> {line.cmd}
                </div>
                <div className="text-muted-foreground">{line.out}</div>
              </div>
            ))}
            <div>
              <span className="text-accent">$</span>{" "}
              <span className="led inline-block h-4 w-2 bg-accent align-middle" aria-hidden />
            </div>
          </div>
        </aside>
      </Container>

      <Ticker />
    </section>
  );
}

function Ticker() {
  const items = [...ticker, ...ticker];
  return (
    <div className="overflow-hidden py-7" aria-hidden>
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
