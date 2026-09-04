# Frontend Data Requirements

## Purpose

This is the field-level contract for every data-backed Arena Props dashboard
surface. Each row receives a stable requirement ID so the source coverage
matrix, provider evidence, ingestion mapping, tests and launch decisions can
refer to the same requirement without relying on display labels.

## Column definitions

| Column | Meaning |
| --- | --- |
| Required | `Yes` is needed for the current promised surface; `Conditional` is needed only when that sport/module is enabled; `Later` is documented but may be deferred |
| Type | `Raw`, `Raw/media`, `Calculated`, `User`, or `Config` |
| Provider/owner | Intended source class before vendor selection; a candidate name here is not a purchasing decision |
| Endpoint/feed | Provider endpoint, stream or internal job; remains `TBD` until officially verified |
| Refresh | Maximum useful age at the application boundary, not necessarily the poll interval |
| Historical depth | Minimum retained history needed by the product |
| Store? | `Canonical`, `Snapshot`, `Cache`, `Object`, `User`, or `No` |
| License | Rights that must be confirmed separately from technical availability |

## UI read models

The frontend should consume stable Arena Props read models rather than raw
vendor responses.

### Frontend boundary invariant

- React code imports Arena Props API/read-model types only. It may not import a
  provider SDK, raw schema or provider adapter type.
- Every entity reference uses an Arena Props canonical ID. External provider
  IDs such as `IDN-013` are ingestion-only and are forbidden in UI state,
  route parameters, component props and analytics identifiers.
- Provider field names and enums never define frontend property names. Any
  coincidental spelling match still belongs to the Arena Props contract.
- Adding, replacing or upgrading a provider must not require a frontend change
  unless the Arena Props product contract itself changes.
- Legally required attribution is delivered through an Arena Props-owned
  attribution object; it does not expose or recreate the raw provider payload.

| Read model | Primary consumers |
| --- | --- |
| `DashboardReferenceData` | Sport navigation, books, filters and global search |
| `PropTableRow` | Props, Projections and matchup detail tables |
| `DiscrepancyCard` | Discrepancies |
| `PopularPropCard` | Popular |
| `PlayerDirectoryRow` | Players and global search |
| `PlayerResearchView` | Player header, offer strip, charts, contextual rail and game log |
| `EventCard` | Matchups |
| `SavedResearchView` | Saved |
| `PickBuilderView` | Pick Builder |

## Requirement matrix

### Sports identity and media

| ID | Field or record | Used by | Required | Type | Provider/owner | Endpoint/feed | Refresh | Historical depth | Store? | License |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| IDN-001 | Sport family ID, key and display name | Navigation, filters, all cards | Yes | Config | Arena Props | Config/admin | On deploy/change | Permanent | Canonical | Own |
| IDN-002 | Competition/league ID, key, name and sport | Navigation, filters, identity badges | Yes | Raw/config | TBD sports source + Arena Props | TBD | Daily/change | Permanent | Canonical | Commercial display |
| IDN-003 | Competition logo/mark | Navigation and badges | Conditional | Raw/media | TBD media/league source | TBD | On revision | Current + prior revision metadata | Object | Display, cache, resize |
| IDN-004 | Season ID, name, start/end and current flag | Filters, player history, standings | Yes | Raw | TBD sports source | TBD | Daily | Full supported history | Canonical | Display and derived use |
| IDN-005 | Team ID, name, short name and abbreviations | All team/event surfaces | Yes | Raw | TBD sports source | TBD | Daily/change | Permanent | Canonical | Display and derived use |
| IDN-006 | Team colors and locale/location | Cards and team styling | Conditional | Raw | TBD sports/media source | TBD | On revision | Current | Canonical | Display |
| IDN-007 | Team logo variants | All team/event surfaces | Yes | Raw/media | TBD media source | TBD | On revision | Current + rights record | Object | Display, cache, resize |
| IDN-008 | Player ID, legal/display name and handle | All player/prop surfaces | Yes | Raw | TBD sports source | TBD | Daily/change | Permanent | Canonical | Display and derived use |
| IDN-009 | Position/role and role vocabulary | Player directory/research | Yes | Raw/config | TBD sports source + Arena Props | TBD + mapping | Roster change | Full membership history | Canonical | Display and derived use |
| IDN-010 | Jersey number, handedness and active status | Player header/context | Conditional | Raw | TBD sports source | TBD | Roster change | Full membership history | Canonical | Display |
| IDN-011 | Player headshot/avatar | Player rows, cards and header | Yes | Raw/media | TBD media source | TBD | On revision/daily check | Current + rights record | Object | Display, cache, resize, commercial use |
| IDN-012 | Venue ID, name, location and timezone | Event detail, weather, date display | Conditional | Raw | TBD sports source | TBD | On change | Permanent | Canonical | Display and derived use |
| IDN-013 | External provider IDs for every identity | Ingestion only | Yes | Raw | Every selected provider | All source feeds | Every mapping change | Permanent | Canonical | Internal normalization |
| IDN-014 | Media source, checksum, dimensions and rights expiry | Media delivery/operations | Yes | Raw/config | Media provider + Arena Props | Media metadata | On revision | Permanent audit | Canonical | Compliance |
| IDN-015 | Sport icon/mark | Global navigation and sport filters | Yes | Config/media | Arena Props + approved media source | Config or media adapter | On revision | Current + prior revision metadata | Object | Own or approved display/cache/resize |

