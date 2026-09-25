"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { HeroIntro } from "@/components/site/hero-intro";
import { HeroCta } from "@/components/site/hero-cta";
import { Scribble } from "@/components/site/scribble";
import { StackIcons } from "@/components/site/stack-icons";
import { Faq } from "@/components/site/faq";
import { Reveal } from "@/components/site/reveal";
import { Logo } from "@/components/site/logo";
import { HeroCollage } from "@/components/site/hero-collage";
import { components } from "@/lib/registry";
import { REGISTRY_NAMESPACE } from "@/lib/site";
import { DEMOS } from "@/components/demos/demos";

const STEPS = [
  {
    n: "01",
    title: "Browse",
    text: "Every component has a live demo, props table, and full source - no surprises.",
  },
  {
    n: "02",
    title: "Install",
    text: "One CLI command drops the code into your project. You own it, restyle freely.",
  },
  {
    n: "03",
    title: "Ship or prompt",
    text: "Use components directly - or let your AI agent install them via MCP.",
  },
];

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
                  className="group inline-flex h-8 items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3 text-[13px] text-muted-foreground shadow-sm transition-all duration-150 hover:text-foreground active:scale-[0.96]"
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
                  Beautiful components,{" "}
                  <span className="relative inline-block">
                    ready to ship.
                    <Scribble />
                  </span>
                </>
              }
              sub="Open-source React components built with Tailwind CSS and Motion. Install via CLI - or let your AI agent do it through MCP."
            >
              <HeroCta />
            </HeroIntro>
            <p className="mt-8 flex items-center gap-2 text-[13px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {components.length} components live - new drops weekly
              <span className="ml-1 flex items-center gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                ))}
              </span>
            </p>
            </div>
            <HeroCollage />
          </div>
          <div className="relative mx-auto w-full max-w-[90rem] px-4 pb-12 sm:px-6">
            <div className="flex flex-col items-center gap-4 border-t border-border/70 pt-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Built for the modern stack
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <StackIcons />
              </div>
            </div>
          </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-[90rem] px-4 pb-10 pt-20 sm:px-6 sm:pb-12 sm:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          How it works
        </p>
        <h2 className="mt-3 max-w-xl font-display text-2xl font-bold tracking-tight sm:text-3xl">
          From discovery to deploy in minutes
        </h2>
        <Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.06] active:scale-[0.99] dark:hover:shadow-black/40"
            >
              <p className="font-display text-2xl font-bold text-brand">{s.n}</p>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
          </div>
        </Reveal>
      </section>

      {/* Featured components */}
      <section className="mx-auto w-full max-w-[90rem] px-4 py-10 sm:px-6 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          The library
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Featured
            </h2>
            <p className="mt-1 text-muted-foreground">
              Rendered live from the same source the CLI installs.
            </p>
          </div>
          <Link
            href="/components"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {components.map((c) => {
            const Demo = DEMOS[c.name];
            return (
              <Link
                key={c.name}
                href={`/components/${c.name}`}
                className="group cv-auto overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-muted-foreground/40 hover:shadow-xl hover:shadow-black/[0.06] active:scale-[0.99] dark:hover:shadow-black/40"
              >
                <div className="pointer-events-none flex min-h-40 flex-wrap items-center justify-center gap-2 overflow-hidden border-b border-border/60 bg-muted/20 p-6">
                  {Demo ? <Demo /> : null}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold group-hover:underline group-hover:underline-offset-4">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.description}
                  </p>
                </div>
              </Link>
            );
          })}
          </div>
        </Reveal>
      </section>

      {/* MCP band */}
      <section className="mx-auto w-full max-w-[90rem] px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-muted px-6 py-14 sm:px-12 dark:bg-white/[0.03]">
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                AI-native
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Your AI agent speaks {REGISTRY_NAMESPACE}
              </h2>
              <p className="mt-2 text-muted-foreground">
                Register the namespace, run{" "}
                <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs">
                  npx shadcn mcp init
                </code>
                , and describe what you want built.
              </p>
            </div>
            <Link
              href="/docs/mcp"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-all duration-150 hover:opacity-90 active:scale-[0.96]"
            >
              Set up MCP
              <ArrowRight className="size-4" />
            </Link>
          </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-[90rem] px-4 pb-20 sm:px-6 sm:pb-24">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          FAQ
        </p>
        <h2 className="mx-auto mt-3 max-w-xl text-center font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Questions, answered
        </h2>
        <div className="mt-8">
          <Faq />
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-[22px] w-[22px]" />
              <span className="font-display text-base font-extrabold tracking-tight">
                noiceui
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Beautiful copy-paste components for React. Free forever, MIT
              licensed.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Library
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/components" className="text-muted-foreground hover:text-foreground">
                  Components
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
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Components
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {components.map((c) => (
                <li key={c.name}>
                  <Link
                    href={`/components/${c.name}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Resources
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/llms.txt" className="font-mono text-[13px] text-muted-foreground hover:text-foreground">
                  llms.txt
                </Link>
              </li>
              <li>
                <Link href="/r/index.json" className="font-mono text-[13px] text-muted-foreground hover:text-foreground">
                  registry index
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="font-mono text-[13px] text-muted-foreground hover:text-foreground">
                  sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-1 px-4 py-6 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>© 2026 noiceui</span>
            <span>Copy, paste, ship.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
