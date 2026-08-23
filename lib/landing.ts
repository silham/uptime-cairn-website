/**
 * All landing-page copy, one key per band.
 *
 * The page component is a thin template over this object, following the
 * reference site's convention of keeping every string in a typed constant
 * rather than inline in JSX — so the copy can be read and edited as prose
 * without reading the markup around it.
 *
 * Voice matches the product's own documentation: British English, em dashes,
 * flat and declarative, no superlatives. "\n" marks a headline break that only
 * applies above `sm`.
 */
import { SITE } from "./site";

export const DOCKER_RUN = `docker run -d --restart=always -p 127.0.0.1:3000:3000 \\
  -v uptime-cairn:/data \\
  --name uptime-cairn \\
  ${SITE.ghcrImage}`;

export const KUMA_IMPORT = `cairn import kuma /path/to/kuma.db`;

export const LANDING = {
  hero: {
    eyebrow: "Open source uptime monitoring",
    headline:
      "Uptime Cairn tells you\nwhen your websites and\nservers go down.",
    lead: "Free, open source, and self-hosted. One Docker container, one file of data, no database server to set up. Running in about a minute.",
    primary: { label: "Install with Docker", href: "#install" },
    secondary: { label: "Read the quickstart", href: "/docs/quickstart" },
    legendCaption: "Six heartbeat statuses",
    facts: [
      "AGPL-3.0",
      `v${SITE.version}`,
      "Go 1.25",
      "SQLite",
      "one binary",
    ],
  },

  install: {
    label: "Install",
    headline: "One container,\nand you are watching things.",
    lead: "Open http://localhost:3000 and create your account. That's it. Migrations run on start, so an upgrade is a pull and a restart.",
    portNote:
      "The port is bound to 127.0.0.1 on purpose — Uptime Cairn speaks plain HTTP, so put Caddy, nginx or Traefik in front of it before exposing it to the internet.",
    alternatives: [
      {
        number: "01",
        title: "Docker Compose",
        description:
          "A commented reference file with a read-only root filesystem, no-new-privileges, and a healthcheck already wired up.",
      },
      {
        number: "02",
        title: "A plain binary",
        description:
          "Five targets, checksummed, with a hardened systemd unit in the repo. No runtime, no interpreter, nothing to install alongside it.",
      },
      {
        number: "03",
        title: "A Raspberry Pi",
        description:
          "linux/arm64 and linux/armv7 images, cross-compiled rather than emulated, so they are the same speed as everything else.",
      },
    ],
  },

  screenshots: {
    label: "The product",
    headline: "What you actually get.",
    shots: [
      {
        id: "dashboard",
        tab: "Dashboard",
        src: "/screenshots/dashboard.png",
        alt: "The Uptime Cairn dashboard: a list of monitors with uptime bars, a current-status donut, and a last-24-hours summary.",
        caption: "Monitors, uptime bars, and the last 24 hours at a glance.",
        width: 2940,
        height: 1598,
      },
      {
        id: "monitor",
        tab: "A monitor",
        src: "/screenshots/monitor.png",
        alt: "A monitor detail page showing uptime percentages, a response time chart, certificate details, and the check configuration.",
        caption:
          "One monitor: uptime, response times, certificate expiry, next check.",
        width: 2940,
        height: 1600,
      },
      {
        id: "status-page",
        tab: "A status page",
        src: "/screenshots/status-page.png",
        alt: "A public status page reading All systems operational, with grouped services, uptime bars, and past incidents.",
        caption: "What your customers see, on your domain and your logo.",
        width: 2940,
        height: 1598,
      },
    ],
  },

  capabilities: {
    label: "What it does",
    headline: "Six things,\ndone properly.",
    intro:
      "Monitoring, alerting, incidents, and status pages. Reporting and team controls are coming, and none of it will be a paid add-on.",
  },

  monitors: {
    label: "Monitors",
    headline: "Nine things it\nknows how to check.",
    intro:
      "Each type checks one thing and reports what it actually found. Where a checker cannot tell a broken target from a broken probe, it says so rather than guessing.",
  },

  statuses: {
    label: "Heartbeats",
    headline: "Six statuses,\nand two are about the probe.",
    intro:
      "This distinction runs through the whole product. Collapsing it would mean one broken probe paging an entire on-call rotation about services that were never affected.",
    pullQuote:
      "`unknown` is not a soft `down`. A DNS lookup failing because the target's record is gone is `down` — a statement about the target. The same lookup failing because this host's resolver is unreachable is `unknown` — a statement about the probe.",
  },

  alerting: {
    label: "Alerting",
    headline: "Thirteen channels,\nplus about ninety more.",
    intro:
      "Test-firing a channel is a real delivery, and it reports the provider's own words back verbatim — so a misconfigured token fails on the form rather than during an outage.",
    eventsTitle: "Events it emits",
    eventsBlurb:
      "Webhook templates take {{variable}} substitution with no conditionals and no loops, on purpose. A template that can branch is a template that can fail at 3am. An unknown variable is a 422 at save time, naming it.",
    quietTitle: "Not paging you forty times",
    quietBody: [
      "Dependency suppression: give a monitor a parent and its children go quiet when the parent is down. Transitive, and the child's real outage is still recorded so uptime figures stay honest.",
      "Maintenance windows: single, daily, weekly, monthly or cron, each evaluated in its own time zone with the database compiled into the binary. A schedule that could never fire is refused at write time.",
    ],
  },

  statusPages: {
    label: "Customers",
    headline: "A page you can send people to.",
    cards: [
      {
        number: "01",
        title: "Status pages",
        body: "Your own domain, your own logo and colours, sanitised custom CSS, and 7 to 365 days of uptime history. Email and webhook subscribers with double opt-in. The attribution link is removable — nothing in the open source build is paywalled.",
      },
      {
        number: "02",
        title: "Incidents",
        body: "Opened from a failing check rather than posted by hand, with a timeline of updates and acknowledgement. Outbound webhooks are HMAC-signed over the exact bytes sent, with a stable event id across retries and manual redelivery.",
      },
    ],
  },

  claim: {
    label: "Scale",
    quote: "5,000 monitors on one install, and the UI stays fast.",
    body: "Every change runs against 5,000 monitors in CI before it merges. It is a gate, not a benchmark someone ran once — and it has already caught a regression in the dashboard's own listing query before v1.0 shipped. Live updates subscribe only to the monitors on screen, so push volume is bounded by the viewport rather than by how much you monitor.",
  },

  comparison: {
    label: "Fit",
    headline: "Whether this is\nthe right tool.",
    intro:
      "Uptime Kuma is excellent, and Uptime Cairn is a deliberate nod to it. But it has no write API, no user permissions, no SSO, and it slows to a crawl somewhere around 300–600 monitors — the point where people start running a second copy on another server.",
    fitTitle: "A good fit if",
    avoidTitle: "Not the right tool if",
    importTitle: "Coming from Uptime Kuma",
    importBody:
      "Brings across monitors, tags, notifications and status pages. Point it at several Kuma databases and it merges them into one install. Use --dry-run first.",
  },

  name: {
    body: "A cairn is a stack of stones built up by many passing travellers to mark the safe path for whoever comes next. Stacked stones also happen to look exactly like an uptime bar.",
  },

  docsTeaser: {
    label: "Documentation",
    headline: "Read before you install,\nor after it is running.",
  },

  cta: {
    eyebrow: "Run it yourself",
    headline: "Running in about\na minute.",
    lead: "No account, no trial, no per-monitor pricing. Pull the image and it is yours.",
    primary: { label: "Read the install guide", href: "/docs/install" },
    secondary: { label: "View source on GitHub", href: SITE.github },
    footnote:
      "AGPL-3.0, with a contributor licence agreement that explicitly cannot be used to paywall a feature in the open build.",
  },
} as const;
