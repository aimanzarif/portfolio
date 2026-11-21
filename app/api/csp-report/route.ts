import { BodyTooLarge, readJsonLimited } from "@/lib/http";

/*
 * Receives Content-Security-Policy violation reports from browsers (report-uri and report-to)
 * and writes a one-line summary to the server log: `docker logs portfolio | grep "\[csp\]"`.
 * Capped in size and rate so it can't be used to flood the log.
 */

const MAX_BYTES = 8192;
const MAX_PER_MINUTE = 60;
let windowStart = 0;
let count = 0;

type LegacyReport = { "csp-report"?: Record<string, unknown> };
type ModernReport = { type?: string; body?: Record<string, unknown> };

const text = (value: unknown, max = 120) => String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, max);

function summarize(report: Record<string, unknown>) {
  const directive = report["effective-directive"] ?? report.effectiveDirective ?? report["violated-directive"];
  const blocked = report["blocked-uri"] ?? report.blockedURL;
  const page = report["document-uri"] ?? report.documentURL;
  let path = "";
  try {
    path = new URL(String(page)).pathname;
  } catch {
    path = text(page, 60);
  }
  const sample = report["script-sample"] ?? report.sample;
  return `[csp] ${text(directive, 40)} blocked ${text(blocked)} on ${text(path, 60)}${sample ? ` sample=${JSON.stringify(text(sample, 60))}` : ""}`;
}

export async function POST(req: Request) {
  const now = Date.now();
  if (now - windowStart > 60_000) {
    windowStart = now;
    count = 0;
  }
  if (++count > MAX_PER_MINUTE) return new Response(null, { status: 204 });

  try {
    const body = (await readJsonLimited(req, MAX_BYTES)) as LegacyReport | ModernReport[] | null;
    const reports = Array.isArray(body)
      ? body.filter((r) => r?.type === "csp-violation" && r.body).map((r) => r.body!)
      : body?.["csp-report"]
        ? [body["csp-report"]]
        : [];
    for (const report of reports.slice(0, 5)) console.warn(summarize(report));
  } catch (error) {
    if (!(error instanceof BodyTooLarge)) {
      /* malformed report: ignore */
    }
  }
  return new Response(null, { status: 204 });
}
