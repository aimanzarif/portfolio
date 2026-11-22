import type { Song } from "@/lib/spotify";

/* Small helpers shared by the music UI. */

export const clock = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** Find a playlist song from an embed URI like spotify:track:ID. */
export function songForUri(uri: string | null, songs: Song[] | undefined): Song | null {
  const id = uri?.split(":")[2];
  if (!id || !songs) return null;
  return songs.find((s) => s.url?.includes(`/track/${id}`)) ?? null;
}
