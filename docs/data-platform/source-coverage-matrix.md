# Source Coverage Matrix

## Purpose

This is the procurement and vendor-evaluation layer. It determines which
source, product and plan can satisfy each requirement in
[frontend-data-requirements.md](frontend-data-requirements.md) before Premium
Picks buys or integrates anything.

BALLDONTLIE and The Odds API are candidates, not selected architecture. Their
cells remain `UNKNOWN` until primary documentation and sample payloads prove
coverage. The matrix is designed to reveal whether that two-provider hypothesis
works instead of forcing the result.

## Status legend

| Status | Meaning |
| --- | --- |
| `YES` | Official plan documentation and a sample/test payload prove the exact requirement |
| `PARTIAL` | Some leagues, fields, books, history, freshness or rights are missing |
| `NO` | Official evidence shows the provider/product does not supply it |
| `UNKNOWN` | Not yet researched or evidence is insufficient |
| `OWN` | Premium Picks creates or owns the data |
| `N/A` | The provider category is not expected to supply it |

Marketing pages alone cannot earn `YES`. Each decision needs the applicable
plan, endpoint/feed, supported league/market, sample field, refresh behavior,
rate limit and commercial-rights evidence.

## Candidate architecture hypothesis

```text
Candidate sports/stat feed       Candidate odds feed       Candidate media/context feeds
           |                            |                              |
           +----------------------------+------------------------------+
                                        |
                               Premium Picks ingestion
                                        |
                          identity + market normalization
                                        |
                                   PostgreSQL
                              /         |         \
                     calculations   Redis/cache   object storage
                              \         |         /
                                 Premium Picks API
                                        |
                                    Dashboard
```

The candidate names currently under evaluation are:

- BALLDONTLIE for some sports identity, schedules, rosters, injuries and stats.
- The Odds API for game odds, player props and odds history.
- One or more licensed media providers for logos and headshots.
- A weather source and possibly specialist soccer, tennis and esports sources.
- Premium Picks for normalization, user/community data, calculations and model outputs.

None of those external roles is confirmed in this document yet.

## Domain coverage matrix

