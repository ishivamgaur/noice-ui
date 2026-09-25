"use client";

import * as React from "react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";
import { installCommand, registryUrl } from "@/lib/registry";
import { REGISTRY_NAMESPACE, SITE_URL } from "@/lib/site";

/** CLI / namespace / manual install options for one component. */
export function InstallTabs({ name }: { name: string }) {
  const [tab, setTab] = React.useState<"cli" | "namespace" | "manual">("cli");

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex gap-1 border-b border-border px-4 py-2">
        {(
          [
            ["cli", "CLI"],
            ["namespace", "Namespace"],
            ["manual", "Manual"],
          ] as const
        ).map(([t, label]) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              tab === t
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tab === "cli" && <CodeBlock code={installCommand(name)} />}
        {tab === "namespace" && (
          <CodeBlock
            lang="json"
            code={`// components.json\n{\n  "registries": {\n    "${REGISTRY_NAMESPACE}": "${SITE_URL}/r/{name}.json"\n  }\n}\n\n// then:\nnpx shadcn@latest add ${REGISTRY_NAMESPACE}/${name}`}
          />
        )}
        {tab === "manual" && (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              1. Copy the source from the{" "}
              <span className="text-foreground">Source</span> tab above into{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                components/ui/{name}.tsx
              </code>
            </p>
            <p>
              2. Install dependencies:{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                {registryUrl(name)}
              </code>{" "}
              lists them under{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                dependencies
              </code>
            </p>
            <p>
              Full prerequisites (tokens,{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                cn()
              </code>
              ) live in the{" "}
              <Link
                href="/docs/installation"
                className="text-foreground underline underline-offset-4"
              >
                installation guide
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
