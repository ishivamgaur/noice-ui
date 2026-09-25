import { cn } from "@/lib/utils";

/**
 * Numbered step. The number is the only ornament - heading and body
 * share the same left edge so the column stays flush and calm.
 */
export function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="flex items-baseline gap-2.5 text-lg font-semibold tracking-tight">
        <span className="text-muted-foreground/50">{String(n).padStart(2, "0")}</span>
        {title}
      </h2>
      <div
        className={cn(
          "mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground"
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Requirement chip for the prerequisites grid. */
export function Requirement({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
