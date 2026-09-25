import { cn } from "@/lib/utils";

/**
 * Shared page typography. One source for the h1/lead pair so every
 * route opens with the same rhythm and measure.
 */
export function PageHeader({
  title,
  lead,
  className,
}: {
  title: string;
  lead?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-10", className)}>
      <h1 className="text-[34px] leading-[1.1] font-semibold tracking-tight text-balance sm:text-[46px]">
        {title}
      </h1>
      {lead && (
        <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
          {lead}
        </p>
      )}
    </header>
  );
}

/** Section heading, left aligned. */
export function SectionHeading({
  title,
  description,
  className,
  align = "left",
}: {
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-xl text-center",
        className
      )}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-xl text-pretty text-[15px] text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
