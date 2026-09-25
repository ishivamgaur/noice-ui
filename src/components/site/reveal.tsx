"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { rise, spring } from "@/lib/motion";

/**
 * Subtle rise-in when scrolled into view. Fires once, respects
 * reduced motion. Wrap whole grids - never individual cards that
 * already have CSS hover transforms (motion would override them).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={rise.hidden}
      whileInView={rise.shown}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}
