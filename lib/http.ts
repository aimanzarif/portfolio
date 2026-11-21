/* Small request helpers for route handlers. */

export class BodyTooLarge extends Error {}

/**
 * Parse a JSON body, refusing anything over `maxBytes` before it is buffered in full.
 * Checks Content-Length first, then counts bytes while streaming (for chunked bodies).
 */
export async function readJsonLimited(req: Request, maxBytes: number): Promise<unknown> {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > maxBytes) throw new BodyTooLarge();
  if (!req.body) throw new SyntaxError("empty body");

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new BodyTooLarge();
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

const LOOPBACK = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

/**
 * True unless the request was made from inside the container itself (scripts/guestbook.sh).
 * Cloudflare adds cf-connecting-ip / cf-ray and Nginx Proxy Manager adds x-real-ip, so any of those
 * means the internet. Next.js fills x-forwarded-for with the caller's address when it is missing,
 * so a direct in-container call shows only loopback addresses there.
 */
export function cameThroughProxy(req: Request) {
  if (["cf-connecting-ip", "cf-ray", "x-real-ip"].some((h) => req.headers.has(h))) return true;
  const hops = (req.headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);
  return hops.length === 0 ? false : !hops.every((h) => LOOPBACK.has(h));
}