### Events, schedules and competition context

| ID | Field or record | Used by | Required | Type | Provider/owner | Endpoint/feed | Refresh | Historical depth | Store? | License |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EVT-001 | Event/game/match/series ID and competition | Props, matchup, player research | Yes | Raw | TBD sports source | Schedule/events | Hourly/change | Full supported history | Canonical | Display, cache, derived use |
| EVT-002 | UTC start time and source timezone | All event/prop surfaces | Yes | Raw | TBD sports source | Schedule/events | 1-5 min near event | Full supported history | Canonical | Display |
| EVT-003 | Event status and status timestamp | Matchups, player header, odds eligibility | Yes | Raw | TBD live sports source | Events/live feed | 15-60 sec active; webhook-first where available | Permanent | Canonical + snapshot | Display and retention |
| EVT-004 | Participants and home/away/order | Matchups and all prop identity | Yes | Raw | TBD sports source | Schedule/events | On change | Permanent | Canonical | Display and derived use |
| EVT-005 | Venue and neutral-site flag | Matchup/weather context | Conditional | Raw | TBD sports source | Schedule/events | On change | Permanent | Canonical | Display |
| EVT-006 | Season, week, round, stage and tournament | Filters and event context | Yes | Raw | TBD sports source | Schedule/tournament | Hourly/daily | Permanent | Canonical | Display and derived use |
| EVT-007 | Current score and participant result | Matchups/live modules | Conditional | Raw | TBD live sports source | Live feed | 15-60 sec active; webhook-first where available | Permanent | Canonical + snapshot | Live display and retention |
| EVT-008 | Segment hierarchy and status | Period filters/charts | Conditional | Raw | TBD live sports source | Live/box score | 15-60 sec | Permanent | Canonical | Display and derived use |
| EVT-009 | Segment scores/results | Matchups and sport-specific modules | Conditional | Raw | TBD live sports source | Live/box score | 15-60 sec | Permanent | Canonical | Display and derived use |
| EVT-010 | Event final/correction timestamp | Settlement and metric recalculation | Yes | Raw | TBD sports source | Event update | On change | Permanent | Canonical | Internal/derived use |
| EVT-011 | Best-of, LAN/online and tournament tier | Esports research | Conditional | Raw | TBD esports source | Tournament/match | Hourly/change | Permanent | Canonical | Display |
| EVT-012 | Tour, tournament round and court surface | Tennis research | Conditional | Raw | TBD tennis source | Tournament/match | Hourly/change | Permanent | Canonical | Display and derived use |
| EVT-013 | Event city/country and local date | Soccer/tennis/esports context | Conditional | Raw | TBD sports source | Event/venue | On change | Permanent | Canonical | Display |
| EVT-014 | Props/player/books counts for event | Matchup cards | Yes | Calculated | Arena Props | Event aggregation | On offer/roster change | Current + daily analytics | Cache | Own calculation |

