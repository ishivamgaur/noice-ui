"use client";

import * as React from "react";

/**
 * Mirrors tab visibility onto <html data-hidden> so the stylesheet can
 * freeze every CSS animation (marquee, drift, keyframes) when the tab
 * is in the background. The camera tour uses the hook directly.
 */
export function VisibilityGuard() {
  React.useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      if (document.visibilityState === "visible") {
        root.removeAttribute("data-hidden");
      } else {
        root.setAttribute("data-hidden", "");
      }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return null;
}
