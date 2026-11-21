"use client";

import { useEffect, useRef, useState } from "react";
import { renderTurnstile } from "@/lib/turnstile-client";
import { cn } from "@/lib/utils";

/*
 * Phone number behind a quick bot check. The number is not in the page or the JS bundle; it is
 * fetched from /api/contact/phone only after Turnstile passes (usually invisible for humans).
 */

type State =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "shown"; phone: string; href: string }
  | { kind: "error"; message: string };

const MESSAGES: Record<string, string> = {
  rate_limited: "too many tries lah. email me instead?",
  captcha_failed: "bot check failed. try again?",
};

export function PhoneReveal({ label = "show my number", className }: { label?: string; className?: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [config, setConfig] = useState<{ enabled: boolean; siteKey: string | null } | null>(null);
  const box = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/contact/phone", { cache: "no-store" })
      .then((r) => r.json())
      .then((c) => alive && setConfig(c))
      .catch(() => alive && setConfig({ enabled: false, siteKey: null }));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (state.kind !== "checking" || !config?.siteKey) return;
    let alive = true;
    let cleanup: (() => void) | undefined;

    const reveal = async (token: string) => {
      try {
        const res = await fetch("/api/contact/phone", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const body = (await res.json().catch(() => ({}))) as { phone?: string; href?: string; error?: string };
        if (!alive) return;
        if (res.ok && body.phone && body.href) setState({ kind: "shown", phone: body.phone, href: body.href });
        else setState({ kind: "error", message: MESSAGES[body.error ?? ""] ?? "couldn't load it. email me instead?" });
      } catch {
        if (alive) setState({ kind: "error", message: "couldn't reach the laptop. email me instead?" });
      }
    };

    if (config.siteKey === "dev-bypass") {
      void reveal("dev"); // local development only; the server rejects this in production
    } else if (box.current) {
      renderTurnstile(box.current, config.siteKey, reveal, () => alive && setState({ kind: "error", message: MESSAGES.captcha_failed }))
        .then((remove) => {
          cleanup = remove;
          if (!alive) remove();
        })
        .catch(() => alive && setState({ kind: "error", message: "couldn't load the bot check. adblocker maybe?" }));
    }
    return () => {
      alive = false;
      cleanup?.();
    };
  }, [state.kind, config]);

  // Not configured (no CONTACT_PHONE or no Turnstile keys): show nothing rather than a dead button.
  if (config && !config.enabled) return null;

  if (state.kind === "shown") {
    return (
      <a href={state.href} className={className}>
        {state.phone}
      </a>
    );
  }

  return (
    <span className={cn("inline-flex flex-col items-start gap-2", className)}>
      <button
        type="button"
        onClick={() => setState({ kind: "checking" })}
        disabled={!config || state.kind === "checking"}
        className="underline underline-offset-4 disabled:cursor-wait disabled:opacity-70 print:hidden"
      >
        {state.kind === "checking" ? "checking you're human..." : label}
      </button>
      <span className="hidden print:inline">phone: on request</span>
      {state.kind === "error" ? <span className="text-sm font-normal text-destructive">{state.message}</span> : null}
      <span ref={box} className={state.kind === "checking" ? "block" : "hidden"} />
    </span>
  );
}
