# Canonical PostgreSQL Database and Ingestion Specification

## Purpose and status

This document defines how Arena Props identifies, normalizes, stores,
versions and serves the records required by the current dashboard. It is
provider-neutral. Provider-specific adapters must conform to this model; the
model must not be reshaped around the first vendor selected.

This is the normative PostgreSQL schema contract. Column types, invariants,
state transitions and logical indexes below are implementation requirements;
physical partition sizes and provider-specific retention durations still need
load tests and signed-rights review before production migration.

## Architecture principles

1. Arena Props canonical IDs are independent of all vendor IDs.
2. Raw payloads, normalized facts, calculated values and user data remain distinct.
3. Provider payloads are immutable evidence; normalization is repeatable.
4. Odds economic history is append-only. Only observation metadata such as
   `last_seen_at` may advance on an unchanged economic snapshot.
5. Market identity is a taxonomy, not a provider display string.
6. Missing, zero, DNP, suspended and unavailable are different states.
7. Every sourced fact carries the mandatory provenance envelope defined below.
8. Every calculated value carries generation time, source cutoff and all
   calculation, market-definition and eligibility versions.
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

## Provider boundary and Arena Props API contract — non-negotiable

### Boundary rule

**The frontend consumes only Arena Props API contracts. It never depends on a
provider field name, payload shape, provider ID or SDK type.** BALLDONTLIE,
The Odds API, TheSportsDB and later providers end at their adapters.

A provider name may reach the frontend only as explicit Arena Props attribution
metadata or a source-health label when product/legal requirements call for it.
That does not authorize exposing raw provider shapes or using provider identity
as application identity.

```text
BALLDONTLIE        The Odds API        TheSportsDB        later providers
      \                 |                  /                    /
       +----------------+-----------------+--------------------+
                                |
                                v
                     immutable raw payloads
                                |
                                v
                  typed, provider-owned adapters
                                |
                                v
             validation + normalization + ID mapping
                                |
                                v
                    Arena Props canonical database
                                |
                                v
                 versioned calculations/read models
                                |
                                v
                       Arena Props application API
                                |
                                v
                              frontend
```

This is a one-way dependency boundary. Provider changes may require adapter,
fixture and mapping updates; they must not require edits to React components or
Arena Props public response types unless the product contract itself changes.

### Mapping layer 1: fields

Every enabled endpoint has an explicit, version-controlled mapping from its
pinned provider schema to Arena Props fields. The authoritative inventory is
[provider-endpoint-field-catalog.md](provider-endpoint-field-catalog.md), backed
by typed mapper code.

Example contract:

```text
BALLDONTLIE field        Arena Props destination
id                       player_provider_ids.external_id
first_name               players.first_name
last_name                players.last_name
position                 roster_memberships.position_source
jersey_number            roster_memberships.jersey_number
team.id                  team_provider_ids.external_id
team.abbreviation        teams.abbreviation
```

Mappings are deterministic code, not AI inference, reflection-based guessing
or best-effort runtime renaming. Conceptually:

```ts
function mapBdlPlayer(raw: BdlPlayer, context: MappingContext): ArenaPlayerWrite {
  return {
    playerId: context.requireMappedPlayer(raw.id),
    firstName: raw.first_name,
    lastName: raw.last_name,
    displayName: `${raw.first_name} ${raw.last_name}`,
    positionSource: raw.position,
    teamId: context.requireMappedTeam(raw.team.id),
    provenance: context.provenanceFor(raw.id),
  };
}
```

Unknown required fields, missing required values and schema changes quarantine
the record. They never silently become null application values.

### Mapping layer 2: entities

Arena Props creates one canonical identity and persists every accepted provider
relationship in the applicable crosswalk:

```text
players.player_id = ap_player_000123

player_provider_ids
  ap_player_000123 | balldontlie | 237
  ap_player_000123 | thesportsdb | 34161320
```

The same rule applies to sports, competitions/leagues, seasons, teams, venues,
events, sportsbooks and markets. All normalized facts reference the Arena Props
ID; provider IDs remain provenance and crosswalk keys.

Initial entity resolution uses multiple signals, never a display name alone:

