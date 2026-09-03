# Provider Endpoint and Field Catalog

## Purpose and status

This document is the provider-facing implementation contract for Arena Props.
It answers, for every endpoint selected for the product:

- which provider owns the fact;
- which request or feed supplies it;
- which response fields are accepted;
- where those fields land in the canonical database;
- desired product retention and separately verified licensed retention;
- how frequently the source is acquired or reconciled; and
- which frontend read models consume the result.

The catalog was checked against public provider documentation on `2026-08-26`.
`DOC-VERIFIED` means that the route and documented schema were confirmed. It
does **not** mean a paid-plan payload, commercial-display right, cache right,
derived-data right or permanent-retention right has been accepted. Those remain
procurement gates in [source-coverage-matrix.md](source-coverage-matrix.md).

## Locked source ownership

| Data class | Primary | Secondary | Arena Props responsibility |
| --- | --- | --- | --- |
| Sports identity, schedules, results, rosters, stats, injuries, lineups, play-by-play, standings and rankings | BALLDONTLIE | None until a demonstrated gap exists | Canonical IDs, normalization, corrections and serving |
| Current NBA sportsbook and player-prop markets | BALLDONTLIE | The Odds API for comparison, repair or a demonstrated gap | Market taxonomy, line shopping and source comparison; paid fixtures per book/market remain mandatory |
| Current markets for later sports | Provider selected by that sport's evidence gate | BALLDONTLIE and The Odds API are candidates | Never inherit NBA book/market coverage without fixtures |
| Historical sportsbook and player-prop snapshots | The Odds API plus Arena Props polling archive | BALLDONTLIE opening endpoints | Append-only history, opening/closing definitions and reconciliation |
| Player, team, league, event and venue imagery | TheSportsDB | Product-owned fallback assets | Cross-provider identity mapping, rights ledger, object storage and CDN |
| Betting models and backtests | Arena Props | BDL Lab as a comparison input | Model/version ownership and reproducible calculations |
| Pregame/live/postgame narrative | StoryStats, later | Arena Props summaries where legally allowed | Product presentation and attribution |
| Live change triggers during NBA proof | Dynamic polling/reconciliation | Optional BALLDONTLIE webhooks after a qualifying upgrade | Provider-state transitions, idempotency, cache invalidation and later signed-webhook support |
| Hit rates, splits, streaks, consensus, no-vig, +EV, arbitrage, projections and injury impact | Arena Props | Provider facts as inputs only | Versioned calculation engine |

This decision chooses provider roles. It does not force an unsupported league,
market, image or right into the product. Unsupported cells remain feature-gated.

## Contract completeness rule

An adapter is complete only when all six artifacts exist:

1. A pinned provider OpenAPI/schema revision or an archived documentation hash.
2. A sanitized real response fixture for every enabled endpoint and material
   response variant.
3. A field mapping manifest that classifies every observed field as
   `mapped`, `raw_only`, `ignored_with_reason` or `quarantined`.
4. Contract tests proving that unknown required fields, enum drift and nullable
   changes fail safely before public read models are updated.
5. Deterministic typed mapper code for fields, canonical entities and markets;
   AI/runtime guessing and name-only publication are forbidden.
6. An Arena Props API contract test proving provider IDs, raw field names,
   provider-only enums and SDK types do not leak through the public response.

The provider schema is the exhaustive source-field inventory. This document
enumerates all fields Arena Props intentionally reads; unlisted fields remain in
the immutable raw payload and cannot silently become application dependencies.

## Provider-to-frontend boundary

```text
provider payload -> raw archive -> provider adapter -> canonical mapping
                 -> Arena Props database/calculations -> Arena Props API -> frontend
```

The arrow never skips the adapter or canonical layer. The catalog's
`Provider field` columns are adapter inputs; its `Canonical target` columns are
adapter outputs. Frontend components consume neither column directly—they
consume only named Arena Props API/read-model contracts. Provider replacement
must be possible without changing frontend field names.

## Shared storage, retention and cadence codes

| Code | Meaning |
| --- | --- |
| `C` | Canonical PostgreSQL row with provenance |
| `S` | Append-only PostgreSQL snapshot/revision |
| `R` | Redis/current read-model projection; rebuildable |
| `O` | Immutable raw payload or licensed media object in object storage |
| `DR=PERMANENT` | `desired_retention`: Arena Props wants permanent retention |
| `DR=DURATION:90D` | `desired_retention`: Arena Props wants a 90-day operational copy |
| `DR=UNTIL_RIGHTS_EXPIRY` | `desired_retention`: retain until asset rights expire/revise |
| `LR=PENDING_CONTRACT` | `licensed_retention`: no retention permission has been established yet |
| `LR=ALLOWED:*` | `licensed_retention`: signed terms explicitly allow the stated period |
| `BOOT` | Initial backfill and explicit repair only |
| `DAY` | Daily or provider-change sync |
| `HOT` | Event window; use the versioned per-data-class adaptive cadence rather than one global interval |
| `LIVE` | Active event; webhook first, 15-60 second reconciliation polling |
| `FINAL` | Re-fetch after final and again inside the correction window |

