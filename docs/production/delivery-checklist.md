# Phase-Gated Delivery Checklist

## Operating rule

Complete this list in order. A checked implementation task must link to its
evidence: migration/test output, fixture, contract test, load report, recovery
record or production-like demonstration. A screen or document alone is not
runtime proof.

## Phase 0 — Freeze the NBA reference contract

- [x] Resolve and approve every NBA proof decision in `mvp-contract.md`.
- [x] Record NBA as the internal proving ground rather than the only public
  launch competition.
- [x] Record Stripe as the billing platform and billing authority.
- [x] Record pregame and live NBA data with 30–60-second live dashboard updates
  and a last-successful-refresh timer.
- [x] Record BALLDONTLIE as current NBA odds/prop source and The Odds API as the
  historical-odds source, while keeping player-stat history separate.
- [x] Record the approved books, NBA market families, image fallback,
  authentication methods, deferred features and NFL as the next proving sport.
- [x] Record NBA-only provider procurement and defer all-access/high-volume
  subscriptions until NBA proof evidence justifies them.
- [x] Record the exact later-sport roadmap labels shown in product navigation;
  later integrations remain Phase 8 work and do not block NBA.
- [x] Approve a country/region allowlist policy and move exact paid-access
  enablement to the pre-launch compliance gate.
- [x] Approve configurable one-tier and Stripe promotion-code capabilities while
  moving final price, entitlements and campaign rules to Phase 5/pre-launch.
- [x] Record the landing, pricing, dashboard feature-flag and claim changes that
  Phase 6 must make before release.
- [x] Approve the near-real-time freshness language and prohibit claims of
  latency below the verified provider cadence.

**Exit evidence:** NBA reference contract frozen on `2026-08-27`; no later-sport,
pricing, campaign or jurisdiction choice blocks Phase 1.

## Phase 1 — Lock infrastructure choices

- [ ] Owner approves the products, plans and regions recommended in
  `infrastructure-decisions.md`.
- [x] Define environment isolation and secret ownership.
- [x] Define low, expected and high platform/provider cost scenarios.
- [x] Define SLO, RPO and RTO targets.

**Exit evidence:** the researched recommendation is complete on `2026-08-27`;
the infrastructure record and $157.99 NBA-proof ceiling still require owner
approval.

## Phase 2 — Canonical database and migrations

- [ ] Create migration tooling and an empty-database bootstrap test.
- [ ] Implement only the canonical tables needed by the approved MVP.
- [ ] Implement provider/product identity and explicit entity/market crosswalks.
- [ ] Implement player-, team- and event-prop scope checks.
- [ ] Use purpose-specific partial unique indexes for player, team and event prop identities, or prove an equivalent `NULLS NOT DISTINCT` design.
- [ ] Audit every composite unique key containing a nullable column; plain PostgreSQL uniqueness is not sufficient for logical-null equality.
- [ ] Enforce event/segment, competition/season and event/participant consistency with composite foreign keys, constraints or tested transactional guards.
- [ ] Avoid unenforced polymorphic user references; use concrete foreign keys, a canonical entity registry or tested integrity triggers.
- [ ] Enforce exactly one owner for anonymous/authenticated Pick Builder state.
- [ ] Implement append-only economic snapshots and a separate current-offer projection.
- [ ] Add migration rollback, integrity, concurrent-ingestion and duplicate-delivery tests.

**Exit evidence:** clean bootstrap and integrity suite pass against the selected PostgreSQL version.

## Phase 3 — One provider-to-database path

- [ ] Create provider adapter interfaces and fixture contract tests.
- [ ] Connect BALLDONTLIE NBA teams.
- [ ] Connect BALLDONTLIE NBA players.
- [ ] Connect BALLDONTLIE NBA events and final player statistics.
- [ ] Connect BALLDONTLIE current NBA game odds and player props.
- [ ] Connect The Odds API historical event discovery and historical odds/prop backfill.
- [ ] Resolve one event across providers without publishing a name-only match.
- [ ] Ingest one approved player market from multiple sportsbooks.
- [ ] Deduplicate unchanged polls by economic fingerprint while extending `last_seen_at`.
- [ ] Append line, price, status, disappearance and reappearance changes.
- [ ] Derive book and consensus landmarks with explicit rule versions.
- [ ] Prove queue replay and duplicate webhook/poll safety.
- [ ] Implement one dynamic scheduler with per-event acquisition state and
  per-data-class `next_due_at`; do not create one cron per game.
- [ ] Prove polling-driven start, live, injury, stat and final transitions on the
  NBA-only plan without depending on ALL-ACCESS webhooks.
- [ ] Implement and fixture-test the signed BALLDONTLIE webhook receiver for a
  future upgrade, but keep it disabled/non-critical until the subscribed plan
  supplies adequate event types and delivery volume.
- [ ] Coalesce high-frequency live player events before read-model recalculation
  and cache fan-out.
- [ ] Prove `FINALIZING` correction sweeps and provisional/final stat behavior.

**Exit evidence:** one NBA player prop is traceable from raw payload through canonical history and settlement-ready state.

## Phase 4 — Arena Props API and shared cache

- [ ] Define versioned typed contracts for `/api/v1`.
- [ ] Implement `GET /api/v1/props` with filters and cursor pagination.
- [ ] Implement event, player, game-log and prop-history endpoints needed by the MVP.
- [ ] Include generation time, source cutoff, freshness and calculation versions in calculated read models.
- [ ] Implement shared cache keys, TTLs, invalidation and cache-stampede protection.
- [ ] Return explicit `fresh`, `stale`, `degraded` and `unavailable` states.
- [ ] Return `last_successful_refresh_at` and `next_refresh_expected_at` for live
  surfaces without resetting freshness after failed acquisition.
