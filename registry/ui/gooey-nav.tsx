"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type GooeyNavItem = string | { label: string; href?: string };

export interface GooeyNavProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  items: GooeyNavItem[];
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  /** Brand fill of the blob. @default "var(--brand)" */
  activeColor?: string;
}

const labelOf = (item: GooeyNavItem) =>
  typeof item === "string" ? item : item.label;
const hrefOf = (item: GooeyNavItem) =>
  typeof item === "string" ? undefined : item.href;

/**
 * Segmented nav where the active pill is a gooey blob. Segments share
 * equal width, so the blob travels in pure percentages and nothing is
 * ever measured. A lagging satellite dot stretches the neck through
 * the goo filter while it moves.
 */
export function GooeyNav({
  items,
  value,
  defaultValue = 0,
  onChange,
  activeColor = "var(--brand)",
  className,
  ...props
}: GooeyNavProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const active = value ?? inner;
  const reduceMotion = useReducedMotion();
  const rawId = React.useId();
  const filterId = `goo-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const n = items.length;
  const pct = 100 / n;
  const left = `${active * pct}%`;
  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 350, damping: 32 };
  const lag = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 120, damping: 18 };

  const pick = (i: number) => {
    if (value === undefined) setInner(i);
    onChange?.(i);
  };

  return (
    <nav
      aria-label="Primary"
      className={cn("relative", className)}
      {...props}
    >
      <svg aria-hidden className="absolute h-0 w-0">
        <defs>
          {/* Padded region so the blur never clips at the row edges. */}
          <filter
            id={filterId}
            x="-20%"
            y="-40%"
            width="140%"
            height="180%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      {/* Blob layer: pill plus a chasing dot, merged by the filter. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ filter: `url(#${filterId})` }}
      >
        <motion.span
          className="absolute top-1 bottom-1 rounded-full"
          style={{ width: `${pct}%`, background: activeColor }}
          initial={false}
          animate={{ left }}
          transition={spring}
        />
        <motion.span
          className="absolute top-1/2 size-6 -translate-y-1/2 rounded-full"
          style={{ background: activeColor }}
          initial={false}
          animate={{ left: `calc(${left} + ${pct / 2}% - 0.75rem)` }}
          transition={lag}
        />
      </div>
      <div className="relative flex">
        {items.map((item, i) => {
          const isActive = i === active;
          const label = labelOf(item);
          const href = hrefOf(item);
          const cls = cn(
            "flex h-10 flex-1 items-center justify-center rounded-full px-2 text-sm outline-none transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 truncate",
            isActive
              ? "font-medium text-white"
              : "text-muted-foreground hover:text-foreground"
          );
          return href ? (
            <a
              key={label}
              href={href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => pick(i)}
              className={cls}
            >
              <span className="truncate">{label}</span>
            </a>
          ) : (
            <button
              key={label}
              type="button"
              aria-current={isActive ? "true" : undefined}
              onClick={() => pick(i)}
              className={cls}
            >
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
