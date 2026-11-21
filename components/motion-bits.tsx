"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Words rise out of a mask one after another. `\n` in `text` starts a new line.
 * `onMount` plays immediately (hero); otherwise it plays when scrolled into view.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  onMount = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  onMount?: boolean;
}) {
  const reduced = useReducedMotion();
  const lines = text.split("\n");
  let index = 0;

  return (
    <span className={className}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.split(" ").map((word, wordIndex) => {
            const i = index++;
            const target = { y: "0%", rotate: 0 };
            return (
              <span key={wordIndex} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={reduced ? false : { y: "110%", rotate: 4 }}
                  {...(onMount ? { animate: target } : { whileInView: target, viewport: { once: true, margin: "-8% 0px" } })}
                  transition={{ duration: 0.8, delay: delay + i * 0.07, ease }}
                >
                  {word}
                  {wordIndex < line.split(" ").length - 1 ? " " : null}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

/** The accent block behind "running." wipes in left-to-right, then settles at a tilt. */
export function WipeBlock({ children, delay = 0.35 }: { children: ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className="inline-block bg-accent px-[0.12em] text-accent-foreground"
      initial={reduced ? false : { clipPath: "inset(0 100% 0 0)", rotate: 0 }}
      animate={{ clipPath: "inset(0 0% 0 0)", rotate: -1.5 }}
      transition={{
        clipPath: { duration: 0.7, delay, ease },
        rotate: { type: "spring", stiffness: 300, damping: 9, delay: delay + 0.6 },
      }}
    >
      {children}
    </motion.span>
  );
}

/** A rubber stamp that slams down. Plays when `on` flips true, or on scroll when `on` is omitted. */
export function Stamp({ children, on, className }: { children: ReactNode; on?: boolean; className?: string }) {
  const reduced = useReducedMotion();
  const target = { scale: 1, rotate: -4, opacity: 1 };
  const from = { scale: 2.2, rotate: -14, opacity: 0 };
  const play =
    on === undefined
      ? { whileInView: target, viewport: { once: true, amount: 1 } }
      : { animate: on || reduced ? target : from };

  return (
    <motion.span
      className={cn(
        "inline-block rounded-full bg-accent px-2.5 py-0.5 font-mono text-[11px] font-bold text-accent-foreground",
        className,
      )}
      initial={reduced ? false : from}
      {...play}
      transition={{ type: "spring", stiffness: 520, damping: 18 }}
    >
      {children}
    </motion.span>
  );
}
