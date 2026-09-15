# NBA dashboard data and refresh outline

Decision date: 2026-09-08 (America/Phoenix). This is the proposed implementation
specification for the first sport. The owner has chosen weekly schedule imports
and separate refresh intervals for changing statistics. The specific defaults
below are recommendations, not a claim that all these jobs are running.

This document supersedes the older NBA polling assumptions in the frontend
requirements, provider catalog and starter plan. Their field IDs, identity,
licensing and storage requirements still apply. Other sports remain deferred.

## Current implementation versus target

The NBA schedule worker now imports the published season from September 1
through August 31, with an initial bootstrap and recurring Monday 04:00 Arizona
checks. A private PostgreSQL job record persists the next due time before
provider I/O. Restarting the worker skips a not-due import. The browser reads
saved schedules on open/manual reload only; schedule freshness expires after
eight days. Scores and live clocks are not displayed in this schedule view.

The other dataset policies below remain proposed and disabled. No purchases,
new subscriptions or automatic odds polling are enabled. Check the runbook for
the latest import count and verification evidence.

## The timing model

We fetch a dataset once for everyone and reuse it across every screen. A player
box-score response can fill points, rebounds, assists and many other fields;
there should not be a separate API call for each cell or each visitor.

Four clocks must stay separate:

1. **Provider pull interval:** when our worker checks the upstream source.
2. **Publication delay:** processing time after a complete response is accepted.
3. **Browser refresh:** when a visitor checks our own saved read model.
4. **Source age:** how old the actual fact is, including vendor reporting delay.

Initial engineering targets are publication within two minutes of a complete
accepted import and calculated metrics within five minutes of changed inputs.
These are targets to measure, not tested latency guarantees. A field checked
every 30 minutes can take roughly 30 minutes plus vendor delay, sweep duration,
publication and browser delay to show a change. Polling is not instant delivery.

## Dataset refresh policies

All recurring times below are Arizona time. Scheduled jobs use UTC timestamps
internally. Run one bootstrap before the recurring schedule. No job runs if its
source access, budget or required mapping is unavailable.

