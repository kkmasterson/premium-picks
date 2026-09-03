# Arena Props Data Requirements and Database Outline

> This is the product-scope overview. The normative implementation documents
> are the [frontend data requirements](frontend-data-requirements.md),
> [source coverage matrix](source-coverage-matrix.md), and
> [database and ingestion specification](database-ingestion-spec.md).

## Purpose

This document is the data contract for the dashboard before vendors, API plans,
and pricing are selected. It inventories what the current Arena Props product
must display, identifies what must be licensed or ingested, separates source
facts from Arena Props calculations and user data, and defines the first-pass
database boundaries.

The next procurement phase should map every external source domain in this
document to a named provider, endpoint or feed, commercial plan, license terms,
refresh mechanism, rate limit, and monthly cost.

## Audited product scope

The inventory was checked against the current routes, mock data, player-screen
profiles, product documentation, and the running dashboard on 2026-08-26.

### Active dashboard surfaces

| Surface | Data displayed or used |
| --- | --- |
| Global shell and search | Sports/competitions, sportsbook list and logos, player/team/game search, current user, subscription tier, sport selection |
| Props | Player identity, team, position, opponent, event time, prop market, current line, every provider offer, best offer, average, projection, difference, L5/L10/L15/season/H2H hit rates, streak, availability and last update |
| Discrepancies | All prop identity/performance data plus minimum and maximum provider lines, supplying providers, absolute line difference and percentage difference |
| Players | Player identity, headshot/avatar, sport, current team, position/role, jersey number, today's opponent/event and count of available props |
| Player research | Identity and headshot, team logos, event status, consensus, current offers, period/segment markets, filters, event history, DNP/unavailable states, component stats, supporting stats, line movement, prop history and sport-specific context modules |
| Trends | Market catalog plus ranked L5/L10 hit rates, projection differences and over/under streaks |
| Matchups | Event identity, teams/logos, schedule/status, prop count, player count, sportsbook count and event-specific prop table |
| Projections | Arena Props model output compared with current sportsbook lines, sortable positive/negative difference and the shared prop performance fields |
| Popular | Community save count, Over/Under consensus, available provider offers and shared prop performance fields |
| Saved | The current user's saved props, players and games |
| Pick Builder | User-selected prop, Over/Under side and optional provider; selections persist across navigation and refresh |

### Currently advertised coverage

The prototype top navigation exposes these 12 sport or competition keys:

- NBA
- NFL
- MLB
- NHL
- WNBA
- NCAAB
- NCAAF
- Soccer
- Tennis
- League of Legends
- Counter-Strike 2
- Valorant

`All` is a filter, not a competition. Dota 2 and Call of Duty are explicitly
excluded.

These 12 labels are the frozen later-sport roadmap. Only NBA is funded during
the reference proof. Every other label remains feature-gated until its own
Phase 8 provider, rights, schema, capacity and launch gates pass; roadmap
inclusion does not require purchasing all-sport access in advance.

### Coverage qualifications

- WNBA, MLB, NFL, tennis, soccer, LoL, CS2 and Valorant have documented deep-player patterns.
- NBA and NCAAB currently inherit a WNBA-shaped basketball proxy.
- NCAAF currently inherits an NFL-shaped football proxy.
- NHL currently has only the shared player shell; hockey-specific modules remain unconfirmed.
- Vendor coverage must be verified separately for every league, market, player-prop type, sportsbook, image type and historical depth. A provider saying that it supports a sport does not prove that it supplies the player props or granular statistics required here.

## Data ownership classes

Every displayed field belongs to one of four classes. Keeping these separate
prevents us from paying a vendor for values we can calculate and prevents
vendor data from being confused with user-generated state.

| Class | Examples | System of record |
| --- | --- | --- |
| Licensed source facts | Schedules, rosters, player headshots, team logos, injuries, box scores, live stats, sportsbook lines and odds | External provider, preserved with provider ID and source timestamp |
| Arena Props calculations | Hit rates, averages, streaks, min/max discrepancy, projections, matchup scores, rankings created by our model | Arena Props calculation/version tables |
| User and community data | Saves, selected picks, preferred books, Popular counts and Over/Under community consensus | Arena Props transactional database |
| Product configuration | Supported competitions, market definitions, display labels, stat mappings, freshness policy, feature flags | Arena Props configuration managed in code/admin tools |

