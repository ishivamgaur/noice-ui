"use client";

import * as React from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

export interface NumberTickerProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Target value to count up to. */
  value: number;
  /** Decimal places. @default 0 */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Seconds the count takes. @default 2 */
  duration?: number;
  /** Fraction of the element that must be visible to start. @default 0.4 */
  amount?: number;
}

/**
 * Counts up to `value` the first time it scrolls into view. Springs to
 * rest, holds still under reduced motion, and formats to `decimals`.
 */
export function NumberTicker({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2,
  amount = 0.4,
  className,
  ...props
}: NumberTickerProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const [display, setDisplay] = React.useState(() => (0).toFixed(decimals));

  React.useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      if (reduce) {
        setDisplay(value.toFixed(decimals));
        return;
      }
      const t = Math.min((now - start) / (duration * 1000), 1);
      // Ease out cubic so it decelerates instead of stopping dead.
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay((value * eased).toFixed(decimals));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, decimals, duration]);

  return (
    <span
      ref={ref}
      className={cn("inline-flex tabular-nums tracking-tight", className)}
      {...props}
    >
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
