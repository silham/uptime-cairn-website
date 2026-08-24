/**
 * Copies documentation, the OpenAPI spec, and the product screenshots out of
 * the Uptime Cairn repository into this one.
 *
 * Why copies rather than reading the sibling checkout at build time: Vercel
 * clones one repository, so `../uptime-cairn` does not exist in the build
 * container. A submodule would work but drags an entire Go repo into every
 * build for five markdown files, and makes a website-only correction require a
 * commit in the product repo.
 *
 * The markdown is copied byte for byte. That is deliberate — `--check` is then
 * a plain buffer comparison, which is the whole anti-drift mechanism. Nothing
 * is rewritten on the way in; the rendering pipeline does all of that at build
 * time from the untouched source.
 *
 *   npm run sync:docs          copy, and rewrite the version constants
 *   npm run sync:docs:check    exit non-zero if anything has drifted
 *
 * Run the check on a schedule rather than in `build` — a stale doc must never
 * block a deploy of an unrelated change.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_REPO =
  process.env.UPTIME_CAIRN_PATH ??
  path.resolve(process.cwd(), "..", "uptime-cairn");

const SITE_ROOT = process.cwd();
const CHECK = process.argv.includes("--check");

/** Markdown copied into content/docs/. Paths are relative to each repo root. */
const MARKDOWN: { from: string; to: string }[] = [
  { from: "docs/guides/install.md", to: "content/docs/guides/install.md" },
  { from: "docs/guides/quickstart.md", to: "content/docs/guides/quickstart.md" },
  { from: "docs/guides/monitor-types.md", to: "content/docs/guides/monitor-types.md" },
  { from: "docs/guides/alerting.md", to: "content/docs/guides/alerting.md" },
  {
    from: "docs/guides/migrating-from-uptime-kuma.md",
    to: "content/docs/guides/migrating-from-uptime-kuma.md",
  },
  // Not routed. Synced so that upstream changes to the API conventions show up
  // in this repo's diff, since /docs/api is hand-written from it.
  { from: "docs/api/README.md", to: "content/docs/api/README.md" },

  // Not a guide and not routed under /docs, so it sits at the content root
  // rather than in the docs tree. It has its own page at /changelog.
  { from: "CHANGELOG.md", to: "content/CHANGELOG.md" },
];

/** Binary and non-markdown assets. */
const ASSETS: { from: string; to: string }[] = [
  { from: "docs/api/openapi.yaml", to: "public/openapi.yaml" },
  { from: "screenshots/dashboard.png", to: "public/screenshots/dashboard.png" },
  { from: "screenshots/monitor.png", to: "public/screenshots/monitor.png" },
  { from: "screenshots/statusPage.png", to: "public/screenshots/status-page.png" },
];

function git(...args: string[]): string {
  try {
    return execFileSync("git", args, { cwd: SOURCE_REPO, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

async function main() {
  if (!existsSync(SOURCE_REPO)) {
    console.error(
      `Source repository not found at ${SOURCE_REPO}.\n` +
        `Set UPTIME_CAIRN_PATH to point at a checkout of uptime-cairn.`,
    );
    process.exit(1);
  }

  const sha = git("rev-parse", "HEAD");
  const shortSha = git("rev-parse", "--short", "HEAD");
  const tag = git("describe", "--tags", "--abbrev=0");

  const drifted: string[] = [];
  const written: string[] = [];

  for (const file of [...MARKDOWN, ...ASSETS]) {
    const source = path.join(SOURCE_REPO, file.from);
    const target = path.join(SITE_ROOT, file.to);

    if (!existsSync(source)) {
      console.error(`Missing in source repository: ${file.from}`);
      process.exit(1);
    }

    const content = await readFile(source);

    if (CHECK) {
      if (!existsSync(target)) {
        drifted.push(`${file.to} — missing here`);
        continue;
      }
      const current = await readFile(target);
      if (!current.equals(content)) drifted.push(`${file.to} — differs from ${file.from}`);
      continue;
    }

    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content);
    written.push(file.to);
  }

  if (CHECK) {
    // The manifest records the commit the copies came from, so a drift report
    // can say what they are behind rather than just that they are behind.
    const manifestPath = path.join(SITE_ROOT, "content/MANIFEST.txt");
    const recorded = existsSync(manifestPath)
      ? (await readFile(manifestPath, "utf8")).match(/^commit: (\S+)/m)?.[1]
      : undefined;

    if (drifted.length === 0) {
      console.log(`In sync with ${SOURCE_REPO} (${shortSha}).`);
      return;
    }

    console.error(
      `Documentation has drifted from the product repository.\n` +
        (recorded && recorded !== sha
          ? `  synced from: ${recorded}\n  now at:      ${sha}\n\n`
          : "\n") +
        drifted.map((line) => `  ${line}`).join("\n") +
        `\n\nRun \`npm run sync:docs\` to bring them across.`,
    );
    process.exit(1);
  }

  await writeFile(
    path.join(SITE_ROOT, "content/MANIFEST.txt"),
    [
      "Files in content/docs/ and the synced assets in public/ are copied",
      "verbatim from the Uptime Cairn repository by scripts/sync-docs.ts.",
      "Do not edit them here — edit them there and re-run the sync.",
      "",
      "repository: https://github.com/webloomlabs/uptime-cairn",
      `commit: ${sha}`,
      `tag: ${tag}`,
      "",
      ...[...MARKDOWN, ...ASSETS].map((file) => `${file.to}  <-  ${file.from}`),
      "",
    ].join("\n"),
  );

  await updateVersionConstants(tag, sha);

  console.log(`Synced ${written.length} files from ${SOURCE_REPO} (${tag}, ${shortSha}).`);
}

/**
 * The release badge in the hero comes from SITE.version and every GitHub
 * fallback link from SITE.repoRef, so both are rewritten here from the product
 * repo rather than maintained by hand in two places.
 *
 * They are deliberately different things. `version` is the tag, because that is
 * what a reader recognises. `repoRef` is the exact commit the content was
 * copied from, because a tag is only correct until someone adds a file after
 * it: CHANGELOG.md and docs/why-uptime-cairn.md both landed after v1.0.1, and
 * linking them at that tag produced 404s on a page that had just been told they
 * existed. A commit SHA is immutable — so it keeps the property the tag was
 * chosen for — and it always contains exactly what was synced.
 */
async function updateVersionConstants(tag: string, sha: string) {
  const sitePath = path.join(SITE_ROOT, "lib/site.ts");
  const current = await readFile(sitePath, "utf8");

  let updated = current.replace(/repoRef: "[^"]*"/, `repoRef: "${sha}"`);
  if (/^v\d+\.\d+\.\d+/.test(tag)) {
    updated = updated.replace(/version: "[^"]*"/, `version: "${tag.replace(/^v/, "")}"`);
  }

  if (updated !== current) {
    await writeFile(sitePath, updated);
    console.log(`Updated lib/site.ts to ${tag} (${sha.slice(0, 7)}).`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
