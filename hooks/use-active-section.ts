"use client";

import { useEffect, useState } from "react";

/**
 * The active section is the last one whose top has passed a line 40% down the viewport.
 * Works for sections of any height (an IntersectionObserver ratio never triggers on very tall ones).
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState("");
  const idKey = ids.join(",");

  useEffect(() => {
    const list = idKey.split(",");
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = "";
      for (const id of list) {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom, the last section wins even if it is too short to reach the line.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = list[list.length - 1];
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [idKey]);

  return active;
}
