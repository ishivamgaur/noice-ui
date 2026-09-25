"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

export interface ScrollProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Spring stiffness. @default 120 */
  stiffness?: number;
  /** Spring damping. @default 25 */
  damping?: number;
}

/**
 * Scroll-linked progress bar. Place it in a `fixed` or `sticky`
 * container at the top of the page; the bar scales on the x-axis
 * with document scroll and follows the brand token.
 */
export function ScrollProgress({
  className,
  stiffness = 120,
  damping = 25,
  style,
  ...props
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness, damping });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left", ...style }}
      className={cn("h-0.5 w-full bg-brand", className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    />
  );
}
