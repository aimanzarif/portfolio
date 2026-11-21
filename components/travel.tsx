import { Reveal } from "@/components/reveal";
import { Section, SectionHeading } from "@/components/site";
import { TravelGate, TravelStamp } from "@/components/travel-stamp";

/* "When gaji masuk": the travel list, as pixel-art boarding passes. */

type Trip = {
  code: string;
  city: string;
  country: string;
  note: string;
  flight: string;
  icon: readonly string[];
  colors: Record<string, string>;
};

const TRIPS: Trip[] = [
  {
    code: "NRT",
    city: "Tokyo",
    country: "Japan",
    note: "Mt Fuji, from the window seat.",
    flight: "ZRF 001",
    icon: [
      "........RR..",
      ".......RRRR.",
      ".....W.RRRR.",
      "....WWW.RR..",
      "...WWMWW....",
      "..MMMMMMM...",
      ".MMMMMMMMM..",
      "MMMMMMMMMMMM",
    ],
    colors: { R: "#ff8b80", W: "#f7f3ea", M: "#5b6b7a" },
  },
  {
    code: "IST",
    city: "Istanbul",
    country: "Turkey",
    note: "Hot air balloons over Cappadocia.",
    flight: "ZRF 002",
    icon: [
      "...RRRRRR...",
      "..RRYRRYRR..",
      "..RRYRRYRR..",
      "...RYRRYR...",
      "....RRRR....",
      ".....ss.....",
      ".....ss.....",
      "....BBBB....",
    ],
    colors: { R: "#e9b23a", Y: "#ff8b80", s: "#9aa09a", B: "#7a4b2a" },
  },
  {
    code: "AKL",
    city: "Auckland",
    country: "New Zealand",
    note: "Mountains, lakes, and kiwis (the birds).",
    flight: "ZRF 003",
    icon: [
      "............",
      "...KKKKK....",
      "..KKKKKKKE..",
      "..KKKKKKKKbb",
      "..KKKKKKKK..",
      "...KKKKKK...",
      "....y..y....",
      "...yy.yy....",
    ],
    colors: { K: "#8a6a4a", E: "#1c1f20", b: "#d8c9a8", y: "#d8c9a8" },
  },
];

function PixelIcon({ rows, colors, label }: { rows: readonly string[]; colors: Record<string, string>; label: string }) {
  return (
    <svg viewBox={`0 0 ${rows[0].length} ${rows.length}`} className="h-auto w-16" shapeRendering="crispEdges" role="img" aria-label={label}>
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          colors[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={colors[ch]} /> : null,
        ),
      )}
    </svg>
  );
}

function Barcode({ seed }: { seed: string }) {
  // deterministic bars from the flight code
  const widths = [...seed.repeat(2)].map((c) => 1 + (c.charCodeAt(0) % 3));
  return (
    <span aria-hidden className="flex h-8 w-20 items-stretch justify-center gap-[2px] overflow-hidden">
      {widths.map((w, i) => (
        <span key={i} className="bg-foreground" style={{ width: w }} />
      ))}
    </span>
  );
}

export function Travel() {
  return (
    <Section id="travel">
      <Reveal>
        <SectionHeading
          eyebrow="Travel list · pending funding"
          title="When gaji masuk."
          copy="I'd travel more if my bank account agreed. These three are first in line."
        />
      </Reveal>
      <div className="grid gap-6 lg:grid-cols-3">
        {TRIPS.map((trip, i) => (
          <Reveal key={trip.code} delay={i * 90} tilt className="h-full">
            <article className="relative flex h-full overflow-hidden rounded-xl border-2 border-line bg-card">
              {/* main ticket */}
              <div className="min-w-0 flex-1 p-5">
                <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                  Boarding pass · {trip.flight}
                </p>
                <div className="mt-4 flex items-center gap-3 font-mono">
                  <div>
                    <p className="text-3xl font-bold">KUL</p>
                    <p className="text-[11px] text-muted-foreground">Kuala Lumpur</p>
                  </div>
                  <span aria-hidden className="min-w-10 flex-1 border-t-2 border-dashed border-line text-center text-accent">
                    <svg viewBox="0 0 9 5" className="relative -top-[7px] mx-auto h-[14px] w-6 bg-card px-0.5" shapeRendering="crispEdges">
                      <path d="M0 0h1v1h2V0h2v1h1v1h3v1H6v1H5v1H3V4H1v1H0z" fill="currentColor" />
                    </svg>
                  </span>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{trip.code}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {trip.city}, {trip.country}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-[15px]">{trip.note}</p>
                <TravelStamp />
                <dl className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px]">
                  <div>
                    <dt className="text-muted-foreground">PASSENGER</dt>
                    <dd className="font-bold">ZARIF</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">SEAT</dt>
                    <dd className="font-bold">window, obviously</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">GATE</dt>
                    <TravelGate />
                  </div>
                </dl>
              </div>
              {/* tear-off stub */}
              <div className="relative flex w-28 shrink-0 flex-col items-center justify-between border-l-2 border-dashed border-line py-5">
                <span aria-hidden className="absolute -top-3 -left-3 size-6 rounded-full border-2 border-line bg-background" />
                <span aria-hidden className="absolute -bottom-3 -left-3 size-6 rounded-full border-2 border-line bg-background" />
                <PixelIcon rows={trip.icon} colors={trip.colors} label={`${trip.country} pixel icon`} />
                <Barcode seed={trip.flight + trip.code} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
