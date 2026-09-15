# NBA starter backend and sport onboarding SOP

Decision date: 2026-09-08. Landing-page modeling is paused for owner feedback.
NBA remains the reference sport. The owner authorized backend preparation and
confirmed Supabase as the database destination. This document governs the
incremental development sequence below; it does not claim a working live feed.

## Implementation update

The first NBA schedule path is now implemented and verified locally. See [the live runbook](nba-live-runbook.md) for current scope, startup commands and evidence. The sections below retain the broader onboarding plan; follow the runbook for implemented behavior.

## Put keys here

Edit `C:\Picks\PremiumPicks\server\.env.local` locally. Fill only these entries now:

```dotenv
BALLDONTLIE_API_KEY=
THE_ODDS_API_KEY=
THESPORTSDB_API_KEY=
```

Put each key after `=` and save. Quote values containing `#` or spaces. The
file is Git-ignored and outside Vite's root environment-file location. Never
use a `VITE_` prefix for secrets, import the file into React, or paste keys into
chat. `server/.env.example` is the blank, shareable template. Leave database
entries blank until local Supabase is running. The Odds API here means
`the-odds-api.com`, matching the existing provider plan.

From the project directory, `npm run check:env` reports only whether each entry
is configured. Exit code 1 means at least one provider key is missing. It does
not call vendors or validate access. API and worker npm commands load the file;
host-injected environment variables take precedence. Restart processes after
editing it. Production credentials belong in backend host secrets.

## What exists and what is next

Local Supabase, a BALLDONTLIE NBA schedule worker, a cached Fastify schedule endpoint and the Matchups dashboard are connected. Player research and prop endpoints remain fixture-backed. The existing demo-tier header is not real auth; no production deployment or measured 5,000-user capacity is established.

Use a **real local Supabase database with clearly separated seed data** as the
development database. Keep the same PostgreSQL schema and migrations for hosted
Supabase. This avoids a later JSON/SQLite-to-PostgreSQL rewrite. The local stack
is for development; eventual user capacity must be tested on hosted infrastructure.

## Source coverage: checked against official documentation

| Dataset | Source | Free-plan development scope | Missing capability |
| --- | --- | --- | --- |
| Player identities, teams, game schedule/status/scores | BALLDONTLIE NBA | Players, teams and games; 5 requests/minute | Player game stats, active-player endpoint and injuries require paid access; richer endpoints have further tier gates |
| Current sportsbook offers | The Odds API | 500 credits/month; sample supported markets/books | Too small for sustained full-board live polling |
| Historical sportsbook lines/prices | The Odds API | Unavailable on free | Paid historical access; never confuse odds history with player performance history |
| Player headshots and team artwork | TheSportsDB | V1 lookup/media enrichment; 30 requests/minute | Check each player's coverage and accepted usage rights; missing art falls back to initials |
| L5/L10/season performance and hit rates | Arena calculations over player game stats | Unavailable with the stated free NBA plan | Obtain licensed game-level stats before calculating |
| EV/projections/confidence | Arena model and calculations | No live model presently | Model validation and sufficient input history; vendor keys do not supply these automatically |

