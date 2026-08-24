import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { ensureVisitorId, isKnownSlug } from "@/lib/engagement";

type Ctx = { params: Promise<{ slug: string }> };

/**
 * Registers a view and returns the full engagement snapshot for the post, so
 * the client needs a single request on mount rather than three.
 *
 * A visitor counts once per post per UTC day — reloads don't inflate the number.
 */
export async function POST(_request: Request, { params }: Ctx) {
  const { slug } = await params;

  if (!isKnownSlug(slug)) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ unavailable: true }, { status: 200 });
  }

  const sql = db();
  const visitorId = await ensureVisitorId();

  try {
    const firstToday = await sql`
      insert into post_views (slug, visitor_id)
      values (${slug}, ${visitorId})
      on conflict do nothing
      returning 1 as inserted
    `;

    let views: number;
    if (firstToday.length > 0) {
      const [row] = await sql`
        insert into post_stats (slug, views)
        values (${slug}, 1)
        on conflict (slug) do update set views = post_stats.views + 1
        returning views::int as views
      `;
      views = row?.views ?? 0;
    } else {
      const [row] = await sql`
        select views::int as views from post_stats where slug = ${slug}
      `;
      views = row?.views ?? 0;
    }

    const [likeRow] = await sql`
      select
        count(*)::int as likes,
        (count(*) filter (where visitor_id = ${visitorId}))::int as mine
      from post_likes
      where slug = ${slug}
    `;

    return NextResponse.json({
      views,
      likes: likeRow?.likes ?? 0,
      liked: (likeRow?.mine ?? 0) > 0,
    });
  } catch (error) {
    console.error("[view] failed", error);
    return NextResponse.json({ unavailable: true }, { status: 200 });
  }
}
