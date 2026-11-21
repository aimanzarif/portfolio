"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { onLaunch } from "@/lib/launch";

/*
 * Konami code reward, cartoon style:
 *  1. Outlined cartoon smoke puffs burst out of the rocket and join into a smoke curtain over the page.
 *  2. A zip runs up the middle of the curtain. The rocket is the zip's slider: as it flies up,
 *     the zip opens behind it in a widening V and the page shows through.
 *  3. Once the rocket is gone, the two halves of smoke slide off the sides.
 * Runs every time the code is entered; skipped for prefers-reduced-motion.
 */
export function RocketLaunch() {
  const [run, setRun] = useState(0);

  useEffect(
    () =>
      onLaunch(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        setRun((n) => n + 1);
      }),
    [],
  );

  const done = useCallback(() => setRun(0), []);

  if (!run) return null;
  // A new key restarts the animation if the code is entered again mid-flight.
  return <Launch key={run} onDone={done} />;
}

// Timeline (ms)
const PUFF = 520; // smoke bursts out and covers the page
const RUMBLE = 900; // rocket shakes on the pad until here
const FLIGHT = 1350; // lift-off until the rocket leaves the screen
const PART = 650; // curtains slide away
const TOTAL = RUMBLE + FLIGHT + PART;

const ROCKET_W = 64;
const ROCKET_H = 150;

const INK = "#1c1f20";
const SMOKE = "#e7e3d9";
const SMOKE_LIGHT = "#f7f4ee";
const SMOKE_SHADE = "#c9c4b8";
const METAL = "#9aa09a";
const METAL_DARK = "#5f655f";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOutBack = (p: number) => 1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2);
const easeInCubic = (p: number) => p * p * p;

type Puff = { tx: number; ty: number; r: number; delay: number };

