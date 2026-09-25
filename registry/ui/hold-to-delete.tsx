"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HoldToDeleteProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDelete"> {
  /** Seconds the press must be held. @default 2 */
  duration?: number;
  label?: string;
  doneLabel?: string;
  onDelete?: () => void;
}

type Phase = "idle" | "holding" | "done";

/**
 * Destructive action guarded by a long press. The fill is a clip-path
 * transition, so completion is detected on `transitionend` rather than a
 * timer that could drift or fire after unmount. Release early and the
 * clip snaps home.
 */
export function HoldToDelete({
  duration = 2,
  label = "Hold to delete",
  doneLabel = "Deleted",
  onDelete,
  className,
  ...props
}: HoldToDeleteProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = React.useState<Phase>("idle");
  const fill = React.useRef<HTMLSpanElement>(null);
  const keys = React.useRef<Set<string>>(new Set());

  React.useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => setPhase("idle"), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  const fire = () => {
    if (phase === "done") return;
    setPhase("done");
    onDelete?.();
    navigator.vibrate?.(10);
  };

  const start = () => {
    if (phase === "done") return;
    setPhase("holding");
  };

  const cancel = () => {
    setPhase((p) => (p === "holding" ? "idle" : p));
  };

  const onTransitionEnd = (e: React.TransitionEvent) => {
    // Only the fill's own transition signals completion.
    if (e.target === fill.current && e.propertyName === "clip-path" && phase === "holding")
      fire();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== " " && e.key !== "Enter") return;
    // Ignore auto-repeat so a held key starts once, not continuously.
    if (e.repeat) {
      e.preventDefault();
      return;
    }
    keys.current.add(e.key);
    e.preventDefault();
    start();
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key !== " " && e.key !== "Enter") return;
    keys.current.delete(e.key);
    if (keys.current.size === 0) cancel();
  };

  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onBlur={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onTransitionEnd={onTransitionEnd}
      className={cn(
        "relative isolate inline-flex h-11 select-none items-center justify-center overflow-hidden rounded-full border border-border px-6 text-sm font-medium outline-none transition-[transform,color] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] motion-reduce:active:scale-100",
        phase === "done" ? "text-brand" : "text-foreground",
        className
      )}
      {...props}
    >
      <span
        ref={fill}
        aria-hidden
        className="absolute inset-0 -z-10 bg-destructive"
        style={{
          clipPath: phase === "holding" ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: reduceMotion
            ? `clip-path ${duration}s linear`
            : `clip-path ${duration}s cubic-bezier(0.4,0,0.2,1)`,
        }}
      />
      <motion.span
        animate={
          reduceMotion
            ? { rotate: 0, y: 0 }
            : phase === "holding"
              ? { rotate: [0, -11, 9, -6, 0], y: [0, -1, 1, 0, 0] }
              : { rotate: 0, y: 0 }
        }
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2"
      >
        <Trash2 className="size-4" />
        {phase === "done" ? doneLabel : label}
      </motion.span>
      <span aria-live="polite" className="sr-only">
        {phase === "done" ? doneLabel : ""}
      </span>
    </button>
  );
}
