/**
 * The cairn mark, drawn inline.
 *
 * Inline rather than `<img src="/logo.svg">` because an `<img>` cannot inherit
 * a colour — the mark would be frozen at the green it was exported with and
 * would sit wrong on one of the two themes. Here the fill is `currentColor`
 * and the caller decides.
 *
 * The paths and their transforms are the product's own web/static/logo.svg
 * unchanged; only the fill differs. Resolved, the three stones sit at x 2–302,
 * 0–198 and 3–102 against a 302×156 viewBox, so the mark is left-aligned
 * rather than centred and its box is exactly the artwork.
 *
 * Decorative wherever the wordmark sits beside it, which is everywhere on this
 * site — so it is hidden from assistive technology rather than read out twice.
 */
const ASPECT = 302 / 156;

export function CairnMark({
  size = 18,
  className = "",
}: {
  /** Height in px. Width follows the 1.94:1 artwork aspect. */
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size * ASPECT}
      height={size}
      viewBox="0 0 302 156"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ fillRule: "evenodd", clipRule: "evenodd" }}
    >
      <g transform="matrix(1,0,0,1,-99,-181)">
        <g transform="matrix(0.568182,0,0,0.808511,11.227273,-63.212766)">
          <path d="M686,471.5C686,484.47 671.016,495 652.56,495L191.44,495C172.984,495 158,484.47 158,471.5C158,458.53 172.984,448 191.44,448L652.56,448C671.016,448 686,458.53 686,471.5Z" />
        </g>
        <g transform="matrix(0.375,0,0,0.808511,39.75,-122.212766)">
          <path d="M686,471.5C686,484.47 663.297,495 635.333,495L208.667,495C180.703,495 158,484.47 158,471.5C158,458.53 180.703,448 208.667,448L635.333,448C663.297,448 686,458.53 686,471.5Z" />
        </g>
        <g transform="matrix(0.1875,0,0,0.808511,72.375,-181.212766)">
          <path d="M686,471.5C686,484.47 640.594,495 584.667,495L259.333,495C203.406,495 158,484.47 158,471.5C158,458.53 203.406,448 259.333,448L584.667,448C640.594,448 686,458.53 686,471.5Z" />
        </g>
      </g>
    </svg>
  );
}
