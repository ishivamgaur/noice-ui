import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI + MCP - noiceui",
  description: "Let Cursor, Claude, and Copilot install noiceui components for you.",
};

export default function McpPage() {
  return (
    <article className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold tracking-tight">AI + MCP</h1>
      <p className="mt-2 text-muted-foreground">
        The official shadcn MCP server reads registries straight from your{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          components.json
        </code>{" "}
        - no custom MCP server needed. Register the namespace once and your
        agent can browse, search, and install components in plain language.
      </p>

      <h2 className="mb-3 mt-10 text-lg font-semibold">
        1. Register the namespace
      </h2>
      <CodeBlock
        lang="json"
        code={`{\n  "registries": {\n    "@noice": "${SITE_URL}/r/{name}.json"\n  }\n}`}
      />

      <h2 className="mb-3 mt-10 text-lg font-semibold">
        2. Enable the MCP server
      </h2>
      <CodeBlock code={`npx shadcn@latest mcp init\n# with a client: npx shadcn@latest mcp init --client cursor`} />

      <h2 className="mb-3 mt-10 text-lg font-semibold">3. Prompt away</h2>
      <CodeBlock
        lang="text"
        code={`"Add a noiceui pricing card to my landing page"\n"List all @noice components in the Layout category"\n"Install @noice/button and use the destructive variant"`}
      />

      <h2 className="mb-3 mt-10 text-lg font-semibold">Machine-readable index</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Agents that prefer plain text can read{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          {SITE_URL}/llms.txt
        </code>{" "}
        - every component with its description, docs URL, dependencies, and
        install command. It&apos;s generated from the same catalog as the
        registry, so it never goes stale.
      </p>
    </article>
  );
}
