import { getNowPlaying, spotifyEnabled, type NowPlaying } from "@/lib/spotify";

/*
 * The "now playing" that the public sees, on purpose not quite live:
 *
 *   - Delay: Spotify is polled in the background every 30 s and the answers are kept for a short
 *     while. Visitors only ever get what was playing MUSIC_DELAY_MINUTES ago (default 15), so the
 *     site can't be used to tell what Zarif is doing right now. The delay is deliberately not
 *     mentioned anywhere visitors can see, including the API response.
 *   - Quiet hours: during MUSIC_QUIET_HOURS (default 0-7, Klang time) Spotify isn't asked at all and
 *     the section shows "Flow state mode". Because of the delay, the first songs after quiet hours
 *     appear 15 minutes after they end.
 *
 * Polling starts at server start (instrumentation.ts) and, as a fallback, on the first request.
 * The state lives on globalThis so the instrumentation and the route share one copy.
 */

const POLL_MS = 30_000;
const TIME_ZONE = "Asia/Kuala_Lumpur";

const delayMs = () => {
  const minutes = Number(process.env.MUSIC_DELAY_MINUTES ?? 15);
  return Number.isFinite(minutes) && minutes >= 0 ? minutes * 60_000 : 15 * 60_000;
};

/** "0-7" = from 00:00 up to 07:00. "22-6" wraps past midnight. "off" or "" = no quiet hours. */
function quietRange(): [number, number] | null {
  const raw = (process.env.MUSIC_QUIET_HOURS ?? "0-7").trim();
  const m = /^(\d{1,2})-(\d{1,2})$/.exec(raw);
  if (!m) return null;
  const [from, to] = [Number(m[1]), Number(m[2])];
  return from <= 23 && to <= 24 && from !== to ? [from, to] : null;
}

const hourFormat = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "numeric", hourCycle: "h23" });

export function isQuiet(at = Date.now()) {
  const range = quietRange();
  if (!range) return false;
  const hour = Number(hourFormat.format(at));
  const [from, to] = range;
  return from < to ? hour >= from && hour < to : hour >= from || hour < to;
}

type Sample = { at: number; value: NowPlaying };
type Feed = { samples: Sample[]; timer: ReturnType<typeof setInterval> | null; polling: Promise<void> | null };

const store = globalThis as typeof globalThis & { __musicFeed?: Feed };
const feed: Feed = (store.__musicFeed ??= { samples: [], timer: null, polling: null });

async function poll() {
  const at = Date.now();
  let value: NowPlaying;
  if (isQuiet(at)) {
    value = { state: "idle" }; // don't even ask Spotify
  } else {
    try {
      value = await getNowPlaying();
    } catch (error) {
      console.warn(`[music] ${error instanceof Error ? error.message : error}`);
      return; // leave a gap; a long gap shows as "idle"
    }
  }
  feed.samples.push({ at, value });
  const keepFrom = Date.now() - delayMs() - 5 * 60_000;
  while (feed.samples.length && feed.samples[0].at < keepFrom) feed.samples.shift();
}

function pollOnce() {
  feed.polling ??= poll().finally(() => {
    feed.polling = null;
  });
  return feed.polling;
}

export function startMusicFeed() {
  if (feed.timer || !spotifyEnabled()) return;
  void pollOnce();
  feed.timer = setInterval(() => void pollOnce(), POLL_MS);
  feed.timer.unref?.(); // never keeps the process alive on its own
}

/** What was playing `delay` ago, with the progress bar moved to that moment. */
export function delayedNowPlaying(now = Date.now()): NowPlaying {
  startMusicFeed();
  if (isQuiet(now)) return { state: "idle" };
  const target = now - delayMs();
  let sample: Sample | undefined;
  for (const s of feed.samples) {
    if (s.at <= target) sample = s;
    else break;
  }
  // No sample old enough yet (server just started), or Spotify was unreachable back then.
  if (!sample || target - sample.at > 2 * POLL_MS + 5_000) return { state: "idle" };
  const value = sample.value;
  if (value.state !== "playing") return value;
  const progressMs = value.progressMs + (target - sample.at);
  return { ...value, progressMs: value.durationMs ? Math.min(progressMs, value.durationMs) : progressMs };
}
