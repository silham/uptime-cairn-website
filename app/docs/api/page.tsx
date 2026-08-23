import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";
import { DocMeta } from "@/components/doc-meta";
import { DocsPager } from "@/components/docs-pager";
import { DocsShell } from "@/components/docs-shell";
import { ArrowUpRightIcon } from "@/components/external-link";
import { API_PAGE } from "@/lib/api-conventions";
import { entryBySlug, groupOf } from "@/lib/docs-manifest";
import { highlightCode } from "@/lib/highlight";
import type { TocItem } from "@/lib/markdown";
import { SITE } from "@/lib/site";

const ENTRY = entryBySlug("api")!;

export const metadata: Metadata = {
  title: ENTRY.title,
  description: ENTRY.description,
  alternates: { canonical: "/docs/api" },
  openGraph: { type: "article", title: ENTRY.title, description: ENTRY.description },
};

export default async function ApiPage() {
  // Highlighted on the server by the same Shiki instance the docs use, so the
  // samples here and in a rendered doc are identical in both themes.
  const [sectionCode, validateCode] = await Promise.all([
    Promise.all(
      API_PAGE.sections.map(async (section) =>
        section.code
          ? await highlightCode(section.code.source, section.code.lang)
          : undefined,
      ),
    ),
    highlightCode(API_PAGE.validate.source, "shellscript"),
  ]);

  const toc: TocItem[] = API_PAGE.sections.map((section) => ({
    id: section.id,
    text: section.title,
    depth: 2,
  }));

  const group = groupOf("api");

  return (
    <DocsShell toc={toc}>
      <article>
        <header className="border-b border-line pb-8">
          {group ? (
            <p className="text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
              {group.title}
            </p>
          ) : null}
          <h1 className="mt-4 text-[34px] leading-[1.1] font-medium tracking-[-0.02em] text-ink md:text-[42px]">
            {ENTRY.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted md:text-[19px]">
            {API_PAGE.lead}
          </p>

          <div className="mt-8 flex flex-wrap gap-px overflow-hidden rounded-xl border border-line bg-line">
            {API_PAGE.counts.map((count) => (
              <div key={count.label} className="flex-1 bg-ground px-5 py-4">
                <p className="text-[26px] leading-none font-medium tracking-[-0.02em] text-ink">
                  {count.value}
                </p>
                <p className="mt-1.5 text-[14px] text-muted">{count.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            {API_PAGE.status}
          </p>
        </header>

        <div className="mt-4">
          {API_PAGE.sections.map((section, index) => (
            <section key={section.id} className="border-t border-line pt-10 mt-10">
              <h2
                id={section.id}
                className="text-[24px] font-semibold tracking-[-0.02em] text-ink"
              >
                {section.title}
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-2xl text-[16px] leading-relaxed text-body md:text-[17px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.code && sectionCode[index] ? (
                <CodeBlock
                  code={section.code.source}
                  html={sectionCode[index]}
                  filename={section.code.lang === "json" ? "json" : "shell"}
                  className="mt-5"
                />
              ) : null}
            </section>
          ))}
        </div>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-ink">
            The specification itself
          </h2>
          <ul className="mt-5 flex flex-col">
            {API_PAGE.links.map((link) => (
              <li key={link.href}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block border-b border-line py-4 transition-colors first:border-t hover:bg-surface"
                  >
                    <span className="inline-flex items-center gap-1.5 text-[16px] font-medium text-ink">
                      {link.label}
                      <ArrowUpRightIcon />
                    </span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-muted">
                      {link.description}
                    </span>
                  </a>
                ) : (
                  <a
                    href={link.href}
                    className="block border-b border-line py-4 transition-colors first:border-t hover:bg-surface"
                  >
                    <span className="text-[16px] font-medium text-ink">
                      {link.label}
                    </span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-muted">
                      {link.description}
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[15px] font-medium text-ink">
            {API_PAGE.validate.caption}
          </p>
          <CodeBlock
            code={API_PAGE.validate.source}
            html={validateCode}
            className="mt-3"
          />
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            The spec is served from {SITE.url}/openapi.yaml with an open CORS
            header, so a client generator can point straight at the URL.
          </p>
        </section>

        <DocMeta entry={ENTRY} />
      </article>

      <DocsPager slug="api" />
    </DocsShell>
  );
}