Every endpoint row states `desired_retention` and `licensed_retention`
separately. `DR=PERMANENT` is product intent only; it must never be interpreted
as permission. Until signed terms are entered into `retention_policies`, all
provider-derived rows remain `LR=PENDING_CONTRACT`.

Unless a row explicitly says otherwise, its `DR` value applies to normalized
`C`/`S` data and an accompanying raw `O` payload inherits
`DR=DURATION:90D`; each receives its own `retention_policy_id` and independent
licensed decision.

Every sourced canonical write also carries this mandatory envelope:

```text
provider_id
provider_product_id
provider_record_id        nullable only when the provider supplies no record ID
provider_updated_at       nullable only when the provider supplies no update time
ingested_at
raw_payload_id
schema_version
retention_policy_id
```

## Canonical field groups

These groups keep endpoint rows readable without hiding field-level behavior.

### `BDL_TEAM`

| Provider field | Canonical target | Rule |
| --- | --- | --- |
| `id` | `team_provider_ids.external_id` | Never use as the Arena Props primary key |
| `conference`, `division` | `team_competition_memberships.metadata_json` | Nullable outside applicable leagues |
| `city` or sport-specific `location` | `teams.location_name` | Preserve source string and normalize separately |
| `name`, `full_name`, `abbreviation` | `teams.name`, `teams.full_name`, `teams.abbreviation` | Version-aware upsert |

### `BDL_PLAYER_NBA`

| Provider field | Canonical target |
| --- | --- |
| `id` | `player_provider_ids.external_id` |
| `first_name`, `last_name` | `players.first_name`, `players.last_name` |
| `position` | `roster_memberships.position_source` plus canonical `position_id` mapping |
| `height`, `weight` | `players.height_source`, `players.weight_source` plus parsed numeric values |
| `jersey_number` | `roster_memberships.jersey_number` |
| `college`, `country` | `players.college_name`, `players.country_code/name` |
| `draft_year`, `draft_round`, `draft_number` | `players.draft_*` |
| nested `team` or `team_id` | `roster_memberships` via `team_provider_ids` |

### `BDL_GAME_NBA`

| Provider field | Canonical target |
| --- | --- |
| `id` | `event_provider_ids.external_id` |
| `date`, `datetime` | `events.local_date_source`, `events.starts_at` |
| `season`, `postseason`, `ist_stage` | `events.season_id`, `events.stage_id`, `events.metadata_json` |
| `status`, `status_state`, `period`, `time`, `postponed` | `events.source_status`, `events.status`, current `event_segments` |
| `home_team`, `visitor_team` | `event_participants` with home/away role |
| `home_team_score`, `visitor_team_score` | `event_participant_scores` |
| `home_q1..home_q4`, `visitor_q1..visitor_q4` | regulation `event_segments` and segment scores |
| `home_ot1..home_ot3`, `visitor_ot1..visitor_ot3` | overtime `event_segments` and segment scores |
| `home_timeouts_remaining`, `visitor_timeouts_remaining`, `home_in_bonus`, `visitor_in_bonus` | live event state snapshot |

### `BDL_BOX_STAT_NBA`

All fields below write to `player_event_stats` through `stat_definitions`; the
record also retains provider stat ID, player, team, game, provider timestamp and
`raw_payload_id` through the full sourced-fact provenance envelope.

`min`, `fgm`, `fga`, `fg_pct`, `fg3m`, `fg3a`, `fg3_pct`, `ftm`, `fta`,
`ft_pct`, `oreb`, `dreb`, `reb`, `ast`, `stl`, `blk`, `turnover`, `pf`, `pts`,
`plus_minus`.

### `ODDS_EVENT`

| Provider field | Canonical target |
| --- | --- |
| `id` | `event_provider_ids.external_id` for provider `the_odds_api` |
| `sport_key`, `sport_title` | `competition_provider_ids` and source metadata |
| `commence_time` | `events.starts_at` reconciliation candidate |
| `home_team`, `away_team` | identity-resolution candidates; never name-based auto-publish |
| `completed` | source event-state metadata |
| `scores[].name`, `scores[].score` | `event_participant_scores` only as odds-source backup |
| `last_update` | source timestamp where returned |

