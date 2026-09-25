import { SiteHeader } from "@/components/site-header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";

/** Shared shell for /components/* and /docs/* - sidebar + content. */
export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[90rem] flex-1 gap-8 px-4 sm:px-6">
        <DocsSidebar />
        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>
    </div>
  );
}
