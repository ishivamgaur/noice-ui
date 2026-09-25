"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A command or address, shown as text and copied on click.
 *
 * Built as a real button wrapping the text rather than an icon beside it,
 * so the whole line is the hit target and the visible affordance is the
 * text itself. Keyboard users get the same target for free, and the
 * confirmation replaces the icon in place so nothing reflows.
 */
export function CopyableArtifact({
  value,
  label,
  className,
}: {
  value: string;
  /** Describes what gets copied, for the accessible name. */
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard blocked. The text is selectable, so leave it be.
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? `${label}, copied` : `Copy ${label}`}
      className={cn(
        "group/artifact flex w-full min-w-0 items-center gap-2 rounded-md border border-border bg-surface py-2 pr-2 pl-3 text-left outline-none hover:border-muted-foreground/40 focus-visible:outline-2 focus-visible:outline-offset-1",
        className
      )}
    >
      <code className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
        {value}
      </code>
      <span
        aria-hidden
        className="flex size-6 shrink-0 items-center justify-center text-muted-foreground"
      >
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5 opacity-0 group-hover/artifact:opacity-100 focus-visible:opacity-100" />
        )}
      </span>
    </button>
  );
}
