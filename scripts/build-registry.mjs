/**
 * Builds shadcn-compatible registry JSON files.
 *
 * Single source of truth: `registry/meta.json` (+ sources in `registry/ui/`).
 * The same catalog drives the docs site (sidebar, gallery, doc pages,
 * sitemap, llms.txt) via `src/lib/registry.ts`.
 *
 * Output: `public/r/<name>.json` - served statically, e.g.
 *   https://your-domain.com/r/button.json
 *
 * Users install with:
 *   npx shadcn@latest add https://your-domain.com/r/button.json
 * Or namespaced (shadcn CLI 3.0+) via `registries` in components.json:
 *   npx shadcn@latest add @noice/button
 * Or straight from GitHub, no server involved:
 *   npx shadcn@latest add ishivamgaur/noice-ui/button
 *
 * The official shadcn MCP server (`npx shadcn mcp init`) reads those same
 * registry URLs, so AI agents can discover + install components for free.
 *
 * Adding a new component:
 *   1. Write `registry/ui/<name>.tsx`
 *   2. Add one entry to `registry/meta.json`
 *   3. Run `npm run registry:build`
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Same resolution as src/lib/site.ts, kept in sync deliberately: the
// catalog's homepage has to agree with the URLs the CLI hands users, and
// hardcoding it here is how it silently drifts from the deployed domain.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ui.noicess.fun"
);
const REGISTRY_DIR = join(root, "registry", "ui");
const OUT_DIR = join(root, "public", "r");

const meta = JSON.parse(readFileSync(join(root, "registry", "meta.json"), "utf8"));

// Clear the output first. Writing over the top leaves JSON behind for any
// component that has been deleted from meta.json, and that stale file stays
// publicly installable long after the source is gone.
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

for (const component of meta.components) {
  const sourcePath = join(REGISTRY_DIR, `${component.name}.tsx`);
  const content = readFileSync(sourcePath, "utf8");

  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: component.name,
    type: "registry:ui",
    title: component.title,
    description: component.description,
    dependencies: component.dependencies,
    registryDependencies: component.registryDependencies,
    files: [
      {
        path: `registry/ui/${component.name}.tsx`,
        content,
        type: "registry:ui",
        target: `components/ui/${component.name}.tsx`,
      },
    ],
    categories: [component.category.toLowerCase()],
  };

  writeFileSync(join(OUT_DIR, `${component.name}.json`), JSON.stringify(item, null, 2));
  console.log(`built public/r/${component.name}.json`);
}

// Machine-readable catalog index (used by docs + future MCP metadata)
const catalog = meta.components.map((c) => ({
  name: c.name,
  title: c.title,
  description: c.description,
  category: c.category,
}));
writeFileSync(join(OUT_DIR, "index.json"), JSON.stringify(catalog, null, 2));
console.log("built public/r/index.json");

// shadcn registry catalog at repo root
const registryJson = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "noiceui",
  homepage: SITE_URL,
  items: meta.components.map((c) => ({
    name: c.name,
    type: "registry:ui",
    title: c.title,
    description: c.description,
    dependencies: c.dependencies,
    registryDependencies: c.registryDependencies,
    files: [
      {
        path: `registry/ui/${c.name}.tsx`,
        type: "registry:ui",
        target: `components/ui/${c.name}.tsx`,
      },
    ],
    categories: [c.category.toLowerCase()],
  })),
};
const registryJsonString = JSON.stringify(registryJson, null, 2);
writeFileSync(join(root, "registry.json"), registryJsonString);
// Also emit it into public/, because only public/ is served over HTTP. The
// root copy is for anyone cloning the repo or reading it on GitHub; without
// this second write the index 404s at the site root, which is exactly where
// the shadcn directory and MCP expect to find it.
writeFileSync(join(OUT_DIR, "..", "registry.json"), registryJsonString);
console.log("built registry.json");
