"use client";

import * as React from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

/**
 * Applies a theme choice and persists it.
 *
 * This replaces next-themes, which renders a <script> child to prevent a
 * flash of the wrong theme. React 19 warns about any script rendered
 * inside a component during client render, and next-themes exposes no way
 * to suppress that. The anti-flash script now lives in the document head
 * instead (see the root layout), which is where it belongs, so no script
 * is ever produced from component render.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = STORAGE_KEY,
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>("light");

  // The stored preference is read after mount rather than during the first
  // render, so the server and client agree on the initial markup and
  // hydration stays clean. The head script has already painted the right
  // theme by then, so nothing flashes. Deferred a frame to keep this off
  // the synchronous effect path.
  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored === "light" || stored === "dark" || stored === "system") {
          setThemeState(stored);
        }
      } catch {
        // Private browsing or a blocked storage partition. The default
        // stands.
      }
      setSystemTheme(
        window.matchMedia(DARK_QUERY).matches ? "dark" : "light"
      );
    });
    return () => cancelAnimationFrame(id);
  }, [storageKey]);

  // Follow the OS while the choice is "system".
  React.useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const onChange = () => setSystemTheme(media.matches ? "dark" : "light");
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Keep other tabs of the same site in step.
  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      const next = event.newValue;
      setThemeState(
        next === "light" || next === "dark" ? next : defaultTheme
      );
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey, defaultTheme]);

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? systemTheme : theme;

  const applyTheme = React.useCallback((next: ResolvedTheme) => {
    const root = document.documentElement;
    // Suppress transitions for exactly the frames in which the token
    // values swap. Without this any transition on colour, border or
    // shadow animates the whole page at once and reads as a flicker.
    root.dataset.themeSwitching = "true";
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    const release = () => {
      delete root.dataset.themeSwitching;
    };
    // Two frames: the first commits the class change, the second is the
    // earliest point at which the new values are definitely painted.
    requestAnimationFrame(() => requestAnimationFrame(release));
  }, []);

  // Keep the document in step on mount and whenever the resolved value
  // changes through a route or a storage event.
  React.useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme, applyTheme]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeState(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        // Nothing to do: the theme still applies for this session.
      }
      // Applied here as well as in the effect above. Waiting for the
      // effect means a frame paints in the old theme first, which reads
      // as a flicker exactly when the user is watching for one.
      const resolved: ResolvedTheme =
        next === "system"
          ? window.matchMedia(DARK_QUERY).matches
            ? "dark"
            : "light"
          : next;
      applyTheme(resolved);
    },
    [storageKey, applyTheme]
  );

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return context;
}
