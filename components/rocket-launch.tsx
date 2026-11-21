"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { onLaunch } from "@/lib/launch";

/*
 * Konami code reward, in voyager's pixel style:
 *  1. Pixel smoke rises over the page from the bottom (a quarter of a second).
 *  2. A pixel zip runs up the middle. The rocket is the zip's slider: as it flies up, the zip opens
 *     behind it in a widening V and the page shows through.
 *  3. Once the rocket is gone, the two halves of smoke slide off the sides.
 * The smoke is drawn on a low-resolution canvas scaled up with crisp pixels; the rocket is a pixel
 * sprite that moves at full resolution, so the motion stays smooth.
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

const PX = 8; // screen pixels per art pixel (same chunkiness as voyager)

// Timeline (ms)
const RISE = 260; // smoke covers the page
const FLIGHT = 1100; // rocket climbs off the top
const PEEL_START = RISE + FLIGHT * 0.8; // peeling starts while the rocket is still climbing
const PEEL = 800; // both halves peel upwards off the page
const TOTAL = PEEL_START + PEEL;
const PEEL_SPREAD = 22; // rows the zip edge leads the outer edges by (peels from the zip outwards)
const CURL = 3; // rows of curled-up smoke underside along the peel line

// voyager's palette
const C = {
  smoke: "#e7e3d9",
  light: "#f6f3ec",
  shade: "#d3cec2",
  edge: "#bdb8ac",
  metal: "#a7ada6",
  metalDark: "#6b706c",
  bone: "#ece7db",
  boneShade: "#c9c4b8",
  green: "#2f6b4f",
  sage: "#a9d3b8",
  screen: "#1c1f20",
  flame: "#ff9f43",
  flameHot: "#ffe08a",
  flameRed: "#ff6b4a",
};

// Pixel rocket body (one character per art pixel).
const BODY = [
  ".....n.....",
  "....nnn....",
  "....nnn....",
  "...nnnnn...",
  "...EbbbE...",
  "...EkkkE...",
  "...EkwkE...",
  "...EkkkE...",
  "...EbbBE...",
  "...EbbBE...",
  "...EbbBE...",
  "..fEbbBEf..",
  ".ffEbbBEff.",
  ".ff.ggg.ff.",
];
// Zip slider and pull tab, drawn over the top of the flame just under the nozzle.
const SLIDER = ["....MmM....", ".....m.....", ".....M....."];
const FLAMES = [
  ["...rooor...", "....oyo....", "....oyo....", ".....o.....", ".....r....."],
  ["...roooor..", "...ooyoo...", "....oyo....", "....ror....", "..........."],
];
const SPRITE_COLORS: Record<string, string> = {
  n: C.green,
  E: C.metalDark,
  b: C.bone,
  B: C.boneShade,
  k: C.screen,
  w: C.sage,
  f: C.sage,
  g: C.metalDark,
  m: C.metal,
  M: C.metalDark,
  o: C.flame,
  y: C.flameHot,
  r: C.flameRed,
};
const SPRITE_W = 11;
const SPRITE_H = BODY.length + FLAMES[0].length;
const SLIDER_ROW = BODY.length; // art row of the zip slider inside the sprite

function drawSprite(ctx: CanvasRenderingContext2D, flame: number) {
  ctx.clearRect(0, 0, SPRITE_W, SPRITE_H);
  const draw = (lines: string[], top: number) =>
    lines.forEach((line, y) =>
      [...line].forEach((ch, x) => {
        const color = SPRITE_COLORS[ch];
        if (!color) return;
        ctx.fillStyle = color;
        ctx.fillRect(x, top + y, 1, 1);
      }),
    );
  draw(BODY, 0);
  draw(FLAMES[flame], BODY.length);
  draw(SLIDER, BODY.length);
}

/** Pixel-cloud smoke texture at art resolution: flat base with lighter bubbles ringed by a shade. */
function makeSmoke(w: number, h: number) {
  const tex = document.createElement("canvas");
  tex.width = w;
  tex.height = h;
  const ctx = tex.getContext("2d");
  if (!ctx) return tex;
  ctx.fillStyle = C.smoke;
  ctx.fillRect(0, 0, w, h);
  const disc = (cx: number, cy: number, r: number, color: string) => {
    ctx.fillStyle = color;
    for (let y = -r; y <= r; y++) {
      const span = Math.floor(Math.sqrt(r * r - y * y));
      ctx.fillRect(cx - span, cy + y, span * 2 + 1, 1);
    }
  };
  const blobs = Math.ceil((w * h) / 90);
  for (let i = 0; i < blobs; i++) {
    const x = Math.floor(Math.random() * w);
    const y = Math.floor(Math.random() * h);
    const r = 2 + Math.floor(Math.random() * 3);
    disc(x, y, r + 1, C.shade);
    disc(x, y, r, C.light);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - Math.ceil(r / 2), y - Math.ceil(r / 2), 1, 1);
  }
  return tex;
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

