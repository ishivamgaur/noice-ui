"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { components, getCategories } from "@/lib/registry";
import { cn } from "@/lib/utils";
import { DEMOS } from "@/components/demos/demos";

export default function ComponentsGallery() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("All");

  const filtered = components.filter((c) => {
    const matchesQuery =
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || c.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Components</h1>
      <p className="mt-2 text-muted-foreground">
        {components.length} components. Every preview below is the real
        component - click through for install, props, and source.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components…"
            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["All", ...getCategories()].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                category === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          No components match “{query}”.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((c) => {
            const Demo = DEMOS[c.name];
            return (
              <Link
                key={c.name}
                href={`/components/${c.name}`}
                className="group cv-auto overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-muted-foreground/40 active:scale-[0.99]"
              >
                <div className="pointer-events-none flex min-h-40 flex-wrap items-center justify-center gap-2 overflow-hidden border-b border-border/60 bg-muted/20 p-6">
                  {Demo ? <Demo /> : null}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold group-hover:underline group-hover:underline-offset-4">
                      {c.title}
                    </h2>
                    <span className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      {c.category}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
