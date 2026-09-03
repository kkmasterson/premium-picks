# Arena Props Production Program

## Purpose

This folder controls the transition from the current routed prototype to a
production Arena Props system. It intentionally stops product-surface expansion
until one narrow launch path works from provider acquisition through the public
Arena Props API and frontend.

The governing rule is:

> A phase advances only after its exit evidence exists. Documentation, mock
> behavior or a successful frontend build does not substitute for runtime proof.

## Current state

- The React/Vite application, dashboard routes and product screens exist.
- Dashboard data and community behavior are still mock/local-browser state.
- Provider contracts and the canonical data model are specifications, not
  production migrations or running integrations.
- The NBA reference-implementation contract was frozen on `2026-08-27`.
- No backend, database, queue, cache, authentication or billing implementation
  should be treated as approved or production-ready yet.

## Phase gates

| Phase | Objective | Status | Required exit evidence |
| --- | --- | --- | --- |
| 0 | Freeze the NBA reference contract | Complete on `2026-08-27` | NBA proof scope approved; launch-time pricing, campaigns, jurisdictions and later sports assigned to later gates |
| 1 | Lock infrastructure choices | Recommendation ready; owner approval pending | Decision record names each production service, region, environment, ownership boundary and cost guardrail |
| 2 | Build canonical database and migrations | Blocked by Phase 1 | Migrations apply from empty, roll back safely, pass integrity tests and cover the approved MVP only |
| 3 | Build one complete provider ingestion path | Blocked by Phase 2 | One NBA event, player and prop from multiple books reaches canonical storage with replay-safe snapshots |
| 4 | Build Arena Props API and cache | Blocked by Phase 3 | Versioned API contracts serve the canonical example through shared cached read models |
| 5 | Add authentication, billing and entitlements | Blocked by Phase 4 | User isolation and Stripe webhook state transitions pass integration and replay tests |
| 6 | Replace frontend mock/local data | Blocked by Phase 5 | MVP screens use Arena Props API data with explicit loading, stale, degraded, unavailable and denied states |
| 7 | Run load, failure, security and recovery tests | Blocked by Phase 6 | Capacity, outage, abuse, backup and restore acceptance targets pass in a production-like environment |
| 8 | Replicate the proven system across sports and features | Blocked by Phase 7 | Every intended sport or module repeats provider, rights, schema, load and feature-flag gates before launch consideration |

## Public launch boundary

Completing the NBA implementation does **not** authorize a public launch. NBA is
the internal proving ground for canonical identity, provider ingestion,
economic snapshots, calculations, API contracts, caching, authentication,
billing and operational testing.

After NBA passes Phases 0–7, Phase 8 repeats the same proof standard across all
12 roadmap competitions shown in product navigation. Public launch remains
blocked until that complete multi-sport package passes and a separate approved
launch manifest identifies the supported books and regions, entitlements,
provider rights, capacity evidence and operational readiness.

## Program documents

- [Frozen NBA reference contract](mvp-contract.md)
- [NBA pregame and live refresh policy](live-refresh-policy.md)
- [Jurisdiction and paid-access policy](jurisdiction-access-policy.md)
- [Infrastructure decision record](infrastructure-decisions.md)
- [Infrastructure options and cost recommendation](infrastructure-options-and-costs.md)
- [Phase-gated delivery checklist](delivery-checklist.md)

The normative provider and database specifications remain under
[`docs/data-platform`](../data-platform/README.md). This folder determines when
those specifications are narrow and proven enough to implement.

## Change discipline

- Do not begin the next sport implementation until the NBA reference path has
  passed its required earlier phases.
- Do not call vendor APIs from React or expose vendor IDs in public contracts.
- Do not put provider polling or ingestion loops in browser clients.
- Do not present mock, stale or unsupported data as live production data.
- Do not advertise projections, arbitrage or real-time alerts until the
  corresponding production capability and evidence exist.
- Keep unsupported screens behind explicit feature availability rather than
  fabricated fallback data.
