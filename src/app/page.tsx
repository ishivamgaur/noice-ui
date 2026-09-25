"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { HeroIntro } from "@/components/site/hero-intro";
import { HeroCta } from "@/components/site/hero-cta";
import { Faq } from "@/components/site/faq";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/docs/page-header";
import { Logo } from "@/components/site/logo";
import { StackIcons } from "@/components/site/stack-icons";
import { HeroCollage } from "@/components/site/hero-collage";
import { components, installCommand } from "@/lib/registry";
import { REGISTRY_NAMESPACE, SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CopyableArtifact } from "@/components/copyable-artifact";
import { DEMOS } from "@/components/demos/demos";

const STEPS = [
  {
    title: "Browse",
    text: "Every component has a live demo, a props table, and the exact source the CLI will write. Nothing is summarised.",
    artifact: `${SITE_URL}/components/accordion`,
    label: "the component page URL",
  },
  {
    title: "Install",
    text: "One command writes the component into components/ui as TypeScript you can edit, delete, or vendor.",
    artifact: installCommand("accordion", "npm"),
    label: "the install command",
  },
  {
    title: "Ship or prompt",
    text: "Use it directly, or register the namespace and let your agent pull components in plain language.",
    artifact: `npx shadcn@latest mcp init ${REGISTRY_NAMESPACE}`,
    label: "the MCP setup command",
  },
];

/**
 * A curated set for the homepage, since "featured" that lists everything
 * is just a second copy of the catalog. Declared against registry names,
 * so a component that is renamed or removed falls out here rather than
 * rendering an empty cell.
 *
 * Only width is assigned. A span decides how many columns a cell takes;
 * its height is always whatever the component inside needs. Forcing rows
 * with a row-span is what crops a tall component, so nothing here spans
 * rows and no cell clips.
 */
const FEATURED_SLOTS: Array<{ name: string; span: "wide" | "single" }> = [
  { name: "gauge", span: "wide" },
  { name: "sparkline", span: "single" },
  { name: "task-list", span: "single" },
  { name: "marquee", span: "wide" },
  { name: "compare-slider", span: "single" },
  { name: "button", span: "single" },
  { name: "otp-input", span: "wide" },
  { name: "word-rotator", span: "single" },
];

const FEATURED = FEATURED_SLOTS.flatMap((slot) => {
  const component = components.find((c) => c.name === slot.name);
  return component ? [{ ...component, span: slot.span }] : [];
});

