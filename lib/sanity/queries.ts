/*
 * Every query is a projection, never a bare `...` on a document.
 *
 * Two reasons. The list queries do not pull `body`, which is the largest field
 * by an order of magnitude and is not rendered on a card. And a projection is
 * a contract: the types in `./types.ts` are hand-written against these shapes,
 * so a field that appears here without appearing there is a type error rather
 * than an `undefined` that reaches the page.
 */

/**
 * The two things a Sanity image reference does not carry on its own: the
 * base64 placeholder and the aspect ratio, both of which come off the asset's
 * metadata. They are what let `<SanityImage>` reserve the box and blur it
 * before the bytes land.
 *
 * Spread separately from `...` rather than included in it — a projection with
 * two `...` in it is a duplicate key, and GROQ resolves that quietly.
 */
const IMAGE_META = /* groq */ `
  "lqip": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio
`;

/** Everything a card shows except the author, which differs between queries. */
const CARD_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  updatedAt,
  "categories": categories[]->{ title, "slug": slug.current }
`;

/** The author as a card shows them: a name and a role, nothing more. */
const AUTHOR_BRIEF = /* groq */ `
  "author": author->{ name, "slug": slug.current, role }
`;

const POST_CARD = /* groq */ `
  ${CARD_FIELDS},
  ${AUTHOR_BRIEF},
  coverImage{ ..., ${IMAGE_META} }
`;

export const POSTS_QUERY = /* groq */ `
  *[_type == "post" && defined(slug.current)]
    | order(publishedAt desc) { ${POST_CARD} }
`;

/** Slugs only, for generateStaticParams. */
export const POST_SLUGS_QUERY = /* groq */ `
  *[_type == "post" && defined(slug.current)].slug.current
`;

export const POST_QUERY = /* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    ${CARD_FIELDS},
    coverImage{ ..., ${IMAGE_META} },
    body[]{
      ...,
      _type == "figure" => { ${IMAGE_META} }
    },
    "author": author->{
      name,
      "slug": slug.current,
      role,
      bio,
      url,
      image{ ..., ${IMAGE_META} }
    }
  }
`;

/**
 * The three most recent posts that are not this one.
 *
 * Deliberately recency rather than similarity. A "related posts" rail computed
 * from shared categories makes a claim about relevance that a blog with a
 * handful of entries cannot support. This is "more posts", so that is what the
 * heading over it says.
 */
export const MORE_POSTS_QUERY = /* groq */ `
  *[_type == "post" && defined(slug.current) && slug.current != $slug]
    | order(publishedAt desc)[0...3] {
      ${CARD_FIELDS},
      ${AUTHOR_BRIEF}
    }
`;

/** Only categories that actually have a post, so no route leads to an empty page. */
export const CATEGORIES_QUERY = /* groq */ `
  *[_type == "category" && defined(slug.current) && count(*[_type == "post" && references(^._id)]) > 0]
    | order(title asc) {
      title,
      "slug": slug.current,
      description,
      "count": count(*[_type == "post" && references(^._id)])
    }
`;

export const CATEGORY_QUERY = /* groq */ `
  *[_type == "category" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    description,
    "posts": *[_type == "post" && references(^._id)]
      | order(publishedAt desc) { ${POST_CARD} }
  }
`;
