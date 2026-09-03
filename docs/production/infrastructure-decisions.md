# Infrastructure Decision Record

## Status

**Phase:** 1

**Status:** Service architecture approved on `2026-09-01`; account creation and purchases remain separately gated.

Phase 0 is frozen, so infrastructure selection is no longer blocked. This
record recommends the smallest production-shaped stack that can prove NBA,
support the all-12-sport prelaunch expansion and launch for 500–1,000
simultaneously active users. It preserves a future path to 5,000 concurrent
users without paying for that capacity before traffic evidence exists.

No account, subscription or paid add-on is authorized by this record. Current
price research and the approval package are in
[`infrastructure-options-and-costs.md`](infrastructure-options-and-costs.md).

### Locked service architecture

The owner approved the following technical combination on `2026-09-01`:
Vercel for the frontend, Render for the Fastify API and worker, Supabase
PostgreSQL and Queues for canonical storage and durable work, Clerk for
authentication, Stripe as billing authority, and private Cloudflare R2 for raw
provider archives. This approval locks implementation direction but does not
authorize purchases, production activation, provider data rights, or checkout.

## Recommended service combination

| Capability | Recommended product and plan | Decision state | Why it fits the proof and initial launch target |
| --- | --- | --- | --- |
| Frontend/CDN | Vercel Hobby for private development; Vercel Pro before commercial use | Pending owner approval | Preserves the existing Vite deployment and global static delivery. Pro is $20/month for one deploying seat and includes $20 usage credit. |
| Application API | Node.js + TypeScript modular monolith using Fastify on Render | Pending owner approval | A continuously available API avoids serverless scheduler constraints. Start with Starter for proof and Standard for production testing. |
| Database | Supabase Pro PostgreSQL in West US (Oregon), `us-west-2` | Pending owner approval | Managed PostgreSQL, pooled connections, daily backups, auth-independent canonical storage and enough included capacity for the first 5,000 users. |
| Shared cache | PostgreSQL generation table initially; Upstash Redis Fixed 250 MB in AWS `us-west-2` only when horizontal API scaling requires it | Pending owner approval as an optional upgrade | Avoids a needless NBA-proof subscription. Upstash remains rebuildable cache, never a durable queue. |
| API-local cache | Bounded in-process LRU cache in every API instance | Architecture decision; no vendor purchase | Serves the normal 500–1,000-user read path without transferring a complete response through Redis on every refresh. |
| Durable queue | Supabase Queues (`pgmq`) in the production PostgreSQL project | Pending Supabase approval | Keeps durable jobs in PostgreSQL with visibility windows and archival while avoiding a separate queue subscription. Consumers still assume at-least-once effects and remain idempotent. |
| Workers | Separate Node.js + TypeScript Render background-worker service | Pending owner approval | Runs the dynamic event scheduler, provider ingestion, reconciliation, raw archive and cache invalidation outside browser and request lifetimes. |
| Raw/object storage | Private Cloudflare R2 Standard bucket | Pending owner approval | S3-compatible, 10 GB-month free allowance, no egress charge and native lifecycle rules for contract-driven raw-payload deletion. |
| Authentication | Clerk Pro production instance; free development instance while building | Pending owner approval | Email/password, Google, automatic account linking, optional TOTP and native one-time backup codes. The current Supabase Auth alternative has no recovery codes. |
| Billing | Stripe Checkout/Billing, Coupons and Promotion Codes | Approved on `2026-08-26` | Stripe remains the only billing authority. Clerk Billing is explicitly not used. |
| Live delivery | Authenticated, jittered 30–60-second HTTP polling with `ETag`/`304`; no WebSocket dependency for NBA | Pending owner approval | Meets the approved visible cadence for 500–1,000 simultaneous users. A later sport can add push invalidation behind the same API contract. |
| Error/performance monitoring | Sentry Developer during proof; Team when multiple maintainers or quota evidence requires it | Pending owner approval | Captures frontend, API and worker errors/traces. Render and Supabase retain platform logs and metrics. |
| Transactional auth email | Clerk-managed auth delivery | Included with recommended auth | Avoids Supabase's non-production default SMTP and a separate SMTP subscription for the approved auth flows. Stripe owns billing receipts. |
| Secrets | Render environment secrets, Vercel environment variables, and each vendor's scoped credentials | Architecture decision | Keeps provider, database, Stripe and R2 credentials server-side with environment separation and least privilege. |

