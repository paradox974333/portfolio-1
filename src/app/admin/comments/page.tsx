import type { Metadata } from "next";
import { db, isDbConfigured } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  approveComment,
  deleteComment,
  login,
  logout,
  unapproveComment,
} from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Moderation",
  robots: { index: false, follow: false },
};

type Row = {
  id: number;
  slug: string;
  author: string;
  body: string;
  approved: boolean;
  created_at: string;
};

function CommentCard({ row }: { row: Row }) {
  return (
    <li className="rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-sm font-medium">{row.author}</span>
        <span className="text-xs text-muted-foreground">
          {formatDate(row.created_at)} · {row.slug}
        </span>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
        {row.body}
      </p>
      <div className="mt-3 flex gap-2">
        {row.approved ? (
          <form action={unapproveComment}>
            <input type="hidden" name="id" value={row.id} />
            <Button type="submit" size="sm" variant="outline">
              Hide
            </Button>
          </form>
        ) : (
          <form action={approveComment}>
            <input type="hidden" name="id" value={row.id} />
            <Button type="submit" size="sm">
              Approve
            </Button>
          </form>
        )}
        <form action={deleteComment}>
          <input type="hidden" name="id" value={row.id} />
          <Button type="submit" size="sm" variant="destructive">
            Delete
          </Button>
        </form>
      </div>
    </li>
  );
}

export default async function ModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (!(await isAdmin())) {
    return (
      <section className="max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Moderation</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the admin token to review comments.
        </p>
        <form action={login} className="mt-6 flex flex-col gap-3">
          <input
            type="password"
            name="token"
            required
            autoComplete="current-password"
            placeholder="Admin token"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {error && (
            <p className="text-sm text-destructive">Incorrect token.</p>
          )}
          <Button type="submit" size="sm" className="self-start">
            Sign in
          </Button>
        </form>
      </section>
    );
  }

  if (!isDbConfigured()) {
    return (
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Moderation</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          DATABASE_URL is not set, so there is nothing to moderate.
        </p>
      </section>
    );
  }

  const rows = (await db()`
    select id::int as id, slug, author, body, approved, created_at
    from comments
    order by approved asc, created_at desc
    limit 500
  `) as unknown as Row[];

  const pending = rows.filter((r) => !r.approved);
  const approved = rows.filter((r) => r.approved);

  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Moderation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pending.length} pending · {approved.length} published
          </p>
        </div>
        <form action={logout}>
          <Button type="submit" size="sm" variant="outline">
            Sign out
          </Button>
        </form>
      </div>

      <h2 className="mt-10 text-lg font-semibold tracking-tight">Pending</h2>
      {pending.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Queue is empty.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {pending.map((row) => (
            <CommentCard key={row.id} row={row} />
          ))}
        </ul>
      )}

      <h2 className="mt-10 text-lg font-semibold tracking-tight">Published</h2>
      {approved.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Nothing published yet.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {approved.map((row) => (
            <CommentCard key={row.id} row={row} />
          ))}
        </ul>
      )}
    </section>
  );
}
