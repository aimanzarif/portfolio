"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, isNight, klangParts, subscribe } from "@/lib/klang";
import { summarize, useStatus } from "@/lib/use-status";
import { onVoyager } from "@/lib/voyager-events";
import { cn } from "@/lib/utils";

/*
 * voyager: the laptop that actually hosts this site, as a 22×18 pixel mascot.
 * Mood priority: a short reaction (happy / shock / groggy) > sweating (a service is down)
 * > sleeping (night in Klang) > watching the keyboard (someone is typing) > idle.
 */

type Mood = "idle" | "blink" | "typing" | "happy" | "shock" | "sleep" | "sweat" | "groggy";
type Px = readonly [x: number, y: number, w?: number, h?: number];

const FACES: Record<Mood, readonly Px[]> = {
  idle: [[7, 6, 2, 2], [13, 6, 2, 2], [8, 9], [13, 9], [9, 10, 4, 1]],
  blink: [[7, 7, 2, 1], [13, 7, 2, 1], [8, 9], [13, 9], [9, 10, 4, 1]],
  typing: [[7, 8, 2, 1], [13, 8, 2, 1], [7, 7, 2, 1], [13, 7, 2, 1], [9, 10, 4, 1]],
  happy: [[6, 7], [7, 6], [8, 7], [13, 7], [14, 6], [15, 7], [8, 9, 6, 1], [9, 10, 4, 1]],
  shock: [[7, 5, 2, 3], [13, 5, 2, 3], [10, 9, 2, 2]],
  sleep: [[7, 7, 2, 1], [13, 7, 2, 1], [10, 10, 2, 1]],
  sweat: [[7, 6, 2, 2], [13, 6, 2, 2], [7, 5], [8, 4], [13, 4], [14, 5], [8, 10], [9, 9], [10, 10], [11, 9], [12, 10], [13, 9]],
  groggy: [[7, 7, 2, 1], [13, 6, 2, 2], [9, 10, 3, 1]],
};

const IDLE_LINES = [
  "hai! i'm voyager, the laptop that runs this whole site.",
  "don't close my lid ah. everything goes down.",
  "32 GB RAM. still not enough for chrome.",
  "psst. the terminal up there takes commands.",
  "zarif cleans my fan sometimes. sometimes.",
  "if i'm warm, it's not a bug. it's a feature.",
];

const SHOCK_WORDS = ["rm", "sudo"];

function Pixel({ p, className }: { p: Px; className?: string }) {
  const [x, y, w = 1, h = 1] = p;
  return <rect x={x} y={y} width={w} height={h} className={className} />;
}

