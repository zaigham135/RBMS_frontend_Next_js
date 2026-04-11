"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getStorageKey(userId: string | undefined): string {
  return userId ? `theme:${userId}` : "theme:guest";
}

function getStoredTheme(userId: string | undefined): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(getStorageKey(userId));
  return stored === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.style.backgroundColor = '#0f172a';
  } else {
    root.classList.remove("dark");
    root.style.backgroundColor = '#ffffff';
  }
}

export function useTheme(userId: string | undefined) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // On mount or userId change, load the stored preference for this user
  useEffect(() => {
    setMounted(true);
    const stored = getStoredTheme(userId);
    setTheme(stored);
    applyTheme(stored);
  }, [userId]);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(getStorageKey(userId), next);
  };

  // Return current theme state, but only after mount to avoid hydration issues
  return { theme: mounted ? theme : "light", toggle, isDark: mounted ? theme === "dark" : false };
}
