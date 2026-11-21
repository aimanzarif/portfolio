export type Sky = "clear" | "cloudy" | "rain" | "storm";
export type Weather = { ok: boolean; sky: Sky; checkedAt: string };

/** WMO weather codes from Open-Meteo, folded into what the pixel window can draw. */
export function skyFromCode(code: number, cloudCover: number): Sky {
  if (code >= 95) return "storm";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code === 3 || code === 45 || code === 48 || cloudCover >= 80) return "cloudy";
  return "clear";
}
