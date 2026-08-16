export const THEME_STORAGE_KEY = "zarif-theme-mode";

export type ThemePreference = "light" | "dark" | "system";

export function parseThemePreference(value: string | undefined | null): ThemePreference {
  if (value === "light" || value === "dark" || value === "system") return value;
  return "system";
}

export function themeClassName(preference: ThemePreference) {
  if (preference === "dark") return "dark";
  if (preference === "light") return "light";
  return undefined;
}

export function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function readThemePreference(): ThemePreference {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return parseThemePreference(stored);
}

export function isDarkPreference(preference: ThemePreference) {
  return preference === "dark" || (preference !== "light" && systemPrefersDark());
}

export function applyTheme(preference: ThemePreference) {
  const root = document.documentElement;
  root.classList.toggle("dark", preference === "dark");
  root.classList.toggle("light", preference === "light");
  localStorage.setItem(THEME_STORAGE_KEY, preference);
  document.cookie = `${THEME_STORAGE_KEY}=${preference}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
