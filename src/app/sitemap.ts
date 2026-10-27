import type { MetadataRoute } from "next";
import { allPosts } from "content-collections";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts
    .map((post) => ({
      slug: post._meta.path.replace(/\.mdx$/, ""),
      modified: new Date(post.updatedAt ?? post.publishedAt),
    }))
    .sort((a, b) => b.modified.getTime() - a.modified.getTime());

  const latestPost = posts[0]?.modified;

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/blog`,
      ...(latestPost && { lastModified: latestPost }),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.modified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
