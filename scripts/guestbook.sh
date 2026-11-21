#!/usr/bin/env bash
# Moderate the guestbook from the server.
#   ./scripts/guestbook.sh list                 show messages waiting for approval
#   ./scripts/guestbook.sh approve <id>         publish one
#   ./scripts/guestbook.sh reject <id>          hide one (kept, never shown)
#   ./scripts/guestbook.sh delete <id>          remove one completely
# Uses GUESTBOOK_ADMIN_TOKEN from .env and talks to the running container directly.
# Set CONTAINER=portfolio-staging to moderate staging.
set -euo pipefail
cd "$(dirname "$0")/.."

CONTAINER="${CONTAINER:-portfolio}"
TOKEN="$(grep -E '^GUESTBOOK_ADMIN_TOKEN=' .env 2>/dev/null | cut -d= -f2- || true)"
if [ -z "$TOKEN" ]; then
  echo "GUESTBOOK_ADMIN_TOKEN is not set in .env" >&2
  exit 1
fi

action="${1:-list}"
id="${2:-}"

docker exec -e TOKEN="$TOKEN" -e ACTION="$action" -e ID="$id" "$CONTAINER" node -e '
const base = "http://127.0.0.1:3000/api/guestbook/admin";
const headers = { authorization: `Bearer ${process.env.TOKEN}`, "content-type": "application/json" };
(async () => {
  const action = process.env.ACTION;
  if (action === "list") {
    const res = await fetch(base, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status} (wrong token?)`);
    const { pending } = await res.json();
    if (!pending.length) return console.log("Nothing waiting for approval.");
    for (const e of pending) console.log(`${e.id}\n  "${e.message}" - ${e.name}, ${e.createdAt}\n`);
    return;
  }
  if (!["approve", "reject", "delete"].includes(action) || !process.env.ID) {
    console.error("usage: guestbook.sh list | approve <id> | reject <id> | delete <id>");
    process.exit(1);
  }
  const res = await fetch(base, { method: "POST", headers, body: JSON.stringify({ id: process.env.ID, action }) });
  console.log(res.ok ? `${action}d ${process.env.ID}` : `failed: HTTP ${res.status}`);
})().catch((e) => { console.error(e.message); process.exit(1); });
'
