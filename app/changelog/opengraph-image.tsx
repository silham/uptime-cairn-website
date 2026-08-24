import { ImageResponse } from "next/og";

import { getChangelog, latestRelease } from "@/lib/changelog";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFonts } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} changelog`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const { toc } = await getChangelog();
  const latest = latestRelease(toc);

  return new ImageResponse(
    (
      <OgCard
        eyebrow="Changelog"
        title="What changed, and whether it affects you."
        subtitle={
          latest
            ? `Every notable change, newest first. Latest release: ${latest}.`
            : "Every notable change to Uptime Cairn, newest first."
        }
      />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
