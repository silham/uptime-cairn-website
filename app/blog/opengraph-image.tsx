import { ImageResponse } from "next/og";

import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFonts } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} blog`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Blog"
        title="What we learned keeping things up."
        subtitle="Notes on monitoring, on running it yourself, and on the decisions behind Uptime Cairn."
      />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
