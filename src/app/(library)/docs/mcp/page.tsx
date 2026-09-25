import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs/docs-article";
import { Step, Token } from "@/components/docs/step";
import { REGISTRY_NAMESPACE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
 title: "AI + MCP",
 description: "Let Cursor, Claude, and Copilot install noiceui components for you.",
};

const CLIENTS = ["Cursor", "Claude Code", "Copilot", "Codex", "Windsurf"];

export default function McpPage() {
 return (
 <DocsArticle>
 <h1 className="text-2xl font-semibold tracking-tight text-balance">
 AI + MCP
 </h1>
 <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
 The official shadcn MCP server reads registries straight from your{" "}
 <Token>components.json</Token>
 . No custom server to maintain. Register the namespace once and your
 agent can browse, search, and install components in plain language.
 </p>

 <Step title="Register the namespace">
 <p>
 Add the registry to{" "}
 <Token>components.json</Token>
 . The{" "}
 <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
 {"{name}"}
 </code>{" "}
 placeholder is replaced with the component name.
 </p>
 <CodeBlock
 lang="json"
 code={`{
 "registries": {
 "${REGISTRY_NAMESPACE}": "${SITE_URL}/r/{name}.json"
 }
}`}
 />
 </Step>

 <Step title="Enable the MCP server">
 <p>
 One command writes the client config. Pass{" "}
 <Token>--client</Token>{" "}
 to target a specific editor.
 </p>
 <CodeBlock
 code={`npx shadcn@latest mcp init
# target one client
npx shadcn@latest mcp init --client cursor`}
 />
 <div className="flex flex-wrap gap-1.5">
 {CLIENTS.map((c) => (
 <span
 key={c}
 className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
 >
 {c}
 </span>
 ))}
 </div>
 </Step>

 <Step title="Prompt away">
 <p>
 The agent now knows what exists. Ask for what you want in plain
 language and it resolves, installs, and wires the component into your
 project.
 </p>
 <CodeBlock
 lang="text"
 code={`"Add a noiceui pricing card to my landing page"
"List every ${REGISTRY_NAMESPACE} component in the Backgrounds category"
"Install ${REGISTRY_NAMESPACE}/button and use the destructive variant"`}
 />
 </Step>

 <Step title="Built for agents">
 <p>
 The whole site is machine-readable, so an agent never has to scrape
 HTML to understand the library.
 </p>
 <div className="grid gap-3 pt-1 sm:grid-cols-2">
 <a
 href="/llms.txt"
 className="rounded-xl border border-border bg-card p-4 hover:border-muted-foreground/40"
 >
 <p className="font-mono text-sm font-medium">/llms.txt</p>
 <p className="mt-1 text-[13px] text-muted-foreground">
 Every component with its description, docs URL, dependencies, and
 install command.
 </p>
 </a>
 <a
 href="/r/index.json"
 className="rounded-xl border border-border bg-card p-4 hover:border-muted-foreground/40"
 >
 <p className="font-mono text-sm font-medium">/r/index.json</p>
 <p className="mt-1 text-[13px] text-muted-foreground">
 The machine-readable catalog, generated from the same source as
 the site.
 </p>
 </a>
 </div>
 </Step>
 </DocsArticle>
 );
}
