import type { PortableTextBlock } from "@portabletext/types";

/**
 * Hand-written against the projections in `./queries.ts`.
 *
 * Sanity can generate these with `sanity typegen`, which needs an extracted
 * schema committed and a step wired into the build. With four document types
 * and six queries that machinery costs more than it saves — but if the schema
 * grows, generating these is the right move, not enlarging this file.
 */

export type SanityImage = {
  _type: string;
  asset: { _ref: string; _type: string };
  alt?: string;
  caption?: string;
  /** Base64 placeholder from Sanity's asset metadata. */
  lqip?: string;
  aspectRatio?: number;
};

export type AuthorRef = {
  name: string;
  slug: string;
  role?: string;
};

export type AuthorFull = AuthorRef & {
  bio?: string;
  url?: string;
  image?: SanityImage;
};

export type CategoryRef = {
  title: string;
  slug: string;
};

export type CategorySummary = CategoryRef & {
  description: string;
  count: number;
};

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  /** Set only when an editor deliberately marked the post as revised. */
  updatedAt?: string;
  author?: AuthorRef;
  categories?: CategoryRef[];
  coverImage?: SanityImage;
};

/** A code fence authored in the Studio, before highlighting. */
export type CodeBlock = {
  _type: "codeBlock";
  _key: string;
  language?: string;
  code: string;
  filename?: string;
};

export type FigureBlock = SanityImage & {
  _type: "figure";
  _key: string;
};

export type BodyBlock = PortableTextBlock | CodeBlock | FigureBlock;

export type Post = Omit<PostCard, "author"> & {
  author?: AuthorFull;
  body: BodyBlock[];
};

export type CategoryPage = CategoryRef & {
  description: string;
  posts: PostCard[];
};
