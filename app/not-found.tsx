import Link from "next/link";

import { Container } from "@/components/container";
import { UptimeBar } from "@/components/uptime-bar";

export default function NotFound() {
  return (
    <Container className="border-x border-t border-line px-6 py-28 md:px-8 md:py-36">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        {/* The only place a `down` beat appears at size, and it is literally
            true of the thing you just asked for. */}
        <UptimeBar
          beats={["up", "up", "up", "down", "up", "up", "up"]}
          size="lg"
          label="Six passing checks and one failure"
        />
        <p className="mt-8 text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
          404
        </p>
        <h1 className="mt-4 text-[32px] leading-[1.1] font-medium tracking-[-0.02em] text-ink md:text-[40px]">
          This page is down.
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          The rest of the site is fine. Nothing was monitoring this one.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href="/"
            className="rounded-md bg-solid px-4 py-2 text-[14px] font-medium text-on-solid transition-colors hover:bg-solid-hover"
          >
            Back to the start
          </Link>
          <Link
            href="/docs"
            className="rounded-md border border-line-strong px-4 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-surface"
          >
            Browse the documentation
          </Link>
        </div>
      </div>
    </Container>
  );
}
