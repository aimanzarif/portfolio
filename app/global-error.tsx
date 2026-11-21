"use client";

/*
 * Last line of defence: the root layout itself failed, so no global CSS, fonts or theme are loaded.
 * Everything is inline and follows the visitor's OS light/dark setting.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body>
        <title>Something rosak · zarep.my</title>
        <style>{`
          :root { --bg:#ece7db; --fg:#1c1f20; --muted:#3d4344; --card:#f7f3ea; --line:rgb(28 31 32/18%); --red:#b3261e; }
          @media (prefers-color-scheme: dark) { :root { --bg:#1c1f20; --fg:#ece7db; --muted:#b4b8ae; --card:#252a2b; --line:rgb(236 231 219/16%); --red:#ff8b80; } }
          * { box-sizing: border-box; }
          body { margin:0; min-height:100dvh; display:flex; align-items:center; background:var(--bg); color:var(--fg);
                 font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
          main { width:100%; max-width:56rem; margin:0 auto; padding:5rem 1.25rem; }
          .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
          .eyebrow { font-size:13px; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); }
          h1 { font-size:clamp(3rem,9vw,7rem); line-height:.92; letter-spacing:-.04em; font-weight:800; margin:1.5rem 0 0; }
          .tag { display:inline-block; transform:rotate(-1.5deg); background:var(--red); color:var(--bg); padding:0 .12em; }
          p.lead { margin:2rem 0 0; max-width:36rem; font-size:1.2rem; line-height:1.7; color:var(--muted); }
          .box { margin-top:2rem; max-width:36rem; border:1px solid var(--line); border-radius:12px; background:var(--card); padding:1.25rem; font-size:13px; line-height:1.8; word-break:break-all; }
          .row { margin-top:2.5rem; display:flex; flex-wrap:wrap; gap:1rem 1.5rem; align-items:center; }
          button { min-height:3rem; padding:0 1.75rem; border:0; border-radius:999px; background:var(--fg); color:var(--bg); font:inherit; font-weight:600; cursor:pointer; }
          a { color:inherit; font-weight:500; text-underline-offset:4px; }
        `}</style>
        <main>
          <p className="eyebrow mono">Error 500 · zarep.my</p>
          <h1>
            Whole site <span className="tag">rosak.</span>
          </h1>
          <p className="lead">
            This one quite serious: even the page frame failed to load. Try again, and if still cannot, the laptop
            probably needs a restart. Sorry ah.
          </p>
          <div className="box mono">
            <div>$ systemctl status zarep.my</div>
            <div style={{ color: "var(--red)" }}>● failed (root layout crashed)</div>
            {error.digest ? <div style={{ color: "var(--muted)" }}>ref: {error.digest}</div> : null}
          </div>
          <div className="row">
            <button type="button" onClick={() => retry()}>
              Cuba lagi (try again)
            </button>
            {/* A plain <a> on purpose: client-side navigation can't be trusted when the layout is broken. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">Reload home</a>
            <a href="mailto:zarif@zarep.my?subject=Your%20site%20rosak">Report it</a>
          </div>
        </main>
      </body>
    </html>
  );
}