| Entity | Required resolution signals where available |
| --- | --- |
| Event | competition, season/stage, mapped home/away participants, event date and start-time tolerance |
| Player | normalized full name, mapped team and competition, position, jersey number and active interval |
| Team | competition, normalized name/abbreviation, location and active interval |
| Venue | normalized name, location, mapped team/event context and coordinates where supplied |

Fuzzy matching may propose a candidate, but it cannot publish one. Once a
provider ID is confirmed, ingestion reuses the stored crosswalk and stops
re-resolving that record by name. Ambiguous mappings enter the review queue.

### Mapping layer 3: markets

Provider market labels and keys map to Arena Props-owned market identity. For
example:

```text
The Odds API: player_points            -> basketball.nba.player.points
BALLDONTLIE: points                    -> basketball.nba.player.points
The Odds API: player_points_alternate  -> basketball.nba.player.points
                                                + alternate offer-slot metadata
```

The frontend receives the canonical key and Arena Props display name. It never
receives an arbitrary provider label as market identity. No market mapping is
publishable until sport, competition, scope, period, unit, line step and
settlement behavior have been verified and versioned.

### Provider adapter ownership

Each provider has an isolated adapter boundary. The intended backend layout is:

```text
services/ingestion/src/providers/
  balldontlie/
    client.ts
    schemas.ts
    players.mapper.ts
    teams.mapper.ts
    events.mapper.ts
    stats.mapper.ts
    injuries.mapper.ts
  the-odds-api/
    client.ts
    schemas.ts
    events.mapper.ts
    markets.mapper.ts
    sportsbooks.mapper.ts
    props.mapper.ts
  thesportsdb/
    client.ts
    schemas.ts
    players.mapper.ts
    teams.mapper.ts
    media.mapper.ts
```

Provider HTTP/authentication, raw schemas and provider field names stay inside
that provider directory. Shared canonical types may be imported into adapters;
provider types may not be imported by calculations, API handlers or frontend
packages.

### Validation and quarantine gate

The adapter validates the pinned provider schema before mapping:

```text
provider response
  -> archive raw payload
  -> validate pinned schema
       -> valid: map canonical IDs/fields -> quality checks -> canonical write
       -> invalid: quarantine + data-quality issue + alert; no public update
```

Runtime validators such as Zod may implement this gate, but generated or manual
types alone are insufficient because TypeScript types do not validate network
payloads.

### Frontend contract comes last

The application API assembles any number of accepted provider facts and Arena
Props calculations into a stable product response. An illustrative response is:

```json
{
  "player": {
    "id": "ap_player_000123",
    "name": "Patrick Mahomes",
    "position": "QB",
    "team": {
      "id": "ap_team_000012",
      "abbreviation": "KC",
      "logo_url": "https://cdn.example/teams/ap_team_000012.svg"
    },
    "headshot_url": "https://cdn.example/players/ap_player_000123.webp"
  },
  "event": {
    "id": "ap_event_009832",
    "opponent_abbreviation": "BUF",
    "starts_at": "2026-11-15T20:15:00Z"
  },
  "prop": {
    "market_key": "football.nfl.player.passing_yards",
    "display_name": "Passing Yards",
    "line": 276.5,
    "over_odds": -110,
    "under_odds": -105
  },
  "research": {
    "l5_hit_rate": 0.8,
    "l10_hit_rate": 0.7,
    "season_average": 291.4,
    "generated_at": "2026-11-15T18:30:00Z",
    "source_cutoff_at": "2026-11-15T18:29:30Z",
    "calculation_version": "hit-rate-v3",
    "market_definition_version": "nfl-passing-yards-v2",
    "eligibility_version": "nfl-prop-eligibility-v4"
  }
}
```

Names such as `player.id`, `prop.market_key` and `research.l10_hit_rate` belong
to Arena Props even when a provider happens to use similar wording.

### Adapter verification contract

Every adapter/endpoint ships with:

1. A sanitized real provider fixture tied to the pinned schema version.
2. A typed schema-validation test.
3. A mapper test asserting the exact canonical write, crosswalk IDs and
   provenance envelope.
4. Negative fixtures for missing fields, enum drift, nullability changes and
   unresolved entities/markets.
5. An Arena Props API contract test proving the public response contains no raw
   provider IDs, provider field names or provider-only enums.

