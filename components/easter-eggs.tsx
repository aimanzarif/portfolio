"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EGGS, eggHints, findEgg, onEggFound, useEggs } from "@/lib/eggs";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** Konami listener, the "egg found" toast, a console hello, and the eggs-found counter with hints. */
export function EasterEggs() {
  const found = useEggs();
  const [toast, setToast] = useState<{ message: string; count: number; key: number } | null>(null);
  const [hintsOpen, setHintsOpen] = useState(false);

  useEffect(() => {
    console.log(
      "%cOi, curious one.\n%cThere are 3 easter eggs on this page. None of them in here, sorry ah.\nHiring? zarif@zarep.my",
      "font-size:16px;font-weight:bold",
      "font-size:12px",
    );

    let timer = 0;
    const off = onEggFound((message, count) => {
      setToast({ message, count, key: Date.now() });
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setToast(null), 6000);
    });

    let progress = 0;
    const onKey = (event: globalThis.KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        findEgg("konami");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      off();
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const all = found.length === EGGS.length;

  return (
    <>
      <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2">
        <AnimatePresence>
          {hintsOpen ? (
            <motion.div
              id="egg-hints"
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              className="w-72 rounded-xl border-2 border-line bg-card p-4 font-mono text-[13px] shadow-[6px_6px_0_var(--accent)]"
            >
              <p className="font-bold">{all ? "Semua dah jumpa. Respect." : "Hints, since you ask"}</p>
              <ul className="mt-3 space-y-2.5">
                {EGGS.map((egg) => {
                  const done = found.includes(egg);
                  return (
                    <li key={egg} className={`flex gap-2 ${done ? "text-muted-foreground line-through" : ""}`}>
                      <span className={done ? "text-accent" : "text-muted-foreground"} aria-hidden>
                        {done ? "✓" : "○"}
                      </span>
                      <span>
                        {eggHints[egg]}
                        <span className="sr-only">{done ? " (found)" : " (not found yet)"}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setHintsOpen((open) => !open)}
          aria-expanded={hintsOpen}
          aria-controls="egg-hints"
          className="flex min-h-11 items-center gap-2 rounded-full border-2 border-line bg-card px-4 font-mono text-xs font-bold shadow-[3px_3px_0_var(--accent)] transition hover:-translate-y-0.5"
        >
          <span className={`size-2 rounded-full bg-accent ${all ? "" : "led"}`} aria-hidden />
          {all ? "ALL 3 EGGS FOUND" : `${found.length}/3 EASTER EGGS FOUND`}
          <span className="text-muted-foreground">{hintsOpen ? "×" : "?"}</span>
        </button>
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.key}
            role="status"
            initial={{ opacity: 0, y: 24, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="fixed top-24 right-5 z-50 max-w-xs rounded-xl border-2 border-foreground bg-accent p-4 font-mono text-sm text-accent-foreground shadow-[6px_6px_0_var(--foreground)]"
          >
            <p className="font-bold">EASTER EGG {toast.count}/3</p>
            <p className="mt-1">{toast.message}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
