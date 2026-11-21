import type { Vitals } from "@/lib/vitals";

/*
 * Proxies a few numbers from Netdata (never Netdata itself) so voyager can react to the real laptop.
 * NETDATA_URL is the address the container can reach Netdata on, e.g. http://netdata:19999.
 * Results are cached for 15 seconds so visitors can't hammer Netdata.
 */
const BASE = (process.env.NETDATA_URL ?? "http://netdata:19999").replace(/\/$/, "");
const TTL_MS = 15_000;
const CHARTS_TTL_MS = 10 * 60_000;

let cached: { at: number; vitals: Vitals } | null = null;
let tempChart: { at: number; id: string | null } | null = null;

type ChartData = { labels: string[]; data: number[][] };

const get = (path: string) =>
  fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(3000), cache: "no-store" }).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
    return res.json();
  });

/** Latest row of a chart as { dimension: value }. */
async function latest(chart: string): Promise<Record<string, number> | null> {
  try {
    const json = (await get(`/api/v1/data?chart=${encodeURIComponent(chart)}&after=-10&points=1&group=average&format=json`)) as ChartData;
    const row = json.data?.[0];
    if (!row) return null;
    return Object.fromEntries(json.labels.slice(1).map((label, i) => [label, Number(row[i + 1])]));
  } catch {
    return null;
  }
}

/** Find a CPU temperature chart once; sensor chart names differ between machines. */
async function findTempChart(): Promise<string | null> {
  if (tempChart && Date.now() - tempChart.at < CHARTS_TTL_MS) return tempChart.id;
  let id: string | null = null;
  try {
    const json = (await get("/api/v1/charts")) as { charts?: Record<string, { units?: string; title?: string }> };
    const charts = Object.entries(json.charts ?? {}).filter(([, c]) => /celsius|°c/i.test(c.units ?? ""));
    const score = (name: string) =>
      /coretemp|k10temp|package|cpu|x86_pkg/i.test(name) ? 0 : /acpi|thermal/i.test(name) ? 1 : 2;
    charts.sort(([a, ca], [b, cb]) => score(`${a} ${ca.title}`) - score(`${b} ${cb.title}`));
    id = charts[0]?.[0] ?? null;
  } catch {
    id = null;
  }
  tempChart = { at: Date.now(), id };
  return id;
}

async function load(): Promise<Vitals> {
  const checkedAt = new Date().toISOString();
  const [cpu, ram, loadAvg, tempId] = await Promise.all([
    latest("system.cpu"),
    latest("system.ram"),
    latest("system.load"),
    findTempChart(),
  ]);
  if (!cpu && !ram && !loadAvg) return { ok: false, checkedAt, reason: `Could not reach Netdata at ${BASE}` };

  const temp = tempId ? await latest(tempId) : null;
  const sum = (o: Record<string, number> | null) => (o ? Object.values(o).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0) : 0);
  const round = (n: number, d = 0) => Math.round(n * 10 ** d) / 10 ** d;

  let ramPct: number | null = null;
  if (ram) {
    const total = sum(ram);
    const used = ram.used ?? 0;
    ramPct = total > 0 ? round((used / total) * 100) : null;
  }
  const temps = temp ? Object.values(temp).filter((v) => Number.isFinite(v) && v > 0 && v < 130) : [];

  return {
    ok: true,
    checkedAt,
    cpu: cpu ? round(Math.min(100, sum(cpu))) : null, // system.cpu excludes idle, so the sum is "busy"
    tempC: temps.length ? round(Math.max(...temps)) : null,
    ramPct,
    load1: loadAvg?.load1 !== undefined ? round(loadAvg.load1, 2) : null,
  };
}

export async function GET() {
  if (!cached || Date.now() - cached.at > TTL_MS) {
    cached = { at: Date.now(), vitals: await load() };
  }
  return Response.json(cached.vitals, { headers: { "Cache-Control": "public, max-age=10, s-maxage=15" } });
}
