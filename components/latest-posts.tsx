import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { LATEST_POSTS_QUERY } from "@/sanity/lib/queries";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function LatestPosts() {
  const posts = await client.fetch(LATEST_POSTS_QUERY);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6 border-t border-border pt-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Latest posts
        </h2>
        <Link
          href="/blog"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          All posts →
        </Link>
      </div>

      <ul className="flex flex-col gap-6">
        {posts.map((post) => (
          <li key={post._id} className="flex flex-col gap-1.5">
            <Link
              href={`/blog/${post.slug}`}
              className="font-heading text-lg font-medium tracking-tight text-foreground transition-colors hover:text-muted-foreground"
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
    </section>
  );
}
