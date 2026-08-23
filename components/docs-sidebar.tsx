"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DOC_GROUPS } from "@/lib/docs-manifest";

/**
 * The rail. Active state comes from the pathname rather than being threaded
 * down from the page, so the sidebar stays correct through a client-side
 * navigation without the layout re-rendering.
 */
export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-8">
      {DOC_GROUPS.map((group) => (
        <div key={group.id}>
          <p className="px-3 text-[12px] font-semibold tracking-wide text-muted uppercase">
            {group.title}
          </p>
          <ul className="mt-2.5 flex flex-col">
            {group.entries.map((entry) => {
              const href = `/docs/${entry.slug}`;
              const isActive = pathname === href;
              return (
                <li key={entry.slug} className="relative">
                  {/* The same 2px rounded stone as UptimeBar — the active
                      marker reuses the site's one shape rather than adding
                      another idea. */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 bottom-1.5 left-0 w-[2px] rounded-[2px] bg-accent"
                    />
                  )}
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-md px-3 py-1.5 text-[15px] transition-colors ${
                      isActive
                        ? "font-medium text-ink"
                        : "text-body hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {entry.navTitle ?? entry.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