### `ODDS_OFFER_TREE`

| Provider field | Canonical target |
| --- | --- |
| `bookmakers[].key`, `title` | `sportsbook_provider_ids`, `sportsbooks.display_name` |
| `bookmakers[].last_update` | bookmaker source timestamp for featured markets |
| `bookmakers[].link`, `sid` | offer metadata; never expose unless link rights and jurisdiction allow |
| `markets[].key` | `market_provider_ids.external_id` |
| `markets[].last_update` | authoritative source timestamp for event-level additional markets |
| `markets[].link`, `sid` | market metadata |
| `outcomes[].name` | canonical side/selection (`over`, `under`, participant or milestone) |
| `outcomes[].description` | player/participant identity candidate for props |
| `outcomes[].price` | one side-specific `prop_snapshots.price_american`/`price_decimal` value after format-aware parsing |
| `outcomes[].point` | `prop_snapshots.line_value` |
| `outcomes[].link`, `sid`, `bet_limit` | offer metadata; `bet_limit` powers exchange/liquidity context only |
| `outcomes[].multipliers` | DFS selection metadata, preserved as structured snapshot data |

Prop observation identity is the canonical prop (event + player/team + market),
sportsbook, region, offer slot, side and provider product. If line, price and
executable state are unchanged, a poll advances `last_seen_at` and
`observation_count`; it does not append another economic snapshot. Any line,
price or `ACTIVE | SUSPENDED | REMOVED | SETTLED | UNKNOWN` transition appends a
new state run. Provider omission starts a missing-observation window and becomes
`REMOVED` only after an explicit removal or the versioned hysteresis threshold.

### `TSDB_MEDIA_ENTITY`

TheSportsDB field names vary by entity and version. The adapter accepts the
following identity and media families from its V2 OpenAPI schemas:

- identity: `idSport`, `idLeague`, `idTeam`, `idPlayer`, `idEvent`, `idVenue`;
- labels: `strSport`, `strLeague`, `strTeam`, `strPlayer`, `strEvent`,
  `strVenue`, alternate/localized description fields and country/location;
- team/player media: `strBadge`, `strLogo`, `strFanart1..4`, `strBanner`,
  `strPoster`, `strThumb`, `strCutout`, `strRender` where present;
- league/event/venue media: badge/logo/banner/poster/trophy/fanart/thumb fields
  defined by the pinned V2 schema;
- media URLs map to `media_assets.source_url`; downloaded objects, checksum,
  dimensions, rights source and expiry map to `media_assets`.

Every returned media URL is nullable. Missing imagery uses an Arena Props-owned
fallback; it never falls back to an unlicensed web image.

## BALLDONTLIE endpoint contracts

Official schema roots:

