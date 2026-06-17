import type { Metadata } from "next";
import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";

// Fully static (SSG): rendered once at build. New posts appear on the next
// deploy — a Sanity webhook triggers a Vercel rebuild on publish.
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog — Semih Turkoglu",
  description: "Writing by Semih Turkoglu.",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_QUERY);

  return (
    <main className="flex flex-1 items-start px-6 py-24">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Blog
          </h1>
          <p className="max-w-prose text-base leading-7 text-muted-foreground">
            Notes on what I&apos;m building and learning.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-base text-muted-foreground">
            No posts yet — check back soon.
          </p>
        ) : (
          <ul className="flex flex-col gap-8">
            {posts.map((post) => (
              <li key={post._id} className="flex flex-col gap-1.5">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-heading text-xl font-medium tracking-tight text-foreground transition-colors hover:text-muted-foreground"
                >
                  {post.title}
                </Link>
                {post.publishedAt && (
                  <time
                    dateTime={post.publishedAt}
                    className="text-sm text-muted-foreground"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                )}
                {post.summary && (
                  <p className="text-base leading-7 text-muted-foreground">
                    {post.summary}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
