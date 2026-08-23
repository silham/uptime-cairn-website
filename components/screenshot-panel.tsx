"use client";

import Image from "next/image";
import { useState } from "react";

type Shot = {
  id: string;
  tab: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

/**
 * The page's one dark panel, and the answer to a real problem: the product's
 * UI is dark and this site is not, so pasting three dark screenshots onto a
 * white page would look like an accident.
 *
 * So it is not fought. The screenshots ARE the page's single high-contrast
 * panel — matted deliberately, the way a print would be. In dark mode the mat
 * becomes the raised surface with a visible edge, because it cannot go darker
 * than the ground it sits on.
 *
 * Click to switch, and nothing autoplays. A carousel that moves on its own
 * takes the reader's attention away from the thing they were reading.
 */
export function ScreenshotPanel({ shots }: { shots: readonly Shot[] }) {
  const [activeId, setActiveId] = useState(shots[0]!.id);
  const active = shots.find((shot) => shot.id === activeId) ?? shots[0]!;

  return (
    <div className="rounded-xl border border-panel-edge bg-panel p-3 md:p-5">
      <div
        role="tablist"
        aria-label="Product screenshots"
        className="flex flex-wrap items-center gap-1.5"
      >
        {shots.map((shot) => {
          const isActive = shot.id === active.id;
          return (
            <button
              key={shot.id}
              type="button"
              role="tab"
              id={`shot-tab-${shot.id}`}
              aria-selected={isActive}
              aria-controls={`shot-panel-${shot.id}`}
              onClick={() => setActiveId(shot.id)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-panel-chip text-panel-ink"
                  : "text-panel-muted hover:text-panel-ink"
              }`}
            >
              {shot.tab}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`shot-panel-${active.id}`}
        aria-labelledby={`shot-tab-${active.id}`}
        className="mt-3"
      >
        <Image
          // Keyed by id so the browser does not cross-fade one screenshot into
          // the next at a different aspect ratio.
          key={active.id}
          src={active.src}
          alt={active.alt}
          width={active.width}
          height={active.height}
          sizes="(min-width: 1280px) 1216px, 100vw"
          priority
          className="w-full rounded-lg ring-1 ring-panel-line"
        />
        <p className="mt-3 px-1 font-mono text-[13px] text-panel-body">
          {active.caption}
        </p>
      </div>
    </div>
  );
}
