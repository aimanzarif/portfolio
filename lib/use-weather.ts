"use client";

import { useEffect, useState } from "react";
import type { Weather } from "@/lib/weather";

/* One shared 10-minute poll of /api/weather for the mascot window. */
let current: Weather | null = null;
let inflight: Promise<void> | null = null;
let timer: number | null = null;
const listeners = new Set<(w: Weather) => void>();

function load() {
  inflight ??= fetch("/api/weather")
    .then((res) => res.json() as Promise<Weather>)
    .catch((): Weather => ({ ok: false, sky: "clear", checkedAt: new Date().toISOString() }))
    .then((weather) => {
      current = weather;
      inflight = null;
      listeners.forEach((fn) => fn(weather));
    });
  return inflight;
}

export function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(current);
  useEffect(() => {
    listeners.add(setWeather);
    if (!current) load();
    if (timer === null) timer = window.setInterval(load, 10 * 60_000);
    return () => {
      listeners.delete(setWeather);
      if (listeners.size === 0 && timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };
  }, []);
  return weather;
}
