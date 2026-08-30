import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, isSanityConfigured, projectId } from "./env";

const builder = isSanityConfigured
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

/**
 * A CDN URL for a Sanity image at a given width.
 *
 * `auto("format")` is what turns these into AVIF or WebP for browsers that
 * accept them, which is why next/image is used unoptimized below — Sanity has
 * already done the resizing and the format negotiation, and running the result
 * through a second optimiser would only cost a function invocation.
 */
export function imageUrl(source: SanityImageSource, width: number, height?: number): string | null {
  if (!builder) return null;
  let image = builder.image(source).width(width).auto("format").fit("max");
  if (height !== undefined) image = image.height(height).fit("crop");
  return image.url();
}
