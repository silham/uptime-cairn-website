/**
 * Runs in <head>, before any stylesheet, so the correct theme is on <html> on
 * the very first paint. Without it a visitor who has chosen dark gets a white
 * flash on every navigation while React catches up.
 *
 * The site defaults to light and does not consult prefers-color-scheme. Dark
 * is opt-in: it applies only once someone has actually pressed the toggle.
 * That means the default is the same page for everyone, which is the point —
 * the OS preference decides how a visitor's own desktop looks, not which of
 * two designs a site they have never seen shows them first.
 *
 * Kept as a minified string on purpose: it is inlined into the document and
 * every byte here is render-blocking.
 */
export const THEME_STORAGE_KEY = "uc-theme";

export const themeScript = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