## Why the alternatives were not selected

### Supabase Auth instead of Clerk

Supabase Auth is bundled with the database and supports email/password, Google
and free TOTP. It is a valid cost-minimizing fallback, but it does not support
recovery codes. Production email also requires custom SMTP; the built-in SMTP
service is restricted and currently limited to two messages per hour. Clerk Pro
adds native backup codes and automatic account linking for only a small net cost
increase over Supabase Auth plus production SMTP. Arena Props should not build
its own security-sensitive recovery-code implementation merely to save that
difference.

### Supabase Storage instead of Cloudflare R2

Supabase Storage includes generous capacity and an S3-compatible interface, but
its compatibility contract does not currently implement bucket lifecycle
configuration or object versioning. Raw provider payloads require enforceable,
rights-based expiry. R2 supplies lifecycle deletion and is expected to remain
inside its free allowance during NBA proof. Only provider raw payloads go to R2;
user and billing data remain in Oregon PostgreSQL.

### One all-in-one Render stack

Render could also host PostgreSQL and Redis. That would consolidate compute,
but it would still need a separate authentication provider and external object
storage. The recommended combination retains the existing frontend deployment,
uses PostgreSQL-native queues and keeps every application boundary portable.

### AWS-first infrastructure

AWS can provide stronger bespoke networking and redundancy, but ECS, RDS, SQS,
ElastiCache, IAM and infrastructure-as-code operations add more failure and
maintenance surface than the one-month NBA proof justifies. The vendor-neutral
API, queue, cache and S3 interfaces preserve a later AWS migration path if
measured load or compliance requires it.

## Required deployment boundaries

```text
Vercel CDN / React SPA
          |
          v
Render Arena Props API
  |       |-> bounded L1 response cache
  |       |-> PostgreSQL generation table
  |       |-> optional Upstash coordination after horizontal scaling
  |       |-> Supabase PostgreSQL read models
  |       +-> backend entitlement enforcement
  |
  +-> Clerk JWT verification and canonical user crosswalk

Providers -> Render ingestion gateway -> Supabase durable queue -> Render workers
                                                         |-> private R2 raw archive
                                                         |-> canonical PostgreSQL
                                                         |-> read-model jobs
                                                         +-> cache generation/invalidation

Stripe -> signed API webhook -> durable billing event queue -> entitlements
```

The provider plane is independent of user request volume. Five thousand users
reading the same sport and prop surface reuse one canonical read model and the
same bounded cache generations. User reads never invoke provider APIs and never
perform user-specific metric recalculation.

## Region and data residency

- Supabase production: specific West US (Oregon), AWS `us-west-2`.
- Render API and workers: Oregon.
- Optional Upstash primary when enabled: AWS `us-west-2`; do not purchase it or
  add paid read regions for NBA proof.
- Vercel static assets: global edge delivery. No provider secret or canonical
  database credential is present in the frontend deployment.
- Cloudflare R2: private Standard bucket with a western North America location
  hint where available. It stores provider payloads only, not user profiles,
  passwords, payment records or entitlement data.
- Clerk and Stripe process identity/payment data under their own service terms.
  Their production use remains subject to the jurisdiction and privacy gate.

Oregon is the initial primary region because Render and Supabase support it,
optional Upstash can match it, and it is close to the owner's Arizona operating
location. A later regional expansion must be measured; it must not create
multi-primary canonical writes during the NBA proof.

## Environment isolation

