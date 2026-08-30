import "server-only";

import GithubSlugger from "github-slugger";
import { cache } from "react";

import { highlightCode } from "./highlight";
import type { TocItem } from "./markdown";
import { sanityFetch } from "./sanity/client";
import {
  CATEGORIES_QUERY,
  CATEGORY_QUERY,
  MORE_POSTS_QUERY,
  POSTS_QUERY,
  POST_QUERY,
  POST_SLUGS_QUERY,
} from "./sanity/queries";
import type {
  BodyBlock,
  CategoryPage,
  CategorySummary,
  CodeBlock,
  Post,
  PostCard,
} from "./sanity/types";

/*
 * The blog's server boundary.
 *
 * Everything a route needs is here, and nothing here is reachable from the
 * client — `server-only` is the same marker lib/docs.ts carries. Pages import
 * this; they never import the Sanity client directly.
 *
 * Each reader is wrapped in React's `cache`, because a post page fetches the
 * same document three times: once in `generateMetadata`, once in the body,
 * and once in `opengraph-image`. Without this that is three round trips per
 * page per build.
 */

export const getPosts = cache(
  (): Promise<PostCard[]> => sanityFetch<PostCard[]>(POSTS_QUERY, {}, []),
);

export const getPostSlugs = cache(
  (): Promise<string[]> => sanityFetch<string[]>(POST_SLUGS_QUERY, {}, []),
);

export const getPost = cache(
  (slug: string): Promise<Post | null> =>
    sanityFetch<Post | null>(POST_QUERY, { slug }, null),
);

export const getMorePosts = cache(
  (slug: string): Promise<PostCard[]> =>
    sanityFetch<PostCard[]>(MORE_POSTS_QUERY, { slug }, []),
);

export const getCategories = cache(
  (): Promise<CategorySummary[]> =>
    sanityFetch<CategorySummary[]>(CATEGORIES_QUERY, {}, []),
);

export const getCategory = cache(
  (slug: string): Promise<CategoryPage | null> =>
    sanityFetch<CategoryPage | null>(CATEGORY_QUERY, { slug }, null),
);

/* -------------------------------------------------------------------------- */
/* Body preparation                                                           */
/* -------------------------------------------------------------------------- */

/** A heading block, once it knows its own anchor. */
export type PreparedBlock = BodyBlock & {
  /** Set on h2 and h3 blocks; the anchor the contents rail links to. */
  _headingId?: string;
  /** Set on code blocks; Shiki output, already dual-themed. */
  _html?: string;
};

export type PreparedBody = {
  blocks: PreparedBlock[];
  toc: TocItem[];
  /** Plain text of the whole body, for word-agnostic uses like JSON-LD. */
  text: string;
};

function isHeading(block: BodyBlock): boolean {
  return (
    block._type === "block" &&
    (("style" in block && block.style === "h2") ||
      ("style" in block && block.style === "h3"))
  );
}

/** The plain text of a Portable Text block, spans only. */
export function blockText(block: BodyBlock): string {
  if (block._type !== "block" || !("children" in block)) return "";
  const children = block.children as { _type: string; text?: string }[] | undefined;
  return (children ?? [])
    .filter((child) => child._type === "span")
    .map((child) => child.text ?? "")
    .join("");
}

/**
 * Turns a raw body into something a synchronous renderer can paint.
 *
 * Two things have to happen on the server and cannot happen inside a Portable
 * Text serializer: Shiki highlighting is async, and heading anchors have to be
 * allocated in document order by a single slugger so that a repeated heading
 * gets `-1` appended exactly the way rehype-slug does it in the docs. Doing
 * both here means the renderer is a pure function of its props.
 */
export async function prepareBody(body: BodyBlock[] | undefined): Promise<PreparedBody> {
  if (!body?.length) return { blocks: [], toc: [], text: "" };

  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  const paragraphs: string[] = [];

  const blocks = await Promise.all(
    body.map(async (block): Promise<PreparedBlock> => {
      if (block._type === "codeBlock") {
        const code = block as CodeBlock;
        return { ...code, _html: await highlightCode(code.code, code.language) };
      }

      if (isHeading(block)) {
        const text = blockText(block);
        const id = slugger.slug(text);
        toc.push({
          id,
          text,
          depth: "style" in block && block.style === "h3" ? 3 : 2,
        });
        paragraphs.push(text);
        return { ...block, _headingId: id };
      }

      if (block._type === "block") paragraphs.push(blockText(block));
      return block;
    }),
  );

  return { blocks, toc, text: paragraphs.join(" ").replace(/\s+/g, " ").trim() };
}
