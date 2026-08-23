/**
 * An anchor that visibly leaves the site.
 *
 * A lot of this site's "read more" links land on GitHub rather than on a page
 * here, so the arrow is not decoration — it is the only signal a reader gets
 * that the next click is a context switch.
 */
export function ExternalLink({
  href,
  children,
  className = "",
  showArrow = true,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      {children}
      {showArrow ? <ArrowUpRightIcon /> : null}
    </a>
  );
}

export function ArrowUpRightIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The horizontal arrow used on every in-site "read more" link. */
export function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
