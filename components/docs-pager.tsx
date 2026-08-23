import Link from "next/link";

import { neighbours } from "@/lib/docs-manifest";

/** Previous and next in manifest order, so the docs read as a sequence. */
export function DocsPager({ slug }: { slug: string }) {
  const { prev, next } = neighbours(slug);
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Documentation pages"
      className="mt-16 grid gap-px border-t border-line pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group rounded-lg border border-line px-5 py-4 transition-colors hover:bg-surface"
        >
          <span className="text-[13px] text-muted">Previous</span>
          <span className="mt-1 block text-[16px] font-medium text-ink">
            {prev.navTitle ?? prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group rounded-lg border border-line px-5 py-4 text-right transition-colors hover:bg-surface"
        >
          <span className="text-[13px] text-muted">Next</span>
          <span className="mt-1 block text-[16px] font-medium text-ink">
            {next.navTitle ?? next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
