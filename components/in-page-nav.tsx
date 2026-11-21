"use client";

import { useEffect } from "react";

function scrollToId(id: string) {
  if (!id || id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const target = document.getElementById(id);
  if (!target) return;
  // Land the section's top edge exactly under the header bar (not the open mobile menu),
  // so none of the previous section shows.
  const offset = () => {
    const bar = document.querySelector("[data-header-bar]");
    const barBottom = bar ? bar.getBoundingClientRect().bottom : 0;
    return Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY - barBottom - 1));
  };
  window.scrollTo({ top: offset(), behavior: "smooth" });
  // Content can shift while scrolling (animations, images): correct once when the scroll settles.
  window.addEventListener(
    "scrollend",
    () => {
      const top = offset();
      if (Math.abs(window.scrollY - top) > 1) window.scrollTo({ top, behavior: "instant" });
    },
    { once: true },
  );
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
