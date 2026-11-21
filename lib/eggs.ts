"use client";

import { useSyncExternalStore } from "react";

export const EGGS = ["terminal", "konami", "power"] as const;
export type Egg = (typeof EGGS)[number];

export const eggHints: Record<Egg, string> = {
  terminal: "The terminal knows more than `help` admits.",
  konami: "Gamers from the 80s know a certain sequence.",
  power: "Every server has a power button. Mine is blinking at you.",
};

const eggMessages: Record<Egg, string> = {
  terminal: "Found one: the terminal keeps secrets.",
  konami: "CHEAT ACTIVATED: +30 lives. Still not enough for a holiday.",
  power: "That's the power button. Please don't.",
};

const KEY = "zarep-eggs";
let found: readonly Egg[] = [];
let loaded = false;
const listeners = new Set<() => void>();
const toastListeners = new Set<(message: string, count: number) => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
    found = EGGS.filter((egg) => saved.includes(egg));
  } catch {
    found = [];
  }
}

export function findEgg(egg: Egg) {
  ensureLoaded();
  if (found.includes(egg)) return;
  found = [...found, egg];
  try {
    localStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    /* private mode: progress just won't persist */
  }
  listeners.forEach((fn) => fn());
  const message =
    found.length === EGGS.length
      ? `${eggMessages[egg]} That's all ${EGGS.length}. You'd be great at QA. Email me.`
      : eggMessages[egg];
  toastListeners.forEach((fn) => fn(message, found.length));
}

export function onEggFound(fn: (message: string, count: number) => void) {
  toastListeners.add(fn);
  return () => {
    toastListeners.delete(fn);
  };
}

function subscribe(fn: () => void) {
  ensureLoaded();
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

const empty: readonly Egg[] = [];

export function useEggs() {
  return useSyncExternalStore(
    subscribe,
    () => {
      ensureLoaded();
      return found;
    },
    () => empty,
  );
}
