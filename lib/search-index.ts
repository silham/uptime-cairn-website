import { API_PAGE } from "./api-conventions";
import { DOC_GROUPS, entryBySlug, groupOf } from "./docs-manifest";
import { getAllDocs } from "./docs";

/**
 * One record per section, with short keys because this ships to the browser.
 * Roughly sixty records across six pages — small enough to fetch once and
 * search entirely in memory, which is why there is no search service here.
 */
export type SearchRecord = {
  /** URL, including the section anchor. */
  u: string;
  /** Document title. */
  d: string;
  /** Group title. */
  g: string;
  /** Heading text. */
  h: string;
  /** Section body, plain text, truncated. */
  t: string;
};

const SNIPPET_LENGTH = 320;

/**
 * Built from the same rendered trees the pages are built from, so the index
 * cannot describe a section that is not on the page or miss one that is.
 */
export async function buildSearchIndex(): Promise<SearchRecord[]> {
  const records: SearchRecord[] = [];

  for (const doc of await getAllDocs()) {
    const group = groupOf(doc.entry.slug);
    for (const section of doc.sections) {
      if (!section.heading && !section.text) continue;
      records.push({
        u: section.id
          ? `/docs/${doc.entry.slug}#${section.id}`
          : `/docs/${doc.entry.slug}`,
        d: doc.entry.title,
        g: group?.title ?? "",
        h: section.heading || doc.entry.title,
        t: section.text.slice(0, SNIPPET_LENGTH),
      });
    }
  }

  // The API page is hand-written rather than rendered from markdown, so it is
  // indexed from the same constant the page renders.
  const apiEntry = entryBySlug("api");
  if (apiEntry) {
    const group = DOC_GROUPS.find((candidate) =>
      candidate.entries.some((entry) => entry.slug === "api"),
    );
    records.push({
      u: "/docs/api",
      d: apiEntry.title,
      g: group?.title ?? "",
      h: apiEntry.title,
      t: API_PAGE.lead.slice(0, SNIPPET_LENGTH),
    });
    for (const section of API_PAGE.sections) {
      records.push({
        u: `/docs/api#${section.id}`,
        d: apiEntry.title,
        g: group?.title ?? "",
        h: section.title,
        t: section.body.join(" ").replace(/\s+/g, " ").slice(0, SNIPPET_LENGTH),
      });
    }
  }

  return records;
}
