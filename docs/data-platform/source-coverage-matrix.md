# Source Coverage Matrix

## Purpose

This is the procurement and vendor-evaluation layer. It determines which
source, product and plan can satisfy each requirement in
[frontend-data-requirements.md](frontend-data-requirements.md) before Arena
Props buys or integrates anything.

Arena Props has selected provider roles: BALLDONTLIE is the primary sports-truth
source, The Odds API is the primary betting-market source, and TheSportsDB is
the primary media-enrichment source. The role decision does not turn an
unverified requirement into `YES`: cells remain `UNKNOWN` or `PARTIAL` until
official documentation, a qualifying plan, a real sample payload and acceptable
rights prove the exact requirement.

## Status legend

| Status | Meaning |
| --- | --- |
| `YES` | Official plan documentation and a sample/test payload prove the exact requirement |
| `PARTIAL` | Some leagues, fields, books, history, freshness or rights are missing |
| `NO` | Official evidence shows the provider/product does not supply it |
| `UNKNOWN` | Not yet researched or evidence is insufficient |
| `OWN` | Arena Props creates or owns the data |
| `N/A` | The provider category is not expected to supply it |

Marketing pages alone cannot earn `YES`. Each decision needs the applicable
plan, endpoint/feed, supported league/market, sample field, refresh behavior,
rate limit and commercial-rights evidence.

## Selected source-role architecture

```text
BALLDONTLIE sports truth         The Odds API market truth  TheSportsDB media enrichment
           |                            |                              |
           +----------------------------+------------------------------+
                                        |
                               Arena Props ingestion
                                        |
                          identity + market normalization
                                        |
                                   PostgreSQL
                              /         |         \
                     calculations   Redis/cache   object storage
                              \         |         /
                                 Arena Props API
                                        |
                                    Dashboard
```

The selected roles are:

- BALLDONTLIE for sports identity, schedules, rosters, injuries, lineups,
  play-by-play, standings, rankings and player/team statistics.
- The Odds API for current game odds, current player props, DFS/pick'em markets
  and historical odds/prop snapshots. BALLDONTLIE odds remain a comparison and
  opening-price fallback where supported.
- TheSportsDB for player, team, league, event and venue visual enrichment,
  subject to entity-level coverage and commercial media rights.
- A weather source and possibly specialist soccer, tennis and esports sources.
- Arena Props for normalization, user/community data, calculations and model outputs.

The endpoint and field implementation contract is
[provider-endpoint-field-catalog.md](provider-endpoint-field-catalog.md). This
matrix remains the proof and procurement ledger for exact coverage.

## Domain coverage matrix

| Requirement family | Requirement IDs | Launch importance | BALLDONTLIE | The Odds API | Media provider | Context/specialist feed | Arena Props | Selected source | Gap/evidence note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sport and competition identity | IDN-001–004 | Critical | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | OWN normalization/config | TBD | Need stable IDs, 12-sport coverage and season history |
| Team identity | IDN-005–006 | Critical | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | OWN normalization | TBD | Verify college, soccer and esports naming |
| Team logos | IDN-007, ODD-002 | Critical | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | N/A | TBD | Must include commercial display/cache/resize rights |
| Player identity and roles | IDN-008–010 | Critical | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | OWN normalization | TBD | Verify rosters and position vocabularies by league |
| Player headshots | IDN-011, IDN-014 | Critical unless fallback approved | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | N/A | TBD | Rights and coverage may differ by league |
| Venues | IDN-012, EVT-005, EVT-013 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN normalization | TBD | Needed for timezone and weather joins |
| Provider identity mappings | IDN-013 | Critical | Source IDs | Source IDs | Source IDs | Source IDs | OWN | Arena Props | Every external entity must map to a canonical AP ID |
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
| Win probability and opponent metrics | CTX-004–007 | Conditional | UNKNOWN raw inputs | UNKNOWN odds inputs | N/A | UNKNOWN | OWN calculations | TBD | Separate source predictions from Arena Props calculations |
| Tennis H2H/splits | CTX-008 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN calculations | TBD | Full meeting history needed |
| Baseball arsenal aggregates | CTX-009 | Conditional | UNKNOWN raw inputs | N/A | N/A | UNKNOWN | OWN | TBD | Depends on pitch-level source |
| Esports map/context aggregates | CTX-010 | Conditional | UNKNOWN | UNKNOWN | UNKNOWN artwork | UNKNOWN | OWN | TBD | Map artwork and stats may have different licensors |
| Matchup/game odds | CTX-011, ODD-017 | Conditional | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN consensus calculations | TBD | Moneyline, spread, total and esports score odds |
| Sportsbook identity/region | ODD-001–002, ODD-019 | Critical | UNKNOWN | UNKNOWN | UNKNOWN | N/A | OWN normalization/config | TBD | Six prototype books; jurisdictions unconfirmed |
| Current player props | ODD-003–010 | Critical | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN taxonomy/normalization | TBD | Verify player props by league, book and plan |
| Historical prop snapshots | ODD-011 | Critical proprietary dataset | UNKNOWN | UNKNOWN | N/A | UNKNOWN | OWN retention pipeline | TBD | Contract must allow permanent snapshot retention |
| Opening/closing/min/max/best/movement | ODD-012–016 | Critical calculations | Raw input only | Raw input only | N/A | Raw input only | OWN | Arena Props | Requires complete eligible snapshot history |
| Settlement | ODD-018 | Critical | UNKNOWN stats | UNKNOWN result fields | N/A | UNKNOWN | OWN settlement logic | TBD | Push/void/correction rules must be explicit |
| Research metrics | CAL-001–007, CAL-009, CAL-011 | Critical | Raw input only | Raw line input only | N/A | Raw input only | OWN | Arena Props | Reproducible version + cutoff required |
| Projections/backtests | CAL-008, CAL-010, CAL-012 | Product requirement | Possible inputs | Market inputs | N/A | Possible inputs | OWN | Arena Props | Never overwrite Arena Props projections with vendor values |
| User/subscription/preferences | USR-001–002 | Critical application data | N/A | N/A | N/A | N/A | OWN | Arena Props | Privacy, deletion and export controls |
| Saved and Pick Builder | USR-003–004 | Critical application data | N/A | N/A | N/A | N/A | OWN | Arena Props | User-scoped transactional data |
| Popular/consensus data | USR-005–009 | Critical Community data | N/A | N/A | N/A | N/A | OWN | Arena Props | Abuse-resistant append-only actions + aggregates |

