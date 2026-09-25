"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface WordRotatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  words: string[];
  /** Milliseconds per word. @default 2600 */
  interval?: number;
  paused?: boolean;
}

/**
 * Cycles through words with a rolling swap. Each word is laid out on a
 * fixed-width grid cell so the surrounding line never reflows while the
 * words change. Under reduced motion the words cross-fade in place
 * instead of rolling.
 *
 * The full list is exposed once to assistive technology and the animated
 * copy is hidden, so a screen reader is not interrupted mid-sentence.
 */
export function WordRotator({
  words,
  interval = 2600,
  paused = false,
  className,
  ...props
}: WordRotatorProps) {
  const reduceMotion = useReducedMotion();
  const list = words.filter(Boolean);
  const [index, setIndex] = React.useState(0);
  const count = list.length;

  React.useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % count),
      interval
    );
    return () => clearInterval(id);
  }, [paused, interval, count]);

  if (count === 0) return <span className={className} {...props} />;

  const current = list[index % count];

  return (
    <span
      className={cn("relative inline-grid overflow-hidden align-bottom", className)}
      {...props}
    >
      <span className="sr-only">{list.join(", ")}</span>
      {/* Invisible sizer: holds the widest word so the grid cell never
          resizes as the visible word changes. */}
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
      >
        {list.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <span className="relative col-start-1 row-start-1">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={current}
            initial={
              reduceMotion ? { opacity: 0 } : { y: "60%", opacity: 0 }
            }
            animate={{ y: "0%", opacity: 1 }}
            exit={
              reduceMotion ? { opacity: 0 } : { y: "-60%", opacity: 0 }
            }
            transition={{ duration: reduceMotion ? 0.12 : 0.34 }}
            className="block whitespace-nowrap"
          >
            {current}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
