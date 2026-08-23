"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

import { DOC_GROUPS, entryBySlug } from "@/lib/docs-manifest";

/**
 * Below `lg` there is no rail, so the same tree collapses into a native
 * <details>. No library, no focus trap to get wrong, and it works before
 * hydration.
 */
export function DocsMobileNav() {
  const pathname = usePathname();
  const details = useRef<HTMLDetailsElement>(null);

  const slug = pathname.replace(/^\/docs\/?/, "");
  const current = entryBySlug(slug);

  return (
    <details
      ref={details}
      className="group border-b border-line bg-ground lg:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-3.5 text-[15px] font-medium text-ink marker:hidden md:px-8">
        <span className="flex items-center gap-2 text-muted">
          Documentation
          {current ? (
            <>
              <span aria-hidden="true">/</span>
              <span className="text-ink">{current.navTitle ?? current.title}</span>
            </>
          ) : null}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-muted transition-transform group-open:rotate-45"
        >
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </summary>

      <div className="border-t border-line px-6 py-4 md:px-8">
        {DOC_GROUPS.map((group) => (
          <div key={group.id} className="mb-4 last:mb-0">
            <p className="px-2 pb-1.5 text-[12px] font-semibold tracking-wide text-muted uppercase">
              {group.title}
            </p>
            {group.entries.map((entry) => {
              const href = `/docs/${entry.slug}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={entry.slug}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => details.current?.removeAttribute("open")}
                  className={`block rounded-md px-2 py-2 text-[15px] ${
                    isActive ? "font-medium text-ink" : "text-body hover:bg-surface"
                  }`}
                >
                  {entry.navTitle ?? entry.title}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </details>
  );
}
