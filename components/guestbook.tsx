"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Terminal guestbook: list approved messages, and a sign flow with Cloudflare Turnstile. */

type PublicEntry = { id: string; name: string; message: string; createdAt: string };
type Meta = { enabled: boolean; siteKey: string | null; entries: PublicEntry[]; limits: { message: number; name: number } };

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

export const GUESTBOOK_MAX = 140;

let scriptPromise: Promise<void> | null = null;
function loadTurnstile() {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("turnstile failed to load"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

function ago(iso: string) {
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86_400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86_400)}d ago`;
}

/** Output for `guestbook`: the latest approved messages. */
export async function guestbookList(): Promise<ReactNode> {
  try {
    const meta = (await fetch("/api/guestbook", { cache: "no-store" }).then((r) => r.json())) as Meta;
    if (!meta.entries.length) {
      return meta.enabled
        ? "guestbook empty lah. be the first: guestbook sign <message>"
        : "guestbook not open yet. come back later ok.";
    }
    return (
      <span className="block">
        {meta.entries.map((e) => (
          <span key={e.id} className="block">
            <span className="text-foreground">&ldquo;{e.message}&rdquo;</span> — {e.name}, {ago(e.createdAt)}
          </span>
        ))}
        <span className="mt-1 block text-accent">sign it: guestbook sign &lt;message&gt;</span>
      </span>
    );
  } catch {
    return "couldn't open the guestbook. laptop busy kot.";
  }
}

const ERRORS: Record<string, string> = {
  rate_limited: "slow down lah, max 3 signatures an hour.",
  queue_full: "guestbook queue full. zarif needs to approve some first.",
  captcha_failed: "bot check failed. try again?",
  closed: "guestbook not open yet. come back later ok.",
};

/** Output line for `guestbook sign`: runs the bot check and submits. */
export function GuestbookSign({ message, name }: { message: string; name: string }) {
  const [status, setStatus] = useState<"loading" | "captcha" | "sending" | "done" | "error">("loading");
  const [error, setError] = useState("");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    let widget: string | undefined;

    const submit = async (token: string) => {
      setStatus("sending");
      try {
        const res = await fetch("/api/guestbook", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message, name, token }),
        });
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (!alive) return;
        if (res.ok) setStatus("done");
        else {
          setError(ERRORS[body.error ?? ""] ?? "couldn't sign. try again later.");
          setStatus("error");
        }
      } catch {
        if (!alive) return;
        setError("couldn't reach the laptop. try again later.");
        setStatus("error");
      }
    };

    (async () => {
      const meta = (await fetch("/api/guestbook", { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => null)) as Meta | null;
      if (!alive) return;
      if (!meta?.enabled || !meta.siteKey) {
        setError(ERRORS.closed);
        setStatus("error");
        return;
      }
      if (meta.siteKey === "dev-bypass") {
        await submit("dev"); // local development only; the server rejects this in production
        return;
      }
      try {
        await loadTurnstile();
      } catch {
        if (!alive) return;
        setError("couldn't load the bot check. adblocker maybe?");
        setStatus("error");
        return;
      }
      const turnstile = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (!alive || !box.current || !turnstile) return;
      setStatus("captcha");
      const dark = document.documentElement.classList.contains("dark") ||
        (!document.documentElement.classList.contains("light") && window.matchMedia("(prefers-color-scheme: dark)").matches);
      widget = turnstile.render(box.current, {
        sitekey: meta.siteKey,
        theme: dark ? "dark" : "light",
        callback: (token: string) => submit(token),
        "error-callback": () => {
          setError(ERRORS.captcha_failed);
          setStatus("error");
        },
      });
    })();

    return () => {
      alive = false;
      const turnstile = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (widget !== undefined) turnstile?.remove(widget);
    };
  }, [message, name]);

  return (
    <span className="block">
      {status === "loading" ? "opening the guestbook..." : null}
      {status === "captcha" ? "one sec, proving you're not a bot:" : null}
      {status === "sending" ? "signing..." : null}
      {status === "done" ? (
        <span className="text-accent">terima kasih! it&apos;ll show up after zarif approves it.</span>
      ) : null}
      {status === "error" ? <span className="text-destructive">{error}</span> : null}
      <span ref={box} className={status === "captcha" ? "mt-2 block" : "hidden"} />
    </span>
  );
}
