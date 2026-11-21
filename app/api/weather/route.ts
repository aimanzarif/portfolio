import { skyFromCode, type Weather } from "@/lib/weather";

/*
 * Current weather in Klang from Open-Meteo (free, no key), for the mascot window.
 * Cached for 10 minutes on the server so every visitor shares one request.
 */
const BASE = (process.env.WEATHER_URL ?? "https://api.open-meteo.com").replace(/\/$/, "");
const QUERY = "/v1/forecast?latitude=3.0449&longitude=101.4456&current=weather_code,cloud_cover&timezone=Asia%2FKuala_Lumpur";
const TTL_MS = 10 * 60_000;

let cached: { at: number; weather: Weather } | null = null;

export async function GET() {
  if (!cached || Date.now() - cached.at > TTL_MS) {
    let weather: Weather;
    try {
      const res = await fetch(`${BASE}${QUERY}`, { signal: AbortSignal.timeout(4000), cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { current?: { weather_code?: number; cloud_cover?: number } };
      const code = Number(json.current?.weather_code);
      if (!Number.isFinite(code)) throw new Error("no weather code");
      weather = { ok: true, sky: skyFromCode(code, Number(json.current?.cloud_cover ?? 0)), checkedAt: new Date().toISOString() };
    } catch {
      weather = { ok: false, sky: "clear", checkedAt: new Date().toISOString() };
    }
    // Failures are kept for 1 minute only, so a blip doesn't stick for 10.
    cached = { at: weather.ok ? Date.now() : Date.now() - TTL_MS + 60_000, weather };
  }
  return Response.json(cached.weather, { headers: { "Cache-Control": "public, max-age=300" } });
}
