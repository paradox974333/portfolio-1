import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { ensureVisitorId, isKnownSlug } from "@/lib/engagement";

type Ctx = { params: Promise<{ slug: string }> };

/** Toggles this visitor's like and returns the new count. */
export async function POST(_request: Request, { params }: Ctx) {
  const { slug } = await params;

  if (!isKnownSlug(slug)) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const sql = db();
  const visitorId = await ensureVisitorId();

  try {
    const removed = await sql`
      delete from post_likes
      where slug = ${slug} and visitor_id = ${visitorId}
      returning 1 as deleted
    `;

    if (removed.length === 0) {
      await sql`
        insert into post_likes (slug, visitor_id)
        values (${slug}, ${visitorId})
        on conflict do nothing
      `;
    }

    const [row] = await sql`
      select count(*)::int as likes from post_likes where slug = ${slug}
    `;

    return NextResponse.json({
      likes: row?.likes ?? 0,
      liked: removed.length === 0,
    });
  } catch (error) {
    console.error("[like] failed", error);
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
}
