import type { MetadataRoute } from "next";

import { DOC_ENTRIES } from "@/lib/docs-manifest";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE.url, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/docs`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...DOC_ENTRIES.map((entry) => ({
      url: `${SITE.url}/docs/${entry.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
