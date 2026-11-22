import type { ReactNode } from "react";
import type { Song } from "@/lib/spotify";
import { loadMusic } from "@/lib/use-music";

/* Output for the terminal's `np` and `playlist` commands. */

const time = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

function SongLink({ song }: { song: Song }) {
  const text = (
    <>
      <span className="text-foreground">{song.title}</span> — {song.artists}
    </>
  );
  return song.url ? (
    <a href={song.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
      {text}
    </a>
  ) : (
    text
  );
}

export async function nowPlayingOutput(): Promise<ReactNode> {
  const music = await loadMusic();
  if (!music?.enabled) return "radio not plugged in yet. soon.";
  const now = music.now;
  if (now.state === "playing" || now.state === "paused") {
    return (
      <span className="block">
        <span className="text-accent">{now.state === "playing" ? "▶ now playing" : "❚❚ paused on"}</span>{" "}
        <SongLink song={now.song} />{" "}
        <span className="text-muted-foreground">
          [{time(now.progressMs)} / {time(now.durationMs)}]
        </span>
      </span>
    );
  }
  if (now.state === "recent") {
    const mins = Math.max(1, Math.round((Date.now() - Date.parse(now.playedAt)) / 60_000));
    return (
      <span className="block">
        radio off. last played {mins}m ago: <SongLink song={now.song} />
      </span>
    );
  }
  return "radio off. zarif is either sleeping or debugging in silence.";
}

export async function playlistOutput(all = false): Promise<ReactNode> {
  const music = await loadMusic();
  const list = music?.playlist;
  if (!list) return "no playlist yet. zarif still choosing. (it's hard ok)";
  if (!list.songs.length) {
    return (
      <span className="block">
        couldn&apos;t read the songs right now. scroll down to the playlist card, or{" "}
        <a href={`https://open.spotify.com/playlist/${list.id}`} target="_blank" rel="noreferrer" className="underline">
          open it on spotify
        </a>
        .
      </span>
    );
  }
  return (
    <span className="block">
      <span className="block text-accent">
        {list.name}: {list.total} songs, slow pop, on repeat
      </span>
      {(all ? list.songs : list.songs.slice(0, 10)).map((song, i) => (
        <span key={`${song.title}-${i}`} className="block">
          {String(i + 1).padStart(2, " ")}. <SongLink song={song} />
        </span>
      ))}
      {!all && list.songs.length > 10 ? (
        <span className="mt-1 block text-muted-foreground">
          ...and {list.total - 10} more. type <span className="text-foreground">playlist all</span> for the rest.
        </span>
      ) : null}
      {all && list.total > list.songs.length ? (
        <span className="mt-1 block text-muted-foreground">...plus {list.total - list.songs.length} more on spotify.</span>
      ) : null}
      <span className="mt-1 block">
        full playlist:{" "}
        <a href={list.url ?? `https://open.spotify.com/playlist/${list.id}`} target="_blank" rel="noreferrer" className="underline">
          open in spotify
        </a>{" "}
        · or play it in the card further down
      </span>
    </span>
  );
}
