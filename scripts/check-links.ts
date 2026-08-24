/**
 * Renders every documentation page and fails if any link in the source
 * markdown could not be resolved to a route on this site or to a file in the
 * product repository.
 *
 * The docs were written to be read inside a Git checkout and are full of
 * relative links. The rewriter in lib/markdown.ts turns those into something
 * that works here, and anything it cannot place is collected rather than
 * guessed at. This is what turns that collection into a build failure — a
 * silently broken doc link is the most likely way the docs section goes wrong,
 * and it is invisible until a reader hits it.
 *
 *   npm run links:check
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import { MARKDOWN_ENTRIES } from "../lib/docs-manifest";
import { renderMarkdown } from "../lib/markdown";

const CONTENT_DIR = path.join(process.cwd(), "content", "docs");

async function main() {
  let failures = 0;
  let checked = 0;

  // The changelog is not in the docs manifest but goes through the same
  // rewriter, and it is the file most likely to gain new links over time.
  const targets = [
    ...MARKDOWN_ENTRIES.map((entry) => ({
      file: path.join(CONTENT_DIR, entry.source!),
      sourceRepoPath: entry.sourceRepoPath!,
    })),
    {
      file: path.join(process.cwd(), "content", "CHANGELOG.md"),
      sourceRepoPath: "CHANGELOG.md",
    },
  ];

  for (const entry of targets) {
    const markdown = await readFile(entry.file, "utf8");
    const { unresolved, toc } = await renderMarkdown(markdown, {
      sourceRepoPath: entry.sourceRepoPath,
    });

    checked += 1;

    if (unresolved.length > 0) {
      failures += unresolved.length;
      console.error(`\n${entry.sourceRepoPath}`);
      for (const link of unresolved) {
        console.error(`  line ${link.line ?? "?"}: ${link.url}`);
      }
    }

    // A duplicate anchor means two TOC entries scroll to the same place.
    const seen = new Set<string>();
    for (const item of toc) {
      if (seen.has(item.id)) {
        failures += 1;
        console.error(`\n${entry.sourceRepoPath}\n  duplicate anchor: #${item.id}`);
      }
      seen.add(item.id);
    }
  }

  if (failures > 0) {
    console.error(`\n${failures} problem(s) across ${checked} documents.`);
    process.exit(1);
  }

  console.log(`${checked} documents checked, every link resolved.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
