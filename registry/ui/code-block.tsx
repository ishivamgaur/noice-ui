"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

const TOKEN_RE =
  /(\/\/[^\n]*|#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|export|default|const|let|var|function|return|if|else|for|while|new|await|async|try|catch|class|extends|interface|type|enum|switch|case|break|continue|typeof|in|of|do|throw)\b|\b(\d[\d._]*)\b/g;

const TONES = [
  "text-muted-foreground",
  "text-emerald-600 dark:text-emerald-400",
  "text-rose-700 dark:text-rose-400",
  "text-amber-600 dark:text-amber-400",
];

/** Split one line into plain and tinted spans with stable keys. */
function tokenize(line: string, row: number) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  let k = 0;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const tone = m[1] ? TONES[0] : m[2] ? TONES[1] : m[3] ? TONES[2] : TONES[3];
    out.push(
      <span key={`${row}-${k++}`} className={tone}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/**
 * Framed code with line numbers and a copy button. Highlighting is a
 * small tokenizer, so there is no highlighter dependency to install.
 */
export function CodeBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = true,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard API is blocked in some contexts, so fall back to a
      // throwaway textarea. Its result matters: reporting success when
      // the copy silently failed is worse than not reporting at all.
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      } finally {
        ta.remove();
      }
      setCopied(ok);
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  React.useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const lines = code.replace(/\n$/, "").split("\n");
  const gutter = String(lines.length).length;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card",
        className
      )}
      {...props}
    >
      <div className="flex h-11 items-center gap-2 border-b border-border px-4">
        <span className="flex gap-1.5" aria-hidden>
          <i className="size-2.5 rounded-full bg-border" />
          <i className="size-2.5 rounded-full bg-border" />
          <i className="size-2.5 rounded-full bg-border" />
        </span>
        <span className="ml-1 truncate font-mono text-xs text-muted-foreground">
          {filename ?? language}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="ml-auto flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <div
        role="region"
        aria-label={filename ? `${filename} code` : `${language} code`}
        tabIndex={0}
        className="overflow-x-auto p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <pre className="font-mono text-[13px] leading-6">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              {showLineNumbers && (
                <span
                  aria-hidden
                  style={{ width: `${gutter + 1.5}ch` }}
                  className="shrink-0 pr-4 text-right text-muted-foreground/60 select-none"
                >
                  {i + 1}
                </span>
              )}
              <code className="whitespace-pre">{tokenize(line, i)}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
