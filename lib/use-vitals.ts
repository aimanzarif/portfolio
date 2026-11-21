"use client";

import { useEffect, useState } from "react";
import type { Vitals } from "@/lib/vitals";

/* One shared 20-second poll of /api/vitals for voyager, the rack and the status panel. */
let current: Vitals | null = null;
let inflight: Promise<void> | null = null;
let timer: number | null = null;
const listeners = new Set<(v: Vitals) => void>();

function load() {
  inflight ??= fetch("/api/vitals")
    .then((res) => res.json() as Promise<Vitals>)
    .catch((): Vitals => ({ ok: false, checkedAt: new Date().toISOString() }))
    .then((vitals) => {
      current = vitals;
      inflight = null;
      listeners.forEach((fn) => fn(vitals));
    });
  return inflight;
}

export function useVitals() {
  const [vitals, setVitals] = useState<Vitals | null>(current);
  useEffect(() => {
    listeners.add(setVitals);
    if (!current) load();
    if (timer === null) timer = window.setInterval(load, 20_000);
    return () => {
      listeners.delete(setVitals);
      if (listeners.size === 0 && timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };
  }, []);
  return vitals;
}
