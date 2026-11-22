import { getNowPlaying, getPlaylist, PLAYLIST_ID, spotifyEnabled, type NowPlaying, type Playlist } from "@/lib/spotify";

/*
 * What's on the radio, for the mascot room, the terminal (`np`, `playlist`) and the playlist card.
 * Spotify is asked at most every 20 s (now playing) and every hour (playlist), however many visitors.
 */

export type Music = {
  enabled: boolean;
  now: NowPlaying;
  playlist: Playlist | null;
  checkedAt: string;
};

const NOW_TTL = 20_000;
const PLAYLIST_TTL = 60 * 60_000;

let nowCache: { at: number; value: NowPlaying } | null = null;
let playlistCache: { at: number; value: Playlist | null } | null = null;

async function now(): Promise<NowPlaying> {
  if (!nowCache || Date.now() - nowCache.at > NOW_TTL) {
    let value: NowPlaying;
    try {
      value = await getNowPlaying();
    } catch (error) {
      console.warn(`[music] ${error instanceof Error ? error.message : error}`);
      value = nowCache?.value ?? { state: "idle" };
    }
    nowCache = { at: Date.now(), value };
  }
  return nowCache.value;
}

async function playlist(): Promise<Playlist | null> {
  if (!playlistCache || Date.now() - playlistCache.at > PLAYLIST_TTL) {
    let value: Playlist | null;
    try {
      value = await getPlaylist();
    } catch (error) {
      console.warn(`[music] ${error instanceof Error ? error.message : error}`);
      // Keep the last good list; without one, still let the card embed the playlist by id.
      value = playlistCache?.value ?? (PLAYLIST_ID ? { name: "playlist", url: null, id: PLAYLIST_ID, songs: [] } : null);
    }
    playlistCache = { at: Date.now(), value };
  }
  return playlistCache.value;
}

export async function GET() {
  const enabled = spotifyEnabled();
  const body: Music = {
    enabled,
    now: enabled ? await now() : { state: "idle" },
    playlist: enabled ? await playlist() : PLAYLIST_ID ? { name: "playlist", url: null, id: PLAYLIST_ID, songs: [] } : null,
    checkedAt: new Date().toISOString(),
  };
  return Response.json(body, { headers: { "Cache-Control": "public, max-age=15", "X-Robots-Tag": "noindex" } });
}
