/*
 * Deliberately not marked `server-only`: scripts/check-links.ts runs this
 * pipeline in plain Node, and the `server-only` package throws when resolved
 * outside the bundler. lib/docs.ts carries the marker instead — that is the
 * module React components import.
 */
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { Element, Root as HastRoot, RootContent } from "hast";
import type { Link, Root as MdastRoot } from "mdast";
import path from "node:path";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import { highlighter } from "./highlight";
import { SOURCE_TO_ROUTE } from "./docs-manifest";
import { SITE } from "./site";

export type TocItem = { id: string; text: string; depth: 2 | 3 };

export type DocSection = {
  /** The h2 that opens this section; empty for the lead paragraphs. */
  heading: string;
  /** Slug of that h2, for a deep link. */
  id: string;
  /** Plain text of everything under it, collapsed. */
  text: string;
};

export type UnresolvedLink = { url: string; line?: number };

export type RenderedDoc = {
  html: string;
  toc: TocItem[];
  sections: DocSection[];
  unresolved: UnresolvedLink[];
};

/* -------------------------------------------------------------------------- */
/* Local plugins                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The page's <h1> comes from the manifest, not from the file, so the file's own
 * leading H1 would render a duplicate heading immediately under it.
 */
function remarkDropLeadingH1() {
  return (tree: MdastRoot) => {
    const first = tree.children[0];
    if (first?.type === "heading" && first.depth === 1) {
      tree.children.shift();
    }
  };
}

/**
 * Rewrites the repo-relative links in the source markdown so they resolve on
 * this site.
 *
 * The docs were written to be read inside a Git checkout, so they link to each
 * other as `install.md`, to files as `../../SECURITY.md`, and to the spec as
 * `../api/openapi.yaml`. Left alone every one of those is a 404 here.
 *
 * Anything that has a page on this site becomes an internal route. Everything
 * else falls back to GitHub at the pinned release tag — not `main` — so a link
 * cannot silently start pointing at a file that has since moved.
 *
 * Anything that resolves to neither is collected rather than guessed at, and
 * `scripts/check-links.ts` turns that collection into a build failure. Silent
 * 404s are the most likely way this whole feature goes wrong.
 */
function remarkRewriteLinks(options: {
  /** Directory of this file inside the product repo, e.g. "docs/guides". */
  sourceDir: string;
  unresolved: UnresolvedLink[];
}) {
  const { sourceDir, unresolved } = options;

  return (tree: MdastRoot) => {
    visit(tree, "link", (node: Link) => {
      const url = node.url;

      // In-page anchors survive untouched: rehype-slug reproduces GitHub's
      // slugs, so a fragment written against the GitHub rendering still lands.
      if (url.startsWith("#")) return;
      if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return; // http:, https:, mailto:

      const hashIndex = url.indexOf("#");
      const target = hashIndex === -1 ? url : url.slice(0, hashIndex);
      const fragment = hashIndex === -1 ? "" : url.slice(hashIndex);

      if (target === "") {
        node.url = fragment;
        return;
      }

      const resolved = path.posix.normalize(path.posix.join(sourceDir, target));

      if (resolved === "docs/api/openapi.yaml") {
        node.url = "/openapi.yaml";
        return;
      }

      const route = SOURCE_TO_ROUTE.get(resolved);
      if (route) {
        node.url = route + fragment;
        return;
      }

      if (resolved.startsWith("..")) {
        unresolved.push({ url, line: node.position?.start.line });
        return;
      }

      node.url = `${SITE.github}/blob/${SITE.repoRef}/${resolved}${fragment}`;
    });
  };
}

/**
 * Marks outbound links. The arrow itself is a CSS ::after in globals.css, so no
 * extra nodes are inserted into the prose.
 */
function rehypeExternalLinks() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;
      const href = node.properties?.href;
      if (typeof href !== "string" || !href.startsWith("http")) return;
      node.properties.target = "_blank";
      node.properties.rel = ["noreferrer"];
    });
  };
}