| Policy | What gets pulled or calculated | Source / proposed route | Pull or trigger | Overdue / unavailable behavior |
| --- | --- | --- | --- | --- |
| SCHEDULE | Game identity, date, start time, home/away teams, season and published round | BALLDONTLIE `/v1/games` | Full published season initially; Mondays 04:00 weekly. Include preseason and postseason where published. Offseason still weekly; no invented playoff games | Weekly check overdue after 8 days; retain dated schedule. Time TBD if missing. A changed tipoff may remain unknown until the next weekly pull |
| RESULTS | Game status, final score, finality and corrected results | BALLDONTLIE `/v1/games`, restricted to recent relevant dates | Daily 06:00 for previous 3 calendar dates; Monday correction pass over previous 14 days. No in-game polling | Check overdue after 26 hours; show result/status as of import. Never call a saved in-progress clock live |
| DIRECTORY | Player name, position, jersey/profile attributes, known team; team names, abbreviations, conference/division | BALLDONTLIE `/v1/players`, `/v1/teams` | Players daily 05:00, weekly offseason; teams weekly alongside schedule. Bootstrap history once, then tracked player IDs and weekly reconciliation | Players overdue after 26 hours in season / 8 days offseason; teams after 8 days. Keep last verified identity; do not infer active membership from listing presence |
| ROSTER | Effective team membership, active/inactive state and event eligibility | Verified roster/active-player source; BALLDONTLIE active-player route is a candidate | Daily 05:30; game-day tracked roster check every 6 hours | Overdue after 8 hours for game-day scope, 26 hours otherwise. Active-player membership alone does not confirm eligibility for tonight |
| AVAILABILITY | Injuries, status/reason, note, reported-at, return estimate if supplied; confirmed lineup/depth slots if supplied | BALLDONTLIE injuries/lineups or another verified source | Every 30 min from six hours before scheduled tipoff until tipoff; every 6 hours outside that window in season; daily offseason | Overdue after 45 min in pregame window / 8 hours outside. Show as-of time and unknown when coverage is absent. No claim of instant injury news |
| GAME-STATS | Participation, minutes, player and team game stats | BALLDONTLIE `/v1/stats` after access upgrade; team/segment feeds require separate verification | Every 30 min for games due to finish or awaiting final stats, starting two hours after tipoff through eight hours after tipoff. Then daily 06:00 for unresolved games | Job overdue after 45 min while active. Missing final stats remain pending, not zero. Publish final rows to historical research; no live-stat ticker |
| CORRECTIONS | Revisions to completed player/team stats and finality | Same licensed game-stat source | Daily 06:00 for last 3 days; Mondays last 14 days; prior-season audit monthly where licensed | Preserve corrected versions; mark affected metrics pending until recomputed. Do not continually refetch complete old history |
| MEDIA | Player headshots/cutouts; team and league artwork, colors and image metadata | TheSportsDB V1 player/team/league lookups plus approved media storage | Missing-player queue daily; existing player art every 30 days; team/league art every 90 days; manual revision/invalidation when known | Initials/approved generic mark when missing. Keep permitted existing art when a check fails. Rights expiry overrides these intervals immediately |
| PROP-ODDS | Player market, period, book, Over/Under, line, price, alternate/main classification and source time | The Odds API event odds; verified NBA books and markets only | Target every 30 min for pregame games starting within 24 hours; stop at scheduled tipoff. Free proof: manual bounded samples only | Always label sampled odds with source time. Overdue after 45 min while active; exclude overdue prices from current comparisons/EV. Suspension is unknown unless explicit or defined by validated snapshot semantics |
| GAME-ODDS | Game moneyline, spread, total and prices per book | The Odds API sport odds | Same 30-min pregame target, separate budget; free proof manual only | Same sampled/overdue rules as PROP-ODDS; never a live-price promise |
| ODDS-HISTORY | Changed line/price/status observations, first/last seen and provider identity | Our accepted odds snapshots; paid vendor history for backfill | Append only on a changed accepted odds pull. Backfill selected dates once; repair explicit gaps as a separate budgeted job | A 30-min sample misses intermediate movements. Label first/last observed; only say official opening/closing with evidence |
| PERFORMANCE | Averages, game counts, L5/L10/L15/season/H2H hit counts and rates, streaks, charts | Arena calculations over accepted final game stats | On new/corrected final stats, selected line/side change or filter change; publish within 5 min of accepted input, cache local filter queries | No additional vendor call. Inherit dependency coverage and freshness; old completed games do not become invalid merely because they are old |
| CONTEXT | Season/team aggregates, records, opponent allowed/rank, form and standings | Arena calculations over complete final results/stats; verified source for official rankings/tiebreaks | Daily 06:30 after ingestion; rerun affected aggregates after corrections within 5 min | Overdue after 26 hours during season; disclose sample/season. Do not label partial-history ranks league-wide |
| SIMILAR | Similar-player cohort, comparison values, minutes/usage | Arena similarity job over licensed statistics | Daily 07:00 and after model/config changes | Overdue after 26 hours in season. Usage requires a defined formula and all inputs; do not invent it from minutes |
| MODEL | Projection, modeled probability, confidence/range/explanation and version | Arena validated model | Daily 07:30; pregame rerun at most every 30 min if material injury/roster/stat inputs changed | Unavailable until validated. Inherit input freshness; stale availability suppresses any current recommendation |
| OFFER-METRICS | Best price, min/max line, discrepancy, projection difference, EV and odds-based win probability | Arena calculations on coherent offer/stat/model generations | On changed offers/model output; publish within 5 min | No vendor call. Same-line/side/period/book comparison only; no EV from a hit-rate percentage treated as calibrated probability |
| SETTLEMENT | Win/loss/push/void/DNP, historical line/result comparison and backtests | Final stats + versioned market/book rules + accepted historical offer | On final/corrected result, within 5 min; rerun impacted backtests | Unresolved until final facts and exact rules exist. Correction revises outcome with audit trail |
| COMMUNITY | Save counts, activity score, ranking, Over/Under count and percentage | Our authenticated user events | Capture user action immediately; recompute public aggregates every 5 min | Overdue after 10 min. Zero observations shows no sample, not fabricated 50/50 consensus |
| USER | Profile fields, plan, preferences, saves, Builder selections and stake | Our account/preferences/saved APIs and local state | Immediately on user change; authoritative auth/billing events for plan/access | No sports-provider polling; access enforced server-side. Existing local demo account data is not production auth |
| CONFIG | Navigation, taxonomy, book labels/logos, market steps, scoring/settlement rules, promos and guides | Versioned Arena configuration; book catalog reconciled from odds source | On approved edit/deploy; book catalog weekly; expiry evaluated locally | Never guess provider line types or paid access. Expired promotions are removed at expiry without waiting for a job |
| DEFERRED | Live clock, play-by-play, unavailable granular research and non-NBA feeds | Source not enabled | No scheduled pull in NBA starter | Keep explicit demo/unavailable state; define a sport-specific policy before activation |

