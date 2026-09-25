"use client";

import * as React from "react";

function subscribe(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

/**
 * False while the tab is hidden. Pair it with any timer or tween so
 * background tabs stop burning CPU and GPU. SSR assumes visible so
 * the first paint matches the markup.
 */
export function usePageVisible() {
  return React.useSyncExternalStore(
    subscribe,
    () => document.visibilityState === "visible",
    () => true
  );
}
