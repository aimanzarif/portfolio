"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { onLaunch } from "@/lib/launch";

/*
 * Konami code reward: a rocket rumbles at the bottom of the screen, blasts off, and leaves a smoke
 * plume that fogs the whole page before slowly clearing to reveal it again.
 * Runs every time the code is entered. Skipped entirely for prefers-reduced-motion.
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

type Puff = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  grow: number;
  age: number;
  life: number;
  alpha: number;
};

const RUMBLE = 650; // ms on the pad
const FLIGHT = 1500; // ms from lift-off to leaving the screen
const ROCKET_W = 64;
const ROCKET_H = 150;

function makePuffSprite(rgb: string) {
  const size = 128;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = size;
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `rgba(${rgb},0.9)`);
  g.addColorStop(0.45, `rgba(${rgb},0.55)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return sprite;
}

function Launch({ onDone }: { onDone: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const rocket = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ship = rocket.current;
    const ctx = el?.getContext("2d");
    if (!el || !ship || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      el.width = W * dpr;
      el.height = H * dpr;
      el.style.width = `${W}px`;
      el.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const root = document.documentElement;
    const dark = root.classList.contains("dark") || (!root.classList.contains("light") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const sprite = makePuffSprite(dark ? "222,218,208" : "150,148,140");

    const puffs: Puff[] = [];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const add = (p: Partial<Puff> & Pick<Puff, "x" | "y">) =>
      puffs.push({ vx: 0, vy: 0, r: 20, grow: 20, age: 0, life: 2000, alpha: 0.6, ...p });

    const startX = W / 2;
    const padY = H - ROCKET_H * 0.85; // rocket mostly visible, sitting on the bottom edge
    let x = startX;
    let y = H + 40;
    let last = performance.now();
    const start = last;
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const t = now - start;

      // Rocket position
      if (t < 250) {
        y = H + 40 - (H + 40 - padY) * (t / 250); // slide up onto the pad
      } else if (t < RUMBLE) {
        y = padY;
        x = startX + rand(-2.5, 2.5);
      } else {
        const p = Math.min(1, (t - RUMBLE) / FLIGHT);
        y = padY - (padY + ROCKET_H + 80) * Math.pow(p, 2.2);
        x = startX + Math.sin(p * 9) * 6 * (1 - p);
      }
      const visible = y > -ROCKET_H - 40;
      ship.style.transform = `translate(${x - ROCKET_W / 2}px, ${y}px)`;
      ship.style.opacity = visible ? "1" : "0";

      // Exhaust point: the bottom of the rocket
      const ex = x;
      const ey = y + ROCKET_H - 14;

      if (t > 150 && t < RUMBLE) {
        // Ground cloud while rumbling: wide, low, rolling sideways
        for (let i = 0; i < 7; i++) {
          add({
            x: ex + rand(-20, 20),
            y: H - rand(0, 30),
            vx: rand(-0.55, 0.55) * W * 0.0012 * 16,
            vy: rand(-0.6, -0.1),
            r: rand(30, 60),
            grow: rand(40, 90),
            life: rand(1700, 2500),
            alpha: rand(0.45, 0.65),
          });
        }
      } else if (t >= RUMBLE && visible) {
        // Plume along the flight path, spreading wide enough to fog the whole screen
        const flight = Math.min(1, (t - RUMBLE) / FLIGHT);
        for (let i = 0; i < 9; i++) {
          const spread = 0.4 + flight * 1.6;
          add({
            x: ex + rand(-12, 12),
            y: ey + rand(0, 30),
            vx: rand(-1, 1) * spread * 4,
            vy: rand(0.5, 2.2),
            r: rand(26, 50),
            grow: rand(90, 170) * (0.6 + flight),
            life: rand(1400, 2200),
            alpha: rand(0.35, 0.55),
          });
        }
      }

      // Draw smoke
      ctx.clearRect(0, 0, W, H);
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.age += dt;
        if (p.age >= p.life) {
          puffs.splice(i, 1);
          continue;
        }
        const k = p.age / p.life;
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 - 0.012 * (dt / 16); // smoke drifts up as it slows
        const r = p.r + p.grow * Math.sqrt(k) * 2.2;
        const a = p.alpha * (k < 0.08 ? k / 0.08 : 1 - Math.pow((k - 0.08) / 0.92, 1.4));
        ctx.globalAlpha = Math.max(0, a);
        ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;

      if (t > RUMBLE + FLIGHT && puffs.length === 0) {
        onDone();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [onDone]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <canvas ref={canvas} className="absolute inset-0" />
      <div ref={rocket} className="absolute top-0 left-0 will-change-transform" style={{ width: ROCKET_W, height: ROCKET_H }}>
        <svg viewBox="0 0 64 150" width={ROCKET_W} height={ROCKET_H} className="overflow-visible">
          {/* flame */}
          <g className="rocket-flame" style={{ transformOrigin: "32px 118px" }}>
            <path d="M20 116 Q32 175 44 116 Z" fill="#ffb347" />
            <path d="M25 116 Q32 156 39 116 Z" fill="#ffe08a" />
          </g>
          {/* fins */}
          <path d="M14 78 L2 112 L16 108 Z" fill="#a9d3b8" stroke="#1c1f20" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M50 78 L62 112 L48 108 Z" fill="#a9d3b8" stroke="#1c1f20" strokeWidth="2.5" strokeLinejoin="round" />
          {/* body */}
          <path
            d="M32 4 C50 22 52 60 50 110 L14 110 C12 60 14 22 32 4 Z"
            fill="#ece7db"
            stroke="#1c1f20"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* nose */}
          <path d="M32 4 C40 12 44 22 46 30 L18 30 C20 22 24 12 32 4 Z" fill="#2f6b4f" stroke="#1c1f20" strokeWidth="3" strokeLinejoin="round" />
          {/* window */}
          <circle cx="32" cy="56" r="10" fill="#a9d3b8" stroke="#1c1f20" strokeWidth="3" />
          <circle cx="28.5" cy="52.5" r="3" fill="#ece7db" opacity="0.8" />
          {/* badge */}
          <text x="32" y="90" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="ui-monospace, monospace" fill="#1c1f20">
            Z
          </text>
          {/* nozzle */}
          <path d="M20 110 L44 110 L40 118 L24 118 Z" fill="#3d4344" stroke="#1c1f20" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
