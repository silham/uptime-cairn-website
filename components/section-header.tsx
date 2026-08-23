import { Container } from "./container";
import { Headline } from "./headline";

/**
 * The two-column band that opens most sections: a small label and a
 * hand-broken headline on the left, one bottom-aligned paragraph on the right.
 * Repeated verbatim across the page, which is what gives it its rhythm.
 */
export function SectionHeader({
  label,
  headline,
  intro,
  id,
}: {
  label: string;
  /** "\n" marks a line break that only applies above `sm`. */
  headline: string;
  intro?: string;
  id?: string;
}) {
  return (
    <Container
      id={id}
      className="grid gap-10 border-x border-t border-line px-6 py-20 md:grid-cols-2 md:px-8 md:py-24"
    >
      <div>
        <p className="mb-5 text-[14px] font-medium text-muted">{label}</p>
        <h2 className="text-[34px] leading-[1.08] font-medium tracking-[-0.02em] text-ink md:text-[44px]">
          <Headline text={headline} />
        </h2>
      </div>
      {intro ? (
        <div className="flex items-end">
          <p className="max-w-md text-[17px] leading-relaxed text-muted md:text-[19px]">
            {intro}
          </p>
        </div>
      ) : null}
    </Container>
  );
}
