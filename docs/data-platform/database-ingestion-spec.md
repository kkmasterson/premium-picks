# Database and Ingestion Specification

## Purpose and status

This document defines how Premium Picks identifies, normalizes, stores,
versions and serves the records required by the current dashboard. It is
provider-neutral. Provider-specific adapters must conform to this model; the
model must not be reshaped around the first vendor selected.

This is a normative logical specification, not a final migration. Physical
indexes, partitions and retention values should be load-tested after sample
payloads and provider rights are known.

## Architecture principles

1. Premium Picks canonical IDs are independent of all vendor IDs.
2. Raw source records, normalized facts, calculated values and user data remain distinct.
3. Provider payloads are immutable evidence; normalization is repeatable.
4. Odds history is append-only. Current offers are a projection of snapshots.
5. Market identity is a taxonomy, not a provider display string.
6. Missing, zero, DNP, suspended and unavailable are different states.
7. Every external value retains source, provider timestamp and observed time.
8. Every calculated value retains version and input cutoff.
9. Provider corrections create new versions and targeted recalculation.
10. Unsupported data stays behind a feature flag rather than fabricated fallback data.

## System boundaries

| Store | Responsibility |
| --- | --- |
| PostgreSQL | Canonical identities, normalized facts, immutable snapshots, user data, model metadata and operational state |
| Object storage | Raw payload bodies, licensed media files and optional high-volume play-by-play archives |
| Redis or equivalent | Hot current offers, dashboard read models, short-lived aggregates, locks and rate-control state |
| Queue/stream | Durable handoff between ingestion, normalization, reconciliation and calculation workers |
| CDN | Rights-compliant delivery of logos, headshots and artwork |

## Canonical ID policy

### Rules

- Every Premium Picks entity receives a Premium Picks-generated primary key.
- A provider ID is stored only in a provider crosswalk table.
- Names, abbreviations, slugs and URLs are never foreign keys.
- Slugs may change without changing identity.
- Merging duplicate canonical entities is an audited operation that re-points
  references and preserves a redirect/tombstone record.
- Splitting an incorrectly merged entity is also audited and replayable.

### Recommended representation

Use UUIDv7 canonical primary keys for sortable, distributed creation. The
column names express the entity, such as `player_id`, `team_id` and `event_id`;
their values are always Premium Picks IDs. Public APIs may prefix serialized
IDs (`pp_player_...`) for clarity, but prefixes are not stored as part of the
UUID.

Conceptually:

```text
players.player_id = 0194...              # Premium Picks canonical ID

player_provider_ids
  player_id      = 0194...
  provider_id    = balldontlie
  external_id    = 237

player_provider_ids
  player_id      = 0194...
  provider_id    = sportsdataio
  external_id    = 20000571

player_provider_ids
  player_id      = 0194...
  provider_id    = sportradar
  external_id    = sr:player:12345
```

The same pattern applies to sport, competition, season, team, player, venue,
event, sportsbook and provider market identities.

### Provider crosswalk tables

Use explicit entity crosswalk tables in the application-facing schema:

- `sport_provider_ids`
- `competition_provider_ids`
- `season_provider_ids`
- `team_provider_ids`
- `player_provider_ids`
- `venue_provider_ids`
- `event_provider_ids`
- `sportsbook_provider_ids`
- `market_provider_ids`

They may share internal implementation helpers, but explicit tables give
strong foreign keys and make ambiguous cross-entity mappings impossible.

Every crosswalk contains:

```text
canonical_id
provider_id
external_id
external_parent_id       nullable provider namespace/competition context
mapping_status           confirmed | provisional | conflicted | retired
mapping_method           exact_id | manual | rules | reviewed_fuzzy
confidence               nullable numeric
first_seen_at
last_seen_at
verified_at
verified_by
source_record_id
```

Unique key: `(provider_id, external_id, external_parent_id)`. Provisional or
conflicted mappings may be ingested into quarantine but cannot power public
read models.