Sources: [BALLDONTLIE NBA tiers](https://docs.balldontlie.io/#account-tiers),
[The Odds API plans](https://the-odds-api.com/#get-access),
[The Odds API V4 reference](https://the-odds-api.com/liveapi/guides/v4/),
[TheSportsDB documentation](https://www.thesportsdb.com/documentation).
Actual key access and exact NBA book/market coverage remain to be tested.

For the free proof, use The Odds API to sample current offers. This is a scoped
development exception to the earlier preference for BALLDONTLIE current props;
production source ownership still depends on coverage evidence. Backfill player
performance from a statistics source and odds prices from the odds source.
Store new observed odds history only for the licensed retention period.

## Flow and identity

```text
Server-side provider clients (one shared polling schedule)
  -> private raw archive + delivery ledger
  -> pinned payload schemas + versioned field/entity/market mappings
  -> Supabase PostgreSQL canonical facts and append-only economic history
  -> calculation jobs + versioned dashboard read models
  -> Fastify Arena Props API + bounded shared-response cache
  -> NBA dashboard (fresh / stale / unavailable states)
```

Arena owns player/team/event UUIDs. `provider_crosswalks` maps vendor identities
to those UUIDs. TheSportsDB IDs and BALLDONTLIE IDs for one player point to the
same canonical player. Odds outcomes can identify players by name: resolve via
reviewed aliases scoped to sport/event/team, never auto-publish a fuzzy/name-only
match. Ambiguous matches enter quarantine. Match events through verified teams
and start time; handle postponements without creating a second game.

React consumes Arena field names and IDs only. Each sourced fact retains its
provider, raw-delivery reference, source timestamp, ingestion timestamp and
adapter version. Missing data is null/unavailable, never a fabricated zero.

## Dataset-to-database-to-dashboard map

Existing table names below come from `supabase/migrations`. Additions are proposed,
not applied. Every live row must be traceable to an accepted delivery.

| Data point / mapping | Canonical storage | Dashboard use |
| --- | --- | --- |
| BALLDONTLIE team ID -> crosswalk; name/abbreviation | `canonical_teams` + `provider_crosswalks` | Team labels, opponent filters |
| Player ID -> crosswalk; first/last name -> full name; team ID -> canonical team | `canonical_players` | Player directory and identity |
| Position, biography, season roster membership | Add player profile fields and dated roster memberships | Player detail and accurate roster filtering; free players listing does not prove active status |
| Game ID, teams, datetime, lifecycle, scores | Extend `canonical_events` with scores, season and full lifecycle | Schedule, matchups, game status |
| Player/event/period and recorded stat values | Add `player_game_stats`, correction revisions and finality | Performance history and settlement inputs |
| SportsDB `idPlayer`, `strThumb`, `strCutout` | Crosswalk + existing `media_assets`; approved objects only | Shared avatar/headshot component |
| Odds event, bookmaker, market, player description, side, point and price | Crosswalks, `canonical_markets`, `canonical_props`, `provider_offers`; add bookmaker identity | Props and sportsbook comparison |
| Changed offer line/price/status with provider update time | Existing `prop_snapshots`; strengthen deduplication and observation metadata | Line movement and odds history |
| Game moneyline/spread/total | Add separate event-market offers/snapshots | Matchups; existing player-required `canonical_props` cannot represent game markets |
| Eligible final game results compared to selected line | `metric_snapshots` + `calculation_runs` | Hit counts, hit rates, trends; include sample size, cutoff, push/DNP rules |
| Validated projection/probability versus offered price | Versioned calculations and metrics | EV/projections only after model acceptance |
| Raw record, cursor, retry, budget, error | Existing delivery/quarantine tables; add job leases, checkpoints, budget ledger | Internal ingestion status and freshness |
| Published batch generation and complete response payload | Add read-model generations and bounded cache | Fast board/research reads for many users |

Start with points for one event and mapped players. Then expand to rebounds,
assists, threes and combination markets from the NBA reference contract. Each
market needs period, overtime, unit, side and settlement rules, not only a label.
Books and data suppliers are different entities: preserve bookmaker identity
even when two suppliers carry the same book. Never overwrite one source silently.

## Supabase implementation discipline

1. Pin the Supabase CLI in the project and generate local configuration. Docker
   is installed on this machine; engine readiness and local startup are unverified.
   No local Supabase project has been started by this setup change.
2. Review existing migrations before applying them. They depend on Supabase's
   `auth` schema and `pgmq`; a bare PostgreSQL instance is not an equivalent test.
3. Add forward migrations for the gaps above. Separate basketball sport from
   NBA competition consistently, strengthen crosswalk integrity, and represent
   canceled/postponed/unknown games beyond the current three-phase enum.
4. Protect internal tables with explicit grants and RLS or move them into an
   unexposed schema. Most existing core tables lack RLS. Test `anon`, authenticated
   and worker roles; keep service-role/database credentials out of browsers.
5. Seed a dedicated local database deterministically. Keep fixtures isolated
   from real provider imports and carry explicit source/freshness metadata.
6. Test empty-database migration, seed, replay, SQL constraints and role access.
   Local reset is destructive: use only the disposable development project.
7. Later, replay the same migrations into a separate Supabase staging project;
   reconcile migration history if the project already exists. Schema deployment
   does not move local records: separately export/import licensed facts and verify
   counts, UUID crosswalks and snapshot history. Keep mock seeds out of production.
8. Change backend connection secrets and validate backup/restore before cutover.
   Bound the connection pool per API/worker process. Select a direct or session
   pooler connection for persistent services according to network support; use a
   migration connection separately from runtime pooling.

This follows Supabase's [migration workflow](https://supabase.com/docs/guides/local-development/database-migrations)
and [connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres).
Choosing Supabase for data storage does not change the existing auth/billing plan.
Large raw responses and image files belong in object storage behind the existing
archive/media interfaces; PostgreSQL stores their metadata and references.

## Polling and 5,000-user design target

Treat 5,000 as concurrently active users for planning; this is a target, not a
capacity claim. With one board request every 45 seconds, baseline load is about
111 requests/second before detail views and bursts. Proposed test target: 5,000
virtual sessions for 30 minutes, mixed board/detail traffic and a 2x burst, with
p95 API latency below 300 ms, error rate below 1%, bounded database connections,
and no provider requests caused by user reads. Record the actual host sizes,
payload sizes, cache hit rates and data freshness with the results.

- One worker refreshes each dataset for everybody; the API reads prepared data.
  Cache by competition, filter set, entitlement and generation, not by user when
  the response is identical. Private user data remains separately authorized.
- Cache reference lists longer, serve generation-based ETags, paginate histories,
  jitter browser refreshes and coalesce simultaneous cache misses. Add Redis when
  multiple API instances require coordinated cache state.
- Use durable job leases, bounded retries/backoff, a dead-letter path, provider
  timeouts and a persistent credit ledger. Retrying a write must be idempotent.
- Begin with manual, bounded free-plan imports. Proposed BALLDONTLIE ceiling:
  4 requests/minute shared across all NBA jobs, reserving headroom. Bootstrap
  identities with saved cursors; periodically reconcile rather than rescan on views.
- Sample one NBA event/market before scheduling odds. For example, 8 returned
  markets x 10 events x 1 region costs about 80 credits per sweep; 500 credits
  cover only about six such sweeps. This is an illustrative budget, not measured
  account usage. Track provider quota headers and stop before exhausting the budget.
- Headshots are low-frequency enrichment; fetch missing/changed assets and cache
  approved files. Do not request each image from the vendor on every page view.
- Define freshness per dataset. On quota exhaustion or outage, keep the last valid
  generation with its true timestamp, show stale/unavailable, and suppress actions
  requiring current prices. A refresh request never makes old data fresh.

The example odds budget uses the [documented event-odds credit formula](https://the-odds-api.com/liveapi/guides/v4/#get-event-odds).

## Repeatable sport onboarding SOP and completion evidence

| Step | Deliverable | Acceptance evidence |
| --- | --- | --- |
| 1. Scope | Competition, season/history window, books, markets and timing manifest | Exact supported dataset; free/paid gaps recorded |
| 2. Acquire | Backend keys, access probes, limits and usage-rights record | Small sanitized sample per endpoint; no key-bearing URLs in logs |
| 3. Map | Versioned field, entity and market maps; alias review | Every required field accounted for; ambiguity quarantined |
| 4. Store | Forward Supabase migrations, seed and repository methods | Empty DB, constraints, RLS and corrected-record tests pass |
| 5. Ingest | Clients, raw archive, retries, checkpoints and budget-aware scheduler | Replay produces no duplicate facts; crash/retry recovers |
| 6. Calculate | Final-stat history and versioned metrics | Known game/line examples reproduce; DNP/push/postponement covered |
| 7. Serve | NBA API read models and cache | Contract/auth/freshness tests; reads never trigger provider polling |
| 8. Connect | Dashboard data adapter behind competition feature flags | Desktop/mobile live-data QA; unavailable fields explicit |
| 9. Prove | Load, outage, restore and credit-cost report | Capacity/freshness targets met on named infrastructure |
| 10. Replicate | Sport manifest, adapters, market tests and coverage matrix | Reuse shared services; repeat evidence for the next sport |

Next implementation slice: start isolated local Supabase, close the core schema
and access-control gaps, then ingest NBA teams/players/games from BALLDONTLIE.
Next add verified headshots and one event's current odds. Full stats/history,
analytics and sustained live polling follow only when their source coverage exists.