- [ ] Prove that no public contract leaks provider IDs, field names, enums or raw payloads.
- [ ] Prove that common reads reuse cached read models rather than recalculating per request.

**Exit evidence:** the canonical proof case is served through the Arena Props API and cache with contract tests.

## Phase 5 — Authentication, billing and entitlements

- [ ] Add canonical users and authentication-provider crosswalks.
- [ ] Implement email/password and Google OAuth account linking without creating duplicate canonical users.
- [ ] Implement optional authenticator-app TOTP, recovery codes and mandatory privileged-admin MFA.
- [ ] Define subscription states: trialing, active, past due, grace period, canceled, expired and refunded.
- [ ] Define backend entitlements independently from frontend presentation.
- [ ] Configure the production Stripe product/price and final one-tier
  entitlements before billing is enabled; do not hardcode them into clients.
- [ ] Verify Stripe webhook signatures and replay windows.
- [ ] Deduplicate Stripe events by immutable event ID before state transitions.
- [ ] Process billing transitions durably and make them retry-safe.
- [ ] Use Stripe Coupons and Promotion Codes for discount validation and redemption; do not create an independent discount authority.
- [ ] Define campaign-specific promotion-code rules before the first code is issued.
- [ ] Test promotion-code expiry, eligibility, maximum-redemption, per-customer and subscription-transition behavior.
- [ ] Enforce user ownership on saved props and Pick Builder APIs.
- [ ] Add account export and deletion behavior.
- [ ] Test cross-user isolation, expired access and administrative access.
- [ ] Obtain written Stripe acceptance of the disclosed analytics-only business
  model before enabling production checkout.

**Exit evidence:** backend authorization—not React state—controls every paid or user-owned response.

## Phase 6 — Replace mock and browser-only frontend data

- [ ] Props.
- [ ] Player details.
- [ ] Game logs.
- [ ] Prop history and line movement.
- [ ] Matchups.
- [ ] Saved props.
- [ ] Pick Builder.
- [ ] Popular only if re-approved and its integrity gates pass.
- [ ] Projections only in a later approved modeling phase.
- [ ] Align landing, pricing and dashboard feature flags with the enabled scope.
- [ ] Remove or label claims for deferred projections, arbitrage and real-time alerts.
- [ ] Apply the approved near-real-time freshness copy and stale/degraded states.
- [ ] Remove or isolate the corresponding production mock paths after each migration.

**Exit evidence:** every enabled MVP screen is backed by authenticated Arena Props contracts and handles all freshness/error states.

## Phase 7 — Capacity, failure, security and recovery

- [ ] Generate realistic ingestion volume from measured events, props, books, sides and economic changes.
- [ ] Measure snapshot rows/day, bytes/day, index growth, vacuum behavior and retention cost before choosing final partition intervals.
- [ ] Seed at least 5,000 authenticated accounts and test 500 simultaneous active
  users as the baseline plus 1,000 simultaneous active users as the launch ceiling.
- [ ] Run 100 RPS sustained and 333 RPS burst against shared dashboard reads.
- [ ] Demonstrate at least a 95% cache-hit rate for common read models.
- [ ] Meet cached p95 below 300 ms and uncached p95 below 750 ms in the agreed environment.
- [ ] Keep errors below 0.5% and prove zero cross-user data leakage.
- [ ] Simulate a 500-user props-page arrival within ten seconds and a separate
  1,000-user launch-ceiling run.
- [ ] Test 1,000 active users refreshing shared cached live reads every 30 and
  60 seconds with bounded client jitter.
- [ ] Document the no-rewrite horizontal scale path to 5,000 simultaneous users;
  a 5,000-concurrent test becomes mandatory only when traffic forecasts or
  measured usage justify that capacity.
- [ ] If persistent realtime transport is selected, test 1,000 simultaneous
  authorized connections and reconnect storms.
- [ ] Test BALLDONTLIE and The Odds API outages.
- [ ] Test Redis loss, queue replay, worker crashes and PostgreSQL failover.
- [ ] Test duplicate, delayed and out-of-order provider messages.
- [ ] Test provider enum additions, removed fields and unexpected nullability.
- [ ] Run dependency, secret, authorization and abuse-control security checks.
- [ ] Implement server-enforced jurisdiction configuration and deny paid
  checkout outside the approved allowlist.
- [ ] Complete legal/payment/tax/privacy/provider-rights evidence for every
  jurisdiction enabled at launch.
- [ ] Restore production-like data from backup and record achieved RPO/RTO.

**Exit evidence:** signed load, failure, security and recovery reports meet the approved targets.

## Phase 8 — Controlled multi-sport expansion

- [ ] Add only one new competition or major module at a time.
- [ ] Add NFL immediately after NBA passes its proof gates.
- [ ] Repeat source coverage, rights, fixture, mapping and schema-drift gates.
- [ ] Measure incremental provider cost and snapshot volume.
- [ ] Preserve the frozen roadmap labels: NBA, NFL, MLB, NHL, WNBA, NCAAB,
  NCAAF, Soccer, Tennis, LoL, CS2 and Valorant. Add only one at a time; roadmap
  inclusion does not authorize a provider purchase or public enablement.
- [ ] Keep the feature disabled until production-like tests pass.
- [ ] Re-run capacity and degraded-mode tests before public enablement.
- [ ] Repeat the NBA reference proof for every intended launch sport.
- [ ] Re-run the 500-user baseline and 1,000-user launch-ceiling workload against
  the complete enabled 12-competition package.
- [ ] Create and approve a separate public-launch manifest after the intended
  multi-sport package is complete.

**Exit evidence:** every intended capability satisfies the NBA reference proof,
and the separate public-launch manifest passes product, provider-rights,
capacity, security and recovery review.
