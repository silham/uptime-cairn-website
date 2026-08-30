/**
 * The Sanity connection, and the one flag the rest of the blog checks.
 *
 * `isSanityConfigured` exists because this repository builds without a Sanity
 * project: a clone with no `.env.local` must still produce a green
 * `npm run build`, and it does — the blog routes render an empty state instead
 * of throwing at data-fetch time. The moment the two public variables are set
 * the same code paths light up with real content.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/**
 * Pinned, not floating. GROQ and the query API are versioned by date, and an
 * unpinned client silently changes behaviour under you — the exact failure
 * this site's docs-sync and `repoRef` pinning exist to avoid elsewhere.
 */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-01";

export const isSanityConfigured = projectId !== "";

/** Where the embedded Studio is mounted. Kept here so robots.ts agrees. */
export const STUDIO_BASE_PATH = "/studio";
