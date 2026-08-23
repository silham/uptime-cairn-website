/**
 * The entire layout system.
 *
 * Every section band is a Container carrying `border-x border-t border-line`,
 * which draws two continuous vertical rules down the full height of the page
 * at the 1280px gutters with a hairline between each band. The page reads as a
 * ledger rather than as stacked cards, and that grid is the site's only
 * ornament — so a band that forgets its borders is a visible bug.
 */
export function Container({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  /** Set when the band is an anchor target, e.g. the install section. */
  id?: string;
}) {
  return (
    <div id={id} className={`mx-auto w-full max-w-[1280px] ${className}`}>
      {children}
    </div>
  );
}
