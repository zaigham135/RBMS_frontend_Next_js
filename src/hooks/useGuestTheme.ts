"use client";

import { useEffect, useState } from "react";

const GUEST_THEME_KEY = "theme:guest";

function getInitialDark(): boolean {
  // Read from the <html> class that the layout script already applied —
  // this avoids a flash because the DOM is already in the correct state.
  if (typeof document !== "undefined") {
    return document.documentElement.classList.contains("dark");
  }
  return false;
}

export function useGuestTheme() {
  const [dark, setDark] = useState(getInitialDark);

  // Sync localStorage on mount (in case the DOM class was set by layout script
  // but localStorage hasn't been read yet by React state)
  useEffect(() => {
    const stored = localStorage.getItem(GUEST_THEME_KEY);
    const prefersDark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    // Only update if different from what the layout script already applied
    if (prefersDark !== dark) {
      setDark(prefersDark);
      applyTheme(prefersDark);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
