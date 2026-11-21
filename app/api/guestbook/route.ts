import { addEntry, clean, hashIp, LIMITS, listApproved } from "@/lib/guestbook-store";
import { BodyTooLarge, readJsonLimited } from "@/lib/http";

/* Public guestbook API: GET lists approved entries, POST signs (Turnstile-checked, moderated). */

const SITE_KEY = process.env.TURNSTILE_SITE_KEY ?? "";
const SECRET = process.env.TURNSTILE_SECRET ?? "";
// Local development only: skip the Turnstile round trip.
const DEV_BYPASS = SECRET === "dev-bypass" && process.env.NODE_ENV !== "production";

const enabled = () => Boolean(SITE_KEY && SECRET);

// A guestbook signature is tiny; anything bigger is not a real request.
const MAX_BODY_BYTES = 4096;

// Turnstile tokens are only accepted if they were solved on one of these hosts. The widget is
// shared with other sites (SmartRoute), so a token solved there must not count here.
const ALLOWED_HOSTNAMES = new Set(
  (process.env.TURNSTILE_HOSTNAMES ?? "zarep.my,www.zarep.my,staging.zarep.my")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean),
);

const clientIp = (req: Request) =>
  req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

async function verifyTurnstile(token: string, ip: string) {
  if (DEV_BYPASS) return true;
  try {
    const body = new URLSearchParams({ secret: SECRET, response: token, remoteip: ip });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    const result = (await res.json()) as { success?: boolean; hostname?: string };
    return result.success === true && ALLOWED_HOSTNAMES.has((result.hostname ?? "").toLowerCase());
  } catch {
    return false;
  }
}

export async function GET() {
  return Response.json(
    { enabled: enabled(), siteKey: enabled() ? SITE_KEY : null, entries: await listApproved(10), limits: LIMITS },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: Request) {
  if (!enabled()) return Response.json({ ok: false, error: "closed" }, { status: 503 });

  let payload: { message?: unknown; name?: unknown; token?: unknown };
  try {
    payload = ((await readJsonLimited(req, MAX_BODY_BYTES)) ?? {}) as typeof payload;
  } catch (error) {
    if (error instanceof BodyTooLarge) return Response.json({ ok: false, error: "too_large" }, { status: 413 });
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (typeof payload !== "object") return Response.json({ ok: false, error: "bad_request" }, { status: 400 });

  const message = clean(payload.message, LIMITS.message);
  const name = clean(payload.name, LIMITS.name);
  const token = typeof payload.token === "string" ? payload.token : "";
  if (!message) return Response.json({ ok: false, error: "empty" }, { status: 400 });
  if (!token) return Response.json({ ok: false, error: "no_captcha" }, { status: 400 });

  const ip = clientIp(req);
  if (!(await verifyTurnstile(token, ip))) return Response.json({ ok: false, error: "captcha_failed" }, { status: 403 });

  const result = await addEntry(name, message, hashIp(ip));
  if (!result.ok) return Response.json(result, { status: 429 });
  return Response.json({ ok: true }, { status: 201 });
}
