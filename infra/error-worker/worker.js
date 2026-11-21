/**
 * zarep.my error fallback (Cloudflare Worker, free plan friendly).
 *
 * Passes every request straight through to the origin. Only when the origin itself is unreachable
 * (laptop off, tunnel down, Nginx Proxy Manager or the container not answering) does it replace
 * Cloudflare's generic error with a themed page. Errors rendered by the Next.js app itself
 * (its own 404 / 500 pages) are left alone.
 */

// Infrastructure-level failures. 500 is NOT here: that one comes from the app's own error page.
const ORIGIN_DOWN = new Set([502, 503, 504, 520, 521, 522, 523, 524, 525, 526, 530]);

const REASONS = {
  502: "Nginx Proxy Manager couldn't reach the app container.",
  503: "The app is restarting or overloaded.",
  504: "The app took too long to answer.",
  520: "The server sent back something weird.",
  521: "The server refused the connection.",
  522: "Connection to the server timed out.",
  523: "The server is unreachable.",
  524: "The server took too long to answer.",
  525: "TLS handshake with the server failed.",
  526: "The server's certificate is invalid.",
  530: "The Cloudflare Tunnel to the laptop is down.",
};

const worker = {
  async fetch(request) {
    let response;
    try {
      response = await fetch(request);
    } catch (error) {
      return fallback(request, 502, `Worker could not reach the origin: ${error}`);
    }

    if (!ORIGIN_DOWN.has(response.status)) return response;

    // Images, scripts and other assets keep the origin's own error; only pages and the API get a fallback.
    const url = new URL(request.url);
    const wantsHtml = (request.headers.get("accept") ?? "").includes("text/html");
    if (!wantsHtml && !url.pathname.startsWith("/api/")) return response;

    return fallback(request, response.status, REASONS[response.status] ?? "The origin is not answering.");
  },
};

export default worker;

function fallback(request, status, reason) {
  const url = new URL(request.url);
  const wantsHtml = (request.headers.get("accept") ?? "").includes("text/html");
  const headers = {
    "cache-control": "no-store",
    "retry-after": "120",
    "x-zarep-fallback": String(status),
  };

  // API callers (the live status panel, the terminal's ping) get JSON, not a web page.
  if (url.pathname.startsWith("/api/") || !wantsHtml) {
    return new Response(JSON.stringify({ ok: false, error: "origin_down", status, reason }), {
      status: 503,
      headers: { ...headers, "content-type": "application/json" },
    });
  }

  return new Response(page(status, reason, url.hostname), {
    status: 503,
    headers: {
      ...headers,
      "content-type": "text/html; charset=utf-8",
      // The page has no scripts at all, so lock it down completely.
      "content-security-policy":
        "default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
    },
  });
}

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function page(status, reason, host) {
  const time = new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    hour: "numeric",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  }).format(new Date());

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>The laptop is down · ${escape(host)}</title>
<style>
:root{--bg:#ece7db;--fg:#1c1f20;--muted:#3d4344;--card:#f7f3ea;--line:rgb(28 31 32/18%);--accent:#2f6b4f;--red:#b3261e}
@media (prefers-color-scheme:dark){:root{--bg:#1c1f20;--fg:#ece7db;--muted:#b4b8ae;--card:#252a2b;--line:rgb(236 231 219/16%);--accent:#a9d3b8;--red:#ff8b80}}
*{box-sizing:border-box}
body{margin:0;min-height:100dvh;display:flex;align-items:center;background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
main{width:100%;max-width:56rem;margin:0 auto;padding:4rem 1.25rem}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.eyebrow{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
h1{font-size:clamp(3rem,9vw,7rem);line-height:.92;letter-spacing:-.04em;font-weight:800;margin:1.25rem 0 0}
.tag{display:inline-block;transform:rotate(-1.5deg);background:var(--accent);color:var(--bg);padding:0 .12em}
.lead{margin:2rem 0 0;max-width:36rem;font-size:1.2rem;line-height:1.7;color:var(--muted)}
.box{margin-top:2rem;max-width:36rem;border:1px solid var(--line);border-radius:12px;background:var(--card);overflow:hidden}
.bar{display:flex;gap:8px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line);font-size:12px;color:var(--muted)}
.dot{width:10px;height:10px;border-radius:50%;background:var(--line)}
.term{padding:18px 20px;font-size:13px;line-height:1.9;word-break:break-word}
.p{color:var(--accent)}.err{color:var(--red)}.m{color:var(--muted)}
.cursor{display:inline-block;width:.6em;height:1.1em;vertical-align:-.2em;background:var(--accent);animation:b 1.05s step-end infinite}
@keyframes b{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.cursor{animation:none}}
.row{margin-top:2.25rem;display:flex;flex-wrap:wrap;gap:1rem 1.5rem;align-items:center}
.btn{display:inline-flex;align-items:center;min-height:3rem;padding:0 1.75rem;border-radius:999px;background:var(--fg);color:var(--bg);font-weight:600;text-decoration:none}
a{color:inherit;font-weight:500;text-underline-offset:4px}
</style>
</head>
<body>
<main>
<p class="eyebrow mono">Error ${status} · ${escape(host)}</p>
<h1>The laptop is <span class="tag">down.</span></h1>
<p class="lead">This whole site runs on one laptop in Klang, and right now it's not answering. Maybe updating, maybe the electricity tripped, maybe I terdelete something again. Try again in a few minutes ok.</p>
<div class="box mono" role="img" aria-label="Terminal showing the connection error">
<div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span style="margin-left:8px">edge@cloudflare: ~</span></div>
<div class="term">
<div><span class="p">$</span> curl -sI https://${escape(host)}</div>
<div class="err">HTTP ${status}: ${escape(reason)}</div>
<div class="m">checked ${escape(time)} (Klang time)</div>
<div><span class="p">$</span> <span class="cursor"></span></div>
</div>
</div>
<div class="row">
<a class="btn" href="/">Cuba lagi (try again)</a>
<a href="mailto:zarif@zarep.my?subject=Your%20laptop%20is%20down">Tell Zarif</a>
<a href="https://www.linkedin.com/in/zarif-nur-aiman">LinkedIn</a>
</div>
</main>
</body>
</html>`;
}