/* -------------------------------------------------------------------------- */
/* Extraction                                                                 */
/* -------------------------------------------------------------------------- */

/** Text content, skipping the appended heading anchor. */
function textOf(node: RootContent | Element): string {
  if (node.type === "text") return node.value;
  if (node.type !== "element") return "";

  const className = node.properties?.className;
  const classes = Array.isArray(className)
    ? className
    : className != null
      ? [className]
      : [];
  if (classes.some((entry) => entry === "heading-anchor")) return "";

  return node.children.map((child) => textOf(child)).join("");
}

function isHeading(node: RootContent): node is Element {
  return node.type === "element" && (node.tagName === "h2" || node.tagName === "h3");
}

/**
 * Built from the hast tree rather than by scanning the markdown for lines
 * starting with `#`. The corpus contains fenced blocks whose content begins
 * with `#` — Prometheus `# HELP` output, shell comments — and a regex happily
 * lists those as sections.
 *
 * h4 is omitted: it is too deep for a 200px rail, and alerting.md alone has
 * thirteen h3s under one heading.
 */
function extractToc(tree: HastRoot): TocItem[] {
  const items: TocItem[] = [];
  for (const node of tree.children) {
    if (!isHeading(node)) continue;
    const id = node.properties?.id;
    if (typeof id !== "string") continue;
    items.push({
      id,
      text: textOf(node).trim(),
      depth: node.tagName === "h2" ? 2 : 3,
    });
  }
  return items;
}

/** One record per h2, for the search index. Built from the same tree. */
function extractSections(tree: HastRoot): DocSection[] {
  const sections: DocSection[] = [];
  let current: DocSection = { heading: "", id: "", text: "" };

  for (const node of tree.children) {
    if (node.type === "element" && node.tagName === "h2") {
      if (current.text.trim() || current.heading) sections.push(current);
      const id = node.properties?.id;
      current = {
        heading: textOf(node).trim(),
        id: typeof id === "string" ? id : "",
        text: "",
      };
      continue;
    }
    if (node.type === "element" || node.type === "text") {
      current.text += ` ${textOf(node)}`;
    }
  }
  if (current.text.trim() || current.heading) sections.push(current);

  return sections.map((section) => ({
    ...section,
    text: section.text.replace(/\s+/g, " ").trim(),
  }));
}

/* -------------------------------------------------------------------------- */

export async function renderMarkdown(
  markdown: string,
  options: { sourceRepoPath: string },
): Promise<RenderedDoc> {
  const unresolved: UnresolvedLink[] = [];
  const sourceDir = path.posix.dirname(options.sourceRepoPath);

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDropLeadingH1)
    .use(remarkRewriteLinks, { sourceDir, unresolved })
    // The corpus contains no raw HTML outside backticks, so dropping it is
    // both safe and one less thing to sanitise.
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: { className: ["heading-anchor"], ariaLabel: "Link to this section" },
      content: {
        type: "element",
        tagName: "span",
        properties: {},
        children: [{ type: "text", value: "#" }],
      },
    })
    .use(rehypeShikiFromHighlighter, await highlighter(), {
      themes: { light: "github-light", dark: "github-dark-default" },
      // Emit both themes as CSS custom properties; two rules in globals.css
      // pick one. No second render, and no flash when the toggle flips.
      defaultColor: false,
      // The corpus has `caddyfile` and one `mermaid` fence, neither of which
      // has a grammar loaded. Falling back beats failing the build.
      fallbackLanguage: "text",
    })
    .use(rehypeExternalLinks);

  const tree = (await processor.run(processor.parse(markdown))) as HastRoot;

  const html = unified()
    .use(rehypeStringify, { allowDangerousHtml: false })
    .stringify(tree);

  return {
    html,
    toc: extractToc(tree),
    sections: extractSections(tree),
    unresolved,
  };
}
