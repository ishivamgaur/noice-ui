"use client";

import * as React from "react";
import { animate, useReducedMotion } from "motion/react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SlideToConfirmProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  confirmedLabel?: string;
  onConfirm?: () => void;
}

/**
 * A knob that must be dragged past the threshold to confirm. Release
 * early and a spring snaps it home; flick it with velocity and it
 * completes without touching the end. Keyboard confirms too.
 */
export function SlideToConfirm({
  label = "Slide to confirm",
  confirmedLabel = "Confirmed",
  onConfirm,
  className,
  ...props
}: SlideToConfirmProps) {
  const reduceMotion = useReducedMotion();
  const track = React.useRef<HTMLDivElement>(null);
  const [knob, setKnob] = React.useState(0);
  // Track width measured on first touch, so render never reads the DOM.
  const [max, setMax] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const drag = React.useRef({ active: false, startX: 0, base: 0, max: 0 });
  const recent = React.useRef<Array<{ x: number; t: number }>>([]);

  const measure = () => {
    const el = track.current;
    return el ? el.clientWidth - 56 : 0;
  };

  const finish = () => {
    const target = measure();
    setMax(target);
    if (reduceMotion) {
      setKnob(target);
    } else {
      animate(knob, target, {
        type: "spring",
        stiffness: 400,
        damping: 32,
        onUpdate: setKnob,
      });
    }
    setDone(true);
    onConfirm?.();
    setTimeout(() => {
      setDone(false);
      setKnob(0);
    }, 2000);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (done) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const measured = measure();
    setMax(measured);
    drag.current = { active: true, startX: e.clientX, base: knob, max: measured };
    // Event timestamps, not wall-clock calls, so the math stays pure.
    recent.current = [{ x: e.clientX, t: e.timeStamp }];
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active || done) return;
    // Rubber-band past both ends so the travel feels soft, never loose.
    const raw = d.base + (e.clientX - d.startX);
    const next =
      raw < 0 ? raw * 0.25 : raw > d.max ? d.max + (raw - d.max) * 0.25 : raw;
    setKnob(Math.max(-8, next));
    const now = e.timeStamp;
    recent.current.push({ x: e.clientX, t: now });
    recent.current = recent.current.filter((p) => now - p.t < 100);
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (!d.active || done) return;
    d.active = false;
    const pts = recent.current;
    const velocity =
      pts.length > 1
        ? (pts[pts.length - 1].x - pts[0].x) /
          Math.max(1, pts[pts.length - 1].t - pts[0].t)
        : 0;
    // A fast flick counts even short of the line.
    if (knob >= d.max * 0.92 || velocity > 1.2) {
      finish();
      return;
    }
    if (reduceMotion) setKnob(0);
    else {
      animate(knob, 0, {
        type: "spring",
        stiffness: 380,
        damping: 26,
        onUpdate: setKnob,
      });
    }
  };

  const onKnobKeyDown = (e: React.KeyboardEvent) => {
    if (done) return;
    if (e.key === "ArrowRight" || e.key === "End") {
      e.preventDefault();
      finish();
    }
  };

  const progress = Math.max(0, Math.min(1, knob / Math.max(1, max)));

  return (
    <div
      ref={track}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={cn(
        "relative h-14 w-full max-w-72 touch-none overflow-hidden rounded-full border border-border bg-surface select-none",
        className
      )}
      {...props}
    >
      {/* Fill is translated, never resized, so layout never thrashes. */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-brand/90"
        style={{ transform: `scaleX(${progress})` }}
      />
      <span
        aria-hidden
        style={{ opacity: 1 - progress * 1.6 }}
        className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground"
      >
        {label}
      </span>
      <span
        aria-hidden
        style={{ opacity: progress > 0.6 ? (progress - 0.6) * 2.5 : 0 }}
        className="absolute inset-0 flex items-center justify-center gap-1.5 text-sm font-medium text-white"
      >
        <Check className="size-4" />
        {confirmedLabel}
      </span>
      <button
        type="button"
        aria-label={done ? confirmedLabel : label}
        aria-disabled={done}
        onKeyDown={onKnobKeyDown}
        onClick={(e) => {
          // Keyboard activation travels the same path as a drag.
          if (e.detail === 0 && !done) finish();
        }}
        style={{ transform: `translateX(${knob}px)` }}
        className="absolute top-1 left-1 flex size-12 cursor-grab items-center justify-center rounded-full bg-background shadow-raised outline-none focus-visible:outline-2 focus-visible:outline-offset-2 active:cursor-grabbing"
      >
        {done ? (
          <Check className="size-5 text-brand" />
        ) : (
          <ChevronRight className="size-5 text-muted-foreground" />
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {done ? confirmedLabel : ""}
      </span>
    </div>
  );
}
