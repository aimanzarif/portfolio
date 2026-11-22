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
          <div className="grid gap-6 p-5 md:grid-cols-[1fr_minmax(0,22rem)]">
            {/* track list from the API */}
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                {list.name} · {list.total} songs
              </p>
              {list.songs.length ? (
                <ol
                  id="playlist-songs"
                  className={`mt-3 space-y-1.5 font-mono text-[13px] ${showAll ? "max-h-[26rem] overflow-y-auto pr-2" : ""}`}
                >
                  {(showAll ? list.songs : list.songs.slice(0, 8)).map((song, i) => (
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
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[13px]">
                {list.songs.length > 8 ? (
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
