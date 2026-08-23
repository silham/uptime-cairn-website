"use client";

import { useEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./theme-script";

type Theme = "light" | "dark";

/**
 * The source of truth for the theme is the `dark` class on <html>, because
 * that is what the inline head script sets before React exists. This subscribes
 * to that class rather than mirroring it into component state — the two could
 * otherwise disagree, and the one that would be wrong is the one driving the
 * accessible label.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/* The server has no way to know; React re-reads on the client after hydration. */
function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    // Follow the OS only while the visitor has not made a choice. Once
    // uc-theme is set, an OS change must not override it.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(THEME_STORAGE_KEY)) return;
      } catch {
        return;
      }
      document.documentElement.classList.toggle("dark", event.matches);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing, or storage disabled. The toggle still works for this
      // page view; it just will not be remembered.
    }
  }

  // Both icons are always laid out and only their opacity changes, in a fixed
  // 34px box — so the navbar cannot shift when the label resolves on hydration.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className={`relative grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-md border border-line text-muted transition-colors hover:bg-surface hover:text-ink ${className}`}
    >
      <SunIcon className="col-start-1 row-start-1 transition-opacity dark:opacity-0" />
      <MoonIcon className="col-start-1 row-start-1 opacity-0 transition-opacity dark:opacity-100" />
    </button>
  );
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1.4v1.5M8 13.1v1.5M14.6 8h-1.5M2.9 8H1.4M12.67 3.33l-1.06 1.06M4.39 11.61l-1.06 1.06M12.67 12.67l-1.06-1.06M4.39 4.39L3.33 3.33"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M13.5 9.6A5.9 5.9 0 0 1 6.4 2.5a5.9 5.9 0 1 0 7.1 7.1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
