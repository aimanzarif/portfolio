"use client";

/* Tiny event channel so the terminal can poke voyager without importing it. */
export type VoyagerEvent = { type: "typing" } | { type: "command"; command: string };

const NAME = "voyager";

export function emitVoyager(detail: VoyagerEvent) {
  window.dispatchEvent(new CustomEvent<VoyagerEvent>(NAME, { detail }));
}

export function onVoyager(fn: (event: VoyagerEvent) => void) {
  const handler = (event: Event) => fn((event as CustomEvent<VoyagerEvent>).detail);
  window.addEventListener(NAME, handler);
  return () => window.removeEventListener(NAME, handler);
}
