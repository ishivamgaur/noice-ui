import { siFramer, siReact, siTailwindcss } from "simple-icons";

function BrandIcon({ path, label }: { path: string; label: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={label}
      className="size-4"
      fill="currentColor"
    >
      <path d={path} />
    </svg>
  );
}

const STACK = [
  { label: "React", path: siReact.path },
  { label: "Tailwind CSS", path: siTailwindcss.path },
  { label: "Motion", path: siFramer.path },
];

/** Stack strip with real brand icons. shadcn and MCP have no brand
    marks, so they stay as text pills alongside. */
export function StackIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      {STACK.map((s) => (
        <span
          key={s.label}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-1 text-[13px] font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <BrandIcon path={s.path} label={s.label} />
          {s.label}
        </span>
      ))}
      {["shadcn", "MCP"].map((t) => (
        <span
          key={t}
          className="rounded-full border border-border bg-background/60 px-3.5 py-1 text-[13px] font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
