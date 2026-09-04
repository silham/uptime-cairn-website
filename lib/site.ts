/**
 * Everything the site knows about itself and about the project it documents.
 *
 * `version` and `repoRef` are rewritten by `scripts/sync-docs.ts` from the
 * product repo's own `git describe`, so the release badge and every GitHub
 * fallback link move together and cannot drift apart by hand.
 */

const GITHUB = "https://github.com/webloomlabs/uptime-cairn";

export const SITE = {
  name: "Uptime Cairn",
  url: "https://uptimecairn.dev",

  tagline:
    "Uptime Cairn tells you when your websites and servers go down, and shows your customers a status page that says so.",
  description:
    "Free, open source, and self-hosted uptime monitoring. One Docker container, one file of data, no database server to set up. Nine monitor types, thirteen alerting channels, public status pages, and a complete REST API.",

  /* Both rewritten by scripts/sync-docs.ts. `version` is the tag, for display.
     `repoRef` is the commit the docs were copied from, and is what GitHub
     fallback links are built against — a tag would 404 on any file added after
     it was cut. */
  version: "1.0.1",
  repoRef: "038545a61305e7410e342cdcf62535513eede000",

  github: GITHUB,
  issues: `${GITHUB}/issues`,
  discussions: `${GITHUB}/discussions`,
  releases: `${GITHUB}/releases`,
  dockerHub: "https://hub.docker.com/r/webloomlabs/uptime-cairn",

  ghcrImage: "ghcr.io/webloomlabs/uptime-cairn:latest",
  dockerHubImage: "webloomlabs/uptime-cairn:latest",

  securityEmail: "security@uptimecairn.dev",
  licence: "Apache-2.0",
  licenceUrl: "https://www.apache.org/licenses/LICENSE-2.0",

  author: "Webloom Labs",
  authorUrl: "https://www.webloomlabs.net/",
} as const;

/** A file in the product repo, pinned to the release the docs were synced from. */
export function githubBlob(path: string): string {
  return `${SITE.github}/blob/${SITE.repoRef}/${path}`;
}

/** The edit view of a file, for the "edit this page" link under each doc. */
export function githubEdit(path: string): string {
  return `${SITE.github}/edit/main/${path}`;
}

export const NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Monitor types", href: "/docs/monitor-types" },
  { label: "Alerting", href: "/docs/alerting" },
  { label: "API", href: "/docs/api" },
  { label: "Blog", href: "/blog" },
  { label: "Changelog", href: "/changelog" },
] as const;

export type FooterLink = { label: string; href: string; external?: boolean };
export type FooterColumn = { title: string; links: FooterLink[] };

/**
 * The Documentation column is derived from DOC_GROUPS at render time so it
 * cannot drift from the sidebar; only these three are hand-written.
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Project",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
      { label: "Source", href: SITE.github, external: true },
      { label: "Releases", href: SITE.releases, external: true },
      { label: "Roadmap", href: githubBlob("ROADMAP.md"), external: true },
      { label: "Why this exists", href: githubBlob("docs/why-uptime-cairn.md"), external: true },
      { label: "Governance", href: githubBlob("GOVERNANCE.md"), external: true },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Issues", href: SITE.issues, external: true },
      { label: "Discussions", href: SITE.discussions, external: true },
      { label: "Contributing", href: githubBlob("CONTRIBUTING.md"), external: true },
      { label: "Code of conduct", href: githubBlob("CODE_OF_CONDUCT.md"), external: true },
    ],
  },
  {
    title: "Operating it",
    links: [
      { label: "Backup and restore", href: githubBlob("docs/operations/backup-restore.md"), external: true },
      { label: "Reverse proxies", href: githubBlob("docs/operations/reverse-proxy.md"), external: true },
      { label: "Upgrading", href: githubBlob("docs/operations/upgrading.md"), external: true },
      { label: "What to alert on", href: githubBlob("docs/operations/observability-and-ops.md"), external: true },
      { label: "Security policy", href: githubBlob("SECURITY.md"), external: true },
    ],
  },
];

/** Inline paths rather than an icon package, as the reference site does. */
export const SOCIALS = [
  {
    label: "GitHub",
    href: SITE.github,
    viewBox: "0 0 16 16",
    path: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z",
  },
  {
    label: "Docker Hub",
    href: SITE.dockerHub,
    viewBox: "0 0 16 16",
    path: "M14.7 6.16c-.4-.27-1.34-.37-2.06-.23-.09-.68-.46-1.27-1.12-1.8l-.38-.25-.25.38c-.32.48-.45 1.28-.4 1.86.04.35.16.75.38 1.04-.17.1-.5.23-.95.22H.6a.6.6 0 0 0-.6.6 6.9 6.9 0 0 0 .43 2.5 3.7 3.7 0 0 0 1.48 1.9c.68.38 1.79.6 3.05.6.57 0 1.14-.05 1.7-.16a7.06 7.06 0 0 0 2.22-.8 6.1 6.1 0 0 0 1.51-1.24 8.36 8.36 0 0 0 1.48-2.6h.13c.77 0 1.25-.31 1.51-.57.18-.17.31-.37.4-.6l.1-.31-.31-.19ZM1.51 6.4h1.36a.12.12 0 0 0 .12-.12V5.06a.12.12 0 0 0-.12-.12H1.51a.12.12 0 0 0-.12.12v1.22c0 .07.05.12.12.12Zm1.87 0h1.36a.12.12 0 0 0 .12-.12V5.06a.12.12 0 0 0-.12-.12H3.38a.12.12 0 0 0-.12.12v1.22c0 .07.05.12.12.12Zm1.9 0h1.36a.12.12 0 0 0 .12-.12V5.06a.12.12 0 0 0-.12-.12H5.28a.12.12 0 0 0-.12.12v1.22c0 .07.05.12.12.12Zm1.88 0h1.36a.12.12 0 0 0 .12-.12V5.06a.12.12 0 0 0-.12-.12H7.16a.12.12 0 0 0-.12.12v1.22c0 .07.05.12.12.12ZM3.38 4.66h1.36a.12.12 0 0 0 .12-.12V3.32a.12.12 0 0 0-.12-.12H3.38a.12.12 0 0 0-.12.12v1.22c0 .07.05.12.12.12Zm1.9 0h1.36a.12.12 0 0 0 .12-.12V3.32a.12.12 0 0 0-.12-.12H5.28a.12.12 0 0 0-.12.12v1.22c0 .07.05.12.12.12Zm1.88 0h1.36a.12.12 0 0 0 .12-.12V3.32a.12.12 0 0 0-.12-.12H7.16a.12.12 0 0 0-.12.12v1.22c0 .07.05.12.12.12Zm0-1.74h1.36a.12.12 0 0 0 .12-.12V1.58a.12.12 0 0 0-.12-.12H7.16a.12.12 0 0 0-.12.12V2.8c0 .07.05.12.12.12Zm1.9 3.48h1.36a.12.12 0 0 0 .12-.12V5.06a.12.12 0 0 0-.12-.12H9.06a.12.12 0 0 0-.12.12v1.22c0 .07.05.12.12.12Z",
  },
] as const;
