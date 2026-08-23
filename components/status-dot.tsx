import type { Heartbeat } from "./uptime-bar";

const FILL: Record<Heartbeat, string> = {
  up: "bg-up",
  down: "bg-down",
  pending: "bg-pending",
  maintenance: "bg-maintenance",
  unknown: "bg-unknown",
  skipped: "bg-skipped",
};

/**
 * The compact form of a heartbeat — a single stone, rounded all the way.
 * Decorative by default: whatever sits beside it names the status in words.
 */
export function StatusDot({
  status,
  className = "",
}: {
  status: Heartbeat;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[7px] w-[7px] shrink-0 rounded-full ${FILL[status]} ${className}`}
    />
  );
}
