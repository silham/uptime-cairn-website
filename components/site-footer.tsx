import Link from "next/link";

import { CairnMark } from "./cairn-mark";
import { Container } from "./container";
import { ArrowUpRightIcon } from "./external-link";
import { DOC_GROUPS } from "@/lib/docs-manifest";
import { FOOTER_COLUMNS, SITE, SOCIALS, type FooterColumn } from "@/lib/site";

/* Derived from the same manifest as the sidebar and the landing page's docs
   teaser, so the three cannot drift apart. */
const DOCS_COLUMN: FooterColumn = {
  title: "Documentation",
  links: [
    { label: "All docs", href: "/docs" },
    ...DOC_GROUPS.flatMap((group) =>
      group.entries.map((entry) => ({
        label: entry.navTitle ?? entry.title,
        href: `/docs/${entry.slug}`,
      })),
    ),
  ],
};

const COLUMNS = [DOCS_COLUMN, ...FOOTER_COLUMNS];

export function SiteFooter() {
  return (
    <footer>
      <Container className="grid gap-12 border-x border-t border-line px-6 py-16 md:grid-cols-12 md:px-8 md:py-20">
        <div className="md:col-span-4">
          <Link href="/" className="flex items-center gap-2.5">
            <CairnMark size={16} className="text-accent-ink" />
            <span className="text-[17px] font-semibold tracking-tight text-ink">
              Uptime Cairn
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted">
            Free, open source, and self-hosted uptime monitoring. One container,
            one file of data, no database server to set up.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid h-[34px] w-[34px] place-items-center rounded-md border border-line text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                <svg width="16" height="16" viewBox={social.viewBox} fill="currentColor" aria-hidden="true">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title} className="md:col-span-2">
            <p className="text-[12px] font-semibold tracking-wide text-muted uppercase">
              {column.title}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[15px] text-body transition-colors hover:text-ink"
                    >
                      {link.label}
                      <ArrowUpRightIcon size={11} />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[15px] text-body transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <Container className="flex flex-col gap-3 border-x border-y border-line px-6 py-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p>
          &copy; {new Date().getFullYear()} <a href={SITE.authorUrl} target="_blank" rel="noreferrer" className="text-accent-ink underline underline-offset-[3px]">
            {SITE.author}
          </a>
          . Released under{" "}
          <a
            href={SITE.licenceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-accent-ink underline underline-offset-[3px]"
          >
            Apache 2.0
          </a>
          . Nothing is held back for a paid tier.
        </p>
        <p>
          Found a security problem?{" "}
          <a
            href={`mailto:${SITE.securityEmail}`}
            className="text-accent-ink underline underline-offset-[3px]"
          >
            {SITE.securityEmail}
          </a>
        </p>
      </Container>
    </footer>
  );
}
