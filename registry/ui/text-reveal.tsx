"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export interface TextRevealProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Seconds between each word. @default 0.045 */
  stagger?: number;
  /** Delay before the first word. @default 0 */
  delay?: number;
  /** Fraction visible before it plays. @default 0.5 */
  amount?: number;
}

/**
 * Blurs and lifts each word into place, in sequence, the first time
 * the line scrolls into view. Plays once; static under reduced motion.
 */
export function TextReveal({
  children,
  className,
  stagger = 0.045,
  delay = 0,
  amount = 0.5,
  ...props
}: TextRevealProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const text = typeof children === "string" ? children : null;

  if (text === null) {
    return (
      <span ref={ref} className={className} {...props}>
        {children}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={cn("inline-block", className)}
      {...props}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block [will-change:transform,opacity,filter]"
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 10, filter: "blur(6px)" }
          }
          transition={{
            delay: delay + i * stagger,
            type: "spring",
            stiffness: 240,
            damping: 26,
          }}
        >
          {word}
          {i < text.split(" ").length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}
