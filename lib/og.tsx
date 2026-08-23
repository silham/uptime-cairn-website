import { readFile } from "node:fs/promises";
import path from "node:path";

import { SITE } from "./site";

/**
 * The shared Open Graph card.
 *
 * ImageResponse renders inline JSX and a subset of CSS through Satori — it
 * cannot load an SVG file, so the cairn mark is redrawn here as three rounded
 * divs. It is the same 99:198:300 width ratio and the same left alignment as
 * the artwork, which is all the mark actually is.
 *
 * The card is always dark. The site has two themes but a social preview has
 * one, and the product's own ground is the more recognisable of the two.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const GROUND = "#0d1017";
const GREEN = "#32d583";
const INK = "#f2f4f8";
const MUTED = "#8b93a3";
const LINE = "#232936";

export async function ogFonts() {
  const dir = path.join(process.cwd(), "assets");
  const [medium, semibold, mono] = await Promise.all([
    readFile(path.join(dir, "Geist-Medium.ttf")),
    readFile(path.join(dir, "Geist-SemiBold.ttf")),
    readFile(path.join(dir, "GeistMono-Regular.ttf")),
  ]);

  return [
    { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

function CairnMarkOg({ scale = 1 }: { scale?: number }) {
  // Widths in the artwork's 99:198:300 ratio, narrowest stone on top.
  const widths = [33, 66, 100].map((width) => width * scale);
  const height = 16 * scale;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 * scale }}>
      {widths.map((width) => (
        <div
          key={width}
          style={{
            width,
            height,
            borderRadius: height / 2,
            background: GREEN,
          }}
        />
      ))}
    </div>
  );
}

export function OgCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: GROUND,
        padding: 72,
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <CairnMarkOg scale={1} />
        <span style={{ fontSize: 30, fontWeight: 600, color: INK }}>
          {SITE.name}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow ? (
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: GREEN,
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </span>
        ) : null}
        <span
          style={{
            fontSize: title.length > 44 ? 62 : 74,
            fontWeight: 500,
            letterSpacing: -2,
            lineHeight: 1.08,
            color: INK,
          }}
        >
          {title}
        </span>
        {subtitle ? (
          <span
            style={{
              marginTop: 24,
              fontSize: 28,
              lineHeight: 1.4,
              color: MUTED,
            }}
          >
            {subtitle}
          </span>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          borderTop: `1px solid ${LINE}`,
          paddingTop: 28,
          fontFamily: "Geist Mono",
          fontSize: 22,
          color: MUTED,
        }}
      >
        <span>AGPL-3.0</span>
        <span>·</span>
        <span>self-hosted</span>
        <span>·</span>
        <span>uptimecairn.dev</span>
      </div>
    </div>
  );
}
