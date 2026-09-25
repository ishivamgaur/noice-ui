import { Plus } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

const FAQS = [
  {
    q: "Is noiceui free?",
    a: "Yes. Every component is MIT licensed. Copy it, ship it, sell it - no attribution required, no paywall, no pro tier.",
  },
  {
    q: "How do I install a component?",
    a: "One CLI command drops the source straight into your project: npx shadcn add with the component's registry URL. No package to version, no lock-in - the code is yours.",
  },
  {
    q: "Do I need shadcn to use noiceui?",
    a: "No. The registry speaks the shadcn format, so the CLI path is smoothest - but every component page has a full source tab you can copy by hand into any React + Tailwind project.",
  },
  {
    q: "How does the MCP integration work?",
    a: "Register the @noice namespace in your components.json once, then run npx shadcn mcp init. Cursor, Claude, and Copilot can then browse, search, and install components in plain language.",
  },
  {
    q: "Can I use noiceui in commercial projects?",
    a: "Yes. MIT license covers commercial use, client work, templates you sell - everything.",
  },
  {
    q: "How do I match components to my brand?",
    a: "Every component reads CSS variables for color, radius, and type. Change the tokens once in your globals.css and the whole library follows - see the Theming guide.",
  },
];

/** Compact FAQ accordion for the landing page. */
export function Faq() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Reveal>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQS.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="mt-2 pr-8 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
