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
}

export const components: RegistryComponent[] = meta.components;

export function getComponent(slug: string): RegistryComponent | undefined {
  return components.find((c) => c.name === slug);
}

export function getCategories(): string[] {
  return [...new Set(components.map((c) => c.category))].sort();
}

export function getComponentsByCategory(category: string) {
  return components.filter((c) => c.category === category);
}

/** Public URL of a component's registry JSON (used by CLI + MCP). */
export function registryUrl(name: string) {
  return `${SITE_URL}/r/${name}.json`;
}

/** CLI command to install a component directly. */
export function installCommand(name: string) {
  return `npx shadcn@latest add ${registryUrl(name)}`;
}
