"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface OtpInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Number of slots. @default 6 */
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  type?: "numbers" | "letters" | "both";
  status?: "idle" | "success" | "error";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  autoFocus?: boolean;
}

const FILTER: Record<string, RegExp> = {
  numbers: /[0-9]/,
  letters: /[a-zA-Z]/,
  both: /[a-zA-Z0-9]/,
};

const SIZES = {
  sm: "h-10 w-9 text-sm",
  md: "h-12 w-10 text-base",
  lg: "h-14 w-12 text-lg",
} as const;

/**
 * One-time-code input. Real inputs carry the behavior (paste fan-out,
 * arrows, autofill) while each slot stays a plain box. Error shakes
 * the row, success tints the rings.
 */
export function OtpInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  type = "numbers",
  status = "idle",
  size = "md",
  disabled = false,
  autoFocus = false,
  className,
  ...props
}: OtpInputProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const code = (value ?? inner).slice(0, length);
  const reduceMotion = useReducedMotion();
  const slots = React.useRef<Array<HTMLInputElement | null>>([]);
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  // A slot is not always a digit: naming every one "Digit" misleads anyone
  // using the letters or mixed mode.
  const slotNoun =
    type === "numbers" ? "Digit" : type === "letters" ? "Letter" : "Character";

  const commit = (next: string) => {
    const clean = next.slice(0, length);
    if (value === undefined) setInner(clean);
    onChange?.(clean);
    if (clean.length === length) onComplete?.(clean);
  };
  const focusSlot = (i: number) => {
    const clamped = Math.max(0, Math.min(length - 1, i));
    slots.current[clamped]?.focus();
    slots.current[clamped]?.select();
  };

  const put = (i: number, char: string) => {
    if (!FILTER[type].test(char)) return;
    const next = Array.from({ length }, (_, k) => code[k] ?? "");
    next[i] = char;
    commit(next.join(""));
    focusSlot(i + 1);
  };

  const onSlotChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    // Browsers and password managers drop a whole code into the first
    // field via autofill, and iOS pastes the entire string into whichever
    // slot was tapped. Both arrive here, so take every accepted character
    // rather than only the last one, which used to throw the code away.
    const raw = e.target.value;
    if (!raw) {
      if (code[i]) {
        const next = code.split("");
        next[i] = "";
        commit(next.join(""));
      }
      focusSlot(i);
      return;
    }
    const chars = raw
      .split("")
      .filter((c) => FILTER[type].test(c))
      .slice(0, length);
    if (chars.length === 0) {
      // Nothing acceptable was typed. Put the controlled value back by
      // hand, since no state changed and React will not re-render.
      e.target.value = code[i] ?? "";
      return;
    }
    const next = Array.from({ length }, (_, k) => code[k] ?? "");
    for (let k = 0; k < chars.length && i + k < length; k++) next[i + k] = chars[k];
    commit(next.join(""));
    focusSlot(Math.min(length - 1, i + chars.length));
  };

  const onKeyDown = (i: number) => (e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (code[i]) {
        const next = code.split("");
        next[i] = "";
        commit(next.join(""));
        focusSlot(i);
      } else {
        focusSlot(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusSlot(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusSlot(i + 1);
    } else if (e.key.length === 1 && FILTER[type].test(e.key)) {
      e.preventDefault();
      put(i, e.key);
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData
      .getData("text")
      .split("")
      .filter((c) => FILTER[type].test(c))
      .join("")
      .slice(0, length);
    if (!text) return;
    commit(text);
    focusSlot(text.length);
  };

  return (
    <motion.div
      animate={
        status === "error" && !reduceMotion
          ? { x: [0, -8, 8, -5, 5, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.4 }}
      className={cn("flex items-center gap-2", className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            slots.current[i] = el;
          }}
          value={code[i] ?? ""}
          onChange={onSlotChange(i)}
          onKeyDown={onKeyDown(i)}
          onPaste={onPaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          inputMode={type === "letters" ? "text" : "numeric"}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`${slotNoun} ${i + 1} of ${length}`}
          aria-invalid={status === "error" || undefined}
          aria-describedby={status === "error" ? `${uid}-status` : undefined}
          className={cn(
            "rounded-xl border bg-card text-center font-semibold tabular-nums outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/25 disabled:opacity-50",
            SIZES[size],
            status === "success" && "border-brand",
            status === "error" && "border-destructive"
          )}
        />
      ))}
      {/* Status was previously signalled by border colour alone, which is
          invisible to anyone who cannot distinguish the hues. */}
      <span id={`${uid}-status`} role="status" className="sr-only">
        {status === "error" ? "That code is not correct." : ""}
        {status === "success" ? "Code accepted." : ""}
      </span>
    </motion.div>
  );
}
