import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { COMMENT_LIMITS, hashIp, isKnownSlug } from "@/lib/engagement";

type Ctx = { params: Promise<{ slug: string }> };

/** Approved comments only. Pending ones are never exposed publicly. */
export async function GET(_request: Request, { params }: Ctx) {
  const { slug } = await params;

  if (!isKnownSlug(slug)) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ comments: [], unavailable: true });
  }

  try {
    const rows = await db()`
      select id::int as id, author, body, created_at
      from comments
      where slug = ${slug} and approved = true
      order by created_at asc
      limit 200
    `;
    return NextResponse.json({ comments: rows });
  } catch (error) {
    console.error("[comments:get] failed", error);
    return NextResponse.json({ comments: [], unavailable: true });
  }
}

export async function POST(request: Request, { params }: Ctx) {
  const { slug } = await params;

  if (!isKnownSlug(slug)) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Comments are not available right now." },
      { status: 503 }
    );
  }

  let payload: { author?: unknown; body?: unknown; website?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never see this field, bots fill it in.
  if (typeof payload.website === "string" && payload.website.length > 0) {
    return NextResponse.json({ ok: true, pending: true });
  }

  const author = typeof payload.author === "string" ? payload.author.trim() : "";
  const body = typeof payload.body === "string" ? payload.body.trim() : "";

  if (
    author.length < COMMENT_LIMITS.author.min ||
    author.length > COMMENT_LIMITS.author.max
  ) {
    return NextResponse.json(
      { error: `Name must be 1–${COMMENT_LIMITS.author.max} characters.` },
      { status: 400 }
    );
  }
  if (
    body.length < COMMENT_LIMITS.body.min ||
    body.length > COMMENT_LIMITS.body.max
  ) {
    return NextResponse.json(
      { error: `Comment must be 2–${COMMENT_LIMITS.body.max} characters.` },
      { status: 400 }
    );
  }

  const sql = db();
  const ipHash = hashIp(request);

  try {
    const [recent] = await sql`
      select count(*)::int as n
      from comments
      where ip_hash = ${ipHash} and created_at > now() - interval '1 hour'
    `;

    if ((recent?.n ?? 0) >= COMMENT_LIMITS.perHour) {
      return NextResponse.json(
        { error: "You've posted a few times already. Try again in an hour." },
        { status: 429 }
      );
    }

    await sql`
      insert into comments (slug, author, body, ip_hash)
      values (${slug}, ${author}, ${body}, ${ipHash})
    `;

    return NextResponse.json({ ok: true, pending: true });
  } catch (error) {
    console.error("[comments:post] failed", error);
    return NextResponse.json(
      { error: "Could not save your comment. Try again." },
      { status: 503 }
    );
  }
}