## External data domains to procure

### 1. Sports identity and media

Required fields:

- Sport, league/competition, season, conference/division and tournament identity.
- Team or club canonical name, abbreviations, colors, location and active status.
- Team logos in suitable light/dark variants and multiple sizes.
- Athlete/player canonical name, display name, handle where applicable, position/role, jersey number, handedness where relevant and active status.
- Player headshots or approved avatar/artwork, image dimensions, revision/version and usage-rights metadata.
- Venue, stadium, arena, court, map or event location identity where available.
- Provider-specific IDs for every canonical entity.

Licensing note: an API URL returning an image is not automatically permission to
cache, resize, display or redistribute it commercially. Logo, headshot, league
mark and esports artwork rights must be priced and reviewed separately.

### 2. Schedules, events and competition context

Required fields:

- Event/game/match/series ID, competition, season and stage/round/week.
- Start time as UTC plus source timezone, scheduled date and display status.
- Home/away or participant order, neutral-site flag and venue.
- Pre-game, live, delayed, postponed, cancelled and final statuses.
- Period/quarter/half/inning/set/map/round structure as applicable.
- Best-of format, LAN/online status, tournament tier and esports event metadata.
- Tennis event, tour, round, surface/court type and venue.
- Final score plus segment/map/set scores.

### 3. Rosters, participation, lineups and availability

Required fields:

- Current and historical team memberships with effective dates.
- Roster status, starter/bench/depth-chart slot and projected versus confirmed state.
- Event participants and confirmed active/inactive status.
- Injury name/body area or reason, status, note, report time and expected return when licensed.
- DNP, did-not-start, substitution and minutes/time-played information.
- Soccer formations and positional slots.
- MLB probable and confirmed starting pitchers, batting order and handedness.
- Football usage/opportunity roles and depth context.
- Esports roster membership, in-game role and substitutions.

### 4. Historical and semi-live player/team statistics

The database needs event-level facts, not only vendor-provided L5 averages.
Arena Props must be able to reproduce every displayed average, hit rate and
chart from underlying event records.

Shared requirements:

- Athlete event participation and stat values.
- Team event statistics and results.
- Segment-level values for quarters, halves, innings, sets, maps and rounds.
- Source correction/revision timestamps.
- Explicit missing, DNP and unavailable states rather than a numeric zero.

Sport-specific granularity currently used or specified:

| Family | Required examples |
| --- | --- |
| Basketball | Minutes, points, rebound splits, assists, combinations, blocks, steals, turnovers, shooting makes/attempts, fouls, fantasy scoring inputs, quarter/half splits, shot-location data if the court view remains in scope |
| Football | Passing/rushing/receiving/kicking stats, completions, touchdowns, receptions, targets, touches, opportunity shares, team pass rate and period splits |
| Baseball | Hitting, pitching outs, strikeouts, hits/walks allowed, pitch count, pitch type, usage, velocity, whiff rate, opponent batting results, innings and weather context |
| Hockey | Points, goals, assists, shots on goal and period splits for the current shell; goalie/skater-specific needs remain to be validated |
| Soccer | Shots, shots on target, passes, tackles, fouls, clearances, goalkeeper saves/goals allowed/clean sheets, team form, possession, pass accuracy, cards and lineup/formation state |
| Tennis | Games, aces, double faults, break points, first-serve statistics, match/set results, surface, form and player head-to-head meetings |
| LoL | Series and per-map kills, assists, CS, damage, healing, wards, champion usage/results, team form, rosters and match/map scores |
| CS2 | Series and per-map kills, assists, headshots, deaths, rounds, K/D, rating, map results, map picks/bans, team form, rosters and rankings |
| Valorant | Series and per-map kills, assists, headshots, deaths, agent usage where retained, map results, team form and rosters |

### 5. Sportsbook and player-prop markets

Required fields:

- Sportsbook/operator identity, display name, jurisdiction/region, logo and active status.
- Canonical market definition, sport, competition, player/team scope, period and unit.
- Provider market ID and mapping to the canonical Arena Props market.
- Event, player, market, side, line/handicap, American odds and provider.
- Offer status: open, suspended, closed, settled, cancelled or unavailable.
- Provider publish time, time received by Arena Props and last confirmed time.
- Main versus alternate line, limits or promotion metadata only where licensed and reliable.
- Settlement result including over, under, push, void and correction.
- Full line/price change history, not only the current offer.