### Rosters, depth charts, lineups and availability

| ID | Field or record | Used by | Required | Type | Provider/owner | Endpoint/feed | Refresh | Historical depth | Store? | License |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RST-001 | Current and historical team membership | Player identity, team filters | Yes | Raw | TBD sports source | Rosters | Hourly/daily | Full supported history | Canonical | Display and derived use |
| RST-002 | Roster status and effective dates | Directory and availability | Yes | Raw | TBD sports source | Rosters | On change | Full supported history | Canonical | Display |
| RST-003 | Event active/inactive/eligible list | Props eligibility and research | Conditional | Raw | TBD sports source | Event roster | 1-5 min pregame/live | Permanent | Canonical + snapshot | Display and derived use |
| RST-004 | Starter/bench/depth-chart slot | Depth charts and context | Conditional | Raw | TBD lineup/depth source | Depth chart | 5-60 min/change | Full supported history | Snapshot | Display, cache |
| RST-005 | Projected versus confirmed lineup flag | Soccer/baseball context | Conditional | Raw | TBD lineup source | Lineup feed | 1-5 min pregame | Permanent | Snapshot | Display, cache |
| RST-006 | Batting order and starting pitcher | MLB research | Conditional | Raw | TBD baseball source | Lineups/probables | 1-5 min pregame | Permanent | Snapshot | Display and derived use |
| RST-007 | Soccer formation and positional slot | Soccer research | Conditional | Raw | TBD soccer source | Lineups | 1-5 min pregame | Permanent | Snapshot | Display and derived use |
| RST-008 | Esports roster, role and substitution | Esports research | Conditional | Raw | TBD esports source | Rosters/match | Hourly/change | Full supported history | Canonical + snapshot | Display |
| RST-009 | Injury/availability status and reason | Player research | Conditional | Raw | TBD injury source | Injury feed | 1-5 min near event | Full supported history | Snapshot | Display, cache, retention |
| RST-010 | Injury report/source timestamp and note | Player research/freshness | Conditional | Raw | TBD injury source | Injury feed | On change | Full supported history | Snapshot | Display and retention |
| RST-011 | Expected return/status confidence | Player research | Later | Raw | TBD injury source | Injury feed | On change | Full supported history | Snapshot | Display; attribution may be required |

### Player and team statistics

