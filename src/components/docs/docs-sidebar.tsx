"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { components, getCategories } from "@/lib/registry";

const GUIDES = [
 { href: "/docs/installation", title: "Installation" },
 { href: "/docs/theming", title: "Theming" },
 { href: "/docs/mcp", title: "AI + MCP" },
];

/** Alphabetical inside each category, the way a reference index reads. */
const byTitle = (a: { title: string }, b: { title: string }) =>
 a.title.localeCompare(b.title);

function SidebarRow({
 href,
 label,
 onNavigate,
}: {
 href: string;
 label: string;
 onNavigate?: () => void;
}) {
 const pathname = usePathname();
 const active = pathname === href;
 const ref = React.useRef<HTMLAnchorElement>(null);

 // Arriving on a page brings its row to the middle of the list, clear
 // of the fades at either end. Only the list scrolls, never the page.
 React.useEffect(() => {
 const el = ref.current;
 const list = el?.closest("nav");
 if (!active || !el || !list) return;
 const top = el.offsetTop - list.clientHeight / 2 + el.offsetHeight / 2;
 if (
 el.offsetTop < list.scrollTop + 40 ||
 el.offsetTop > list.scrollTop + list.clientHeight - 80
 )
 list.scrollTo({ top });
 }, [active]);

 return (
 <li>
 <Link
 ref={ref}
 href={href}
 onClick={onNavigate}
 aria-current={active ? "page" : undefined}
 className={cn(
 "flex h-8 items-center rounded-md px-3 text-[13px] outline-none duration-150 focus-visible:outline-2 focus-visible:outline-offset-2",
 active
 ? "font-medium text-brand"
 : "text-muted-foreground hover:text-foreground"
 )}
 >
 <span className="truncate">{label}</span>
 </Link>
 </li>
 );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
 return (
 <div>
 <p className="mb-1 px-3 text-xs font-medium text-muted-foreground/80">
 {label}
 </p>
 <ul className="flex flex-col">{children}</ul>
 </div>
 );
}

/** The list itself, shared by the desktop column and the phone menu. */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
 return (
 <div className="flex flex-col gap-7">
 <Group label="Getting started">
 {GUIDES.map((g) => (
 <SidebarRow
 key={g.href}
 href={g.href}
 label={g.title}
 onNavigate={onNavigate}
 />
 ))}
 </Group>
 {getCategories().map((cat) => {
 const items = components
 .filter((c) => c.category === cat)
 .sort(byTitle);
 if (items.length === 0) return null;
 return (
 <Group key={cat} label={cat}>
 {items.map((c) => (
 <SidebarRow
 key={c.name}
 href={`/components/${c.name}`}
 label={c.title}
 onNavigate={onNavigate}
 />
 ))}
 </Group>
 );
 })}
 </div>
 );
}

export function DocsSidebar() {
 return (
 /* A real column on wide screens: full height, its own scroll, one
 hairline between it and the work. */
 <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 self-start border-r border-border lg:block">
 <nav
 aria-label="Library"
 // Fades at both ends, so the list reads as continuing out of view
 // rather than being cut.
 className="h-full overflow-y-auto overscroll-contain px-3 pt-6 pb-12 [mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%-40px),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
 >
 <SidebarNav />
 </nav>
 </aside>
 );
}