Weekly **schedule listing** and daily **results** are separate jobs, even if the
same vendor endpoint returns both. The daily result job must not silently become
a daily full-season schedule scan. Incidental schedule discrepancies can be
queued for reconciliation; the weekly schedule remains the authoritative listing
cadence. For accurate near-tipoff reschedules later, add an explicit narrow
exception policy rather than quietly changing the weekly rule.

During the offseason, stats/odds/availability jobs sleep unless the stored
schedule contains relevant preseason or other supported games. Unresolved finals
and correction jobs still finish their work. Suspended/postponed games leave the
30-minute result-stat window and await daily reconciliation; they do not trigger
unbounded retries. Newly published fixtures appear on the next weekly import.

## Exact NBA values shown by the current screens

Each row inherits the pull interval and overdue rule of its named policy. Names
below correspond to current UI labels/types, not raw provider field names.

| Surface / displayed fields | Policy / calculation | Availability in the starter |
| --- | --- | --- |
| All screens: sport/league label, icon, team abbreviation/name/colors/logo | CONFIG, DIRECTORY, MEDIA | Existing artwork mostly fixture-backed; imported schedule team names connected |
| Player rows/header: name, team, position, jersey, avatar/headshot/cutout | DIRECTORY, ROSTER, MEDIA | Directory and provider media ingestion still to build |
| Player next opponent, vs/@, game date/time, event link, season filter | SCHEDULE plus player membership from ROSTER | Derive next scheduled event locally from the full listing; do not fetch per player |
| Matchups: every game date, AZ time, away/home team, round/season, status | SCHEDULE; status as-of from RESULTS | Current import is a limited window; weekly full-season path pending |
| Matchups/game detail: scores, result, quarter/period, game clock | Final scores RESULTS; live period/clock DEFERRED | Remove live styling/clock from schedule mode; never label weekly data live |
| Matchup counts: number of props, players, available books | OFFER-METRICS and ROSTER | Calculate from actual covered rows, not assumed totals |
| Props/offer strip: market name, period, book, side, line, American odds, status, main/alternate, Goblin/Devil, multiplier/promotion | PROP-ODDS plus CONFIG | Unverified classifications/multipliers/promos remain unavailable; no synthetic mapping |
| Props: last update, line change arrow/delta, number of books, best Over/Under | ODDS-HISTORY and OFFER-METRICS | Update from observed snapshots; retain distinct book and supplier identities |
| Stats: MIN, PTS, REBS, O-REB, D-REB, ASTS, BLKS, STL, TO, PF | GAME-STATS and CORRECTIONS | Licensed full-game stats needed; missing/DNP is distinct from a recorded zero |
| Shooting totals: 3PM, 3PA, FTM, FTA, FGM, FGA | GAME-STATS and CORRECTIONS | Same accepted game-stat row, not six requests |
| 2PM, 2PA | PERFORMANCE from FGM minus 3PM; FGA minus 3PA | Only when both operands are valid for the same event/period |
| PA, PR, RA, PRA, BS | PERFORMANCE sums of named points/rebounds/assists/blocks/steals fields | Require every component from the same event/period |
| FP / fantasy points | PERFORMANCE with explicit versioned provider scoring rules | No generic formula until scoring system is selected |
| Full Game, 1Q, 1H, 2H, 4Q results and filters | GAME-STATS for independently verified granular feeds | Full-game data never copied or proportionally split into periods; unsupported periods unavailable |
| Historical row: date, opponent, home/away, minutes, value, result, recorded line, Over/Under outcome | SCHEDULE, GAME-STATS, ODDS-HISTORY, SETTLEMENT | Recorded historical line requires odds history; today's line is not a historical offer |
| Chart bars, average, L5/L10/L15, season/H2H percentage and hits/sample count, season games, streaks | PERFORMANCE | Recalculate selected-line research on line/filter changes; DNP, pushes and sample rules explicit |
| Supporting chart/game log: Minutes, Personal Fouls, FG Made, 3-PT Made, FT Made | GAME-STATS | Reuse same rows as above |
| Shooting context: shot zones/location heatmap, shot-type efficiency | DEFERRED for location data; totals from GAME-STATS | A box score does not supply spatial shot locations |
| Depth charts: position slot, starter/bench, player name, OUT/Q/DOUBT/OFS | ROSTER and AVAILABILITY | Requires verified depth/availability coverage; position alone is not a depth chart |
| Injuries: name, position, status, note, expected return and reported time | DIRECTORY and AVAILABILITY | Source/plan access not yet connected |
| Defense: opponent allowed, rank; season averages and form | CONTEXT | Requires complete comparison population and explicit stat/position definitions |
| Similar: player name, comparison average/value/line, usage and usage label | SIMILAR, DIRECTORY, PROP-ODDS | Suppress missing inputs; selected line uses its own odds timestamp |
| Rankings: rank, team, wins/losses, percentage, streak | CONTEXT | Derivable record is different from official standings/tiebreak rank |
| Matchup win predictor and displayed percentages | OFFER-METRICS for labeled normalized implied odds; MODEL for modeled chance | Do not substitute one method for the other without labeling |
| Projections: projected value, line difference, range/confidence | MODEL, OFFER-METRICS | No connected validated model yet |
| EV: probability, offered/break-even odds, edge/EV, confidence, supporting hit counts | MODEL, OFFER-METRICS, PERFORMANCE | Fair-price calculations require the proper probability and complete market assumptions |
| Discrepancies: min/max line, gap, provider/price, ranked comparison | OFFER-METRICS | Pregame sampled comparison, not guaranteed executable prices |
| Trends: L5/L10 leaders, Over/Under streaks, projection gaps | PERFORMANCE, MODEL, OFFER-METRICS | Re-sort on affected generation; no extra upstream call |
| Popular: activity/popularity score, rank, saves, selection counts, consensus %, evidence cards | COMMUNITY; evidence inherits odds/stat policies | Genuine community records needed; fixture counts remain labeled demo |
| Saved: player/prop bookmark, saved date/state, current research values | USER; displayed sports facts inherit policies above | Saving does not freeze all future research; preserve original selection if shown |
| Builder: exact book/prop/line/side, selected price, current price/status, leg count, stake, payout/profit | USER, PROP-ODDS, CONFIG; calculate totals locally on change | Preserve original selection; flag changed/expired prices. Mixed books do not imply one combined offer |
| Profile/subscription: name, email, avatar, plan, billing/status, usage; favorites/preferences | USER | Current local/demo behavior remains until authenticated services exist |
| Search, filters, sorted row counts, selected market/line, calculator inputs/results | CONFIG/USER and already-cached read models | Immediate local updates or our API query; zero upstream calls |
| Promos, guide/help text, supported book rules and expiry labels | CONFIG | Curated source/expiry, no invented sportsbook promotion feed |
| Updated ago, next check, stale/unavailable, source attribution, coverage/sample labels | Each dataset's metadata; local clock formatting | Refresh labels without calling vendors; never turn page fetch time into fact time |

