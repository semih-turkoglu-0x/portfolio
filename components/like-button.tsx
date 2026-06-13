"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VISITOR_KEY = "blog-visitor-id";

// A stable, anonymous id per browser. Lets one visitor like a post once without
// requiring accounts. It's not tamper-proof — the server also rate-limits by IP.
function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  // Load the live count after mount, so the surrounding page stays static.
  useEffect(() => {
    let active = true;
    fetch(`/api/likes/${slug}?v=${getVisitorId()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (typeof data.count === "number") setCount(data.count);
        setLiked(Boolean(data.liked));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [slug]);

  async function toggle() {
    if (pending || count === null) return;
    setPending(true);

    const previous = { count, liked };
    const nextLiked = !liked;
    setLiked(nextLiked); // optimistic
    setCount(count + (nextLiked ? 1 : -1));

    try {
      const res = await fetch(`/api/likes/${slug}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ visitorId: getVisitorId() }),
      });
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      if (typeof data.count === "number") setCount(data.count);
      setLiked(Boolean(data.liked));
    } catch {
      setCount(previous.count); // roll back on failure
      setLiked(previous.liked);
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggle}
      disabled={pending || count === null}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this post" : "Like this post"}
      className="gap-1.5"
    >
      <Heart
        className={cn(
          "transition-colors",
          liked ? "fill-red-500 text-red-500" : "text-muted-foreground",
        )}
      />
      <span className="tabular-nums">{count ?? "–"}</span>
    </Button>
  );
}
