"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Section } from "@/components/site/section";
import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";

type Comment = {
  id: number;
  author: string;
  body: string;
  created_at: string;
};

const MAX_BODY = 2000;

const field =
  "w-full rounded-md border border-border bg-background px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 hover:border-muted-foreground/40 focus-visible:border-signal focus-visible:outline-offset-0";

const rowText = "px-5 py-5 text-sm leading-relaxed text-muted-foreground sm:px-8";

export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [offline, setOffline] = useState(false);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/blog/${slug}/comments`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setComments(data.comments ?? []);
        setOffline(Boolean(data.unavailable));
      })
      .catch(() => {
        if (!active) return;
        setComments([]);
        setOffline(true);
      });
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
        setError(data.error ?? "Something went wrong. Try again in a minute.");
        setStatus("idle");
        return;
      }

      setStatus("sent");
      setAuthor("");
      setBody("");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setStatus("idle");
    }
  }

  const count = comments?.length ?? 0;

  return (
    <Section
      id="comments"
      label="Comments"
      aside={count > 0 ? `${count} ${count === 1 ? "comment" : "comments"}` : undefined}
    >
      {comments === null ? (
        <p className={rowText} aria-live="polite">
          Loading comments…
        </p>
      ) : offline ? (
        <p className={rowText}>
          Comments are offline right now. If something in this post was useful or wrong,{" "}
          <a
            href={`mailto:${DATA.contact.email}`}
            className="text-signal underline decoration-signal/40 decoration-[1.5px] underline-offset-[3px] transition-colors hover:decoration-signal"
          >
            email me
          </a>
          .
        </p>
      ) : (
        <>
          {count === 0 ? (
            <p className={`${rowText} border-b border-border`}>No comments yet. Start the conversation below.</p>
          ) : (
            <ul>
              {comments.map((comment) => (
                <li key={comment.id} className="border-b border-border px-5 py-4 sm:px-8">
                  <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-sm font-medium text-foreground">{comment.author}</span>
                    <time dateTime={comment.created_at} className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </time>
                  </p>
                  {/* Rendered as plain text, never as HTML or markdown. */}
                  <p className="mt-1.5 max-w-[68ch] whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
                    {comment.body}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {status === "sent" ? (
            <div className="flex gap-3 px-5 py-5 sm:px-8" role="status">
              <Check aria-hidden className="mt-0.5 size-4 flex-none text-signal" />
              <div className="text-sm leading-relaxed">
                <p className="font-medium text-foreground">Thanks, your comment is in the queue.</p>
                <p className="text-muted-foreground">It shows up here once I&apos;ve approved it.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="relative flex flex-col gap-4 px-5 py-6 sm:px-8">
              <div className="flex flex-col gap-1.5 sm:max-w-xs">
                <label htmlFor="comment-author" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="comment-author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  maxLength={60}
                  autoComplete="name"
                  className={`${field} h-9`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="comment-body" className="text-sm font-medium text-foreground">
                    Comment
                  </label>
                  <span className="text-xs tabular-nums text-muted-foreground" aria-hidden>
                    {body.length}/{MAX_BODY}
                  </span>
                </div>
                <textarea
                  id="comment-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  rows={4}
                  maxLength={MAX_BODY}
                  className={`${field} min-h-24 resize-y py-2 leading-relaxed`}
                />
              </div>

              {/* Honeypot: hidden from people, irresistible to bots. */}
              <div className="absolute -left-[9999px] size-px overflow-hidden" aria-hidden>
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

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="h-8 rounded-full bg-foreground px-4 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "sending" ? "Posting…" : "Post comment"}
                </button>
                <p className="text-xs text-muted-foreground">I read every comment before it goes live.</p>
              </div>
            </form>
          )}
        </>
      )}
    </Section>
  );
}
