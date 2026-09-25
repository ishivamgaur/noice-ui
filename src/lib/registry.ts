import meta from "../../registry/meta.json";
import { SITE_URL } from "./site";

export interface ComponentProp {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface RegistryComponent {
  name: string;
  title: string;
  description: string;
  category: string;
  dependencies: string[];
  registryDependencies: string[];
  usage: string;
  props: ComponentProp[];
  /**
   * Gallery preview scale. The demo lays out at natural size against a
   * wider virtual box, then scales into the card, so percentage-based
   * demos resolve exactly as they do on their own page.
   */
  previewScale?: number;
  /** Anchor tall demos to the top and fade the overflow out. */
  previewCrop?: boolean;
}

export const components: RegistryComponent[] = meta.components;

export function getComponent(slug: string): RegistryComponent | undefined {
  return components.find((c) => c.name === slug);
}

export function getCategories(): string[] {
  return [...new Set(components.map((c) => c.category))].sort();
}

/** Public URL of a component's registry JSON (used by CLI + MCP). */
export function registryUrl(name: string) {
  return `${SITE_URL}/r/${name}.json`;
}

export const PACKAGE_MANAGERS = {
  npm: { label: "npm", exec: "npx" },
  pnpm: { label: "pnpm", exec: "pnpm dlx" },
  yarn: { label: "yarn", exec: "yarn dlx" },
  bun: { label: "bun", exec: "bunx --bun" },
} as const;

export type PackageManager = keyof typeof PACKAGE_MANAGERS;

/** CLI command to install a component with a given package manager. */
export function installCommand(name: string, pm: PackageManager = "npm") {
  return `${PACKAGE_MANAGERS[pm].exec} shadcn@latest add ${registryUrl(name)}`;
}
