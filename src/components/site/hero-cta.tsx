import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { installCommand } from "@/lib/registry";

const COMMAND = installCommand("button");

/**
 * Single CTA row: contrasting copy-command pill + brand button.
 * The pill inverts against the hero (black on light, white on dark).
 */
export function HeroCta() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
      <div className="flex h-10 w-full max-w-md items-center gap-1 rounded-full bg-zinc-900 py-1 pl-4 pr-1 text-zinc-50 sm:w-auto sm:min-w-105 dark:bg-zinc-50 dark:text-zinc-900">
        <code className="min-w-0 flex-1 truncate font-mono text-xs sm:text-[13px]">
          {COMMAND}
        </code>
        <CopyButton
          text={COMMAND}
          className="h-8 w-8 shrink-0 rounded-full text-zinc-400 hover:bg-white/10 hover:text-white dark:text-zinc-500 dark:hover:bg-black/10 dark:hover:text-black"
        />
      </div>
      <Link
        href="/components"
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-all duration-200 hover:scale-[1.04] hover:opacity-90 active:scale-[0.96]"
      >
        Browse components
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