| ID | Field or record | Used by | Required | Type | Provider/owner | Endpoint/feed | Refresh | Historical depth | Store? | License |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| STA-001 | Player event participation state | Charts/game log/hit rates | Yes | Raw | TBD stats source | Box score/live stats | 15-60 sec active; final reconciliation | Required history window | Canonical | Display, retention, derived use |
| STA-002 | Player event stat value by canonical stat | Charts/game log/calculations | Yes | Raw | TBD stats source | Box score/live stats | 15-60 sec active; final reconciliation | Required history window | Canonical | Display, retention, derived use |
| STA-003 | Team event stat value by canonical stat | Matchup/context | Conditional | Raw | TBD stats source | Box score/live stats | 15-60 sec active | Required history window | Canonical | Display, retention, derived use |
| STA-004 | Player/team segment-level stat values | Period/set/map charts | Conditional | Raw | TBD granular stats source | Segment stats | 15-60 sec active | Required history window | Canonical | Display, retention, derived use |
| STA-005 | Minutes/time played and starter state | Charts, filters, DNP handling | Yes | Raw | TBD stats source | Box score | 15-60 sec active | Required history window | Canonical | Display and derived use |
| STA-006 | Stat correction version and source time | Recalculation/audit | Yes | Raw | TBD stats source | Corrections feed/poll | On change | Permanent | Canonical | Retention and derived use |
| STA-007 | Player season aggregate | Season context | Conditional | Raw or calculated | Source or Arena Props | Season stats/job | After events | Supported seasons | Canonical/cache | Derived-data rights |
| STA-008 | Team season aggregate/record | Standings/context | Conditional | Raw or calculated | Source or Arena Props | Standings/job | After events | Supported seasons | Canonical/cache | Display and derived use |
| STA-009 | Basketball full-game and quarter/half box stats | Basketball research | Conditional | Raw | TBD basketball source | Box/segment stats | 15-60 sec active | Required history window | Canonical | Display, retention, derived use |
| STA-010 | Basketball shot-location events/zones | Basketball court view | Later | Raw | TBD tracking/play-by-play source | Tracking/PBP | Live/final | Product-defined | Canonical/object | Tracking and derived rights |
| STA-011 | Football passing/rushing/receiving/kicking stats | Football research | Conditional | Raw | TBD football source | Box/player stats | 15-60 sec active | Required history window | Canonical | Display, retention, derived use |
| STA-012 | Football targets, touches and opportunity shares | Usage modules | Conditional | Raw or calculated | Granular source + Arena Props | Play/participation stats | 15-60 sec/final | Required history window | Canonical/cache | Derived-data rights |
| STA-013 | Baseball hitting and pitching box stats | MLB research | Conditional | Raw | TBD baseball source | Box/player stats | 15-60 sec active | Required history window | Canonical | Display, retention, derived use |
| STA-014 | Baseball pitch type, velocity, outcome and whiff | Pitch Arsenal | Conditional | Raw | TBD pitch-level source | Pitch/PBP feed | Live/final | Required history window | Canonical/object | Pitch-level and derived rights |
| STA-015 | Hockey skater/goalie and period stats | NHL research | Conditional/unconfirmed | Raw | TBD hockey source | Box/segment stats | 15-60 sec active | Required history window | Canonical | Display, retention, derived use |
| STA-016 | Soccer player/team match stats | Soccer research | Conditional | Raw | TBD soccer source | Match/player stats | 15-60 sec active | Required history window | Canonical | Display, retention, derived use |
| STA-017 | Tennis match/set player stats | Tennis research | Conditional | Raw | TBD tennis source | Match/set stats | 15-60 sec active | Required history window | Canonical | Display, retention, derived use |
| STA-018 | LoL series/map player stats and champion usage | LoL research | Conditional | Raw | TBD esports source | Series/map stats | 15-60 sec active | Required history window | Canonical | Display, retention, artwork rights separately |
| STA-019 | CS2 series/map/round stats and map vetoes | CS2 research | Conditional | Raw | TBD esports source | Series/map/round stats | 15-60 sec active | Required history window | Canonical | Display, retention, derived use |
| STA-020 | Valorant series/map player stats and agent usage | Valorant research | Conditional | Raw | TBD esports source | Series/map stats | 15-60 sec active | Required history window | Canonical | Display, retention, artwork rights separately |
| STA-021 | Live score, clock and period | Live event context | Required for NBA reference; conditional by later sport | Raw | TBD live source | Live feed | Webhook-first; 15-60 sec reconciliation | Event + permanent final | Snapshot/canonical | Live display and retention |
| STA-022 | Play-by-play events | Advanced/live modules | Later | Raw | TBD PBP source | Stream/feed | Near-real-time | Product-defined | Object/canonical | Display, cache, derived use |

### Advanced and contextual research

