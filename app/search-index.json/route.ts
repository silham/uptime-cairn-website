import { buildSearchIndex } from "@/lib/search-index";

/**
 * Prerendered to a static file at build time, so on Vercel this is served from
 * the edge cache rather than by a function. The index is built from the same
 * renders as the pages, so it costs nothing extra.
 */
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await buildSearchIndex());
}
