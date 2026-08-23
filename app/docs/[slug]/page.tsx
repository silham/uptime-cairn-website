import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocMeta } from "@/components/doc-meta";
import { DocsPager } from "@/components/docs-pager";
import { DocsShell } from "@/components/docs-shell";
import { MARKDOWN_ENTRIES, groupOf } from "@/lib/docs-manifest";
import { getDoc } from "@/lib/docs";
import { SITE } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

/** Every markdown-backed doc is prerendered; nothing here is dynamic. */
export function generateStaticParams() {
  return MARKDOWN_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDoc(slug);
  if (!doc) return {};

  return {
    title: doc.entry.title,
    description: doc.entry.description,
    alternates: { canonical: `/docs/${slug}` },
    openGraph: {
      type: "article",
      title: doc.entry.title,
      description: doc.entry.description,
      url: `${SITE.url}/docs/${slug}`,
    },
  };
}

export default async function DocPage({ params }: Params) {
  const { slug } = await params;
  const doc = await getDoc(slug);
  if (!doc) notFound();

  const group = groupOf(slug);

  return (
    <DocsShell toc={doc.toc}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(doc.entry.title, doc.entry.description, slug, group?.title)),
        }}
      />

      <article>
        <header className="border-b border-line pb-8">
          {group ? (
            <p className="text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
              {group.title}
            </p>
          ) : null}
          <h1 className="mt-4 text-[34px] leading-[1.1] font-medium tracking-[-0.02em] text-ink md:text-[42px]">
            {doc.entry.title}
          </h1>
        </header>

        {/* The markdown is rendered on the server by lib/markdown.ts, which
            drops raw HTML entirely — there is nothing here to sanitise at
            render time because nothing unsafe survives the pipeline. */}
        <div
          className="prose-doc mt-10"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />

        <DocMeta entry={doc.entry} />
      </article>

      <DocsPager slug={slug} />
    </DocsShell>
  );
}

function jsonLd(title: string, description: string, slug: string, group?: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: title,
      description,
      url: `${SITE.url}/docs/${slug}`,
      isPartOf: {
        "@type": "WebSite",
        name: `${SITE.name} documentation`,
        url: `${SITE.url}/docs`,
      },
      publisher: { "@type": "Organization", name: SITE.author },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Documentation", item: `${SITE.url}/docs` },
        ...(group ? [{ "@type": "ListItem", position: 3, name: group }] : []),
        {
          "@type": "ListItem",
          position: group ? 4 : 3,
          name: title,
          item: `${SITE.url}/docs/${slug}`,
        },
      ],
    },
  ];
}
