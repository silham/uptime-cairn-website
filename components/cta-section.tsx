import Link from "next/link";

import { CodeBlock } from "./code-block";
import { Container } from "./container";
import { ArrowUpRightIcon } from "./external-link";
import { Headline } from "./headline";
import { DOCKER_RUN, LANDING } from "@/lib/landing";
import { highlightCode } from "@/lib/highlight";

/** The page closer — the only centred content on the site. */
export async function CtaSection() {
  const { cta } = LANDING;
  const html = await highlightCode(DOCKER_RUN, "shellscript");

  return (
    <section>
      <Container className="border-x border-t border-line px-6 py-24 md:px-8 md:py-32">
        <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-col items-center text-center">
          <p className="mb-6 text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
            {cta.eyebrow}
          </p>
          <h2 className="text-[36px] leading-[1.06] font-medium tracking-[-0.02em] text-ink sm:text-[48px] md:text-[56px]">
            <Headline text={cta.headline} />
          </h2>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-muted md:text-[19px]">
            {cta.lead}
          </p>

          <CodeBlock
            code={DOCKER_RUN}
            html={html}
            className="mt-9 w-full text-left"
          />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href={cta.primary.href}
              className="rounded-md bg-solid px-5 py-2.5 text-[15px] font-medium text-on-solid transition-colors hover:bg-solid-hover"
            >
              {cta.primary.label}
            </Link>
            <a
              href={cta.secondary.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-line-strong px-5 py-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-surface"
            >
              {cta.secondary.label}
              <ArrowUpRightIcon />
            </a>
          </div>

          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-muted">
            {cta.footnote}
          </p>
        </div>
      </Container>
    </section>
  );
}
