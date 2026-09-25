"use client";

import * as React from "react";
import Link from "next/link";
import { siBun, siNpm, siPnpm, siYarn } from "simple-icons";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";
import {
  installCommand,
  PACKAGE_MANAGERS,
  registryUrl,
  type PackageManager,
} from "@/lib/registry";
import { REGISTRY_NAMESPACE, SITE_URL } from "@/lib/site";

const LOGOS: Record<PackageManager, { path: string; color: string }> = {
  npm: { path: siNpm.path, color: "var(--color-icon-npm)" },
  pnpm: { path: siPnpm.path, color: "var(--color-icon-pnpm)" },
  yarn: { path: siYarn.path, color: "var(--color-icon-yarn)" },
  bun: { path: siBun.path, color: "var(--color-icon-bun)" },
};

/** CLI / namespace / manual install options for one component. */
export function InstallTabs({ name }: { name: string }) {
  const [tab, setTab] = React.useState<"cli" | "namespace" | "manual">("cli");
  const [pm, setPm] = React.useState<PackageManager>("npm");

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2">
        <div className="flex gap-1">
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
        {tab === "cli" && (
          <div
            className="flex flex-wrap gap-1"
            role="group"
            aria-label="Package manager"
          >
            {(Object.keys(PACKAGE_MANAGERS) as PackageManager[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPm(key)}
                aria-pressed={pm === key}
                className={cn(
                  "inline-flex h-8 items-center gap-2 rounded-lg px-2.5 text-[13px] font-medium transition-colors",
                  pm === key
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="size-4 shrink-0"
                  style={{ fill: LOGOS[key].color }}
                >
                  <path d={LOGOS[key].path} />
                </svg>
                {PACKAGE_MANAGERS[key].label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        {tab === "cli" && <CodeBlock code={installCommand(name, pm)} />}
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
