"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the group. */
  label: string;
}

/**
 * A radio group drawn as one continuous track. Segments share equal
 * width, so the selection pill travels in pure percentages and no button
 * is ever measured. Leading and trailing edges use different springs so
 * the pill stretches in the direction of travel.
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  label,
  className,
  ...props
}: SegmentedControlProps) {
  const reduceMotion = useReducedMotion();
  // Guard the empty case: `100 / 0` would put NaN into the motion values
  // and the pill would fly off to nowhere.
  if (options.length === 0) return null;

  return (
    <SegmentedControlInner
      options={options}
      value={value}
      onChange={onChange}
      label={label}
      reduceMotion={reduceMotion}
      className={className}
      {...props}
    />
  );
}

function SegmentedControlInner({
  options,
  value,
  onChange,
  label,
  reduceMotion,
  className,
  ...props
}: SegmentedControlProps & { reduceMotion: boolean | null }) {
  const buttons = React.useRef<Array<HTMLButtonElement | null>>([]);
  const index = Math.max(0, options.indexOf(value));
  const n = options.length;
  const width = 100 / n;

  // Roving focus: selecting with the keyboard has to actually move DOM
  // focus, not just the tabIndex. Without this the focus ring stays on the
  // radio that was just deselected.
  const move = (next: number) => {
    const wrapped = (next + n) % n;
    onChange(options[wrapped]);
    buttons.current[wrapped]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(index + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(0);
    } else if (e.key === "End") {
      e.preventDefault();
      move(n - 1);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex w-full max-w-xs rounded-full border border-border bg-surface p-1",
        className
      )}
      {...props}
    >
      {/* The pill lives inside a wrapper that is exactly the buttons' box.
          Percentages on the container would resolve against its padding
          box and sit 4px proud of the buttons on each side. */}
      <div className="relative flex flex-1">
        <motion.span
          aria-hidden
          initial={false}
          animate={{ left: `${index * width}%` }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 34 }
          }
          className="absolute inset-y-0 rounded-full bg-background shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
          style={{ width: `${width}%` }}
        />
        {options.map((option, i) => {
          const selected = i === index;
          return (
            <button
              key={option}
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              // Roving tab focus: the group is one tab stop.
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                onChange(option);
                buttons.current[i]?.focus();
              }}
              className={cn(
                // Equal flex width plus a fixed minimum, so every label
                // breathes the same amount on both sides however the track
                // is sized. nowrap keeps a long label from squeezing its
                // neighbours out of symmetry.
                "relative z-10 h-8 flex-1 rounded-full px-4 text-[13px] whitespace-nowrap outline-none transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1",
                selected
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
