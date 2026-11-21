import { isAdmin, listPending, setStatus } from "@/lib/guestbook-store";

/* Moderation API. Needs "Authorization: Bearer $GUESTBOOK_ADMIN_TOKEN"; returns 404 otherwise. */

const notFound = () => new Response("Not found", { status: 404 });

export async function GET(req: Request) {
  if (!isAdmin(req.headers.get("authorization"))) return notFound();
  return Response.json({ pending: await listPending() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  if (!isAdmin(req.headers.get("authorization"))) return notFound();
  const { id, action } = (await req.json().catch(() => ({}))) as { id?: string; action?: string };
  if (!id || !["approve", "reject", "delete"].includes(action ?? "")) {
    return Response.json({ ok: false, error: "need id and action (approve | reject | delete)" }, { status: 400 });
  }
  const ok = await setStatus(id, action as "approve" | "reject" | "delete");
  return Response.json({ ok }, { status: ok ? 200 : 404 });
}
