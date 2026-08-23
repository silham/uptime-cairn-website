/**
 * Runs in <head>, before any stylesheet, so the correct theme is on <html>
 * on the very first paint. Without this the page renders light and then flips,
 * which on a slow connection is a full white flash for a dark-mode visitor.
 *
 * Kept as a minified string on purpose — it is inlined into the document and
 * every byte here is render-blocking.
 */
export const THEME_STORAGE_KEY = "uc-theme";

export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";}if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
