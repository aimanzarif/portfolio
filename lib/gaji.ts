"use client";

import { useSyncExternalStore } from "react";

/*
 * The Konami cheat: "GAJI MASUK". Approves the travel list until the page reloads,
 * and tells the mascot room to make it rain ringgit.
 */
let active = false;
const listeners = new Set<() => void>();
const bursts = new Set<() => void>();

export function activateGaji() {
  active = true;
  listeners.forEach((fn) => fn());
  bursts.forEach((fn) => fn());
}

/** Called every time the cheat is entered (for one-off effects like the money rain). */
export function onGaji(fn: () => void) {
  bursts.add(fn);
  return () => {
    bursts.delete(fn);
  };
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useGaji() {
  return useSyncExternalStore(subscribe, () => active, () => false);
}