| ID | Field or record | Used by | Required | Type | Provider/owner | Endpoint/feed | Refresh | Historical depth | Store? | License |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTX-001 | Standings/division/conference snapshot | Rankings/context | Conditional | Raw | TBD sports source | Standings | After events/daily | Season snapshots | Snapshot | Display and retention |
| CTX-002 | Player/team/esports ranking and source | Rankings/team form | Conditional | Raw | TBD ranking source | Rankings | Daily/weekly | Snapshot history | Snapshot | Attribution, display, retention |
| CTX-003 | Venue weather forecast/observed weather | MLB and outdoor context | Conditional | Raw | TBD weather source | Forecast/observation | 5-15 min near event | Event history | Snapshot | Commercial display/cache |
| CTX-004 | Matchup win probability | Context rail | Conditional | Raw or calculated | TBD model/source or Arena Props | Model/feed | With inputs | Versioned | Snapshot | Model/source rights |
| CTX-005 | Opponent allowed/rank by market/stat | Defense context | Conditional | Calculated | Arena Props | Metric job | After events | Versioned permanent | Snapshot/cache | Own calculation on licensed facts |
| CTX-006 | Similar-player cohort and comparison | Similar module | Conditional | Calculated | Arena Props | Similarity job | Daily/model run | Versioned | Snapshot/cache | Own calculation |
| CTX-007 | Team/player recent form | Soccer/tennis/esports modules | Conditional | Calculated | Arena Props | Metric job | After events | Required history window | Cache | Own calculation |
| CTX-008 | Tennis head-to-head meetings and surface splits | Tennis modules | Conditional | Raw/calculated | Stats source + Arena Props | Match history/job | After matches | Full supported history | Canonical/cache | Display and derived use |
| CTX-009 | Baseball pitch-arsenal aggregates | Pitch Arsenal | Conditional | Calculated | Arena Props | Pitch aggregation | After games/live optional | Required history window | Snapshot/cache | Own calculation on licensed pitch facts |
| CTX-010 | Esports map pool, pick/ban rates and favorites | Esports modules | Conditional | Raw/calculated | Esports source + Arena Props | Match/map job | After matches | Required history window | Canonical/cache | Display, artwork separately |
| CTX-011 | Consensus/provider event odds | Matchup odds/win predictor | Conditional | Raw/calculated | TBD odds source + Arena Props | Game odds feed | Approximately 40-60 sec in hottest/live window for The Odds API | Market lifetime | Snapshot/cache | Display, retention, derived use |

### Sportsbooks, props and odds history

