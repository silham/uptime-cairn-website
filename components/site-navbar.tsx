"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CairnMark } from "./cairn-mark";
import { Container } from "./container";
import { ArrowUpRightIcon } from "./external-link";
import { ThemeToggle } from "./theme-toggle";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ground/85 backdrop-blur-md">
      <Container className="px-6 md:px-8">
        <div className="flex h-18 items-center">
          <Link href="/" className="mr-10 flex shrink-0 items-center gap-2.5">
            <CairnMark size={16} className="text-accent-ink" />
            <span className="text-[17px] font-semibold tracking-tight text-ink">
              Uptime Cairn
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] text-body transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2.5 md:flex">
            <ThemeToggle />
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-line-strong px-4 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-surface"
            >
              GitHub
              <ArrowUpRightIcon />
            </a>
            <Link
              href="/#install"
              className="rounded-md bg-solid px-4 py-2 text-[14px] font-medium text-on-solid transition-colors hover:bg-solid-hover"
            >
              Install with Docker
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-md text-body"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                ) : (
                  <path d="M1 4H17M1 9H17M1 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {menuOpen && (
        <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-line bg-ground px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="block rounded-md px-2 py-2 text-[15px] text-body hover:bg-surface"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-line px-2 pt-4">
            <Link
              href="/#install"
              onClick={close}
              className="rounded-md bg-solid px-4 py-2 text-[14px] font-medium text-on-solid"
            >
              Install with Docker
            </Link>
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-line-strong px-4 py-2 text-[14px] font-medium text-ink"
            >
              GitHub
              <ArrowUpRightIcon />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
