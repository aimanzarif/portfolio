"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  applyTheme,
  isDarkPreference,
  readThemePreference,
  systemPrefersDark,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

/*
 * A hanging light bulb: on = light mode, off = dark mode.
 * Click it: the bulb swings on its cord, flickers on (or fades off), and the new theme spreads
 * across the page in a circle from the bulb (View Transitions; instant where unsupported).
 */

function isDarkNow() {
  const root = document.documentElement;
  if (root.classList.contains("dark")) return true;
  if (root.classList.contains("light")) return false;
  return systemPrefersDark();
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

const getServerSnapshot = () => null;

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDarkNow, getServerSnapshot);
  const [pulls, setPulls] = useState(0);
  const button = useRef<HTMLButtonElement>(null);

  // Keep the stored preference, cookie and <html> class in sync (also across tabs).
  useEffect(() => {
    applyTheme(readThemePreference());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (readThemePreference() === "system") applyTheme("system");
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) applyTheme(readThemePreference());
    };
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggle = () => {
    const nextDark = !isDarkPreference(readThemePreference());
    const next: ThemePreference = nextDark === systemPrefersDark() ? "system" : nextDark ? "dark" : "light";
    setPulls((n) => n + 1);

    const doc = document as ViewTransitionDocument;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduced || !button.current) {
      applyTheme(next);
      return;
    }

    const rect = button.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = doc.startViewTransition(() => applyTheme(next));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {
        /* transition skipped: the theme is already applied */
      });
  };

  const on = dark === false; // light mode = bulb on
  const label = dark ? "Turn the light on (light mode)" : "Turn the light off (dark mode)";

  return (
    <button
      ref={button}
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={dark === null ? undefined : on}
      title={dark ? "Lights on" : "Lights off"}
      className="relative inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
    >
      <svg
        key={pulls}
        viewBox="0 0 24 34"
        aria-hidden
        className={cn("bulb h-8 w-6 overflow-visible", pulls > 0 && "bulb-swing", on && "bulb-on", on && pulls > 0 && "bulb-flicker")}
      >
        {/* cord up into the header */}
        <line x1="12" y1="-10" x2="12" y2="7" className="stroke-muted-foreground" strokeWidth="1.2" />
        {/* light rays (only when on) */}
        <g className="bulb-rays stroke-[#e9b23a]" strokeWidth="1.4" strokeLinecap="round">
          <line x1="1" y1="17" x2="-2" y2="17" />
          <line x1="23" y1="17" x2="26" y2="17" />
          <line x1="3" y1="25" x2="0.5" y2="27.5" />
          <line x1="21" y1="25" x2="23.5" y2="27.5" />
          <line x1="3" y1="9.5" x2="0.5" y2="7" />
          <line x1="21" y1="9.5" x2="23.5" y2="7" />
        </g>
        {/* screw cap */}
        <rect x="9" y="7" width="6" height="4.5" rx="1" className="fill-muted-foreground" />
        <line x1="9" y1="9.2" x2="15" y2="9.2" className="stroke-background" strokeWidth="0.7" />
        {/* glass */}
        <path
          d="M9.4 11.5C4.2 13.2 4 21.6 8.4 25.2V27.4H15.6V25.2C20 21.6 19.8 13.2 14.6 11.5Z"
          className="bulb-glass stroke-foreground"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <line x1="9" y1="29.2" x2="15" y2="29.2" className="stroke-foreground" strokeWidth="1.4" strokeLinecap="round" />
        {/* filament */}
        <polyline
          points="9.6,20.5 10.8,17.6 12,20.5 13.2,17.6 14.4,20.5"
          fill="none"
          className="bulb-filament"
          strokeWidth="1.1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
