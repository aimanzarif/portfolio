import { delayedNowPlaying, delayMinutes } from "@/lib/music-feed";
import { getPlaylist, PLAYLIST_ID, spotifyEnabled, type NowPlaying, type Playlist } from "@/lib/spotify";

/*
 * What's on the radio, for the mascot room, the terminal (`np`, `playlist`) and the playlist card.
 * "Now playing" comes from lib/music-feed: 15 minutes behind, and quiet at night. The playlist is
 * asked from Spotify at most once an hour, however many visitors.
 */

export type Music = {
  enabled: boolean;
  /** How far behind "now" is, in minutes (0 = live). */
  delayMinutes: number;
  now: NowPlaying;
  playlist: Playlist | null;
  checkedAt: string;
};

const PLAYLIST_TTL = 60 * 60_000;

let playlistCache: { at: number; value: Playlist | null } | null = null;
// One Spotify call at a time: visitors arriving while it runs wait for the same answer.
let playlistInflight: Promise<void> | null = null;

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
    delayMinutes: delayMinutes(),
    now: enabled ? delayedNowPlaying() : { state: "idle" },
    playlist: enabled ? await playlist() : PLAYLIST_ID ? { name: "playlist", url: null, id: PLAYLIST_ID, songs: [], total: 0 } : null,
    checkedAt: new Date().toISOString(),
  };
  return Response.json(body, { headers: { "Cache-Control": "public, max-age=5", "X-Robots-Tag": "noindex" } });
}
