/**
 * The site's one bespoke visual idea.
 *
 * The logo is three stacked rounded stones; the product's dashboard paints
 * uptime as a row of thin rounded bars in the status colours. They are the
 * same shape at two rotations, and this component makes that rhyme explicit.
 *
 * HONESTY RULE, non-negotiable: this is always a legend or a diagram, never a
 * readout. No random sequences, no clock, no animation implying polling, no
 * invented uptime percentages. Every `beats` array passed to it is a
 * hardcoded constant illustrating something the documentation actually says.
 * A marketing site that fakes a live monitor is lying about the one thing the
 * product exists to tell the truth about.
 *
 * The fills are the product's own status colours in both themes, so the key
 * genuinely matches what the dashboard shows. Because five of the six fail AA
 * against white, meaning is never carried by the colour alone — every use
 * pairs a bar with the status's `code` name.
 */
export type Heartbeat =
  | "up"
  | "down"
  | "pending"
  | "maintenance"
  | "unknown"
  | "skipped";

const FILL: Record<Heartbeat, string> = {
  up: "bg-up",
  down: "bg-down",
  pending: "bg-pending",
  maintenance: "bg-maintenance",
  unknown: "bg-unknown",
  skipped: "bg-skipped",
};

const DIMS = {
  sm: "h-4 w-[3px]",
  md: "h-8 w-[4px]",
  lg: "h-12 w-[6px]",
} as const;

export function UptimeBar({
  beats,
  size = "md",
  label,
  className = "",
}: {
  /** A fixed, meaningful sequence. Never generated. */
  beats: Heartbeat[];
  size?: keyof typeof DIMS;
  /** Required when the bar carries meaning; omit only when decorative. */
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-end gap-[3px] ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {beats.map((beat, index) => (
        <span
          key={index}
          className={`${DIMS[size]} rounded-[2px] ${FILL[beat]}`}
        />
      ))}
    </div>
  );
}
