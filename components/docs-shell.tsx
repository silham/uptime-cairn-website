import { Container } from "./container";
import { DocsMobileNav } from "./docs-mobile-nav";
import { DocsSearch } from "./docs-search";
import { DocsSidebar } from "./docs-sidebar";
import { DocsToc } from "./docs-toc";
import type { TocItem } from "@/lib/markdown";

/**
 * Three columns inside the same 1280px Container the rest of the site uses, so
 * the two vertical rules carry straight on through the docs. Both rails are
 * sticky under the h-18 navbar; below `lg` they collapse into the disclosure
 * nav at the top and the contents are dropped rather than stacked, because a
 * table of contents above the article on a phone is just a wall to scroll past.
 */
export function DocsShell({
  toc,
  children,
}: {
  toc?: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <>
      <DocsMobileNav />
      <Container className="border-x border-line lg:grid lg:grid-cols-[236px_minmax(0,1fr)_204px]">
        <div className="hidden border-r border-line lg:block">
          <div className="sticky top-18 max-h-[calc(100vh-4.5rem)] overflow-y-auto px-4 py-10">
            <DocsSearch className="mb-8" />
            <DocsSidebar />
          </div>
        </div>

        <div className="min-w-0 px-6 py-12 md:px-10 md:py-16">{children}</div>

        <div className="hidden border-l border-line lg:block">
          <div className="sticky top-18 max-h-[calc(100vh-4.5rem)] overflow-y-auto px-4 py-10">
            {toc ? <DocsToc items={toc} /> : null}
          </div>
        </div>
      </Container>
    </>
  );
}