## Core schemas and tables

The logical tables are grouped below. Names can map to PostgreSQL schemas such
as `core`, `sports`, `odds`, `analytics`, `app` and `ops` during migration work.

### Providers and provenance

#### `data_providers`

Identifies a company/source independently from its products and plans.

```text
provider_id              uuid primary key
provider_key             text unique
display_name             text
provider_type            stats | odds | media | weather | specialist | internal
status                   evaluating | active | paused | retired
contract_reference       text nullable
created_at
updated_at
```

#### `provider_products`

```text
provider_product_id      uuid primary key
provider_id              foreign key
product_name
plan_name
environment              sandbox | production
base_url_or_feed_key
rate_limit_policy_json
rights_policy_reference
active_from
active_to nullable
```

#### `source_records`

Links normalized writes to the immutable source payload.

```text
source_record_id         uuid primary key
provider_product_id      foreign key
source_type              endpoint | webhook | stream | file | manual
source_external_id       text nullable
request_or_message_id    text nullable
provider_updated_at      timestamptz nullable
observed_at              timestamptz not null
payload_object_uri       text
payload_sha256           text
schema_version           text nullable
ingestion_run_id         foreign key
```

### Sports reference entities

#### `sports`

```text
sport_id                 uuid primary key
sport_key                text unique
display_name
family_key               basketball | football | baseball | hockey | soccer | tennis | esports
active
```

#### `competitions`

```text
competition_id           uuid primary key
sport_id                 foreign key
competition_key          text unique
display_name
short_name
competition_type         league | tour | tournament_circuit | game_title
country_code nullable
gender_category nullable
level_category nullable
active
```

#### `seasons`

```text
season_id                uuid primary key
competition_id           foreign key
season_key               text
display_name
starts_on
ends_on
current
unique (competition_id, season_key)
```

#### `competition_stages`

Represents week, round, group, tournament stage or playoffs without forcing one
sport's terminology onto another.

```text
stage_id                 uuid primary key
season_id                foreign key
parent_stage_id nullable foreign key
stage_type
stage_key
display_name
sequence nullable
starts_at nullable
ends_at nullable
```

#### `venues`

```text
venue_id                 uuid primary key
display_name
city nullable
region nullable
country_code nullable
timezone_name
latitude nullable
longitude nullable
surface_type nullable
active
```

#### `teams`

`teams` includes clubs, franchises, national teams and esports organizations.

```text
team_id                  uuid primary key
sport_id                 foreign key
display_name
short_name nullable
abbreviation nullable
location_name nullable
primary_color nullable
secondary_color nullable
active
```

Competition membership belongs in a separate versioned table because teams
move between competitions and seasons.

#### `team_competition_memberships`

```text
team_competition_membership_id uuid primary key
team_id                  foreign key
competition_id           foreign key
season_id nullable        foreign key
conference_name nullable
division_name nullable
effective_from
effective_to nullable
```

#### `players`

```text
player_id                uuid primary key
sport_id                 foreign key
display_name
legal_name nullable
handle nullable
birth_date nullable
country_code nullable
active
merged_into_player_id nullable foreign key
created_at
updated_at
```

#### `positions`

```text
position_id              uuid primary key
sport_id                 foreign key
competition_id nullable  foreign key
position_key
display_name
position_group nullable
unique (sport_id, competition_id, position_key)
```

#### `roster_memberships`

```text
roster_membership_id     uuid primary key
player_id                foreign key
team_id                  foreign key
competition_id           foreign key
season_id nullable       foreign key
position_id nullable     foreign key
jersey_number nullable
roster_status
effective_from
effective_to nullable
source_record_id         foreign key
```

Do not overwrite a current team directly on `players`; expose it through a
current-membership view.

### Media

#### `media_assets`

