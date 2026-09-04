/**
 * Facts about the product, lifted from its own documentation.
 *
 * Every string here traces to a line in the source repo, and the `source:`
 * comment on each constant names where. That is the mechanism that keeps the
 * site honest as the product moves: if a claim cannot be pointed at a document,
 * it does not belong in this file.
 */
import type { Heartbeat } from "@/components/uptime-bar";

/* source: docs/guides/monitor-types.md — "The vocabulary, first" */
export const HEARTBEAT_STATUSES: {
  id: Heartbeat;
  meaning: string;
  /** Text colour twin — the raw fill fails AA on white. */
  ink: string;
}[] = [
  { id: "up", meaning: "The check ran and passed.", ink: "text-up-ink" },
  { id: "down", meaning: "The check ran and the target failed it.", ink: "text-down-ink" },
  { id: "pending", meaning: "Nothing has been checked yet. Not a verdict.", ink: "text-pending-ink" },
  { id: "maintenance", meaning: "Suppressed by a maintenance window.", ink: "text-maintenance-ink" },
  { id: "unknown", meaning: "The probe could not perform the check.", ink: "text-unknown-ink" },
  { id: "skipped", meaning: "The probe shed the check under load.", ink: "text-unknown-ink" },
];

/* source: docs/guides/monitor-types.md — one line per type, its own words */
export const MONITOR_TYPES: {
  id: string;
  title: string;
  blurb: string;
  /** Anchor within /docs/monitor-types, as github-slugger produces it. */
  anchor: string;
}[] = [
  {
    id: "http",
    title: "HTTP and HTTPS",
    blurb:
      "The workhorse. Four assertions evaluated in order — status code, keyword, JSON path, response time — and the first failure is what the alert reports, so the message names the actual cause.",
    anchor: "http--http-and-https",
  },
  {
    id: "tcp",
    title: "A port is open",
    blurb:
      "A completed TCP handshake within the timeout. Nothing is sent and nothing is read — the right check for a database or a broker whose protocol you do not want to speak.",
    anchor: "tcp--a-port-is-open",
  },
  {
    id: "icmp",
    title: "Ping",
    blurb:
      "Tries the unprivileged ICMP datagram socket first, then a raw socket. The type with the most environment-specific behaviour, so it has the most explicit handling.",
    anchor: "icmp--ping",
  },
  {
    id: "dns",
    title: "A record resolves, and to what",
    blurb:
      "All ten record types, with any / all / exact matching. Walks every nameserver in resolv.conf, records NXDOMAIN and SERVFAIL verbatim, and retries truncated answers over TCP.",
    anchor: "dns--a-record-resolves-and-to-what",
  },
  {
    id: "tls_expiry",
    title: "A certificate is still valid",
    blurb:
      "The handshake is made unverified and the chain checked by hand, so an expired certificate is reported as expiry rather than as a generic TLS error you have to decode.",
    anchor: "tls_expiry--a-certificate-is-still-valid",
  },
  {
    id: "domain_expiry",
    title: "The registration has not lapsed",
    blurb:
      "RDAP first, WHOIS where a registry offers none. Checked once a day per domain regardless of the interval — registries rate-limit and the data changes once a year.",
    anchor: "domain_expiry--the-registration-has-not-lapsed",
  },
  {
    id: "push",
    title: "A dead-man's switch",
    blurb:
      "Backwards from every other type: nothing is checked, something calls you. For cron jobs and batch work that are supposed to check in and sometimes silently stop.",
    anchor: "push--a-dead-mans-switch",
  },
  {
    id: "docker",
    title: "A container is running",
    blurb:
      "Through the Docker API over the socket. A failing HEALTHCHECK can be promoted to down, so a container that is up but broken is not reported as healthy.",
    anchor: "docker--a-container-is-running",
  },
  {
    id: "grpc",
    title: "A server declares itself healthy",
    blurb:
      "The standard grpc.health.v1.Health/Check protocol. Ask about one service or the server overall; NOT_SERVING from a server that answered is a distinction you sometimes want.",
    anchor: "grpc--a-server-declares-itself-healthy",
  },
];

