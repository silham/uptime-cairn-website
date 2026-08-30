import type { MetadataRoute } from "next";

import { getCategories, getPosts } from "@/lib/blog";
import { DOC_ENTRIES } from "@/lib/docs-manifest";
import { SITE } from "@/lib/site";

/* Regenerated on the same window as the blog routes, so a post published
   between deploys reaches the sitemap without one. */
export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  return [
    { url: SITE.url, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/docs`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/changelog`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...DOC_ENTRIES.map((entry) => ({
      url: `${SITE.url}/docs/${entry.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    /* The blog is omitted entirely when there is nothing in it: an unconfigured
       or empty checkout should not advertise /blog to a crawler. */
    ...(posts.length > 0
      ? [
          {
            url: `${SITE.url}/blog`,
            lastModified,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          },
        ]
      : []),
    ...posts.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      // A post's own dates, not the build's — this is the one part of the
      // sitemap where lastModified is a fact rather than a formality.
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...categories.map((category) => ({
      url: `${SITE.url}/blog/category/${category.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