```text
media_asset_id           uuid primary key
owner_type               competition | team | player | sportsbook | venue | map | champion | agent
owner_id                 uuid
asset_type               logo | headshot | wordmark | icon | artwork | map_image
variant_key              default | light | dark | square | transparent | original
source_record_id nullable foreign key
source_url nullable
object_uri nullable
cdn_url nullable
mime_type
width nullable
height nullable
sha256 nullable
rights_status            approved | restricted | expired | unknown
rights_reference nullable
rights_expires_at nullable
effective_from
effective_to nullable
```

`owner_type` requires application validation or can be implemented with
entity-specific join tables if strict database foreign keys are preferred.
Expired or unknown-rights media never enters public read models.

### Events, segments and participation

#### `events`

```text
event_id                 uuid primary key
competition_id           foreign key
season_id nullable       foreign key
stage_id nullable        foreign key
venue_id nullable        foreign key
event_type               game | match | series
scheduled_start_at       timestamptz
actual_start_at nullable timestamptz
ended_at nullable        timestamptz
status                   scheduled | pregame | live | delayed | postponed | cancelled | final
status_detail nullable
neutral_site             boolean
best_of nullable
online_state nullable
revision                 integer
source_updated_at nullable
updated_at
```

#### `event_participants`

Supports team sports and individual tennis participants.

```text
event_participant_id     uuid primary key
event_id                 foreign key
participant_type         team | player
team_id nullable         foreign key
player_id nullable       foreign key
side                     home | away | participant_1 | participant_2 | neutral
sequence
score nullable
result                   win | loss | draw | no_contest | unknown
unique (event_id, sequence)
```

Check constraint: exactly one of `team_id` or `player_id` is populated.

#### `event_segments`

```text
event_segment_id         uuid primary key
event_id                 foreign key
parent_segment_id nullable foreign key
segment_type             quarter | half | period | inning | set | map | round | overtime
segment_number
display_name
status
started_at nullable
ended_at nullable
unique (event_id, parent_segment_id, segment_type, segment_number)
```

#### `event_participant_scores`

```text
event_participant_id     foreign key
event_segment_id         foreign key
score_value
source_record_id         foreign key
revision
primary key (event_participant_id, event_segment_id, revision)
```

#### `event_roster_entries`

```text
event_roster_entry_id    uuid primary key
event_id                 foreign key
team_id nullable         foreign key
player_id                foreign key
position_id nullable     foreign key
eligibility_status
starter_status           starter | bench | inactive | unknown
confirmed                boolean
observed_at
source_record_id         foreign key
```

#### `lineup_snapshots` and `lineup_entries`

The snapshot records projected/confirmed state and the entries record batting
order, formation slots, starting pitcher or depth order.

```text
lineup_snapshots
  lineup_snapshot_id
  event_id
  team_id
  lineup_type
  status                 projected | confirmed
  formation nullable
  provider_timestamp nullable
  observed_at
  source_record_id

lineup_entries
  lineup_snapshot_id
  player_id
  position_id nullable
  slot_key nullable
  order_number nullable
  role_detail nullable
  primary key (lineup_snapshot_id, player_id)
```

#### `availability_reports`

Append-only because injury/status statements change over time.

```text
availability_report_id  uuid primary key
player_id                foreign key
team_id nullable         foreign key
event_id nullable        foreign key
status_key
reason nullable
note nullable
expected_return_at nullable
provider_timestamp nullable
observed_at
source_record_id         foreign key
supersedes_id nullable   foreign key
```

### Statistics

#### `stat_definitions`

```text
stat_definition_id      uuid primary key
sport_id                 foreign key
stat_key                 text
display_name
unit_key
value_type               integer | decimal | percentage | duration | boolean
aggregation_rule         sum | average | maximum | minimum | last | custom
higher_is_better nullable
active
unique (sport_id, stat_key)
```

#### `player_event_stats`

