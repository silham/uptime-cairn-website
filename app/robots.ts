import type { MetadataRoute } from "next";

import { STUDIO_BASE_PATH } from "@/lib/sanity/env";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The Studio is an editing tool behind Sanity's own login; it has no
    // business in an index. The route also sets `robots: noindex` in its
    // metadata, because a disallowed page can still be indexed from a link.
    rules: [{ userAgent: "*", allow: "/", disallow: STUDIO_BASE_PATH }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