- [NBA OpenAPI](https://www.balldontlie.io/openapi/nba.yml)
- sport-specific OpenAPI files linked from the [BALLDONTLIE documentation hub](https://www.balldontlie.io/docs)
- [Webhooks OpenAPI](https://www.balldontlie.io/webhooks-openapi.yml)

### Launch sport schema registry

Each product navigation label resolves to one or more independently versioned
provider schemas. The adapter build must archive the resolved schema and record
its SHA-256; following `latest` at runtime is forbidden.

| Arena Props label | BALLDONTLIE product/schema | Required product decision |
| --- | --- | --- |
| NBA | [`nba.yml`](https://www.balldontlie.io/openapi/nba.yml) | Launch reference implementation |
| NFL | [`nfl.yml`](https://www.balldontlie.io/openapi/nfl.yml) | Enable position-specific stats and markets only after fixtures |
| MLB | BALLDONTLIE MLB OpenAPI from the docs hub | Pitch-level modules require their own coverage/right gate |
| NHL | BALLDONTLIE NHL OpenAPI from the docs hub | Hockey player-screen requirements must be completed first |
| WNBA | [`wnba.yml`](https://www.balldontlie.io/openapi/wnba.yml) | Do not assume NBA field nullability or route names |
| NCAAB | [`ncaab.yml`](https://www.balldontlie.io/openapi/ncaab.yml) | College identity, rankings and tournament fields are separate |
| NCAAF | BALLDONTLIE NCAAF OpenAPI from the docs hub | College conferences/rankings and NFL-style role mappings are separate |
| Soccer | One schema per enabled competition; begin with [`epl.yml`](https://www.balldontlie.io/openapi/epl.yml) only if EPL is approved | `SOCCER` is a UI family, not a source competition; explicitly choose EPL/La Liga/Serie A/UCL/Bundesliga/Ligue 1/MLS/World Cup |
| Tennis | [`atp.yml`](https://www.balldontlie.io/openapi/atp.yml) plus the WTA schema from the docs hub | ATP and WTA identities/tours remain separate; singles scope must be explicit |
| League of Legends | [`lol.yml`](https://www.balldontlie.io/openapi/lol.yml) | Preserve series, map and champion dimensions |
| CS2 | BALLDONTLIE CS2 OpenAPI from the docs hub | Preserve tournament, map, accuracy and map-pool dimensions |
| Valorant | [`valorant.yml`](https://www.balldontlie.io/openapi/valorant.yml) | Provisional live rows must retain `is_final` and `snapshot_at` |

Formula 1, Dota 2, MMA, PGA, college baseball, NCAAW and other ALL-ACCESS
products are cataloged opportunities, not current Arena Props launch promises.
Adding one requires a frontend requirement set and a new schema-registry row.

### Launch reference, event and performance endpoints

| Endpoint/feed | Accepted fields | Canonical writes | Storage; `desired_retention`; `licensed_retention` | Acquisition | Frontend/read models | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `GET /v1/teams` and `/v1/teams/{id}` | `BDL_TEAM` | `teams`, memberships, team crosswalk | `C`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | `BOOT`, then `DAY` | `DashboardReferenceData`, all team/event cards | `DOC-VERIFIED`, sample pending |
| `GET /v1/players` and `/v1/players/{id}` | `BDL_PLAYER_NBA` | `players`, roster membership, player crosswalk | `C`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | `BOOT`, `DAY`, targeted repair | `PlayerDirectoryRow`, `PlayerResearchView`, prop identity | `DOC-VERIFIED`, sample pending |
| `GET /v1/players/active` | `BDL_PLAYER_NBA` | active-state membership revision | `S`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | `DAY`, hourly in season | player/search eligibility | `DOC-VERIFIED`, sample pending |
| `GET /v1/games` and `/v1/games/{id}` | `BDL_GAME_NBA` | events, participants, segments and scores | `C+S`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | schedule hourly; `HOT`/`LIVE`; `FINAL` | `EventCard`, `PropTableRow`, `PlayerResearchView` | `DOC-VERIFIED`, sample pending |
| sport-specific games/matches/events endpoints | IDs, schedule, season/week/round/stage/tournament, participants, venue, lifecycle, score and result fields from pinned sport schema | same canonical event tables | `C+S`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | schedule hourly; `LIVE`; `FINAL` | every event-backed surface | schema pin required per enabled competition |
| `GET /v1/stats` | provider stat ID, `BDL_BOX_STAT_NBA`, nested player/team/game | player event stats and provenance | `C` revisions, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | `LIVE`, `FINAL`, correction sweep | charts, game log, L5/L10/L15/L20, hit rates | `DOC-VERIFIED`, sample pending |
| sport-specific player/team game-stat endpoints | entity IDs, game/match/map/set/round ID, participation state, minutes/time and every statistic defined in pinned schema | `player_event_stats`, `team_event_stats`, segment dimensions | `C` revisions, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | `LIVE`, `FINAL` | sport modules and calculations | schema pin required per enabled sport |
| `GET /nba/v1/season_averages/{category}` | player, season, season type, dynamic `stats` object | season-stat snapshots; each stats key resolved through taxonomy | `S`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | after finals/daily | season context; model inputs | `DOC-VERIFIED`, sample each category/type |
| `GET /nba/v1/team_season_averages/{category}` | team, season, season type, dynamic `stats` object | team season-stat snapshots | `S`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | after finals/daily | matchup/context modules | `DOC-VERIFIED`, sample each category/type |
| `GET /nba/v1/stats/advanced` | provider ID, player/team/game plus V1 efficiency fields | advanced player-event stats | `C` revisions; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | `FINAL` and correction sweep | research/model inputs | `DOC-VERIFIED`, sample pending |
| `GET /nba/v2/stats/advanced` | V1 fields plus `period`; pace/possession, rating, usage, scoring, four-factor, hustle, defensive, tracking, rebounding and percentage fields from pinned schema | advanced stat facts keyed by player, event, period and stat definition | `C` revisions, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | `FINAL`; live only after load test | advanced research/model inputs | `DOC-VERIFIED`, 2015+ documented, sample pending |
| `GET /v1/box_scores/live` and `/v1/box_scores?date=` | `BDL_GAME_NBA`, team arrays, `BDL_BOX_STAT_NBA` and nested players | event state, scores and player-event stats | `C+S`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | `LIVE`; date endpoint for `FINAL` | live context and final reconciliation | `DOC-VERIFIED`, sample pending |
| `GET /v1/lineups?game_ids[]=` | `id`, `game_id`, `starter`, `position`, player, team | lineup snapshots and entries | `S`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | pregame where supported, at start, changes | lineup/starter context | `DOC-VERIFIED`; NBA documented as 2025+ and available once game begins |
| `GET /v1/plays?game_id=` | `game_id`, `order`, `type`, `text`, scores, period/display, clock, scoring/shooting flags, score value, team, coordinates, wallclock, participant IDs | play-by-play facts or compressed object archive plus event changes | `O` plus indexed canonical subset; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | webhook first, `LIVE` reconcile, `FINAL` | later live/shot/context modules | `DOC-VERIFIED`; NBA documented as 2025+ |
| `GET /v1/player_injuries` | player, `return_date`, `description`, `status` | availability report snapshots | `S`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | webhook first; 1-5 minute pregame reconcile | player context, alerts, projection inputs | `DOC-VERIFIED`, sample pending |
| sport-specific roster/depth/lineup/injury endpoints | all source IDs, membership/role/depth, status, report note, effective/source times | roster memberships, event roster entries, lineup and availability snapshots | `C+S`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | hourly/daily; hotter pregame | directory, eligibility and context | schema pin required per enabled sport |
| `GET /v1/standings?season=` | team, conference/division records and ranks, wins/losses, home/road records, season | standings snapshots | `S`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | after finals/daily | standings/context | `DOC-VERIFIED`, sample pending |
| sport-specific standings/rankings endpoints | source entity, competition/season, rank, record/points and provider time | standings/ranking snapshots | `S`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | daily/weekly, after finals | rankings/context modules | schema pin required per enabled sport |

The endpoint prefixes above are NBA-specific where shown. When NFL, MLB, NHL,
WNBA, NCAAF, NCAAB, soccer, tennis, LoL, CS2 or Valorant enters Phase 8, its
adapter must use that sport's pinned route and schema; similar names are not
proof of identical fields. Roadmap inclusion does not make any later adapter
part of the NBA reference build.

### BALLDONTLIE market and optional-product endpoints

| Endpoint/feed | Accepted fields | Canonical writes | Storage; `desired_retention`; `licensed_retention` | Acquisition | Frontend/use | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `GET /v2/odds` | `id`, `game_id`, `vendor`, home/away spread values and odds, moneylines, total and over/under odds, `updated_at` | primary current NBA game-market snapshots | `S`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | 30-60 seconds in hot window | matchup odds and consensus | `DOC-VERIFIED`; NBA 2025+ documented; target vendors documented |
| `GET /nba/v2/odds/opening` | same game-market values plus `opened_at` | opening backup snapshot | `S`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | once after market discovery and repair | opening-line audit | `DOC-VERIFIED`; recent/current coverage only |
| `GET /v2/odds/player_props` | `id`, `game_id`, `player_id`, `vendor`, `prop_type`, `line_value`, `market.type`, `over_odds`, `under_odds` or milestone `odds`, `updated_at` | primary current NBA prop market and economic snapshot | `S`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | 30-60 seconds in the hot/live window | Props, Player, Pick Builder and line shopping | `DOC-VERIFIED`; endpoint itself does not preserve history; DraftKings, FanDuel and Caesars appear in the documented player-prop vendor list, while BetMGM requires a paid fixture before enablement |
| `GET /nba/v2/odds/player_props/opening` | live prop identity/market fields plus `opened_at` | opening prop backup | `S`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | once and repair | opening movement audit | `DOC-VERIFIED`; recent/current coverage only |
| `GET /{sport}/v1/dfs/slates`, `/dfs/slates/{id}`, `/dfs/draftables` | slate, event, roster-slot and draftable fields defined in sport schema | optional DFS extension tables | `C+S`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | 1-5 minutes while enabled slate open | later DFS product only | later; not part of core sportsbook MVP |
| BDL Lab model/factor/backtest/prediction API | model IDs/config, factor definitions, run status, performance and prediction outputs | external model comparison snapshots, never Arena Props model tables | versioned `S`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | manual/queued model runs | internal model evaluation | later research integration |
| StoryStats products | narrative ID/type, sport/event references, phase, body, provider/source time | attributed narrative object/cache | `C+O`; `DR=UNTIL_RIGHTS_EXPIRY`; `LR=PENDING_CONTRACT` | pregame/live/postgame | later narrative surfaces | later; exact product schema and rights pending |

### BALLDONTLIE webhooks

The webhook management and delivery contract is defined by the published
OpenAPI. Every delivery must preserve these headers: `Content-Type`,
`User-Agent`, `X-BDL-Webhook-Id`, `X-BDL-Webhook-Timestamp` and
`X-BDL-Webhook-Signature`.

| Feed | Accepted payload fields | Canonical action | Storage; `desired_retention`; `licensed_retention` | Consumer |
| --- | --- | --- | --- | --- |
| game/match start, period/set/round change and end | `event_type` plus event/game/match payload defined for that type | enqueue targeted event refresh; never trust notification as complete state | receipt `S`, body `O`; receipt `DR=PERMANENT`, body `DR=DURATION:90D`; `LR=PENDING_CONTRACT` | event state/cache invalidation |
| player/team scoring and statistical events | `event_type`, game/match, play/event, player/team and source timing fields where supplied | append live fact or trigger source endpoint reconciliation | receipt `S`, body `O`; receipt `DR=PERMANENT`, body `DR=DURATION:90D`; `LR=PENDING_CONTRACT` | live stats and alerts |
| injury created/updated/cleared | `event_type`, player/team and injury payload | append availability revision and invalidate affected projections | receipt `S`, body `O`; receipt `DR=PERMANENT`, body `DR=DURATION:90D`; `LR=PENDING_CONTRACT` | injury context/model jobs |

Operational rules:

- Verify HMAC-SHA256 over `{timestamp}.{raw_body}` with constant-time compare.
- Reject delivery timestamps outside the replay window.
- Deduplicate on `X-BDL-Webhook-Id` before side effects.
- Acknowledge only after durable queue handoff.
- Run endpoint reconciliation because webhooks can be delayed or missed.
- During the NBA-only GOAT proof, polling must meet correctness and freshness
  without full ALL-ACCESS webhook events. Track any later webhook allowance as
  a budget, not guaranteed throughput.

## The Odds API endpoint contracts

Official references:

- [V4 API documentation](https://the-odds-api.com/liveapi/guides/v4/)
- [Betting market catalog](https://the-odds-api.com/sports-odds-data/betting-markets.html)
- [Historical odds guide](https://the-odds-api.com/historical-odds-data/)

| Endpoint | Accepted fields | Canonical writes | Storage; `desired_retention`; `licensed_retention` | Acquisition | Frontend/read models | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `GET /v4/sports` | `key`, `group`, `title`, `description`, `active`, `has_outrights` | competition provider map and discovery metadata | `C`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | hourly/day; no quota cost documented | reference filters and operations | `DOC-VERIFIED`, sample pending |
| `GET /v4/sports/{sport}/events` | `ODDS_EVENT`, optional rotation numbers/source IDs when requested | event crosswalk candidates, not sports-truth overwrite | `C`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | 5-10 minutes in active season; no quota cost documented | market discovery only | `DOC-VERIFIED`, sample pending |
| `GET /v4/sports/{sport}/participants` | `id`, `full_name` | participant crosswalk candidate/whitelist | `C`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | daily/weekly | ingestion only | `DOC-VERIFIED`; does not return team rosters |
| `GET /v4/sports/{sport}/scores` | `ODDS_EVENT`, `scores` | backup event score/status metadata | `S`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | 30 seconds only if BDL degraded; final repair up to supported recent window | degraded event context | `DOC-VERIFIED`; secondary source only |
| `GET /v4/sports/{sport}/odds` | `ODDS_EVENT`, `ODDS_OFFER_TREE`; featured markets only | game-market snapshots/current projections | `S`, `R`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | Adaptive; approximately 40-60 seconds in the hottest/live window based on documented source update cadence | matchup odds and consensus | `DOC-VERIFIED`, sample pending |
| `GET /v4/sports/{sport}/events/{eventId}/markets` | event identity; bookmaker key/title; market key and `last_update` | available-market discovery state | `S`; `DR=DURATION:30D`; `LR=PENDING_CONTRACT` | 1-5 minutes pregame or on empty-market repair | ingestion only | `DOC-VERIFIED`; recently seen markets, not exhaustive catalog |
| `GET /v4/sports/{sport}/events/{eventId}/odds` | `ODDS_EVENT`, `ODDS_OFFER_TREE`; all returned additional, prop, alternate, period and DFS markets | `prop_markets`, economic-state `prop_snapshots`, current offers | `S`, `R`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | Adaptive; 60 seconds in the hottest pregame/live window for player props, matching documented source cadence | Props, Projections, Discrepancies, Player, Pick Builder | `DOC-VERIFIED`, sample per sport/book/market required |
| `GET /v4/historical/sports/{sport}/events` | wrapper `timestamp`, `previous_timestamp`, `next_timestamp`, `data[]` of `ODDS_EVENT` | historical event crosswalk and backfill cursor | `C`, raw `O`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | `BOOT`/repair only | ingestion only | `DOC-VERIFIED`, paid plan |
| `GET /v4/historical/sports/{sport}/odds` | historical wrapper plus featured-market offer tree | game-market backfill snapshots | `S`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | `BOOT`/repair; budgeted | historical matchup odds | `DOC-VERIFIED`; 10x credit formula documented |
| `GET /v4/historical/sports/{sport}/events/{eventId}/odds` | historical wrapper plus event-level `ODDS_OFFER_TREE` | historical prop/alternate/period snapshots | `S`; `DR=PERMANENT`; `LR=PENDING_CONTRACT` | selective backfill/repair only | movement, book/consensus open/close, backtests | `DOC-VERIFIED`; additional-market history documented from 2023-05-03 |

Request options that change the stored contract must be explicit in adapter
configuration: `regions` or `bookmakers`, `markets`, `oddsFormat`, `dateFormat`,
`includeLinks`, `includeSids`, `includeBetLimits`, `includeRotationNumbers` and
`includeMultipliers`. Never mix American and decimal `price` values without
recording the requested format.

### Market taxonomy intake

The Odds API market key is a provider ID, not Arena Props' market ID. At
minimum, the launch taxonomy must map:

- featured: `h2h`, `spreads`, `totals`, `outrights` where enabled;
- NBA/WNBA/NCAAB: points, rebounds, assists, threes, blocks, steals,
  turnovers, combinations, double/triple-double and approved alternates;
- NFL/NCAAF: passing, rushing, receiving, kicking, defensive and touchdown
  markets plus approved alternates;
- MLB: batter and pitcher props plus approved alternates;
- NHL: points, goals, assists, power-play points, blocked shots, shots on goal,
  saves and goal-scorer markets;
- soccer: scorer, card, shots, shots on target and assists where documented;
- event-period, team-total and alternate markets only after period/unit mapping
  and settlement tests exist.

Unknown market keys enter `data_quality_issues`; they never publish under a
guessed canonical market.

## TheSportsDB V2 endpoint contracts

Official schema: [TheSportsDB V2 OpenAPI](https://www.thesportsdb.com/api/spec/v2/openapi.yaml).
Use V2 with the `X-API-KEY` header for new integration. V1 is permitted only as
a documented fallback for a missing V2 operation.

| Endpoint family | Accepted fields | Canonical writes | Storage; `desired_retention`; `licensed_retention` | Acquisition | Frontend/use | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `/search/league/{name}`, `/search/team/{name}`, `/search/player/{name}`, `/search/event/{name}`, `/search/venue/{name}` | provider IDs, names, parent IDs, sport/country/location and preview media fields | provisional crosswalk candidates only | raw `O`, confirmed mapping `C`; mapping `DR=PERMANENT`, raw `DR=DURATION:30D`; `LR=PENDING_CONTRACT` | manual/repair | ingestion review queue | `DOC-VERIFIED` |
| `/lookup/league/{id}` | complete pinned `LeagueLookupResponse`, especially identity and league artwork URLs | competition enrichment and media assets | metadata `C`, objects `O`; metadata `DR=PERMANENT`, object `DR=UNTIL_RIGHTS_EXPIRY`; `LR=PENDING_CONTRACT` | `BOOT`, monthly/revision | navigation/badges | `DOC-VERIFIED`, sample pending |
| `/lookup/team/{id}` and `/lookup/team_equipment/{id}` | complete pinned team/equipment schemas, especially badge/logo/banner/fanart/jersey fields | team enrichment and media assets | `C`, `O`; metadata `DR=PERMANENT`, object `DR=UNTIL_RIGHTS_EXPIRY`; `LR=PENDING_CONTRACT` | `BOOT`, monthly/revision | team/event cards | `DOC-VERIFIED`, sample pending |
| `/lookup/player/{id}` | complete pinned player schema, especially player/team identity and thumb/cutout/render/fanart fields | player enrichment and media assets | `C`, `O`; metadata `DR=PERMANENT`, object `DR=UNTIL_RIGHTS_EXPIRY`; `LR=PENDING_CONTRACT` | `BOOT`, monthly/revision | player rows/header/cards | `DOC-VERIFIED`, sample pending |
| `/lookup/event/{id}` and `/lookup/venue/{id}` | complete pinned event/venue identity and artwork schemas | optional event/venue enrichment and media | `C`, `O`; metadata `DR=PERMANENT`, object `DR=UNTIL_RIGHTS_EXPIRY`; `LR=PENDING_CONTRACT` | targeted/revision | event context | `DOC-VERIFIED`, secondary only |
| `/list/teams/{leagueId}` and the V2 league player list | provider IDs, names, parent identity and available artwork | mapping candidates and coverage audit | `C`, raw `O`; mapping `DR=PERMANENT`, raw `DR=DURATION:30D`; `LR=PENDING_CONTRACT` | monthly/revision | ingestion only | `DOC-VERIFIED`, exact route pinned from OpenAPI |
| schedule, live-score, event result/stat/timeline/lineup endpoints | full pinned response schema | no canonical writes by default; raw comparison only | raw `O`; `DR=DURATION:30D`; `LR=PENDING_CONTRACT` | diagnostics only | none | `DOC-VERIFIED`, deliberately not sports truth |
| player honours, milestones, former teams, contracts/results/stats | full pinned response schema | none until a product requirement exists | no storage; `DR=NONE`; `LR=NOT_APPLICABLE` | on-demand evaluation | none in MVP | deferred |
| event highlights | event ID and provider video/highlight link metadata | none until licensing approval | no storage; `DR=NONE`; `LR=NOT_APPLICABLE` | disabled | none | deferred pending rights |

Media ingestion must download approved assets server-side, calculate checksum
and dimensions, record the source URL and rights expiry, and serve only the
approved object/CDN URL. Hotlinking is not the production contract.

## Arena Props calculations and frontend mapping

| Output | Required source inputs | Canonical output | Frontend consumers |
| --- | --- | --- | --- |
| L5/L10/L15/L20 average and hit rate | final eligible player-event stats, selected line and eligibility rules | `calculated_metrics` with window, market, line, version and cutoff | Props, Player, Popular, Saved |
| Season/home/away/opponent/position split | event, venue role, opponent and final stats | `calculated_metrics` | Player and matchup research |
| Streak | ordered eligible final results and line | `calculated_metrics` | Props and Player |
| Book open/current/close/min/max movement | eligible economic-state `prop_snapshots` for one book stream | `BOOK_*` landmark plus source snapshot reference | trend chart, Discrepancies, Player |
| Consensus open/current/close/min/max movement | versioned eligible book set and `BOOK_*` landmarks | `CONSENSUS_*` landmark plus calculated-metric reference | trend chart, Projections, Discrepancies |
| Best line | fresh current offers for same canonical prop/region | current read model; optionally versioned metric | Props and Pick Builder |
| Consensus/no-vig | fresh comparable book offers and configured book set | `calculated_metrics` | Projections, matchup odds |
| +EV | Arena Props probability, no-vig/market probability and selected price | versioned projection result | Projections and Player |
| Arbitrage | simultaneously fresh, executable opposing outcomes and limits where known | short-lived calculated alert | Discrepancies/alerts |
| Projection | versioned stats, context, availability and market inputs | `projections`/`projection_results` | Projections, Player, Popular |
| Injury impact | availability revision, projected rotation/minutes and model | versioned projection/context result | Player and alerts |

Every calculated read model must expose `generated_at`, `source_cutoff_at`,
`freshness_state`, `calculation_version`, `market_definition_version`,
`eligibility_version` and `feature_availability`.

## Implementation order and acceptance gates

1. Pin and archive the NBA BALLDONTLIE, The Odds API V4, TheSportsDB V2 and
   BALLDONTLIE webhook schemas.
2. Add provider product rows and environment-specific credentials in a secret
   manager; never put keys in the frontend or repository.
3. Capture sanitized fixtures for NBA teams, players, games, stats, injuries,
   current props, historical props and player/team images.
4. Complete field, entity and market mapping manifests for every fixture; make
   schema drift and unmapped required values failing contract tests.
5. Map one NBA event/player/prop across all three providers into Arena Props
   canonical IDs.
6. Prove economic-state prop deduplication, disappearance hysteresis,
   suspension, book/consensus landmarks and final settlement end to end.
7. Validate display, caching, derivative and retention rights in writing.
8. Load-test the hot-window credit/request model before enabling additional
   books or markets.
9. Repeat schema pin, fixture and mapping gates independently for each new
   sport. Similar endpoint names do not waive sport-specific validation.
10. Add BDL Lab, StoryStats, DFS and deep live modules only after the core
    sports-truth/market-truth/media pipeline is stable.
11. Run the Arena Props API contract suite and prove no public response depends
    on provider field names, IDs, enums, payload shapes or SDK types.

No provider field may reach a public read model solely because it appeared in a
payload. It must have an explicit mapping, rights decision, freshness rule and
test in this catalog or its generated field manifest.
