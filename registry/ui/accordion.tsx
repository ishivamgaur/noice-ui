"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  question: string;
  answer: string;
}

export interface AccordionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: AccordionItemData[];
  /** Indices open on first render. @default [] */
  defaultOpen?: number[];
  /** Allow several panels open at once. @default true */
  multiple?: boolean;
}

/**
 * Panels unfold with the CSS Grid `0fr -> 1fr` technique, so height is
 * intrinsic and nothing is measured. Independent open state means
 * closing one panel never moves another.
 */
export function Accordion({
  items,
  defaultOpen = [],
  multiple = true,
  className,
  ...props
}: AccordionProps) {
  const [open, setOpen] = React.useState<number[]>(defaultOpen);
  const headers = React.useRef<Array<HTMLButtonElement | null>>([]);
  // Unique per instance, so two accordions on one page never collide.
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  const toggle = (i: number) =>
    setOpen((prev) => {
      if (prev.includes(i)) return prev.filter((n) => n !== i);
      return multiple ? [...prev, i] : [i];
    });

  // Arrow keys move between headers, Home and End jump to the ends.
  const onKeyDown = (i: number) => (e: React.KeyboardEvent) => {
    const last = items.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    headers.current[next]?.focus();
  };

  return (
    <div className={cn("divide-y divide-border", className)} {...props}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={i}>
            <h3>
              <button
                ref={(el) => {
                  headers.current[i] = el;
                }}
                type="button"
                onClick={() => toggle(i)}
                onKeyDown={onKeyDown(i)}
                aria-expanded={isOpen}
                id={`accordion-${uid}-header-${i}`}
                aria-controls={`accordion-${uid}-panel-${i}`}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium outline-none transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {item.question}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div
              id={`accordion-${uid}-panel-${i}`}
              role="region"
              aria-labelledby={`accordion-${uid}-header-${i}`}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-4 pr-8 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