function Launch({ onDone }: { onDone: () => void }) {
  const stage = useRef<HTMLCanvasElement>(null);
  const ship = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = stage.current;
    const rocket = ship.current;
    const ctx = canvas?.getContext("2d");
    const rctx = rocket?.getContext("2d");
    if (!canvas || !rocket || !ctx || !rctx) return;

    let W = 0;
    let H = 0;
    let gw = 0;
    let gh = 0;
    let smoke: HTMLCanvasElement = document.createElement("canvas");
    const size = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      gw = Math.ceil(W / PX);
      gh = Math.ceil(H / PX);
      canvas.width = gw;
      canvas.height = gh;
      // whole art pixels only, so every pixel is exactly PX screen pixels
      canvas.style.width = `${gw * PX}px`;
      canvas.style.height = `${gh * PX}px`;
      smoke = makeSmoke(gw, gh);
    };
    size();
    window.addEventListener("resize", size);

    // Bumpy cloud top for the rising smoke
    const bumps = Array.from({ length: gw + 1 }, (_, c) =>
      Math.round(2.5 + 2 * Math.sin(c * 0.55) + 1.5 * Math.sin(c * 1.7 + 1)),
    );

    const rh = SPRITE_H * PX;
    let flame = -1;

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = now - start;
      const cx = Math.floor(gw / 2);

      // ---- rocket: full-resolution position, pixel sprite ----
      const flameNow = Math.floor(t / 70) % 2;
      if (flameNow !== flame) {
        flame = flameNow;
        drawSprite(rctx, flame);
      }
      const padY = H - rh + 4 * PX; // flame tucked just below the bottom edge
      // centre the sprite's middle column on the zip
      let x = cx * PX - Math.floor(SPRITE_W / 2) * PX - PX / 2;
      let y: number;
      if (t < RISE) {
        y = H - (H - padY) * easeOut(t / RISE);
        x += Math.round((Math.random() - 0.5) * 2) * 2;
      } else {
        const p = clamp((t - RISE) / FLIGHT);
        y = padY - (padY + rh) * Math.pow(p, 1.7);
      }
      rocket.style.transform = `translate(${x}px, ${y}px)`;
      rocket.style.opacity = y > -rh ? "1" : "0";

      // ---- smoke + zip: art resolution ----
      ctx.clearRect(0, 0, gw, gh);
      const slider = Math.round((y + SLIDER_ROW * PX) / PX); // art row of the slider

      if (t < RISE) {
        // Smoke rises from the bottom with a bumpy cloud top, zip already closed down the middle
        const top = gh - easeOut(t / RISE) * (gh + 8);
        for (let c = 0; c < gw; c++) {
          const ty = Math.max(0, Math.floor(top + bumps[c]));
          if (ty >= gh) continue;
          ctx.drawImage(smoke, c, ty, 1, gh - ty, c, ty, 1, gh - ty);
          ctx.fillStyle = C.edge;
          ctx.fillRect(c, ty, 1, 1);
        }
        for (let r = Math.max(0, Math.floor(top + 4)); r < gh; r++) {
          ctx.fillStyle = r % 2 ? C.metal : C.metalDark;
          ctx.fillRect(cx - 1, r, 1, 1);
          ctx.fillStyle = r % 2 ? C.metalDark : C.metal;
          ctx.fillRect(cx, r, 1, 1);
        }
      } else {
        const flight = clamp((t - RISE) / FLIGHT);
        const slope = 0.12 + flight * 0.28; // how fast the V widens below the slider (leaves two halves to peel)
        const halfOpen = (r: number) => (r < slider ? 0 : Math.round((r - slider) * slope));

        // Peel: a line sweeps up from the bottom; it leads at the zip and trails at the outer edges.
        const pp = easeInOut(clamp((t - PEEL_START) / PEEL));
        const peelBase = gh + 2 - pp * (gh + 2 + PEEL_SPREAD + CURL + 2);
        const peelY = (c: number) => peelBase + (Math.abs(c - cx) / cx) * PEEL_SPREAD;

        for (let r = 0; r < gh; r++) {
          const o = halfOpen(r);
          const leftEnd = cx - o; // exclusive
          const rightStart = cx + o;
          // fraction of the half (from the zip outwards) already peeled away on this row
          const need = (r - peelBase) / PEEL_SPREAD;
          const leftCover = need <= 0 ? leftEnd : Math.min(leftEnd, Math.floor(cx - need * cx));
          const rightCover = need <= 0 ? rightStart : Math.max(rightStart, Math.ceil(cx + need * cx));
          if (leftCover > 0) ctx.drawImage(smoke, 0, r, leftCover, 1, 0, r, leftCover, 1);
          if (rightCover < gw) ctx.drawImage(smoke, rightCover, r, gw - rightCover, 1, rightCover, r, gw - rightCover, 1);

          const zipIntact = leftCover === leftEnd && rightCover === rightStart;
          if (!zipIntact) continue;
          if (r < slider) {
            // interlocked teeth above the slider
            ctx.fillStyle = r % 2 ? C.metal : C.metalDark;
            ctx.fillRect(leftEnd - 1, r, 1, 1);
            ctx.fillStyle = r % 2 ? C.metalDark : C.metal;
            ctx.fillRect(rightStart, r, 1, 1);
          } else {
            // separated teeth along the V, with a soft shade instead of an outline
            ctx.fillStyle = C.edge;
            ctx.fillRect(leftEnd - 1, r, 1, 1);
            ctx.fillRect(rightStart, r, 1, 1);
            ctx.fillStyle = C.metal;
            if (r % 2 === 0) ctx.fillRect(leftEnd - 2, r, 1, 1);
            else ctx.fillRect(rightStart + 1, r, 1, 1);
          }
        }

        // The curl: the smoke's underside rolling up just below the peel line
        if (pp > 0) {
          for (let c = 0; c < gw; c++) {
            const py = Math.floor(peelY(c));
            for (let k = 0; k < CURL; k++) {
              const rr = py + k;
              if (rr < 0 || rr >= gh) continue;
              const o = halfOpen(rr);
              if (c >= cx - o && c < cx + o) continue; // inside the opened zip: no smoke there
              ctx.fillStyle = k === 0 ? C.edge : k === CURL - 1 ? C.shade : C.light;
              ctx.fillRect(c, rr, 1, 1);
            }
          }
        }
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
      <canvas ref={stage} className="absolute top-0 left-0 [image-rendering:pixelated]" />
      <canvas
        ref={ship}
        width={SPRITE_W}
        height={SPRITE_H}
        className="absolute top-0 left-0 will-change-transform [image-rendering:pixelated]"
        style={{ width: SPRITE_W * PX, height: SPRITE_H * PX }}
      />
    </div>
  );
}
