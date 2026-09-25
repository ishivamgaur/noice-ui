import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Installation - noiceui",
  description: "Set up noiceui components in any React + Tailwind project.",
};

export default function InstallationPage() {
  return (
    <article className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold tracking-tight">Installation</h1>
      <p className="mt-2 text-muted-foreground">
        noiceui is a shadcn-compatible registry. Components are copied into
        your project - no npm package, no version lock.
      </p>

      <h2 className="mb-3 mt-10 text-lg font-semibold">
        1. Prepare your project
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          You need a React + Tailwind CSS v4 project, a{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            cn()
          </code>{" "}
          helper at{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            @/lib/utils
          </code>
          , and the noiceui design tokens in your CSS:
        </p>
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="ts"
          code={`// lib/utils.ts\nimport { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}`}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Copy the token set from{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          src/app/globals.css
        </code>{" "}
        in{" "}
        <a
          href="https://github.com/noiceui/noiceui"
          className="text-foreground underline underline-offset-4"
        >
          this repo
        </a>{" "}
        - it defines{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          --background
        </code>
        ,{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          --primary
        </code>
        ,{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          .dark
        </code>{" "}
        overrides, and the Tailwind v4 theme mapping. See{" "}
        <Link
          href="/docs/theming"
          className="text-foreground underline underline-offset-4"
        >
          Theming
        </Link>{" "}
        for details.
      </p>

      <h2 className="mb-3 mt-10 text-lg font-semibold">
        2. Install a component
      </h2>
      <CodeBlock
        code={`npx shadcn@latest add ${SITE_URL}/r/button.json`}
      />
      <p className="mt-3 text-sm text-muted-foreground">
        Or register the namespace once in{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          components.json
        </code>{" "}
        and install short names:
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="json"
          code={`{\n  "registries": {\n    "@noice": "${SITE_URL}/r/{name}.json"\n  }\n}\n\n// npx shadcn@latest add @noice/button`}
        />
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">3. Use it</h2>
      <CodeBlock
        lang="tsx"
        code={`import { Button } from "@/components/ui/button";\n\nexport function Page() {\n  return <Button>Get started</Button>;\n}`}
      />
    </article>
  );
}