The internal data-quality view must at minimum count unmapped players, teams,
events and markets; conflicting event times; props without canonical
participants; missing rights-approved media; and provider schema failures.

## Canonical ID policy

### Rules

- Every Arena Props entity receives an Arena Props-generated primary key.
- A provider ID is stored only in a provider crosswalk table.
- Names, abbreviations, slugs and URLs are never foreign keys.
- Slugs may change without changing identity.
- Merging duplicate canonical entities is an audited operation that re-points
  references and preserves a redirect/tombstone record.
- Splitting an incorrectly merged entity is also audited and replayable.

### Recommended representation

Use UUIDv7 canonical primary keys for sortable, distributed creation. The
column names express the entity, such as `player_id`, `team_id` and `event_id`;
their values are always Arena Props IDs. Public APIs may prefix serialized
IDs (`ap_player_...`) for clarity, but prefixes are not stored as part of the
UUID.

Conceptually:

```text
players.player_id = 0194...              # Arena Props canonical ID

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

Every crosswalk contains the sourced-fact provenance envelope plus:

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
raw_payload_id
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

#### `retention_policies`

Retention intent is not legal permission. The two decisions are stored and
evaluated independently, and `desired_retention = PERMANENT` never authorizes a
permanent copy.

```text
retention_policy_id       uuid primary key
provider_product_id       uuid nullable foreign key
data_class_key            text not null
desired_retention         PERMANENT | DURATION | UNTIL_REPLACED | UNTIL_RIGHTS_EXPIRY | ACCOUNT_POLICY | NONE
desired_retention_days    integer nullable
licensed_retention        PENDING_CONTRACT | ALLOWED | RESTRICTED | PROHIBITED | NOT_APPLICABLE
licensed_retention_kind   PERMANENT | DURATION | UNTIL_REPLACED | UNTIL_RIGHTS_EXPIRY | NONE nullable
licensed_retention_days   integer nullable
rights_reference          text nullable
rights_effective_at       timestamptz nullable
rights_expires_at         timestamptz nullable
verified_at               timestamptz nullable
verified_by               text nullable
created_at                timestamptz not null
updated_at                timestamptz not null
unique (provider_product_id, data_class_key, rights_effective_at)
```

An ingestion worker computes `delete_after` from the licensed fields, never
from the desired fields. `PENDING_CONTRACT`, `RESTRICTED` without a resolved
duration, or `PROHIBITED` cannot enter a permanent application archive.

#### `raw_payloads`

Links normalized writes to the immutable source payload.

```text
raw_payload_id           uuid primary key
provider_id              uuid not null foreign key
provider_product_id      uuid not null foreign key
source_type              endpoint | webhook | stream | file | manual
provider_record_id       text nullable
request_or_message_id    text nullable
provider_updated_at      timestamptz nullable
ingested_at              timestamptz not null
payload_object_uri       text
payload_sha256           text
schema_version           text not null
ingestion_run_id         uuid not null foreign key
retention_policy_id      uuid not null foreign key
delete_after             timestamptz nullable
```

#### Mandatory sourced-fact provenance envelope

Every normalized row that asserts a fact received from a provider includes,
where the provider supplies the value:

```text
provider_id              uuid not null foreign key
provider_product_id      uuid not null foreign key
provider_record_id       text nullable
provider_updated_at      timestamptz nullable
ingested_at              timestamptz not null
raw_payload_id           uuid not null foreign key
schema_version           text not null
retention_policy_id      uuid not null foreign key
```

`provider_record_id` and `provider_updated_at` may be null only when the source
does not provide them; the other fields are mandatory. A direct sourced fact
must resolve to exactly one raw payload. A reconciled fact with several sources
uses `canonical_fact_sources(fact_type, fact_id, raw_payload_id,
accepted_revision, resolution_method)` rather than dropping provenance.

For readability, later table blocks emphasize domain columns. The provenance
envelope is still a physical set of columns on every sourced table, not an
optional conceptual join or a logging convention.

This makes the public trace deterministic:

```text
Arena Props metric
  -> calculation_run_inputs
  -> accepted player_event_stats revision
  -> provider_record_id
  -> raw_payload_id
  -> schema_version + ingested_at
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
raw_payload_id           foreign key
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
raw_payload_id nullable  foreign key
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
raw_payload_id           foreign key
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
raw_payload_id           foreign key
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
  raw_payload_id

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
raw_payload_id           foreign key
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
provider_id              uuid not null foreign key
provider_product_id      uuid not null foreign key
provider_record_id nullable text
provider_updated_at nullable timestamptz
ingested_at              timestamptz not null
raw_payload_id           uuid not null foreign key
schema_version           text not null
retention_policy_id      uuid not null foreign key
```

Unique logical fact: `(event_id, event_segment_id, player_id,
stat_definition_id, revision)`. The current view selects the latest accepted
revision. Zero is a valid value only when `participation_state = played`.

#### `team_event_stats`

Uses the same shape with `team_id` instead of `player_id`.

#### `season_stat_snapshots`

Optional source-provided or Arena Props-calculated aggregate. It never
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
calculation_source       provider | arena_props
version
source_cutoff_at
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
raw_payload_id           foreign key
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
raw_payload_id           foreign key
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
raw_payload_id           foreign key
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

This is the most strategically valuable source-derived table in Arena Props.
It preserves every economic line, price and executable-state change through the
market lifetime. Economic fields are immutable. Repeated identical polls extend
the observation envelope on the existing state run instead of manufacturing a
new economic snapshot. Permanent retention is desired, but is enabled only when
`licensed_retention` permits it.

```text
prop_snapshot_id         uuid primary key
prop_market_id           foreign key
sportsbook_id            foreign key
region_code              text
offer_slot_key           text             # MAIN or stable provider offer slot
side_key                 OVER | UNDER | YES | NO | HOME | AWAY | DRAW | OTHER
provider_id              uuid not null foreign key
provider_product_id      uuid not null foreign key
provider_record_id nullable text
provider_offer_id nullable text

