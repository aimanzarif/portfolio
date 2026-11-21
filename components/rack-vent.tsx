"use client";

import { summarize, useStatus } from "@/lib/use-status";
import { cn } from "@/lib/utils";

const BARS = 48;

/** The rack's vent doubles as a status light: a calm green wave when all is well, red when something is down. */
export function RackVent() {
  const { state, up, total } = summarize(useStatus());

  const label =
    state === "up"
      ? `ALL ${total} SERVICES UP`
      : state === "degraded"
        ? `${total - up} OF ${total} DOWN`
        : "STATUS UNKNOWN";

  return (
    <div className="my-3.5">
      <div
        aria-hidden
        className={cn(
          "flex h-11 items-stretch justify-between",
          state === "up" && "vent-ok",
          state === "degraded" && "vent-bad",
        )}
      >
        {Array.from({ length: BARS }, (_, i) => (
          <span
            key={i}
            className="vent-bar w-[2px] rounded-full bg-line"
            style={{ animationDelay: `${(i / BARS) * 2.4}s` }}
          />
        ))}
      </div>
      <p
        className={cn(
          "mt-2.5 flex items-center gap-2 font-mono text-[11px] font-bold",
          state === "up" ? "text-accent" : state === "degraded" ? "text-destructive" : "text-muted-foreground",
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            state === "up" ? "led bg-accent" : state === "degraded" ? "bg-destructive" : "bg-muted-foreground",
          )}
          aria-hidden
        />
        {label}
      </p>
    </div>
  );
}
