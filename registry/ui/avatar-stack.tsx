"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initials or image URLs, in order. */
  people: string[];
  /** How many to show before the overflow count. @default 5 */
  max?: number;
}

/**
 * Overlapping avatars that fan apart on hover and focus. Width is
 * preallocated at the open pitch, so nothing around it reflows.
 */
export function AvatarStack({
  people,
  max = 5,
  className,
  ...props
}: AvatarStackProps) {
  const [open, setOpen] = React.useState(false);
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  // Avatars are size-8 (32px). Closed they overlap heavily, open they fan.
  const pitch = open ? 28 : 12;
  const overlap = pitch - 32;
  const total = shown.length + (extra > 0 ? 1 : 0);

  return (
    <div
      className={cn(
        "flex items-center transition-[width] duration-300 ease-out",
        className
      )}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      style={{ width: total * pitch + 20 }}
      {...props}
    >
      {shown.map((person, i) => (
        <span
          key={`${person}-${i}`}
          title={person}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-[11px] font-medium text-muted-foreground transition-[margin,transform] duration-300 ease-out hover:z-10 hover:-translate-y-0.5 motion-safe:hover:scale-105"
          )}
          style={{ marginLeft: i === 0 ? 0 : overlap }}
        >
          {person.slice(0, 1).toUpperCase()}
        </span>
      ))}
      {extra > 0 && (
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-[11px] font-medium text-muted-foreground"
          style={{ marginLeft: overlap }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
