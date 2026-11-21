/** Whole days since a Klang-time date (YYYY-MM-DD). Pages are rendered per request, so this ticks daily. */
export function daysSince(date: string, now: number = Date.now()) {
  const start = Date.parse(`${date}T00:00:00+08:00`);
  return Math.max(0, Math.floor((now - start) / 86_400_000));
}
