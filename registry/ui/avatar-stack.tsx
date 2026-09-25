"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Avatar {
  /** Initials, or the name used to derive them. */
  name: string;
  /** Optional image URL. Rendered as the avatar when present. */
  src?: string;
  alt?: string;
}

export interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  people: Avatar[];
  /** How many to show before the overflow count. @default 5 */
  max?: number;
}

function initial(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "?";
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
        "flex items-center transition-[width] duration-300 ease-out motion-reduce:transition-none",
        className
      )}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      // The open pitch already leaves the last avatar's own width, so the
      // reserved space is exactly the fan plus one avatar's overhang.
      style={{ width: total * pitch + (32 - pitch) }}
      {...props}
    >
      {shown.map((person, i) => (
        <span
          key={`${person.name}-${i}`}
          title={person.name}
          className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted text-[11px] font-medium text-muted-foreground transition-[margin,transform] duration-300 ease-out hover:z-10 hover:-translate-y-0.5 motion-reduce:transition-none motion-safe:hover:scale-105"
          style={{ marginLeft: i === 0 ? 0 : overlap }}
        >
          {person.src ? (
            // A plain img on purpose: this file has to work outside
            // Next.js too, and next/image would add a dependency the user
            // may not have.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.src}
              alt={person.alt ?? ""}
              className="size-full object-cover"
              loading="lazy"
            />
          ) : (
            initial(person.name)
          )}
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