| Requirement family | Requirement IDs | Launch importance | BALLDONTLIE | The Odds API | Media provider | Context/specialist feed | Premium Picks | Selected source | Gap/evidence note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sport and competition identity | IDN-001–004 | Critical | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | OWN normalization/config | TBD | Need stable IDs, 12-sport coverage and season history |
| Team identity | IDN-005–006 | Critical | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | OWN normalization | TBD | Verify college, soccer and esports naming |
| Team logos | IDN-007, ODD-002 | Critical | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | N/A | TBD | Must include commercial display/cache/resize rights |
| Player identity and roles | IDN-008–010 | Critical | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | OWN normalization | TBD | Verify rosters and position vocabularies by league |
| Player headshots | IDN-011, IDN-014 | Critical unless fallback approved | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | N/A | TBD | Rights and coverage may differ by league |
| Venues | IDN-012, EVT-005, EVT-013 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN normalization | TBD | Needed for timezone and weather joins |
| Provider identity mappings | IDN-013 | Critical | Source IDs | Source IDs | Source IDs | Source IDs | OWN | Premium Picks | Every external entity must map to a canonical PP ID |
| Schedules and participants | EVT-001–006 | Critical | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN normalization | TBD | Verify postponement/correction behavior |
| Live/final scores and segments | EVT-007–010 | Conditional/live launch | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN normalization | TBD | Need semi-live latency and correction evidence |
| Esports event context | EVT-011 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN normalization | TBD | Tournament tier, LAN/online and best-of |
| Tennis event context | EVT-012 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN normalization | TBD | Tour, round and surface required |
| Rosters and memberships | RST-001–003 | Critical | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN normalization | TBD | Historical effective dates required |
| Depth charts and starters | RST-004 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | N/A | TBD | Verify projected versus official state |
| Baseball/soccer lineups | RST-005–007 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN normalization | TBD | Must preserve projection/confirmation timestamp |
| Esports rosters and roles | RST-008 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN normalization | TBD | Specialist coverage likely required; verify |
| Injuries and availability | RST-009–011 | Conditional but prominent | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN normalization | TBD | Notes, timestamps and historical retention rights |
| Shared player/team event stats | STA-001–008 | Critical | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN aggregations | TBD | Need event-level facts, not only season averages |
| Basketball stats | STA-009–010 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN calculations | TBD | Shot location is a separate later requirement |
| Football stats/usage | STA-011–012 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN calculations | TBD | Targets/touches may require granular source |
| Baseball stats/pitch data | STA-013–014 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN calculations | TBD | Pitch-level rights and cost evaluated separately |
| Hockey stats | STA-015 | Conditional/unconfirmed UI | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN calculations | TBD | Product requirements still incomplete |
| Soccer stats | STA-016 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN calculations | TBD | Player stats plus team context and formations |
| Tennis stats | STA-017 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN calculations | TBD | Set-level statistics and surface context |
| LoL data | STA-018 | Conditional | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | OWN calculations | TBD | Series/map/champion data and artwork rights |
| CS2 data | STA-019 | Conditional | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | OWN calculations | TBD | Map/round/veto/ranking coverage |
| Valorant data | STA-020 | Conditional | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | OWN calculations | TBD | Map/player/agent data and artwork rights |
| Live clock and play-by-play | STA-021–022 | Later unless live launch | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN normalization | TBD | Do not buy until live product promise is set |
| Standings and rankings | CTX-001–002 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN snapshots | TBD | Rankings require source attribution |
| Weather | CTX-003 | Conditional | N/A | N/A | N/A | UNKNOWN | OWN normalization | TBD | Need forecast and observed event-time conditions |
| Win probability and opponent metrics | CTX-004–007 | Conditional | UNKNOWN raw inputs | UNKNOWN odds inputs | N/A | UNKNOWN | OWN calculations | TBD | Separate source predictions from PP calculations |
| Tennis H2H/splits | CTX-008 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN calculations | TBD | Full meeting history needed |
| Baseball arsenal aggregates | CTX-009 | Conditional | UNKNOWN raw inputs | N/A | N/A | UNKNOWN | OWN | TBD | Depends on pitch-level source |
| Esports map/context aggregates | CTX-010 | Conditional | UNKNOWN | UNKNOWN | UNKNOWN artwork | UNKNOWN | OWN | TBD | Map artwork and stats may have different licensors |
| Matchup/game odds | CTX-011, ODD-017 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN consensus calculations | TBD | Moneyline, spread, total and esports score odds |
| Sportsbook identity/region | ODD-001–002, ODD-019 | Critical | UNKNOWN | UNKNOWN | UNKNOWN | N/A | OWN normalization/config | TBD | Six prototype books; jurisdictions unconfirmed |
| Current player props | ODD-003–010 | Critical | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN taxonomy/normalization | TBD | Verify player props by league, book and plan |
| Historical prop snapshots | ODD-011 | Critical proprietary dataset | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN retention pipeline | TBD | Contract must allow permanent snapshot retention |
| Opening/closing/min/max/best/movement | ODD-012–016 | Critical calculations | Raw input only | Raw input only | N/A | Raw input only | OWN | Premium Picks | Requires complete eligible snapshot history |
| Settlement | ODD-018 | Critical | UNKNOWN stats | UNKNOWN result fields | N/A | UNKNOWN | OWN settlement logic | TBD | Push/void/correction rules must be explicit |
| Research metrics | CAL-001–007, CAL-009, CAL-011 | Critical | Raw input only | Raw line input only | N/A | Raw input only | OWN | Premium Picks | Reproducible version + cutoff required |
| Projections/backtests | CAL-008, CAL-010, CAL-012 | Product requirement | Possible inputs | Market inputs | N/A | Possible inputs | OWN | Premium Picks | Never overwrite PP projections with vendor values |
| User/subscription/preferences | USR-001–002 | Critical application data | N/A | N/A | N/A | N/A | OWN | Premium Picks | Privacy, deletion and export controls |
| Saved and Pick Builder | USR-003–004 | Critical application data | N/A | N/A | N/A | N/A | OWN | Premium Picks | User-scoped transactional data |
| Popular/consensus data | USR-005–009 | Critical Community data | N/A | N/A | N/A | N/A | OWN | Premium Picks | Abuse-resistant append-only actions + aggregates |