The approved target operators are DraftKings, FanDuel, BetMGM and Caesars.
Prototype references to Fanatics or bet365 are not launch commitments. Provider
documentation alone is not evidence that every approved book is available for
every player market, event and region; paid fixtures and rights still gate each
combination.

### 6. Contextual feeds

These data domains power the deep-player research modules and may require
separate products from the core stats/odds feed:

- Injury reports and player availability.
- Confirmed/projected lineups and depth charts.
- League standings, conference/division tables and team records.
- Team, player and esports world rankings with source attribution.
- Venue weather forecast and observed game-time weather.
- Win probabilities, moneyline/spread/total event odds and series-score odds.
- Baseball pitch arsenal and batter-versus-pitch-type splits.
- Soccer formation, recent form and team comparison stats.
- Tennis head-to-head meetings, surface splits and venue/event averages.
- Esports map pool, picks/bans, per-map stats, favorite champions/agents and team form.

### 7. Arena Props projection inputs

The projections page cannot be sourced as a single opaque number if Premium
Picks intends to own and explain its model. Retain:

- Model version and feature version.
- Prediction timestamp and prediction horizon.
- Player/event/market/period and projected value.
- Input-data cutoff timestamp.
- Optional low/high range, confidence and explanation features.
- Backtest cohort and result after settlement.

The raw inputs are primarily schedules, participation, historical stats,
opponent/team context, injuries/lineups and current market data. Vendor-provided
projections, if evaluated later, must be stored as a separate source rather than
overwriting Arena Props projections.

## Values Arena Props should calculate

The following values should normally be derived from normalized source facts:

- Average: mean of eligible event values for the selected filters and sample.
- L5/L10/L15/season hit rate: eligible event results above or below the selected line, with pushes and missing events handled explicitly.
- H2H hit rate: the same calculation restricted to the current opponent or participant.
- Streak: consecutive eligible over or under results at the chosen line.
- Difference: projection minus the selected/current line.
- Minimum and maximum line: extrema across eligible current provider offers.
- Discrepancy: absolute line difference and a documented percentage formula.
- Best Over/Under price: highest eligible price for the selected side at the same line.
- Community save count and consensus: aggregates of valid user actions with bot/rate-abuse controls.
- Props/player/books counts on matchup cards.

All calculations need a version, calculated timestamp, source cutoff and filter
signature so they can be reproduced after a vendor correction or odds change.

## Preliminary database outline

Use PostgreSQL as the canonical relational store unless vendor selection exposes
a hard requirement that changes this choice. Store media in object storage/CDN,
raw vendor payloads in inexpensive object storage, and hot current views in a
cache. Do not put binary headshot or logo files directly in PostgreSQL.

### Canonical reference and identity tables

| Table | Purpose and essential keys |
| --- | --- |
| `sports` | Stable sport/family identity |
| `competitions` | League, tour, tournament or game title; belongs to a sport |
| `seasons` | Competition season, start/end dates and current flag |
| `competition_stages` | Week, round, tournament stage, group or playoff context |
| `venues` | Location, timezone and field/court metadata |
| `teams` | Canonical team/club/country/esports organization |
| `athletes` | Canonical player identity and current display metadata |
| `positions` | Competition-aware position/role vocabulary |
| `roster_memberships` | Athlete-team-season membership with effective dates and roster status |
| `provider_entities` | Crosswalk from provider + entity type + provider ID to a canonical ID |
| `media_assets` | Owner entity, asset kind, object/CDN URL, source, dimensions, checksum, rights/expiry and revision |

`provider_entities` is mandatory. Names and abbreviations are not reliable join
keys, especially for college teams, soccer clubs and esports handles.

### Event and participation tables

| Table | Purpose and essential keys |
| --- | --- |
| `events` | Competition/season, stage, venue, UTC start, status and best-of/neutral metadata |
| `event_participants` | Team or individual side/order, home/away designation and score/result |
| `event_segments` | Quarter, inning, set, map or round hierarchy and scores/status |
| `event_rosters` | Athletes eligible/active for an event |
| `lineup_entries` | Projected/confirmed lineup, role, slot/order and source timestamp |
| `availability_reports` | Injury/inactive status, note, report time and source |
| `weather_snapshots` | Forecast/observed venue conditions and valid time |

