"use client";

import * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

/**
 * Live demo + usage snippet + full source (fetched from /api/source,
 * so displayed code can never drift from what the CLI installs).
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
  const [tab, setTab] = React.useState<"preview" | "usage" | "source">(
    "preview"
  );
  const [source, setSource] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (tab === "source" && source === null) {
      fetch(`/api/source?component=${slug}`)
        .then((r) => (r.ok ? r.text() : "// failed to load source"))
        .then(setSource)
        .catch(() => setSource("// failed to load source"));
    }
  }, [tab, slug, source]);

  const code = tab === "usage" ? usage : (source ?? "// loading…");

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4">
        <div className="flex gap-1 py-2">
          {(["preview", "usage", "source"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm capitalize transition-colors",
                tab === t
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {tab !== "preview" && <CopyButton text={code} />}
      </div>
      {tab === "preview" ? (
        <div className="flex flex-wrap items-center justify-center gap-3 p-8">
          {children}
        </div>
      ) : (
        <pre className="max-h-[480px] overflow-auto p-4 text-sm leading-relaxed">
          <code className="font-mono">{code}</code>
        </pre>
      )}
    </div>
  );
}