## History and calculations

Bootstrap current-season completed game history and the prior two seasons for
the NBA research cohort when access/retention permits. L5/L10/L15 require at
least that many eligible appearances, not calendar days. H2H may have fewer
meetings: report the actual count and do not fill missing games. Fetch additional
history only for a defined product requirement. A first season bootstrap is a
separate, checkpointed job and does not repeat every 30 minutes.

Stats become historical facts after verified finality. Scheduled correction
checks record `last_checked_at` even if nothing changes. The underlying
`source_updated_at` or `observed_at` must stay honest. A completed 2025 game can
remain valid; a missing yesterday game makes the current-season aggregate
incomplete. Store coverage through event/date and outstanding finals as well as
wall-clock freshness.

For line-dependent calculations, key caches by player, event, market, period,
side, line, filter set and input generation. Preserve hits, eligible sample,
pushes, excluded DNPs and formula version. Recalculate from our database when a
visitor changes a line; never redownload player history for that interaction.

## What the three keys can support

- BALLDONTLIE documents free teams, players and games at 5 requests/minute.
  Game player stats, active players and injuries require paid access; season
  averages, advanced stats, lineups and other richer feeds have further gates.
  A configured key alone does not prove those entitlements.
  [Official NBA tiers](https://docs.balldontlie.io/#account-tiers).
- The Odds API advertises 500 free credits/month and excludes historical odds
  from that plan. Current event-odds credit usage depends on returned markets
  and regions. Historical odds describe past prices, not past player statistics.
  [Plans](https://the-odds-api.com/#get-access) and
  [V4 reference](https://the-odds-api.com/liveapi/guides/v4/).
- TheSportsDB documents player/team/league lookup endpoints and 30 requests/minute
  for free users. Media coverage and permission to display/cache each asset still
  need verification. [Official documentation](https://www.thesportsdb.com/documentation).

These source facts were checked on the decision date. Pull intervals in this
outline are Arena choices, not vendor update guarantees.

## Request budgets and time to complete a pull

Use one shared BALLDONTLIE limiter at 4 requests/minute initially, with durable
cursors and priority for pending recent stats over historical backfills. The
current client spaces requests by 16 seconds. A sweep of N pages takes at least
`(N - 1) * 16 seconds` plus response time. For example, 15 pages take at least
3 min 44 sec; this is an estimate, not measured full-season import performance.
Record start/end/duration and published game count for every real run.

Illustrative Odds API budget with one region and 30 days:

| Scope | Pulls | Estimated credits/month |
| --- | --- | --- |
| Free proof: one event, one returned market, once/day | 30 | 30 |
| Same tiny scope every 30 min, all day | 1,440 | 1,440 |
| Ten events, eight returned prop markets each, every 30 min in an 8-hour pregame window | 480 sweeps | 38,400 |
| Game moneyline/spread/total, sport-level endpoint, same 8-hour window | 480 sweeps | 1,440 |

These are calculated examples using the documented market/region costs, not
measurements of the user's account or a plan recommendation. Region/book scope,
empty responses, eligible games, discovery calls, retries and backfills affect
the actual total. Even the tiny continuous 30-minute example exceeds 500.
Start manual samples with a proposed 400-credit hard monthly budget and reserve
100 credits; track remaining/used/last-cost response headers and the actual reset.
Reserve estimated credits transactionally before dispatch, reconcile actual
cost after response, and stop before the next request exceeds the allowance.

## Supabase storage and reusable scheduling design

Retain Arena canonical UUIDs and provider crosswalks. All three sources map to
the same player/team/event identities; ambiguous matches remain unpublished.
Keep source facts, derived values, user records and versioned config separate.

Existing canonical tables and `arena_private.schedule_generations` stay the
foundation. Add forward migrations for the following proposed records:

| Record | Fields to retain / purpose |
| --- | --- |
| Dataset policy | sport/competition, dataset key, enabled/access state, cadence, active window, correction window, stale threshold, priority, budget, policy version |
| Durable job state | last attempt/success, next due, cursor, lease owner/expiry, retry count, error class; restarts do not trigger an extra full import |
| Import run | source, start/end/duration, request/page counts, estimated/actual credits, coverage, raw delivery reference, schema/mapping versions and outcome |
| Dataset/field provenance | canonical entity, field/dataset key, source-updated time if supplied, observed time, last checked, published time, input generation, expected next check |
| Player game stats | player/event/period/stat key, value/unit, participation/finality, source revision and correction history |
| Dated rosters | canonical player/team, role/status, effective dates, observed time, verified source |
| Offers and history | book, event/player/market/period/side/line/price/status, source timestamps, current generation and changed-value snapshots |
| Calculations/read models | version, input generations and cutoff, filters/line, sample coverage, values, generated time and per-dataset freshness |

One leased job per competition/dataset/window; no overlapping sweeps. Apply
bounded provider timeouts, schema validation and backoff. Retry failures at
most twice within the job's budget; the current weekly schedule uses zero automatic retries and waits until its next due check; honor Retry-After and stop on unavailable
access or exhausted quota. Persist next due before exit. Manual refresh in the
dashboard rereads saved data only; a separately logged operator repair may
override job timing, never an arbitrary page visit.

Publish complete validated generations atomically. Failed/partial sweeps keep
the last complete generation with an error/coverage marker. Concurrent API
requests share prepared responses and a bounded DB pool. Media/raw objects
belong in approved object storage; SQL keeps references. Keep the same forward
migrations locally and in hosted Supabase, with internal job/raw tables private.

## Browser behavior and freshness

| Page/data | Proposed browser behavior |
| --- | --- |
| Matchups / season listing | Read on open or explicit Reload saved schedule; no automatic schedule polling |
| Player research / props / EV / discrepancies | Read on open; while visible, check our API every 5 min with jitter and ETags. Pause when hidden; check once on return only if due |
| Popular community aggregates | Same 5-min visible-page check; current user's save/selection updates immediately |
| Account, Saved, Builder and filters | Immediate local interaction and authorized persistence; sports facts retain their own age |
| All updated-ago/countdown labels | Format locally from stored timestamps; formatting never triggers a vendor call |

Five-minute API reads do not mean five-minute provider pulls. A 30-minute field
would normally appear within its source interval plus sweep/processing and up
to five minutes of browser delay. On reload, our API may respond instantly from
cache while the source fact is hours old. Show that age.

Return freshness per dataset and, where sources differ, per field. A weekly
schedule, 30-minute odds snapshot and final historical stats can coexist in one
player view. Use labels such as `Schedule checked Sep 8`, `Odds sampled 2:30 PM`,
`Stats through Sep 7`, `Awaiting final stats`, `Refresh overdue`, `Unavailable`
and `Demo data`. Keep usable identities/history when a faster source fails;
suppress conclusions needing the failed dependency. Never reset a source time
when serving cached JSON or recomputing a metric.

For the later 5,000-concurrent-user target, 5-minute checks imply about 16.7
baseline requests/sec per active checking view before navigation/bursts, not
5,000 upstream pulls. Cache by shared generation and entitlement, paginate large
responses, jitter reads, and measure mixed traffic on named infrastructure.
This arithmetic is not capacity certification.

## Implementation sequence and acceptance

1. Weekly full-season schedule: persist due time, preserve every published date,
   remove live clock claims and automatic schedule polling, replace 3-minute
   freshness with schedule freshness. Prove restart skips a not-due provider pull.
2. Directory and media: map a bounded NBA roster cohort, verify image coverage,
   add daily/weekly/monthly queues and missing-image fallbacks.
3. Daily game results: reconcile finals independently of the weekly season scan.
4. Game stats and availability after access verification: backfill once, then
   30-minute pending-final/pregame jobs plus corrections. Enable only supported
   full-game fields initially; granular periods remain gated.
5. Odds: map one event/market/book set, verify credit accounting and snapshots.
   Keep manual samples on free access; activate wider timing only with a budget
   and verified coverage that support it.
6. Metrics/read models: calculate from stored facts, test known samples, then
   connect research screens and show independent freshness/coverage.
7. Prove overdue handling, duplicate-worker exclusion, restart/backfill resume,
   correction propagation, no vendor calls from page/filter/refresh actions,
   budget exhaustion, and local-to-hosted migration. Run the scoped load test
   before claiming support for 5,000 concurrent users.

Record measured p50/p95 sweep duration, publication delay and calculation delay
per dataset. Update this outline when measurements or selected endpoints change.
New sports reuse the scheduler, metadata and UI contract; each sport supplies
its own season definition, event windows, stat/market map, provider budget and
coverage tests.

## Complete requirement-ID crosswalk

The appendix below maps every row of `frontend-data-requirements.md` to a policy.
Multiple policies mean the field depends on multiple datasets, not that the
same field is independently polled several times. Non-NBA fields are explicitly
deferred instead of inheriting an unsuitable NBA interval.

| Requirement | Field / record | NBA refresh policy |
| --- | --- | --- |
| IDN-001 | Sport family ID, key and display name | CONFIG |
| IDN-002 | Competition/league ID, key, name and sport | CONFIG |
| IDN-003 | Competition logo/mark | MEDIA / CONFIG |
| IDN-004 | Season ID, name, start/end and current flag | SCHEDULE |
| IDN-005 | Team ID, name, short name and abbreviations | DIRECTORY |
| IDN-006 | Team colors and locale/location | MEDIA / CONFIG |
| IDN-007 | Team logo variants | MEDIA / CONFIG |
| IDN-008 | Player ID, legal/display name and handle | DIRECTORY |
| IDN-009 | Position/role and role vocabulary | DIRECTORY / ROSTER / CONFIG |
| IDN-010 | Jersey number, handedness and active status | DIRECTORY / ROSTER / CONFIG |
| IDN-011 | Player headshot/avatar | MEDIA |
| IDN-012 | Venue ID, name, location and timezone | SCHEDULE; venue coverage still unverified |
| IDN-013 | External provider IDs for every identity | Each ingestion / mapping change; no separate poll |
| IDN-014 | Media source, checksum, dimensions and rights expiry | MEDIA / CONFIG |
| IDN-015 | Sport icon/mark | MEDIA / CONFIG |
| EVT-001 | Event/game/match/series ID and competition | SCHEDULE |
| EVT-002 | UTC start time and source timezone | SCHEDULE |
| EVT-003 | Event status and status timestamp | RESULTS; no live display |
| EVT-004 | Participants and home/away/order | SCHEDULE |
| EVT-005 | Venue and neutral-site flag | SCHEDULE; venue coverage still unverified |
| EVT-006 | Season, week, round, stage and tournament | SCHEDULE |
| EVT-007 | Current score and participant result | RESULTS; no live display |
| EVT-008 | Segment hierarchy and status | GAME-STATS / CORRECTIONS for supported final segments; live DEFERRED |
| EVT-009 | Segment scores/results | GAME-STATS / CORRECTIONS for supported final segments; live DEFERRED |
| EVT-010 | Event final/correction timestamp | RESULTS; no live display |
| EVT-011 | Best-of, LAN/online and tournament tier | DEFERRED (other sport) |
| EVT-012 | Tour, tournament round and court surface | DEFERRED (other sport) |
| EVT-013 | Event city/country and local date | DEFERRED (other sport) |
| EVT-014 | Props/player/books counts for event | OFFER-METRICS / ROSTER |
| RST-001 | Current and historical team membership | ROSTER |
| RST-002 | Roster status and effective dates | ROSTER |
| RST-003 | Event active/inactive/eligible list | ROSTER / AVAILABILITY; event/depth coverage unverified |
| RST-004 | Starter/bench/depth-chart slot | ROSTER / AVAILABILITY; event/depth coverage unverified |
| RST-005 | Projected versus confirmed lineup flag | DEFERRED (other sport) |
| RST-006 | Batting order and starting pitcher | DEFERRED (other sport) |
| RST-007 | Soccer formation and positional slot | DEFERRED (other sport) |
| RST-008 | Esports roster, role and substitution | DEFERRED (other sport) |
| RST-009 | Injury/availability status and reason | AVAILABILITY |
| RST-010 | Injury report/source timestamp and note | AVAILABILITY |
| RST-011 | Expected return/status confidence | AVAILABILITY |
| STA-001 | Player event participation state | GAME-STATS / CORRECTIONS |
| STA-002 | Player event stat value by canonical stat | GAME-STATS / CORRECTIONS |
| STA-003 | Team event stat value by canonical stat | GAME-STATS / CORRECTIONS |
| STA-004 | Player/team segment-level stat values | GAME-STATS / CORRECTIONS; granular periods gated |
| STA-005 | Minutes/time played and starter state | GAME-STATS / CORRECTIONS |
| STA-006 | Stat correction version and source time | GAME-STATS / CORRECTIONS |
| STA-007 | Player season aggregate | PERFORMANCE / CONTEXT |
| STA-008 | Team season aggregate/record | PERFORMANCE / CONTEXT |
| STA-009 | Basketball full-game and quarter/half box stats | GAME-STATS / CORRECTIONS; granular periods gated |
| STA-010 | Basketball shot-location events/zones | DEFERRED (no enabled location/PBP/live feed) |
| STA-011 | Football passing/rushing/receiving/kicking stats | DEFERRED (other sport) |
| STA-012 | Football targets, touches and opportunity shares | DEFERRED (other sport) |
| STA-013 | Baseball hitting and pitching box stats | DEFERRED (other sport) |
| STA-014 | Baseball pitch type, velocity, outcome and whiff | DEFERRED (other sport) |
| STA-015 | Hockey skater/goalie and period stats | DEFERRED (other sport) |
| STA-016 | Soccer player/team match stats | DEFERRED (other sport) |
| STA-017 | Tennis match/set player stats | DEFERRED (other sport) |
| STA-018 | LoL series/map player stats and champion usage | DEFERRED (other sport) |
| STA-019 | CS2 series/map/round stats and map vetoes | DEFERRED (other sport) |
| STA-020 | Valorant series/map player stats and agent usage | DEFERRED (other sport) |
| STA-021 | Live score, clock and period | DEFERRED (no enabled location/PBP/live feed) |
| STA-022 | Play-by-play events | DEFERRED (no enabled location/PBP/live feed) |
| CTX-001 | Standings/division/conference snapshot | CONTEXT |
| CTX-002 | Player/team/esports ranking and source | CONTEXT |
| CTX-003 | Venue weather forecast/observed weather | DEFERRED (other sport) |
| CTX-004 | Matchup win probability | MODEL or OFFER-METRICS; label method |
| CTX-005 | Opponent allowed/rank by market/stat | CONTEXT |
| CTX-006 | Similar-player cohort and comparison | SIMILAR |
| CTX-007 | Team/player recent form | CONTEXT |
| CTX-008 | Tennis head-to-head meetings and surface splits | DEFERRED (other sport) |
| CTX-009 | Baseball pitch-arsenal aggregates | DEFERRED (other sport) |
| CTX-010 | Esports map pool, pick/ban rates and favorites | DEFERRED (other sport) |
| CTX-011 | Consensus/provider event odds | GAME-ODDS / OFFER-METRICS |
| ODD-001 | Sportsbook ID, name, abbreviation and region | CONFIG |
| ODD-002 | Sportsbook logo | MEDIA / CONFIG |
| ODD-003 | Canonical prop market ID and taxonomy | CONFIG |
| ODD-004 | Provider market ID/label mapping | CONFIG |
| ODD-005 | Prop instance: event, player, market and period | PROP-ODDS / CONFIG |
| ODD-006 | Current line/handicap per sportsbook | PROP-ODDS / CONFIG |
| ODD-007 | Current Over American odds | PROP-ODDS / CONFIG |
| ODD-008 | Current Under American odds | PROP-ODDS / CONFIG |
| ODD-009 | Offer status/suspension and source timestamps | PROP-ODDS / CONFIG |
| ODD-010 | Main/alternate market marker | PROP-ODDS / CONFIG |
| ODD-011 | Every changed line/price/status observation | ODDS-HISTORY; observed samples only |
| ODD-012 | Opening line and price | ODDS-HISTORY; observed samples only |
| ODD-013 | Closing line and price | ODDS-HISTORY; observed samples only |
| ODD-014 | Minimum/maximum line and providers | OFFER-METRICS |
| ODD-015 | Best Over/Under price at same line | OFFER-METRICS |
| ODD-016 | Line movement, velocity and time at line | ODDS-HISTORY; observed samples only |
| ODD-017 | Game moneyline, spread and total offers | GAME-ODDS |
| ODD-018 | Prop result/settlement/push/void | SETTLEMENT |
| ODD-019 | Jurisdiction/market availability | CONFIG |
| CAL-001 | Average for selected sample/filter | PERFORMANCE |
| CAL-002 | L5 hit count/rate | PERFORMANCE |
| CAL-003 | L10 hit count/rate | PERFORMANCE |
| CAL-004 | L15 hit count/rate | PERFORMANCE |
| CAL-005 | Season hit count/rate | PERFORMANCE |
| CAL-006 | Opponent H2H hit count/rate | PERFORMANCE |
| CAL-007 | Current over/under streak | PERFORMANCE |
| CAL-008 | Projection value and model version | MODEL |
| CAL-009 | Projection minus selected line | OFFER-METRICS |
| CAL-010 | Projection range/confidence/explanation | MODEL |
| CAL-011 | Metric/model input cutoff and version | Every calculation publication; inherit input policies |
| CAL-012 | Backtest outcome and cohort | SETTLEMENT |
| USR-001 | User ID and entitlement/plan | USER |
| USR-002 | Preferred sports, books, timezone and density | USER |
| USR-003 | Saved prop/player/event action | USER |
| USR-004 | Pick Builder prop, side and provider | USER |
| USR-005 | Community save action and validity state | USER immediately / COMMUNITY aggregation |
| USR-006 | Community save count | COMMUNITY |
| USR-007 | Community Over/Under selection counts | USER immediately / COMMUNITY aggregation |
| USR-008 | Community Over/Under percentages | COMMUNITY |
| USR-009 | Bot/rate-abuse validity and aggregate version | USER immediately / COMMUNITY aggregation |
