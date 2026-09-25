import type { MetadataRoute } from "next";
import { components } from "@/lib/registry";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now },
    { url: `${SITE_URL}/components`, lastModified: now },
    { url: `${SITE_URL}/docs/installation`, lastModified: now },
    { url: `${SITE_URL}/docs/theming`, lastModified: now },
    { url: `${SITE_URL}/docs/mcp`, lastModified: now },
    ...components.map((c) => ({
      url: `${SITE_URL}/components/${c.name}`,
      lastModified: now,
    })),
  ];
}
