"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const stored = localStorage.getItem("solaki_theme") as Theme | null;

      const applyTheme = (targetTheme: Theme) => {
        setThemeState(targetTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(targetTheme);
      };

      if (stored === "light" || stored === "dark") {
        applyTheme(stored);
      } else {
        // Menyesuaikan perangkat pengguna sebagai default
        const systemTheme: Theme = mediaQuery.matches ? "dark" : "light";
        applyTheme(systemTheme);
      }

      // Dengarkan perubahan mode pada perangkat jika belum ada preferensi manual yang disimpan
      const handleSystemChange = (e: MediaQueryListEvent) => {
        const currentStored = localStorage.getItem("solaki_theme");
        if (!currentStored) {
          applyTheme(e.matches ? "dark" : "light");
        }
      };

      mediaQuery.addEventListener("change", handleSystemChange);
      return () => mediaQuery.removeEventListener("change", handleSystemChange);
    } catch (e) {
      // fallback
    } finally {
      setMounted(true);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("solaki_theme", newTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    } catch (e) {}
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
