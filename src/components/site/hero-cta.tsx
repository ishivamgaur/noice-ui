import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { installCommand } from "@/lib/registry";

const COMMAND = installCommand("button");

/** Solid + outline CTA pair with a quiet copy-command line beneath. */
export function HeroCta() {
  return (
    <div className="flex flex-col items-center gap-4 lg:items-start">
      <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap lg:justify-start">
        <Link
          href="/components"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-7 text-[15px] font-semibold text-brand-foreground transition-all duration-200 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
        >
          Browse components
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/docs/installation"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-7 text-[15px] font-semibold transition-all duration-200 hover:bg-accent active:scale-[0.98]"
        >
          Documentation
        </Link>
      </div>
      <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
        <span className="max-w-64 truncate sm:max-w-none">{COMMAND}</span>
        <CopyButton text={COMMAND} className="h-7 w-7 rounded-full" />
      </div>
    </div>
  );
}
