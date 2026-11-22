"use client";

import { useEffect, useState } from "react";
import type { Music } from "@/app/api/music/route";

/* One shared poll of /api/music (30 s, paused while the tab is hidden). */
let current: Music | null = null;
let inflight: Promise<Music | null> | null = null;
let timer: number | null = null;
const listeners = new Set<(m: Music | null) => void>();

export function loadMusic() {
  inflight ??= fetch("/api/music")
    .then((r) => (r.ok ? (r.json() as Promise<Music>) : null))
    .catch(() => null)
    .then((m) => {
      inflight = null;
      if (m) current = m;
      listeners.forEach((fn) => fn(current));
      return current;
    });
  return inflight;
}

export function useMusic() {
  const [music, setMusic] = useState<Music | null>(current);
  useEffect(() => {
    listeners.add(setMusic);
    if (!current) void loadMusic();
    if (timer === null) {
      timer = window.setInterval(() => {
        if (document.visibilityState === "visible") void loadMusic();
      }, 30_000);
    }
    return () => {
      listeners.delete(setMusic);
      if (listeners.size === 0 && timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };
  }, []);
  return music;
}

export const isOn = (m: Music | null) => m?.now.state === "playing";
