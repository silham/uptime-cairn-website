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
| `sanity/schemaTypes/` | The blog's content model. One file per document type. |
| `lib/blog.ts` | The blog's server boundary. Every route reads through it; nothing else touches Sanity. |
| `lib/sanity/queries.ts` | Every GROQ query, as an explicit projection. |

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

## The blog

Blog posts are written in [Sanity](https://www.sanity.io) and read at build
time. Unlike the docs, nothing is copied into this repository — the content
lives in a dataset and the site is a static reader of it.

The site builds and runs **without** a Sanity project. `/blog` renders an empty
state, the sitemap omits it, and nothing throws. That is what
`isSanityConfigured` in `lib/sanity/env.ts` is for, and it is why a fresh clone
needs no secrets to get a green `npm run build`.

### Connecting one

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) and note
   its project ID.
2. `cp .env.local.example .env.local` and fill in
   `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. Add `http://localhost:3000` and `https://uptimecairn.dev` as CORS origins for
   the project, both with credentials allowed. The Studio will not log in
   without them.
4. `npm run dev`, then open <http://localhost:3000/studio> and write a post.

Both variables are `NEXT_PUBLIC_` on purpose. They identify a dataset, not a
person, and the Studio needs them in the browser. There is no read token,
because everything this site reads is already published.

```sh
npm run schema:extract   # write the schema to schema.json
npm run schema:deploy    # publish it, so Sanity's own tooling knows the types
```

### How it stays static

Every blog route sets `revalidate = 600` and every Sanity read goes through
`sanityFetch`, which sets the same window. Posts are prerendered at build time
via `generateStaticParams`, and one published between deploys is generated on
first request and then cached — so the build output stays `○`/`●` and the
site keeps no per-request server work.

There is deliberately **no** on-demand revalidation webhook and no draft
preview. Both need a `ƒ` route and a shared secret, and a ten-minute window is
an honest trade for a blog that publishes a few times a month. Add them if that
stops being true; do not add them by default.

### Rules for the blog

**`excerpt` is required and is not the first paragraph.** It is the card on
`/blog`, the meta description, and the text on the social card. A post whose
excerpt was written as an afterthought is a post that reads badly in all three
places.

**`.prose-doc` styles the blog and the docs alike.** A code fence from the
Studio and a code fence from a markdown file in the product repo are the same
object, highlighted by the same Shiki instance in `lib/highlight.ts`. Change
one and you change both — which is the point.

**A Portable Text type without a renderer throws in development.** Adding a
block type to `sanity/schemaTypes/blockContent.ts` without adding its case to
`components/portable-text.tsx` would otherwise render as silence. See
`unknownType` there.

## Checks

```sh
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run links:check  # every doc link resolves; no duplicate heading anchors
npm run build        # every route must print ○ or ● — never ƒ
```

The `ƒ` rule covers the blog too: `/blog`, `/blog/[slug]`,
`/blog/category/[slug]`, `/blog/rss.xml` and `/studio` are all prerendered, and
a change that turns any of them into a function is a change worth arguing
about, not one to wave through.

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
