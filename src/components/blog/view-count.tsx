"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

/**
 * Shared across every list item so the index issues exactly one request
 * regardless of how many posts it renders.
 */
let statsPromise: Promise<Record<string, number>> | null = null;

function loadStats() {
  if (!statsPromise) {
    statsPromise = fetch("/api/blog/stats")
      .then((res) => res.json())
      .then((data) => (data.views ?? {}) as Record<string, number>)
      .catch(() => ({}));
  }
  return statsPromise;
}

export function ViewCount({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    loadStats().then((stats) => active && setViews(stats[slug] ?? 0));
    return () => {
      active = false;
    };
  }, [slug]);

  if (views === null) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Eye className="size-3" aria-hidden />
      <span className="tabular-nums">{views.toLocaleString("en-US")}</span>
      <span className="sr-only">views</span>
    </span>
  );
}
