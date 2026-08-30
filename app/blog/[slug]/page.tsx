import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { DocsToc } from "@/components/docs-toc";
import { ExternalLink } from "@/components/external-link";
import { PostBody } from "@/components/portable-text";
import { PostRow } from "@/components/post-row";
import { SanityImage } from "@/components/sanity-image";
import { getMorePosts, getPost, getPostSlugs, prepareBody } from "@/lib/blog";
import { formatDate, isoDate } from "@/lib/dates";
import type { Post } from "@/lib/sanity/types";
import { SITE } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 600;

/**
 * Every post that exists at build time is prerendered.
 *
 * `dynamicParams` stays on its default of true, which is what lets a post
 * published between deploys be generated on first request and then cached —
 * the alternative is a 404 on a live URL until someone redeploys. The route
 * still reports ● because the known slugs are all built ahead of time.
 */
export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    authors: post.author ? [{ name: post.author.name, url: post.author.url }] : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${SITE.url}/blog/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author.name] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [{ blocks, toc }, morePosts] = await Promise.all([
    prepareBody(post.body),
    getMorePosts(slug),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(post)) }}
      />

      <Container className="border-x border-t border-line px-6 pt-20 pb-12 md:px-8 md:pt-28 md:pb-16">
        <p className="text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
          <Link href="/blog" className="transition-colors hover:text-ink">
            Blog
          </Link>
        </p>

        <h1 className="mt-5 max-w-4xl text-[34px] leading-[1.08] font-medium tracking-[-0.02em] text-ink sm:text-[44px] md:text-[52px]">
          {post.title}
        </h1>

        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted md:text-[19px]">
          {post.excerpt}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-muted">
          {post.author ? <span className="font-medium text-ink">{post.author.name}</span> : null}
          <time dateTime={isoDate(post.publishedAt)} className="font-mono text-[13px]">
            {formatDate(post.publishedAt)}
          </time>
          {/* Only shown when an editor deliberately set it — see the field's
              description in the schema. A quiet correction is not an update. */}
          {post.updatedAt ? (
            <span className="font-mono text-[13px]">
              updated {formatDate(post.updatedAt)}
            </span>
          ) : null}
          {post.categories?.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="rounded-md bg-surface-2 px-2 py-0.5 text-[13px] font-medium text-body transition-colors hover:text-ink"
            >
              {category.title}
            </Link>
          ))}
        </div>
      </Container>

      {post.coverImage ? (
        <Container className="border-x border-t border-line px-6 py-8 md:px-8 md:py-10">
          <SanityImage
            image={post.coverImage}
            width={1216}
            alt={post.coverImage.alt ?? ""}
            sizes="(min-width: 1280px) 1216px, 100vw"
            priority
            className="w-full rounded-xl border border-line"
          />
        </Container>
      ) : null}

      <Container className="border-x border-t border-line lg:grid lg:grid-cols-[minmax(0,1fr)_236px]">
        <div className="min-w-0 px-6 py-12 md:px-8 md:py-16">
          <PostBody blocks={blocks} />

          {post.author ? <AuthorCard author={post.author} /> : null}
        </div>

        <div className="hidden border-l border-line lg:block">
          <div className="sticky top-18 max-h-[calc(100vh-4.5rem)] overflow-y-auto px-4 py-12">
            <DocsToc items={toc} />
          </div>
        </div>
      </Container>

      {morePosts.length > 0 && (
        <Container className="border-x border-t border-line px-6 py-12 md:px-8 md:py-16">
          <h2 className="text-[13px] font-semibold tracking-wide text-muted uppercase">
            More posts
          </h2>
          <div className="mt-4 flex flex-col">
            {morePosts.map((other) => (
              <PostRow key={other._id} post={other} headingLevel={3} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}

function AuthorCard({ author }: { author: NonNullable<Post["author"]> }) {
  return (
    <div className="mt-14 flex items-start gap-4 border-t border-line pt-8">
      {author.image ? (
        <SanityImage
          image={author.image}
          width={48}
          alt=""
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
      ) : null}
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-ink">
          {author.name}
          {author.role ? <span className="font-normal text-muted"> · {author.role}</span> : null}
        </p>
        {author.bio ? (
          <p className="mt-1.5 max-w-lg text-[15px] leading-relaxed text-muted">{author.bio}</p>
        ) : null}
        {author.url ? (
          <p className="mt-2 text-[14px]">
            <ExternalLink
              href={author.url}
              className="text-accent-ink underline underline-offset-[3px]"
            >
              {author.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </ExternalLink>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function jsonLd(post: Post) {
  const url = `${SITE.url}/blog/${post.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: post.author
        ? { "@type": "Person", name: post.author.name, url: post.author.url }
        : { "@type": "Organization", name: SITE.author },
      publisher: { "@type": "Organization", name: SITE.author, url: SITE.url },
      isPartOf: { "@type": "Blog", name: `${SITE.name} blog`, url: `${SITE.url}/blog` },
      keywords: post.categories?.map((category) => category.title).join(", ") || undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
}
