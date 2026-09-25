"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface NumberStepperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

/** Digits roll vertically; columns are keyed by place from the right,
    so 9 -> 10 keeps the ones column instead of restarting it. */
function RollingNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const text = String(value);
  const places = text.length;

  return (
    <span className={cn("inline-flex tabular-nums", className)}>
      {text.split("").map((digit, i) => {
        const place = places - i - 1;
        return (
          // Keyed by place only, so the column survives a digit change and
          // only gains a new one when the number grows wider.
          <span key={place} className="relative overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={digit}
                initial={
                  reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }
                }
                animate={{ y: "0%", opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="block"
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}

/** Numeric stepper where the display rolls instead of snapping. */
export function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  className,
  ...props
}: NumberStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(clamp(value - step))}
          disabled={value <= min}
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-30"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M5 12h14" />
          </svg>
        </button>
        <span className="min-w-8 text-center text-sm font-medium">
          <RollingNumber value={value} />
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(clamp(value + step))}
          disabled={value >= max}
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-30"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