```text
player_event_stat_id    uuid primary key
event_id                 foreign key
event_segment_id nullable foreign key
player_id                foreign key
team_id nullable         foreign key
stat_definition_id       foreign key
value_numeric nullable
value_text nullable
participation_state      played | dnp | inactive | unavailable | unknown
revision                 integer
provider_timestamp nullable
observed_at
source_record_id         foreign key
```

Unique logical fact: `(event_id, event_segment_id, player_id,
stat_definition_id, revision)`. The current view selects the latest accepted
revision. Zero is a valid value only when `participation_state = played`.

#### `team_event_stats`

Uses the same shape with `team_id` instead of `player_id`.

#### `season_stat_snapshots`

Optional source-provided or Premium Picks-calculated aggregate. It never
replaces event facts.

```text
season_stat_snapshot_id uuid primary key
entity_type              player | team
entity_id                uuid
season_id                foreign key
stat_definition_id       foreign key
split_key                text
value_numeric
sample_size
calculation_source       provider | premium_picks
version
input_cutoff_at
created_at
```

High-volume pitch, play and tracking events should use typed family tables or
object-backed columnar files once required. Do not force them into a generic
JSON column without access patterns and retention rights.

### Standings, rankings and contextual snapshots

#### `standings_snapshots`

```text
standings_snapshot_id   uuid primary key
competition_id           foreign key
season_id                foreign key
team_id                  foreign key
as_of_at
rank nullable
wins nullable
losses nullable
draws nullable
pct nullable
streak nullable
source_record_id         foreign key
```

#### `ranking_snapshots`

```text
ranking_snapshot_id     uuid primary key
ranking_system_key
entity_type              team | player
entity_id                uuid
rank
rating nullable
as_of_at
attribution_text nullable
source_record_id         foreign key
```

#### `weather_snapshots`

```text
weather_snapshot_id     uuid primary key
event_id                 foreign key
venue_id                 foreign key
snapshot_type            forecast | observed
valid_at
temperature nullable
wind_speed nullable
wind_direction nullable
precipitation_probability nullable
condition_text nullable
observed_at
source_record_id         foreign key
```

### Sportsbooks and canonical market taxonomy

#### `sportsbooks`

```text
sportsbook_id            uuid primary key
sportsbook_key           text unique
display_name
short_name
active
```

#### `sportsbook_regions`

```text
sportsbook_id            foreign key
region_code
active_from
active_to nullable
primary key (sportsbook_id, region_code, active_from)
```

#### `market_periods`

```text
market_period_id         uuid primary key
sport_id                 foreign key
period_key               full_game | first_half | first_quarter | set_1 | map_1 | maps_1_2 | custom
display_name
sequence
```

#### `markets`

Do not store only display strings such as `Points`, `Passing Yards` or `Shots`.

```text
market_id                uuid primary key
sport_id                 foreign key
competition_id nullable  foreign key
canonical_key            text
display_name
stat_definition_id nullable foreign key
market_period_id         foreign key
scope                    player | team | event
unit_key
line_step nullable
higher_is_over           boolean
settlement_rule_version
active
unique (sport_id, competition_id, canonical_key, market_period_id, scope)
```

Examples:

```text
sport         canonical_key       display_name     stat_key          period       scope
basketball    player_points       Points           points            full_game    player
football      passing_yards       Passing Yards    passing_yards     full_game    player
soccer        shots_on_target     Shots on Target  shots_on_target   full_match   player
cs2           map_kills           Map Kills        kills             map_1        player
```

Display names can change without changing the canonical key. Settlement rules
are versioned because similar labels can differ between providers.

#### `market_provider_ids`

```text
market_provider_id       uuid primary key
market_id                foreign key
provider_id              foreign key
external_market_id nullable
external_market_key
external_display_name nullable
provider_period_key nullable
mapping_status
mapping_version
effective_from
effective_to nullable
```

No provider market is published until its sport, scope, period, unit and
settlement mapping are confirmed.

### Prop instances, offers and the proprietary snapshot history

#### `prop_markets`

A stable player/team proposition independent of sportsbook and current line.