/* source: docs/guides/alerting.md — "The channels" */
export const NOTIFICATION_CHANNELS: { label: string; badge?: string }[] = [
  { label: "Email / SMTP" },
  { label: "Webhook" },
  { label: "Slack" },
  { label: "Discord" },
  { label: "Telegram" },
  { label: "Matrix" },
  { label: "Gotify" },
  { label: "ntfy" },
  { label: "Microsoft Teams" },
  { label: "PagerDuty" },
  { label: "Opsgenie" },
  { label: "Twilio / SMS" },
  { label: "Apprise", badge: "+~90 more" },
];

/* source: docs/guides/alerting.md — the events table */
export const ALERT_EVENTS: { event: string; when: string }[] = [
  { event: "monitor.down", when: "A monitor transitions to down." },
  { event: "monitor.up", when: "It recovers, if notify_on_recovery is on." },
  { event: "monitor.pending", when: "It enters the pending state." },
  { event: "monitor.certificate_expiring", when: "A TLS certificate crosses its threshold." },
  { event: "monitor.domain_expiring", when: "The same, for a domain registration." },
  { event: "incident.opened", when: "An incident advances — also updated and resolved." },
  { event: "maintenance.started", when: "A window opens — also ended." },
];

/* source: README.md — "What it does", verbatim */
export const CAPABILITIES: { number: string; title: string; description: string }[] = [
  {
    number: "01",
    title: "Watches things",
    description:
      "Websites, ports, servers, DNS records, Docker containers, gRPC services, and cron jobs that are supposed to check in.",
  },
  {
    number: "02",
    title: "Tells you when they break",
    description:
      "Email, Slack, Discord, Telegram, ntfy, Gotify, Matrix, Teams, PagerDuty, Opsgenie, SMS, webhooks — plus Apprise, which adds roughly ninety more destinations.",
  },
  {
    number: "03",
    title: "Warns you before they break",
    description:
      "TLS certificates and domain registrations that are about to expire, deduplicated against stored observations so a restart does not re-page you.",
  },
  {
    number: "04",
    title: "Shows your customers",
    description:
      "Public status pages with uptime history and incidents, on your own domain and your own logo. The attribution link is removable.",
  },
  {
    number: "05",
    title: "Automates",
    description:
      "A complete REST API written before the UI, so anything you can click you can script. The dashboard is an ordinary API client with no privileged channel.",
  },
  {
    number: "06",
    title: "Stays fast when there's a lot of it",
    description:
      "Tested against 5,000 monitors on a single install, on every change, automatically. The gate has already caught one regression before it shipped.",
  },
];

/* source: docs/why-uptime-cairn.md and harness/README.md */
export const STATS: { value: string; label: string; note: string }[] = [
  { value: "5,000", label: "monitors", note: "load-tested in CI on every change" },
  { value: "250", label: "checks/sec", note: "5,000 monitors at a 20-second interval" },
  { value: "140", label: "API operations", note: "specified before the UI was written" },
  { value: "1", label: "binary", note: "control plane, probe, UI and database" },
];

/* source: docs/why-uptime-cairn.md — the positioning argument, restated plainly */
export const FIT: string[] = [
  "You self-host, and you want the data on your own infrastructure.",
  "You outgrew Uptime Kuma somewhere around 300–600 monitors.",
  "You want to script it — create, edit and report through a real write API.",
  "You need status pages on your own domain, with your own branding.",
  "You are running several Kuma instances by hand and want one install instead.",
];

export const AVOID: string[] = [
  "You want APM, tracing, or log aggregation. This watches from the outside.",
  "You want somebody else to run it. There is no hosted tier.",
  "You need synthetic browser flows today — Playwright checks are a later phase.",
  "You need multi-region probing or SSO today. Both are on the roadmap, neither has shipped.",
];
