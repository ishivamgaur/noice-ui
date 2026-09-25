import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Four loading states built from CSS transitions only: a ring that
 * closes into a check, leapfrog dots, a clip-path bar, and skeleton
 * shimmer. Set `done` to flip each into its finished state.
 */
export function LoaderSet({
  done = false,
  className,
}: {
  done?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid w-full max-w-64 grid-cols-4 gap-3", className)}>
      <RingLoader done={done} />
      <DotsLoader done={done} />
      <BarLoader done={done} />
      <SkeletonLines done={done} />
    </div>
  );
}

function Frame({
  children,
  label,
  done,
}: {
  children: React.ReactNode;
  label: string;
  done: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-14 w-full items-center justify-center rounded-lg border border-border bg-card">
        {children}
      </div>
      <span className="text-[10px] text-muted-foreground">
        {done ? "Done" : label}
      </span>
    </div>
  );
}

export function RingLoader({ done = false }: { done?: boolean }) {
  return (
    <Frame label="Ring" done={done}>
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={cn(
            "text-border transition-all duration-500",
            done ? "text-brand opacity-0" : "animate-spin [animation-duration:1.4s]"
          )}
          strokeDasharray="42 14"
        />
        <path
          d="m7 12.5 3.2 3.2L17 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "text-brand transition-opacity duration-300",
            done ? "opacity-100" : "opacity-0"
          )}
        />
      </svg>
    </Frame>
  );
}

export function DotsLoader({ done = false }: { done?: boolean }) {
  return (
    <Frame label="Dots" done={done}>
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "size-2 rounded-full transition-colors duration-300",
              done ? "bg-brand" : "bg-muted-foreground motion-safe:animate-bounce"
            )}
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </Frame>
  );
}

export function BarLoader({ done = false }: { done?: boolean }) {
  return (
    <Frame label="Bar" done={done}>
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            done ? "w-full bg-brand" : "w-1/3 bg-muted-foreground motion-safe:animate-pulse"
          )}
        />
      </div>
    </Frame>
  );
}

export function SkeletonLines({ done = false }: { done?: boolean }) {
  return (
    <Frame label="Skeleton" done={done}>
      <div className="w-full space-y-1.5 px-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full bg-muted-foreground/40 transition-opacity duration-300",
              done ? "opacity-0" : "motion-safe:animate-pulse"
            )}
          />
        </div>
        <div className="h-2 w-2/3 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full bg-muted-foreground/40 transition-opacity duration-300",
              done ? "opacity-0" : "motion-safe:animate-pulse"
            )}
            style={{ animationDelay: "150ms" }}
          />
        </div>
      </div>
    </Frame>
  );
}
