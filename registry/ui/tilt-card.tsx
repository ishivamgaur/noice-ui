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

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Peak rotation in degrees. @default 12 */
  max?: number;
  /** Distance of the perspective in px. @default 800 */
  perspective?: number;
}

const TRACK = { stiffness: 300, damping: 30 } as const;

/**
 * Card that tips toward the pointer with real perspective. Rotation,
 * shadow, and gloss all read the same two motion values, so one pointer
 * move drives every layer without a re-render. Touch is ignored so the
 * effect never competes with scrolling.
 */
export function TiltCard({
  children,
  className,
  max = 12,
  perspective = 800,
  ...props
}: TiltCardProps) {
  const reduceMotion = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, TRACK);
  const sy = useSpring(py, TRACK);

  const rotateX = useTransform(sy, (v) => (0.5 - v) * max * 2);
  const rotateY = useTransform(sx, (v) => (v - 0.5) * max * 2);

  // Gloss sweeps opposite the tilt, and only lights up once moved.
  const glossX = useTransform(sx, (v) => `${(1 - v) * 150 - 25}%`);
  const glow = useSpring(useMotionValue(0), { stiffness: 200, damping: 26 });
  const shadowX = useTransform(sx, (v) => (v - 0.5) * -18);
  const shadowY = useTransform(sy, (v) => (v - 0.5) * -18);

  const track = (e: React.PointerEvent) => {
    if (reduceMotion || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
    glow.set(1);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    glow.set(0);
  };

  return (
    <div style={{ perspective }}>
      <motion.div
        onPointerMove={track}
        onPointerLeave={reset}
        style={
          reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        className={cn(
          "relative overflow-hidden rounded-lg border border-border bg-card",
          className
        )}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        <motion.div
          aria-hidden
          style={reduceMotion ? undefined : { opacity: glow }}
          className="pointer-events-none absolute inset-0 z-10"
        >
          <motion.div
            style={reduceMotion ? undefined : { left: glossX }}
            className="absolute inset-y-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.09),transparent)]"
          />
        </motion.div>
        <motion.div
          aria-hidden
          style={reduceMotion ? undefined : { x: shadowX, y: shadowY }}
          className="pointer-events-none absolute inset-0 rounded-lg shadow-[0_18px_40px_-18px_rgba(0,0,0,0.4)]"
        />
        <div className="relative">{children}</div>
      </motion.div>
    </div>
  );
}
