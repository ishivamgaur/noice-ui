"use client";

import * as React from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { CodeBlock } from "../../../registry/ui/code-block";
import { SegmentedControl } from "../../../registry/ui/segmented-control";
import { cn } from "@/lib/utils";

const WIDTHS = {
  desktop: null,
  tablet: 768,
  mobile: 390,
} as const;

type Viewport = keyof typeof WIDTHS;

const LABELS: Record<Viewport, string> = {
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile",
};

const TABS = ["Preview", "Usage", "Source"] as const;

/**
 * Live demo, usage snippet, and full source. Source is fetched from
 * /api/source, so the code shown can never drift from what the CLI
 * installs. The viewport switcher previews at real breakpoints.
 */
export function PreviewTabs({
  slug,
  usage,
  children,
}: {
  slug: string;
  usage: string;
  children: React.ReactNode;
}) {
  const [tab, setTab] = React.useState<(typeof TABS)[number]>("Preview");
  const [viewport, setViewport] = React.useState<Viewport>("desktop");
  const [source, setSource] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (tab === "Source" && source === null) {
      fetch(`/api/source?component=${slug}`)
        .then((r) => (r.ok ? r.text() : "// failed to load source"))
        .then(setSource)
        .catch(() => setSource("// failed to load source"));
    }
  }, [tab, slug, source]);

  const showingCode = tab !== "Preview";
  const code = tab === "Usage" ? usage : (source ?? "// loading…");
  const width = WIDTHS[viewport];

  return (
    <div>
      {/* Same 16px below the heading as every other section, whether the
          heading is text or this control row. */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          options={TABS}
          value={tab}
          onChange={(v) => setTab(v as (typeof TABS)[number])}
          label="Component view"
        />
        {tab === "Preview" && (
          <div
            className="flex gap-0.5 rounded-full border border-border bg-surface p-1"
            role="group"
            aria-label="Preview width"
          >
            {(
              [
                ["desktop", Monitor],
                ["tablet", Tablet],
                ["mobile", Smartphone],
              ] as const
            ).map(([key, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setViewport(key)}
                aria-pressed={viewport === key}
                title={LABELS[key]}
                className={cn(
                  // Same pill treatment as the segmented control: identical
                  // track, 40px outer height, matching active fill.
                  "flex size-8 items-center justify-center rounded-full transition-colors",
                  viewport === key
                    ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                <span className="sr-only">{LABELS[key]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {showingCode ? (
        <CodeBlock
          code={code}
          language="tsx"
          filename={tab === "Usage" ? "usage.tsx" : `${slug}.tsx`}
        />
      ) : (
        <div
          className="flex justify-center rounded-lg border border-border bg-surface p-4 sm:p-8"
          style={{ maxWidth: width ? width + 64 : undefined }}
        >
          <div
            style={width ? { width: `${width}px` } : undefined}
            className={cn(
              "flex min-h-64 w-full flex-wrap items-center justify-center gap-3 rounded-lg border border-dashed p-6 transition-[max-width] duration-300 ease-out",
              "border-muted-foreground/25",
              width && "max-w-full"
            )}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
