"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { components, getCategories } from "@/lib/registry";

const GUIDES = [
  { href: "/docs/installation", title: "Installation" },
  { href: "/docs/theming", title: "Theming" },
  { href: "/docs/mcp", title: "AI + MCP" },
];

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const link = (href: string, title: string, extra?: string) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        className={cn(
          "flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors",
          active
            ? "bg-accent font-medium text-accent-foreground"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        )}
      >
        {title}
        {extra && (
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {extra}
          </span>
        )}
      </Link>
    );
  };

  return (
    <nav className="space-y-6">
      <div>
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Getting started
        </p>
        <div className="space-y-0.5">
          {GUIDES.map((g) => link(g.href, g.title))}
        </div>
      </div>
      {getCategories().map((cat) => (
        <div key={cat}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {cat}
          </p>
          <div className="space-y-0.5">
            {components
              .filter((c) => c.category === cat)
              .map((c) =>
                link(`/components/${c.name}`, c.title, `${components.indexOf(c) + 1}`)
              )}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-20 hidden w-64 shrink-0 self-start overflow-y-auto py-8 pr-6 lg:block">
        <Nav />
      </aside>
      {/* Mobile */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="mb-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground"
        >
          <Menu className="size-3.5" />
          Browse library
        </button>
        {open && (
          <div className="mb-6 rounded-xl border border-border bg-card p-4">
            <Nav onNavigate={() => setOpen(false)} />
          </div>
        )}
      </div>
    </>
  );
}
