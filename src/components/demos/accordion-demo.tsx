"use client";

import { Accordion } from "../../../registry/ui/accordion";

const ITEMS = [
  {
    question: "Do I need to install the whole library?",
    answer:
      "No. Each component is copied into your project as source, so you own it and edit it freely.",
  },
  {
    question: "Is it compatible with Next.js?",
    answer:
      "Yes. Every component ships as a plain client component with no framework-specific API.",
  },
  {
    question: "Can I change the styling?",
    answer:
      "That is the point. Tailwind classes are right there in the file, with no runtime theme to fight.",
  },
];

export function AccordionDemo() {
  return (
    <Accordion
      className="w-full max-w-md"
      items={ITEMS}
      defaultOpen={[0]}
    />
  );
}
