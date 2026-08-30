/**
 * The Studio takes the whole viewport.
 *
 * The site's navbar and footer live in the root layout, and a root layout
 * cannot know which route is rendering — so rather than splitting the app into
 * two root layouts (which would move every route into a group and leave the
 * 404 without a layout), this segment suppresses the two chrome elements with
 * a scoped stylesheet. It is the only route on the site that does this, and it
 * is why `SiteNavbar` renders a bare `<header>` and `SiteFooter` a bare
 * `<footer>` as direct children of `<body>` — those two selectors are the
 * contract.
 *
 * React hoists this <style> into <head> and dedupes it by href.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style href="studio-chrome" precedence="high">
        {"body > header, body > footer { display: none }"}
      </style>
      {children}
    </>
  );
}
