import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
    title: `${component.title} - noiceui`,
    description: component.description,
    alternates: { canonical: `${SITE_URL}/components/${component.name}` },
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

  return (
    <article>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {component.category}
      </p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
        {component.title}
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {component.description}
      </p>

      {component.dependencies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {component.dependencies.map((dep) => (
            <span
              key={dep}
              className="rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-xs text-muted-foreground"
            >
              {dep}
            </span>
          ))}
        </div>
      )}

      <h2 className="mb-3 mt-10 text-lg font-semibold">Preview</h2>
      <PreviewTabs slug={component.name} usage={component.usage}>
        {Demo ? <Demo /> : null}
      </PreviewTabs>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Installation</h2>
      <InstallTabs name={component.name} />

      <h2 className="mb-3 mt-10 text-lg font-semibold">Props</h2>
      <PropsTable props={component.props} />
    </article>
  );
}
