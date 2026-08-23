/**
 * The single source of truth for the docs section.
 *
 * The source markdown lives in the product repo and is copied here byte for
 * byte (see scripts/sync-docs.ts), which means it carries no frontmatter and
 * never will — the moment a copy stops matching its source, the drift check
 * that keeps this content honest stops working. So everything the markdown
 * does not say lives here instead: routes, order, grouping, page titles, and
 * the descriptions used for search results and meta tags.
 *
 * Ordering is array order. Grouping is the array an entry is in. Nothing is
 * derived from a filename.
 *
 * This module also drives the sidebar, the pager, the sitemap, the footer's
 * documentation column, the landing page's docs teaser, and the link rewriter
 * — so a page cannot appear in one of those and be missing from another.
 */

export type DocEntry = {
  /** Route under /docs. */
  slug: string;
  /** Path under content/docs/. Absent for hand-written pages. */
  source?: string;
  /** Path in the product repo. Powers "edit this page" and link resolution. */
  sourceRepoPath?: string;
  /** Rendered as the page's <h1>; the file's own leading H1 is dropped. */
  title: string;
  /** Sidebar label, when the full title is too long for the rail. */
  navTitle?: string;
  /** Hand-written. Feeds the meta description and the index cards. */
  description: string;
};

export type DocGroup = {
  id: string;
  title: string;
  entries: DocEntry[];
};

export const DOC_GROUPS: DocGroup[] = [
  {
    id: "start",
    title: "Getting started",
    entries: [
      {
        slug: "install",
        source: "guides/install.md",
        sourceRepoPath: "docs/guides/install.md",
        title: "Installing Uptime Cairn",
        navTitle: "Install",
        description:
          "Four ways in — Docker, Compose, a plain binary, and a Raspberry Pi — all producing one process, one database file, and a dashboard on port 3000.",
      },
      {
        slug: "quickstart",
        source: "guides/quickstart.md",
        sourceRepoPath: "docs/guides/quickstart.md",
        title: "Your first monitor",
        navTitle: "First monitor",
        description:
          "Sixty seconds from a running install to a monitor checking something, an alert channel that really fires, and a status page your customers can read.",
      },
      {
        slug: "migrating-from-uptime-kuma",
        source: "guides/migrating-from-uptime-kuma.md",
        sourceRepoPath: "docs/guides/migrating-from-uptime-kuma.md",
        title: "Migrating from Uptime Kuma",
        navTitle: "From Uptime Kuma",
        description:
          "What `cairn import kuma` brings across from a kuma.db, how to merge several Kuma instances into one install, and exactly what it cannot bring.",
      },
    ],
  },
  {
    id: "reference",
    title: "Reference",
    entries: [
      {
        slug: "monitor-types",
        source: "guides/monitor-types.md",
        sourceRepoPath: "docs/guides/monitor-types.md",
        title: "Monitor types",
        description:
          "The nine types — http, tcp, icmp, dns, tls_expiry, domain_expiry, push, docker and grpc — what each one actually checks, and the fields where the obvious reading is wrong.",
      },
      {
        slug: "alerting",
        source: "guides/alerting.md",
        sourceRepoPath: "docs/guides/alerting.md",
        title: "Alerting",
        description:
          "Thirteen channel types, what each one needs, webhook templating, and the two rules that apply to every channel before you configure any of them.",
      },
      {
        slug: "api",
        // Hand-written from lib/api-conventions.ts rather than rendered from
        // markdown: the generated per-operation reference is 125 operations
        // long and belongs next to the spec, not on a marketing site.
        sourceRepoPath: "docs/api/README.md",
        title: "API conventions",
        navTitle: "API",
        description:
          "Authentication, scopes, cursor pagination, error documents, and the compatibility promise — plus where to get the OpenAPI spec and the full 125-operation reference.",
      },
    ],
  },
];

/** Flattened, order preserved. Powers routing, the pager, and the sitemap. */
export const DOC_ENTRIES: DocEntry[] = DOC_GROUPS.flatMap((group) => group.entries);

/** Only the entries rendered from markdown — the [slug] route's static params. */
export const MARKDOWN_ENTRIES: DocEntry[] = DOC_ENTRIES.filter((entry) => entry.source);

/**
 * Product-repo path to site route. The link rewriter's lookup table: anything
 * in here becomes an internal link, anything else falls back to GitHub.
 */
export const SOURCE_TO_ROUTE = new Map(
  DOC_ENTRIES.flatMap((entry) =>
    entry.sourceRepoPath ? [[entry.sourceRepoPath, `/docs/${entry.slug}`] as const] : [],
  ),
);

export function entryBySlug(slug: string): DocEntry | undefined {
  return DOC_ENTRIES.find((entry) => entry.slug === slug);
}

export function groupOf(slug: string): DocGroup | undefined {
  return DOC_GROUPS.find((group) => group.entries.some((entry) => entry.slug === slug));
}

export function neighbours(slug: string): { prev?: DocEntry; next?: DocEntry } {
  const index = DOC_ENTRIES.findIndex((entry) => entry.slug === slug);
  if (index === -1) return {};
  return {
    prev: index > 0 ? DOC_ENTRIES[index - 1] : undefined,
    next: index < DOC_ENTRIES.length - 1 ? DOC_ENTRIES[index + 1] : undefined,
  };
}
