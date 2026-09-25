import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = {
  title: "Theming - noiceui",
  description: "Customize colors, radius, and dark mode with CSS variables.",
};

export default function ThemingPage() {
  return (
    <article className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold tracking-tight">Theming</h1>
      <p className="mt-2 text-muted-foreground">
        Every noiceui component reads from CSS variables - recolor the whole
        library by changing tokens, not components.
      </p>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Design tokens</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          :root
        </code>{" "}
        holds the light theme,{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          .dark
        </code>{" "}
        holds the dark theme. Tailwind v4 maps them via{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          @theme inline
        </code>
        , so classes like{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          bg-primary text-primary-foreground
        </code>{" "}
        always follow the active theme:
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="css"
          code={`:root {\n  --radius: 0.625rem;\n  --background: oklch(1 0 0);\n  --foreground: oklch(0.145 0 0);\n  --primary: oklch(0.205 0 0);\n  --primary-foreground: oklch(0.985 0 0);\n  /* …card, muted, accent, border, ring… */\n}\n\n.dark {\n  --background: oklch(0.145 0 0);\n  --foreground: oklch(0.985 0 0);\n  --primary: oklch(0.922 0 0);\n  --primary-foreground: oklch(0.205 0 0);\n  /* … */\n}`}
        />
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Dark mode</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Use class-based dark mode so users can toggle it at runtime. With{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          next-themes
        </code>
        , wrap your app once and add{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          @custom-variant dark (&:where(.dark, .dark *));
        </code>{" "}
        to your CSS - that&apos;s exactly how this site does it.
      </p>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Customizing</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <span className="text-foreground">Brand color:</span> change{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            --primary
          </code>{" "}
          (and its foreground) in both{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            :root
          </code>{" "}
          and{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            .dark
          </code>
          .
        </p>
        <p>
          <span className="text-foreground">Roundness:</span> change{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            --radius
          </code>{" "}
          - every component derives{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            rounded-md/lg/sm
          </code>{" "}
          from it.
        </p>
        <p>
          <span className="text-foreground">Per-component tweaks:</span>{" "}
          components accept{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            className
          </code>
          , merged with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            tailwind-merge
          </code>{" "}
          so your classes win over defaults.
        </p>
      </div>
    </article>
  );
}
