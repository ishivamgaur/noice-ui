"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** How far the button follows the cursor, 0 to 1. @default 0.35 */
  strength?: number;
}

/**
 * A button that leans toward the cursor inside an invisible field.
 * The field is padded space with negative margin, so it never moves
 * layout. The label drifts the other way for a touch of depth.
 */
export function MagneticButton({
  strength = 0.35,
  className,
  children,
  ...props
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 16 });
  const y = useSpring(rawY, { stiffness: 180, damping: 16 });
  // Counter-drift gives the label parallax against the pull.
  const labelX = useTransform(x, (v) => -v * 0.4);
  const labelY = useTransform(y, (v) => -v * 0.4);

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (reduceMotion || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    // Quadratic falloff: full pull at center, zero at the field edge.
    const dist = Math.min(
      1,
      Math.hypot(dx / (rect.width / 2), dy / (rect.height / 2))
    );
    const pull = (1 - dist) * (1 - dist);
    rawX.set(dx * strength * pull);
    rawY.set(dy * strength * pull);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <span
      className="-m-6 inline-block touch-manipulation p-6"
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <motion.button
        type="button"
        style={reduceMotion ? undefined : { x, y }}
        className={cn(
          "inline-flex h-11 items-center gap-2 overflow-hidden rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity duration-150 hover:opacity-90 active:scale-[0.97]",
          className
        )}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {/* Counter-drift gives the label parallax against the pull. */}
        <motion.span
          style={reduceMotion ? undefined : { x: labelX, y: labelY }}
          className="inline-flex items-center gap-2"
        >
          {children}
        </motion.span>
      </motion.button>
    </span>
  );
}