line_value nullable      numeric(12,4)
price_american nullable  integer
price_decimal nullable   numeric(12,6)
offer_status             ACTIVE | SUSPENDED | REMOVED | SETTLED | UNKNOWN
is_main_line nullable     boolean

provider_updated_at nullable timestamptz
ingested_at              timestamptz not null
first_seen_at            timestamptz not null
last_seen_at             timestamptz not null
observation_count        bigint not null default 1
ended_at nullable        timestamptz
missing_since_at nullable timestamptz
missing_observation_count integer not null default 0
state_source             PROVIDER | INFERRED
lifecycle_policy_version text not null
raw_payload_id           uuid not null foreign key
schema_version           text not null
retention_policy_id      uuid not null foreign key
economic_fingerprint     text not null
supersedes_snapshot_id nullable foreign key
```

The canonical offer-stream identity is:

```text
prop_market_id           # resolves canonical event + player/team + market
sportsbook_id
region_code
offer_slot_key
side_key
provider_product_id
```

Expanded through `prop_markets`, this is the canonical tuple: `event_id`,
`player_id` or `team_id`, `market_id`, `sportsbook_id`, `region_code`,
`offer_slot_key`, `side_key` and `provider_product_id`.

The `economic_fingerprint` hashes that identity plus `line_value`, canonical
`price_decimal`, `offer_status` and any settlement-affecting provider state.
`price_american` is retained for exact display/audit but decimal price is the
canonical comparison value.

Required transition behavior:

- When stream identity and `economic_fingerprint` match the current row, do not
  insert another economic snapshot. Update only `last_seen_at`,
  `observation_count` and missing-observation metadata.
- When line, price, status or settlement-affecting state changes, set the prior
  row's `ended_at` and append a new snapshot. Never rewrite its economic fields.
- Deduplicate transport retries using provider message identity, raw-payload
  hash and `economic_fingerprint`.
- Preserve provider update time, ingestion time and first/last observation time.
- An explicit provider suspension appends `SUSPENDED`; it is not represented by
  deleting an `ACTIVE` row.
- One missing poll sets/increments `missing_since_at` and
  `missing_observation_count` on the current projection. It does not immediately
  mean removal.
- Append `REMOVED` only after an explicit provider removal or a versioned
  disappearance policy reaches its count/time threshold. A reappearance appends
  a new `ACTIVE` state run.
- `SETTLED` is terminal for that offer unless a provider correction appends a
  superseding state. Unmapped provider states are retained as `UNKNOWN` and are
  never executable.
- Corrections append a replacement linked by `supersedes_snapshot_id`.
- Before partitioning, maintain a partial unique index on the offer-stream
  identity where `ended_at is null`.
- If monthly partitioning by `first_seen_at` becomes necessary, keep open state
  ownership in the unpartitioned `current_prop_offers` table and enforce the
  close-plus-insert transition in one transaction. Do not assume a
  partition-local unique index can enforce global current-state uniqueness.
- Index `(prop_market_id, sportsbook_id, region_code, side_key,
  first_seen_at desc)`.
- Index `(event_id)` through the prop-market join or a denormalized generated
  column only if query profiling justifies it.

Illustrative history:

```text
10:05  Tatum Points  FanDuel  OVER   27.5  -110  ACTIVE
10:05  Tatum Points  FanDuel  UNDER  27.5  -110  ACTIVE
11:20  Tatum Points  FanDuel  OVER   27.5  -115  ACTIVE
11:20  Tatum Points  FanDuel  UNDER  27.5  -105  ACTIVE
13:15  Tatum Points  FanDuel  OVER   28.5  -105  ACTIVE
13:15  Tatum Points  FanDuel  UNDER  28.5  -115  ACTIVE
```

From this table Arena Props can derive, with versioned definitions:

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

This is a projection/cache of the latest state per offer stream. It can be a
maintained table, materialized view or Redis structure.
It is rebuildable from `prop_snapshots` and is never the historical source of
truth.

```text
prop_market_id
sportsbook_id
region_code
offer_slot_key
side_key
provider_product_id
prop_snapshot_id
line_value
price_american
price_decimal
offer_status
last_seen_at
missing_since_at nullable
missing_observation_count
fresh_until
primary key (prop_market_id, sportsbook_id, region_code, offer_slot_key,
             side_key, provider_product_id)
