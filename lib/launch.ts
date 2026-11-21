"use client";

/* Fired every time the Konami code is entered; the rocket and voyager listen for it. */
export const LAUNCH_EVENT = "zarep:launch";

export function launchRocket() {
  window.dispatchEvent(new Event(LAUNCH_EVENT));
}

export function onLaunch(fn: () => void) {
  window.addEventListener(LAUNCH_EVENT, fn);
  return () => window.removeEventListener(LAUNCH_EVENT, fn);
}
