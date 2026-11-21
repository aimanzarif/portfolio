import { isAdmin, listPending, setStatus } from "@/lib/guestbook-store";
import { cameThroughProxy, readJsonLimited } from "@/lib/http";

/*
 * Moderation API for scripts/guestbook.sh, which calls it from inside the container (127.0.0.1).
 * Needs "Authorization: Bearer $GUESTBOOK_ADMIN_TOKEN", and is never reachable from the internet:
 * anything that came through Cloudflare or Nginx Proxy Manager gets a 404, even with the right token.
 */

const notFound = () => new Response("Not found", { status: 404 });
const allowed = (req: Request) => !cameThroughProxy(req) && isAdmin(req.headers.get("authorization"));

export async function GET(req: Request) {
  if (!allowed(req)) return notFound();
  return Response.json({ pending: await listPending() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  if (!allowed(req)) return notFound();
  const { id, action } = ((await readJsonLimited(req, 1024).catch(() => ({}))) ?? {}) as { id?: string; action?: string };
  if (typeof id !== "string" || !id || !["approve", "reject", "delete"].includes(action ?? "")) {
    return Response.json({ ok: false, error: "need id and action (approve | reject | delete)" }, { status: 400 });
  }
  const ok = await setStatus(id, action as "approve" | "reject" | "delete");
  return Response.json({ ok }, { status: ok ? 200 : 404 });
}