## Field-level evidence register

Every external `Yes` or `Conditional` requirement from the frontend matrix must
eventually have one row here. Duplicate rows are allowed when two providers are
evaluated for the same requirement.

| Requirement ID | Candidate provider | Product/plan | Endpoint/feed | Coverage status | Official evidence URL | Sample verified | Refresh/latency | Historical depth | Rate/stream limit | Display rights | Cache rights | Derived-data rights | Retention rights | Price evidence | Checked date | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| IDN-008 | BALLDONTLIE | ALL-ACCESS | Per-sport players endpoints | PARTIAL | [NBA OpenAPI](https://www.balldontlie.io/openapi/nba.yml) plus per-sport schemas | No | Daily/change target; exact provider revision cadence TBD | Varies by sport | 600 requests/minute published | TBD | TBD | TBD | TBD | $299.99/month published | 2026-08-26 | Route and documented NBA fields confirmed; fixture, rights and every launch-sport schema still required |
| STA-002 | BALLDONTLIE | ALL-ACCESS | Per-sport player/event stat endpoints | PARTIAL | [BALLDONTLIE API hub](https://www.balldontlie.io/docs) | No | Real-time documented for selected endpoints; exact per-sport latency TBD | Varies by sport/endpoint | 600 requests/minute published | TBD | TBD | TBD | TBD | $299.99/month published | 2026-08-26 | Technical breadth documented; verify event-level fields and correction behavior per required league |
| ODD-006 | The Odds API | Paid tier TBD | `GET /v4/sports/{sport}/events/{eventId}/odds` | PARTIAL | [V4 docs](https://the-odds-api.com/liveapi/guides/v4/) and [market catalog](https://the-odds-api.com/sports-odds-data/betting-markets.html) | No | Additional markets documented at one-minute intervals; slower than the current 5-30 second target | Current event lifetime | Credits depend on returned markets and regions; paid rate limit 30 requests/second | TBD | TBD | TBD | TBD | $30-$249 published tiers before higher-volume plans | 2026-08-26 | Props and books vary by sport/book/jurisdiction; fixture and freshness decision required |
| ODD-011 | The Odds API | Paid tier TBD | `GET /v4/historical/sports/{sport}/events/{eventId}/odds` plus Arena Props polling archive | PARTIAL | [Historical odds guide](https://the-odds-api.com/historical-odds-data/) | No | Provider snapshots at five-minute intervals for additional markets | Additional-market history documented from 2023-05-03 | Generally 10x returned markets x regions per event | TBD | TBD | TBD | TBD | Paid tier required | 2026-08-26 | Historical access proves availability, not permanent Arena Props retention or derivative rights |
| IDN-011 | TheSportsDB | Premium V2 candidate | `/lookup/player/{id}` plus search/list mapping endpoints | PARTIAL | [V2 OpenAPI](https://www.thesportsdb.com/api/spec/v2/openapi.yaml) | No | Revision/monthly target; provider revision signaling TBD | Entity records vary by sport/league | 100 requests/minute published for Premium | TBD | TBD | TBD | TBD | $9/month published | 2026-08-26 | Image URLs documented; verify coverage, ownership and commercial cache/resize rights per launch competition |

## Plan and pricing comparison

One provider may require multiple products or plans. Record prices only from a
current official pricing page, quote or contract.

| Provider | Product/plan | Monthly price | Annual price/commitment | Included requests/events | Overage | Concurrency | Historical access | Webhooks/stream | Commercial rights | Setup/support fee | Evidence and date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BALLDONTLIE | ALL-ACCESS | $299.99 published monthly | Monthly; cancellation/commitment terms TBD | 600 requests/minute across sports; webhook allowance separate | TBD | TBD | Sport endpoint history varies | 10 webhook endpoints; 500,000 deliveries/month; events may be delayed up to one minute | Display/cache/derived/retention rights still need written acceptance | TBD | [Account/API docs](https://www.balldontlie.io/account/) and [webhook docs](https://www.balldontlie.io/webhooks), checked 2026-08-26 |
| The Odds API | Paid usage tier TBD after volume model | Published tiers currently $30-$249 for 20K-15M credits; higher plans discoverable after account creation | Monthly | Plan credits; current odds generally 1x region x market, historical generally 10x | N/A | Paid API documented at 30 requests/second | Paid tiers include historical access | No webhook documented in evaluated V4 contract | Display/cache/derived/retention rights still need written acceptance | None documented | [Official plans](https://the-odds-api.com/) and [V4 usage costs](https://the-odds-api.com/liveapi/guides/v4/), checked 2026-08-26 |
| TheSportsDB | Premium V2 candidate | $9 published monthly | Monthly | 100 requests/minute documented for Premium | TBD | TBD | Entity/event history varies | No required stream; livescores are polling | Commercial image display/cache/resize rights still need written acceptance | TBD | [Official API guide](https://www.thesportsdb.com/docs_api_guide), checked 2026-08-26 |
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
5. Stable provider IDs can map into Arena Props canonical entities.
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