export function Voyager() {
  const minute = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { state, up, total } = summarize(useStatus());
  const [reaction, setReaction] = useState<"happy" | "shock" | "groggy" | null>(null);
  const [typing, setTyping] = useState(false);
  const [blink, setBlink] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const lineIndex = useRef(0);
  const timers = useRef<Record<string, number>>({});

  const later = useCallback((key: string, ms: number, fn: () => void) => {
    window.clearTimeout(timers.current[key]);
    timers.current[key] = window.setTimeout(fn, ms);
  }, []);

  const say = useCallback(
    (text: string, ms = 4200) => {
      setBubble(text);
      later("bubble", ms, () => setBubble(null));
    },
    [later],
  );

  const react = useCallback(
    (kind: "happy" | "shock" | "groggy", ms: number) => {
      setReaction(kind);
      later("reaction", ms, () => setReaction(null));
    },
    [later],
  );

  const klang = minute === null ? null : klangParts(minute);
  const night = klang ? isNight(klang.hour) : false;

  // Terminal activity.
  useEffect(
    () =>
      onVoyager((event) => {
        if (event.type === "typing") {
          setTyping(true);
          later("typing", 1200, () => setTyping(false));
          return;
        }
        const head = event.command.split(/\s+/)[0];
        if (SHOCK_WORDS.includes(head)) {
          react("shock", 2600);
          say(head === "rm" ? "eh eh eh. NOT AGAIN. remember june?" : "you're not admin lah. even i'm not.");
        } else {
          react("happy", 1600);
        }
      }),
    [later, react, say],
  );

  // Blink now and then while awake.
  useEffect(() => {
    const loop = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 160);
    }, 4200);
    return () => window.clearInterval(loop);
  }, []);

  // Say hai once per visit, a few seconds in.
  useEffect(() => {
    let greeted = false;
    try {
      greeted = sessionStorage.getItem("voyager-hai") === "1";
      sessionStorage.setItem("voyager-hai", "1");
    } catch {
      /* storage blocked: greet anyway */
    }
    if (greeted) return;
    const timer = window.setTimeout(() => setBubble("hai! i'm voyager. click me if you're bored."), 6500);
    const hide = window.setTimeout(() => setBubble(null), 11500);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => Object.values(pending).forEach(window.clearTimeout);
  }, []);

  const mood: Mood =
    reaction ??
    (state === "degraded" ? "sweat" : night ? "sleep" : typing ? "typing" : blink ? "blink" : "idle");

  const onClick = () => {
    if (state === "degraded") {
      react("shock", 1500);
      say(`aiyo, ${total - up} of ${total} service down. ZARIF!!`);
      return;
    }
    if (night) {
      react("groggy", 4000);
      say(`eh? it's ${klang?.time ?? "late"} in Klang lah... let me sleep. zzz`);
      return;
    }
    react("happy", 1400);
    say(IDLE_LINES[lineIndex.current % IDLE_LINES.length]);
    lineIndex.current += 1;
  };

  const faceColor = mood === "sweat" ? "fill-[#ff8b80]" : mood === "sleep" ? "fill-[#5f7f6c]" : "fill-[#a9d3b8]";
  const label =
    mood === "sweat"
      ? "voyager is sweating: a service is down"
      : mood === "sleep"
        ? "voyager is asleep, it's night in Klang"
        : "voyager, the laptop that hosts this site";

  return (
    <div className="pointer-events-none fixed right-3 bottom-3 z-40 flex flex-col items-end gap-1 print:hidden sm:right-5 sm:bottom-5">
      <div aria-live="polite" className="min-h-0">
        {bubble ? (
          <p className="voyager-pop pointer-events-auto relative mr-2 max-w-[15rem] rounded-xl border-2 border-foreground bg-card px-3.5 py-2.5 font-mono text-xs leading-5 text-foreground shadow-[4px_4px_0_var(--accent)]">
            {bubble}
            <span
              aria-hidden
              className="absolute -bottom-[7px] right-8 size-3 rotate-45 border-r-2 border-b-2 border-foreground bg-card"
            />
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClick}
        aria-label={`${label}. Click to say hai.`}
        title="voyager"
        className={cn(
          "pointer-events-auto rounded-xl p-1 transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-accent",
          mood === "sleep" ? "voyager-bob-slow" : mood === "shock" ? "voyager-shake" : "voyager-bob",
        )}
      >
        <svg
          viewBox="0 0 22 18"
          className="h-auto w-[52px] overflow-visible sm:w-[84px]"
          shapeRendering="crispEdges"
          aria-hidden
        >
          {/* lid and screen */}
          <rect x="3" y="2" width="16" height="12" className="fill-[#6b706c] dark:fill-foreground" />
          <rect x="4" y="3" width="14" height="10" className="fill-[#1c1f20]" />
          {/* base and keyboard */}
          <rect x="1" y="14" width="20" height="1" className="fill-[#6b706c] dark:fill-foreground" />
          <rect x="0" y="15" width="22" height="2" className="fill-muted-foreground" />
          {[3, 6, 9, 12, 15, 18].map((x, i) => (
            <rect
              key={x}
              x={x}
              y="15"
              width="1"
              height="1"
              className={cn("fill-background", mood === "typing" && "voyager-key")}
              style={{ animationDelay: `${i * 90}ms` }}
            />
          ))}
          {/* power LED */}
          <rect x="20" y="15" width="1" height="1" className={mood === "sleep" ? "fill-[#5f7f6c] led" : "fill-[#a9d3b8]"} />
          {/* face */}
          {FACES[mood].map((p, i) => (
            <Pixel key={i} p={p} className={faceColor} />
          ))}
          {/* sweat drop */}
          {mood === "sweat" ? (
            <g className="voyager-drop">
              <rect x="19" y="4" width="1" height="1" className="fill-[#9db8f0]" />
              <rect x="19" y="5" width="2" height="2" className="fill-[#9db8f0]" />
            </g>
          ) : null}
          {/* zzz */}
          {mood === "sleep" ? (
            <g className="fill-muted-foreground font-mono" style={{ fontSize: 4 }}>
              <text x="18" y="3" className="voyager-z">
                z
              </text>
              <text x="20" y="1" className="voyager-z" style={{ animationDelay: "0.8s" }}>
                Z
              </text>
            </g>
          ) : null}
        </svg>
      </button>
    </div>
  );
}
