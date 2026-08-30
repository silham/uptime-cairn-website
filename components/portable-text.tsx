import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Link from "next/link";

import { SanityImage } from "./sanity-image";
import type { PreparedBlock } from "@/lib/blog";
import type { CodeBlock, FigureBlock } from "@/lib/sanity/types";

/**
 * Portable Text, painted with `.prose-doc`.
 *
 * The blog and the documentation share one set of prose styles on purpose: a
 * code fence, a table rule and a heading anchor look identical whether they
 * came from a markdown file in the product repo or from the Studio, and there
 * is exactly one place to change any of them.
 *
 * Nothing in here is async. The two things that would have to be — Shiki
 * highlighting and heading-anchor allocation — are done ahead of time by
 * `prepareBody` in lib/blog.ts, so this file is a pure serializer.
 */

/** Matches the anchor rehype-autolink-headings appends in the docs pipeline. */
function HeadingAnchor({ id }: { id: string }) {
  return (
    <a href={`#${id}`} className="heading-anchor" aria-label="Link to this section">
      <span>#</span>
    </a>
  );
}

const components: PortableTextComponents = {
  block: {
    h2: ({ value, children }) => {
      const id = (value as PreparedBlock)._headingId;
      return (
        <h2 id={id}>
          {children}
          {id ? <HeadingAnchor id={id} /> : null}
        </h2>
      );
    },
    h3: ({ value, children }) => {
      const id = (value as PreparedBlock)._headingId;
      return (
        <h3 id={id}>
          {children}
          {id ? <HeadingAnchor id={id} /> : null}
        </h3>
      );
    },
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>,
  },

  marks: {
    code: ({ children }) => <code>{children}</code>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? "";
      // Internal links stay client-side; the `::after` arrow in globals.css
      // keys off target="_blank", so an outbound link is marked by having one
      // rather than by an extra node in the prose.
      if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
      return (
        <a href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    },
  },

  types: {
    /* Shiki output, both themes baked in as CSS custom properties. It came
       from lib/highlight.ts on the server, not from the document. */
    codeBlock: ({ value }) => {
      const block = value as CodeBlock & { _html?: string };
      if (!block._html) return null;
      return (
        <div>
          {block.filename ? (
            <p className="mb-2 font-mono text-[13px] text-muted">{block.filename}</p>
          ) : null}
          <div dangerouslySetInnerHTML={{ __html: block._html }} />
        </div>
      );
    },

    figure: ({ value }) => {
      const image = value as FigureBlock;
      return (
        <figure>
          <SanityImage
            image={image}
            width={880}
            alt={image.alt ?? ""}
            sizes="(min-width: 1024px) 704px, 100vw"
            className="w-full rounded-lg border border-line"
          />
          {image.caption ? (
            <figcaption className="mt-3 text-[14px] text-muted">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },

  /* Unknown types are a schema change that shipped without a renderer. In
     development that should be loud; in production a reader should never see
     a stack trace where a paragraph was meant to be. */
  unknownType: ({ value }) => {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        `No renderer for Portable Text type "${(value as { _type?: string })._type}". ` +
          "Add one in components/portable-text.tsx.",
      );
    }
    return null;
  },
};

export function PostBody({ blocks }: { blocks: PreparedBlock[] }) {
  return (
    <div className="prose-doc">
      <PortableText value={blocks} components={components} />
    </div>
  );
}
