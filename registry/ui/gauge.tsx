"use client";

import * as React from "react";
import { motion, useInView, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export interface GaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value, 0-100. */
  value: number;
  label: string;
  /** Value at or above which the marker flashes. @default 85 */
  threshold?: number;
}

const TICKS = 41;
const R = 84;
const CX = 100;
const CY = 100;
// Top semicircle: 180deg on the left, through 270deg, to 360deg on the right.
const START = 180;
const FULL = 180;

// Rounded to 2dp on purpose. Math.cos/sin return results that differ in
// the last bit between Node and the browser, so unrounded coordinates
// serialise differently on each side and trip a hydration mismatch. Two
// decimals is far finer than a 200x112 viewBox can show.
const r2 = (n: number) => Math.round(n * 100) / 100;

const at = (ratio: number, radius: number) => {
  const a = ((START + ratio * FULL) * Math.PI) / 180;
  return {
    x: r2(CX + Math.cos(a) * radius),
    y: r2(CY + Math.sin(a) * radius),
  };
};

/**
 * Half-circle gauge. The needle is a spring driven by an in-view trigger,
 * and tick states are written straight to the DOM so the animation never
 * re-renders the tree.
 */
export function Gauge({
  value,
  label,
  threshold = 85,
  className,
  ...props
}: GaugeProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const ticks = React.useRef<Array<SVGLineElement | null>>([]);
  const peakRef = React.useRef<SVGCircleElement>(null);
  const readout = React.useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const spring = useSpring(0, { stiffness: 70, damping: 18 });
  // The needle art points straight up (270deg), so subtract that here.
  // Return a raw angle, not a transform string: motion's `rotate` prop
  // builds the transform itself, and nesting it would double-wrap.
  const needle = useTransform(spring, (v) => START + (v / 100) * FULL - 270);

  // Paint ticks and the readout directly, bypassing React on every frame.
  React.useEffect(() => {
    const paint = (v: number) => {
      const lit = Math.round((v / 100) * TICKS);
      ticks.current.forEach((tick, i) => {
        if (i <= lit) tick?.setAttribute("data-lit", "");
        else tick?.removeAttribute("data-lit");
      });
      if (readout.current)
        readout.current.textContent = String(Math.round(v));
    };
    paint(spring.get());
    return spring.on("change", paint);
  }, [spring]);

  React.useEffect(() => {
    if (!inView) return;
    spring.set(value);
    if (value >= threshold && peakRef.current) {
      peakRef.current
        .animate(
          [
            { opacity: 0 },
            { opacity: 1, offset: 0.15 },
            { opacity: 1, offset: 0.7 },
            { opacity: 0 },
          ],
          { duration: 900, easing: "ease-out" }
        )
        .finished.catch(() => {});
    }
  }, [inView, value, threshold, spring]);

  const peak = at(threshold / 100, R - 16);

  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center", className)}
      {...props}
    >
      <svg viewBox="0 0 200 112" className="w-full max-w-52" aria-hidden>
        {Array.from({ length: TICKS }).map((_, i) => {
          const ratio = i / (TICKS - 1);
          const major = i % 5 === 0;
          const outer = at(ratio, R);
          const inner = at(ratio, R - (major ? 14 : 8));
          return (
            <line
              key={i}
              ref={(el) => {
                ticks.current[i] = el;
              }}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="currentColor"
              strokeWidth={major ? 2.5 : 1.5}
              strokeLinecap="round"
              className="text-border transition-colors duration-150 data-[lit]:text-brand"
            />
          );
        })}
        <motion.g
          style={{ rotate: needle, originX: `${CX}px`, originY: `${CY}px` }}
        >
          <line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - R + 16}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-foreground"
          />
        </motion.g>
        <circle cx={CX} cy={CY} r="5" className="fill-foreground" />
        <circle
          ref={peakRef}
          cx={peak.x}
          cy={peak.y}
          r="4"
          opacity={0}
          className="fill-brand"
        />
      </svg>
      <p
        ref={readout}
        className="-mt-1 text-2xl font-semibold tabular-nums tracking-tight"
      >
        {Math.round(value)}
      </p>
      <p className="text-[13px] text-muted-foreground">{label}</p>
    </div>
  );
}
