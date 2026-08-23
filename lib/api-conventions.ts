/**
 * The /docs/api page.
 *
 * Hand-written rather than rendered from markdown, because the generated
 * reference is 125 operations long and belongs beside the spec rather than on
 * a website. What is here is the part a specification cannot state: the rules
 * a client author needs to know before reading any of it.
 *
 * Every claim is drawn from docs/api/README.md in the product repo, which
 * scripts/sync-docs.ts copies into content/docs/api/README.md — so an upstream
 * change to the conventions shows up as a diff here and this file can be
 * brought back in line.
 */
import { SITE, githubBlob } from "./site";

export type ApiSection = {
  id: string;
  title: string;
  body: string[];
  code?: { lang: string; source: string; filename?: string };
};

export const API_PAGE = {
  lead: "Everything the dashboard does, the API does — it was specified before the UI was written, and the dashboard is an ordinary client of it with no privileged channel. This page is the set of rules that apply across all 125 operations. The per-operation reference lives with the spec.",

  counts: [
    { value: "125", label: "operations" },
    { value: "124", label: "schemas" },
    { value: "3.1", label: "OpenAPI version" },
  ],

  status:
    "The specification is OpenAPI 3.1 and validates clean against openapi-spec-validator. It is still marked draft: nothing is settled until it has been published for comment, revised, and frozen.",

  sections: [
    {
      id: "versioning",
      title: "Versioning",
      body: [
        "Everything lives under /api/v1. The exceptions are /healthz, /readyz and /metrics, which are operational endpoints outside the versioned surface and are not expected to move with it.",
      ],
    },
    {
      id: "authentication",
      title: "Authentication",
      body: [
        "Two schemes, either sufficient. A scoped bearer API key, or the browser session cookie the dashboard uses — which additionally requires an X-Cairn-CSRF-Token header on writes. Operations tagged Public require neither.",
      ],
      code: {
        lang: "shellscript",
        source: `curl -s https://uptime.example.com/api/v1/monitors \\
  -H "Authorization: Bearer cairn_<key>"`,
      },
    },
    {
      id: "scopes",
      title: "Scopes",
      body: [
        "Every operation declares the scope it needs in x-cairn-scopes. Scopes are <resource>:<read|write>, and write implies read on the same resource.",
        "A key cannot be granted a scope its creator does not hold — so an API key is never a way to escalate past the account that made it.",
      ],
    },
    {
      id: "pagination",
      title: "Pagination",
      body: [
        "One model, everywhere: an opaque cursor keyed on (updated_at, id). Applied uniformly, with no small-install exception that sends the full set because it happens to fit today — the shape of the response does not change as an install grows.",
        "Cursor responses carry no total count, because producing one costs a scan of the filtered set on every page fetch. A count comes from GET /api/v1/monitors/membership, which a client tracking a live view is already polling.",
      ],
    },
    {
      id: "errors",
      title: "Errors",
      body: [
        "RFC 9457 problem documents, served as application/problem+json. Branch on the type URI, never on title or detail — both are prose and both may be reworded.",
        "Validation failures add an errors array of JSON pointers naming the fields that failed.",
      ],
      code: {
        lang: "json",
        source: `{
  "type": "https://uptimecairn.dev/errors/validation-failed",
  "title": "Validation failed",
  "status": 422,
  "detail": "interval_seconds must be at least 20",
  "errors": [
    { "pointer": "/interval_seconds", "detail": "must be >= 20" }
  ]
}`,
      },
    },
    {
      id: "schemas",
      title: "Schema conventions",
      body: [
        "OpenAPI 3.1, so nullable fields are type: [string, \"null\"]. There is no nullable keyword.",
        "Server-managed fields are marked readOnly and are always present on reads; the required lists describe what a client must send when writing. That is why MonitorWrite is an alias of Monitor rather than a parallel schema — one shape, with readOnly doing the work.",
        "Monitors and notification channels are oneOf with a type discriminator, so oapi-codegen and openapi-typescript generate usable tagged unions rather than a bag of optional fields.",
      ],
    },
    {
      id: "live-updates",
      title: "Live updates",
      body: [
        "Not REST, so the specification cannot express it directly; the message shapes appear as documented-only schemas that no endpoint returns.",
        "A client subscribes to exactly the monitor IDs on its screen and receives MonitorStatusDiff messages for those alone, so push volume is bounded by viewport size rather than by monitor count. Membership of filtered views is reconciled by polling rather than by the server evaluating live predicates per client.",
        "The transport is NATS in scaled mode and an in-process bus in solo mode. Both present identical message shapes and identical subscribe semantics, so a frontend never knows which it is talking to.",
      ],
    },
    {
      id: "compatibility",
      title: "Compatibility promise",
      body: [
        "Within /api/v1: fields may be added but are never removed or retyped. Enum values may be added, and clients must tolerate values they do not recognise — MonitorType, NotificationChannelType, EventType and ApiKeyScope are all expected to grow. Endpoints may be added; existing endpoints do not change semantics. Anything breaking goes to /api/v2.",
        "A deprecated operation or field is marked deprecated in the spec, announced in the release notes of the version that deprecates it, and kept working for no less than two minor releases or six months, whichever is longer. Responses from deprecated endpoints carry Deprecation and Sunset headers naming the removal date.",
      ],
    },
    {
      id: "absent",
      title: "Deliberately absent",
      body: [
        "No tenancy. There is no org_id field and no organisation endpoints — the column is inert schema infrastructure today, and the tenancy surface arrives with teams.",
        "No probe protocol. That is gRPC and Protobuf, and a separate deliverable.",
        "No WebSocket or SSE endpoint. The live-update channel is a message bus, not HTTP, by design.",
      ],
    },
  ] satisfies ApiSection[],

  links: [
    {
      label: "Download the OpenAPI spec",
      href: "/openapi.yaml",
      description: "OpenAPI 3.1, served with an open CORS header so a generator can fetch it directly.",
      external: false,
    },
    {
      label: "Full operation reference",
      href: githubBlob("docs/api/reference.md"),
      description: "Every one of the 125 operations, generated from the spec and kept beside it.",
      external: true,
    },
    {
      label: "API conventions in the repository",
      href: githubBlob("docs/api/README.md"),
      description: "The source this page is written from, including the open questions still being argued.",
      external: true,
    },
  ],

  validate: {
    caption: "Validate the spec yourself",
    source: `curl -sO ${SITE.url}/openapi.yaml
python3 -m pip install openapi-spec-validator
python3 -c "from openapi_spec_validator import validate; \\
  from openapi_spec_validator.readers import read_from_filename; \\
  validate(read_from_filename('openapi.yaml')[0])"`,
  },
} as const;
