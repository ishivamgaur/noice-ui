"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExpandingSearchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  placeholder?: string;
  /** Expanded width in px. @default 260 */
  width?: number;
  onSearch?: (query: string) => void;
}

/**
 * A pill that grows from an icon into a real input. Width is animated
 * rather than transformed, so the pill keeps exact geometry and
 * reserves its own space. Focus is flushed so mobile raises the
 * keyboard in the same interaction.
 */
export function ExpandingSearch({
  placeholder = "Search",
  width = 260,
  onSearch,
  className,
  ...props
}: ExpandingSearchProps) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const expand = () => {
    if (open) return;
    if (reduceMotion) {
      setOpen(true);
      inputRef.current?.focus();
      return;
    }
    // Let the width start growing before focus steals the interaction.
    flushSync(() => setOpen(true));
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <motion.div
        initial={false}
        animate={{
          width: open ? width : 40,
          transition: reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 320, damping: 32 },
        }}
        className="flex h-10 items-center overflow-hidden rounded-full border border-border bg-surface focus-within:ring-2 focus-within:ring-ring"
      >
        <button
          ref={buttonRef}
          type="button"
          aria-label={open ? "Close search" : "Open search"}
          onClick={() => (open ? setOpen(false) : expand())}
          className="flex size-10 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch?.(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              // The consumer's query has to be cleared too, otherwise their
              // state keeps the old search while the field is empty.
              if (query) {
                setQuery("");
                onSearch?.("");
              }
              buttonRef.current?.focus();
            }
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          tabIndex={open ? 0 : -1}
          // No focus ring of its own. The pill already has a border, so an
          // inset ring on the field drew a second line just inside it and
          // read as a mis-styled input. The container shows focus instead,
          // as one ring around the whole control.
          className="h-full w-full min-w-0 bg-transparent pr-3 text-sm outline-none"
        />
        {open && query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              onSearch?.("");
              inputRef.current?.focus();
            }}
            className="mr-2 flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </motion.div>
    </div>
  );
}
