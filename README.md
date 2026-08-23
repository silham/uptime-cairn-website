# uptimecairn.dev

The website and documentation for [Uptime Cairn](https://github.com/webloomlabs/uptime-cairn)
— a free, open source, self-hosted uptime monitoring platform.

Next.js 16 (App Router), TypeScript, Tailwind CSS v4. No UI library, no icon
package, no animation library, no analytics.

```sh
npm install
npm run dev          # http://localhost:3000
```

## Where things live

| | |
|---|---|
| `app/globals.css` | The entire theme. Every colour on the site is a token declared here, once for light and once for dark. |
| `lib/landing.ts` · `lib/product.ts` | All landing-page copy. Routes are thin templates over these constants. |
| `lib/docs-manifest.ts` | The single source of truth for the docs: routes, order, grouping, titles. Drives the sidebar, pager, sitemap, footer, teaser, and link rewriting. |
| `lib/markdown.ts` | The markdown pipeline, including the link rewriter. The riskiest code here. |
| `content/docs/` | Byte-identical copies of documentation from the product repo. **Do not edit these** — edit them there and re-run the sync. |

## Documentation sync

Documentation is written in the product repository and copied here verbatim, so
the website can never disagree with what shipped and the build stays hermetic
(Vercel clones one repo — a sibling checkout does not exist there).

```sh
npm run sync:docs         # copy docs, the OpenAPI spec, and screenshots
npm run sync:docs:check   # exit non-zero if anything has drifted
```

`sync:docs` also rewrites `SITE.version` and `SITE.repoRef` in `lib/site.ts`
from the product repo's own tag, so the release badge and every GitHub link
move together.

By default it reads `../uptime-cairn`; override with `UPTIME_CAIRN_PATH`.

`sync:docs:check` is deliberately **not** part of `build` — a stale doc must
never block a deploy of an unrelated change. Run it on a schedule instead.

## Checks

```sh
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run links:check  # every doc link resolves; no duplicate heading anchors
npm run build        # every route must print ○ or ● — never ƒ
```

`links:check` is the one that matters most. The source markdown is full of
repo-relative links, and `lib/markdown.ts` rewrites them to routes here or to
GitHub at the pinned release tag. Anything it cannot place is collected rather
than guessed at, and this turns that into a build failure — a silently broken
doc link is invisible until a reader hits it.

## Two rules worth knowing before editing

**`--accent` (`#32d583`) is a fill, never text.** It is 1.91:1 on white. Text,
links and focus rings use `--accent-ink`, which is the same hue darkened until
it clears AA in light mode and the product green itself in dark mode.
`rg 'text-accent\b'` must return no hits.

**`UptimeBar` is always a legend, never a readout.** No random sequences, no
clock, no animation implying polling, no invented uptime percentages. Every
sequence passed to it is a hardcoded constant illustrating something the
documentation actually says. A marketing site that fakes a live monitor is
lying about the one thing the product exists to tell the truth about.
