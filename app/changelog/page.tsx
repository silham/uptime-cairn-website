import type { Metadata } from "next";

import { Container } from "@/components/container";
import { DocsToc } from "@/components/docs-toc";
import { ExternalLink } from "@/components/external-link";
import { getChangelog, latestRelease, CHANGELOG_SOURCE } from "@/lib/changelog";
import { SITE, githubBlob } from "@/lib/site";

const INTRO =
  "Every notable change to Uptime Cairn, newest first — written for the person deciding whether to upgrade.";

export async function generateMetadata(): Promise<Metadata> {
  const { toc } = await getChangelog();
  const latest = latestRelease(toc);

  return {
    title: { absolute: `Changelog — ${SITE.name}` },
    description: latest
      ? `${INTRO} Latest release: ${latest}.`
      : INTRO,
    alternates: { canonical: "/changelog" },
    openGraph: {
      type: "article",
      title: `Changelog — ${SITE.name}`,
      description: INTRO,
      url: `${SITE.url}/changelog`,
    },
  };
}

export default async function ChangelogPage() {
  const { html, toc } = await getChangelog();

  // Only the release headings; the Added/Changed/Fixed groups under them are
  // h3s and would triple the length of a rail whose whole job is version
  // navigation.
  const releases = toc.filter((item) => item.depth === 2);

  return (
    <>
      <Container className="border-x border-t border-line px-6 pt-24 pb-16 md:px-8 md:pt-32 md:pb-20">
        <p className="text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
          Changelog
        </p>
        <h1 className="mt-5 max-w-3xl text-[38px] leading-[1.05] font-medium tracking-[-0.02em] text-ink sm:text-[52px] md:text-[62px]">
          What changed,
          <br className="hidden sm:block" /> and whether it affects you.
        </h1>
        {/* No lead paragraph here on purpose: the file opens with its own
            preamble naming Keep a Changelog and semantic versioning, and a
            summary above it said the same thing twice. INTRO survives as the
            meta description, which has no such body text to lean on. */}
        <div className="mt-10 flex flex-wrap items-center gap-2.5">
          <ExternalLink
            href={SITE.releases}
            className="rounded-md bg-solid px-4 py-2 text-[14px] font-medium text-on-solid transition-colors hover:bg-solid-hover"
          >
            Releases on GitHub
          </ExternalLink>
          <ExternalLink
            href={githubBlob("ROADMAP.md")}
            className="rounded-md border border-line-strong px-4 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-surface"
          >
            What is planned next
          </ExternalLink>
        </div>
      </Container>

      <Container className="border-x border-t border-line lg:grid lg:grid-cols-[minmax(0,1fr)_236px]">
        <div className="min-w-0 px-6 py-12 md:px-8 md:py-16">
          {/* Rendered on the server by lib/markdown.ts, which drops raw HTML
              entirely — nothing unsafe survives the pipeline. */}
          <div
            className="prose-doc"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <p className="mt-14 border-t border-line pt-6 text-[13px] text-muted">
            This page is{" "}
            <ExternalLink
              href={githubBlob(CHANGELOG_SOURCE)}
              className="text-accent-ink underline underline-offset-[3px]"
            >
              CHANGELOG.md
            </ExternalLink>{" "}
            from the product repository, copied here unchanged.
          </p>
        </div>

        <div className="hidden border-l border-line lg:block">
          <div className="sticky top-18 max-h-[calc(100vh-4.5rem)] overflow-y-auto px-4 py-12">
            <DocsToc items={releases} label="Releases" />
          </div>
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
              {
                "@type": "ListItem",
                position: 2,
                name: "Changelog",
                item: `${SITE.url}/changelog`,
              },
            ],
          }),
        }}
      />
    </>
  );
}
