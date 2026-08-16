"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  applyTheme,
  isDarkPreference,
  readThemePreference,
  systemPrefersDark,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "@/lib/theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => {
      const nextPreference = readThemePreference();
      applyTheme(nextPreference);
      setPreference(nextPreference);
      setDark(isDarkPreference(nextPreference));
    };

    sync();
    setMounted(true);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (readThemePreference() !== "system") return;
      sync();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) sync();
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
    const nextPreference: ThemePreference =
      nextDark === systemPrefersDark() ? "system" : nextDark ? "dark" : "light";
    applyTheme(nextPreference);
    setPreference(nextPreference);
    setDark(nextDark);
  };

  const label = dark ? "Switch to light mode" : "Switch to dark mode";
  const hint =
    preference === "system"
      ? "Following your system setting"
      : "Overrides your system setting. Toggle again to follow system.";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      hoverScale={1.08}
      tapScale={0.94}
      className="rounded-full"
      aria-label={label}
      title={hint}
      onClick={toggle}
    >
      <span className="relative flex size-4 items-center justify-center">
        {mounted ? (
          <AnimatePresence mode="wait" initial={false}>
            {dark ? (
              <motion.span
                key="sun"
                initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sun className="size-4" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ opacity: 0, rotate: 45, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -45, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Moon className="size-4" />
              </motion.span>
            )}
          </AnimatePresence>
        ) : null}
      </span>
    </Button>
  );
}