function Launch({ onDone }: { onDone: () => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const rocket = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = svg.current;
    const ship = rocket.current;
    if (!root || !ship) return;

    const $ = <T extends Element>(sel: string) => root.querySelector(sel) as T;
    const left = $<SVGPolygonElement>("[data-left]");
    const right = $<SVGPolygonElement>("[data-right]");
    const curtains = $<SVGGElement>("[data-curtains]");
    const teethL = $<SVGLineElement>("[data-teeth-l]");
    const teethR = $<SVGLineElement>("[data-teeth-r]");
    const closedA = $<SVGLineElement>("[data-closed-a]");
    const closedB = $<SVGLineElement>("[data-closed-b]");
    const puffEls = Array.from(root.querySelectorAll<SVGGElement>("[data-puff]"));

    let W = window.innerWidth;
    let H = window.innerHeight;
    const size = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      root.setAttribute("viewBox", `0 0 ${W} ${H}`);
    };
    size();
    window.addEventListener("resize", size);

    // Cartoon puffs that fill the screen, placed on a loose grid so there are no gaps.
    const puffs: Puff[] = [];
    const cols = 5;
    const rows = 4;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        puffs.push({
          tx: ((i + 0.5) / cols) * W + (Math.random() - 0.5) * 60,
          ty: ((j + 0.5) / rows) * H + (Math.random() - 0.5) * 60,
          r: Math.max(W / cols, H / rows) * (0.75 + Math.random() * 0.25),
          delay: (1 - (j + 1) / rows) * 160 + Math.abs(i - (cols - 1) / 2) * 40,
        });
      }
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = now - start;
      const cx = W / 2;
      const padY = H - ROCKET_H * 0.9;

      // Rocket = zip slider
      let y: number;
      let x = cx;
      if (t < 260) {
        y = H + 20 - (H + 20 - padY) * easeOutBack(t / 260);
      } else if (t < RUMBLE) {
        y = padY;
        x = cx + (Math.random() - 0.5) * 5;
      } else {
        const p = clamp((t - RUMBLE) / FLIGHT);
        y = padY - (padY + ROCKET_H + 60) * Math.pow(p, 2);
      }
      ship.style.transform = `translate(${x - ROCKET_W / 2}px, ${y}px)`;
      ship.style.opacity = y > -ROCKET_H - 20 ? "1" : "0";

      // Puffs: burst out of the nozzle, overshoot, then hand over to the curtain
      puffEls.forEach((el, i) => {
        const pf = puffs[i];
        const p = clamp((t - pf.delay) / PUFF);
        const k = easeOutBack(p);
        const px = cx + (pf.tx - cx) * k;
        const py = H + (pf.ty - H) * k;
        const fade = clamp(1 - (t - (PUFF + 380)) / 250);
        el.setAttribute("transform", `translate(${px} ${py}) scale(${Math.max(0.001, (k * pf.r) / 100)})`);
        el.setAttribute("opacity", String(p > 0 ? fade : 0));
      });

      // Curtain appears under the puffs once they cover the page
      curtains.setAttribute("opacity", t > PUFF * 0.75 ? "1" : "0");

      // The zip: closed above the slider, opening in a V below it
      const slider = clamp(y + ROCKET_H - 26, -80, H);
      const open = clamp((t - RUMBLE) / FLIGHT) ** 0.85 * W * 0.5;
      const part = easeInCubic(clamp((t - RUMBLE - FLIGHT) / PART)) * W * 0.62;

      left.setAttribute("points", `-10,-10 ${cx},-10 ${cx},${slider} ${cx - open},${H + 10} -10,${H + 10}`);
      right.setAttribute("points", `${W + 10},-10 ${cx},-10 ${cx},${slider} ${cx + open},${H + 10} ${W + 10},${H + 10}`);
      left.setAttribute("transform", `translate(${-part} 0)`);
      right.setAttribute("transform", `translate(${part} 0)`);

      teethL.setAttribute("x1", String(cx - part));
      teethL.setAttribute("y1", String(slider));
      teethL.setAttribute("x2", String(cx - open - part));
      teethL.setAttribute("y2", String(H + 10));
      teethR.setAttribute("x1", String(cx + part));
      teethR.setAttribute("y1", String(slider));
      teethR.setAttribute("x2", String(cx + open + part));
      teethR.setAttribute("y2", String(H + 10));
      for (const line of [closedA, closedB]) {
        line.setAttribute("x1", String(cx));
        line.setAttribute("x2", String(cx));
        line.setAttribute("y2", String(Math.max(-10, slider)));
      }

      if (t >= TOTAL) {
        onDone();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", size);
    };
  }, [onDone]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <svg ref={svg} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          {/* Cartoon smoke texture: flat base with outlined bubbly puffs */}
          <pattern id="smoke-tile" width="220" height="220" patternUnits="userSpaceOnUse">
            <rect width="220" height="220" fill={SMOKE} />
            <g stroke={SMOKE_SHADE} strokeWidth="5">
              <circle cx="48" cy="52" r="36" fill={SMOKE_LIGHT} />
              <circle cx="92" cy="40" r="24" fill={SMOKE_LIGHT} />
              <circle cx="150" cy="110" r="40" fill={SMOKE_LIGHT} />
              <circle cx="186" cy="156" r="26" fill={SMOKE_LIGHT} />
              <circle cx="62" cy="170" r="32" fill={SMOKE_LIGHT} />
              <circle cx="120" cy="190" r="20" fill={SMOKE_LIGHT} />
            </g>
            <g fill="#ffffff" opacity="0.8">
              <circle cx="36" cy="40" r="8" />
              <circle cx="136" cy="96" r="10" />
              <circle cx="50" cy="158" r="7" />
            </g>
          </pattern>
        </defs>

        {/* The curtain, split down the middle by the zip */}
        <g data-curtains opacity="0">
          <polygon data-left fill="url(#smoke-tile)" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <polygon data-right fill="url(#smoke-tile)" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* zip teeth: interlocked above the slider, separated along the V below it */}
          <line data-closed-a y1="-10" stroke={METAL_DARK} strokeWidth="16" />
          <line data-closed-b y1="-10" stroke={METAL} strokeWidth="16" strokeDasharray="7 7" />
          <line data-teeth-l stroke={METAL} strokeWidth="12" strokeDasharray="7 7" strokeLinecap="butt" />
          <line data-teeth-r stroke={METAL} strokeWidth="12" strokeDasharray="7 7" strokeDashoffset="7" strokeLinecap="butt" />
        </g>

        {/* Burst puffs (unit cloud, scaled per puff) */}
        {Array.from({ length: 20 }, (_, i) => (
          <g key={i} data-puff opacity="0">
            <g stroke={INK} strokeWidth="5" fill={SMOKE}>
              <circle cx="-48" cy="14" r="52" />
              <circle cx="46" cy="18" r="50" />
              <circle cx="0" cy="-26" r="62" />
              <circle cx="0" cy="34" r="56" />
            </g>
            {/* hide the inner outlines so it reads as one cloud */}
            <g fill={SMOKE}>
              <circle cx="-48" cy="14" r="48" />
              <circle cx="46" cy="18" r="46" />
              <circle cx="0" cy="-26" r="58" />
              <circle cx="0" cy="34" r="52" />
            </g>
            <circle cx="-20" cy="-48" r="14" fill={SMOKE_LIGHT} />
            <circle cx="-38" cy="-4" r="8" fill={SMOKE_LIGHT} />
          </g>
        ))}
      </svg>

      <div ref={rocket} className="absolute top-0 left-0 will-change-transform" style={{ width: ROCKET_W, height: ROCKET_H }}>
        <svg viewBox="0 0 64 150" width={ROCKET_W} height={ROCKET_H} className="overflow-visible">
          {/* flame */}
          <g className="rocket-flame" style={{ transformOrigin: "32px 128px" }}>
            <path d="M18 128 Q32 196 46 128 Z" fill="#ff9f43" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d="M24 128 Q32 172 40 128 Z" fill="#ffe08a" />
          </g>
          {/* zip slider + pull tab under the nozzle */}
          <rect x="22" y="116" width="20" height="13" rx="3" fill={METAL} stroke={INK} strokeWidth="3" />
          <g className="zip-pull" style={{ transformOrigin: "32px 122px" }}>
            <rect x="27" y="122" width="10" height="20" rx="4" fill={METAL} stroke={INK} strokeWidth="3" />
            <rect x="30" y="129" width="4" height="8" rx="2" fill={INK} />
          </g>
          {/* fins */}
          <path d="M14 76 L0 112 L16 108 Z" fill="#a9d3b8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M50 76 L64 112 L48 108 Z" fill="#a9d3b8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          {/* body */}
          <path d="M32 4 C50 22 52 60 50 110 L14 110 C12 60 14 22 32 4 Z" fill="#ece7db" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M20 40 C20 30 24 20 28 14" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          {/* nose */}
          <path d="M32 4 C40 12 44 22 46 30 L18 30 C20 22 24 12 32 4 Z" fill="#2f6b4f" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          {/* window */}
          <circle cx="32" cy="56" r="10" fill="#a9d3b8" stroke={INK} strokeWidth="3.5" />
          <circle cx="28.5" cy="52.5" r="3" fill="#ffffff" opacity="0.9" />
          <text x="32" y="92" textAnchor="middle" fontSize="12" fontWeight="800" fontFamily="ui-monospace, monospace" fill={INK}>
            Z
          </text>
          {/* nozzle */}
          <path d="M20 110 L44 110 L40 118 L24 118 Z" fill="#3d4344" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
