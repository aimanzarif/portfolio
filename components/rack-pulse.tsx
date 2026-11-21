"use client";

import type { CSSProperties, ReactNode } from "react";
import { useVitals } from "@/lib/use-vitals";

/** Wraps the rack: its LEDs blink faster the busier the real laptop's CPU is. */
export function RackPulse({ children, className }: { children: ReactNode; className?: string }) {
  const vitals = useVitals();
  const cpu = vitals?.ok && vitals.cpu !== null ? vitals.cpu : null;
  // idle 2.4s per blink, flat out 0.35s
  const speed = cpu === null ? undefined : `${Math.max(0.35, 2.4 - (cpu / 100) * 2.05).toFixed(2)}s`;
  return (
    <div className={className} style={speed ? ({ "--led-speed": speed } as CSSProperties) : undefined}>
      {children}
    </div>
  );
}
