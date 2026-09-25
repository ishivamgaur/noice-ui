import * as React from "react";
import { cn } from "@/lib/utils";

export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Seconds per revolution. @default 8 */
  duration?: number;
  /** Width of the bright band as a percentage of the turn. @default 15 */
  size?: number;
  /** Offset along the border, in degrees. @default 0 */
  offset?: number;
  /** Seconds before the beam starts. @default 0 */
  delay?: number;
  /** Beam colour. Falls back to the theme's brand token. */
  color?: string;
}

let uid = 0;

/**
 * A light travelling around the border. The rotating conic gradient is
 * masked to a 1px ring, so only the edge glows.
 *
 * The keyframes and the custom-property registration are emitted with the
 * component rather than expected to exist in the host's stylesheet, so the
 * file works on its own in any project. Decorative, so it is aria-hidden
 * and stops under reduced motion.
 */
export function BorderBeam({
  className,
  duration = 8,
  size = 15,
  offset = 0,
  delay = 0,
  color,
  style,
  ...props
}: BorderBeamProps) {
  // Stable per instance so two beams on a page cannot fight over the same
  // registered angle or keyframe name.
  const id = React.useMemo(() => `bb-${++uid}`, []);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className
      )}
      style={style}
      {...props}
    >
      <style>{`
@property --beam-angle-${id} { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
@keyframes beam-turn-${id} { to { --beam-angle-${id}: 360deg; } }
`}</style>
      <div
        className="aspect-square w-full [mask-image:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-clip:padding-box,border-box] [padding:1px] motion-reduce:[animation:none]"
        style={{
          // `size` is the width of the lit band, so the transparent part of
          // the sweep is whatever is left of the turn. `offset` shifts where
          // the sweep begins.
          background: `conic-gradient(from calc(var(--beam-angle-${id}) + ${offset}deg), transparent 0 ${
            100 - size
          }%, ${color ?? "var(--brand, #932a35)"} ${
            100 - size / 2
          }%, transparent 100%)`,
          animation: `beam-turn-${id} ${duration}s linear ${
            delay > 0 ? `${delay}s ` : ""
          }infinite`,
        }}
      >
        <div className="h-full w-full bg-card" />
      </div>
    </div>
  );
}
