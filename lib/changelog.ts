import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import { renderMarkdown, type RenderedDoc } from "./markdown";

/**
 * The changelog is not a guide, so it is not in the docs manifest and does not
 * live under /docs. It is a project record with its own route, and its own
 * shape: every `##` is a release, so the contents rail doubles as a version
 * list without anything extra being parsed out of it.
 *
 * The file sits at the product repo root rather than in docs/, which matters
 * for link rewriting — its relative links are written from there, so
 * `docs/guides/alerting.md` in the source resolves against the repo root and
 * lands on this site's /docs/alerting.
 */
export const CHANGELOG_SOURCE = "CHANGELOG.md";

const CHANGELOG_PATH = path.join(process.cwd(), "content", "CHANGELOG.md");

/** Memoised: the page body, generateMetadata and the OG image all want it. */
export const getChangelog = cache(async (): Promise<RenderedDoc> => {
  const markdown = await readFile(CHANGELOG_PATH, "utf8");
  return renderMarkdown(markdown, { sourceRepoPath: CHANGELOG_SOURCE });
});

/**
 * The most recent released version, for the page's meta description.
 *
 * Keep a Changelog puts unreleased work under an "Unreleased" heading, which
 * is not a version — skipping it is what keeps the description from announcing
 * a release that does not exist yet.
 */
export function latestRelease(toc: { text: string; depth: number }[]): string | undefined {
  const heading = toc.find(
    (item) => item.depth === 2 && !/^unreleased/i.test(item.text.trim()),
  );
  if (!heading) return undefined;
  // Headings read "[1.0.1] — 2026-08-22"; the version is the bracketed part.
  return heading.text.match(/\[([^\]]+)\]/)?.[1] ?? heading.text.split("—")[0].trim();
}