### Statistics and research-fact tables

| Table | Purpose and essential keys |
| --- | --- |
| `stat_definitions` | Canonical stat key, unit, aggregation rules and applicable sport/segment |
| `athlete_event_stats` | Athlete + event + optional segment + stat definition + value + participation state |
| `team_event_stats` | Team + event + optional segment + stat definition + value |
| `event_results` | Final participant result and settlement-ready result metadata |
| `depth_chart_entries` | Team/season/position slot and ordered athlete assignment |
| `standings_snapshots` | Competition/season/as-of team record, rank, percentage and streak |
| `ranking_snapshots` | Ranking system, entity, rank/value, as-of time and source attribution |
| `sport_context_facts` | Typed extension records for facts that do not fit shared stats; split into family-specific tables once stable |

Avoid creating one PostgreSQL column for every sport statistic. The canonical
definition + fact model supports new markets while typed, materialized views can
serve the dashboard quickly. High-volume play-by-play is a separate future feed
and should not be purchased unless a confirmed feature needs it.

### Market, odds and projection tables

| Table | Purpose and essential keys |
| --- | --- |
| `sportsbooks` | Operator identity, region, logo asset and active status |
| `market_definitions` | Canonical market key, scope, sport, period, unit, line step and settlement rules |
| `provider_markets` | Provider market ID mapped to a canonical market with mapping confidence/status |
| `prop_instances` | Event + athlete/team + canonical market + period; stable identity independent of provider |
| `prop_offers_current` | One current offer per prop/provider/side/line with price, status and timestamps |
| `prop_offer_ticks` | Append-only line/price/status changes used for line movement and audit |
| `prop_settlements` | Final result, over/under/push/void state and correction version |
| `projection_runs` | Model/version, input cutoff, run time and status |
| `projections` | Run + prop + projected value, interval/confidence and explanation metadata |
| `research_metric_snapshots` | Cached hit rates, average, H2H, streak and difference for a line/filter signature |

`prop_offer_ticks` must be append-only. Updating a single current-odds row in
place would make Line Movement and historical Prop History impossible to
reconstruct.

### User, community and product tables

| Table | Purpose and essential keys |
| --- | --- |
| `users` | Account identity and status |
| `subscriptions` | Plan, entitlement, provider/billing reference and active dates |
| `user_preferences` | Preferred sports, books, timezone, density and display settings |
| `saved_entities` | User + entity type (`prop`, `athlete`, `event`) + canonical ID |
| `pick_builder_items` | User/session + prop + selected side/provider + created time |
| `community_prop_actions` | Append-only save/unsave or vote actions used to build Popular/consensus metrics |
| `community_prop_aggregates` | Current save count and Over/Under counts/percentages per prop |
| `feature_flags` | Competition/market/module availability and proxy/unconfirmed states |

### Ingestion, provenance and operations tables

| Table | Purpose and essential keys |
| --- | --- |
| `data_providers` | Vendor/product/feed identity and contract-level metadata reference |
| `provider_sync_cursors` | Per endpoint/feed cursor, last success and next poll time |
| `webhook_receipts` | Provider event ID, signature result, receive time, processing status and deduplication key |
| `ingestion_runs` | Feed, request window, counts, latency, status and error summary |
| `source_records` | Canonical record link, provider, source ID, source update time and payload location |
| `data_quality_issues` | Missing mappings, stale feeds, conflicts, impossible values and resolution state |

Raw payload bodies should be encrypted in object storage with retention limits;
the relational tables keep hashes, locations and provenance rather than an
unbounded JSON dump in every production row.

## Update and delivery model

```text
Provider webhook or scheduled poll
  -> authenticated ingestion endpoint
  -> durable queue and idempotency check
  -> raw payload archive
  -> provider-specific normalizer
  -> canonical identity/event/stat/market tables
  -> derived metric and projection jobs
  -> current-view cache
  -> API
  -> dashboard update through SSE or WebSocket
```

Webhooks should be used when a provider offers a reliable signed delivery feed.
Polling remains necessary for providers without webhooks, reconciliation after
missed messages, and feeds whose webhook only announces that fresh data is
available.

