import Link from "next/link";
import {
  siFramer,
  siModelcontextprotocol,
  siNextdotjs,
  siShadcnui,
  siTailwindcss,
} from "simple-icons";
import { cn } from "@/lib/utils";

function BrandIcon({
  path,
  className,
}: {
  path: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-5", className)}
      style={{ fill: "currentColor" }}
    >
      <path d={path} />
    </svg>
  );
}

/**
 * The stack, as marks rather than chips.
 *
 * The brands carry the recognition on their own, so a pill around each
 * one only adds a border that competes with the mark. Colour is dropped
 * too: five different brand hues side by side turn a quiet credit line
 * into a paint chart. The names stay, small and muted, for anyone who
 * does not recognise a glyph.
 *
 * All five link. A partial split reads as arbitrary unless the visitor
 * already knows why, and checking a dependency's docs is a real move for
 * someone deciding whether a library fits their stack.
 */
const MARKS = [
  { label: "Next.js", path: siNextdotjs.path, href: "https://nextjs.org" },
  {
    label: "Tailwind CSS",
    path: siTailwindcss.path,
    href: "https://tailwindcss.com",
  },
  { label: "Motion", path: siFramer.path, href: "https://motion.dev" },
  { label: "shadcn", path: siShadcnui.path, href: "https://ui.shadcn.com" },
  {
    label: "MCP",
    path: siModelcontextprotocol.path,
    href: "/docs/mcp",
  },
] as const;

export function StackIcons() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
      {MARKS.map((m) => (
        <li key={m.label}>
          <Link
            href={m.href}
            {...(m.href.startsWith("http")
              ? { target: "_blank", rel: "noreferrer" }
              : {})}
            className="flex items-center gap-2.5 rounded-sm underline decoration-transparent decoration-2 underline-offset-4 outline-none hover:decoration-border focus-visible:decoration-border"
          >
            <BrandIcon path={m.path} className="text-muted-foreground" />
            <span className="text-[13px] text-muted-foreground">{m.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
