"use client";

import { useSyncExternalStore } from "react";
import { summarize, useStatus } from "@/lib/use-status";
import { cn } from "@/lib/utils";
import { getServerSnapshot, getSnapshot, klangParts, mood, subscribe } from "@/lib/klang";

/** "KLANG 3:11pm · at work (probably) · 4/4 up" */
export function KlangClock({ className, compact = false }: { className?: string; compact?: boolean }) {
  const minute = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { state, up, total } = summarize(useStatus());

  if (minute === null) return null;
  const { hour, weekend, time } = klangParts(minute);

  const statusText =
    state === "unknown" ? "service status unknown" : `${up} of ${total} services up`;

  return (
    <a
      href="#homelab"
      title={`${mood(hour, weekend)} (probably) · ${statusText}`}
      className={cn(
        "items-center gap-2 rounded-full border border-line px-3.5 py-1.5 font-mono text-[12px] whitespace-nowrap text-muted-foreground transition hover:border-accent",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          state === "up" ? "led bg-accent" : state === "degraded" ? "bg-destructive" : "bg-muted-foreground",
        )}
        aria-hidden
      />
      <span className="text-foreground">{time} in Klang</span>
      <span aria-hidden className={compact ? "hidden 2xl:inline" : undefined}>
        ·
      </span>
      <span className={compact ? "hidden 2xl:inline" : undefined}>{mood(hour, weekend)}</span>
      <span className="sr-only">(probably). {statusText}.</span>
    </a>
  );
}
