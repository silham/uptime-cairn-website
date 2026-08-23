/*
 * Deliberately not marked `server-only`: scripts/check-links.ts runs this same
 * pipeline in plain Node, and the `server-only` package throws when it is
 * resolved outside the bundler. The boundary that matters is lib/docs.ts,
 * which is what React components import — this module is a pure function and
 * is only ever called from a server component or a build script.
 */
import { createHighlighter, type Highlighter } from "shiki";

/**
 * One highlighter per process, shared by the docs pipeline and by the code
 * samples on the landing page.
 *
 * Shiki loads a WASM regex engine and a grammar per language; creating one per
 * code block would dominate the build. The languages listed are exactly those
 * appearing in the docs corpus plus the two used in hand-written samples.
 *
 * `sh` and `bash` are aliases of `shellscript`; `console` is an alias of
 * `shellsession`. Anything else (the corpus has `caddyfile` and one `mermaid`
 * fence) falls back to plain text rather than throwing the build.
 */
const LANGS = [
  "shellscript",
  "shellsession",
  "json",
  "yaml",
  "sql",
  "protobuf",
  "nginx",
  "python",
  "go",
  "ini",
  "text",
];

const THEMES = { light: "github-light", dark: "github-dark-default" } as const;

let instance: Promise<Highlighter> | undefined;

export function highlighter(): Promise<Highlighter> {
  instance ??= createHighlighter({
    themes: [THEMES.light, THEMES.dark],
    langs: LANGS,
  });
  return instance;
}

/**
 * Both themes are baked into the same markup as CSS custom properties
 * (`defaultColor: false`), and two rules in globals.css choose between them.
 * That is the whole dual-theme highlighting implementation — no second render,
 * no flash when the toggle flips.
 */
export async function highlightCode(code: string, lang = "shellscript"): Promise<string> {
  const shiki = await highlighter();
  const loaded = shiki.getLoadedLanguages();
  return shiki.codeToHtml(code, {
    lang: loaded.includes(lang) ? lang : "text",
    themes: THEMES,
    defaultColor: false,
  });
}
