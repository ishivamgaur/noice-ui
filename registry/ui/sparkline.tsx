"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SparklineProps extends React.SVGProps<SVGSVGElement> {
  /** The series to draw. */
  data: number[];
  /** Stroke colour. @default "var(--color-brand)" */
  color?: string;
  /** Fill the area under the line. @default true */
  area?: boolean;
  /** Draw the line on first view. @default true */
  animate?: boolean;
  /** Height in px. @default 40 */
  height?: number;
  label?: string;
}

const W = 100;
// Rounded so the emitted path data is stable and short. Pure arithmetic
// is bit-identical across engines, but rounding keeps the markup tidy and
// removes any chance of a server/client string difference.
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * A line chart sized in a fixed 100-unit viewBox, so it scales to any
 * width without measuring. The line draws itself with pathLength and the
 * area fades in behind it. Self-contained: no keyframes or plugins.
 */
export function Sparkline({
  data,
  color = "var(--color-brand)",
  area = true,
  animate = true,
  height = 40,
  label,
  className,
  style,
  ...props
}: SparklineProps) {
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const play = animate && inView && !reduceMotion;
  // Reduced motion, or a static chart, shows the finished line at once.
  const shown = reduceMotion || !animate || inView;

  const { line, fill } = React.useMemo(() => {
    if (data.length === 0) return { line: "", fill: "" };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    // A flat series sits on the centre line rather than the bottom edge.
    const y = (v: number) =>
      max === min ? height / 2 : height - ((v - min) / span) * (height - 4) - 2;
    const step = data.length > 1 ? W / (data.length - 1) : W;
    const d = data
      .map((v, i) => `${i === 0 ? "M" : "L"}${r2(i * step)} ${r2(y(v))}`)
      .join(" ");
    return { line: d, fill: `${d} L${W} ${height} L0 ${height} Z` };
  }, [data, height]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="none"
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("w-full overflow-visible", className)}
      style={{ height, ...style }}
      {...props}
    >
      {area && (
        <motion.path
          d={fill}
          fill={color}
          initial={false}
          animate={{ opacity: shown ? 0.12 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.5 }}
        />
      )}
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: shown ? 1 : 0 }}
        transition={{ duration: play ? 0.9 : 0, ease: "easeOut" }}
      />
    </svg>
  );
}
