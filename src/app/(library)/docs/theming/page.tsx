import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs/docs-article";
import { Step, Token } from "@/components/docs/step";

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
 Every noiceui component reads from CSS variables. Recolor the whole
 library by changing tokens, never components.
 </p>

 <Step title="The token set">
 <p>
 <Token>:root</Token> holds the light theme, <Token>.dark</Token>{" "}
 holds the dark one. Tailwind v4 maps them through{" "}
 <Token>@theme inline</Token>, so a class like{" "}
 <Token>bg-brand</Token> always resolves against the active theme.
 </p>
 <CodeBlock
 lang="css"
 code={`:root {
 --radius: 0.625rem;
 --background: oklch(1 0 0);
 --foreground: oklch(0.145 0 0);
 --card: oklch(1 0 0);
 --muted: oklch(0.97 0 0);
 --border: oklch(0.922 0 0);
}

.dark {
 --background: oklch(0.145 0 0);
 --foreground: oklch(0.985 0 0);
 --card: oklch(0.205 0 0);
 --muted: oklch(0.269 0 0);
 --border: oklch(1 0 0 / 10%);
}`}
 />
 </Step>

 <Step title="Your brand color">
 <p>
 The accent is <Token>--brand</Token>, paired with{" "}
 <Token>--brand-foreground</Token> for anything sitting on top of
 it. These are separate from <Token>--primary</Token>, which stays a
 neutral ink for ordinary buttons. Change the pair in both themes,
 and check the foreground clears 4.5:1 against the fill.
 </p>
 <CodeBlock
 lang="css"
 code={`:root {
 --brand: oklch(0.45 0.14 19); /* burgundy */
 --brand-foreground: oklch(0.985 0.01 30);
}

.dark {
 --brand: oklch(0.68 0.13 17); /* lifted for dark */
 --brand-foreground: oklch(0.25 0.06 16);
}`}
 />
 <p>
 The same colour appears in components that need it in JavaScript,
 such as the sparkline stroke and the spotlight glow. They read the
 token too, so one edit reaches all of them.
 </p>
 </Step>

 <Step title="Radius">
 <p>
 One value sets the feel of every surface. <Token>rounded-sm</Token>,{" "}
 <Token>rounded-md</Token> and <Token>rounded-lg</Token> are all
 derived from it, so a single edit reshapes the library at once.
 </p>
 <CodeBlock
 lang="css"
 code={`:root {
 --radius: 0.375rem; /* sharper */
 /* or */
 --radius: 1rem; /* softer */
}`}
 />
 </Step>

 <Step title="Dark mode">
 <p>
 Dark mode is class-based, so it can be toggled at runtime. Add the
 variant to your stylesheet, then wrap your app once.
 </p>
  <CodeBlock lang="css" code={`@custom-variant dark (&:where(.dark, .dark *));`} />
  <CodeBlock
  lang="tsx"
  code={`// app/layout.tsx
<html lang="en" suppressHydrationWarning>
  <head>
  <meta name="color-scheme" content="light dark" />
  </head>
  <body>
  <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
  </body>
</html>`}
  />
  <p>
  <Token>next-themes</Token> injects its own script into the server HTML, so
  the stored theme is applied before the first paint and there is no flash
  to hide. The <Token>color-scheme</Token> meta tells the browser which
  canvas to use before your stylesheet arrives, and{" "}
  <Token>disableTransitionOnChange</Token> makes a theme switch a hard cut
  rather than an animated crossfade.
  </p>
 </Step>

 <Step title="Per-component overrides">
 <p>
 Every part accepts <Token>className</Token>. Classes are merged with{" "}
 <Token>tailwind-merge</Token>, so your value wins over the default
 without <Token>!important</Token>.
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
