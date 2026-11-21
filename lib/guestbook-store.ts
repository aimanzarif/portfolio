import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

/*
 * Tiny guestbook store: one JSON file on a Docker volume. Low traffic and moderated, so a file is
 * plenty. Writes are serialised in-process and atomic (write temp file, then rename).
 */

export type GuestbookStatus = "pending" | "approved" | "rejected";
export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  status: GuestbookStatus;
  /** Salted hash of the signer's IP, only for rate limiting. Never shown. */
  ipHash: string;
};
export type PublicEntry = Pick<GuestbookEntry, "id" | "name" | "message" | "createdAt">;

const FILE = process.env.GUESTBOOK_FILE ?? (process.env.NODE_ENV === "production" ? "/app/data/guestbook.json" : ".data/guestbook.json");
// Salt for the IP hashes. Its own secret; falls back to the admin token, and never to a public string
// (without either, a random per-process salt: rate limits then reset on restart, which is harmless).
const SALT = process.env.GUESTBOOK_SALT || process.env.GUESTBOOK_ADMIN_TOKEN || randomBytes(16).toString("hex");

export const LIMITS = { message: 140, name: 24, perIpPerHour: 3, maxPending: 50 } as const;

let queue: Promise<unknown> = Promise.resolve();
const serial = <T>(task: () => Promise<T>): Promise<T> => {
  const next = queue.then(task, task);
  queue = next.catch(() => undefined);
  return next;
};

async function readAll(): Promise<GuestbookEntry[]> {
  try {
    const data = JSON.parse(await readFile(FILE, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeAll(entries: GuestbookEntry[]) {
  await mkdir(dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(entries, null, 2), "utf8");
  await rename(tmp, FILE);
}

export const hashIp = (ip: string) => createHash("sha256").update(`${SALT}:${ip}`).digest("hex").slice(0, 32);

/** Strip control characters and collapse whitespace. React escapes everything else on display. */
export const clean = (value: unknown, max: number) =>
  String(value ?? "")
    .replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028-\u202e]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

export const toPublic = ({ id, name, message, createdAt }: GuestbookEntry): PublicEntry => ({ id, name, message, createdAt });

export async function listApproved(limit = 10): Promise<PublicEntry[]> {
  const all = await readAll();
  return all
    .filter((e) => e.status === "approved")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map(toPublic);
}

export async function listPending(): Promise<GuestbookEntry[]> {
  return (await readAll()).filter((e) => e.status === "pending");
}

export type AddResult = { ok: true } | { ok: false; error: "rate_limited" | "queue_full" };

export function addEntry(name: string, message: string, ipHash: string): Promise<AddResult> {
  return serial(async () => {
    const all = await readAll();
    const hourAgo = Date.now() - 3_600_000;
    const recent = all.filter((e) => e.ipHash === ipHash && Date.parse(e.createdAt) > hourAgo).length;
    if (recent >= LIMITS.perIpPerHour) return { ok: false, error: "rate_limited" as const };
    if (all.filter((e) => e.status === "pending").length >= LIMITS.maxPending) return { ok: false, error: "queue_full" as const };
    all.push({ id: randomUUID(), name: name || "anon", message, createdAt: new Date().toISOString(), status: "pending", ipHash });
    await writeAll(all);
    return { ok: true as const };
  });
}

export function setStatus(id: string, action: "approve" | "reject" | "delete"): Promise<boolean> {
  return serial(async () => {
    const all = await readAll();
    const index = all.findIndex((e) => e.id === id);
    if (index === -1) return false;
    if (action === "delete") all.splice(index, 1);
    else all[index].status = action === "approve" ? "approved" : "rejected";
    await writeAll(all);
    return true;
  });
}

/** Constant-time check of the admin bearer token. Disabled entirely unless a long token is set. */
export function isAdmin(authorization: string | null) {
  const token = process.env.GUESTBOOK_ADMIN_TOKEN ?? "";
  if (token.length < 24 || !authorization?.startsWith("Bearer ")) return false;
  const given = Buffer.from(authorization.slice(7));
  const expected = Buffer.from(token);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
