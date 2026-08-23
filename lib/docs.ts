import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import { DOC_ENTRIES, MARKDOWN_ENTRIES, type DocEntry } from "./docs-manifest";
import { renderMarkdown, type RenderedDoc } from "./markdown";

export type Doc = RenderedDoc & { entry: DocEntry };

const CONTENT_DIR = path.join(process.cwd(), "content", "docs");

/**
 * Memoised per request, because the page body, generateMetadata, the OG image
 * and the search index all want the same render and Shiki is not cheap.
 */
export const getDoc = cache(async (slug: string): Promise<Doc | undefined> => {
  const entry = DOC_ENTRIES.find((candidate) => candidate.slug === slug);
  if (!entry?.source || !entry.sourceRepoPath) return undefined;

  const markdown = await readFile(path.join(CONTENT_DIR, entry.source), "utf8");
  const rendered = await renderMarkdown(markdown, {
    sourceRepoPath: entry.sourceRepoPath,
  });

  return { entry, ...rendered };
});

/** Every markdown-backed doc, in manifest order. */
export async function getAllDocs(): Promise<Doc[]> {
  const docs = await Promise.all(
    MARKDOWN_ENTRIES.map((entry) => getDoc(entry.slug)),
  );
  return docs.filter((doc): doc is Doc => doc !== undefined);
}
