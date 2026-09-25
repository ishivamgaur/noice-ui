import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { components, getComponent } from "@/lib/registry";
import { SITE_URL } from "@/lib/site";
import { PreviewTabs } from "@/components/docs/preview-tabs";
import { InstallTabs } from "@/components/docs/install-tabs";
import { PropsTable } from "@/components/docs/props-table";
import { DEMOS } from "@/components/demos/demos";

/**
 * Single dynamic route renders EVERY component doc page from the
 * central catalog - no duplicated page.tsx per component.
 */
export async function generateStaticParams() {
  return components.map((c) => ({ slug: c.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return {};
  return {
    title: component.title,
    description: component.description,
    alternates: { canonical: `${SITE_URL}/components/${component.name}` },
    openGraph: {
      title: `${component.title} - Noice UI`,
      description: component.description,
      url: `${SITE_URL}/components/${component.name}`,
      type: "article",
    },
  };
}

/** Per-component structured data: what it is, where it lives, how to install it. */
function componentJsonLd(component: NonNullable<ReturnType<typeof getComponent>>) {
  const url = `${SITE_URL}/components/${component.name}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Components",
            item: `${SITE_URL}/components`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: component.title,
            item: url,
          },
        ],
      },
      {
        "@type": "SoftwareSourceCode",
        name: component.title,
        description: component.description,
        url,
        codeRepository: `${SITE_URL}/r/${component.name}.json`,
        programmingLanguage: "TypeScript",
        runtimePlatform: "React",
        applicationCategory: "DeveloperApplication",
        isAccessibleForFree: true,
        license: "https://opensource.org/licenses/MIT",
        keywords: [
          "react component",
          "tailwind css",
          "shadcn registry",
          `${component.name} component`,
          "copy paste component",
        ],
      },
    ],
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) notFound();

  const Demo = DEMOS[component.name];
  const i = components.findIndex((c) => c.name === component.name);
  const prev = i > 0 ? components[i - 1] : null;
  const next = i < components.length - 1 ? components[i + 1] : null;

  return (
    <article className="mx-auto w-full max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(componentJsonLd(component)),
        }}
      />

      {/* A quiet well so every piece is shown the same way. Clipped
          sideways so thrown or dragged demos cannot widen the page. */}
      <div className="flex min-h-100 items-center justify-center overflow-x-clip rounded-lg border border-border bg-surface p-4 sm:min-h-130 sm:p-8">
        {Demo ? <Demo /> : null}
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {component.title}
          </h1>
          <p className="mt-2 max-w-xl text-pretty text-[15px] text-muted-foreground">
            {component.description}
          </p>
          <Link
            href={`/components?c=${encodeURIComponent(component.category)}`}
            className="mt-3 inline-flex h-7 items-center rounded-full bg-surface px-3 text-xs font-medium text-muted-foreground transition-[color,background-color] duration-150 ease-out hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {component.category}
          </Link>
        </div>
      </div>

      {/* The tabs are the heading here, so there is no "Code" label above
          them duplicating what they already say. */}
      <div className="mt-12">
        <PreviewTabs slug={component.name} usage={component.usage}>
          {Demo ? <Demo /> : null}
        </PreviewTabs>
      </div>

      <h2 className="mb-4 mt-12 text-base font-semibold tracking-tight">Installation</h2>
      <InstallTabs name={component.name} />

      <h2 className="mb-4 mt-12 text-base font-semibold tracking-tight">Props</h2>
      <PropsTable props={component.props} />

      {/* Walks the catalog in sidebar order, so you can browse without
          going back to the index. Hairlines carry the structure. */}
      <nav
        aria-label="More components"
        className="mt-16 grid grid-cols-2 gap-x-8 border-t border-border pt-6"
      >
        {prev ? (
          <Link
            href={`/components/${prev.name}`}
            className="group flex flex-col gap-1 outline-none"
          >
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" />
              Previous
            </span>
            <span className="truncate text-sm font-medium group-hover:text-brand">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/components/${next.name}`}
            className="group flex flex-col items-end gap-1 text-right outline-none"
          >
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Next
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </span>
            <span className="truncate text-sm font-medium group-hover:text-brand">
              {next.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
