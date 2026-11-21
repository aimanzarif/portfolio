import { BodyTooLarge, readJsonLimited } from "@/lib/http";
import { clientIp, TURNSTILE_SITE_KEY, turnstileEnabled, verifyTurnstile } from "@/lib/turnstile";

/*
 * "Show my number": the phone number is never in the page or the JavaScript bundle. It lives in
 * CONTACT_PHONE (server .env) and is only returned after a passed Turnstile check, so scrapers never
 * see it. Also rate-limited per IP.
 */

const PHONE = (process.env.CONTACT_PHONE ?? "").trim();
const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

const LIMIT_PER_HOUR = 10;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > LIMIT_PER_HOUR;
}

const enabled = () => Boolean(PHONE) && turnstileEnabled();

export function GET() {
  return Response.json({ enabled: enabled(), siteKey: enabled() ? TURNSTILE_SITE_KEY : null }, { headers: NO_STORE });
}

export async function POST(req: Request) {
  if (!enabled()) return Response.json({ ok: false, error: "closed" }, { status: 404, headers: NO_STORE });

  let token = "";
  try {
    const body = (await readJsonLimited(req, 4096)) as { token?: unknown } | null;
    token = typeof body?.token === "string" ? body.token : "";
  } catch (error) {
    const status = error instanceof BodyTooLarge ? 413 : 400;
    return Response.json({ ok: false, error: "bad_request" }, { status, headers: NO_STORE });
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429, headers: NO_STORE });
  if (!(await verifyTurnstile(token, ip))) {
    return Response.json({ ok: false, error: "captcha_failed" }, { status: 403, headers: NO_STORE });
  }

  const digits = PHONE.replace(/[^\d+]/g, "");
  return Response.json({ ok: true, phone: PHONE, href: `tel:${digits}` }, { headers: NO_STORE });
}
