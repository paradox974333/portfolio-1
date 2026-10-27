"use client";

import { useEffect, useState } from "react";

/**
 * Shared across every list item so the index issues exactly one request
 * regardless of how many posts it renders.
 */
let statsPromise: Promise<Record<string, number>> | null = null;

function loadStats() {
  if (!statsPromise) {
    statsPromise = fetch("/api/blog/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { views?: Record<string, number> } | null) => data?.views ?? {})
      .catch(() => ({}));
  }
  return statsPromise;
}

export function formatCount(n: number) {
  return n >= 10000
    ? new Intl.NumberFormat("en", { notation: "compact" }).format(n)
    : n.toLocaleString("en-US");
}

/**
 * Renders " · 1,204 views" once the count is known. Nothing at all when the
 * stats store is offline or the post has no views yet, so the meta line never
 * shows a placeholder or a dangling separator.
 */
export function ViewCount({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    loadStats().then((stats) => {
      if (active && typeof stats[slug] === "number") setViews(stats[slug]);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (!views) return null;

  return (
    <>
      <span aria-hidden>·</span>
      <span className="tabular-nums">
        {formatCount(views)} {views === 1 ? "view" : "views"}
      </span>
    </>
  );
}
