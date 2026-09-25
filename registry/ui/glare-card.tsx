"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlareCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Radius of the glare in px. @default 350 */
  size?: number;
  /** Peak glare opacity 0-1. @default 0.18 */
  intensity?: number;
}

/**
 * A card with a soft glare that tracks the pointer. Pure CSS custom
 * properties, so there is no re-render while the pointer moves.
 */
export function GlareCard({
  children,
  className,
  size = 350,
  intensity = 0.18,
  onPointerMove,
  onPointerLeave,
  style,
  ...props
}: GlareCardProps) {
  return (
    <div
      onPointerMove={(e) => {
        onPointerMove?.(e);
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--glare-x",
          `${e.clientX - rect.left}px`
        );
        e.currentTarget.style.setProperty(
          "--glare-y",
          `${e.clientY - rect.top}px`
        );
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        e.currentTarget.style.setProperty("--glare-x", "50%");
        e.currentTarget.style.setProperty("--glare-y", "50%");
      }}
      style={
        {
          "--glare-size": `${size}px`,
          "--glare": `radial-gradient(${size}px circle at var(--glare-x, 50%) var(--glare-y, 50%), color-mix(in oklab, var(--color-brand) ${Math.round(intensity * 100)}%, transparent), transparent 70%)`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300",
        className
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "var(--glare)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