```text
prop_market_id           uuid primary key
event_id                 foreign key
market_id                foreign key
player_id nullable       foreign key
team_id nullable         foreign key
status                   pending | open | suspended | closed | settled | void
created_at
closed_at nullable
```

Check constraints enforce the market scope. Unique logical key:
`(event_id, market_id, player_id, team_id)`.

#### `prop_snapshots`

This is the most strategically valuable source-derived table in Premium Picks.
It preserves every observed line, price and status change through the market
lifetime. It is append-only and retained permanently when the provider contract
permits it.

```text
prop_snapshot_id         uuid primary key
prop_market_id           foreign key
sportsbook_id            foreign key
region_code              text
provider_id              foreign key
provider_product_id      foreign key
provider_offer_id nullable text

line_value               numeric(12,4)
over_odds_american nullable integer
under_odds_american nullable integer
over_odds_decimal nullable numeric(12,6)
under_odds_decimal nullable numeric(12,6)
offer_status             open | suspended | closed | settled | unavailable
is_main_line nullable     boolean

provider_timestamp nullable timestamptz
observed_at              timestamptz not null
received_at              timestamptz not null
source_record_id         foreign key
snapshot_hash            text not null
supersedes_snapshot_id nullable foreign key
```

Required behavior:

- Insert only when line, price, status or meaningful provider state changes.
- Never update a historical observation in place.
- Deduplicate retries using provider message/offer identity plus snapshot hash.
- Preserve both provider time and Premium Picks observation/receipt times.
- Preserve suspensions and disappearance; do not merely delete the current row.
- Corrections append a replacement linked by `supersedes_snapshot_id`.
- Partition by `observed_at` month after volume warrants it.
- Index `(prop_market_id, sportsbook_id, region_code, observed_at desc)`.
- Index `(event_id)` through the prop-market join or a denormalized generated
  column only if query profiling justifies it.

Illustrative history:

```text
10:05  Tatum Points  FanDuel  27.5  O -110  U -110
11:20  Tatum Points  FanDuel  27.5  O -115  U -105
13:15  Tatum Points  FanDuel  28.5  O -105  U -115
16:40  Tatum Points  FanDuel  29.0  O -110  U -110
18:55  Tatum Points  FanDuel  29.5  O -105  U -115
```

From this table Premium Picks can derive, with versioned definitions:

- Opening line and price.
- Closing line and price.
- Highest and lowest observed line.
- Line and price movement.
- Time spent at each line.
- Market velocity.
- Sportsbook disagreement and convergence.
- Closing-line value and model backtests.
- Provider latency and market availability analytics.

The previous overview term `prop_offer_ticks` is superseded by the normative
name `prop_snapshots`.

#### `current_prop_offers`

This is a projection/cache of the latest eligible snapshot per prop, sportsbook
and region. It can be a maintained table, materialized view or Redis structure.
It is rebuildable from `prop_snapshots` and is never the historical source of
truth.

```text
prop_market_id
sportsbook_id
region_code
prop_snapshot_id
line_value
over_odds_american
under_odds_american
offer_status
fresh_until
primary key (prop_market_id, sportsbook_id, region_code)
```

#### `prop_settlements`

```text
prop_settlement_id       uuid primary key
prop_market_id           foreign key
result_value nullable
settlement_status        over | under | push | void | cancelled | unavailable
settlement_rule_version
revision
settled_at
source_record_id nullable foreign key
calculation_version nullable
```

### Calculated metrics and projections

#### `calculation_runs`

```text
calculation_run_id       uuid primary key
calculation_key
calculation_version
code_revision
input_cutoff_at
started_at
completed_at nullable
status
```

#### `calculated_metrics`

```text
calculated_metric_id    uuid primary key
calculation_run_id       foreign key
prop_market_id nullable  foreign key
player_id nullable       foreign key
event_id nullable        foreign key
metric_key               average | hit_rate | streak | discrepancy | opponent_allowed | custom
sample_key               l5 | l10 | l15 | season | h2h | custom
filter_signature         text
line_value nullable
value_numeric nullable
value_json nullable
sample_size nullable
created_at
```

