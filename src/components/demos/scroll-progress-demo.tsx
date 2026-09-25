import { ScrollProgress } from "../../../registry/ui/scroll-progress";

/** Scroll-linked demos only move on a real page, so the tile shows
    the mechanic statically instead of a progress bar that never moves. */
export function ScrollProgressDemo() {
  return (
    <div className="w-full max-w-64 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="font-mono text-[10px] text-muted-foreground">
          scroll-progress.tsx
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      </div>
      <div className="space-y-2 p-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <ScrollProgress className="h-full rounded-full" />
        </div>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Place it in a fixed bar and it fills as the page scrolls.
        </p>
      </div>
    </div>
  );
}
