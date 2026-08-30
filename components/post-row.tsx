import Link from "next/link";

import { ArrowIcon } from "./external-link";
import { formatDate, isoDate } from "@/lib/dates";
import type { PostCard } from "@/lib/sanity/types";

/**
 * One post in a list.
 *
 * A row rather than a card, for the same reason the rest of the site is bands
 * and hairlines: a grid of cards would be the first floating object on a page
 * built out of ruled lines. The date sits in its own column in mono, so a list
 * of posts scans as a ledger of dates — which is what an archive is.
 */
export function PostRow({
  post,
  /* The post title is the row's own heading. On an index that is an h2; in the
     "More posts" section under an article it sits below that section's h2, so
     the caller drops it a level rather than the markup lying about the outline. */
  headingLevel = 2,
}: {
  post: PostCard;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <article className="border-b border-line first:border-t">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col gap-2 py-7 transition-colors hover:bg-surface sm:flex-row sm:gap-8 sm:px-2"
      >
        <time
          dateTime={isoDate(post.publishedAt)}
          className="shrink-0 pt-1 font-mono text-[13px] text-muted sm:w-36"
        >
          {formatDate(post.publishedAt)}
        </time>

        <div className="min-w-0">
          <Heading className="text-[20px] leading-snug font-semibold tracking-tight text-ink md:text-[22px]">
            {post.title}
          </Heading>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted md:text-[16px]">
            {post.excerpt}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted">
            {post.author ? <span>{post.author.name}</span> : null}
            {post.categories?.length ? (
              <span className="flex flex-wrap gap-1.5">
                {post.categories.map((category) => (
                  <span
                    key={category.slug}
                    className="rounded-md bg-surface-2 px-2 py-0.5 text-[12px] font-medium text-body"
                  >
                    {category.title}
                  </span>
                ))}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 font-medium text-ink">
              Read it
              <span className="transition-transform group-hover:translate-x-0.5">
                <ArrowIcon />
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