| Environment | Data/services | Credential rule | Cost rule |
| --- | --- | --- | --- |
| Local development | Local PostgreSQL/Supabase tooling, local Redis-compatible container, fake provider fixtures, Stripe CLI/test mode and local S3 adapter | `.env.local` remains untracked; no production provider or Stripe secrets | $0 infrastructure; use fixtures by default |
| Shared staging | Separate Supabase project, Clerk development instance, Stripe test mode, separate R2 bucket/prefix, optional free Upstash database and Render staging API/worker suspended when unused | No production keys or production user data | Prefer free/prorated resources until continuous staging is required |
| Production | Dedicated Supabase project, Clerk production instance, Stripe live mode, private R2 bucket, Render services and Upstash only if load tests require it | Production secrets exist only in production scopes; privileged access requires MFA | Enable only after the corresponding phase gate |

Vercel Preview, Staging and Production variables must be separate. Render uses
different services/environment groups for staging and production; it must not
share a broad secret group that gives the API provider-ingestion credentials.

## Connection-pool design

- Normal API and worker traffic uses Supabase's pooled PostgreSQL connection
  string. Direct database connections are reserved for controlled migrations
  and administrative recovery.
- Initial API maximum: 10 pooled connections per instance.
- Initial worker maximum: 5 pooled connections per instance.
- Scheduler/dispatcher maximum: 2 pooled connections per process.
- A production Small database advertises up to 400 pooled connections, so even
  the high scenario of two API and two worker instances stays far below the
  limit. Load testing must prove the pool sizes before increasing them.
- Transactions are short and bounded. Provider HTTP waits, R2 uploads and
  CPU-heavy calculations occur outside an open database transaction.
- Autoscaling is capped; adding an API instance cannot silently create an
  unbounded client pool.

## Queue, retry and dead-letter semantics

Supabase Queues is based on `pgmq` and documents guaranteed delivery plus
exactly-once delivery to a consumer within a visibility window. Arena Props
still treats side effects as at least once because a worker can commit an
external or database effect and fail before acknowledgement.

- Scheduler instances contend on a PostgreSQL advisory lock and scan due
  `event_acquisition_jobs`; there is no cron per game.
- Every job has a deterministic idempotency key containing provider product,
  canonical event, data class, schedule-policy version and due-time bucket.
- Queue visibility starts at 120 seconds and must exceed the measured p99 job
  runtime plus a safety margin.
- Workers extend visibility only for bounded jobs with recorded progress.
- Retry uses capped exponential backoff with jitter. Five failed attempts move
  the job to a dead-letter queue and create an alert/data-quality issue.
- Canonical writes have unique constraints and economic fingerprints so replay
  cannot duplicate snapshots or billing transitions.
- Successful jobs are archived for an initially short operational audit window;
  replay tooling copies an archived/dead-letter job into a new queue message
  with a new attempt ID and the original idempotency key.
- PostgreSQL outbox rows are committed with canonical changes. Cache
  invalidation and downstream calculations consume the outbox independently.

## Cache and 500–1,000-user launch delivery design

The first implementation uses HTTP polling because user-visible changes are
only required every 30–60 seconds and the source cannot promise sub-60-second
odds freshness.

1. Clients poll at the surface's configured cadence with ±10% jitter, pause in
   hidden tabs and exponentially back off on failures.
2. Responses carry `ETag`, generation ID, freshness fields and compression.
   Unchanged generations return `304 Not Modified` with no response body.
3. Each API instance serves hot, common read models from a bounded in-process
   LRU cache. This is the normal request path.
4. The NBA proof and one-instance launch candidate use a PostgreSQL generation
   table for invalidation. If load tests require multiple API instances,
   Upstash can store shared generations and compressed L2 read models. One
   request per API instance refills an expired L1 key under stampede protection;
   every user request does not download the model from Redis.
5. Cache keys never contain a user's identity for shared sports data. The API
   performs entitlement/ownership checks separately and overlays only the small
   user-owned portion of a response.
