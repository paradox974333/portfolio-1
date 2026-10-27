import { formatDate } from "@/lib/utils";
import { allPosts } from "content-collections";
import Link from "next/link";

const LIMIT = 4;

export function WritingList() {
  const posts = [...allPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div>
      <ul>
        {posts.slice(0, LIMIT).map((post) => {
          const slug = post._meta.path.replace(/\.mdx$/, "");
          return (
            <li key={slug} className="border-b border-border last:border-b-0">
              <Link
                href={`/blog/${slug}`}
                className="group flex items-baseline gap-4 px-5 py-3.5 transition-colors hover:bg-panel focus-visible:bg-panel focus-visible:-outline-offset-2 sm:px-8"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9375rem] font-medium text-foreground">{post.title}</span>
                  <span className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                    {post.summary}
                  </span>
                </span>
                <time
                  dateTime={post.publishedAt}
                  className="hidden flex-none text-xs tabular-nums text-muted-foreground sm:block"
                >
                  {formatDate(post.publishedAt)}
                </time>
              </Link>
            </li>
          );
        })}
      </ul>
      {posts.length > LIMIT && (
        <Link
          href="/blog"
          className="block border-t border-border py-3 text-center text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:-outline-offset-2"
        >
          All {posts.length} posts
        </Link>
      )}
    </div>
  );
}
