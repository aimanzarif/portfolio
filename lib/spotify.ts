/*
 * Spotify, server side only. Reads what Zarif is listening to and his own playlist.
 *
 * Needs (server .env): SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
 * (from scripts/spotify-auth.mjs) and, for the playlist, SPOTIFY_PLAYLIST_ID.
 * Nothing secret ever reaches the browser: routes return only song titles, artists and links.
 *
 * Feb 2026 Web API rules for Development Mode apps: player endpoints are still available;
 * playlist songs are only readable for playlists the user owns, and the playlist object renamed
 * tracks -> items and track -> item. Both shapes are parsed below.
 */

const ACCOUNTS = (process.env.SPOTIFY_ACCOUNTS_URL ?? "https://accounts.spotify.com").replace(/\/$/, "");
const API = (process.env.SPOTIFY_API_URL ?? "https://api.spotify.com").replace(/\/$/, "");
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET ?? "";
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN ?? "";
export const PLAYLIST_ID = (process.env.SPOTIFY_PLAYLIST_ID ?? "").trim();

/** Songs played within this window still show as "just played" when nothing is on. */
const RECENT_MS = 30 * 60_000;

export const spotifyEnabled = () => Boolean(CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN);

export type Song = { title: string; artists: string; url: string | null };
export type NowPlaying =
  | { state: "playing" | "paused"; song: Song; progressMs: number; durationMs: number }
  | { state: "recent"; song: Song; playedAt: string }
  | { state: "idle" };
export type Playlist = { name: string; url: string | null; id: string; songs: Song[]; total: number };

let token: { value: string; expiresAt: number } | null = null;

async function accessToken() {
  if (token && Date.now() < token.expiresAt - 60_000) return token.value;
  const res = await fetch(`${ACCOUNTS}/api/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: REFRESH_TOKEN }),
    signal: AbortSignal.timeout(5000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`token refresh failed: HTTP ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  token = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return token.value;
}

async function api(path: string) {
  const res = await fetch(`${API}/v1${path}`, {
    headers: { Authorization: `Bearer ${await accessToken()}` },
    signal: AbortSignal.timeout(5000),
    cache: "no-store",
  });
  if (res.status === 401) token = null; // expired early: refresh next time
  return res;
}

type RawTrack = {
  name?: string;
  type?: string;
  duration_ms?: number;
  artists?: { name?: string }[];
  external_urls?: { spotify?: string };
};

const clean = (s: unknown, max = 120) =>
  String(s ?? "")
    .replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028-\u202e]/g, "")
    .trim()
    .slice(0, max);

const spotifyUrl = (u: unknown) => (typeof u === "string" && u.startsWith("https://open.spotify.com/") ? u : null);

function toSong(t: RawTrack | null | undefined): Song | null {
  if (!t?.name || (t.type && t.type !== "track")) return null; // skip podcasts, ads, local files without names
  return {
    title: clean(t.name),
    artists: clean((t.artists ?? []).map((a) => a.name).filter(Boolean).join(", ")),
    url: spotifyUrl(t.external_urls?.spotify),
  };
}

export async function getNowPlaying(): Promise<NowPlaying> {
  const res = await api("/me/player/currently-playing");
  if (res.status === 200) {
    const json = (await res.json()) as {
      is_playing?: boolean;
      progress_ms?: number;
      currently_playing_type?: string;
      item?: RawTrack;
    };
    const song = json.currently_playing_type === "track" ? toSong(json.item) : null;
    if (song) {
      return {
        state: json.is_playing ? "playing" : "paused",
        song,
        progressMs: Math.max(0, json.progress_ms ?? 0),
        durationMs: Math.max(0, json.item?.duration_ms ?? 0),
      };
    }
  } else if (res.status !== 204) {
    throw new Error(`currently-playing: HTTP ${res.status}`);
  }

  // Nothing playing (or a private session): fall back to the last song, if it was recent.
  const recent = await api("/me/player/recently-played?limit=1");
  if (!recent.ok) return { state: "idle" };
  const json = (await recent.json()) as { items?: { played_at?: string; track?: RawTrack }[] };
  const last = json.items?.[0];
  const song = toSong(last?.track);
  if (song && last?.played_at && Date.now() - Date.parse(last.played_at) < RECENT_MS) {
    return { state: "recent", song, playedAt: last.played_at };
  }
  return { state: "idle" };
}

/** The playlist object carries its first 100 songs, which is plenty here. */
export async function getPlaylist(limit = 100): Promise<Playlist | null> {
  if (!PLAYLIST_ID) return null;
  const res = await api(`/playlists/${encodeURIComponent(PLAYLIST_ID)}`);
  if (!res.ok) throw new Error(`playlist: HTTP ${res.status}`);
  const json = (await res.json()) as {
    name?: string;
    external_urls?: { spotify?: string };
    // Feb 2026 shape, then the older one
    items?: { total?: number; items?: { item?: RawTrack }[] };
    tracks?: { total?: number; items?: { track?: RawTrack }[] };
  };
  const raw = json.items?.items?.map((i) => i.item) ?? json.tracks?.items?.map((i) => i.track) ?? [];
  const songs = raw.map(toSong).filter((s): s is Song => s !== null).slice(0, limit);
  // Spotify's total also counts podcast episodes; when we have every item, count only real songs.
  const reported = json.items?.total ?? json.tracks?.total ?? raw.length;
  const total = raw.length >= reported ? songs.length : Math.max(songs.length, reported);
  return { name: clean(json.name, 80) || "playlist", url: spotifyUrl(json.external_urls?.spotify), id: PLAYLIST_ID, songs, total };
}
