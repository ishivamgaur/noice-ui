"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TextScrambleProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
}

const GLYPHS = "!<>-_\\/[]{}=+*^?#";

function caseMatch(glyph: string, target: string) {
  if (/[A-Z]/.test(target)) return glyph.toUpperCase();
  return glyph.toLowerCase();
}

/**
 * Text that decodes left to right through random glyphs. The animation
 * writes straight to the DOM, so React never re-renders mid-scramble.
 * Monospace keeps the width rock steady.
 */
export function TextScramble({ text, className, ...props }: TextScrambleProps) {
  const reduceMotion = useReducedMotion();
  const settled = React.useRef<HTMLSpanElement>(null);
  const cursor = React.useRef<HTMLSpanElement>(null);
  const rest = React.useRef<HTMLSpanElement>(null);
  const frame = React.useRef(0);
  const wrapRef = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.8 });

  const scramble = React.useCallback(() => {
    const s = settled.current;
    const c = cursor.current;
    const r = rest.current;
    if (!s || !c || !r || reduceMotion) {
      if (s && c && r) {
        s.textContent = text;
        c.textContent = "";
        r.textContent = "";
      }
      return;
    }
    cancelAnimationFrame(frame.current);
    const started = performance.now();
    const lead = 250;
    const perChar = 45;

    const tick = (now: number) => {
      const elapsed = now - started;
      const settledCount = Math.max(
        0,
        Math.min(text.length, Math.floor((elapsed - lead) / perChar))
      );
      s.textContent = text.slice(0, settledCount);
      if (settledCount >= text.length) {
        c.textContent = "";
        r.textContent = "";
        return;
      }
      // Block cursor holds the exact 1ch width while glyphs churn under it.
      c.textContent = caseMatch(
        GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        text[settledCount]
      );
      r.textContent = text
        .slice(settledCount + 1)
        .split("")
        .map((ch) =>
          ch === " "
            ? " "
            : caseMatch(
                GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
                ch
              )
        )
        .join("");
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, reduceMotion]);

  React.useEffect(() => {
    if (inView) scramble();
    return () => cancelAnimationFrame(frame.current);
  }, [inView, scramble]);

  return (
    <span
      ref={wrapRef}
      role="button"
      tabIndex={0}
      aria-label={`Replay scramble: ${text}`}
      onMouseEnter={scramble}
      onFocus={scramble}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          scramble();
        }
      }}
      className={cn("inline-flex cursor-default outline-none", className)}
      {...props}
    >
      <span aria-hidden className="font-mono">
        <span ref={settled}>{text}</span>
        <span ref={cursor} className="bg-foreground text-background" />
        <span ref={rest} className="opacity-40" />
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
