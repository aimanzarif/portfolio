"use client";

import { useSyncExternalStore } from "react";
import { summarize, useStatus } from "@/lib/use-status";
import { cn } from "@/lib/utils";

const TZ = "Asia/Kuala_Lumpur";

function subscribe(fn: () => void) {
  const timer = window.setInterval(fn, 30_000);
  return () => window.clearInterval(timer);
}

/** Minute-resolution timestamp, so the snapshot only changes once a minute. */
const getSnapshot = () => Math.floor(Date.now() / 60_000);
const getServerSnapshot = () => null;

function klangParts(minute: number) {
  const date = new Date(minute * 60_000);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const hour = Number(get("hour")) % 24;
  const weekend = ["Sat", "Sun"].includes(get("weekday"));
  const time = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" })
    .format(date)
    .toLowerCase()
    .replace(" ", "");
  return { hour, weekend, time };
}

function mood(hour: number, weekend: boolean) {
  if (hour < 7) return "asleep";
  if (hour < 9) return weekend ? "still sleeping" : "stuck in jam";
  if (hour >= 12 && hour < 14) return "makan time";
  if (hour < 18) return weekend ? "weekend mode, lepak" : "at work";
  if (hour < 20) return "makan, then homelab";
  return "kacau the homelab";
}

/** "KLANG 3:11pm · at work (probably) · 4/4 up" */
export function KlangClock({ className }: { className?: string }) {
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
      <span aria-hidden>·</span>
      <span>{mood(hour, weekend)}</span>
      <span className="sr-only">(probably). {statusText}.</span>
    </a>
  );
}