```

Only `ACTIVE` and fresh rows are executable. `SUSPENDED`, `REMOVED`, `SETTLED`
and `UNKNOWN` remain visible to lifecycle/reconciliation logic but are excluded
from best-price and consensus calculations.

#### `prop_market_landmarks`

Opening, current, closing and range values are named artifacts, not overloaded
meanings of one generic "closing line" field.

```text
prop_market_landmark_id  uuid primary key
prop_market_id           foreign key
sportsbook_id nullable   foreign key       # required for BOOK_*; null for CONSENSUS_*
region_code              text
side_key                 text
landmark_type            BOOK_OPEN | BOOK_CURRENT | BOOK_CLOSE | BOOK_MIN | BOOK_MAX |
                         CONSENSUS_OPEN | CONSENSUS_CURRENT | CONSENSUS_CLOSE |
                         CONSENSUS_MIN | CONSENSUS_MAX
prop_snapshot_id nullable foreign key      # direct source for BOOK_* landmarks
calculated_metric_id nullable foreign key  # source for CONSENSUS_* landmarks
line_value nullable
price_decimal nullable
source_cutoff_at         timestamptz not null
calculation_version      text not null
market_definition_version text not null
eligibility_version      text not null
generated_at             timestamptz not null
supersedes_landmark_id nullable foreign key
```

Exactly one of `prop_snapshot_id` and `calculated_metric_id` is present. A
landmark correction appends a superseding row rather than mutating the prior
result.

#### `prop_settlements`

```text
prop_settlement_id       uuid primary key
prop_market_id           foreign key
result_value nullable
settlement_status        over | under | push | void | cancelled | unavailable
settlement_rule_version
revision
settled_at
raw_payload_id nullable foreign key
calculation_version nullable
```

### Calculated metrics and projections

#### `calculation_runs`

```text
calculation_run_id       uuid primary key
calculation_key
calculation_version      text not null
market_definition_version text not null
eligibility_version      text not null
code_revision            text not null
source_cutoff_at         timestamptz not null
generated_at             timestamptz not null
started_at               timestamptz not null
completed_at nullable
status
```

#### `calculation_run_inputs`

```text
calculation_run_id       foreign key
input_fact_type          text
input_fact_id            uuid
input_revision           integer not null default 0
raw_payload_id nullable  foreign key
accepted_at              timestamptz not null
primary key (calculation_run_id, input_fact_type, input_fact_id, input_revision)
```

This table closes the trace from a displayed metric to each accepted source
fact and its raw provider evidence.

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
generated_at             timestamptz not null
source_cutoff_at         timestamptz not null
calculation_version      text not null
market_definition_version text not null
eligibility_version      text not null
```