export default function Home() {
 const latest = components[components.length - 1];
 return (
 <div className="flex min-h-screen flex-col">
 <SiteHeader />

 {/* Hero */}
 <section className="relative w-full overflow-hidden bg-background dark:bg-[#0a0a0c]">
 <div className="relative mx-auto grid w-full max-w-[90rem] items-center gap-12 px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
 <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
 <HeroIntro
 badge={
 <Link
 href={`/components/${latest.name}`}
 className="group inline-flex h-8 items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3 text-[13px] text-muted-foreground shadow-sm duration-150 hover:text-foreground active:scale-[0.96]"
 >
 <span className="flex h-6 items-center rounded-full bg-foreground px-2.5 text-xs font-semibold text-background">
 New
 </span>
 <span className="font-medium text-foreground">
 {latest.title}
 </span>
 <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
 </Link>
 }
              headline={
                <>
                  Beautiful components, ready to ship.
                </>
              }
 sub="Open-source React components built with Tailwind CSS and Motion. Install via CLI - or let your AI agent do it through MCP."
 >
 <HeroCta />
 </HeroIntro>
 <p className="mt-8 flex items-center gap-2 text-[13px] text-muted-foreground">
 <span className="h-1.5 w-1.5 rounded-full bg-brand" />
 {components.length} components live
 </p>
 </div>
            <HeroCollage />
          </div>
          {/* A hairline does the dividing, so the section needs no heading
              of its own. The label that used to sit here repeated what the
              row of logos already said. */}
          <div className="relative mx-auto w-full max-w-[90rem] px-4 pb-14 sm:px-6">
            <div className="flex justify-center border-t border-border pt-10">
              <StackIcons />
            </div>
          </div>
      </section>

 {/* How it works */}
 <section className="mx-auto w-full max-w-[90rem] px-4 py-20 sm:px-6 sm:py-24">
 <SectionHeading
   title="From discovery to deploy in minutes"
   description="Three commands, and the code is in your repo."
 />
 <Reveal>
 {/* Ruled columns rather than cards. Each step shows the real artifact it
     describes - the URL, the command, the prompt - so the section
     demonstrates the product instead of describing it. The order carries
     itself left to right, so no ordinals are needed. */}
 <ol className="mt-10 grid gap-x-8 gap-y-10 border-t border-border pt-8 md:grid-cols-3">
 {STEPS.map((s) => (
   <li key={s.title} className="flex min-w-0 flex-col">
     <h3 className="text-[15px] font-medium tracking-tight">{s.title}</h3>
     <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
       {s.text}
     </p>
     <div className="mt-5 min-w-0">
       <CopyableArtifact value={s.artifact} label={s.label} />
     </div>
   </li>
 ))}
 </ol>
 </Reveal>
 </section>

  {/* Featured components */}
  <section className="mx-auto w-full max-w-[90rem] px-4 py-20 sm:px-6 sm:py-24">
    <div className="flex items-end justify-between gap-4">
      <SectionHeading
        title="Featured"
        description="Rendered live from the same source the CLI installs."
      />
      <Link
        href="/components"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        All {components.length} components
      </Link>
    </div>
    <Reveal>
      {/* Width is assigned, height is not. Each cell is exactly as tall as
          the component it holds, and nothing overflows, so a wide chart or
          a tall meter is shown whole instead of being cropped into a
          uniform box. min-w-0 stops a wide child from stretching the track.
          The cell is a div rather than a link, so the component inside
          stays live - hover, drag, type, toggle. Navigation is separate
          and deliberate: the name and the arrow both go to the detail
          page, and a click that lands on the component never navigates. */}
      <div className="mt-6 grid auto-rows-min grid-cols-2 gap-3">
        {FEATURED.map((c) => {
          const Demo = DEMOS[c.name];
          return (
            <div
              key={c.name}
              className={cn(
                "group flex min-w-0 flex-col rounded-lg border border-border bg-background",
                c.span === "wide" && "col-span-2"
              )}
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
                  className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1"
                >
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
              <div className="flex flex-1 items-center justify-center p-5">
                {Demo ? <Demo /> : null}
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  </section>

 {/* MCP band */}
 <section className="mx-auto w-full max-w-[90rem] px-4 py-20 sm:px-6 sm:py-24">
 <Reveal>
 {/* Same radius and hairline as every other surface on the page. The
     band used to be a 2rem box with its own tinted fill, which read as a
     separate brand rather than another part of the same library. */}
 <div className="rounded-lg border border-border px-6 py-10 sm:px-10 sm:py-12">
   <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
     <div className="max-w-xl">
       <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
         Your AI agent speaks {REGISTRY_NAMESPACE}
       </h2>
       <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
         Register the namespace once. After that, Cursor, Claude and Copilot
         can browse the registry and install components from a plain-language
         request.
       </p>
     </div>
     <div className="flex w-full max-w-sm shrink-0 flex-col gap-3">
       <CopyableArtifact
         value={`npx shadcn@latest mcp init ${REGISTRY_NAMESPACE}`}
         label="the MCP setup command"
       />
       <Link
         href="/docs/mcp"
         className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-medium text-brand-foreground outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
       >
         Read the MCP guide
       </Link>
     </div>
   </div>
 </div>
 </Reveal>
 </section>

 {/* FAQ */}
 <section className="mx-auto w-full max-w-[90rem] px-4 py-20 sm:px-6 sm:py-24">
 <SectionHeading title="Questions, answered" align="center" />
 <div className="mt-8">
 <Faq />
 </div>
 </section>

 <footer className="border-t border-border">
 <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
 <div>
 <Link href="/" className="flex items-center gap-2">
 <Logo className="h-[23px] w-[23px]" />
 <span className="text-[15px] font-semibold tracking-tight">
 Noice UI
 </span>
 </Link>
 <p className="mt-3 max-w-xs text-pretty text-sm text-muted-foreground">
 Copy-paste components for React. You own every line. MIT
 licensed.
 </p>
 </div>
 <nav aria-label="Library">
 <p className="text-[13px] font-medium">Library</p>
 <ul className="mt-3 flex flex-col gap-2 text-sm">
 <li>
 <Link href="/components" className="text-muted-foreground hover:text-foreground">
 All components
 </Link>
 </li>
 <li>
 <Link href="/docs/installation" className="text-muted-foreground hover:text-foreground">
 Installation
 </Link>
 </li>
 <li>
 <Link href="/docs/theming" className="text-muted-foreground hover:text-foreground">
 Theming
 </Link>
 </li>
 <li>
 <Link href="/docs/mcp" className="text-muted-foreground hover:text-foreground">
 AI + MCP
 </Link>
 </li>
 </ul>
 </nav>
 <nav aria-label="Resources">
 <p className="text-[13px] font-medium">Resources</p>
 <ul className="mt-3 flex flex-col gap-2 text-sm">
 <li>
 <Link href="/llms.txt" className="text-muted-foreground hover:text-foreground">
 llms.txt
 </Link>
 </li>
 <li>
 <Link href="/r/index.json" className="text-muted-foreground hover:text-foreground">
 Registry index
 </Link>
 </li>
 <li>
 <Link href="/sitemap.xml" className="text-muted-foreground hover:text-foreground">
 Sitemap
 </Link>
 </li>
 </ul>
 </nav>
 </div>
 <div className="border-t border-border">
 <div className="mx-auto flex max-w-[90rem] flex-col gap-1 px-4 py-6 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
 <span>© 2026 noiceui</span>
 <span>Built with Next.js, Motion and Tailwind CSS</span>
 </div>
 </div>
 </footer>
 </div>
 );
}
