import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "../../registry/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-4 max-w-xl text-[34px] leading-[1.1] font-semibold tracking-tight text-balance sm:text-[46px]">
        This page slipped away.
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        The link may be outdated, or the component you are after is not
        published yet.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          <ArrowLeft className="size-4" />
          Back home
        </Link>
        <Link
          href="/components"
          className={buttonVariants({ size: "lg", variant: "outline" })}
        >
          Browse components
        </Link>
      </div>
    </div>
  );
}
