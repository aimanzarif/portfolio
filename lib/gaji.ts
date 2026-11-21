"use client";

import { useSyncExternalStore } from "react";

/*
 * The Konami cheat: "GAJI MASUK". Approves the travel list until the page reloads,
 * and tells the mascot room to make it rain ringgit.
 */
let active = false;
const listeners = new Set<() => void>();
const bursts = new Set<() => void>();

let approveTimer: number | undefined;

/** Money rain now, glide down to the travel list, then stamp the passes once they're on screen. */
export function activateGaji() {
  bursts.forEach((fn) => fn());
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Wait a beat: the arrow keys in the code start the browser's own scrolling, which would cancel ours.
  window.setTimeout(() => {
    document.getElementById("travel")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, 250);
  window.clearTimeout(approveTimer);
  if (active) {
    // Already approved: re-stamp so the animation plays again after the scroll.
    active = false;
    listeners.forEach((fn) => fn());
  }
  approveTimer = window.setTimeout(
    () => {
      active = true;
      listeners.forEach((fn) => fn());
    },
    reduced ? 250 : 1300,
  );
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
