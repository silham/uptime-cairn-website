import { ImageResponse } from "next/og";

import { MARKDOWN_ENTRIES, entryBySlug, groupOf } from "@/lib/docs-manifest";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFonts } from "@/lib/og";

export const alt = "Uptime Cairn documentation";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Must match the page's, or Next cannot prerender the card alongside it. */
export function generateStaticParams() {
  return MARKDOWN_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = entryBySlug(slug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow={groupOf(slug)?.title ?? "Documentation"}
        title={entry?.title ?? "Documentation"}
        subtitle={entry?.description}
      />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
