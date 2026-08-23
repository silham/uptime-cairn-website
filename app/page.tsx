import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import {
  AlertingBand,
  ClaimBand,
  ComparisonBand,
  DocsTeaserBand,
  MonitorTypesBand,
  NameBand,
  ScreenshotBand,
  StatusPagesBand,
  StatusesBand,
} from "@/components/landing-bands";
import { Container } from "@/components/container";
import { CtaSection } from "@/components/cta-section";
import { Headline } from "@/components/headline";
import { SectionHeader } from "@/components/section-header";
import { UptimeBar } from "@/components/uptime-bar";
import { highlightCode } from "@/lib/highlight";
import { DOCKER_RUN, KUMA_IMPORT, LANDING } from "@/lib/landing";
import { CAPABILITIES, HEARTBEAT_STATUSES } from "@/lib/product";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE.name} — Self-hosted uptime monitoring and status pages`,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [dockerRunHtml, kumaImportHtml] = await Promise.all([
    highlightCode(DOCKER_RUN, "shellscript"),
    highlightCode(KUMA_IMPORT, "shellscript"),
  ]);

  return (
    <>
      {/* The one block that earns a rich result: this really is free, and
          `offers.price: 0` is what says so in a way a crawler can read. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd()) }}
      />
      <HeroBand />
      <InstallBand html={dockerRunHtml} />
      <ScreenshotBand />
      <CapabilitiesBand />
      <MonitorTypesBand />
      <StatusesBand />
      <AlertingBand />
      <StatusPagesBand />
      <ClaimBand />
      <ComparisonBand importHtml={kumaImportHtml} />
      <NameBand />
      <DocsTeaserBand />
      <CtaSection />
    </>
  );
}

function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    description: SITE.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Docker, Linux, macOS",
    softwareVersion: SITE.version,
    license: SITE.licenceUrl,
    codeRepository: SITE.github,
    url: SITE.url,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: SITE.author },
  };
}

/* -------------------------------------------------------------------------- */

function HeroBand() {
  const { hero } = LANDING;

  return (
    <section>
      <Container className="border-x border-t border-line px-6 pt-16 pb-12 md:px-8 md:pt-24 md:pb-16">
        <p className="mb-6 text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
          {hero.eyebrow}
        </p>
        <h1 className="max-w-5xl text-[38px] leading-[1.05] font-medium tracking-[-0.02em] text-ink sm:text-[56px] md:text-[68px]">
          <Headline text={hero.headline} />
        </h1>
        <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-muted md:text-[19px]">
          {hero.lead}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-2.5">
          <Link
            href={hero.primary.href}
            className="rounded-md bg-solid px-4 py-2 text-[14px] font-medium text-on-solid transition-colors hover:bg-solid-hover"
          >
            {hero.primary.label}
          </Link>
          <Link
            href={hero.secondary.href}
            className="rounded-md border border-line-strong px-4 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-surface"
          >
            {hero.secondary.label}
          </Link>
        </div>

        <p className="mt-10 font-mono text-[13px] text-muted">
          {hero.facts.join("  ·  ")}
        </p>
      </Container>

      <StatusLegend />
    </section>
  );
}

/**
 * The hero's key, not a readout. Every bar is a fixed three-beat swatch of one
 * status, sitting under its own name — so it reads as a legend at a glance and
 * cannot be mistaken for a live monitor.
 */
function StatusLegend() {
  const { hero } = LANDING;

  return (
    <Container className="border-x border-t border-line px-6 py-8 md:px-8">
      <p className="text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
        {hero.legendCaption}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
        {HEARTBEAT_STATUSES.map((status) => (
          <div key={status.id} className="flex items-center gap-3">
            <UptimeBar beats={[status.id, status.id, status.id]} size="sm" />
            <code className={`font-mono text-[13px] ${status.ink}`}>
              {status.id}
            </code>
          </div>
        ))}
      </div>
    </Container>
  );
}

/* -------------------------------------------------------------------------- */

function InstallBand({ html }: { html: string }) {
  const { install } = LANDING;

  return (
    <section>
      <Container
        id="install"
        className="grid gap-10 border-x border-t border-line px-6 py-20 md:grid-cols-2 md:px-8 md:py-24"
      >
        <div>
          <p className="mb-5 text-[14px] font-medium text-muted">
            {install.label}
          </p>
          <h2 className="text-[34px] leading-[1.08] font-medium tracking-[-0.02em] text-ink md:text-[44px]">
            <Headline text={install.headline} />
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted md:text-[19px]">
            {install.lead}
          </p>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
            {install.portNote}
          </p>
        </div>
        <div className="flex min-w-0 items-start">
          <CodeBlock code={DOCKER_RUN} html={html} className="w-full" />
        </div>
      </Container>

      <Container className="grid border-x border-t border-line md:grid-cols-3">
        {install.alternatives.map((item) => (
          <div
            key={item.number}
            className="border-r border-b border-line px-6 py-10 last:border-r-0 md:px-8 md:py-12"
          >
            <span className="font-mono text-[13px] text-muted">
              {item.number}
            </span>
            <h3 className="mt-4 text-[19px] font-semibold tracking-tight text-ink">
              {item.title}
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-muted md:text-[17px]">
              {item.description}
            </p>
          </div>
        ))}
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function CapabilitiesBand() {
  const { capabilities } = LANDING;

  return (
    <section>
      <SectionHeader
        label={capabilities.label}
        headline={capabilities.headline}
        intro={capabilities.intro}
      />
      <Container className="grid border-x border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((item) => (
          <div
            key={item.number}
            className="border-r border-b border-line px-6 py-10 last:border-r-0 md:px-8 md:py-12"
          >
            <span className="font-mono text-[13px] text-muted">
              {item.number}
            </span>
            <h3 className="mt-4 text-[19px] font-semibold tracking-tight text-ink">
              {item.title}
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-muted md:text-[17px]">
              {item.description}
            </p>
          </div>
        ))}
      </Container>
    </section>
  );
}
