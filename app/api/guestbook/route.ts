import { addEntry, clean, hashIp, LIMITS, listApproved } from "@/lib/guestbook-store";
import { BodyTooLarge, readJsonLimited } from "@/lib/http";
import { clientIp, TURNSTILE_SITE_KEY, turnstileEnabled, verifyTurnstile } from "@/lib/turnstile";

/* Public guestbook API: GET lists approved entries, POST signs (Turnstile-checked, moderated). */

// A guestbook signature is tiny; anything bigger is not a real request.
const MAX_BODY_BYTES = 4096;

export async function GET() {
  return Response.json(
    { enabled: turnstileEnabled(), siteKey: turnstileEnabled() ? TURNSTILE_SITE_KEY : null, entries: await listApproved(10), limits: LIMITS },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: Request) {
  if (!turnstileEnabled()) return Response.json({ ok: false, error: "closed" }, { status: 503 });

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