The `filter_signature` is a canonical hash of season, opponent, home/away,
team, event, court/surface and other relevant filters. This prevents a cached
L10 from being reused under incompatible filters.

#### `model_versions`

```text
model_version_id         uuid primary key
model_key
version
feature_version
training_cutoff_at
artifact_reference
status
created_at
```

#### `projection_runs`

```text
projection_run_id        uuid primary key
model_version_id         foreign key
input_cutoff_at
prediction_horizon
started_at
completed_at nullable
status
```

#### `projections`

```text
projection_id            uuid primary key
projection_run_id        foreign key
prop_market_id           foreign key
projected_value
lower_bound nullable
upper_bound nullable
confidence nullable
explanation_json nullable
created_at
unique (projection_run_id, prop_market_id)
```

#### `projection_results`

Stores settled backtest/evaluation outcomes separately from predictions so
historical predictions are never overwritten.

### User and community data

#### `users`, `subscriptions` and `user_preferences`

Keep authentication/billing provider IDs in crosswalk/reference columns, not
as user primary keys. Store the minimum personal data needed by the product.

#### `saved_entities`

```text
saved_entity_id          uuid primary key
user_id                  foreign key
entity_type              prop_market | player | event
entity_id                uuid
created_at
deleted_at nullable
unique active (user_id, entity_type, entity_id)
```

#### `pick_builder_entries`

```text
pick_builder_entry_id    uuid primary key
user_id nullable         foreign key
anonymous_session_id nullable
prop_market_id           foreign key
selected_side            over | under
sportsbook_id nullable   foreign key
created_at
updated_at
```

#### `community_prop_actions`

Append-only action ledger for save/unsave and optional Over/Under sentiment.

```text
community_action_id      uuid primary key
user_id                  foreign key
prop_market_id           foreign key
action_type              save | unsave | select_over | select_under | clear_side
validity_status          pending | valid | rejected
validity_reason nullable
created_at
```

#### `community_prop_aggregates`

Rebuildable aggregate keyed by prop market and aggregation version.

```text
prop_market_id           foreign key
save_count
over_count
under_count
over_percentage nullable
under_percentage nullable
aggregation_version
input_cutoff_at
updated_at
```

## Ingestion pipeline

```text
poll scheduler / signed webhook / provider stream
  -> provider gateway
  -> durable message queue
  -> immutable raw payload archive
  -> schema validation
  -> provider adapter
  -> identity and market resolution
  -> canonical upsert or append-only snapshot insert
  -> data-quality checks
  -> change event
  -> dependent metric/model jobs
  -> current read models and cache
  -> Premium Picks API
  -> SSE/WebSocket invalidation or update
```

### Stage 1: acquisition

- Webhooks validate signature, timestamp and replay window before acknowledgement.
- Polls use per-product cursors, conditional requests and hot/cold schedules.
- Streams persist offsets/checkpoints before messages are acknowledged.
- Every input receives `received_at`, `observed_at`, product and request/message IDs.
- Acquisition never depends on successful normalization; raw evidence is archived first.

### Stage 2: immutable raw archive

Object key pattern:

```text
provider/product/yyyy/mm/dd/feed-or-endpoint/ingestion-run/message-id.json.zst
```

Metadata includes SHA-256, content type, encoding, provider timestamp, request
parameters without secrets and rights-based deletion date if applicable.

### Stage 3: schema validation and quarantine

Reject or quarantine:

- Invalid signatures or malformed payloads.
- Unknown schema versions.
- Impossible timestamps, odds or score/stat values.
- Unmapped competition/team/player/event/market IDs.
- Ambiguous name-based mappings.
- Events outside contracted coverage or jurisdiction.

Quarantine preserves the raw record and creates a `data_quality_issue`; it does
not silently drop or publish it.

