"use client";

import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
 const { resolvedTheme, setTheme } = useTheme();
 const isDark = resolvedTheme === "dark";

 return (
 <button
 type="button"
 aria-label="Toggle theme"
 onClick={() => setTheme(isDark ? "light" : "dark")}
 className={cn(
 "relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
 className
 )}
 >
 {/* CSS-driven swap: no mounted flag, so no hydration flash. */}
 <Sun className="size-4 dark:hidden" />
 <Moon className="hidden size-4 dark:block" />
 </button>
 );
}
