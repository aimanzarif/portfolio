/* Server-side Cloudflare Turnstile verification, shared by the guestbook and the phone reveal. */

export const TURNSTILE_SITE_KEY = process.env.TURNSTILE_SITE_KEY ?? "";
const SECRET = process.env.TURNSTILE_SECRET ?? "";

// Local development only: skip the Turnstile round trip.
const DEV_BYPASS = SECRET === "dev-bypass" && process.env.NODE_ENV !== "production";

export const turnstileEnabled = () => Boolean(TURNSTILE_SITE_KEY && SECRET);

// Tokens are only accepted if they were solved on one of these hosts. The widget is shared with
// other sites (SmartRoute), so a token solved there must not count here.
const ALLOWED_HOSTNAMES = new Set(
  (process.env.TURNSTILE_HOSTNAMES ?? "zarep.my,www.zarep.my,staging.zarep.my")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean),
);

export const clientIp = (req: Request) =>
  req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

export async function verifyTurnstile(token: string, ip: string) {
  if (DEV_BYPASS) return true;
  if (!token) return false;
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
