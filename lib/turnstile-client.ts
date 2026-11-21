"use client";

/* Browser side of Cloudflare Turnstile: load the script once and render a widget. */

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

let scriptPromise: Promise<void> | null = null;

export function loadTurnstile() {
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

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  (!document.documentElement.classList.contains("light") && window.matchMedia("(prefers-color-scheme: dark)").matches);

/**
 * Render a Turnstile widget into `el`. Calls onToken when the check passes, onError if it fails.
 * Returns a cleanup function that removes the widget.
 */
export async function renderTurnstile(
  el: HTMLElement,
  siteKey: string,
  onToken: (token: string) => void,
  onError: () => void,
): Promise<() => void> {
  await loadTurnstile();
  const turnstile = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
  if (!turnstile) throw new Error("turnstile missing");
  const id = turnstile.render(el, {
    sitekey: siteKey,
    theme: isDark() ? "dark" : "light",
    callback: onToken,
    "error-callback": onError,
  });
  return () => turnstile.remove(id);
}
