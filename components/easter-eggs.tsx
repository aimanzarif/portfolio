"use client";

import { useEffect, useState } from "react";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** Konami code toast, plus a hello for anyone who opens the console. */
export function EasterEggs() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    console.log(
      "%cOi, curious one.\n%cSince you're poking around: the terminal at the top takes commands. Try `help`.\nHiring? zarif@zarep.my",
      "font-size:16px;font-weight:bold",
      "font-size:12px",
    );

    let progress = 0;
    const onKey = (event: globalThis.KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        setShown(true);
        window.setTimeout(() => setShown(false), 6000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!shown) return null;

  return (
    <div
      role="status"
      className="fixed right-5 bottom-5 z-50 max-w-xs rounded-xl border-2 border-foreground bg-accent p-4 font-mono text-sm text-accent-foreground shadow-[6px_6px_0_var(--foreground)]"
    >
      <p className="font-bold">CHEAT ACTIVATED: +30 lives</p>
      <p className="mt-1">Still not enough for a holiday though.</p>
    </div>
  );
}
