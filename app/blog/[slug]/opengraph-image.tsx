import { ImageResponse } from "next/og";

import { getPost, getPostSlugs } from "@/lib/blog";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFonts } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} blog post`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Must match the page's, or Next cannot prerender the card alongside it. */
export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * The card is generated from the post's own title and excerpt rather than from
 * its cover image. A cover is optional and often decorative; the title and the
 * one-sentence excerpt are both required by the schema, so every post gets a
 * card that says what the post is.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return new ImageResponse(
    (
      <OgCard eyebrow="Blog" title={post?.title ?? "Blog"} subtitle={post?.excerpt} />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
