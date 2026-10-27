import { allPosts } from "content-collections";

export type Post = (typeof allPosts)[number];

export const slugOf = (post: Post) => post._meta.path.replace(/\.mdx$/, "");

/** Newest first. */
export function getSortedPosts() {
  return [...allPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

const WORDS_PER_MINUTE = 230;
// Code is skimmed, not read word by word, so it counts for less.
const CODE_WEIGHT = 0.4;

/** Minutes to read, estimated from the raw MDX source. */
export function readingMinutes(source: string) {
  let codeWords = 0;
  const prose = source.replace(/```[\s\S]*?```/g, (block) => {
    codeWords += block.split(/\s+/).filter(Boolean).length;
    return " ";
  });
  const proseWords = prose
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
  return Math.max(1, Math.round((proseWords + codeWords * CODE_WEIGHT) / WORDS_PER_MINUTE));
}

export function shortDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
