import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Branded Open Graph card shared by the site and article routes. */
export function renderOgImage({ title, eyebrow, footer }: { title: string; eyebrow: string; footer: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 55%, #4C1D95 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 46,
              fontWeight: 800,
            }}
          >
            B
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, display: "flex" }}>
            Blog<span style={{ color: "#A5B4FC" }}>Nest</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#C4B5FD", display: "flex" }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: title.length > 70 ? 54 : 64, fontWeight: 700, lineHeight: 1.1, display: "flex" }}>
            {title}
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#CBD5E1", display: "flex" }}>{footer}</div>
      </div>
    ),
    ogSize,
  );
}
