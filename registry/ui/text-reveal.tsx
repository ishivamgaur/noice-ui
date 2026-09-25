"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
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
 * Blurs and lifts each word into place, in sequence, the first time the
 * line scrolls into view. Plays once. Under reduced motion the words are
 * simply rendered in place, with no travel and no blur.
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
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount });
  const text = typeof children === "string" ? children : null;

  if (text === null) {
    return (
      <span ref={ref} className={className} {...props}>
        {children}
      </span>
    );
  }

  const words = text.split(" ");

  if (reduceMotion) {
    return (
      <span ref={ref} className={cn("inline-block", className)} {...props}>
        {text}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={cn("inline-block", className)}
      {...props}
    >
      {words.map((word, i) => (
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
          {/* The space lives outside the animated span, so a word can never
              be the last thing on a line and lose its separator. */}
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
