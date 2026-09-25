import { cn } from "@/lib/utils";

/**
 * Centered reading column for docs pages. Prose stays at a readable
 * measure while the column itself sits centred in the wide shell, so
 * code blocks get real width and the page never looks stranded.
 */
export function DocsArticle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={cn("mx-auto w-full max-w-3xl", className)}>
      {children}
    </article>
  );
}

/** Section spacing used inside every guide. One value, no drift. */
export const PROSE_GAP = "mt-12";
