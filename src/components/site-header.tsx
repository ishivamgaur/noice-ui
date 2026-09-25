"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/site/logo";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/components", label: "Components" },
  { href: "/docs/installation", label: "Docs" },
  { href: "/docs/mcp", label: "MCP" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
      <div className="w-full max-w-2xl">
        <header className="flex h-12 w-full items-center justify-between gap-1 rounded-full border border-border/70 bg-background/70 py-1 pl-3 pr-1 shadow-lg shadow-black/[0.05] backdrop-blur-xl dark:shadow-black/40">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-[18px] w-[18px]" />
            <span className="font-display text-base font-extrabold tracking-tight">
              noiceui
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 sm:flex">
            {LINKS.map((l) => {
              const active =
                pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[13px] transition-colors",
                    active
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle className="border-0 bg-transparent" />
            <Link
              href="/docs/installation"
              className="hidden h-9 items-center rounded-full bg-brand px-4 text-[13px] font-semibold text-brand-foreground transition-all duration-200 hover:scale-[1.04] hover:opacity-90 active:scale-[0.96] sm:inline-flex"
            >
              Get started
            </Link>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen(!open)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </header>

        {open && (
          <nav className="mt-2 rounded-2xl border border-border/70 bg-background/90 p-1.5 shadow-xl backdrop-blur-xl sm:hidden">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-xl px-4 py-2.5 text-sm",
                  pathname === l.href || pathname.startsWith(l.href + "/")
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/docs/installation"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-xl bg-brand px-4 py-2.5 text-center text-sm font-semibold text-brand-foreground"
            >
              Get started
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
