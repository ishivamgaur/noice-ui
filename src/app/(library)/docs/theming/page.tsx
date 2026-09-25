import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs/docs-article";
import { Step } from "@/components/docs/step";

export const metadata: Metadata = {
  title: "Theming",
  description: "Customize colors, radius, and dark mode with CSS variables.",
};

export default function ThemingPage() {
  return (
    <DocsArticle>
      <h1 className="text-2xl font-semibold tracking-tight text-balance">
        Theming
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        Every noiceui component reads from CSS variables. Recolor the entire
        library by changing tokens, never components.
      </p>

      <Step n={1} title="The token set">
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            :root
          </code>{" "}
          holds the light theme,{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            .dark
          </code>{" "}
          holds the dark theme. Tailwind v4 maps them through{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            @theme inline
          </code>
          , so classes like{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            bg-primary text-primary-foreground
          </code>{" "}
          always follow the active theme.
        </p>
        <CodeBlock
          lang="css"
          code={`:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ...card, muted, accent, border, ring... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  /* ... */
}`}
        />
      </Step>

      <Step n={2} title="Your brand color">
        <p>
          The fastest way to make the library yours is to change{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            --primary
          </code>{" "}
          and its foreground in both themes. Pick a foreground that clears
          4.5:1 against the fill.
        </p>
        <CodeBlock
          lang="css"
          code={`:root {
  --primary: oklch(0.45 0.14 19);        /* burgundy */
  --primary-foreground: oklch(0.985 0.01 30);
}

.dark {
  --primary: oklch(0.68 0.13 17);        /* lifted for dark */
  --primary-foreground: oklch(0.25 0.06 16);
}`}
        />
      </Step>

      <Step n={3} title="Radius and density">
        <p>
          One value controls the whole feel. Components derive{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            rounded-sm
          </code>
          ,{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            rounded-md
          </code>
          , and{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            rounded-lg
          </code>{" "}
          from it, so a single edit reshapes every surface at once.
        </p>
        <CodeBlock lang="css" code={`:root {
  --radius: 0.375rem;   /* sharper */
  /* or */
  --radius: 1rem;       /* softer */
}`} />
      </Step>

      <Step n={4} title="Dark mode">
        <p>
          Use class-based dark mode so the theme can be toggled at runtime.
          Wrap your app once with the provider, then add the variant to your
          stylesheet.
        </p>
        <CodeBlock
          lang="tsx"
          code={`// app/layout.tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>`}
        />
        <CodeBlock lang="css" code={`@custom-variant dark (&:where(.dark, .dark *));`} />
      </Step>

      <Step n={5} title="Per-component overrides">
        <p>
          Every part accepts{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            className
          </code>
          . Classes are merged with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            tailwind-merge
          </code>
          , so your value wins over the default without needing{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            !important
          </code>
          .
        </p>
        <CodeBlock
          lang="tsx"
          code={`<Button className="rounded-full bg-brand text-brand-foreground">
  Rounded brand button
</Button>`}
        />
      </Step>
    </DocsArticle>
  );
}
