"use client";

import * as React from "react";
import { Command } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaletteCommand {
  id: string;
  label: string;
  group?: string;
  keywords?: string;
  hint?: string;
}

export interface CommandPaletteProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  commands: PaletteCommand[];
  onRun?: (command: PaletteCommand) => void;
  placeholder?: string;
}

/** Ordered-subsequence match, so "sc" finds "slide to confirm". */
function matchScore(label: string, query: string): number {
  const hay = label.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const at = hay.indexOf(q);
  if (at !== -1) return 1000 - at;
  let score = 0;
  let pos = -1;
  for (const ch of q) {
    pos = hay.indexOf(ch, pos + 1);
    if (pos === -1) return -1;
    score += pos;
  }
  return 500 - score;
}

/**
 * Command palette without a dependency. Cmd/Ctrl+K toggles it, typing
 * filters by substring then subsequence, arrows move, Enter runs.
 */
export function CommandPalette({
  commands,
  onRun,
  placeholder = "Type a command",
  className,
  ...props
}: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const options = React.useRef<Array<HTMLDivElement | null>>([]);
  const panel = React.useRef<HTMLDivElement>(null);
  const trigger = React.useRef<HTMLButtonElement>(null);
  // Per-instance ids, so two palettes on one page cannot collide and
  // break each other's aria-controls and aria-activedescendant.
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const listId = `palette-${uid}-list`;
  const optionId = (id: string) => `palette-${uid}-${id}`;

  const close = React.useCallback(() => {
    setOpen(false);
    // Focus has to go back where it came from, or a keyboard user is
    // dumped at the top of the document when the dialog unmounts.
    trigger.current?.focus({ preventScroll: true });
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const results = React.useMemo(() => {
    if (!query.trim()) return commands.map((c) => ({ command: c, score: 0 }));
    return commands
      .map((command) => ({
        command,
        score: Math.max(
          matchScore(command.label, query),
          matchScore(command.keywords ?? "", query)
        ),
      }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score);
  }, [commands, query]);

  // Group headers precomputed, so render never tracks state by hand.
  const rows = React.useMemo(() => {
    const out: Array<
      | { kind: "header"; key: string; label: string }
      | { kind: "option"; key: string; command: PaletteCommand; index: number }
    > = [];
    let last: string | undefined;
    results.forEach(({ command }, i) => {
      if (command.group !== last) {
        last = command.group;
        if (command.group)
          out.push({ kind: "header", key: `h-${command.group}`, label: command.group });
      }
      out.push({ kind: "option", key: command.id, command, index: i });
    });
    return out;
  }, [results]);

  const openPalette = () => {
    setQuery("");
    setActive(0);
    setOpen(true);
  };

  const run = (command: PaletteCommand) => {
    close();
    onRun?.(command);
  };

  // Keep Tab inside the dialog while it is open, and stop the page behind
  // it from scrolling. A modal that leaks focus to the page underneath is
  // disorienting for keyboard and screen reader users alike.
  React.useEffect(() => {
    if (!open) return;
    const root = panel.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => {
        const next = (a + 1) % Math.max(results.length, 1);
        requestAnimationFrame(() =>
          options.current[next]?.scrollIntoView({ block: "nearest" })
        );
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => {
        const next =
          (a - 1 + results.length) % Math.max(results.length, 1);
        requestAnimationFrame(() =>
          options.current[next]?.scrollIntoView({ block: "nearest" })
        );
        return next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[active];
      if (hit) run(hit.command);
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <button
        ref={trigger}
        type="button"
        onClick={openPalette}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="meta+k control+k"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface pr-2 pl-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Command className="size-3.5" />
        Search commands
        <kbd className="rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[11px]">
          ⌘K
        </kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[18dvh]">
          <div
            aria-hidden
            className="absolute inset-0 bg-black/30"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Commands"
            ref={panel}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-raised"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKeyDown}
              placeholder={placeholder}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={
                results[active] ? optionId(results[active].command.id) : undefined
              }
              className="h-12 w-full border-b border-border bg-transparent px-4 text-[15px] outline-none placeholder:text-muted-foreground"
            />
            <div
              id={listId}
              role="listbox"
              aria-label="Matching commands"
              className="max-h-64 overflow-y-auto p-2"
            >
              {rows.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No commands match.
                </p>
              )}
              {rows.map((row) =>
                row.kind === "header" ? (
                  <p
                    key={row.key}
                    className="px-3 pt-3 pb-1 text-xs font-medium text-muted-foreground"
                  >
                    {row.label}
                  </p>
                ) : (
                  <div
                    key={row.key}
                    ref={(el) => {
                      options.current[row.index] = el;
                    }}
                    id={optionId(row.command.id)}
                    role="option"
                    aria-selected={row.index === active}
                    onMouseMove={() => setActive(row.index)}
                    onClick={() => run(row.command)}
                    className={cn(
                      "flex cursor-default items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm",
                      row.index === active && "bg-surface"
                    )}
                  >
                    <span className="truncate">{row.command.label}</span>
                    {row.command.hint && (
                      <kbd className="shrink-0 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                        {row.command.hint}
                      </kbd>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
