/** Live readings from the laptop that hosts the site (via Netdata). Any field can be null. */
export type Vitals =
  | {
      ok: true;
      checkedAt: string;
      cpu: number | null; // % busy
      tempC: number | null; // hottest CPU/package sensor
      ramPct: number | null; // % used
      load1: number | null;
    }
  | { ok: false; checkedAt: string; reason?: string };

/** voyager overheats at these levels. */
export const HOT_TEMP_C = 80;
export const HOT_CPU = 85;

export const isHot = (v: Vitals | null) =>
  !!v && v.ok && ((v.tempC ?? 0) >= HOT_TEMP_C || (v.cpu ?? 0) >= HOT_CPU);