## Field-level evidence register

Every external `Yes` or `Conditional` requirement from the frontend matrix must
eventually have one row here. Duplicate rows are allowed when two providers are
evaluated for the same requirement.

| Requirement ID | Candidate provider | Product/plan | Endpoint/feed | Coverage status | Official evidence URL | Sample verified | Refresh/latency | Historical depth | Rate/stream limit | Display rights | Cache rights | Derived-data rights | Retention rights | Price evidence | Checked date | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| IDN-008 | BALLDONTLIE | TBD | TBD | UNKNOWN | TBD | No | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Do not infer from provider name |
| STA-002 | BALLDONTLIE | TBD | TBD | UNKNOWN | TBD | No | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Verify event-level fields per required league |
| ODD-006 | The Odds API | TBD | TBD | UNKNOWN | TBD | No | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Verify player props, books and jurisdictions |
| ODD-011 | The Odds API | TBD | TBD | UNKNOWN | TBD | No | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Historical API access is not proof of retention rights |
| IDN-011 | Media provider TBD | TBD | TBD | UNKNOWN | TBD | No | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Verify every launch competition separately |

## Plan and pricing comparison

One provider may require multiple products or plans. Record prices only from a
current official pricing page, quote or contract.

| Provider | Product/plan | Monthly price | Annual price/commitment | Included requests/events | Overage | Concurrency | Historical access | Webhooks/stream | Commercial rights | Setup/support fee | Evidence and date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BALLDONTLIE | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| The Odds API | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| Media provider | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| Weather/context provider | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| Soccer specialist | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| Tennis specialist | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| Esports specialist | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |

## Usage and cost model

For poll-based products, estimate each endpoint independently:

```text
monthly_requests =
  competitions
  * active_event_windows_per_month
  * endpoints_per_window
  * polls_per_window
  + reference_syncs
  + reconciliation_syncs
  + backfills
```

For event/stream products, record peak simultaneous events and expected monthly
messages. Pricing must be modeled at low, expected and high load, including
retries, corrections and development/staging traffic.

At minimum calculate:

- Reference sync: sports, competitions, teams, players, rosters and schedules.
- Pregame hot window: injuries, lineups and props.
- Live window if launched: offers, status, scores and statistics.
- Post-event reconciliation and corrections.
- Historical backfill volume.
- Media object count, transformations, storage and CDN bandwidth.

## Provider selection gates

A provider/product cannot be selected until:

1. Every claimed `YES` has primary evidence and a sample payload.
2. The required leagues, sportsbooks, markets and jurisdictions are explicit.
3. The qualifying paid plan and rate limits support the target freshness.
4. Display, caching, derived-data and retention rights are accepted.
5. Stable provider IDs can map into Premium Picks canonical entities.
6. Corrections, deletions and status/suspension behavior are understood.
7. Expected and high-load costs are calculated, including overage.
8. Remaining `PARTIAL`, `NO` and `UNKNOWN` cells have an approved fallback or
   a feature flag that removes the unsupported promise.

## Next evaluation order

1. BALLDONTLIE official coverage, endpoints, plans, limits and rights.
2. The Odds API official player-prop, bookmaker, historical, plan and rights coverage.
3. Media provider shortlist for headshots, team marks and sportsbook logos.
4. Weather and specialist soccer/tennis/esports feeds for unresolved gaps.
5. Consolidated architecture and price scenarios only after the matrix is populated.

