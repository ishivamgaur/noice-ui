"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/site/logo";
import { SidebarNav } from "@/components/docs/docs-sidebar";
import { cn } from "@/lib/utils";

const LINKS = [
 { href: "/components", label: "Components" },
 { href: "/docs/installation", label: "Docs" },
 { href: "/docs/mcp", label: "MCP" },
];

export function SiteHeader() {
 const pathname = usePathname();
 const [open, setOpen] = React.useState(false);
 // On library routes the phone menu is the sidebar list itself,
 // so there is exactly one menu everywhere.
 const onLibrary =
 pathname.startsWith("/components") || pathname.startsWith("/docs");

 return (
 <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
 <div className="mx-auto flex h-14 max-w-[90rem] items-center justify-between px-4 sm:px-6">
 <Link href="/" className="flex items-center gap-2">
 <Logo className="h-[23px] w-[23px]" />
 <span className="text-base font-semibold tracking-tight">
 Noice UI
 </span>
 </Link>

 <nav className="hidden items-center gap-1 md:flex">
 {LINKS.map((l) => {
 const active =
 pathname === l.href || pathname.startsWith(l.href + "/");
 return (
 <Link
 key={l.href}
 href={l.href}
 className={cn(
 "rounded-md px-3 py-2 text-sm ",
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

 <div className="flex items-center gap-1.5">
 <ThemeToggle className="border-0 bg-transparent" />
 <Link
 href="/docs/installation"
 className="hidden h-10 items-center rounded-lg bg-brand px-4 text-sm font-medium text-brand-foreground [box-shadow:inset_0_-1px_1px_#0003,inset_0_0_0_1px_#0000001f,0_1px_3px_#0000002b,inset_0_2px_#ffffff26] duration-200 hover:opacity-90 active:scale-[0.98] sm:inline-flex"
 >
 Get started
 </Link>
 <button
 type="button"
 aria-label="Menu"
 onClick={() => setOpen(!open)}
 className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
 >
 {open ? <X className="size-4" /> : <Menu className="size-4" />}
 </button>
 </div>
 </div>

 {open && (
 <nav
 aria-label={onLibrary ? "Library" : "Menu"}
 className="max-h-[70dvh] overflow-y-auto overscroll-contain border-t border-border px-4 py-3 md:hidden"
 >
 {onLibrary ? (
 <SidebarNav onNavigate={() => setOpen(false)} />
 ) : (
 LINKS.map((l) => (
 <Link
 key={l.href}
 href={l.href}
 onClick={() => setOpen(false)}
 className={cn(
 "block rounded-md px-3 py-2.5 text-sm",
 pathname === l.href || pathname.startsWith(l.href + "/")
 ? "bg-accent font-medium text-accent-foreground"
 : "text-muted-foreground"
 )}
 >
 {l.label}
 </Link>
 ))
 )}
 </nav>
 )}
 </header>
 );
}