The five reproducibility fields are copied from the run onto every metric row
and constrained to match it. This intentional duplication makes API/export
rows self-describing and prevents an L10 value from losing its cutoff or rule
versions when moved outside the primary database.

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
source_cutoff_at         timestamptz not null
calculation_version      text not null
market_definition_version text not null
eligibility_version      text not null
generated_at             timestamptz not null
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
generated_at             timestamptz not null
source_cutoff_at         timestamptz not null
calculation_version      text not null
market_definition_version text not null
eligibility_version      text not null
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
generated_at
source_cutoff_at
calculation_version
market_definition_version
eligibility_version
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
  -> Arena Props API
  -> SSE/WebSocket invalidation or update
```

### Stage 1: acquisition

- Webhooks validate signature, timestamp and replay window before acknowledgement.
- Polls use per-product cursors, conditional requests and hot/cold schedules.
- Streams persist offsets/checkpoints before messages are acknowledged.
- Every input receives `ingested_at`, provider/product identity,
  `provider_record_id`, `provider_updated_at` when supplied, request/message ID,
  `raw_payload_id`, `schema_version` and the applicable retention policy.
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
- Every sourced write carries the full provenance envelope; every derived write
  carries a calculation run ID and the five reproducibility fields.
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
| Current prop offers/status | Approximately 60 seconds during the hottest window for The Odds API; provider-specific if another source proves faster | Mark stale and exclude from best-price/discrepancy calculations after configured TTL |
| Live event status/score | Webhook-first with 15-60 second reconciliation when live is enabled | Show freshness state; do not imply sub-provider latency |
| Semi-live player/team stats | 15-60 seconds for competitions with live enabled, including the NBA reference | Retain last value with stale marker; final reconcile |
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

### Opening, current, closing and range definitions

- `BOOK_OPEN`: earliest valid, executable `ACTIVE` snapshot after discovery for
  one prop, sportsbook, region, offer slot and side.
- `BOOK_CURRENT`: most recent fresh `ACTIVE` snapshot for that same book stream.
  It is absent while the latest state is suspended, removed, settled, unknown or
  stale.
- `BOOK_CLOSE`: last valid executable snapshot strictly before the versioned
  lock boundary for that book stream. The boundary is the authoritative market
  lock when supplied; otherwise it is the event start rule for that market.
- `BOOK_MIN` / `BOOK_MAX`: minimum/maximum canonical line across eligible
  `ACTIVE` snapshots for that book stream within the chosen interval.
- `CONSENSUS_OPEN`: versioned consensus calculation across the eligible book
  set at the consensus discovery cutoff; it is not a provider snapshot.
- `CONSENSUS_CURRENT`: most recent versioned consensus across currently fresh,
  eligible book states.
- `CONSENSUS_CLOSE`: final versioned consensus across eligible book closes at
  the consensus lock cutoff.
- `CONSENSUS_MIN` / `CONSENSUS_MAX`: minimum/maximum consensus line across
  eligible consensus observations in the chosen interval.
- Suspended, removed, settled, unknown and stale snapshots remain in history but
  cannot become executable landmarks.
- Landmark corrections append a superseding version; prior results are never
  mutated.

Therefore `book_open`, `book_close`, `consensus_open` and `consensus_close` are
separate concepts in storage, calculations and API names. An unqualified
`opening_line` or `closing_line` field is forbidden in public contracts.

### Discrepancy

Absolute line difference is `max_line - min_line`. Percentage presentation
must use a versioned formula and handle zero/near-zero denominators explicitly;
the UI may not invent a percentage when the formula is undefined.

## Read models and application API

The application API assembles normalized source facts and Arena Props
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
market_definition_version
eligibility_version
feature_availability
```

`source_cutoff_at` is mandatory for every calculated value and every read model
containing one. For example, an L10 hit rate is not publishable unless its row
also carries `generated_at`, `source_cutoff_at`, `calculation_version`,
`market_definition_version` and `eligibility_version`.

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

