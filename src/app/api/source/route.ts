import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getComponent } from "@/lib/registry";

/**
 * Serves the live source of a registry component as plain text.
 * Used by the docs "Source" tab so displayed code can never drift
 * from what the CLI actually installs.
 *
 *   GET /api/source?component=button
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("component") ?? "";

  if (!getComponent(name)) {
    return new Response("Unknown component", { status: 404 });
  }

  try {
    const source = await readFile(
      join(process.cwd(), "registry", "ui", `${name}.tsx`),
      "utf8"
    );
    return new Response(source, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new Response("Source not found", { status: 404 });
  }
}
