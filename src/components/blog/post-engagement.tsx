"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Snapshot = {
  views: number;
  likes: number;
  liked: boolean;
};

function formatCount(n: number) {
  return n >= 10000
    ? new Intl.NumberFormat("en", { notation: "compact" }).format(n)
    : n.toLocaleString("en-US");
}

export function PostEngagement({ slug }: { slug: string }) {
  const [state, setState] = useState<Snapshot | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [pending, setPending] = useState(false);
  const registered = useRef(false);

  useEffect(() => {
    // Strict Mode mounts twice in dev; the day-level dedupe would absorb it,
    // but there's no reason to send the request twice.
    if (registered.current) return;
    registered.current = true;

    let active = true;
    fetch(`/api/blog/${slug}/view`, { method: "POST" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (!active) return;
        if (data.unavailable) setUnavailable(true);
        else setState(data);
      })
      .catch(() => active && setUnavailable(true));

    return () => {
      active = false;
    };
  }, [slug]);

  async function toggleLike() {
    if (!state || pending) return;
    setPending(true);

    // Optimistic — the button should never feel laggy.
    const optimistic: Snapshot = {
      ...state,
      liked: !state.liked,
      likes: state.likes + (state.liked ? -1 : 1),
    };
    const previous = state;
    setState(optimistic);

    try {
      const res = await fetch(`/api/blog/${slug}/like`, { method: "POST" });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setState({ views: previous.views, likes: data.likes, liked: data.liked });
    } catch {
      setState(previous);
    } finally {
      setPending(false);
    }
  }

  if (unavailable) return null;

  const skeleton = state === null;

  return (
    <div className="mt-8 flex items-center gap-2">
      <button
        type="button"
        onClick={toggleLike}
        disabled={skeleton || pending}
        aria-pressed={state?.liked ?? false}
        aria-label={state?.liked ? "Remove like" : "Like this post"}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors",
          "hover:bg-accent/50 disabled:opacity-60",
          state?.liked && "border-red-500/40 bg-red-500/10 text-red-500"
        )}
      >
        <Heart
          className={cn("size-4 transition-transform", state?.liked && "fill-current scale-110")}
          aria-hidden
        />
        <span className="tabular-nums">
          {skeleton ? "—" : formatCount(state.likes)}
        </span>
      </button>

      <span
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground"
        title={skeleton ? undefined : `${state.views.toLocaleString("en-US")} views`}
      >
        <Eye className="size-4" aria-hidden />
        <span className="tabular-nums">
          {skeleton ? "—" : formatCount(state.views)}
        </span>
        <span className="sr-only">views</span>
      </span>
    </div>
  );
}
