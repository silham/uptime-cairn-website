import { ImageResponse } from "next/og";

/**
 * Apple ignores SVG favicons, so the same tile is drawn again here as JSX and
 * prerendered to a PNG at build. Generating it beats committing a binary that
 * can silently fall out of step with app/icon.svg.
 *
 * The proportions are the product's own favicon.svg: a rounded tile in the
 * dashboard rail's ground, with the mark in the one green, keeping the logo's
 * 99:198:300 width ratio and its left alignment.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const stones = [44.55, 89.1, 135] as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 17,
          background: "#10141c",
          paddingLeft: 22,
        }}
      >
        {stones.map((width) => (
          <div
            key={width}
            style={{
              width,
              height: 34,
              borderRadius: 17,
              background: "#32d583",
            }}
          />
        ))}
      </div>
    ),
    size,
  );
}
