import { readFile } from "node:fs/promises";
import path from "node:path";

import { ExternalLink } from "./external-link";
import type { DocEntry } from "@/lib/docs-manifest";
import { githubEdit } from "@/lib/site";

/**
 * The page is a copy of a file in the product repository, and saying so is the
 * honest thing to do: a correction belongs upstream, where it also reaches
 * everyone reading the docs inside a checkout.
 */
export async function DocMeta({ entry }: { entry: DocEntry }) {
  if (!entry.sourceRepoPath) return null;

  const commit = await syncedCommit();

  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-6 text-[13px] text-muted">
      <ExternalLink
        href={githubEdit(entry.sourceRepoPath)}
        className="font-medium text-ink transition-colors hover:text-muted"
      >
        Edit this page on GitHub
      </ExternalLink>
      <span className="font-mono">
        {entry.sourceRepoPath}
        {commit ? ` · synced from ${commit}` : ""}
      </span>
    </div>
  );
}

/** Read from the sync manifest so the stamp cannot be edited independently. */
async function syncedCommit(): Promise<string | undefined> {
  try {
    const manifest = await readFile(
      path.join(process.cwd(), "content", "MANIFEST.txt"),
      "utf8",
    );
    return manifest.match(/^commit: (\S+)/m)?.[1]?.slice(0, 7);
  } catch {
    return undefined;
  }
}
