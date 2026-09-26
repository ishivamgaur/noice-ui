"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {  /** Reverse scroll direction. @default false */
  reverse?: boolean;
  /** Pause scrolling while hovered or focused. @default true */
  pauseOnHover?: boolean;
  /** Seconds per loop. @default 40 */
  duration?: number;
  /** Scroll this far instead of 50%, for grids that do not split evenly. */
  distance?: string;
}


/**
 * An infinite scrolling row. Children are duplicated internally to make
 * the loop seamless, so the copy is hidden from assistive technology and
 * only the original set is announced. The keyframes are emitted with the
 * component so the file needs nothing from the host stylesheet.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  duration = 40,
  distance = "50%",
  ...props
}: MarqueeProps) {
  const slug = distance.replace(/[^a-z0-9]/gi, "") || "50";
  const id = `mq-${slug}`;

  return (
    <div
      className={cn(
        "group relative flex w-full flex-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
      {...props}
    >
      <style>{`
@keyframes marquee-${id} { from { transform: translateX(0); } to { transform: translateX(-${distance}); } }
`}</style>
      <div
        className={cn(
          "flex w-max shrink-0 flex-nowrap items-stretch gap-4 pr-4 motion-reduce:[animation:none]",
          pauseOnHover && "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        )}
        style={{
          animation: `marquee-${id} ${duration}s linear infinite${
            reverse ? " reverse" : ""
          }`,
        }}
      >
        {children}
      </div>
      {/* The loop copy. Hidden from the accessibility tree and from the
          tab order, so the row is not read or tabbed through twice. */}
      <div
        aria-hidden
        className={cn(
          "flex w-max shrink-0 flex-nowrap items-stretch gap-4 pr-4 motion-reduce:[animation:none]",
          pauseOnHover && "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        )}
        style={{
          animation: `marquee-${id} ${duration}s linear infinite${
            reverse ? " reverse" : ""
          }`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
