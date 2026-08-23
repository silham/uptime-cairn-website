"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { SearchRecord } from "@/lib/search-index";

/**
 * Search over six documents.
 *
 * The whole index is one static JSON file of about thirty kilobytes, fetched
 * the first time the dialog opens and then kept on the module. At this corpus
 * size a search service, or even a fuzzy-matching dependency, would cost more
 * than it returns — the scoring below is fifty lines and it is deterministic,
 * which matters more here than cleverness.
 */

let cached: SearchRecord[] | undefined;
let inFlight: Promise<SearchRecord[]> | undefined;

function loadIndex(): Promise<SearchRecord[]> {
  if (cached) return Promise.resolve(cached);
  inFlight ??= fetch("/search-index.json")
    .then((response) => response.json() as Promise<SearchRecord[]>)
    .then((records) => {
      cached = records;
      return records;
    })
    .catch(() => {
      inFlight = undefined;
      return [];
    });
  return inFlight;
}

type Scored = SearchRecord & { score: number };

function search(records: SearchRecord[], query: string): Scored[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const results: Scored[] = [];

  records.forEach((record, index) => {
    const heading = record.h.toLowerCase();
    const title = record.d.toLowerCase();
    const body = record.t.toLowerCase();
    const haystack = `${heading} ${title} ${body}`;

    // Every token must appear somewhere, so a two-word query narrows rather
    // than widens — the usual complaint about naive search.
    if (!tokens.every((token) => haystack.includes(token))) return;

    let score = 0;
    for (const token of tokens) {
      if (heading.startsWith(token)) score += 8;
      else if (heading.includes(token)) score += 5;
      if (title.includes(token)) score += 3;
      if (body.includes(token)) score += 1;
    }

    // Manifest order breaks ties, so results are stable and read in the order
    // the docs are meant to be read.
    results.push({ ...record, score: score * 1000 - index });
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 8);
}

/** Wraps matched substrings so the reason a result matched is visible. */
function Highlighted({ text, tokens }: { text: string; tokens: string[] }) {
  if (tokens.length === 0) return <>{text}</>;
  const pattern = new RegExp(
    `(${tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "ig",
  );
  return (
    <>
      {text.split(pattern).map((part, index) =>
        tokens.some((token) => token.toLowerCase() === part.toLowerCase()) ? (
          <mark key={index} className="rounded-[2px] bg-accent-soft font-medium text-accent-ink">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export function DocsSearch({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<SearchRecord[]>(cached ?? []);
  const [active, setActive] = useState(0);

  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => search(records, query), [records, query]);
  const tokens = useMemo(
    () => query.toLowerCase().split(/\s+/).filter(Boolean),
    [query],
  );

  const openDialog = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActive(0);
    void loadIndex().then(setRecords);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  /* Cmd/Ctrl+K from anywhere, and "/" when not already typing somewhere. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openDialog();
        return;
      }
      if (event.key === "/" && !typing && !open) {
        event.preventDefault();
        openDialog();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, openDialog]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  /**
   * While the dialog is open the rest of the page is inert and cannot scroll.
   * aria-modal alone tells assistive technology to ignore what is behind, but
   * it does not stop a pointer, a scroll, or a stray focus getting there —
   * inert does, and it is why the overlay is portalled to <body> rather than
   * rendered inside the sidebar it is triggered from.
   */
  useEffect(() => {
    if (!open) return;

    const overlay = overlayRef.current;
    const behind = Array.from(document.body.children).filter(
      (element) => element !== overlay,
    );
    behind.forEach((element) => element.setAttribute("inert", ""));

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      behind.forEach((element) => element.removeAttribute("inert"));
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function onDialogKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (results.length ? (index + 1) % results.length : 0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) =>
        results.length ? (index - 1 + results.length) % results.length : 0,
      );
      return;
    }
    if (event.key === "Enter") {
      const result = results[active];
      if (result) {
        event.preventDefault();
        router.push(result.u);
        closeDialog();
      }
      return;
    }
    // Keep focus inside the dialog. Two focusables, so a plain wrap is enough.
    if (event.key === "Tab") {
      event.preventDefault();
      inputRef.current?.focus();
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        className={`flex w-full cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-2 text-[14px] text-muted transition-colors hover:bg-surface hover:text-ink ${className}`}
      >
        <SearchIcon />
        <span>Search docs</span>
        <kbd className="ml-auto font-mono text-[11px] text-muted">⌘K</kbd>
      </button>

      {/* Portalled to <body> so everything else can be marked inert. The
          dialog only ever opens from a user event, which is necessarily after
          hydration, so `document` is always there by the time this runs. */}
      {open &&
        createPortal(
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/25 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={(event) => {
            if (!dialogRef.current?.contains(event.target as Node)) closeDialog();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            onKeyDown={onDialogKeyDown}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-ground shadow-xl shadow-ink/10"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                placeholder="Search the documentation"
                aria-label="Search the documentation"
                role="combobox"
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={
                  results[active] ? `${listId}-${active}` : undefined
                }
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-transparent text-[16px] text-ink placeholder:text-muted focus:outline-none"
              />
              <kbd className="font-mono text-[11px] text-muted">Esc</kbd>
            </div>

            {/* A listbox's options must be its direct children, so this is a
                plain div rather than a <ul> — wrapping each option in an <li>
                breaks both the list semantics and the listbox contract. */}
            <div
              id={listId}
              role="listbox"
              aria-label="Results"
              className="max-h-[52vh] overflow-y-auto"
            >
              {results.map((result, index) => (
                <a
                  key={`${result.u}-${index}`}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  href={result.u}
                  onMouseEnter={() => setActive(index)}
                  onClick={closeDialog}
                  className={`block border-b border-line px-4 py-3 last:border-b-0 ${
                    index === active ? "bg-surface" : ""
                  }`}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="text-[15px] font-medium text-ink">
                      <Highlighted text={result.h} tokens={tokens} />
                    </span>
                    <span className="text-[12px] text-body">{result.d}</span>
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[13px] leading-relaxed text-body">
                    <Highlighted text={result.t} tokens={tokens} />
                  </span>
                </a>
              ))}

              {query && results.length === 0 && (
                <p className="px-4 py-6 text-[14px] text-body">
                  Nothing matched &ldquo;{query}&rdquo;.
                </p>
              )}
              {!query && (
                <p className="px-4 py-6 text-[14px] text-body">
                  Type to search across every documentation page.
                </p>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
