import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs/docs-article";
import { Requirement, Step, Token } from "@/components/docs/step";
import { InstallTabs } from "@/components/docs/install-tabs";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
 title: "Installation",
 description: "Set up noiceui components in any React + Tailwind project.",
};

const NEXT_STEPS = [
 {
 href: "/docs/theming",
 title: "Make it yours",
 text: "Swap the tokens once and every component follows.",
 },
 {
 href: "/docs/mcp",
 title: "Let your agent install",
 text: "Wire up MCP and describe what you want built.",
 },
];

export default function InstallationPage() {
 return (
 <DocsArticle>
 <h1 className="text-2xl font-semibold tracking-tight text-balance">
 Installation
 </h1>
 <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
 noiceui is a shadcn-compatible registry. Components are copied into your
 project as source you own. There is no npm package to install, no
 version to track, and nothing to upgrade.
 </p>

 <Step title="Check the prerequisites">
 <p>
 You need three things before a component will render correctly.
 </p>
 <div className="grid gap-3 sm:grid-cols-3">
 <Requirement
 title="React + Tailwind v4"
 text="Any framework that runs React 19 with Tailwind CSS v4."
 />
 <Requirement
 title="A cn() helper"
 text="Lives at @/lib/utils and merges conflicting classes."
 />
 <Requirement
 title="Design tokens"
 text="The CSS variables in globals.css that theme every component."
 />
 </div>
 </Step>

 <Step title="Add cn() and the tokens">
 <p>
 If your project does not have a{" "}
 <Token>cn()</Token>{" "}
 helper yet, add it. Every shipped component imports it.
 </p>
 <CodeBlock
 lang="ts"
 code={`// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}`}
 />
 <p>
 Then copy the token block from{" "}
 <Token>src/app/globals.css</Token>
 . It defines the light palette, the{" "}
 <Token>.dark</Token>{" "}
 overrides, and the Tailwind v4 theme mapping that connects them to
 utility classes. The{" "}
 <Link href="/docs/theming" className="text-foreground underline underline-offset-4">
 theming guide
 </Link>{" "}
 explains what each token controls.
 </p>
 </Step>

 <Step title="Install a component">
 <p>
 Pick a package manager, then run the command. It writes the source
 straight into{" "}
 <Token>components/ui/</Token>
 .
 </p>
 <InstallTabs name="button" />
 </Step>

 <Step title="Use it">
 <p>
 Import from{" "}
 <Token>@/components/ui</Token>
 . Variants and sizes are typed, so your editor autocompletes them.
 </p>
 <CodeBlock
 lang="tsx"
 code={`import { Button } from "@/components/ui/button";

export function Page() {
 return (
 <div className="flex gap-2">
 <Button>Get started</Button>
 <Button variant="outline">Documentation</Button>
 </div>
 );
}`}
 />
 <p>
 Every component page has a live preview, a viewport switcher, the full
 prop table, and a Source tab with the exact code the CLI installs.
 </p>
 </Step>

 <section className="mt-16 border-t border-border pt-8">
 <p className="text-[13px] text-muted-foreground">
 Next steps
 </p>
 <div className="mt-4 grid gap-3 sm:grid-cols-2">
 {NEXT_STEPS.map((s) => (
 <Link
 key={s.href}
 href={s.href}
 className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 duration-200 hover:border-muted-foreground/40"
 >
 <div>
 <p className="text-sm font-medium">{s.title}</p>
 <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
 {s.text}
 </p>
 </div>
 <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
 </Link>
 ))}
 </div>
 <p className="mt-6 text-xs text-muted-foreground">
 Registry endpoint:{" "}
 <code className="font-mono">{SITE_URL}/r/{"{name}"}.json</code>
 </p>
 </section>
 </DocsArticle>
 );
}
