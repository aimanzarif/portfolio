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

const PLAYLIST_ID = /^[A-Za-z0-9]{10,40}$/;

/** Songs shown before "show all". */
const SHOWN = 10;

export function Playlist() {
  const music = useMusic();
  const [player, setPlayer] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const list = music?.playlist;
  if (!list || !PLAYLIST_ID.test(list.id)) return null;

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
          <div className="grid gap-6 p-5 md:grid-cols-2 md:gap-8">
            {/* track list from the API: fills the same height as the player beside it */}
            <div className="flex min-w-0 flex-col md:h-[352px]">
              <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                {list.name} · {list.total} songs
              </p>
              {list.songs.length ? (
                <ol
                  id="playlist-songs"
                  className={`mt-3 flex min-h-0 flex-1 flex-col gap-1.5 font-mono text-[13px] ${
                    showAll ? "max-h-[26rem] overflow-y-auto pr-2 md:max-h-none" : "md:justify-between md:py-1"
                  }`}
                >
                  {(showAll ? list.songs : list.songs.slice(0, SHOWN)).map((song, i) => (
                    <li key={`${song.title}-${i}`} className="flex min-w-0 shrink-0 gap-3">
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
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[13px]">
                {list.songs.length > SHOWN ? (
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    aria-expanded={showAll}
                    aria-controls="playlist-songs"
                    className="underline underline-offset-4"
                  >
                    {showAll ? "show less" : `show all ${list.total} songs`}
                  </button>
                ) : null}
                <a href={spotifyUrl} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-4">
                  open in spotify →
                </a>
              </div>
            </div>

            {/* the player, only on request. The slot is always the player's real height, so nothing jumps. */}
            <div className="h-[352px] self-start">
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
                  aria-label="Play it here (loads the Spotify player)"
                  className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border-2 border-dashed border-line text-left font-mono text-[13px] transition-colors hover:border-accent"
                >
                  {/* a ghost of the Spotify player, at its real size */}
                  <span aria-hidden className="flex items-center gap-4 p-4 opacity-40">
                    <span className="grid size-20 shrink-0 grid-cols-2 gap-px overflow-hidden rounded-md">
                      <span className="bg-muted-foreground/50" />
                      <span className="bg-muted-foreground/30" />
                      <span className="bg-muted-foreground/30" />
                      <span className="bg-muted-foreground/50" />
                    </span>
                    <span className="min-w-0 flex-1 space-y-2">
                      <span className="block truncate font-sans text-lg font-bold">{list.name}</span>
                      <span className="block h-2 w-24 rounded-sm bg-muted-foreground/40" />
                    </span>
                  </span>
                  <span aria-hidden className="flex-1 space-y-3 border-t border-line px-4 pt-4 opacity-40">
                    {list.songs.slice(0, 4).map((song, i) => (
                      <span key={`${song.title}-${i}`} className="flex items-center gap-3">
                        <span className="w-3 text-muted-foreground">{i + 1}</span>
                        <span className="min-w-0 flex-1 truncate">{song.title}</span>
                        <span className="h-2 w-8 rounded-sm bg-muted-foreground/40" />
                      </span>
                    ))}
                  </span>
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/85 transition-colors group-hover:text-accent">
                    <svg viewBox="0 0 7 7" className="size-8" shapeRendering="crispEdges" aria-hidden>
                      <path d="M1 0h1v1h1v1h1v1h1v1H4v1H3v1H2v1H1z" fill="currentColor" />
                    </svg>
                    play it here
                    <span className="text-[11px] text-muted-foreground">(loads the Spotify player)</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </article>
      </Reveal>
    </Section>
  );
}