| ID | Field or record | Used by | Required | Type | Provider/owner | Endpoint/feed | Refresh | Historical depth | Store? | License |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ODD-001 | Sportsbook ID, name, abbreviation and region | Filters/offers | Yes | Raw/config | TBD odds source + Arena Props | Books/catalog | Daily/change | Permanent | Canonical | Display |
| ODD-002 | Sportsbook logo | Filters/offers | Yes | Raw/media | TBD media/operator source | Media | On revision | Current + rights record | Object | Logo display/cache |
| ODD-003 | Canonical prop market ID and taxonomy | All prop surfaces | Yes | Config | Arena Props | Config/admin | On approved change | Permanent/versioned | Canonical | Own |
| ODD-004 | Provider market ID/label mapping | Ingestion | Yes | Raw/config | Odds provider + Arena Props | Market feed/mapping | On new market | Permanent/versioned | Canonical | Internal normalization |
| ODD-005 | Prop instance: event, player, market and period | All prop surfaces | Yes | Raw/normalized | Odds source + Arena Props | Player prop feed | Adaptive; approximately 60 sec in hottest/live window for The Odds API | Permanent | Canonical | Display, retention, derived use |
| ODD-006 | Current line/handicap per sportsbook | Props/offers/discrepancies | Yes | Raw | TBD odds source | Player prop feed | Approximately 60 sec in hottest window for The Odds API; faster only with verified source support | Current + permanent snapshots | Snapshot/cache | Live display, cache, historical retention |
| ODD-007 | Current Over American odds | Offers/Popular/Pick Builder | Yes | Raw | TBD odds source | Player prop feed | Approximately 60 sec in hottest window for The Odds API; faster only with verified source support | Current + permanent snapshots | Snapshot/cache | Live display, cache, historical retention |
| ODD-008 | Current Under American odds | Offers/Popular/Pick Builder | Yes | Raw | TBD odds source | Player prop feed | Approximately 60 sec in hottest window for The Odds API; faster only with verified source support | Current + permanent snapshots | Snapshot/cache | Live display, cache, historical retention |
| ODD-009 | Offer status/suspension and source timestamps | Offer eligibility/freshness | Yes | Raw | TBD odds source | Player prop feed | Approximately 60 sec in hottest window for The Odds API; source timestamps remain authoritative | Market lifetime | Snapshot/cache | Display and retention |
| ODD-010 | Main/alternate market marker | Market controls | Conditional | Raw | TBD odds source | Player prop feed | Approximately 60 sec in hottest window for The Odds API | Market lifetime | Snapshot | Display and retention |
| ODD-011 | Every changed line/price/status observation | Line Movement/Prop History | Yes | Raw | TBD odds source | Poll/stream/webhook | Every change | Permanent | Snapshot | Historical retention and derived-data rights |
| ODD-012 | Opening line and price | Prop History | Yes | Calculated | Arena Props | Snapshot aggregation | First eligible snapshot | Permanent | Snapshot/cache | Own calculation; source retention rights |
| ODD-013 | Closing line and price | Prop History/backtests | Yes | Calculated | Arena Props | Snapshot aggregation | Market close/event start | Permanent | Snapshot/cache | Own calculation; source retention rights |
| ODD-014 | Minimum/maximum line and providers | Discrepancies | Yes | Calculated | Arena Props | Current offer aggregation | On snapshot | Permanent analytics/current cache | Cache | Own calculation |
| ODD-015 | Best Over/Under price at same line | Props/offers | Yes | Calculated | Arena Props | Current offer aggregation | On snapshot | Current + analytics | Cache | Own calculation |
| ODD-016 | Line movement, velocity and time at line | Research/advanced products | Conditional | Calculated | Arena Props | Snapshot analytics | On snapshot/batch | Permanent | Snapshot/cache | Own calculation |
| ODD-017 | Game moneyline, spread and total offers | Matchup odds | Conditional | Raw | TBD odds source | Game odds feed | Approximately 40-60 sec in hottest/live window for The Odds API | Market lifetime/permanent snapshots | Snapshot/cache | Display, retention, derived use |
| ODD-018 | Prop result/settlement/push/void | Hit rates/backtests | Yes | Raw/calculated | Stats result + Arena Props | Settlement job | Final/correction | Permanent | Canonical | Derived use |
| ODD-019 | Jurisdiction/market availability | Offer filtering/compliance | Yes | Raw/config | Odds source + Arena Props | Feed/catalog | On change | Snapshot history | Canonical/cache | Regional display rights |

### Arena Props calculations and projections

| ID | Field or record | Used by | Required | Type | Provider/owner | Endpoint/feed | Refresh | Historical depth | Store? | License |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAL-001 | Average for selected sample/filter | Props/player research | Yes | Calculated | Arena Props | Metric job/query | After stats/filter change | Versioned permanent | Snapshot/cache | Own calculation |
| CAL-002 | L5 hit count/rate | Props/trends/research | Yes | Calculated | Arena Props | Metric job/query | After final/correction/line change | Versioned permanent | Snapshot/cache | Own calculation |
| CAL-003 | L10 hit count/rate | Props/trends/research | Yes | Calculated | Arena Props | Metric job/query | After final/correction/line change | Versioned permanent | Snapshot/cache | Own calculation |
| CAL-004 | L15 hit count/rate | Props/research | Yes | Calculated | Arena Props | Metric job/query | After final/correction/line change | Versioned permanent | Snapshot/cache | Own calculation |
| CAL-005 | Season hit count/rate | Props/research | Yes | Calculated | Arena Props | Metric job/query | After final/correction/line change | Versioned permanent | Snapshot/cache | Own calculation |
| CAL-006 | Opponent H2H hit count/rate | Props/research | Yes | Calculated | Arena Props | Metric job/query | After final/correction/line change | Versioned permanent | Snapshot/cache | Own calculation |
| CAL-007 | Current over/under streak | Props/trends/research | Yes | Calculated | Arena Props | Metric job/query | After final/correction/line change | Versioned permanent | Snapshot/cache | Own calculation |
| CAL-008 | Projection value and model version | Projections/props | Yes | Calculated | Arena Props model | Model run | Scheduled/pre-event rerun | Permanent/versioned | Canonical | Own model on licensed inputs |
| CAL-009 | Projection minus selected line | Projections/props | Yes | Calculated | Arena Props | Read-model aggregation | On projection/line change | Versioned | Cache | Own calculation |
| CAL-010 | Projection range/confidence/explanation | Future projection detail | Later | Calculated | Arena Props model | Model run | With model run | Permanent/versioned | Canonical | Own model |
| CAL-011 | Metric/model input cutoff and version | Audit/reproducibility | Yes | Calculated/config | Arena Props | Jobs | Every calculation | Permanent | Canonical | Own |
| CAL-012 | Backtest outcome and cohort | Model operations | Conditional | Calculated | Arena Props | Settlement/backtest job | After settlement | Permanent | Canonical | Own |

