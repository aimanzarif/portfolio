"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/reveal";
import { Section, SectionHeading } from "@/components/site";
import { useEmbedPlayback } from "@/lib/embed-playback";
import { clock, songForUri } from "@/lib/music-shared";
import { useMusic } from "@/lib/use-music";
import type { Song } from "@/lib/spotify";

/*
 * "Now listening": the song playing right now, big. Priority:
 *   1. the embedded player on this page, if this visitor pressed play;
 *   2. what Zarif is playing on Spotify (his app, phone or speaker);
 *   3. otherwise "Flow state mode": no music, probably debugging in silence.
 */

type Live = {
  source: "page" | "zarif";
  state: "playing" | "paused";
  song: Song | null;
  position: number; // ms, at `at`
  duration: number;
  at: number; // client time the position was read
};

function Equalizer({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 11 8" className="h-10 w-14 shrink-0" shapeRendering="crispEdges" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={i * 2 + 0.5}
          y={0}
          width={1.4}
          height={8}
          className={on ? "eq-bar fill-accent" : "fill-muted-foreground/40"}
          style={on ? { animationDelay: `${[0, 0.35, 0.15, 0.5, 0.25][i]}s` } : { transform: "scaleY(0.25)", transformOrigin: "bottom", transformBox: "fill-box" }}
        />
      ))}
    </svg>
  );
}

export function NowListening() {
  const music = useMusic();
  const embed = useEmbedPlayback();
  const [, tick] = useState(0);

  let live: Live | null = null;
  if (embed.playing && embed.uri) {
    live = {
      source: "page",
      state: "playing",
      song: songForUri(embed.uri, music?.playlist?.songs),
      position: embed.position,
      duration: embed.duration,
      at: embed.at,
    };
  } else if (music?.now.state === "playing" || music?.now.state === "paused") {
    live = {
      source: "zarif",
      state: music.now.state,
      song: music.now.song,
      position: music.now.progressMs,
      duration: music.now.durationMs,
      at: music.receivedAt,
    };
  }

  const moving = live?.state === "playing";
  useEffect(() => {
    if (!moving) return;
    const id = window.setInterval(() => tick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [moving]);

  if (!music?.enabled) return null;

  // eslint-disable-next-line react-hooks/purity -- the bar is meant to move with the clock
  const position = live ? Math.min(live.duration || Infinity, live.position + (moving ? Date.now() - live.at : 0)) : 0;
  const pct = live?.duration ? Math.min(100, (position / live.duration) * 100) : 0;
  const recent = music.now.state === "recent" ? music.now : null;

  return (
    <Section id="now-listening">
      <Reveal>
        <SectionHeading
          eyebrow={live ? (live.source === "page" ? "Playing on this page" : "Live from my headphones") : "Headphones off"}
          title={live ? "Now listening." : "Flow state mode."}
          copy={
            live
              ? live.source === "page"
                ? "You pressed play on my playlist. Good taste, I see."
                : "Straight from my Spotify, right now. Yes, it's slow pop again."
              : "No music right now. Probably debugging something in total silence. Jangan kacau ah."
          }
        />
      </Reveal>
      <Reveal tilt>
        <article className="rounded-xl border-2 border-line bg-card p-5 md:p-6">
          {live ? (
            <div className="flex items-center gap-5">
              <Equalizer on={live.state === "playing"} />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                  {live.state === "paused" ? "paused" : live.source === "page" ? "playing here" : "zarif is listening to"}
                </p>
                <p className="mt-1 truncate text-2xl font-bold md:text-3xl">
                  {live.song?.url ? (
                    <a href={live.song.url} target="_blank" rel="noreferrer" className="hover:underline">
                      {live.song.title}
                    </a>
                  ) : (
                    (live.song?.title ?? "a song from the playlist")
                  )}
                </p>
                {live.song ? <p className="truncate text-[15px] text-muted-foreground">{live.song.artists}</p> : null}
                <div className="mt-4 flex items-center gap-3 font-mono text-[12px] text-muted-foreground">
                  <span>{clock(position)}</span>
                  <span className="relative h-2 flex-1 overflow-hidden rounded-sm border border-line" aria-hidden>
                    <span className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${pct}%` }} />
                  </span>
                  <span>{clock(live.duration)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Equalizer on={false} />
              <div className="min-w-0 flex-1 font-mono text-[14px]">
                <p>
                  <span className="text-accent">$</span> focus --mode=flow --music=off<span className="caret-blink ml-1 inline-block h-4 w-2 translate-y-0.5 bg-accent" aria-hidden />
                </p>
                <p className="mt-2 text-muted-foreground">
                  {recent ? (
                    <>
                      last song before the silence: <span className="text-foreground">{recent.song.title}</span> — {recent.song.artists}
                    </>
                  ) : (
                    "headphones are off. something is probably being fixed."
                  )}
                </p>
              </div>
            </div>
          )}
        </article>
      </Reveal>
    </Section>
  );
}
