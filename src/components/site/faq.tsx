import { Accordion } from "../../../registry/ui/accordion";
import { Reveal } from "@/components/site/reveal";

const FAQS = [
  {
    question: "Is noiceui free?",
    answer:
      "Yes. Every component is MIT licensed. Copy it, ship it, sell it - no attribution required, no paywall, no pro tier.",
  },
  {
    question: "How do I install a component?",
    answer:
      "One CLI command drops the source straight into your project: npx shadcn add with the component's registry URL. No package to version, no lock-in - the code is yours.",
  },
  {
    question: "Do I need shadcn to use noiceui?",
    answer:
      "No. The registry speaks the shadcn format, so the CLI path is smoothest - but every component page has a full source tab you can copy by hand into any React + Tailwind project.",
  },
  {
    question: "How does the MCP integration work?",
    answer:
      "Register the @noice namespace in your components.json once, then run npx shadcn mcp init. Cursor, Claude, and Copilot can then browse, search, and install components in plain language.",
  },
  {
    question: "Can I use noiceui in commercial projects?",
    answer:
      "Yes. MIT license covers commercial use, client work, templates you sell - everything.",
  },
  {
    question: "How do I match components to my brand?",
    answer:
      "Every component reads CSS variables for color, radius, and type. Change the tokens once in your globals.css and the whole library follows - see the Theming guide.",
  },
];

/**
 * FAQ built on the library's own Accordion, so the landing page is
 * assembled from the components it sells. Panels unfold with a real
 * height animation instead of the native details element's hard cut.
 */
export function Faq() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Reveal>
        <Accordion items={FAQS} />
      </Reveal>
    </div>
  );
}
