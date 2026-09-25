import { cn } from "@/lib/utils";

/**
 * A titled section within a guide.
 *
 * Deliberately unnumbered. Decorative ordinals (01 / 02 / 03) are a
 * template habit, and they only earn their place when the content is a
 * true ordered sequence. These sections are reference material read out
 * of order as often as in it, so a hairline that divides one topic from
 * the next carries the structure instead.
 */
export function Step({
  title,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-t border-border pt-8 first:border-t-0 first:pt-0", className)}>
      <h2 className="text-lg font-semibold tracking-tight text-balance">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

/** Inline code token, used throughout the guides. */
export function Token({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
      {children}
    </code>
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
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
