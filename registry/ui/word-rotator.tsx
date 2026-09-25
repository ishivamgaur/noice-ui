"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface WordRotatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  words: string[];
  /** Milliseconds per word. @default 2600 */
  interval?: number;
  paused?: boolean;
}

/**
 * Cycles through words while keeping the letters they share. A longest
 * common subsequence picks the letters that survive a swap, so those
 * glyphs travel to their new positions instead of cross-fading - which is
 * what makes it read as one word rearranging rather than a swap.
 */
export function WordRotator({
  words,
  interval = 2600,
  paused = false,
  className,
  ...props
}: WordRotatorProps) {
  const reduce = useReducedMotion();
  const list = words.length > 0 ? words : [""];
  const [index, setIndex] = React.useState(0);
  const [width, setWidth] = React.useState<number | null>(null);
  const inner = React.useRef<HTMLSpanElement>(null);
  const letters = React.useRef<Map<string, HTMLElement>>(new Map());

  React.useEffect(() => {
    if (paused) return;
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % list.length), interval);
    return () => clearInterval(id);
  }, [paused, reduce, interval, list.length]);

  // Pause on hover, so a pointer resting on the headline stops it moving.
  const [hovered, setHovered] = React.useState(false);
  const frozen = paused || (hovered && !reduce);

  React.useEffect(() => {
    if (!frozen) return;
    const t = setTimeout(() => setIndex(0), 250);
    return () => clearTimeout(t);
  }, [frozen]);

  React.useEffect(() => {
    if (reduce) return;
    const el = inner.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setWidth(el.offsetWidth));
    observer.observe(el);
    setWidth(el.offsetWidth);
    return () => observer.disconnect();
  }, [reduce]);

  const current = list[index % list.length] ?? "";

  return (
    <span
      className={cn("relative inline-grid align-bottom", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <span className="sr-only">{list.join(", ")}</span>
      <span
        ref={inner}
        aria-hidden
        className="col-start-1 row-start-1 inline-flex whitespace-nowrap"
        style={{ width: width ?? undefined }}
      >
        {Array.from(current).map((char, i) => {
          // Stable key per character keeps the DOM node across swaps, so
          // shared letters can be measured and moved rather than remounted.
          const key = `${char}-${i}`;
          return (
            <span
              key={key}
              ref={(el) => {
                if (el) letters.current.set(key, el);
                else letters.current.delete(key);
              }}
              className="inline-block will-change-transform"
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
