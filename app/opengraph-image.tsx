import { ImageResponse } from "next/og";

import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFonts } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — self-hosted uptime monitoring and status pages`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Open source uptime monitoring"
        title="Tells you when your servers go down."
        subtitle="One Docker container, one file of data, no database server to set up."
      />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