### Target freshness tiers for vendor comparison

These are product targets for pricing analysis, not promises from a selected
provider.

| Tier | Data | Target ingestion behavior |
| --- | --- | --- |
| A: market-moving | Current prop lines/prices, suspensions and event status | Webhook/stream when available; player props approximately every 60 seconds in the hottest window for The Odds API, with faster polling only when a selected source proves faster updates |
| B: semi-live | Player/team stats, scores, participation and live segments | Stream/webhook or approximately 15-60 second polling; reconcile after event final |
| C: pre-game context | Injuries, projected/confirmed lineups, starting pitchers, weather and roster changes | Event-driven when possible; approximately 1-5 minutes near start, slower outside the pre-game window |
| D: reference | Schedules, rosters, standings, rankings and historical corrections | Incremental hourly/daily sync plus provider change notifications |
| E: media | Logos, headshots and artwork | On first use and provider revision; cached through CDN, with periodic rights/expiry audit |

Exact polling intervals must be checked against plan rate limits. A cheap plan
that permits only a few thousand requests per month cannot support a 5-second
poll across all 12 roadmap labels and four approved operators. Capacity is
proven with NBA first and remeasured as each sport is added; provider
subscriptions are not purchased in advance.

## Data quality and normalization rules

- Keep provider timestamps and Arena Props receipt timestamps separately.
- Use UTC in storage and convert only at the presentation boundary.
- Never treat missing, unavailable, suspended, DNP or zero as interchangeable.
- Preserve stat and settlement corrections as versions; recalculate affected derived metrics.
- Make market mapping explicit by sport, competition, period and unit. Similar labels do not guarantee equivalent settlement rules.
- Keep American odds as the display form while retaining a precise normalized decimal/implied representation for comparison calculations.
- Record jurisdiction for sportsbook offers; availability and legality differ by user region.
- Deduplicate webhooks with provider event IDs or a deterministic payload key.
- Quarantine unmapped teams, players and markets instead of joining on names.
- Expose a source and freshness indicator for every hot dashboard surface.

## What must be measured before requesting prices

Vendor quotes depend on usage and rights, not only the list of sports. For each
candidate service, the pricing worksheet must include:

- Competitions and seasons covered, including college and women's leagues.
- Pregame versus live player-prop coverage by sportsbook and jurisdiction.
- Historical depth and whether historical odds ticks are included.
- Stat granularity: final box score, semi-live box score, play-by-play or tracking/location data.
- Number of monthly requests, concurrent streams or webhook events.
- Refresh SLA/typical latency and correction behavior.
- Commercial display, caching, derived-data and redistribution rights.
- Logo, headshot and artwork rights plus CDN/bandwidth terms.
- Sandbox/trial availability and sample-response quality.
- Overage, setup, minimum contract, annual commitment and support fees.
- Stable IDs, changelog, uptime/SLA and support response time.

## Procurement sequence

1. Freeze the launch competitions and which of the 12 advertised competitions must be real at launch.
2. Apply the approved jurisdiction allowlist policy and verify the four target
   books for each region proposed for paid launch.
3. Decide the history window and freshness promise for odds and stats.
4. Turn each external data domain above into a provider requirements checklist.
5. Research candidate services from primary pricing/API/licensing sources.
6. Run sample payloads through the canonical identity and market mappings.
7. Price request volume at low, expected and high usage.
8. Prefer the smallest provider set that meets coverage, rights and reliability; document every deliberate gap and fallback.

## Decisions still needed

These decisions materially change API pricing and should be answered before a
final vendor recommendation:

- Which sports are launch-day requirements versus visible but coming soon?
- Which states/countries must sportsbook data support at launch?
- Do paid fixtures prove all four approved sportsbooks for every enabled market
  and competition, and what is the feature-gated fallback when one is absent?
- Which later sports inherit live updates; NBA is resolved as webhook-first live
  sports data plus approximately 60-second supported live player-prop updates.
- How many seasons of historical statistics and historical odds are required?
- Are licensed headshots mandatory for every sport, or may some sports use initials/team artwork?
- Does Arena Props need play-by-play/shot-location/pitch-level data at launch, or can those modules wait?
- Will Arena Props build its own projections immediately, or initially display only source stats and market comparisons?
