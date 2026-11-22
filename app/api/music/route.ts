import { getNowPlaying, getPlaylist, PLAYLIST_ID, spotifyEnabled, type NowPlaying, type Playlist } from "@/lib/spotify";

/*
 * What's on the radio, for the mascot room, the terminal (`np`, `playlist`) and the playlist card.
 * Spotify is asked at most every 10 s (now playing) and every hour (playlist), however many visitors.
 */

export type Music = {
  enabled: boolean;
  now: NowPlaying;
  playlist: Playlist | null;
  checkedAt: string;
};

const NOW_TTL = 10_000;
const PLAYLIST_TTL = 60 * 60_000;

let nowCache: { at: number; value: NowPlaying } | null = null;
let playlistCache: { at: number; value: Playlist | null } | null = null;
// One Spotify call at a time: visitors arriving while it runs wait for the same answer.
let nowInflight: Promise<void> | null = null;
let playlistInflight: Promise<void> | null = null;

/** Progress as of this response: the cached value can be up to NOW_TTL old. */
function advanced(value: NowPlaying, since: number): NowPlaying {
  if (value.state !== "playing") return value;
  return { ...value, progressMs: Math.min(value.durationMs || Infinity, value.progressMs + (Date.now() - since)) };
}

async function now(): Promise<NowPlaying> {
  if (!nowCache || Date.now() - nowCache.at > NOW_TTL) {
    nowInflight ??= (async () => {
      let value: NowPlaying;
      try {
        value = await getNowPlaying();
      } catch (error) {
        console.warn(`[music] ${error instanceof Error ? error.message : error}`);
        value = nowCache?.value ?? { state: "idle" };
      }
      nowCache = { at: Date.now(), value };
    })().finally(() => {
      nowInflight = null;
    });
    await nowInflight;
  }
  return advanced(nowCache!.value, nowCache!.at);
}

async function playlist(): Promise<Playlist | null> {
  if (!playlistCache || Date.now() - playlistCache.at > PLAYLIST_TTL) {
    playlistInflight ??= (async () => {
      let value: Playlist | null;
      try {
        value = await getPlaylist();
      } catch (error) {
        console.warn(`[music] ${error instanceof Error ? error.message : error}`);
        // Keep the last good list; without one, still let the card embed the playlist by id.
        value = playlistCache?.value ?? (PLAYLIST_ID ? { name: "playlist", url: null, id: PLAYLIST_ID, songs: [], total: 0 } : null);
      }
      playlistCache = { at: Date.now(), value };
    })().finally(() => {
      playlistInflight = null;
    });
    await playlistInflight;
  }
  return playlistCache!.value;
}

export async function GET() {
  const enabled = spotifyEnabled();
  const body: Music = {
    enabled,
    now: enabled ? await now() : { state: "idle" },
    playlist: enabled ? await playlist() : PLAYLIST_ID ? { name: "playlist", url: null, id: PLAYLIST_ID, songs: [], total: 0 } : null,
    checkedAt: new Date().toISOString(),
  };
  return Response.json(body, { headers: { "Cache-Control": "public, max-age=5", "X-Robots-Tag": "noindex" } });
}
