/* eslint-disable @next/next/no-img-element */
import { SITE_URL } from "@/lib/site";
import { allPosts } from "content-collections";
import { cn, formatDate } from "@/lib/utils";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { mdxComponents } from "@/mdx-components";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/site/section";
import { PostEngagement } from "@/components/blog/post-engagement";
import { Comments } from "@/components/blog/comments";
import { getSortedPosts, readingMinutes, slugOf, type Post } from "@/components/blog/posts";

// Frontmatter may carry a site-relative path or a full URL; metadata needs absolute.
function absoluteUrl(src: string) {
  return src.startsWith("http") ? src : `${SITE_URL}${src}`;
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: slugOf(post) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = allPosts.find((p) => slugOf(p) === slug);

  if (!post) {
    return undefined;
  }

  const { title, publishedAt: publishedTime, summary: description, image } = post;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${SITE_URL}/blog/${slug}`,
      ...(image && {
        images: [
          {
            url: absoluteUrl(image),
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && {
        images: [absoluteUrl(image)],
      }),
    },
  };
}

function NeighborLink({
  post,
  label,
  align,
  wide,
}: {
  post: Post;
  label: string;
  align: "left" | "right";
  wide: boolean;
}) {
  return (
    <Link
      href={`/blog/${slugOf(post)}`}
      className={cn(
        "flex flex-col gap-1 bg-background px-5 py-5 transition-colors hover:bg-panel focus-visible:-outline-offset-2 sm:px-8",
        align === "right" && !wide && "sm:items-end sm:text-right",
        wide && "sm:col-span-2"
      )}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-pretty font-medium leading-snug text-foreground">{post.title}</span>
    </Link>
  );
}

export default async function Blog({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const sortedPosts = getSortedPosts();
  const currentIndex = sortedPosts.findIndex((p) => slugOf(p) === slug);
  const post = sortedPosts[currentIndex];

  if (!post) {
    notFound();
  }

  // newest first, so the neighbour above in the list is the newer post
  const newerPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const olderPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  const author = post.author ?? DATA.name;
  const minutes = readingMinutes(post.content);
  const updated = post.updatedAt && post.updatedAt !== post.publishedAt ? post.updatedAt : null;

  const jsonLdContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    description: post.summary,
    image: post.image
      ? absoluteUrl(post.image)
      : `${SITE_URL}/blog/${slug}/opengraph-image`,
    url: `${SITE_URL}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: author,
    },
  }).replace(/</g, "\\u003c");

  return (
    <main data-bleed>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: jsonLdContent,
        }}
      />
      <article>
        <header className="px-5 pt-2 sm:px-8">
          <Link
            href="/blog"
            className="group -ml-1 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              aria-hidden
              className="size-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
            />
            All writing
          </Link>
          <h1 className="mt-8 text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:mt-10 sm:text-[2.5rem]">
            {post.title}
          </h1>
          {post.summary && (
            <p className="mt-4 max-w-[62ch] text-pretty text-[1.0625rem] leading-relaxed text-muted-foreground">
              {post.summary}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {author === DATA.name && (
              <img src={DATA.avatarUrl} alt="" className="mr-0.5 size-6 rounded-full object-cover" />
            )}
            <span className="font-medium text-foreground">{author}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>{minutes} min read</span>
            {updated && (
              <>
                <span aria-hidden>·</span>
                <span>
                  Updated <time dateTime={updated}>{formatDate(updated)}</time>
                </span>
              </>
            )}
          </div>
        </header>

        {post.image ? (
          <div className="mt-8 border-y border-border bg-panel">
            <img
              src={post.image}
              alt=""
              fetchPriority="high"
              className="block aspect-[1200/630] w-full object-cover"
            />
          </div>
        ) : (
          <hr className="mt-8 border-border" />
        )}

        <div className="prose px-5 pt-10 sm:px-8 sm:pt-12">
          <MDXContent code={post.mdx} components={mdxComponents} />
        </div>
      </article>

      <PostEngagement slug={slug} />

      <Comments slug={slug} />

      {(olderPost || newerPost) && (
        <Section id="keep-reading" label="Keep reading">
          <nav
            aria-label="More posts"
            className="grid gap-px border-b border-border bg-border sm:grid-cols-2"
          >
            {olderPost && (
              <NeighborLink post={olderPost} label="Older" align="left" wide={!newerPost} />
            )}
            {newerPost && (
              <NeighborLink post={newerPost} label="Newer" align="right" wide={!olderPost} />
            )}
          </nav>
        </Section>
      )}
    </main>
  );
}
