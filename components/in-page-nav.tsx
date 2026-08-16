"use client";

import { useEffect } from "react";

function scrollToId(id: string) {
  if (!id || id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function stripHash() {
  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}`);
}

export function InPageNav() {
  useEffect(() => {
    if (window.location.hash) {
      const id = decodeURIComponent(window.location.hash.slice(1));
      requestAnimationFrame(() => {
        scrollToId(id);
        stripHash();
      });
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href^='#']");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.origin !== window.location.origin) return;

      event.preventDefault();
      scrollToId(decodeURIComponent(link.hash.slice(1)));
      stripHash();
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