6. If Redis is later enabled, its loss is degraded, not fatal: API instances
   retain bounded stale L1 data, refill from PostgreSQL under rate limits and
   display stale/degraded state. The durable queue never depends on Redis.

At 500 users polling every 30 seconds, the API sees about 17 requests/second;
at 1,000 users it sees about 33 requests/second. At a compressed 3 KB average
changed response and six live hours per day, the 1,000-user case transfers
roughly 64.8 GB/month before `304` savings. Phase 7 tests one Standard API at
that workload before approving another instance or Upstash.

Five thousand simultaneously active users remain a future scale target: about
167 requests/second at 30 seconds. The same shared read models, L1/L2 boundary,
bounded database pools and stateless API can scale horizontally when actual
traffic justifies the additional spend. That future configuration is not an
NBA-proof or initial-launch purchase requirement.

Persistent WebSockets/SSE are deferred. They become preferable only if measured
conditional polling bandwidth or a later sport's required cadence justifies the
operational complexity and reconnect-storm testing.

## Raw storage and retention

- Raw objects use the existing key contract:
  `provider/product/yyyy/mm/dd/feed-or-endpoint/ingestion-run/message-id.json.zst`.
- Buckets are private. The worker receives write/read credentials; the public
  API and browser receive none.
- SHA-256, provider/product, schema version, request metadata without secrets,
  object key and rights-based deletion time are recorded in PostgreSQL.
- R2 lifecycle rules implement the accepted provider retention period. The
  desired default is 90 days, but `licensed_retention` remains authoritative;
  pending or prohibited rights can require shorter quarantine-only retention.
- Canonical facts and economic snapshots remain in PostgreSQL only when the
  provider contract permits that retention and derivative use.
- Deletion jobs reconcile PostgreSQL retention records against R2 lifecycle
  outcomes. A lifecycle rule is not proof that a corresponding canonical row
  was legally retainable.

## Authentication, authorization and billing boundaries

- Clerk authenticates email/password and Google identities, links methods and
  issues sessions. Arena Props maps Clerk user IDs to product-owned user IDs.
- A verified email is required before paid checkout or durable user-owned data.
- Optional user TOTP and backup codes are managed by Clerk. Privileged Arena
  Props admin routes require MFA and a freshly verified second factor.
- React may render an access state but is never the authority. The API resolves
  the canonical user and backend entitlement for every paid/user-owned response.
- Stripe is the only subscription, payment and promotion authority. Clerk
  Billing is disabled/not integrated.
- Stripe events are signature-verified, stored by immutable event ID, queued
  durably and applied idempotently to Arena Props entitlement projections.
- Clerk outage behavior: existing valid JWTs may be accepted only within their
  normal verification/cache window; new sign-ins and sensitive account changes
  fail closed. Stripe or entitlement uncertainty fails closed for new paid
  access while preserving a short, explicitly modeled grace state for already
  active subscriptions.
- Account export/deletion removes or anonymizes product data and coordinates
  deletion with Clerk; legally required Stripe financial records are not
  silently deleted.

## Secrets, logs and administrative access

- Browser-visible values are limited to publishable Clerk configuration,
  Stripe publishable key when needed and Arena Props API URL. Supabase service
  keys, database strings, R2 credentials, provider keys and Stripe webhook
  secrets are never sent to React.
- API secrets: Clerk verification configuration, pooled database credential,
  Stripe secret/webhook secret and, only if enabled, scoped Upstash credential.
- Worker secrets: provider keys, pooled database credential, queue access,
  scoped R2 credential and an optional Upstash invalidation credential. The
  worker does not need Stripe write authority.
- Structured logs use request/job IDs and canonical IDs; they redact tokens,
  cookies, authorization headers, email addresses, provider payload bodies,
  R2 signed URLs and payment data.
- All vendor owner/operator accounts require MFA. Production secret access is
  limited to named maintainers and reviewed after any role change.
