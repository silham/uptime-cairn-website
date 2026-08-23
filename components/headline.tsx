import { Fragment } from "react";

/**
 * Renders "\n" in headline copy as a break that only applies above `sm`.
 *
 * Display headings on this site are broken by hand so the lines balance at
 * desktop widths; on a phone the same break would strand a single word, so it
 * collapses. Keeping the marker in the copy constants means the break travels
 * with the words it belongs to.
 */
export function Headline({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <>
              <br className="hidden sm:block" />{" "}
            </>
          )}
          {line}
        </Fragment>
      ))}
    </>
  );
}
