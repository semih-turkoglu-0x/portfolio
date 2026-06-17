import { ImageResponse } from "next/og";

import { sparkDataUri } from "@/lib/og-spark";

// Default social card for the whole site (overridden by closer image files,
// e.g. app/blog/[slug]/opengraph-image.tsx). Generated at build (SSG).
export const alt = "Semih Turkoglu — software engineer & writer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={104} height={104} src={sparkDataUri()} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-0.03em",
            }}
          >
            Semih Turkoglu
          </div>
          <div style={{ fontSize: 36, color: "#a1a1a1" }}>
            {"Software engineer & writer"}
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#737373" }}>semihturkoglu.be</div>
      </div>
    ),
    { ...size },
  );
}
