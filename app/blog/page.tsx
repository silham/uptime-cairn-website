import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/container";
import { ExternalLink } from "@/components/external-link";
import { PostRow } from "@/components/post-row";
import { getCategories, getPosts } from "@/lib/blog";
import { isSanityConfigured } from "@/lib/sanity/env";
import { SITE } from "@/lib/site";

/* Prerendered at build and refreshed in the background, so this route prints
   ● and never ƒ. The window matches lib/sanity/client.ts. */
export const revalidate = 600;

const INTRO =
  "Notes on monitoring, on running the thing yourself, and on the decisions behind Uptime Cairn — written by the people who maintain it.";

export const metadata: Metadata = {
  title: { absolute: `Blog — ${SITE.name}` },
  description: INTRO,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": `${SITE.url}/blog/rss.xml` },
  },
  openGraph: {
    type: "website",
    title: `Blog — ${SITE.name}`,
    description: INTRO,
    url: `${SITE.url}/blog`,
  },
};

export default async function BlogIndexPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  return (
    <>
      <Container className="border-x border-t border-line px-6 pt-24 pb-16 md:px-8 md:pt-32 md:pb-20">
        <p className="text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
          Blog
        </p>
        <h1 className="mt-5 max-w-3xl text-[38px] leading-[1.05] font-medium tracking-[-0.02em] text-ink sm:text-[52px] md:text-[62px]">
          What we learned
          <br className="hidden sm:block" /> keeping things up.
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted md:text-[19px]">
          {INTRO}
        </p>

        {categories.length > 0 && (
          <nav aria-label="Categories" className="mt-10 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className="rounded-md border border-line px-3 py-1.5 text-[14px] text-body transition-colors hover:bg-surface hover:text-ink"
              >
                {category.title}
                <span className="ml-1.5 text-muted">{category.count}</span>
              </Link>
            ))}
          </nav>
        )}
      </Container>

      <Container className="border-x border-t border-line px-6 py-12 md:px-8 md:py-16">
        {posts.length > 0 ? (
          <div className="flex flex-col">
            {posts.map((post) => (
              <PostRow key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </Container>
    </>
  );
}

/**
 * Two different nothings, said plainly.
 *
 * A clone with no Sanity project builds and runs — the blog is simply empty —
 * so the empty state has to distinguish "nobody has written anything yet" from
 * "this checkout is not wired to a content store", or the first person to run
 * `npm run dev` concludes the feature is broken.
 */
function EmptyState() {
  return (
    <div className="rounded-xl border border-line px-6 py-14 text-center">
      <p className="text-[17px] font-medium text-ink">
        {isSanityConfigured ? "Nothing published yet." : "The blog is not connected."}
      </p>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted">
        {isSanityConfigured ? (
          <>
            The first post is being written. In the meantime, the{" "}
            <Link href="/changelog" className="text-accent-ink underline underline-offset-[3px]">
              changelog
            </Link>{" "}
            has every change that shipped.
          </>
        ) : (
          <>
            Set <code className="font-mono text-[14px] text-ink">NEXT_PUBLIC_SANITY_PROJECT_ID</code>{" "}
            and <code className="font-mono text-[14px] text-ink">NEXT_PUBLIC_SANITY_DATASET</code>,
            then write a post in the Studio. The README has the four steps.
          </>
        )}
      </p>
      <p className="mt-6 text-[14px]">
        <ExternalLink
          href={SITE.discussions}
          className="text-accent-ink underline underline-offset-[3px]"
        >
          Ask something in Discussions
        </ExternalLink>
      </p>
    </div>
  );
}
