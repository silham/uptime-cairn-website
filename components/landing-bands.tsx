import Link from "next/link";

import { CodeBlock } from "./code-block";
import { Container } from "./container";
import { ArrowIcon, ArrowUpRightIcon } from "./external-link";
import { Headline } from "./headline";
import { ScreenshotPanel } from "./screenshot-panel";
import { SectionHeader } from "./section-header";
import { UptimeBar } from "./uptime-bar";
import { KUMA_IMPORT, LANDING } from "@/lib/landing";
import {
  ALERT_EVENTS,
  AVOID,
  FIT,
  HEARTBEAT_STATUSES,
  MONITOR_TYPES,
  NOTIFICATION_CHANNELS,
  STATS,
} from "@/lib/product";
import { CairnMark } from "./cairn-mark";
import { DOC_GROUPS } from "@/lib/docs-manifest";
import { githubBlob } from "@/lib/site";

/* -------------------------------------------------------------------------- */

export function ScreenshotBand() {
  const { screenshots } = LANDING;

  return (
    <section>
      <Container className="border-x border-t border-line px-6 pt-20 pb-8 md:px-8 md:pt-24">
        <p className="mb-5 text-[14px] font-medium text-muted">
          {screenshots.label}
        </p>
        <h2 className="text-[34px] leading-[1.08] font-medium tracking-[-0.02em] text-ink md:text-[44px]">
          <Headline text={screenshots.headline} />
        </h2>
      </Container>
      <Container className="border-x border-t border-line px-6 py-8 md:px-8">
        <ScreenshotPanel shots={screenshots.shots} />
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export function MonitorTypesBand() {
  const { monitors } = LANDING;

  return (
    <section>
      <SectionHeader
        label={monitors.label}
        headline={monitors.headline}
        intro={monitors.intro}
      />
      <Container className="grid border-x border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {MONITOR_TYPES.map((type) => (
          <Link
            key={type.id}
            href={`/docs/monitor-types#${type.anchor}`}
            className="group border-r border-b border-line px-6 py-10 transition-colors last:border-r-0 hover:bg-surface md:px-8 md:py-12"
          >
            <code className="font-mono text-[13px] text-accent-ink">
              {type.id}
            </code>
            <h3 className="mt-3 text-[19px] font-semibold tracking-tight text-ink">
              {type.title}
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-muted md:text-[17px]">
              {type.blurb}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-ink">
              What it checks
              <span className="transition-transform group-hover:translate-x-0.5">
                <ArrowIcon />
              </span>
            </span>
          </Link>
        ))}
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The colour band — the one place the status palette is used at size. Every
 * swatch is paired with the status's own `code` name, because five of the six
 * product colours fail AA on white and meaning must never rest on hue alone.
 */
export function StatusesBand() {
  const { statuses } = LANDING;

  return (
    <section>
      <SectionHeader
        label={statuses.label}
        headline={statuses.headline}
        intro={statuses.intro}
      />
      <Container className="grid border-x border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {HEARTBEAT_STATUSES.map((status) => (
          <div
            key={status.id}
            className="flex gap-5 border-r border-b border-line px-6 py-10 last:border-r-0 md:px-8 md:py-12"
          >
            <UptimeBar beats={[status.id, status.id, status.id]} size="lg" />
            <div>
              <code className={`font-mono text-[15px] font-medium ${status.ink}`}>
                {status.id}
              </code>
              <p className="mt-2 text-[16px] leading-relaxed text-muted md:text-[17px]">
                {status.meaning}
              </p>
            </div>
          </div>
        ))}
      </Container>
      <Container className="border-x border-t border-line px-6 py-14 md:px-8 md:py-16">
        <p className="max-w-3xl text-[19px] leading-relaxed text-body md:text-[21px]">
          <code className="font-mono text-[0.9em] text-unknown-ink">unknown</code>{" "}
          is not a soft{" "}
          <code className="font-mono text-[0.9em] text-down-ink">down</code>. A DNS
          lookup failing because the target&apos;s record is gone is{" "}
          <code className="font-mono text-[0.9em] text-down-ink">down</code> — a
          statement about the target. The same lookup failing because{" "}
          <em>this host&apos;s</em> resolver is unreachable is{" "}
          <code className="font-mono text-[0.9em] text-unknown-ink">unknown</code>{" "}
          — a statement about the probe.
        </p>
        <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-muted md:text-[17px]">
          Collapsing the two would mean one broken probe paging an entire on-call
          rotation about services that were never affected. Where a checker
          cannot tell the difference, it reports{" "}
          <code className="font-mono text-[0.9em] text-unknown-ink">unknown</code>.
          That is a rule rather than a preference.
        </p>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export function AlertingBand() {
  const { alerting } = LANDING;

  return (
    <section>
      <SectionHeader
        label={alerting.label}
        headline={alerting.headline}
        intro={alerting.intro}
      />

      <Container className="border-x border-t border-line px-6 py-10 md:px-8 md:py-12">
        <div className="flex flex-wrap gap-2">
          {NOTIFICATION_CHANNELS.map((channel) => (
            <span
              key={channel.label}
              className="inline-flex items-center gap-2 rounded-md border border-line px-2.5 py-1 text-[13px] text-body"
            >
              {channel.label}
              {channel.badge ? (
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-body">
                  {channel.badge}
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </Container>

      <Container className="grid border-x border-t border-line md:grid-cols-2">
        <div className="border-r border-b border-line px-6 py-10 last:border-r-0 md:px-8 md:py-12">
          <h3 className="text-[19px] font-semibold tracking-tight text-ink">
            {alerting.eventsTitle}
          </h3>
          <dl className="mt-5 flex flex-col gap-3">
            {ALERT_EVENTS.map((event) => (
              <div key={event.event} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                <dt className="shrink-0 font-mono text-[13px] text-accent-ink sm:w-64">
                  {event.event}
                </dt>
                <dd className="text-[15px] leading-relaxed text-muted">
                  {event.when}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[15px] leading-relaxed text-muted">
            {alerting.eventsBlurb}
          </p>
        </div>

        <div className="border-b border-line px-6 py-10 md:px-8 md:py-12">
          <h3 className="text-[19px] font-semibold tracking-tight text-ink">
            {alerting.quietTitle}
          </h3>
          <div className="mt-5 flex flex-col gap-4">
            {alerting.quietBody.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[16px] leading-relaxed text-muted md:text-[17px]"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <Link
            href="/docs/alerting"
            className="group mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-ink transition-colors hover:text-muted"
          >
            Every channel, in detail
            <span className="transition-transform group-hover:translate-x-0.5">
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export function StatusPagesBand() {
  const { statusPages } = LANDING;

  return (
    <section>
      <Container className="border-x border-t border-line px-6 pt-20 pb-4 md:px-8 md:pt-24">
        <p className="mb-5 text-[14px] font-medium text-muted">
          {statusPages.label}
        </p>
        <h2 className="text-[34px] leading-[1.08] font-medium tracking-[-0.02em] text-ink md:text-[44px]">
          <Headline text={statusPages.headline} />
        </h2>
      </Container>
      <Container className="grid border-x border-t border-line md:grid-cols-2">
        {statusPages.cards.map((card) => (
          <div
            key={card.number}
            className="border-r border-b border-line px-6 py-10 last:border-r-0 md:px-8 md:py-12"
          >
            <span className="font-mono text-[13px] text-muted">{card.number}</span>
            <h3 className="mt-4 text-[19px] font-semibold tracking-tight text-ink">
              {card.title}
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-muted md:text-[17px]">
              {card.body}
            </p>
          </div>
        ))}
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export function ClaimBand() {
  const { claim } = LANDING;

  return (
    <section>
      <Container className="grid gap-10 border-x border-t border-line px-6 py-20 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <p className="mb-5 text-[14px] font-medium text-muted">{claim.label}</p>
          <p className="max-w-md text-[30px] leading-[1.15] font-medium tracking-[-0.02em] text-ink md:text-[40px]">
            {claim.quote}
          </p>
        </div>
        <div className="flex items-end">
          <p className="max-w-md text-[17px] leading-relaxed text-muted md:text-[19px]">
            {claim.body}
          </p>
        </div>
      </Container>
      <Container className="grid border-x border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="border-r border-b border-line px-6 py-10 last:border-r-0 md:px-8"
          >
            <p className="text-[34px] leading-none font-medium tracking-[-0.02em] text-ink">
              {stat.value}
            </p>
            <p className="mt-2 text-[15px] font-medium text-ink">{stat.label}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">
              {stat.note}
            </p>
          </div>
        ))}
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export function ComparisonBand({ importHtml }: { importHtml: string }) {
  const { comparison } = LANDING;

  return (
    <section>
      <SectionHeader
        label={comparison.label}
        headline={comparison.headline}
        intro={comparison.intro}
      />
      <Container className="grid border-x border-t border-line md:grid-cols-2">
        <div className="border-r border-b border-line px-6 py-10 md:px-8 md:py-12">
          <h3 className="text-[19px] font-semibold tracking-tight text-ink">
            {comparison.fitTitle}
          </h3>
          <ul className="mt-5 flex flex-col gap-3">
            {FIT.map((line) => (
              <li key={line} className="flex gap-3">
                <TickIcon />
                <span className="text-[16px] leading-relaxed text-muted md:text-[17px]">
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-b border-line px-6 py-10 md:px-8 md:py-12">
          <h3 className="text-[19px] font-semibold tracking-tight text-ink">
            {comparison.avoidTitle}
          </h3>
          <ul className="mt-5 flex flex-col gap-3">
            {AVOID.map((line) => (
              <li key={line} className="flex gap-3">
                <DashIcon />
                <span className="text-[16px] leading-relaxed text-muted md:text-[17px]">
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="grid gap-8 border-x border-t border-line px-6 py-10 md:grid-cols-2 md:px-8 md:py-12">
        <div>
          <h3 className="text-[19px] font-semibold tracking-tight text-ink">
            {comparison.importTitle}
          </h3>
          <p className="mt-3 max-w-md text-[16px] leading-relaxed text-muted md:text-[17px]">
            {comparison.importBody}
          </p>
          <Link
            href="/docs/migrating-from-uptime-kuma"
            className="group mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-ink transition-colors hover:text-muted"
          >
            See what the importer brings across
            <span className="transition-transform group-hover:translate-x-0.5">
              <ArrowIcon />
            </span>
          </Link>
        </div>
        <div className="flex min-w-0 items-center">
          <CodeBlock code={KUMA_IMPORT} html={importHtml} className="w-full" />
        </div>
      </Container>
    </section>
  );
}

function TickIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-1 shrink-0 text-accent-ink"
    >
      <path
        d="M3 8.5 6.5 12 13 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-1 shrink-0 text-subtle"
    >
      <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

export function NameBand() {
  return (
    <section>
      <Container className="border-x border-t border-line px-6 py-20 md:px-8 md:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <CairnMark size={64} className="text-accent" />
          <p className="mt-8 text-[19px] leading-relaxed text-body md:text-[21px]">
            {LANDING.name.body}
          </p>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/** Built from the docs manifest, so it cannot drift from the sidebar. */
export function DocsTeaserBand() {
  const { docsTeaser } = LANDING;
  const entries = DOC_GROUPS.flatMap((group) => group.entries);

  return (
    <section>
      <SectionHeader label={docsTeaser.label} headline={docsTeaser.headline} />
      <Container className="grid border-x border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={`/docs/${entry.slug}`}
            className="group border-r border-b border-line px-6 py-10 transition-colors last:border-r-0 hover:bg-surface md:px-8 md:py-12"
          >
            <h3 className="text-[19px] font-semibold tracking-tight text-ink">
              {entry.title}
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-muted md:text-[17px]">
              {entry.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-ink">
              Read it
              <span className="transition-transform group-hover:translate-x-0.5">
                <ArrowIcon />
              </span>
            </span>
          </Link>
        ))}

        {/* Deliberately last and deliberately outbound: the manifesto lives in
            the product repo and is not worth mirroring here. */}
        <a
          href={githubBlob("docs/why-uptime-cairn.md")}
          target="_blank"
          rel="noreferrer"
          className="border-r border-b border-line px-6 py-10 transition-colors last:border-r-0 hover:bg-surface sm:col-span-2 lg:col-span-3 md:px-8 md:py-12"
        >
          <h3 className="text-[19px] font-semibold tracking-tight text-ink">
            Why this exists
          </h3>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted md:text-[17px]">
            The design principles and the architecture behind them — why one
            binary, why SQLite, and what &ldquo;no feature is paywalled&rdquo;
            actually commits to. It lives in the product repository.
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-ink">
            Read it on GitHub
            <ArrowUpRightIcon />
          </span>
        </a>
      </Container>
    </section>
  );
}
