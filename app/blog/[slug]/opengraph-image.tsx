import { ImageResponse } from "next/og";

import { sparkDataUri } from "@/lib/og-spark";
import { client } from "@/sanity/lib/client";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

export const alt = "Blog post by Semih Turkoglu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-render one card per post at build time (keeps the route fully static).
export async function generateStaticParams() {
  const slugs = await client.fetch(POST_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug });
  const title = post?.title ?? "Semih Turkoglu";

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
        <img width={88} height={88} src={sparkDataUri()} alt="" />
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 28, color: "#a1a1a1" }}>Semih Turkoglu</div>
          <div style={{ fontSize: 28, color: "#737373" }}>semihturkoglu.be</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
