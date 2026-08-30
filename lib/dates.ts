/**
 * Date formatting, kept apart from lib/blog.ts on purpose.
 *
 * `lib/blog.ts` is marked `server-only`, and importing it from a component
 * just to format a date drags the whole Sanity layer along and makes that
 * component unusable from a client tree. Two pure functions have no business
 * behind that boundary.
 */

/**
 * Rendered on the server in one fixed locale.
 *
 * `toLocaleDateString` with no locale reads the runtime's, which differs
 * between a build machine and a browser — that is a hydration mismatch on
 * every post card. The site is `en-GB` everywhere else; it is en-GB here too.
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** `2026-08-30`, for a <time> element's machine-readable attribute. */
export function isoDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}
