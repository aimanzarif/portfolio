"use client";

/* Klang (Malaysia) local time helpers, shared by the header clock and voyager. */
const TZ = "Asia/Kuala_Lumpur";

export function subscribe(fn: () => void) {
  const timer = window.setInterval(fn, 30_000);
  return () => window.clearInterval(timer);
}

/** Minute-resolution timestamp, so the snapshot only changes once a minute. */
export const getSnapshot = () => Math.floor(Date.now() / 60_000);
export const getServerSnapshot = () => null;

export function klangParts(minute: number) {
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

export function mood(hour: number, weekend: boolean) {
  if (hour < 7) return "asleep";
  if (hour < 9) return weekend ? "still sleeping" : "stuck in jam";
  if (hour >= 12 && hour < 14) return "makan time";
  if (hour < 18) return weekend ? "weekend mode, lepak" : "at work";
  if (hour < 20) return "makan, then homelab";
  return "kacau the homelab";
}

/** Night time in Klang: voyager sleeps. Matches the clock's "asleep" mood. */
export const isNight = (hour: number) => hour < 7;
/** Dark outside in Klang: sunset is around 7.15pm, sunrise around 7am. */
export const isDarkOutside = (hour: number) => hour >= 19 || hour < 7;
