import { getPosts } from "@/lib/blog";
import { SITE } from "@/lib/site";

/**
 * A feed, because the audience for a self-hosted monitoring tool is the
 * audience that still reads feeds.
 *
 * Prerendered on the same window as the blog pages, so it is a static file on
 * the CDN rather than a function — `revalidate` here is what keeps this route
 * ● alongside the rest. Items carry the excerpt only: the body is Portable
 * Text, and serialising it to feed-safe HTML a second way is a second thing
 * that can disagree with the page.
 */
export const revalidate = 600;

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char]!);
}

export async function GET() {
  const posts = await getPosts();
  const updated = posts[0]?.publishedAt ?? new Date(0).toISOString();

  const items = posts
    .map((post) => {
      const url = `${SITE.url}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
${post.author ? `      <dc:creator>${escapeXml(post.author.name)}</dc:creator>\n` : ""}${(post.categories ?? [])
        .map((category) => `      <category>${escapeXml(category.title)}</category>\n`)
        .join("")}    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE.name)} blog</title>
    <link>${SITE.url}/blog</link>
    <description>${escapeXml(SITE.tagline)}</description>
    <language>en-GB</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE.url}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
