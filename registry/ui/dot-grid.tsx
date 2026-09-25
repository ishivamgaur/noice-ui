import * as React from "react";
import { cn } from "@/lib/utils";

export interface DotGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Distance between dots in px. @default 22 */
  size?: number;
  /** Dot color. @default var(--color-border) */
  dot?: string;
  /** CSS mask so the field dissolves outward. */
  mask?: string;
}

/**
 * A dotted texture layer. Absolutely positioned to fill its parent -
 * drop it inside any relative container, typically under content.
 */
export function DotGrid({
  className,
  size = 22,
  dot = "var(--color-border)",
  mask = "radial-gradient(ellipse 55% 50% at 50% 42%, black 15%, transparent 72%)",
  ...props
}: DotGridProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `radial-gradient(${dot} 1.2px, transparent 1.2px)`,
        backgroundSize: `${size}px ${size}px`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
      {...props}
    />
  );
}
