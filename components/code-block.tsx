"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A shell around markup Shiki already produced on the server.
 *
 * The highlighting is not done here — passing the raw source down and
 * highlighting in the browser would ship a WASM regex engine and a grammar to
 * every visitor for what is, on the landing page, four lines of shell. The
 * only reason this is a client component at all is the copy button.
 */
export function CodeBlock({
  code,
  html,
  filename,
  className = "",
}: {
  /** The raw text, for the clipboard. */
  code: string;
  /** Shiki output, rendered on the server. */
  html: string;
  /** Optional label for the block's header strip. */
  filename?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Older browsers, and any context where the clipboard API is blocked.
      const area = document.createElement("textarea");
      area.value = code;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch {
        return;
      } finally {
        document.body.removeChild(area);
      }
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`min-w-0 overflow-hidden rounded-xl border border-code-line bg-code-bg ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-code-line px-4 py-2">
        <span className="font-mono text-[12px] text-muted">
          {filename ?? "shell"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {/* aria-live so a screen reader hears the confirmation too. */}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div
        className="px-4 py-3.5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4.75" y="4.75" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9.75 2.75a1.5 1.5 0 0 0-1.5-1.5h-5a2 2 0 0 0-2 2v5a1.5 1.5 0 0 0 1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
