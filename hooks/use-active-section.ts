"use client";

import { useEffect, useState } from "react";

export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  const idKey = ids.join(",");

  useEffect(() => {
    const list = idKey.split(",");
    const nodes = list
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [idKey]);

  return active;
}
