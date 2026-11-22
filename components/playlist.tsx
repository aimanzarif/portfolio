"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { Section, SectionHeading } from "@/components/site";
import { useMusic } from "@/lib/use-music";

/*
 * "Late night playlist": Zarif's slow pop playlist from Spotify, plus what's on right now.
 * The Spotify player is only loaded when the visitor asks for it ("play it here"), so nobody
 * talks to Spotify just by opening the site.
 */

const time = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const PLAYLIST_ID = /^[A-Za-z0-9]{10,40}$/;

export function Playlist() {
  const music = useMusic();
  const [player, setPlayer] = useState(false);
  const list = music?.playlist;
  if (!list || !PLAYLIST_ID.test(list.id)) return null;

  const now = music.now;
  const spotifyUrl = list.url ?? `https://open.spotify.com/playlist/${list.id}`;

  return (
    <Section id="playlist">
      <Reveal>
        <SectionHeading
          eyebrow="On repeat · slow pop"
          title="Late night playlist."
          copy="What plays while I fix things at 2am. Slow pop, mostly. Don't judge."
        />
      </Reveal>
      <Reveal tilt>
        <article className="overflow-hidden rounded-xl border-2 border-line bg-card">
          {/* now playing strip */}
          <div className="flex items-center gap-3 border-b-2 border-dashed border-line px-5 py-3 font-mono text-[13px]">
            <span
              aria-hidden
              className={`inline-block size-2.5 shrink-0 rounded-full ${
                now.state === "playing" ? "led bg-accent" : now.state === "paused" ? "bg-[#e9b23a]" : "bg-muted-foreground/40"
              }`}
            />
            {now.state === "playing" || now.state === "paused" ? (
              <span className="min-w-0 truncate">
                <span className="text-muted-foreground">{now.state === "playing" ? "now playing:" : "paused:"}</span>{" "}
                {now.song.url ? (
                  <a href={now.song.url} target="_blank" rel="noreferrer" className="font-bold hover:underline">
                    {now.song.title}
                  </a>
                ) : (
                  <span className="font-bold">{now.song.title}</span>
                )}{" "}
                <span className="text-muted-foreground">— {now.song.artists}</span>{" "}
                <span className="text-muted-foreground/70">
                  {time(now.progressMs)} / {time(now.durationMs)}
                </span>
              </span>
            ) : now.state === "recent" ? (
              <span className="min-w-0 truncate text-muted-foreground">
                radio off. last played: <span className="text-foreground">{now.song.title}</span> — {now.song.artists}
              </span>
            ) : (
              <span className="text-muted-foreground">radio off right now. zarif is probably sleeping.</span>
            )}
          </div>

          <div className="grid gap-6 p-5 md:grid-cols-[1fr_minmax(0,22rem)]">
            {/* track list from the API */}
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">{list.name}</p>
              {list.songs.length ? (
                <ol className="mt-3 space-y-1.5 font-mono text-[13px]">
                  {list.songs.slice(0, 8).map((song, i) => (
                    <li key={`${song.title}-${i}`} className="flex min-w-0 gap-3">
                      <span className="w-5 shrink-0 text-right text-muted-foreground">{i + 1}</span>
                      <span className="min-w-0 truncate">
                        {song.url ? (
                          <a href={song.url} target="_blank" rel="noreferrer" className="hover:underline">
                            {song.title}
                          </a>
                        ) : (
                          song.title
                        )}{" "}
                        <span className="text-muted-foreground">— {song.artists}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-[15px] text-muted-foreground">The song list is shy right now. Play it below instead.</p>
              )}
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block font-mono text-[13px] text-accent underline underline-offset-4"
              >
                open the full playlist in spotify →
              </a>
            </div>

            {/* the player, only on request */}
            <div className="min-h-[152px]">
              {player ? (
                <iframe
                  title={`${list.name} on Spotify`}
                  src={`https://open.spotify.com/embed/playlist/${list.id}?theme=0`}
                  className="h-[352px] w-full rounded-xl border-0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlayer(true)}
                  className="flex h-full min-h-[152px] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line font-mono text-[13px] transition-colors hover:border-accent hover:text-accent"
                >
                  <svg viewBox="0 0 7 7" className="size-8" shapeRendering="crispEdges" aria-hidden>
                    <path d="M1 0h1v1h1v1h1v1h1v1H4v1H3v1H2v1H1z" fill="currentColor" />
                  </svg>
                  play it here
                  <span className="text-[11px] text-muted-foreground">(loads the Spotify player)</span>
                </button>
              )}
            </div>
          </div>
        </article>
      </Reveal>
    </Section>
  );
}
