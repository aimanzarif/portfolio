"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { onEggFound, replayEgg } from "@/lib/eggs";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** Konami listener, the "egg found" toast and a console hello. Progress and hints live in the terminal (`eggs`). */
export function EasterEggs() {
  const [toast, setToast] = useState<{ message: string; count: number; key: number } | null>(null);

  useEffect(() => {
    console.log(
      "%cOi, curious one.\n%cThere are 3 easter eggs on this page. None of them in here, sorry ah. Type `eggs` in the terminal for hints.\nHiring? zarif@zarep.my",
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
        replayEgg("konami"); // counts once, but the toast shows every time
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      off();
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
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
