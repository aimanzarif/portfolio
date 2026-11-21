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
/* Real sunrise and sunset for Klang (NOAA solar equations), so the mascot window follows the actual sky. */
const LAT = 3.0449;
const LON = 101.4456;
const OFFSET_MIN = 8 * 60; // Klang is UTC+8 all year

/** Sunrise and sunset in Klang local minutes after midnight, for the given Klang day of the year. */
export function klangSun(dayOfYear: number) {
  const rad = Math.PI / 180;
  const g = ((2 * Math.PI) / 365) * (dayOfYear - 1);
  const eqTime =
    229.18 *
    (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl =
    0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const ha =
    Math.acos(Math.cos(90.833 * rad) / (Math.cos(LAT * rad) * Math.cos(decl)) - Math.tan(LAT * rad) * Math.tan(decl)) / rad;
  return {
    sunrise: 720 - 4 * (LON + ha) - eqTime + OFFSET_MIN,
    sunset: 720 - 4 * (LON - ha) - eqTime + OFFSET_MIN,
  };
}

/** Dark outside in Klang right now: before today's sunrise or after today's sunset. */
export function isDarkOutside(minute: number) {
  const local = new Date((minute + OFFSET_MIN) * 60_000); // read the UTC fields as Klang time
  const dayOfYear = Math.floor((local.getTime() - Date.UTC(local.getUTCFullYear(), 0, 1)) / 86_400_000) + 1;
  const now = local.getUTCHours() * 60 + local.getUTCMinutes();
  const { sunrise, sunset } = klangSun(dayOfYear);
  return now < sunrise || now >= sunset;
}
