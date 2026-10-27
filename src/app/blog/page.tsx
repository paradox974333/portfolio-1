/* eslint-disable @next/next/no-img-element */
import { getSortedPosts, readingMinutes, shortDate, slugOf } from "@/components/blog/posts";
import { ViewCount } from "@/components/blog/view-count";
import { normalizePage, paginate } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

const DESCRIPTION =
  "Notes on building AI agents: the loop, the tools, the context, and what breaks in production.";

export const metadata: Metadata = {
  title: "Writing",
  description: DESCRIPTION,
  openGraph: {
    title: "Writing",
    url: "/blog",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing",
    description: DESCRIPTION,
  },
};

const PAGE_SIZE = 6;

const pill =
  "inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-border bg-panel px-3 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:text-foreground";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;

  const sortedPosts = getSortedPosts();
  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
  const currentPage = normalizePage(pageParam, totalPages);
  const { items: posts, pagination } = paginate(sortedPosts, {
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const pageHref = (page: number) => (page === 1 ? "/blog" : `/blog?page=${page}`);

  return (
    <main data-bleed>
      <header className="mt-2 border-y border-border bg-panel">
        <div className="flex items-baseline justify-between gap-4 px-5 py-3 sm:px-8">
          <h1 className="font-serif text-[1.75rem] italic leading-tight">Writing</h1>
          {sortedPosts.length > 0 && (
            <p className="text-xs tabular-nums text-muted-foreground">
              {sortedPosts.length} {sortedPosts.length === 1 ? "post" : "posts"}
            </p>
          )}
        </div>
      </header>
      <p className="max-w-[60ch] px-5 pb-6 pt-5 text-[0.9375rem] leading-relaxed text-muted-foreground sm:px-8">
        {DESCRIPTION}
      </p>

      {posts.length > 0 ? (
        <>
          <ul className="border-t border-border">
            {posts.map((post) => {
              const slug = slugOf(post);
              return (
                <li key={slug} className="border-b border-border">
                  <Link
                    href={`/blog/${slug}`}
                    className="group flex items-start gap-6 px-5 py-5 transition-colors hover:bg-panel focus-visible:-outline-offset-2 sm:px-8"
                  >
                    <div className="min-w-0 flex-1">
                      <h2 className="text-pretty text-[1.0625rem] font-semibold leading-snug tracking-tight text-foreground">
                        {post.title}
                      </h2>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:line-clamp-1">
                        {post.summary}
                      </p>
                      <p className="mt-3 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                        <time dateTime={post.publishedAt} className="tabular-nums">
                          {shortDate(post.publishedAt)}
                        </time>
                        <span aria-hidden>·</span>
                        <span>{readingMinutes(post.content)} min read</span>
                        <ViewCount slug={slug} />
                      </p>
                    </div>
                    {post.image && (
                      <img
                        src={post.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="hidden aspect-[1200/630] w-36 flex-none rounded-md border border-border object-cover transition-colors group-hover:border-muted-foreground/40 sm:block"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {pagination.totalPages > 1 && (
            <nav
              aria-label="Pages"
              className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 sm:px-8"
            >
              <p className="text-xs tabular-nums text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex items-center gap-1.5">
                {pagination.hasPreviousPage ? (
                  <Link href={pageHref(pagination.page - 1)} rel="prev" className={pill}>
                    Previous
                  </Link>
                ) : (
                  <span aria-disabled className={cn(pill, "pointer-events-none opacity-40")}>
                    Previous
                  </span>
                )}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <Link
                    key={page}
                    href={pageHref(page)}
                    aria-label={`Page ${page}`}
                    aria-current={page === pagination.page ? "page" : undefined}
                    className={cn(
                      pill,
                      "hidden px-0 tabular-nums sm:inline-flex",
                      page === pagination.page &&
                        "border-signal/30 bg-signal/10 text-signal hover:text-signal"
                    )}
                  >
                    {page}
                  </Link>
                ))}
                {pagination.hasNextPage ? (
                  <Link href={pageHref(pagination.page + 1)} rel="next" className={pill}>
                    Next
                  </Link>
                ) : (
                  <span aria-disabled className={cn(pill, "pointer-events-none opacity-40")}>
                    Next
                  </span>
                )}
              </div>
            </nav>
          )}
        </>
      ) : (
        <div className="border-y border-border px-5 py-14 text-center sm:px-8">
          <p className="font-serif text-[1.5rem] italic leading-tight">Nothing published yet</p>
          <p className="mx-auto mt-2 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
            The first post is still in draft. Until it lands, the home page shows what I&apos;m
            building right now.
          </p>
          <Link href="/#work" className={cn(pill, "mt-5")}>
            See current work
          </Link>
        </div>
      )}
    </main>
  );
}
