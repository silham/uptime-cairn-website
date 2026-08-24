"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "@/lib/markdown";

/**
 * On-page contents with scroll-spy.
 *
 * The top margin offsets the sticky navbar and the bottom one keeps the
 * highlight on the heading you are reading rather than the one about to
 * arrive — without it, the active item jumps a section ahead near the end of
 * the page where several headings are on screen at once.
 */
export function DocsToc({
  items,
  label = "On this page",
}: {
  items: TocItem[];
  /** The changelog's headings are releases, so it labels the rail "Releases". */
  label?: string;
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label={label}>
      <p className="text-[12px] font-semibold tracking-wide text-muted uppercase">
        {label}
      </p>
      <ul className="mt-3 flex flex-col">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className="relative">
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 bottom-1 left-0 w-[2px] rounded-[2px] bg-accent"
                />
              )}
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`block py-1 pr-2 text-[13px] leading-snug transition-colors ${
                  item.depth === 3 ? "pl-6" : "pl-3"
                } ${isActive ? "font-medium text-ink" : "text-muted hover:text-ink"}`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
