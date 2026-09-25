import { components, githubItem, registryUrl } from "@/lib/registry";
import {
  GITHUB_SLUG,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

/**
 * AI-friendly index of the library (llms.txt convention).
 * Lets coding agents discover every component + its install URL
 * without scraping HTML.
 */
export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    ``,
    `> ${SITE_DESCRIPTION}`,
    ``,
    `Registry namespace for shadcn CLI 3.0+: \`@noice\` -> \`${SITE_URL}/r/{name}.json\``,
    ``,
    `Install straight from GitHub (no domain, no components.json entry): \`npx shadcn@latest add ${GITHUB_SLUG}/<name>\``,
    ``,
    `## Components`,
    ``,
    ...components.flatMap((c) => [
      `### ${c.title}`,
      `- Description: ${c.description}`,
      `- Category: ${c.category}`,
      `- Docs: ${SITE_URL}/components/${c.name}`,
      `- Install: \`npx shadcn@latest add ${registryUrl(c.name)}\``,
      `- Install (GitHub): \`npx shadcn@latest add ${githubItem(c.name)}\``,
      c.dependencies.length
        ? `- Dependencies: ${c.dependencies.join(", ")}`
        : `- Dependencies: none`,
      ``,
    ]),
    `## Docs`,
    ``,
    `- Installation: ${SITE_URL}/docs/installation`,
    `- Theming: ${SITE_URL}/docs/theming`,
    `- MCP (AI agents): ${SITE_URL}/docs/mcp`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
