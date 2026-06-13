import { NextResponse } from "next/server";

import { allowLike, getLikes, toggleLike } from "@/lib/likes";

// Always run per-request; like counts must never be cached.
export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9-]{1,200}$/;
const VISITOR_RE = /^[A-Za-z0-9_-]{8,64}$/;

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
}

function cleanVisitor(value: unknown) {
  return typeof value === "string" && VISITOR_RE.test(value) ? value : "";
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const visitorId = cleanVisitor(new URL(req.url).searchParams.get("v"));
  return NextResponse.json(await getLikes(slug, visitorId));
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const visitorId = cleanVisitor(body?.visitorId);
  if (!visitorId) {
    return NextResponse.json({ error: "Missing visitorId" }, { status: 400 });
  }

  if (!(await allowLike(clientIp(req)))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return NextResponse.json(await toggleLike(slug, visitorId));
}
