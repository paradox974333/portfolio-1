import { createHash, randomUUID } from "crypto";
import { cookies } from "next/headers";
import { allPosts } from "content-collections";

const VISITOR_COOKIE = "vid";
const TWO_YEARS = 60 * 60 * 24 * 730;

/** Only slugs that correspond to a real post may be written to the database. */
export function isKnownSlug(slug: string) {
  return allPosts.some((p) => p._meta.path.replace(/\.mdx$/, "") === slug);
}

/**
 * Stable anonymous identity for like/view dedupe. httpOnly so client script
 * can't read or spoof it; contains no personal data.
 */
export async function ensureVisitorId() {
  const store = await cookies();
  const existing = store.get(VISITOR_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(VISITOR_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TWO_YEARS,
  });
  return id;
}

export async function readVisitorId() {
  const store = await cookies();
  return store.get(VISITOR_COOKIE)?.value ?? null;
}

/** Hashed so raw IPs are never stored. Used only for comment rate limiting. */
export function hashIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return createHash("sha256")
    .update(`${ip}:${process.env.ENGAGEMENT_SALT ?? "portfolio"}`)
    .digest("hex")
    .slice(0, 32);
}

export const COMMENT_LIMITS = {
  author: { min: 1, max: 60 },
  body: { min: 2, max: 2000 },
  perHour: 3,
} as const;
