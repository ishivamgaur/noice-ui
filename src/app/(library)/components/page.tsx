"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { components, getCategories } from "@/lib/registry";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { DEMOS } from "@/components/demos/demos";
import { useUrlFilter } from "@/lib/use-url-filter";

export default function ComponentsGallery() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = useUrlFilter();
  const pathname = usePathname();
  // The shortcut belongs to this page and nowhere else. Gating on the
  // route rather than relying on the effect being torn down means the key
  // stays dead on the homepage even if the router keeps this component
  // mounted while transitioning away.
  const active = pathname === "/components";
 const inputRef = React.useRef<HTMLInputElement>(null);

  // Cmd/Ctrl+K and "/" both focus the search. Escape clears the query
  // first, then blurs. Every branch is scoped to this route, so the
  // chord does nothing anywhere else in the app.
  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        el?.tagName === "INPUT" ||
        el?.tagName === "TEXTAREA" ||
        el?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        return;
      }
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        if (query) setQuery("");
        else inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [query, active]);

 const filtered = components.filter((c) => {
 const words = query.toLowerCase().split(/\s+/).filter(Boolean);
 const hay = `${c.title} ${c.description} ${c.category}`.toLowerCase();
 const matchesQuery = words.every((w) => hay.includes(w));
 const matchesCategory = category === "all" || c.category === category;
 return matchesQuery && matchesCategory;
 });

 return (
 <div className="mx-auto w-full max-w-5xl">
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{
 __html: JSON.stringify({
 "@context": "https://schema.org",
 "@type": "CollectionPage",
 name: "Noice UI Components",
 url: `${SITE_URL}/components`,
 description:
 "Copy-paste React and Tailwind CSS components you own, installable with the shadcn CLI.",
 mainEntity: {
 "@type": "ItemList",
 itemListElement: components.map((c, i) => ({
 "@type": "ListItem",
 position: i + 1,
 name: c.title,
 url: `${SITE_URL}/components/${c.name}`,
 description: c.description,
 })),
 },
 }),
 }}
 />

 <header className="mb-10">
 <h1 className="text-[34px] leading-[1.1] font-semibold tracking-tight text-balance sm:text-[46px]">
 Components
 </h1>
 <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
 {components.length} components. Each preview is the real thing, built
 from the same source the CLI installs.
 </p>
 </header>

 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div className="relative w-full sm:max-w-64">
 <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
 <input
 ref={inputRef}
 value={query}
 onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components"
 aria-label="Search components"
 className="h-9 w-full rounded-lg border border-border bg-transparent pr-10 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-muted-foreground/50"
 />
          <kbd
            aria-hidden
            className="pointer-events-none absolute right-3 top-1/2 hidden h-5 -translate-y-1/2 items-center rounded border border-border px-1.5 text-[11px] text-muted-foreground sm:flex"
          >
            ⌘K
          </kbd>
 </div>
 <p
 className="text-[13px] tabular-nums text-muted-foreground"
 aria-live="polite"
 >
 {filtered.length} shown
 </p>
 </div>

 {/* Plain text filters. The count carries the state, the weight carries
 the selection, so no fill or chip is needed. */}
 <nav
 aria-label="Filter by category"
 className="-mx-4 mt-6 flex gap-x-5 gap-y-2 overflow-x-auto border-b border-border px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
 >
 {["all", ...getCategories()].map((cat) => {
 const n =
 cat === "all"
 ? components.length
 : components.filter((c) => c.category === cat).length;
 const on = category === cat;
 return (
 <button
 key={cat}
 type="button"
 onClick={() => setCategory(cat)}
 aria-pressed={on}
 className={cn(
 "shrink-0 text-[13px] ",
 on
 ? "font-medium text-foreground"
 : "text-muted-foreground hover:text-foreground"
 )}
 >
 {cat === "all" ? "All" : cat}
 <span className="ml-1.5 tabular-nums opacity-55">{n}</span>
 </button>
 );
 })}
 </nav>

 {filtered.length === 0 ? (
 <p className="py-20 text-center text-sm text-muted-foreground">
 Nothing matches {query ? `“${query}”` : "that filter"}.
 </p>
 ) : (
 /* A ruled table, not a card grid: hairlines carry the structure, so
 each entry needs no box, shadow, or hover fill of its own. */
 <ul className="grid grid-cols-1 @min-[680px]:grid-cols-2">
 {filtered.map((c, i) => {
 const Demo = DEMOS[c.name];
 return (
 <li
 key={c.name}
 className={cn(
 "group relative border-b border-border py-8 @min-[680px]:pr-8",
 i % 2 === 1 && "@min-[680px]:border-l @min-[680px]:pl-8"
 )}
 >
 <div
 inert
 className={cn(
 "flex h-44 items-center justify-center overflow-hidden rounded-lg bg-surface p-5 [content-visibility:auto]",
 c.previewCrop
 ? "items-start pt-5 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
 : "items-center"
 )}
 >
 {Demo ? (
 <div
 className="flex shrink-0 justify-center"
 style={{
 scale: c.previewScale
 ? String(c.previewScale)
 : undefined,
 transformOrigin: c.previewCrop ? "top" : undefined,
 width: c.previewScale
 ? `${100 / c.previewScale}%`
 : undefined,
 }}
 >
 <Demo />
 </div>
 ) : null}
 </div>

 <h2 className="mt-5 text-[15px] font-medium tracking-tight">
 <Link
 href={`/components/${c.name}`}
 className="outline-none after:absolute after:inset-0 focus-visible:underline focus-visible:underline-offset-4"
 >
 {c.title}
 </Link>
 </h2>
 <p className="mt-1.5 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
 {c.description}
 </p>
 </li>
 );
 })}
 </ul>
 )}
 </div>
 );
}
