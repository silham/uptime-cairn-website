import { ImageResponse } from "next/og";

import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFonts } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} documentation`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Documentation"
        title="Everything you need to run it."
        subtitle="Install, first monitor, the nine monitor types, alerting, and the API."
      />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
