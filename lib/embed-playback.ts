"use client";

import { useSyncExternalStore } from "react";

/*
 * What the embedded Spotify player on this page is doing. The embed posts "playback_update"
 * messages to the page (payload: isPaused, position, duration, playingURI, all times in ms); we
 * only listen, from open.spotify.com only. No extra Spotify script is loaded.
 */

export type EmbedPlayback = { playing: boolean; uri: string | null; position: number; duration: number; at: number };

const IDLE: EmbedPlayback = { playing: false, uri: null, position: 0, duration: 0, at: 0 };
let state = IDLE;
let installed = false;
const listeners = new Set<() => void>();

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : 0);

function onMessage(event: MessageEvent) {
  if (event.origin !== "https://open.spotify.com") return;
  let data: unknown = event.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return;
    }
  }
  const msg = data as { type?: string; payload?: Record<string, unknown> } | null;
  if (msg?.type !== "playback_update" || !msg.payload) return;
  const p = msg.payload;
  const uri = typeof p.playingURI === "string" && /^spotify:track:[A-Za-z0-9]+$/.test(p.playingURI) ? p.playingURI : state.uri;
  const next: EmbedPlayback = {
    playing: p.isPaused === false,
    uri,
    position: num(p.position),
    duration: num(p.duration),
    at: Date.now(),
  };
  // Updates arrive about once a second; only re-render on real changes (or every few seconds).
  const changed = next.playing !== state.playing || next.uri !== state.uri || Math.abs(next.position - state.position) > 4000;
  state = next;
  if (changed) listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  if (!installed) {
    window.addEventListener("message", onMessage);
    installed = true;
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useEmbedPlayback() {
  return useSyncExternalStore(subscribe, () => state, () => IDLE);
}
