import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names, with later Tailwind utilities winning over
 * earlier ones in the same group.
 *
 * This ships as a registry item rather than being assumed to exist. Every
 * other component here imports `cn` from "@/lib/utils", and a consumer who
 * installs a component into a project that has not run `shadcn init` has no
 * such file - the import would resolve to nothing and the build would fail.
 * Declaring it as a registryDependency means the CLI copies it in alongside
 * the component.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
