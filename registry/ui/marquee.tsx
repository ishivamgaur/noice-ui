"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Reverse scroll direction. @default false */
  reverse?: boolean;
  /** Pause scrolling while hovered. @default true */
  pauseOnHover?: boolean;
  /** Seconds per loop. @default 40 */
  duration?: number;
}

/**
 * An infinite scrolling row. Children are duplicated internally so the
 * loop is seamless. Edges fade via mask. Honors reduced motion.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  duration = 40,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "animate-marquee flex w-max shrink-0 items-stretch gap-4 pr-4",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : undefined,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