- Rotate credentials immediately after suspected exposure or maintainer change.
  Otherwise review quarterly and rotate where the provider supports overlap.
- Sentry must be configured to avoid sending personal data and provider payloads.

## SLO, backup, RPO and RTO gates

| Stage | Availability/freshness target | RPO | RTO | Required mechanism |
| --- | --- | --- | --- | --- |
| Internal NBA proof | 99.5% API availability during scheduled test windows; freshness state always visible | 24 hours | 8 hours | Supabase Pro daily backups plus reproducible migrations, R2 raw archive and provider reconciliation |
| Initial paid public launch | 99.9% monthly API availability; cached p95 under 300 ms; error rate under 0.5%; live refresh claims bounded by provider cadence | 24 hours | 8 hours | Supabase Pro daily backups, tested restore runbook, Stripe replay, deploy rollback, queue replay and canonical rebuild from retained raw evidence |
| Future recovery upgrade | Same service target with lower data-loss tolerance | 15 minutes | 4 hours | Seven-day Supabase PITR plus a newly tested restore runbook |

PITR is not purchased for the NBA build or included automatically in the initial
launch budget. The seven-day add-on is approximately $100/month per project.
Before public launch, the owner must explicitly accept the 24-hour initial RPO
or approve PITR based on paying-user count, revenue and measured data-loss
impact. Buying the add-on alone never satisfies the recovery gate; a recorded
production-like restore must meet the selected target.

## Spending and upgrade guardrails

- Use fixtures and local services by default. Provider calls occur only in
  explicit bounded acquisition tests.
- Set vendor spend alerts before entering payment details. If Upstash is later
  enabled, disable automatic cache tier upgrades and PAYG for the steady path.
- Start Render API/worker at Starter only for proof; move to Standard before
  Phase 7 load testing.
- Upgrade PostgreSQL Micro to Small before production-like load tests. Upgrade
  further only from CPU, memory, connection and query evidence.
- Do not buy Supabase PITR, Render Pro workspace/autoscaling, Upstash Prod Pack,
  Clerk Business or Sentry Business during NBA development.
- Do not buy Upstash for NBA proof. Add its $10 Fixed tier only after load tests
  justify horizontal API instances or shared cache coordination. Prod Pack is
  not recommended at launch because it adds $200/month to a rebuildable cache.
- BALLDONTLIE ALL-ACCESS and high-volume The Odds API plans remain deferred until
  measured NBA request/coverage evidence requires them.
- Stripe has no fixed setup/monthly payment fee on its standard US pricing, but
  model variable fees as 2.9% + $0.30 per successful domestic-card payment plus
  0.7% of Stripe Billing volume. International cards, currency conversion, tax,
  disputes and refunds can add fees.

## Phase 1 approval and exit checklist

- [ ] Owner approves the recommended vendors and spending envelope.
- [x] Every capability above names a recommended vendor and qualifying plan.
- [x] Primary region and data residency are documented.
- [x] Development, staging and production isolation is documented.
- [x] Monthly low/expected/high cost models include provider and platform usage.
- [x] Stage provider procurement with NBA-only BALLDONTLIE GOAT and bounded The
  Odds API NBA proof usage; defer all-access/high-volume upgrades.
- [x] API-to-PostgreSQL connection pooling is designed for bounded scaling.
- [x] Queue retry, deduplication, dead-letter and replay semantics are documented.
- [x] Backup, point-in-time recovery, RPO and RTO targets are selected.
- [x] Authentication and Stripe ownership boundaries are documented.
- [x] Stripe is the billing platform and authoritative source of billing state.
- [x] Live delivery has a selected design that can be capacity-tested against
  the approved 30–60-second refresh policy.
- [x] Secret rotation, logging redaction and administrative access are documented.
- [x] The architecture can run locally and in staging without production credentials.

**Phase 1 exits only after the owner approves the $157.99 NBA-proof package.** No purchase is
needed to review or approve it. Phase 2 migrations remain blocked until then.
