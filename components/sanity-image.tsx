import Image from "next/image";

import { imageUrl } from "@/lib/sanity/image";
import type { SanityImage as SanityImageType } from "@/lib/sanity/types";

/**
 * A Sanity asset, rendered through next/image but not re-optimised.
 *
 * `unoptimized` is deliberate. Sanity's own CDN already did the resize and the
 * format negotiation (`auto=format` in lib/sanity/image.ts), so routing the
 * result through Next's optimiser would add a serverless invocation per image
 * to a site that is otherwise entirely static, in exchange for nothing.
 *
 * next/image is still worth using for the rest of what it does: the intrinsic
 * width and height reserve the box before the bytes arrive, which is the whole
 * of the layout shift on a page whose first element is a wide cover image.
 */
export function SanityImage({
  image,
  width,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  image: SanityImageType;
  /** Rendered width in CSS pixels; the CDN is asked for twice this. */
  width: number;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const src = imageUrl(image, width * 2);
  if (!src) return null;

  const ratio = image.aspectRatio && image.aspectRatio > 0 ? image.aspectRatio : 16 / 9;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={Math.round(width / ratio)}
      sizes={sizes}
      priority={priority}
      unoptimized
      // Sanity ships a base64 LQIP in the asset metadata, so the placeholder
      // costs one extra field on the query rather than a build-time blur pass.
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip}
      className={className}
    />
  );
}
