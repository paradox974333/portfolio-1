"use client";

import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatCount } from "./view-count";

type Snapshot = {
  views: number;
  likes: number;
  liked: boolean;
};

/**
 * The sign-off row under a post: views and a like toggle. Registers the view
 * on mount; renders nothing when the engagement store is offline.
 */
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

    // Optimistic: the button should never feel laggy.
    const previous = state;
    setState({
      ...state,
      liked: !state.liked,
      likes: state.likes + (state.liked ? -1 : 1),
    });

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

  const liked = state?.liked ?? false;

  return (
    <div className="mt-16 flex items-center justify-between gap-4 border-y border-border px-5 py-3 sm:px-8">
      <p className="font-serif text-[1.25rem] italic leading-tight">Thanks for reading</p>
      <div className="flex items-center gap-3">
        <span
          className="text-xs tabular-nums text-muted-foreground"
          title={state ? `${state.views.toLocaleString("en-US")} views` : undefined}
        >
          {state ? `${formatCount(state.views)} ${state.views === 1 ? "view" : "views"}` : " "}
        </span>
        <button
          type="button"
          onClick={toggleLike}
          disabled={!state || pending}
          aria-pressed={liked}
          aria-label={
            state
              ? `${liked ? "Liked" : "Like this post"}, ${state.likes} ${state.likes === 1 ? "like" : "likes"}`
              : "Like this post"
          }
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-panel px-3 text-[0.8125rem] font-medium text-muted-foreground transition-colors",
            "hover:text-foreground disabled:cursor-default",
            !state && "opacity-60",
            liked && "border-signal/30 bg-signal/10 text-signal hover:text-signal"
          )}
        >
          <Heart
            aria-hidden
            className={cn(
              "size-3.5 transition-transform duration-200 motion-reduce:transition-none",
              liked && "scale-110 fill-current"
            )}
          />
          <span className="min-w-[1ch] tabular-nums">{state ? formatCount(state.likes) : "–"}</span>
        </button>
      </div>
    </div>
  );
}