### Stage 4: identity and market resolution

Resolution order:

1. Confirmed provider ID crosswalk.
2. Provider-declared parent/competition relationship plus confirmed crosswalk.
3. Explicit deterministic mapping rule reviewed for that namespace.
4. Manual review queue.

Fuzzy name matching may generate candidates but may never auto-publish a new
mapping without a reviewed rule and confidence threshold.

### Stage 5: canonical writes

- Reference entities use version-aware upserts.
- Status, injury, lineup, ranking, weather and odds observations append snapshots.
- Stat corrections append revisions and mark the latest accepted revision.
- All writes carry `source_record_id` or a calculation run ID.
- Transaction boundaries keep a prop snapshot and its current-offer projection consistent.

### Stage 6: change propagation

Canonical changes emit typed internal events, for example:

```text
event.status_changed
player.stat_corrected
lineup.confirmed
prop.snapshot_added
prop.market_closed
prop.settled
community.aggregate_changed
projection.completed
```

Consumers recalculate only impacted metrics/read models. Full rebuilds remain
available for recovery and version migrations.

## Webhook, polling and reconciliation policy

| Data class | Preferred acquisition | Required fallback/reconciliation |
| --- | --- | --- |
| Odds/props | Signed webhook or stream | Hot-window polling plus scheduled full comparison |
| Live score/stats | Stream/webhook | Active-event polling and post-final reconciliation |
| Injuries/lineups | Change webhook | Increasing-frequency pregame polling |
| Schedules/rosters | Incremental endpoint | Daily full comparison |
| Standings/rankings | Incremental endpoint | Daily/weekly snapshot |
| Media | Revision manifest or conditional fetch | Periodic rights/revision audit |

Never assume webhook delivery is complete. Every feed requires a reconciliation
job with a documented recovery window.

## Freshness and staleness behavior

| Class | Target useful age | Stale behavior |
| --- | --- | --- |
| Current prop offers/status | 5-30 seconds during hot window | Mark stale and exclude from best-price/discrepancy calculations after configured TTL |
| Live event status/score | 5-30 seconds if live is launched | Show freshness state; do not imply live accuracy |
| Semi-live player/team stats | 15-60 seconds if live is launched | Retain last value with stale marker; final reconcile |
| Pregame injury/lineup | 1-5 minutes near start | Preserve projected/confirmed label and timestamp |
| Schedule/roster/reference | Hourly/daily | Alert after missed SLA; continue last confirmed value where safe |
| Media | Revision-based | Use approved cached asset until rights expiry; then approved fallback |

The source coverage matrix determines whether a candidate plan can meet these
targets without exceeding its limits.

## Derived metric semantics

### Eligible events

An event contributes to a metric only when:

- The player participated under the market's settlement rules.
- The required stat is available and accepted.
- The event belongs to the selected season/filter scope.
- The result is not void/unavailable.
- The calculation uses the correct period and market taxonomy.

DNP and missing values reduce the available sample count; they are not zero.

### Hit rates

Store hit count, eligible count and percentage. A result exactly equal to the
line is a push unless the market settlement version says otherwise.

### Opening and closing definitions

- Opening: first eligible open snapshot for the sportsbook/region/prop after
  mapping and quality validation.
- Closing: last eligible open snapshot before the configured market-close
  boundary, normally event start or provider closure depending on rules.
- Suspended snapshots are retained but not chosen as opening/closing prices.
- Corrections trigger a versioned recomputation, never mutation of the old result.

### Discrepancy

Absolute line difference is `max_line - min_line`. Percentage presentation
must use a versioned formula and handle zero/near-zero denominators explicitly;
the UI may not invent a percentage when the formula is undefined.

## Read models and application API

The application API assembles normalized source facts and Premium Picks
calculations into the frontend contracts. Suggested read models:

