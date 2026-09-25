"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

export interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Diameter of the glow in px. @default 600 */
  size?: number;
  /** Glow strength 0-1. @default 0.18 */
  intensity?: number;
}

/**
 * A container with a soft glow that follows the cursor.
 * The glow color comes from the `--brand` theme token, so it
 * adapts to light and dark mode automatically.
 */
export function Spotlight({
  children,
  className,
  size = 600,
  intensity = 0.18,
  ...props
}: SpotlightProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(-size);
  const mouseY = useMotionValue(-size);
  const x = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const y = useSpring(mouseY, { stiffness: 150, damping: 25 });

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, color-mix(in oklab, var(--color-brand) ${Math.round(
    intensity * 100
  )}%, transparent), transparent 70%)`;

  return (
    <div
      ref={ref}
      onMouseMove={
        reduceMotion
          ? undefined
          : (e) => {
              const rect = ref.current?.getBoundingClientRect();
              if (!rect) return;
              mouseX.set(e.clientX - rect.left);
              mouseY.set(e.clientY - rect.top);
            }
      }
      onMouseLeave={
        reduceMotion
          ? undefined
          : () => {
              mouseX.set(-size);
              mouseY.set(-size);
            }
      }
      className={cn("relative", className)}
      {...props}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background }}
      />
      {children}
    </div>
  );
}
