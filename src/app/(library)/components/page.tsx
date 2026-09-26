"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Search } from "lucide-react";
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
  <div className="mx-auto w-full max-w-[85rem]">
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
  /* Uniform grid: every tile is the same size, so nothing is singled out
  and the page reads as one repeating system. Uniformity comes from the
  stage being a fixed height rather than from equalising rows - a
  content-driven stage gives every demo a different height, and letting
  the rows stretch instead just pads the short cards with dead space.

  Inside that fixed card sits a fixed-width canvas, so a demo is never
  stretched to the grid track or shrunk to fit it. previewScale only ever
  scales a demo UP, for the handful that are genuinely tiny; nothing is
  scaled down, because below 1 a component stops reading as the thing it
  is. Those values were measured in headless Chrome against this stage.

  Breakpoints are viewport-based (sm:/lg:) on purpose. Tailwind's
  `@min-[Npx]:` compiles to a container query and nothing here establishes
  a query container, so that syntax silently never matched and the grid was
  stuck at a single column at every width.

  Each cell is a div, not a link, so the demo inside stays live - hover,
  drag, type, toggle. Navigation is separate and deliberate: the name and
  the arrow both go to the detail page, and a click landing on the
  component itself never navigates. */
  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
  {filtered.map((c) => {
  const Demo = DEMOS[c.name];
  return (
  <div
  key={c.name}
  data-component={c.name}
  className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-background [content-visibility:auto]"
  >
  <div className="flex shrink-0 items-center gap-2 border-b border-border/60 px-3 py-2">
  <Link
  href={`/components/${c.name}`}
  className="truncate text-[13px] font-medium outline-none hover:underline focus-visible:underline"
  >
  {c.title}
  </Link>
  <span className="truncate text-xs text-muted-foreground">
  {c.category}
  </span>
  <Link
  href={`/components/${c.name}`}
  aria-label={`Open ${c.title} details`}
  className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none after:absolute after:-inset-2.5 after:content-[''] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1"
  >
  <ArrowUpRight className="size-3.5" />
  </Link>
  </div>

  <div
  data-stage={c.name}
  className="canvas-dots flex h-48 shrink-0 items-center justify-center overflow-hidden bg-surface p-4"
  >
  {Demo ? (
  /* The canvas. A fixed logical width gives every demo the same frame to
  lay out in, so a component is never stretched to the grid track or
  shrunk to fit it. The width caps out rather than going full-bleed so the
  frame stays the same size on a phone.

  The inner wrapper is w-full, and that is load-bearing rather than
  cosmetic: 15 of the demos size themselves with `w-full`, and against a
  content-width parent that percentage resolves circularly and collapses.
  Compare slider was the visible symptom - it rendered 4x2, effectively
  nothing, because its only content is an absolutely positioned pair. A
  definite width here gives every one of them something to resolve
  against, and keeps a wide demo wrapping or clipping inside the canvas
  rather than being scaled to fit it. */
  <div
  className="flex h-full w-full max-w-[20rem] items-center justify-center overflow-hidden"
  >
  <div
  className="flex w-full flex-wrap items-center justify-center gap-2"
  style={{
  scale: c.previewScale ? String(c.previewScale) : undefined,
  // Only when scaling UP. A plain w-full wrapper scaled past 1 renders
  // wider than the canvas it sits in, so the pre-scale width is divided by
  // the factor to land back on the canvas edge. Left alone when scaling
  // down: there the wrapper wants the full canvas so a wide demo wraps
  // compactly inside it instead of spreading out.
  width:
  c.previewScale && c.previewScale > 1
  ? `${100 / c.previewScale}%`
  : undefined,
  }}
  >
  <Demo />
  </div>
  </div>
  ) : null}
  </div>

  {/* Reserved at two lines so every card is the same height. Without it
      the four components with a two-line description stood 19px taller
      than the rest and broke the grid's rhythm. */}
  <p className="line-clamp-2 min-h-[3.75rem] shrink-0 border-t border-border/60 px-3 py-2.5 text-xs leading-relaxed text-pretty text-muted-foreground">
  {c.description}
  </p>
  </div>
  );
  })}
  </div>
  )}
 </div>
 );
}
