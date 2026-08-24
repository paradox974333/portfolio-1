"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type Comment = {
  id: number;
  author: string;
  body: string;
  created_at: string;
};

const MAX_BODY = 2000;

export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/blog/${slug}/comments`)
      .then((res) => res.json())
      .then((data) => active && setComments(data.comments ?? []))
      .catch(() => active && setComments([]));
    return () => {
      active = false;
    };
  }, [slug]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, body, website }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("idle");
        return;
      }

      setStatus("sent");
      setAuthor("");
      setBody("");
    } catch {
      setError("Network error. Try again.");
      setStatus("idle");
    }
  }

  return (
    <section className="mt-12 max-w-2xl" aria-labelledby="comments-heading">
      <h2
        id="comments-heading"
        className="flex items-center gap-2 text-lg font-semibold tracking-tight"
      >
        <MessageSquare className="size-4 text-muted-foreground" aria-hidden />
        Comments
        {comments !== null && comments.length > 0 && (
          <span className="rounded-md border border-border bg-card px-2 py-0.5 text-sm font-normal text-muted-foreground">
            {comments.length}
          </span>
        )}
      </h2>

      {comments === null ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      ) : comments.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No comments yet. Be the first.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-sm font-medium">{comment.author}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              {/* Rendered as plain text — never as HTML or markdown. */}
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {comment.body}
              </p>
            </li>
          ))}
        </ul>
      )}

      {status === "sent" ? (
        <div className="mt-8 rounded-lg border border-border bg-accent/30 p-4 text-sm">
          <p className="font-medium">Thanks — your comment is in the queue.</p>
          <p className="mt-1 text-muted-foreground">
            It appears here once it&apos;s approved.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="comment-author" className="text-sm font-medium">
              Name
            </label>
            <input
              id="comment-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              maxLength={60}
              autoComplete="name"
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="comment-body" className="text-sm font-medium">
              Comment
            </label>
            <textarea
              id="comment-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={4}
              maxLength={MAX_BODY}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <span className="self-end text-xs text-muted-foreground tabular-nums">
              {body.length}/{MAX_BODY}
            </span>
          </div>

          {/* Honeypot — hidden from people, irresistible to bots. */}
          <div className="absolute left-[-9999px]" aria-hidden>
            <label htmlFor="comment-website">Website</label>
            <input
              id="comment-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" disabled={status === "sending"}>
              {status === "sending" ? "Posting…" : "Post comment"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Reviewed before it goes live.
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