- `dashboard_reference_data`
- `current_prop_rows`
- `current_discrepancy_cards`
- `popular_prop_cards`
- `player_directory_rows`
- `player_research_views`
- `event_cards`
- `event_prop_rows`
- `saved_research_views`
- `pick_builder_views`

Read models include:

```text
generated_at
source_cutoff_at
freshness_state
calculation_version
feature_availability
```

The API never exposes provider secrets, raw contract-restricted payloads or
unresolved identities.

## Data quality controls

Minimum automated checks:

- Provider identifier uniqueness within namespace.
- Event participant count and identity validity.
- Event start/status transition sanity.
- Market scope, period, unit and line-step validity.
- American/decimal odds conversion consistency.
- Duplicate and out-of-order snapshot handling.
- Player-team membership validity at event time.
- DNP versus zero distinction.
- Final score/stat reconciliation.
- Source freshness and missing-feed alerts.
- Media rights/expiry enforcement.
- Metric sample-size and input-cutoff integrity.

`data_quality_issues` records severity, provider/product, source record,
canonical entities, rule key, first/last occurrence, state, owner and resolution.

## Operations tables

### `provider_sync_cursors`

Tracks endpoint/feed cursor, watermark, last attempt/success, next due time and
consecutive failures per product and partition key.

### `webhook_receipts`

Stores provider message ID, signature result, receipt time, deduplication key,
processing state and source record.

### `ingestion_runs`

Stores product/feed, requested window, counts, bytes, latency, retries, status,
error summary and cost/allocation metadata where available.

### `data_quality_issues`

Provides the review queue for unknown IDs, market conflicts, stale sources and
invalid values.

### `feature_flags`

Keys competition/market/module availability to coverage state:

```text
feature_key
competition_id nullable
market_id nullable
state                    enabled | disabled | proxy | unconfirmed | degraded
reason
effective_from
effective_to nullable
```

## Security, privacy and rights enforcement

- Store provider credentials in a secret manager, never payload metadata or logs.
- Encrypt raw payloads and personal/user data at rest and in transit.
- Separate contract-restricted raw access from application read access.
- Apply object and snapshot retention/deletion rules from provider contracts.
- Track media rights and expiry per asset.
- Minimize personal data and support account export/deletion.
- Audit manual identity merges, market mappings and rights overrides.
- Never expose provider attribution or data beyond the selected plan's rights.

## Retention policy to validate during procurement

| Data | Desired Premium Picks retention | Contract dependency |
| --- | --- | --- |
| Canonical identity and mapping audit | Permanent | Provider attribution terms |
| Event facts and final stats | Permanent | Historical retention/derived-data rights |
| Raw payloads | 30-90 days operationally, longer only if useful/allowed | Raw caching and deletion terms |
| Prop snapshots | Permanent | Critical historical retention and derived-data rights |
| Calculated metrics and projections | Permanent/versioned | Underlying fact derivative rights |
| Media files | Until rights expiry/revision | Media cache and redistribution rights |
| User/community actions | Account/product policy with deletion controls | Privacy law and product policy |
| Operational logs | Time-limited | Security and compliance policy |

If a provider forbids permanent prop snapshot retention or derived analytics,
its technically complete feed does not satisfy Premium Picks' core requirement.

## Migration and implementation sequence

1. Create provider, canonical identity and crosswalk tables.
2. Create sport, competition, season, team, player, venue and event tables.
3. Load controlled Premium Picks sport/competition/market taxonomies.
4. Implement one reference-data adapter and identity review queue.
5. Implement event/roster/stat normalization with source provenance.
6. Implement `prop_markets`, append-only `prop_snapshots` and current-offer projection.
7. Add settlement, calculated metrics and projection versioning.
8. Add user saves, Pick Builder and community action/aggregate tables.
9. Build frontend read models and freshness states.
10. Add specialist sport extensions only for enabled, sourced modules.

No production migration should begin until at least one stats sample and one
odds sample have been mapped end-to-end and their retention rights are accepted.

