import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { PostRow } from "@/components/post-row";
import { getCategories, getCategory } from "@/lib/blog";
import { SITE } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 600;

/**
 * Only categories that have at least one post — CATEGORIES_QUERY filters on
 * that count. An empty category is a page with nothing on it and a URL in the
 * sitemap, which is worse than the category simply not being browsable yet.
 */
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};

  return {
    title: { absolute: `${category.title} — ${SITE.name} blog` },
    description: category.description,
    alternates: { canonical: `/blog/category/${slug}` },
    openGraph: {
      type: "website",
      title: `${category.title} — ${SITE.name} blog`,
      description: category.description,
      url: `${SITE.url}/blog/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  return (
    <>
      <Container className="border-x border-t border-line px-6 pt-24 pb-14 md:px-8 md:pt-32 md:pb-16">
        <p className="text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
          <Link href="/blog" className="transition-colors hover:text-ink">
            Blog
          </Link>
        </p>
        <h1 className="mt-5 max-w-3xl text-[38px] leading-[1.06] font-medium tracking-[-0.02em] text-ink sm:text-[48px]">
          {category.title}
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted md:text-[19px]">
          {category.description}
        </p>
      </Container>

      <Container className="border-x border-t border-line px-6 py-12 md:px-8 md:py-16">
        <div className="flex flex-col">
          {category.posts.map((post) => (
            <PostRow key={post._id} post={post} />
          ))}
        </div>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
              {
                "@type": "ListItem",
                position: 3,
                name: category.title,
                item: `${SITE.url}/blog/category/${slug}`,
              },
            ],
          }),
        }}
      />
    </>
  );
}
