import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

/**
 * One read-only client, or none.
 *
 * There is no token and no `useCdn: false` escape hatch on purpose: everything
 * this site reads is published content, served from Sanity's CDN, and baked
 * into static HTML at build time. Nothing here runs per-request in production,
 * so there is nothing for a token to protect.
 *
 * `perspective: "published"` is explicit rather than inherited. It is the
 * client default today, and it is the single setting that decides whether a
 * half-written draft can reach a reader.
 */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

/**
 * Every read goes through here.
 *
 * Two things it guarantees. First, an unconfigured checkout gets `fallback`
 * rather than an exception, so the build stays green before the project
 * exists. Second, a Sanity outage degrades to the same empty state instead of
 * failing a whole deploy — a marketing site that cannot build because a blog
 * post could not be fetched is a worse failure than a blog page that is briefly
 * short an entry.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  if (!client) return fallback;

  try {
    return await client.fetch<T>(query, params, {
      // Revalidation is what keeps every blog route `●` rather than `ƒ`:
      // prerendered at build, refreshed in the background after ten minutes.
      // See the ISR note in the README before changing this.
      next: { revalidate: 600, tags: ["sanity"] },
    });
  } catch (error) {
    console.error(`[sanity] query failed, falling back\n${query}\n`, error);
    return fallback;
  }
}