`data_quality_issues` records severity, provider/product, raw payload,
canonical entities, rule key, first/last occurrence, state, owner and resolution.

## Operations tables

### `provider_sync_cursors`

Tracks endpoint/feed cursor, watermark, last attempt/success, next due time and
consecutive failures per product and partition key.

### `event_acquisition_jobs`

Stores independently schedulable work for one event, provider product and data
class. This table supports the versioned dynamic policy in
[`docs/production/live-refresh-policy.md`](../production/live-refresh-policy.md)
and replaces per-game cron definitions.

```text
event_acquisition_job_id uuid primary key
event_id                 uuid not null foreign key
provider_product_id      uuid not null foreign key
data_class               event_state | injuries | lineups | props | game_odds | live_stats | final_reconcile
acquisition_state        COLD | WARM | HOT | PREGAME | LIVE | FINALIZING | FINAL
schedule_policy_version  text not null
last_attempt_at          timestamptz nullable
last_success_at          timestamptz nullable
next_due_at              timestamptz not null
lease_token              text nullable
lease_until              timestamptz nullable
consecutive_failures     integer not null default 0
backoff_until            timestamptz nullable
last_error_code          text nullable
updated_at               timestamptz not null
unique (event_id, provider_product_id, data_class)
```

Workers atomically lease due rows. Queue commands use a deterministic
provider/event/data-class/window/policy idempotency key. A webhook can advance
`next_due_at`, but cannot create a second logical job for the same target.

### `event_acquisition_transitions`

Append-only audit of acquisition-state transitions, including old/new state,
reason (`clock`, `webhook`, `reconciliation`, `manual`, `correction`), source
receipt/run, policy version and transition time. Canonical event status remains
separate.

### `webhook_receipts`

Stores provider message ID, signature result, receipt time, deduplication key,
processing state and raw payload.

Provider plus provider message ID is unique. Duplicate valid deliveries reuse
the existing receipt and acknowledge success without repeating side effects.

### `outbox_events`

Stores typed post-commit change events for calculation, read-model and cache
consumers. Canonical transactions write the fact and outbox row together;
dispatchers publish idempotently and retry independently of Redis availability.

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

These columns intentionally separate product intent from legal permission.
Until a contract is accepted, licensed retention remains
`PENDING_CONTRACT` even when desired retention is permanent.

| Data | `desired_retention` | Initial `licensed_retention` | Contract dependency |
| --- | --- | --- | --- |
| Canonical identity and mapping audit | `PERMANENT` | `PENDING_CONTRACT` | Provider attribution terms |
| Event facts and final stats | `PERMANENT` | `PENDING_CONTRACT` | Historical retention/derived-data rights |
| Raw payloads | `DURATION:90D` | `PENDING_CONTRACT` | Raw caching and deletion terms |
| Prop snapshots | `PERMANENT` | `PENDING_CONTRACT` | Critical historical retention and derived-data rights |
| Calculated metrics and projections | `PERMANENT` | `PENDING_CONTRACT` | Underlying fact derivative rights |
| Media files | `UNTIL_RIGHTS_EXPIRY` | `PENDING_CONTRACT` | Media cache and redistribution rights |
| User/community actions | `ACCOUNT_POLICY` | `NOT_APPLICABLE` | Privacy law and product policy |
| Operational logs | `DURATION` | `NOT_APPLICABLE` | Security and compliance policy |

If a provider forbids permanent prop snapshot retention or derived analytics,
its technically complete feed does not satisfy Arena Props' core requirement.

## Migration and implementation sequence

1. Create provider, canonical identity and crosswalk tables.
2. Create sport, competition, season, team, player, venue and event tables.
3. Load controlled Arena Props sport/competition/market taxonomies.
4. Implement one reference-data adapter and identity review queue.
5. Implement event/roster/stat normalization with source provenance.
6. Implement `prop_markets`, economic-state `prop_snapshots`, lifecycle rules and current-offer projection.
7. Add settlement, calculated metrics and projection versioning.
8. Add user saves, Pick Builder and community action/aggregate tables.
9. Build frontend read models and freshness states.
10. Add specialist sport extensions only for enabled, sourced modules.

No production migration should begin until at least one stats sample and one
odds sample have been mapped end-to-end and their retention rights are accepted.