### Community, saved research and Pick Builder

| ID | Field or record | Used by | Required | Type | Provider/owner | Endpoint/feed | Refresh | Historical depth | Store? | License |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| USR-001 | User ID and entitlement/plan | Shell/access control | Yes | User | Arena Props | Auth/billing | On change | Account lifetime | User | Own; privacy controls |
| USR-002 | Preferred sports, books, timezone and density | Filters/display | Conditional | User | Arena Props | Preferences API | On user change | Current + audit as needed | User | Own; privacy controls |
| USR-003 | Saved prop/player/event action | Saved and card state | Yes | User | Arena Props | Saved API | Immediate | Account lifetime | User | Own; deletion/export controls |
| USR-004 | Pick Builder prop, side and provider | Pick Builder | Yes | User/session | Arena Props | Pick Builder API/local sync | Immediate | Current + optional analytics | User | Own; privacy controls |
| USR-005 | Community save action and validity state | Popular | Yes | User | Arena Props | Community API | Immediate | Permanent/auditable | User | Own; abuse and privacy controls |
| USR-006 | Community save count | Popular | Yes | Calculated | Arena Props | Aggregate job/stream | Seconds | Permanent aggregates | Cache/snapshot | Own calculation |
| USR-007 | Community Over/Under selection counts | Popular consensus | Conditional | User | Arena Props | Community API | Immediate | Permanent/auditable | User | Own; abuse controls |
| USR-008 | Community Over/Under percentages | Popular consensus | Conditional | Calculated | Arena Props | Aggregate job | Seconds | Permanent aggregates | Cache/snapshot | Own calculation |
| USR-009 | Bot/rate-abuse validity and aggregate version | Popular integrity | Yes | Calculated/config | Arena Props | Trust/aggregate pipeline | Near-real-time | Permanent audit | Canonical | Own; security-sensitive |

## Requirement-to-launch rules

- `Yes` requirements must have a selected source, tested mapping, accepted
  license and monitored freshness before the corresponding surface is public.
- A `Conditional` requirement becomes `Yes` whenever its sport or module is
  enabled. The feature flag must keep an unsupported module out of the UI.
- A `Later` requirement must not influence launch-provider pricing unless the
  user explicitly moves it into launch scope.
- A field with technical coverage but unresolved commercial rights remains a
  sourcing gap.
- A provider aggregate does not replace event-level facts when Arena Props
  needs to reproduce charts, hit rates or corrections.

## Open product decisions that change the matrix

- Launch sports versus visible `coming soon` sports.
- Launch-time jurisdiction allowlist entries and required sportsbooks for each enabled region.
- Live acquisition policy for each sport added after NBA; the NBA reference
  implementation includes webhook-first live sports data and approximately
  60-second supported live prop updates.
- Minimum historical stats and odds depth.
- Mandatory headshots versus approved fallbacks by sport.
- Whether shot-location, pitch-level and play-by-play requirements are launch
  needs or deferred modules.
- Whether projections launch with the initial dashboard.
