import type { MonitorStatus, StatusMonitor, StatusReport } from "@/lib/status";

/*
 * Proxies the *public* Uptime Kuma status page, so the browser only ever talks to this site
 * (keeps the strict CSP intact) and Uptime Kuma is hit at most once a minute.
 * Configure at runtime with UPTIME_KUMA_URL and UPTIME_KUMA_SLUG.
 */
const BASE = (process.env.UPTIME_KUMA_URL ?? "https://uptimekuma.zarep.my").replace(/\/$/, "");
const SLUG = process.env.UPTIME_KUMA_SLUG ?? "zarep";
const TTL_MS = 60_000;

let cached: { at: number; report: StatusReport } | null = null;

type PageJson = {
  publicGroupList?: { monitorList?: { id: number; name: string }[] }[];
};
type HeartbeatJson = {
  heartbeatList?: Record<string, { status: number }[]>;
  uptimeList?: Record<string, number>;
};

const STATUS: Record<number, MonitorStatus> = { 0: "down", 1: "up", 2: "pending", 3: "maintenance" };

async function load(): Promise<StatusReport> {
  const checkedAt = new Date().toISOString();
  try {
    const opts = { signal: AbortSignal.timeout(4000), cache: "no-store" as const };
    const [pageRes, beatRes] = await Promise.all([
      fetch(`${BASE}/api/status-page/${SLUG}`, opts),
      fetch(`${BASE}/api/status-page/heartbeat/${SLUG}`, opts),
    ]);
    if (!pageRes.ok || !beatRes.ok) {
      return { ok: false, checkedAt, reason: `HTTP ${pageRes.status}/${beatRes.status} from ${BASE} (slug "${SLUG}")` };
    }
    if (!(pageRes.headers.get("content-type") ?? "").includes("json")) {
      return { ok: false, checkedAt, reason: `Non-JSON reply from ${BASE}; a Cloudflare challenge or login page is likely in the way` };
    }

    const page = (await pageRes.json()) as PageJson;
    const beats = (await beatRes.json()) as HeartbeatJson;

    const monitors: StatusMonitor[] = (page.publicGroupList ?? [])
      .flatMap((group) => group.monitorList ?? [])
      .map((monitor) => {
        const list = beats.heartbeatList?.[String(monitor.id)] ?? [];
        const last = list[list.length - 1];
        const uptime = beats.uptimeList?.[`${monitor.id}_24`];
        return {
          name: monitor.name,
          status: last ? (STATUS[last.status] ?? "pending") : "pending",
          uptime24: typeof uptime === "number" ? Math.round(uptime * 10000) / 100 : null,
        };
      });

    return { ok: true, checkedAt, monitors };
  } catch (error) {
    const cause = error instanceof Error ? (error.cause instanceof Error ? error.cause.message : error.message) : "unknown";
    return { ok: false, checkedAt, reason: `Could not reach ${BASE}: ${cause}` };
  }
}

export async function GET() {
  if (!cached || Date.now() - cached.at > TTL_MS) {
    cached = { at: Date.now(), report: await load() };
  }
  return Response.json(cached.report, {
    headers: { "Cache-Control": "public, max-age=30, s-maxage=60" },
  });
}
