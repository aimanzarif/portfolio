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

/*
 * When you are signed in to Spotify, the embed plays through your own account. Refreshing or leaving
 * the page kills it without telling Spotify, so for a little while Spotify still says "playing".
 * Remember where our player stopped, so that leftover "playing" can be ignored (see use-music).
 */
const ECHO_KEY = "embed-stopped";
export type EmbedEcho = { id: string; position: number; at: number };

function onPageHide() {
  try {
    const id = state.uri?.split(":")[2];
    if (state.playing && id) {
      const echo: EmbedEcho = { id, position: state.position + (Date.now() - state.at), at: Date.now() };
      sessionStorage.setItem(ECHO_KEY, JSON.stringify(echo));
    } else {
      sessionStorage.removeItem(ECHO_KEY);
    }
  } catch {
    /* storage unavailable: nothing to remember */
  }
}

export function readEmbedEcho(): EmbedEcho | null {
  try {
    const v = JSON.parse(sessionStorage.getItem(ECHO_KEY) ?? "null") as EmbedEcho | null;
    return v && typeof v.id === "string" && /^[A-Za-z0-9]+$/.test(v.id) && Number.isFinite(v.position) && Number.isFinite(v.at) ? v : null;
  } catch {
    return null;
  }
}

export function clearEmbedEcho() {
  try {
    sessionStorage.removeItem(ECHO_KEY);
  } catch {
    /* ignore */
  }
}

function subscribe(fn: () => void) {
  if (!installed) {
    window.addEventListener("message", onMessage);
    window.addEventListener("pagehide", onPageHide);
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
