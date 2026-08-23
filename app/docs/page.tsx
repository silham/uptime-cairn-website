import type { Metadata } from "next";
import Link from "next/link";

import { DocsShell } from "@/components/docs-shell";
import { ArrowIcon, ArrowUpRightIcon, ExternalLink } from "@/components/external-link";
import { DOC_GROUPS } from "@/lib/docs-manifest";
import { SITE, githubBlob } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Documentation — Uptime Cairn" },
  description:
    "Install Uptime Cairn, set up your first monitor, and learn what each of the nine monitor types actually checks and how the thirteen alerting channels behave.",
  alternates: { canonical: "/docs" },
};

/** Things that live in the repository rather than here, named honestly. */
const ELSEWHERE = [
  {
    label: "Operations",
    href: githubBlob("docs/operations/"),
    description: "Backups, upgrades, reverse proxies, and what to alert on.",
  },
  {
    label: "Why this exists",
    href: githubBlob("docs/why-uptime-cairn.md"),
    description: "The design principles and the architecture behind them.",
  },
  {
    label: "Roadmap",
    href: githubBlob("ROADMAP.md"),
    description: "Reporting, teams, and scale — what is next and in what order.",
  },
  {
    label: "Architecture decisions",
    href: githubBlob("docs/adr/"),
    description: "Five ADRs: the probe split, storage, tenancy, UI state, probes.",
  },
  {
    label: "Security policy",
    href: githubBlob("SECURITY.md"),
    description: "How security is handled, and how to report a problem privately.",
  },
  {
    label: "Contributing",
    href: githubBlob("CONTRIBUTING.md"),
    description: "What is most useful right now, and how the project is governed.",
  },
];

export default function DocsIndexPage() {
  return (
    <DocsShell>
      <header>
        <p className="text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
          Documentation
        </p>
        <h1 className="mt-4 text-[38px] leading-[1.08] font-medium tracking-[-0.02em] text-ink md:text-[46px]">
          Everything you need
          <br className="hidden sm:block" /> to run it.
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted md:text-[19px]">
          These pages are copies of the documentation in the{" "}
          <ExternalLink
            href={SITE.github}
            className="text-accent-ink underline underline-offset-[3px]"
          >
            product repository
          </ExternalLink>
          , so they never disagree with what shipped. Anything not reproduced
          here is linked at the bottom.
        </p>
      </header>

      <div className="mt-14 flex flex-col gap-12">
        {DOC_GROUPS.map((group) => (
          <section key={group.id}>
            <h2 className="text-[13px] font-semibold tracking-wide text-muted uppercase">
              {group.title}
            </h2>
            <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
              {group.entries.map((entry, index) => (
                <Link
                  key={entry.slug}
                  href={`/docs/${entry.slug}`}
                  /* The grid paints its gaps, so an odd count would leave the
                     gap colour showing as an empty cell. The last card spans
                     the row instead. */
                  className={`group bg-ground px-5 py-6 transition-colors hover:bg-surface ${
                    index === group.entries.length - 1 &&
                    group.entries.length % 2 === 1
                      ? "sm:col-span-2"
                      : ""
                  }`}
                >
                  <h3 className="text-[17px] font-semibold tracking-tight text-ink">
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    {entry.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-ink">
                    Read it
                    <span className="transition-transform group-hover:translate-x-0.5">
                      <ArrowIcon />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="text-[13px] font-semibold tracking-wide text-muted uppercase">
            In the repository
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
            Deliberately not mirrored here — these change with the code and are
            better read beside it.
          </p>
          <ul className="mt-4 flex flex-col">
            {ELSEWHERE.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-1 border-b border-line py-4 transition-colors first:border-t hover:bg-surface sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-[15px] font-medium text-ink sm:w-56">
                    {item.label}
                    <ArrowUpRightIcon />
                  </span>
                  <span className="text-[15px] leading-relaxed text-muted">
                    {item.description}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DocsShell>
  );
}
