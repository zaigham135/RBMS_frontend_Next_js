"use client";

import { useEffect, useState } from "react";

const GUEST_THEME_KEY = "theme:guest";

export function useGuestTheme() {
  const [dark, setDark] = useState(false);

  // Read persisted preference on mount
  useEffect(() => {
    const stored = localStorage.getItem(GUEST_THEME_KEY);
    const prefersDark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(prefersDark);
    applyTheme(prefersDark);
  }, []);

  function applyTheme(isDark: boolean) {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.style.backgroundColor = "#0b1120";
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "#ffffff";
    }
  }

  function toggle() {
    const next = !dark;
    setDark(next);
    applyTheme(next);
    localStorage.setItem(GUEST_THEME_KEY, next ? "dark" : "light");
  }

  return { dark, toggle };
}
