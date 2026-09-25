"use client";

import * as React from "react";

const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  window.addEventListener("noice:filter", cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener("noice:filter", cb);
  };
};

const read = () => new URLSearchParams(window.location.search).get("c") ?? "all";

/**
 * Category filter held in the `?c=` query param so a filtered gallery
 * can be shared and survives a trip to a component page and back.
 * The server always renders "all" to keep the first paint complete.
 */
export function useUrlFilter() {
  const value = React.useSyncExternalStore(subscribe, read, () => "all");

  const set = React.useCallback((next: string) => {
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("c");
    else url.searchParams.set("c", next);
    // replaceState does not notify subscribers, so announce it ourselves.
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event("noice:filter"));
  }, []);

  return [value, set] as const;
}
