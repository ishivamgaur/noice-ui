import { ImageResponse } from "next/og";
import { getComponent } from "@/lib/registry";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Noice UI component";

/** Per-component social card, generated from the catalog entry. */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const component = getComponent(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0c",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              background: "#972432",
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 700 }}>Noice UI</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2 }}>
            {component?.title ?? "Components"}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#a1a1aa",
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            {component?.description ?? "Copy-paste React components."}
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 24, color: "#a1a1aa" }}>
          <div>npx shadcn add</div>
          <div style={{ color: "#e8a0a8" }}>{component?.name}</div>
        </div>
      </div>
    ),
    size
  );
}
