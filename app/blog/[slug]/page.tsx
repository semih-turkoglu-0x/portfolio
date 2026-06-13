import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableText } from "@portabletext/react";

import { LikeButton } from "@/components/like-button";
import { client } from "@/sanity/lib/client";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

// Statically render and revalidate at most once a minute (ISR).
export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  const slugs = await client.fetch(POST_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug });

  if (!post) return {};

  return {
    title: `${post.title} — Semih Turkoglu`,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug });

  if (!post) notFound();

  return (
    <main className="flex flex-1 items-start px-6 py-24">
      <article className="mx-auto flex w-full max-w-2xl flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Link
            href="/blog"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to blog
          </Link>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          {post.publishedAt && (
            <time
              dateTime={post.publishedAt}
              className="text-sm text-muted-foreground"
            >
              {formatDate(post.publishedAt)}
            </time>
          )}
        </div>

        {post.summary && (
          <p className="text-lg leading-relaxed text-muted-foreground">
            {post.summary}
          </p>
        )}

        {post.body && (
          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:tracking-tight">
            <PortableText value={post.body} />
          </div>
        )}

        <footer className="flex items-center gap-3 border-t border-border pt-8">
          <LikeButton slug={slug} />
        </footer>
      </article>
    </main>
  );
}
