import * as React from "react";
import { cn } from "@/lib/utils";

export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Seconds per revolution. @default 8 */
  duration?: number;
  /** Beam width in px. @default 140 */
  size?: number;
  /** Offset along the border, in px. @default 0 */
  offset?: number;
  /** Seconds before the beam starts. @default 0 */
  delay?: number;
}

/**
 * A light travelling around the border. The rotating conic gradient is
 * masked to a 1px ring, so only the edge glows. Decorative, so it is
 * aria-hidden and stops under reduced motion.
 */
export function BorderBeam({
  className,
  duration = 8,
  size = 140,
  offset = 0,
  delay = 0,
  style,
  ...props
}: BorderBeamProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className
      )}
      style={{ ...style }}
      {...props}
    >
      <div
        className="aspect-square animate-[border-beam_var(--beam-duration)_linear_infinite_var(--beam-delay)] w-full [--beam-offset:0px] [--beam-size:140px] [--beam-duration:8s] [--beam-delay:0s] [mask-image:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-clip:padding-box,border-box] [padding:1px]"
        style={
          {
            background:
              "conic-gradient(from var(--beam-angle), transparent 0 70%, var(--color-brand) 85%, transparent 100%)",
            "--beam-angle": `${offset}deg`,
            "--beam-size": `${size}px`,
            "--beam-duration": `${duration}s`,
            "--beam-delay": `${delay}s`,
          } as React.CSSProperties
        }
      >
        <div className="h-full w-full bg-card" />
      </div>
    </div>
  );
}
