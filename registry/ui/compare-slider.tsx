"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface CompareSliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  before: React.ReactNode;
  after: React.ReactNode;
  /** Start position, 0 to 1. @default 0.5 */
  initial?: number;
  beforeLabel?: string;
  afterLabel?: string;
  label?: string;
  onChange?: (position: number) => void;
}

/**
 * Before/after comparison. Position lives in a motion value wired
 * straight to clip-path, divider, tags, and ARIA attributes, so drags
 * never re-render. Touch waits past a small horizontal slop so
 * vertical scroll survives.
 */
export function CompareSlider({
  before,
  after,
  initial = 0.5,
  beforeLabel = "Before",
  afterLabel = "After",
  label = "Comparison position",
  onChange,
  className,
  ...props
}: CompareSliderProps) {
  const reduceMotion = useReducedMotion();
  const frame = React.useRef<HTMLDivElement>(null);
  const handle = React.useRef<HTMLButtonElement>(null);
  const dragging = React.useRef(false);
  const moved = React.useRef(false);
  const start = React.useRef({ x: 0, y: 0 });
  const pos = useMotionValue(initial);

  const insetRight = useTransform(pos, (v) => `${(1 - v) * 100}%`);
  const beforeClip = useMotionTemplate`inset(0 ${insetRight} 0 0)`;
  const dividerLeft = useTransform(pos, (v) => `${v * 100}%`);
  const beforeTag = useTransform(pos, (v) => (v > 0.18 ? 1 : 0));
  const afterTag = useTransform(pos, (v) => (v < 0.82 ? 1 : 0));

  // ARIA stays honest without re-rendering: write it to the DOM directly.
  React.useEffect(
    () =>
      pos.on("change", (v) => {
        const pct = Math.round(v * 100);
        handle.current?.setAttribute("aria-valuenow", String(pct));
        handle.current?.setAttribute("aria-valuetext", `${pct} percent`);
      }),
    [pos]
  );

  const commit = (next: number) => {
    onChange?.(Math.round(next * 100) / 100);
  };

  const setFromClientX = (clientX: number) => {
    const el = frame.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    pos.set(next);
    commit(next);
  };

  const glideTo = (next: number) => {
    if (reduceMotion) pos.set(next);
    else animate(pos, next, { duration: 0.25, ease: "easeOut" });
    commit(next);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragging.current = true;
    moved.current = false;
    start.current = { x: e.clientX, y: e.clientY };
    handle.current?.focus({ preventScroll: true });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    // Touch: ignore until the gesture proves horizontal.
    if (e.pointerType === "touch" && !moved.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) >= 8) {
        dragging.current = false;
        return;
      }
      if (Math.abs(dx) < 8) return;
    }
    moved.current = true;
    setFromClientX(e.clientX);
  };

  const endDrag = (clientX?: number) => {
    // A tap without travel glides instead of jumping.
    if (dragging.current && !moved.current && clientX !== undefined) {
      const el = frame.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        glideTo(
          Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        );
      }
    }
    dragging.current = false;
  };

  const onHandleKeyDown = (e: React.KeyboardEvent) => {
    const step = 0.05;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      glideTo(Math.max(0, Math.round((pos.get() - step) * 100) / 100));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      glideTo(Math.min(1, Math.round((pos.get() + step) * 100) / 100));
    } else if (e.key === "Home") {
      e.preventDefault();
      glideTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      glideTo(1);
    }
  };

  return (
    <div
      ref={frame}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => endDrag(e.clientX)}
      onPointerCancel={() => endDrag()}
      className={cn(
        "relative aspect-[16/10] w-full touch-pan-y overflow-hidden rounded-2xl border border-border select-none",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0">{after}</div>
      <motion.div className="absolute inset-0" style={{ clipPath: beforeClip }}>
        {before}
      </motion.div>
      <motion.span
        style={{ opacity: beforeTag }}
        className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white"
      >
        {beforeLabel}
      </motion.span>
      <motion.span
        style={{ opacity: afterTag }}
        className="absolute top-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white"
      >
        {afterLabel}
      </motion.span>
      <motion.div
        aria-hidden
        className="absolute inset-y-0 w-px bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)]"
        style={{ left: dividerLeft }}
      />
      <motion.button
        ref={handle}
        type="button"
        role="slider"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(initial * 100)}
        aria-valuetext={`${Math.round(initial * 100)} percent`}
        onKeyDown={onHandleKeyDown}
        style={{ left: dividerLeft }}
        className="absolute top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border bg-background shadow-raised outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="m9 6-4 6 4 6M15 6l4 6-4 6" />
        </svg>
      </motion.button>
    </div>
  );
}
