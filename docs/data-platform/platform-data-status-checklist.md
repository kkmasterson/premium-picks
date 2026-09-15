# Platform real-data and mock-data checklist

Last audited: **2026-09-08, America/Phoenix**.
Scope: **every routed page, public landing section, shared dashboard surface,
and all 12 sports** in the current app. This is a working completion tracker,
not a production-readiness claim.

## What is real today

**Only the NBA schedule path is connected end to end to a sports provider.**
The running Arena API returned 1,267 imported games from BALLDONTLIE, with a
requested season window of 2026-09-01 through 2027-08-31. Last source observation:
2026-09-08 19:34:46 Arizona / `2026-09-09T02:34:46.239Z` UTC. The API reported
`fresh`, `automaticRefresh: false`, `playerStats: false`, `playerProps: false`.
The props endpoint independently reported `source: internal-fixture`, `live: false`.
These are an audit snapshot, not counts or freshness values to keep hardcoded.

The real path is BALLDONTLIE -> worker -> local Supabase PostgreSQL -> Arena API
-> NBA Matchups and NBA game schedule detail. It imports weekly on Mondays at
04:00 Arizona, subject to the local computer/services running. It does not make
the Players, Props, Builder or landing-page examples real automatically.
The Matchups **All** tab currently shows this NBA feed, not an all-sport feed.

Actual images can load from external URLs while the identity list and image
mapping are fixed fixtures. A working save button can store a real user action
against mock odds. Correct arithmetic on mock inputs is still mock research.

## Preserve the design when connecting data

The existing page/component design is the binding target. Replace its source
through an Arena read-model mapper; do not create a different-looking page for
real data. Retain layout, navigation and controls unless a separate design change
is requested. Missing fields use explicit unavailable states in their existing
slots; never borrow fixture values to make a connected row appear complete.

Verified mapping update, 2026-09-08: NBA and demo matchup lists now use the same
`MatchupRow` component. NBA schedule rows also resolve on Saved and game detail.
Saves remain browser-local; props and players on Saved still resolve demo data.
Known curated team artwork is reused with a matching label check; missing or
conflicting artwork falls back to the team's abbreviation. This is not a new
managed media ingestion feed.

| Existing slot / action | Connected NBA mapping | Missing-data behavior |
| --- | --- | --- |
| Team names and away @ home | `ScheduleGame.away/home` from Arena API | No fixture identity join |
| Date, time and status | `startsAt` formatted in Arizona, `date` fallback when time unknown, stored `state` | Time TBD; status reflects import |
| Props / Players / Books columns | Nullable `MatchupSummary.counts`; schedule supplies none | Three unavailable values, never fixture counts or invented zeros |
| Game link and bookmark | Canonical `ScheduleGame.id` | Same ID on Matchups, Saved and detail |
| Saved item no longer in schedule / offline | Retain bookmarked canonical ID | Visible unavailable item with retry/open/remove; never silently discard |

Evidence: [shared row](../../src/features/dashboard/components/MatchupRow.tsx),
[read-model mapping](../../src/features/dashboard/matchup-view.ts),
[mapping regression tests](../../src/features/dashboard/matchup-mapping.test.tsx).
Focused checks cover timezone boundaries, multiple dates, unknown times, canonical
navigation, save/remove, unresolved bookmarks and conflicting badge names.

## Status meanings and check-off rule

| Status | Meaning |
| --- | --- |
| REAL — LOCAL | Accepted provider data reaches this specific screen through our local backend/database |
| MIXED | Only part of the surface is connected; the row must name the real part |
| MOCK | Hardcoded, generated or simulated sports/research/account values |
| LOCAL ACTION | Real interaction or browser storage, without authenticated backend persistence |
| STATIC / CONFIG | Product copy, rules or curated assets; an API is not inherently required |
| PLACEHOLDER | Missing service, disabled control, reserved page or stand-in destination |
| UNVERIFIED | Code or a claim exists, but its external truth/access has not been established |

A checked item means the **specific named scope** was verified. It does not mean
the whole page, sport, paid plan or platform is finished. Only the verified NBA
schedule baseline and local NBA event bookmark path are checked below. Update unchecked tasks when their evidence
exists; preserve demo labels for any remaining mock fields.

For a data task, completion means: verified endpoint/access and sample -> stable
Arena IDs and mapping -> accepted stored facts -> scheduled refresh/corrections
-> API contract -> the actual page reads those facts -> source age, missing and
failure states verified. For user/account tasks, use authenticated persistence.
For static content, use correct approved content and working destinations;
do not build a sports API for legal text or navigation.

## What we can build with the three free APIs

Free-plan documentation checked **2026-09-08, America/Phoenix**. This is an
implementation outline, not another completed-data audit. It uses public plan
documentation; no new authenticated provider probes, imports, subscriptions or
refresh jobs were run for this assessment. Actual account access, returned
fields and coverage must pass the existing completion rule before check-off.
Paid trials are not counted as a sustainable free plan.

**Recommended free milestone: a real NBA directory and schedule, selected
verified media, and a small timestamped odds-comparison sample.** The current
free inputs do not establish a validated player-bet rating product. An observed
book price, a market-implied probability and our model probability are different
things; keep that distinction visible.

### Provider limits that determine the scope

| Provider | Documented free access | Consequence for this platform |
| --- | --- | --- |
| BALLDONTLIE | NBA teams, players and games; 5 requests/minute. Game player stats, active-player listing, injuries, lineups and odds are paid. Other sports have different tier tables below | Expand the directory and schedule first; NBA player averages/hit rates cannot be populated from these free endpoints. [NBA tiers](https://docs.balldontlie.io/#account-tiers) |
| The Odds API | 500 credits/month across the account; advertised access to all offered sports/markets and most books; historical odds excluded | A budgeted sample can be real. All-market access is not a promise that every sport/book has every prop. [Plans](https://the-odds-api.com/#get-access) |
| TheSportsDB | V1 individual lookups and player search, 30 requests/minute. Player search returns at most 1 result; team-player lists 10, season-event lists 15. Free team-name search is restricted to Arsenal in current docs | Enrich individually mapped identities. Limited lists cannot certify complete rosters or full schedules. Use deterministic crosswalks and fallbacks. [V1 documentation](https://www.thesportsdb.com/documentation) |

TheSportsDB is crowd-sourced. Missing images/fields and current-roster accuracy
need acceptance checks. Free API access also does not by itself establish the
rights for every image's commercial display, storage or transformation; retain
the project's existing media approval gate. [About](https://www.thesportsdb.com/docs_about),
[free API and production-key description](https://www.thesportsdb.com/api.php).

### Capability codes used throughout the field inventory

These codes describe **feasibility**, separately from the existing current-state
column. FREE means technically available for a scoped integration, not already
connected or guaranteed complete. INTERNAL means no paid sports-data API is
needed; development, authentication, hosting or another service can still cost.

| Code | Free milestone | Boundary / work needed |
| --- | --- | --- |
| F1 — Schedule | Import supported competition schedules and canonical event identities | NBA implemented; other rows in the sport table require their own adapters and coverage checks |
| F2 — Directory | Connect player/team identities and supplied profile fields | Do not infer active roster, injury or confirmed lineup from a general player list |
| F3 — Media sample | Map selected player/team/league images or venue metadata | Partial enrichment; verify returned record, usage and missing-field behavior |
| F4 — Odds sample | Store selected observed offers and calculate comparable-book price differences | Limited event/market/book scope; exact mapping and source age required; no model edge implied |
| F5 — Forward observations | Retain permitted snapshots collected from now onward | Sparse observations, not backfilled historical odds or every market change |
| F6 — Results/derived team summaries | Add separate completed-game refresh for an F1-supported competition; calculate basic records/form from accepted final results | Validate season completeness, corrections and competition rules; no player box-score inference |
| F7 — Sport exceptions | Use explicitly free standings, roster or ranking/reference endpoints where listed below | Competition-specific; cannot be generalized from another sport |
| F8 — Internal work | Finish application-owned storage, calculations on supplied inputs, content and infrastructure | A sports key supplies neither real users nor billing, support, community activity or model validation |
| F9 — Blocked research inputs | Leave player performance/availability/model-dependent research unavailable or explicitly demo | Need an accepted paid endpoint or separately evaluated alternative; upgrading alone does not validate ratings |

### Every page: what the free phase can deliver

The scope here is our implementation recommendation based on the audit and
provider evidence, rather than a provider guarantee about our product.

| Page | Free-phase deliverable / checklist IDs | What remains incomplete |
| --- | --- | --- |
| P01 Landing | F8: correct claims, approved static copy and working links (P01.2–P01.6); optional F1/F2 preview later | Owner-review modeling remains paused. APIs do not prove the 97% claim; do not replace the demo with unsupported ratings |
| P02 Promos | F8: verified manually maintained offer record and destinations (P02.1–P02.4) | Partner terms, relationship and conversion tracking come from the partner/business, not these sports feeds |
| P03 Props | F2/F4: real identity, event and sampled line/book/price rows; partial P03.1/P03.2/P03.6; F5 for P03.4 | P03.3/P03.5 remain F9. Show missing analytics as unavailable; a partially connected row is not a finished Props page |
| P04 +EV | F8: formulas/tests and optional clearly labeled market-implied/no-vig comparison | P04.1/P04.2 need a justified probability input and validation. Do not label a price discrepancy as a proven positive-EV bet |
| P05 Builder | F4/F8: select the sampled canonical offers, preserve quote and source time, flag later changes; P05.1–P05.4 can be developed within that limited scope | Freshness budget limits quote usability; account persistence needs our backend; bet execution is a separate integration |
| P06 Discrepancies | F4: compare the same sampled market/period across returned books (P06.1–P06.3) | Partial board only; there may be fewer than two usable books; no model confidence or full-board coverage |
| P07 Players | F2/F3: directory, supported profile fields and selected images; F1: next event (P07.1/P07.2/P07.4) | Active status depends on sport; P07.3 performance summaries remain F9 |
| P08 Player detail | F2/F3: identity/media; F4/F5: sampled offer strip/observations (partial P08.1/P08.4/P08.9); F7 context only where eligible | Logs, hit charts, injuries, lineup impact, defense comparisons and projections remain blocked for NBA; no fabricated supporting values |
| P09 Trends | F8: build the aggregation framework; F6 permits a separate basic team-form module if desired | Existing P09.1–P09.3 are player-stat/model rankings and remain F9; team form is not a substitute for player hit streaks |
| P10 Matchups | F1: expand eligible schedules; F6: final results; F4: sampled game prices; F8: saves (P10.2–P10.5) | See sport exceptions below. Counts must mean imported/sample coverage, not every available prop in the market |
| P11 Game detail | F1/F6: accepted event/results; F2: identity links; F4: sampled markets (P11.2–P11.4 partially) | Team membership is not confirmation of participation; player box stats and lineup context remain separate |
| P12 Saved | F8: authenticated canonical bookmarks and missing-record handling (P12.1–P12.3) | Saved research inherits the same F1/F2/F4 scope; stale quotes stay stale |
| P13 Popular | F8: capture real permitted user actions and calculate counts (P13.1–P13.4) | Requires real usage plus aggregation/abuse controls; empty traffic is an empty sample, not synthetic popularity |
| P14 Profile | F8: auth, profile/preferences and account activity (P14.1/P14.2/P14.5) | P14.3/P14.4 require authoritative billing/entitlement integration, not a sports API |
| P15 Calculators | F8: implement and test user-input odds/payout/implied-probability tools (P15.1/P15.2) | Inputs must be user-provided or explicitly sourced; manual EV remains conditional on supplied probability |
| P16 Guides | F8: complete approved content/navigation (P16.1/P16.2) | Content review and honest examples, not a provider subscription |
| P17 Help | F8: accurate explanations and working support destinations (P17.1/P17.2) | Ticket/contact service is separate from sports data |

Shared work follows the same boundary: S01/S02/S06/S07 can use F1/F2/F4 read
models; S03 uses F3; S04/S05/S09/S10/S11 are F8 engineering/service work; S08
implements only the enabled dataset policies; S12 remains a separate validation
gate. Redirects, account panels and shared Builder/drawer surfaces inherit their
parent page's scope. None of these feasibility statements changes a checkbox.

### All 12 sports: free BALLDONTLIE scope

Each source link is the sport's own tier table. Documented access is not a
successful probe with our key. Soccer is assessed as **EPL only** here; other
competitions need their own entry before claiming Soccer-wide support.

| Sport | Documented free building blocks | Game/match schedule and deeper research gate | Evidence |
| --- | --- | --- | --- |
| NBA | Teams, players, games | F1/F2; player game stats and availability paid | [NBA](https://docs.balldontlie.io/#account-tiers) |
| NFL | Teams, players, games | F1/F2; stats, active players and injuries paid | [NFL](https://nfl.balldontlie.io/#account-tiers) |
| MLB | Teams, players, games | F1/F2; stats, active players, injuries and lineups paid | [MLB](https://mlb.balldontlie.io/#account-tiers) |
| NHL | Teams, players | Games/box scores require ALL-STAR or higher; no F1 from its free tier | [NHL](https://nhl.balldontlie.io/#account-tiers) |
| WNBA | Teams, players, games | F1/F2; player/team stats require GOAT; active players/injuries paid | [WNBA](https://wnba.balldontlie.io/#account-tiers) |
| NCAAB | Conferences, teams, players, standings | Games paid; player stats require GOAT; F7 standings possible | [NCAAB](https://ncaab.balldontlie.io/#account-tiers) |
| NCAAF | Conferences, teams, players, active players, standings | Games paid; player stats require GOAT; F7 roster/standings exception | [NCAAF](https://ncaaf.balldontlie.io/#account-tiers) |
| Soccer — EPL | Teams, rosters, players, standings | Matches/lineups paid; match stats/injuries require GOAT | [EPL V2](https://epl.balldontlie.io/#account-tiers) |
| Tennis — ATP/WTA | Players, tournaments, rankings | Matches paid; match statistics/H2H paid; tournament list is not a match schedule | [ATP](https://atp.balldontlie.io/#account-tiers), [WTA](https://wta.balldontlie.io/#account-tiers) |
| LoL | Teams, players, items, rune paths/runes, spells, champions | Tournaments paid; matches/maps/player map stats require GOAT | [LoL](https://lol.balldontlie.io/#account-tiers) |
| CS2 | Teams, players, tournaments, tournament teams | Map pool/rankings paid; matches/maps/player stats require GOAT | [CS2](https://cs.balldontlie.io/#account-tiers) |
| Valorant | Teams, players/profiles, series and map/agent/weapon references, countries/regions, crosshairs | Matches require GOAT; reference series/maps do not constitute results or player map statistics | [Valorant](https://valorant.balldontlie.io/#account-tiers) |

For odds, the documented player-market catalog includes NBA/WNBA/NCAAB,
NFL/NCAAF, MLB, NHL and selected soccer competitions. Tennis or esports
player-prop coverage is **not established by that catalog**. Do not promise
those boards without an accepted source sample. Exact book/market availability
still varies by event. [Market catalog](https://the-odds-api.com/sports-odds-data/betting-markets.html).

Where BALLDONTLIE games are paid, The Odds API event discovery can be evaluated
as a limited upcoming-event alternative for a supported sport. It does not
establish full-season coverage. TheSportsDB's truncated schedule lists likewise
do not satisfy our all-games schedule requirement.

### A free odds budget we can actually follow

The Odds API V4 reference specifies: sport-level featured odds cost requested
markets x regions; event odds cost returned unique markets x regions per event.
Explicit bookmaker groups use one region-equivalent per ten books. Sports and
current-event discovery do not consume credits; event-market discovery costs
one. Read quota headers after requests; retries and other jobs share the same
balance. Historical endpoints require paid access.
[V4 endpoint and quota reference](https://the-odds-api.com/liveapi/guides/v4/).

**Proposed NBA pilot, not enabled:** allow at most 400 of the 500 monthly credits
for planned work, leaving 100 for testing/recovery. Use the provider's actual
remaining balance and reset period, not an assumed fresh account. With one
region and a 31-day planning month:

| Pilot job | Assumption / our calculation | Monthly allocation |
| --- | --- | --- |
| Game odds snapshot | 3 featured markets once/day x 31 days | 93 credits |
| Player-prop sample | 1 selected event/day x 3 markets x 2 observations/day x 31 days | 186 credits |
| Event-market discovery | At most 1 selected event/day x 31 days | 31 credits |
| Planned subtotal | 93 + 186 + 31 | 310 credits |
| Remaining inside working cap | 400 - 310 | 90 credits |
| Protected reserve | 500 - 400 | 100 credits |

Candidate player markets are points, rebounds and assists. Select an event
that actually has these markets; skip missing coverage and stop the pilot if
the accepted quota budget cannot support it. Game odds go into event-market
storage, not the existing player-required prop table. Snapshot retention uses
the already required accepted retention policy. [NBA market keys](https://the-odds-api.com/sports-odds-data/betting-markets.html).

For comparison, ten events x three markets x two sweeps/day x 31 days would
cost **1,860** credits under the same assumptions. Even one one-credit request
every 30 minutes around the clock costs **1,488** per 31 days. These are our
budget calculations, not observed usage. A free all-sport half-hour odds board
does not fit. Twice-daily samples are development evidence and price-shopping
snapshots; they are not sufficiently current to present as actionable ratings.

### Proposed refresh outline for the free phase

These are scheduling decisions for implementation, not provider freshness
guarantees. They do not replace or enable jobs automatically. Weekly NBA schedule
import remains the only completed policy. The earlier NBA refresh document's
stats/odds intervals are targets behind its stated access gates; this budget
governs the proposed free odds pilot only.

| Dataset | Proposed acquisition | What the screen can claim |
| --- | --- | --- |
| F1 schedule | Initial season bootstrap; weekly reconciliation once published | Schedule as of last accepted import; no assumption a draw or later-round pairing exists months ahead |
| F2 player/team directory | Initial paginated import; weekly reconciliation; targeted approved changes when needed | Source-supplied profile/membership as of observation, not guaranteed active roster |
| F6 finished results | Separate daily recent-date reconciliation; daily correction lookback over last 7 days; periodic deeper audit | Final results after successful processing; no live-clock promise |
| F3 selected media | Fetch missing mapped records; review changes monthly; null/initials fallback | Selected verified image, not complete media coverage |
| F4 game odds | At most once/day within the pilot | Timestamped snapshot |
| F4 player odds | At most two observations for one chosen event/day within the pilot | Small sample; no promise to capture every movement or closing price |
| F7 standings/rankings | Daily only for enabled free endpoints; stop offseason jobs when not useful | The named competition's accepted snapshot |
| F5 history / F8 comparisons | Save/recalculate when accepted inputs change | Observed-only history and consistent comparison generation |
| F9 player stats, injuries, ratings | No recurring free NBA job; remain unavailable/demo | Nothing fabricated to fill an empty panel |
| F8 saves/profile/community | On authenticated user actions; aggregate periodically as designed | Our own recorded actions, not a sports-provider feed |

Share a conservative BALLDONTLIE queue capped at four requests/minute initially
(15 seconds between calls); count every page/retry/job. Keep the current weekly
job's more conservative pacing. Do not multiply account limits by sport or
user without verified entitlement. TheSportsDB can use a separate conservative
queue below its documented limit. One backend import serves all users through
Supabase and Arena read models; never make one vendor call per user/page view.
The 5,000-user goal still requires hosted capacity tests and is not guaranteed
by free provider access.

### Recommended order for checking off free work

1. **F2 NBA directory:** extend canonical player/profile storage, import reviewed
   identities, then connect P07, P08 identity headers and S01 search. Keep active
   status and stats unavailable unless separately sourced.
2. **F1/F6 NBA event connections:** reuse the real schedule for next opponents,
   canonical event saves and detail links. Add final-result reconciliation as
   its own job before claiming current results.
3. **F3 selected media:** prove a small mapped set; connect managed records and
   fallback behavior before attempting broad coverage.
4. **F4/F5 one-event odds pilot:** implement quota ledger, event/player/market
   crosswalks, accepted snapshots and stale states; connect limited P03/P06/P05
   surfaces. Keep price history honest about observation gaps.
5. **F8 application work:** canonical Saved, authenticated profiles, tested
   manual calculators and honest community counts can progress without paying
   for a sports-data tier. Billing/Discord/support remain separate services.
6. **Reuse the SOP for the next sport:** choose NFL, MLB or WNBA for another
   free F1/F2 path; use the sport table for exceptions. Do not spend the NBA
   pilot's quota on all sports simultaneously.
7. **Resolve F9 before rating claims:** obtain accepted performance/availability
   history and adequate observed prices, then test sport/market models. A free
   directory or odds response does not close S12.

Before each completion, capture a sanitized sample and coverage/count checks,
test replay and mappings, confirm the actual page consumes the accepted read
model, and record refresh/missing/stale behavior. Keep the existing checkboxes
unchanged until that work is done. This section supersedes broad free-access
assumptions in older planning prose; the current-state audit remains separate.


## Verified baseline

- [x] **B01 — NBA provider import:** genuine BALLDONTLIE game records imported; no keys in browser code.
- [x] **B02 — Local Supabase storage:** canonical teams/events and provider crosswalks store accepted schedule data.
- [x] **B03 — NBA schedule API:** `/api/v1/nba/schedule` serves the stored generation with source/freshness metadata.
- [x] **B04 — NBA Matchups listing:** imported games listed by date with Arizona time; no single-date restriction.
- [x] **B05 — NBA game schedule detail:** canonical game routes show the selected imported schedule record.
- [x] **B06 — Weekly schedule policy:** persisted due time, restart skips, no automatic browser schedule polling.
- [x] **B07 — Schedule verification:** replay preserves canonical IDs/counts; private tables deny browser roles; stale/unavailable tests and responsive checks passed. See the [runbook](nba-live-runbook.md).

These checks do **not** cover independently refreshed results, player stats,
injuries, bookmaker prices, media ingestion, production auth or hosted capacity.

## Every page: current status

The routes below were reconciled against [App.tsx](../../src/app/App.tsx).

| Page ID | Page / route | Current state | What still needs real data or a finished service |
| --- | --- | --- | --- |
| P01 | Landing `/` | MOCK + STATIC + PLACEHOLDER | Hero/research examples and numerical claims; approved launch copy and destinations. Pricing is a static prelaunch comparison, not checkout |
| P02 | Bonuses / Promos `/bonuses` | STATIC CONFIG + UNVERIFIED | Kalshi offer is a hardcoded object; affiliate URL can activate its link. Partner verification, terms, expiry and tracking are not proved by that flag |
| P03 | Props `/dashboard/props` | MOCK + LOCAL ACTION | Player/event rows, exact offers, prices, movement, hit rates, projection, confidence and EV all need real inputs |
| P04 | +EV `/dashboard/ev` | MOCK CALCULATIONS | Formula display works on demo probabilities/prices; no accepted production model or connected offers |
| P05 | Builder `/dashboard/builder` | LOCAL ACTION + MOCK | Selections persist in browser; underlying offers remain fixtures. No sportsbook execution or authenticated synchronization |
| P06 | Discrepancies `/dashboard/discrepancies` | MOCK | Book comparisons, min/max lines, gaps and ranking use fixture props |
| P07 | Players `/dashboard/players` | MOCK | Directory, teams, roles, next opponents and research summaries use fixed player data |
| P08 | Player detail `/dashboard/players/:playerId` | MOCK | `mockPlayerResearchAdapter` generates history, supporting stats, context, injuries, rankings, line movement and projections |
| P09 | Trends `/dashboard/trends` | MOCK CALCULATIONS | Ranked rates/streaks/gaps come from fixed props |
| P10 | Matchups `/dashboard/matchups` | MIXED | NBA/All: REAL — LOCAL schedule. Other sports: MOCK. Scores/live clocks are omitted from connected NBA view |
| P11 | Game detail `/dashboard/matchups/:gameId` | MIXED | Canonical UUID route: imported NBA schedule if found. Legacy fixture IDs: demo game research. NBA boxes/props/results not separately connected |
| P12 | Saved `/dashboard/saved` | MIXED + LOCAL ACTION | NBA event bookmarks resolve against the real schedule; props/players and legacy games remain demo-backed. Saves are browser-local |
| P13 | Popular `/dashboard/popular` | MOCK + LOCAL ACTION | Popularity, activity and consensus are generated fixture events; personal local selections are not a real community dataset |
| P14 | Profile `/dashboard/profile` | LOCAL ACTION + MOCK | Editable profile/preferences are browser-only. Default identity, plan, billing status, renewal and account activity are demo-derived |
| P15 | Calculators `/dashboard/calculators` | PLACEHOLDER | Coming-soon screen; calculator modules are not implemented here |
| P16 | Guides `/dashboard/guides` | PLACEHOLDER | Coming-soon screen; distinct from the implemented static Help page |
| P17 | Help `/dashboard/help` | STATIC | Built-in explanatory content and example metrics; no support-ticket service or knowledge-base backend |

### Redirects, panels and code that are not additional live pages

| Route / surface | Current behavior |
| --- | --- |
| `/dashboard` | Redirects to `/dashboard/props`; inherits mock Props data |
| `/dashboard/projections` | Redirects to Props. `ProjectionsPage.tsx` exists but is not mounted as a separate route |
| `/dashboard/profile?panel=settings` | Local preferences panel on Profile; not a separate account backend |
| Legacy `?panel=subscription` | Resolves into Profile rather than a separate live subscription service |
| Unknown paths `*` | Redirect to `/`; this is navigation behavior, not a data connection |
| Log In link | Opens the dashboard; it is not an authentication flow |
| Log Out control | Navigates home; it does not prove session revocation |
| Landing pricing/features/FAQ/sports anchors | Sections on `/`, not separate routed pages |
| Older `ProductPreview`, `TourPreview`, `StatsStrip`, `Comparison`, `HeroDashboardStack` components | Present in source but not mounted directly by the current LandingPage composition; their fixtures must not be counted as connected product data if reused |

## Page-by-page work checklist

### P01 — Landing page (owner-review work remains paused)

- [ ] **P01.1** Keep hero and workflow examples clearly labeled mock, or intentionally bind a designated preview to real read models.
- [ ] **P01.2** Reconcile sport coverage and feature claims with this tracker; navigation labels do not prove available statistics or props.
- [ ] P01.3 Finalize Tier 1/Tier 2 features and pricing; connect actual signup/checkout when authorized. Current buttons are disabled and prices say To be announced.
- [ ] **P01.4** Finish login/signup entry points and replace placeholder company, contact, social and legal `#top` links with intended destinations.
- [ ] P01.5 Review FAQ refresh/coverage language against enabled dataset policies; keep approved educational copy static where appropriate.

### P02 — Bonuses / Promos

- [ ] **P02.1** Verify partner relationship and approved offer copy; hardcoded CONFIRMED PARTNER text is not verification evidence.
- [ ] **P02.2** Supply verified eligibility, terms URL, actual promo code if applicable and expiry/review date; preserve empty values honestly.
- [ ] **P02.3** Validate the configured outbound claim destination and activation rules; URL presence alone must not certify an offer.
- [ ] **P02.4** Implement any intended promo copying, attribution and click/conversion tracking; no false success states.

### P03 — Props

- [ ] **P03.1** Replace fixture player/event/team rows with canonical directory and schedule data for the selected sport.
- [ ] **P03.2** Connect exact bookmaker, market, period, line, Over/Under price, offer status and source timestamps.
- [ ] **P03.3** Populate averages, L5/L10/L15/season/H2H hits and samples, streaks and chart values from completed stats.
- [ ] **P03.4** Replace simulated line changes and fresh-looking demo clocks with observed offer history.
- [ ] **P03.5** Connect validated projections, confidence and EV; retain gated/unavailable states until each dependency exists.
- [ ] **P03.6** Verify actual main/alternate/Goblin/Devil classification and book-specific selection behavior; migrate filters, saves and Builder actions to canonical records.

### P04 — +EV

- [ ] **P04.1** Feed calculations accepted probabilities and the exact currently observed offered price.
- [ ] **P04.2** Validate probability calibration, fair odds, edge/EV, sample coverage and formula/model version on historical holdouts and subsequent observations.
- [ ] **P04.3** Gate stale/unsupported inputs and enforce paid visibility from server-verified entitlement, not the demo-tier header.

### P05 — Builder and persistent Builder rail

- [ ] **P05.1** Resolve selections against canonical live-backed offers; preserve selected line/book/side/price and detect later changes.
- [ ] **P05.2** Verify stake, payout/profit and provider-specific rules; retain mixed-provider research boundaries.
- [ ] **P05.3** Add authenticated save/restore across devices; local storage alone does not complete this item.
- [ ] **P05.4** Expire or flag unavailable/stale offers and completed games without silently replacing the user's selection.

### P06 — Discrepancies

- [ ] **P06.1** Compare mapped offers from verified books for the same player, event, market, period and settlement definition.
- [ ] **P06.2** Compute min/max, gap and best prices from coherent timestamps; exclude stale/unavailable offers.
- [ ] **P06.3** Verify sorting, filters and navigation against accepted data rather than fixed sample rows.

### P07 — Players

- [ ] **P07.1** Ingest player identity/profile and dated team memberships; establish actual active-roster coverage.
- [ ] **P07.2** Derive next opponents and times from the selected competition's real schedule.
- [ ] **P07.3** Connect player summary statistics and market availability; do not reuse mock summary values beside real names.
- [ ] **P07.4** Complete managed media mapping/fallbacks and canonical player navigation/search.

### P08 — Player detail and research tabs

- [ ] **P08.1** Replace `mockPlayerResearchAdapter` with an Arena API adapter; validate real player identity and event context.
- [ ] **P08.2** Ingest completed game logs: date, opponent, home/away, minutes, participation, stat values and corrections.
- [ ] **P08.3** Support each enabled stat/combination and period honestly; never split full-game stats into fictional quarter/half values.
- [ ] **P08.4** Connect offer strip, book selection, historical lines and movement. Label observed history rather than inventing opening/closing prices.
- [ ] **P08.5** Recalculate chart bars, averages, hit rates and streaks for the selected filters/line with explicit sample and DNP/push rules.
- [ ] **P08.6** Connect actual injuries, confirmed/projected availability, depth chart and expected-role inputs.
- [ ] **P08.7** Connect opponent defense, season aggregates, rankings, similar-player comparisons and win probability with documented calculations.
- [ ] **P08.8** Verify sport-specific modules: shooting locations; football opportunity; baseball pitches/lineup/weather; hockey roles; soccer lineups/form; tennis surface/H2H; esports map/roster/patch context. Keep unsupported modules unavailable.
- [ ] **P08.9** Show independent stats/odds/availability timestamps and missing states; retire fixture fallbacks only for verified capabilities.

### P09 — Trends

- [ ] **P09.1** Derive L5/L10 leaders and Over/Under streaks from real eligible final-game samples.
- [ ] **P09.2** Derive projection gaps only from accepted models and exact lines.
- [ ] **P09.3** Rebuild ranks after changed inputs and corrections; show coverage and avoid rankings over an undisclosed partial population.

### P10 — Matchups

- [x] **P10.1 — NBA only:** show all imported schedule games with dates, Arizona times and source age; B01–B07 evidence applies.
- [ ] **P10.2** Connect the other 11 sport schedules and define an honest multi-sport All view.
- [ ] **P10.3** Add independently refreshed final results/status if desired; weekly schedule observations are not live results.
- [ ] **P10.4** Connect event-level book/prop/player counts, matchup markets and any new context modules from real datasets.
- [x] **P10.5 — NBA local bookmarks only:** canonical events save, resolve on Saved and open the same game detail; unavailable records retain their bookmark. Authenticated persistence remains P12.1.

### P11 — Game detail

- [x] **P11.1 — NBA schedule only:** canonical route displays the selected imported game and its saved schedule/status.
- [ ] **P11.2** Replace legacy fixture game detail for every enabled sport.
- [ ] **P11.3** Connect participating players, game props, game-level odds, final scores and supporting stats separately.
- [ ] **P11.4** Verify postponed/canceled/missing games and stale market handling; preserve stable event identity.

### P12 — Saved

- [ ] **P12.1** Persist user-owned saves through an authenticated backend with access control.
- [ ] **P12.2** Resolve saved canonical players, props and events through real read models, including the imported NBA schedule.
- [ ] **P12.3** Distinguish saved-time selection from current data; show retired/missing records without silently dropping saved intent.

### P13 — Popular

- [ ] **P13.1** Capture actual permitted save/view/Builder/side-selection events with authenticated identity and deduplication.
- [ ] **P13.2** Replace `fixturePopularity` with aggregate counts, score and ranking computed from those events.
- [ ] **P13.3** Show real Over/Under sample sizes and percentages; no sample is not fabricated 50/50 consensus.
- [ ] **P13.4** Join popularity results to real offers/statistics and enforce aggregate freshness/abuse controls.

### P14 — Profile, settings and subscription panel

- [ ] **P14.1** Replace default Jordan Davis/example identity with the authenticated user's profile.
- [ ] **P14.2** Persist profile, sport/book preferences and display settings across devices; migrate existing local values intentionally.
- [ ] **P14.3** Replace the hardcoded Premium/$19/Active/renewal display with authoritative billing/entitlement facts.
- [ ] **P14.4** Connect Manage billing and actual subscription status changes; demo access flags are not authentication.
- [ ] **P14.5** Source activity/usage metrics from actual account events and define real login/logout/session behavior.

### P15 — Calculators

- [ ] **P15.1** Implement the intended calculator modules and verify formulas with representative inputs.
- [ ] **P15.2** Label user-entered versus imported prices/probabilities and their timestamps; manual-input tools can work without provider integration.

### P16 — Guides

- [ ] **P16.1** Replace the coming-soon screen with approved guides and working navigation.
- [ ] **P16.2** Keep examples labeled and align instructions with actual supported markets, data freshness and account capabilities.

### P17 — Help

- [ ] **P17.1** Review static instructions and example metrics against completed product behavior; no sports API needed for explanatory text.
- [ ] **P17.2** Finish any promised contact/support destinations or ticket workflow; distinguish static Help from live support.

## Shared surfaces and infrastructure

- [ ] **S01 — Global search:** replace fixed PLAYERS/PROPS search with canonical, access-filtered results. Search must not cause upstream provider calls.
- [ ] **S02 — Player drawer:** replace fixed player/prop lookup, chart, rates and book comparison; match the connected detail screen's data generation.
- [ ] **S03 — Avatars, headshots and badges:** replace hardcoded NBA CDN/TheSportsDB fixture maps with verified canonical media records, managed delivery, attribution/revision rules and fallbacks. Existing pictures are real assets, not proof of a synced player roster.
- [ ] **S04 — Notifications:** connect actual events, read/unread state and user preferences; current shell controls do not prove a notification service.
- [ ] **S05 — Discord:** implement account linking/role sync when wanted. Current Connect Discord changes to Coming soon; dismissals are session-local.
- [ ] **S06 — Navigation/reference lists:** reconcile books, markets and competition capabilities with connected coverage. Product names/icons may remain approved static configuration.
- [ ] **S07 — API fixture removal:** migrate `/api/v1/props`, `/api/v1/props/:propId`, `/api/v1/players/:playerId/research` and reference metadata. An HTTP endpoint returning fixtures is still mock.
- [ ] **S08 — Dataset refresh jobs:** implement separate stats, results, availability, odds, history, media and calculation policies; key presence alone does not complete a job.
- [ ] **S09 — Supabase account security:** authenticated user tables, authorization and tested private-data isolation. Existing schedule-table denials are a narrower completed baseline.
- [ ] **S10 — Hosted operation:** migrate to hosted Supabase/services with secrets, operational monitoring, backups, recovery and approved object storage; local import success is not hosted deployment.
- [ ] **S11 — Capacity:** measure the intended 5,000-user workload and provider-credit budgets; do not mark this from a cache unit test.
- [ ] **S12 — Rating validation:** sport/market-specific training cutoffs, holdouts, calibration and observation period; model code on fixture inputs does not establish an edge.

## Sport rollout checklist

Each sport uses the same acceptance template below. A real NBA schedule never
checks a player-stat, odds or other-sport task automatically. The table is a
status summary; the following list is the cross-sport completion checklist.

| Sport | Schedule | Player/team stats + context | Odds/history | Managed media | Validated ratings |
| --- | --- | --- | --- | --- | --- |
| NBA | REAL — LOCAL | MOCK / unconnected | MOCK / unconnected | Fixed asset maps | MOCK / unvalidated |
| NFL | MOCK | MOCK | MOCK | Fixed/fallback | MOCK / unvalidated |
| MLB | MOCK | MOCK | MOCK | Fixed/fallback | MOCK / unvalidated |
| NHL | MOCK | Limited demo shell / unavailable modules | MOCK | Fixed/fallback | Unvalidated |
| WNBA | MOCK | MOCK | MOCK | Fixed/fallback | MOCK / unvalidated |
| NCAAB | MOCK | MOCK | MOCK | Fixed/fallback | MOCK / unvalidated |
| NCAAF | MOCK | MOCK | MOCK | Fixed/fallback | MOCK / unvalidated |
| SOCCER | MOCK | MOCK | MOCK | Fixed/fallback | MOCK / unvalidated |
| TENNIS | MOCK | MOCK | MOCK | Fixed/fallback | MOCK / unvalidated |
| LOL | MOCK | MOCK | MOCK | Fixed/fallback | MOCK / unvalidated |
| CS2 | MOCK | MOCK | MOCK | Fixed/fallback | MOCK / unvalidated |
| VALORANT | MOCK | MOCK | MOCK | Fixed/fallback | MOCK / unvalidated |

- [ ] **SPORT-NBA:** complete outstanding P03–P13 and relevant shared tasks for NBA; retain B01–B07 as schedule evidence.
- [ ] **SPORT-NFL:** verify exact leagues/markets/history, then connect schedule, directory, stats, availability, offers, media and accepted ratings to every affected page.
- [ ] **SPORT-MLB:** same workflow, with pitcher/batting-order and weather/pitch-data coverage explicit.
- [ ] **SPORT-NHL:** finalize supported hockey modules, then verify complete data paths; shell placeholders do not count as coverage.
- [ ] **SPORT-WNBA:** repeat provider/market proof independently of NBA.
- [ ] **SPORT-NCAAB:** define men's competition coverage, history and roster/market availability independently of professional basketball.
- [ ] **SPORT-NCAAF:** define college competition and stat/market coverage independently of NFL.
- [ ] **SPORT-SOCCER:** name the supported competitions; a Soccer tab is not worldwide coverage.
- [ ] **SPORT-TENNIS:** name tours and singles/doubles scope; validate surface, set and retirement rules.
- [ ] **SPORT-LOL:** name competitions, map/series scope, roster/patch windows and available prop sources.
- [ ] **SPORT-CS2:** name competitions, map/round scope and available prop sources.
- [ ] **SPORT-VALORANT:** name competitions, map/series scope and available prop sources.

For each sport copy this record into the completion log, checking each stage
separately: source/access -> canonical mapping -> bootstrap/history -> scheduled
updates/corrections -> API -> page/module connection -> freshness/missing states
-> media -> calculation validation -> cross-page acceptance. Do not overwrite
another sport's record.

## Field-level inventory

The 113 existing requirement IDs are preserved below so no underlying field is
lost between pages. Their detailed definitions are in
[frontend-data-requirements.md](frontend-data-requirements.md), and their refresh
policies are in [nba-data-refresh-plan.md](nba-data-refresh-plan.md).

This field table is the **current baseline**, not a second completion percentage.
Use the named page/shared checklists above and record the sport when converting
a field. Partial NBA connection does not mean global coverage. Later paid-plan
pregame timing recommendations remain proposals; only the weekly NBA schedule
policy is implemented today.

| Requirement | Field / record | Current baseline | Related checklist | Free-phase feasibility |
| --- | --- | --- | --- | --- |
| IDN-001 | Sport family ID, key and display name | STATIC CONFIG: supported navigation names/keys; does not establish feed coverage. | S06 | F8 configuration |
| IDN-002 | Competition/league ID, key, name and sport | MIXED: NBA schedule competition connected; other competition lists/configuration do not prove ingestion. | P10.2, S06 | F1/F7; competition scope required |
| IDN-003 | Competition logo/mark | STATIC ASSETS: fixed badge URLs; managed source/revision coverage unverified. | S03 | F3 selected assets |
| IDN-004 | Season ID, name, start/end and current flag | PARTIAL: NBA listing window configured; full canonical season/history metadata is not connected across pages. | P03.1, P08.2, S07 | F1/F7 partial metadata; inspect fields |
| IDN-005 | Team ID, name, short name and abbreviations | MIXED: NBA schedule team identities real; research/player pages still use fixtures. | P03.1, P07.1, P10.2 | F2 |
| IDN-006 | Team colors and locale/location | STATIC / UNCONNECTED: fixture styling; complete sourced colors/location record not connected. | S03, P07.1 | F2/F3 partial supplied fields |
| IDN-007 | Team logo variants | STATIC ASSETS: fixed team logo mapping; no verified managed feed. | S03 | F3 selected assets |
| IDN-008 | Player ID, legal/display name and handle | MOCK: fixture player/profile identity; accepted roster/profile feed not connected. | P07.1, P08.1 | F2 |
| IDN-009 | Position/role and role vocabulary | MOCK: fixture player/profile identity; accepted roster/profile feed not connected. | P07.1, P08.1 | F2 supplied role only; no depth inference |
| IDN-010 | Jersey number, handedness and active status | MOCK: fixture player/profile identity; accepted roster/profile feed not connected. | P07.1, P08.1 | F2 partial profile; F7 active-status exceptions |
| IDN-011 | Player headshot/avatar | STATIC ASSETS: real image URLs mapped to fixture players; no complete synchronized roster/media workflow. | P07.4, S03 | F3 selected assets |
| IDN-012 | Venue ID, name, location and timezone | UNCONNECTED: venue identity/timezone feed absent; Arizona display formatting is application configuration. | P11.3, P08.8 | F3 lookup candidate; verify venue fields |
| IDN-013 | External provider IDs for every identity | MIXED: NBA team/event crosswalks stored; player/market and remaining sport mappings open. | B02, S07, SPORT-NBA | F8 mappings for accepted F1-F4/F7 facts |
| IDN-014 | Media source, checksum, dimensions and rights expiry | PARTIAL FOUNDATION: media importer/schema exists; active end-to-end metadata and rights workflow unverified. | S03 | F8 rights/metadata ledger plus F3 verification |
| IDN-015 | Sport icon/mark | STATIC CONFIG / ASSETS: navigation icons exist; approval/revision checks remain separate. | S03, S06 | F8 owned configuration or F3 approved mark |
| EVT-001 | Event/game/match/series ID and competition | MIXED: canonical NBA schedule events real; prop/research and other-sport events remain fixtures. | B02, P03.1, P10.2, P11.2 | F1; limited odds-event alternative |
| EVT-002 | UTC start time and source timezone | MIXED: imported NBA starts formatted in Arizona time; other surfaces use demo event times. | P10.1, P03.1, P07.2 | F1; preserve timezone provenance |
| EVT-003 | Event status and status timestamp | MIXED: NBA status as of weekly import with dataset observation time; independent result/status updates absent. | P10.3, P11.4, S08 | F1/F6; no live guarantee |
| EVT-004 | Participants and home/away/order | MIXED: real NBA home/away participants on schedule; other contexts still fixtures. | P10.1, P03.1, P11.2 | F1 |
| EVT-005 | Venue and neutral-site flag | UNCONNECTED: verified venue/neutral-site metadata not delivered by connected schedule UI. | P11.3 | F1/F3 only when explicitly supplied |
| EVT-006 | Season, week, round, stage and tournament | PARTIAL: NBA season listing window configured; full week/round/stage taxonomy not connected. | P11.2, S07 | F1/F7 partial metadata; inspect fields |
| EVT-007 | Current score and participant result | PARTIAL STORAGE: NBA import can retain provider scores; connected schedule omits scores and lacks a separate results job. | P10.3, P11.3, S08 | F6 in eligible competitions |
| EVT-008 | Segment hierarchy and status | PARTIAL / MOCK: NBA provider status/period facts are not a complete segment model or connected research feed. | P08.3, P11.3, S08 | F6 only where schema supplies it; full model unproved |
| EVT-009 | Segment scores/results | UNCONNECTED: verified segment scores/results not connected to research pages. | P08.3, P11.3 | F6 only if explicitly supplied; no score splitting |
| EVT-010 | Event final/correction timestamp | UNCONNECTED: import timestamps are not a verified final/correction lifecycle. | P10.3, P11.4, S08 | F8 observation/revision tracking over F6; source finality unproved |
| EVT-011 | Best-of, LAN/online and tournament tier | MOCK / UNCONNECTED: sport-specific event metadata not backed by an accepted connected feed. | P08.8, P11.2 | F7 tournament metadata only; full match context blocked |
| EVT-012 | Tour, tournament round and court surface | MOCK / UNCONNECTED: sport-specific event metadata not backed by an accepted connected feed. | P08.8, P11.2 | F7 tournament reference only; match round blocked |
| EVT-013 | Event city/country and local date | PARTIAL: real NBA start enables Arizona calendar date; sourced event city/country/local timezone remains open. | P10.1, P11.3 | F1/F3/F7 partial fields; timezone needs proof |
| EVT-014 | Props/player/books counts for event | MOCK: fixture prop/player/book counts; the real NBA schedule row count is a different measure. | P10.4 | F8 counts of accepted F2/F4 sample only |
| RST-001 | Current and historical team membership | MOCK / UNCONNECTED: roster, role and availability displays use generated/static research; no accepted refresh job. | P07.1, P08.6, P08.8, S08 | F2 current supplied association; F7 rosters; past history unproved |
| RST-002 | Roster status and effective dates | MOCK / UNCONNECTED: roster, role and availability displays use generated/static research; no accepted refresh job. | P07.1, P08.6, P08.8, S08 | F7 exceptions; effective-date history unproved |
| RST-003 | Event active/inactive/eligible list | MOCK / UNCONNECTED: roster, role and availability displays use generated/static research; no accepted refresh job. | P07.1, P08.6, P08.8, S08 | F9; active directory is not event eligibility |
| RST-004 | Starter/bench/depth-chart slot | MOCK / UNCONNECTED: roster, role and availability displays use generated/static research; no accepted refresh job. | P07.1, P08.6, P08.8, S08 | F9 |
| RST-005 | Projected versus confirmed lineup flag | MOCK / UNCONNECTED: roster, role and availability displays use generated/static research; no accepted refresh job. | P07.1, P08.6, P08.8, S08 | F9 |
| RST-006 | Batting order and starting pitcher | MOCK / UNCONNECTED: roster, role and availability displays use generated/static research; no accepted refresh job. | P07.1, P08.6, P08.8, S08 | F9 |
| RST-007 | Soccer formation and positional slot | MOCK / UNCONNECTED: roster, role and availability displays use generated/static research; no accepted refresh job. | P07.1, P08.6, P08.8, S08 | F9; F7 roster does not prove formation |
| RST-008 | Esports roster, role and substitution | MOCK / UNCONNECTED: roster, role and availability displays use generated/static research; no accepted refresh job. | P07.1, P08.6, P08.8, S08 | F2 basic team association only; substitutions F9 |
| RST-009 | Injury/availability status and reason | MOCK / UNCONNECTED: roster, role and availability displays use generated/static research; no accepted refresh job. | P07.1, P08.6, P08.8, S08 | F9 |
| RST-010 | Injury report/source timestamp and note | MOCK / UNCONNECTED: roster, role and availability displays use generated/static research; no accepted refresh job. | P07.1, P08.6, P08.8, S08 | F9 |
| RST-011 | Expected return/status confidence | MOCK / UNCONNECTED: roster, role and availability displays use generated/static research; no accepted refresh job. | P07.1, P08.6, P08.8, S08 | F9 |
| STA-001 | Player event participation state | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-002 | Player event stat value by canonical stat | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-003 | Team event stat value by canonical stat | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F6 scores only; complete team stat contract F9 |
| STA-004 | Player/team segment-level stat values | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-005 | Minutes/time played and starter state | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-006 | Stat correction version and source time | UNCONNECTED: independent stats correction/version pipeline not enabled. | P08.2, S08 | F8 revision infrastructure now; stat inputs F9 |
| STA-007 | Player season aggregate | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-008 | Team season aggregate/record | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F6 derived record / F7 standings; full stat aggregates F9 |
| STA-009 | Basketball full-game and quarter/half box stats | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-010 | Basketball shot-location events/zones | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-011 | Football passing/rushing/receiving/kicking stats | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-012 | Football targets, touches and opportunity shares | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-013 | Baseball hitting and pitching box stats | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-014 | Baseball pitch type, velocity, outcome and whiff | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-015 | Hockey skater/goalie and period stats | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-016 | Soccer player/team match stats | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-017 | Tennis match/set player stats | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-018 | LoL series/map player stats and champion usage | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-019 | CS2 series/map/round stats and map vetoes | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-020 | Valorant series/map player stats and agent usage | MOCK / UNCONNECTED: displayed research stats are fixtures; supported stat coverage and completed-stat ingestion remain open. | P08.2, P08.3, P08.8, S08 | F9 performance feed; no accepted complete free path |
| STA-021 | Live score, clock and period | DEFERRED: connected NBA screen omits live score/clock; user requested pregame and periodic data. | P10.3, S08 | Deferred by product; F6 results separately |
| STA-022 | Play-by-play events | DEFERRED / UNCONNECTED: no play-by-play feed or active requirement for live polling. | P08.8, S08 | Deferred / F9 |
| CTX-001 | Standings/division/conference snapshot | MOCK / UNCONNECTED: context displayed by research adapters is fixed/generated; missing sport modules remain unsupported. | P08.7, P08.8 | F7 named competitions; F6 basic records, not official tiebreak standings |
| CTX-002 | Player/team/esports ranking and source | MOCK / UNCONNECTED: context displayed by research adapters is fixed/generated; missing sport modules remain unsupported. | P08.7, P08.8 | F7 ATP/WTA ranking exception; other ranks unproved |
| CTX-003 | Venue weather forecast/observed weather | MOCK / UNCONNECTED: context displayed by research adapters is fixed/generated; missing sport modules remain unsupported. | P08.7, P08.8 | F9 / separate weather source needed |
| CTX-004 | Matchup win probability | MOCK / UNCONNECTED: context displayed by research adapters is fixed/generated; missing sport modules remain unsupported. | P08.7, P08.8 | F4 market-implied value only; model probability F9 |
| CTX-005 | Opponent allowed/rank by market/stat | MOCK / UNCONNECTED: context displayed by research adapters is fixed/generated; missing sport modules remain unsupported. | P08.7, P08.8 | F9; basic scores do not prove defense by player market |
| CTX-006 | Similar-player cohort and comparison | MOCK / UNCONNECTED: context displayed by research adapters is fixed/generated; missing sport modules remain unsupported. | P08.7, P08.8 | F9 |
| CTX-007 | Team/player recent form | MOCK / UNCONNECTED: context displayed by research adapters is fixed/generated; missing sport modules remain unsupported. | P08.7, P08.8 | F6 team results form; player form F9 |
| CTX-008 | Tennis head-to-head meetings and surface splits | MOCK / UNCONNECTED: context displayed by research adapters is fixed/generated; missing sport modules remain unsupported. | P08.7, P08.8 | F9 |
| CTX-009 | Baseball pitch-arsenal aggregates | MOCK / UNCONNECTED: context displayed by research adapters is fixed/generated; missing sport modules remain unsupported. | P08.7, P08.8 | F9 |
| CTX-010 | Esports map pool, pick/ban rates and favorites | MOCK / UNCONNECTED: context displayed by research adapters is fixed/generated; missing sport modules remain unsupported. | P08.7, P08.8 | F7 reference maps only; pick/ban/favorite statistics F9 |
| CTX-011 | Consensus/provider event odds | MOCK / UNCONNECTED: context displayed by research adapters is fixed/generated; missing sport modules remain unsupported. | P08.7, P08.8 | F4 sample plus F8 calculation; identify exact input books |
| ODD-001 | Sportsbook ID, name, abbreviation and region | STATIC CONFIG: book catalog exists; supported region/product coverage requires verification. | S06, P03.2 | F8 accepted book mapping over F4; region eligibility unproved |
| ODD-002 | Sportsbook logo | STATIC ASSETS: configured book marks; managed revisions and accepted use not proven by display. | S03, S06 | F8 approved assets; logo feed not assumed |
| ODD-003 | Canonical prop market ID and taxonomy | STATIC CONFIG: market vocabulary exists; actual sport/book/period coverage remains unverified. | S06, P03.6 | F8 taxonomy; F4 available subset |
| ODD-004 | Provider market ID/label mapping | PARTIAL FOUNDATION: adapter/mapping code is not evidence of a connected accepted offers dataset. | S07, P03.2, P06.1 | F8 verified mappings over F4 |
| ODD-005 | Prop instance: event, player, market and period | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F4 verified canonical sample |
| ODD-006 | Current line/handicap per sportsbook | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F4 |
| ODD-007 | Current Over American odds | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F4 |
| ODD-008 | Current Under American odds | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F4 |
| ODD-009 | Offer status/suspension and source timestamps | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F4 timestamp; suspension semantics need proof |
| ODD-010 | Main/alternate market marker | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F4 mapped market variant; do not infer vendor labels |
| ODD-011 | Every changed line/price/status observation | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F5 partial observations; every-change requirement not achievable |
| ODD-012 | Opening line and price | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F5 first observed only; true historical opening blocked |
| ODD-013 | Closing line and price | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F5 last observed only; true historical closing blocked |
| ODD-014 | Minimum/maximum line and providers | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F4/F8 within accepted sample |
| ODD-015 | Best Over/Under price at same line | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F4/F8 same-line sample only |
| ODD-016 | Line movement, velocity and time at line | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F5 observed changes only; exact duration/velocity unproved |
| ODD-017 | Game moneyline, spread and total offers | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F4 event-market sample; separate storage needed |
| ODD-018 | Prop result/settlement/push/void | MOCK / UNCONNECTED: fixture/simulated offers and history; no accepted observed odds pipeline. | P03.2, P03.4, P06.1, P08.4, S08 | F9 player settlement; F6 alone supplies only game results |
| ODD-019 | Jurisdiction/market availability | UNVERIFIED CONFIG: no authoritative connected jurisdiction/market availability feed. | S06, P03.6 | F8 verified business rules; region parameter is not user eligibility |
| CAL-001 | Average for selected sample/filter | MOCK INPUTS: displayed/derived metrics use fixture samples; real stat samples and calculation validation needed. | P03.3, P08.5, P09.1, S12 | F9 player stat samples; F8 calculation code can be built |
| CAL-002 | L5 hit count/rate | MOCK INPUTS: displayed/derived metrics use fixture samples; real stat samples and calculation validation needed. | P03.3, P08.5, P09.1, S12 | F9 player stat samples; F8 calculation code can be built |
| CAL-003 | L10 hit count/rate | MOCK INPUTS: displayed/derived metrics use fixture samples; real stat samples and calculation validation needed. | P03.3, P08.5, P09.1, S12 | F9 player stat samples; F8 calculation code can be built |
| CAL-004 | L15 hit count/rate | MOCK INPUTS: displayed/derived metrics use fixture samples; real stat samples and calculation validation needed. | P03.3, P08.5, P09.1, S12 | F9 player stat samples; F8 calculation code can be built |
| CAL-005 | Season hit count/rate | MOCK INPUTS: displayed/derived metrics use fixture samples; real stat samples and calculation validation needed. | P03.3, P08.5, P09.1, S12 | F9 player stat samples; F8 calculation code can be built |
| CAL-006 | Opponent H2H hit count/rate | MOCK INPUTS: displayed/derived metrics use fixture samples; real stat samples and calculation validation needed. | P03.3, P08.5, P09.1, S12 | F9 player stat samples; F8 calculation code can be built |
| CAL-007 | Current over/under streak | MOCK INPUTS: displayed/derived metrics use fixture samples; real stat samples and calculation validation needed. | P03.3, P08.5, P09.1, S12 | F9 player stat samples; F8 calculation code can be built |
| CAL-008 | Projection value and model version | MOCK / UNVALIDATED: fixture projections; production model/version not accepted. | P03.5, P04.2, S12 | F9 model input plus F8 model development |
| CAL-009 | Projection minus selected line | MOCK INPUTS: displayed/derived metrics use fixture samples; real stat samples and calculation validation needed. | P03.3, P08.5, P09.1, S12 | F9 projection dependency; line alone F4 |
| CAL-010 | Projection range/confidence/explanation | MOCK / UNVALIDATED: confidence/range/explanation from demo research. | P03.5, P04.2, S12 | F9 plus S12 validation |
| CAL-011 | Metric/model input cutoff and version | UNCONNECTED: no accepted production input cutoff/version chain for ratings. | P04.2, S12 | F8 version/cutoff infrastructure; real input chain F9 |
| CAL-012 | Backtest outcome and cohort | UNCONNECTED: no accepted backtest/cohort evidence; UI examples do not establish model performance. | P04.2, S12 | F8 framework; performance/price history and validation F9 |
| USR-001 | User ID and entitlement/plan | MOCK + LOCAL: browser profile and demo entitlement flags; no authoritative identity/billing service. | P14.1, P14.3, S09 | F8 auth and authoritative entitlements; billing separate |
| USR-002 | Preferred sports, books, timezone and density | LOCAL ACTION / CONFIG: implemented preferences stored in browser; full preference contract not synchronized. | P14.2 | F8 authenticated preferences |
| USR-003 | Saved prop/player/event action | MIXED + LOCAL ACTION: NBA event bookmarks use canonical IDs and the real schedule; other saves remain demo-backed. No authenticated save service. | P12.1, P12.2, P10.5 | F8 canonical saves |
| USR-004 | Pick Builder prop, side and provider | LOCAL ACTION + MOCK INPUTS: browser Builder selections reference fixture offers. | P05.1, P05.3 | F8 persistence over F4 sample |
| USR-005 | Community save action and validity state | MOCK: synthetic community activity/aggregates; personal browser actions are not platform-wide evidence. | P13.1, P13.2, P13.3 | F8 actual user events |
| USR-006 | Community save count | MOCK: synthetic community activity/aggregates; personal browser actions are not platform-wide evidence. | P13.1, P13.2, P13.3 | F8 aggregate actual events |
| USR-007 | Community Over/Under selection counts | MOCK: synthetic community activity/aggregates; personal browser actions are not platform-wide evidence. | P13.1, P13.2, P13.3 | F8 aggregate actual events |
| USR-008 | Community Over/Under percentages | MOCK: synthetic community activity/aggregates; personal browser actions are not platform-wide evidence. | P13.1, P13.2, P13.3 | F8 calculate from actual counts |
| USR-009 | Bot/rate-abuse validity and aggregate version | UNCONNECTED: no production community validation/abuse/version pipeline. | P13.4 | F8 abuse controls and aggregate versions |

## Evidence and update procedure

This audit inspected the routing tree, mounted page components, source imports,
browser-storage code, provider worker/API and current local API responses. It
did not purchase plans, activate new jobs, verify partner relationships or
retest every page's layout. External images loading and mock UI labels are not
substitutes for tracing the actual data source.

| Evidence | Source |
| --- | --- |
| All mounted routes and redirects | [App.tsx](../../src/app/App.tsx) |
| Real versus demo Matchups branches | [MatchupsPage.tsx](../../src/features/dashboard/pages/MatchupsPage.tsx), [LiveMatchups.tsx](../../src/features/dashboard/pages/LiveMatchups.tsx) |
| Connected schedule fetch | [live-schedule.ts](../../src/features/dashboard/live-schedule.ts) |
| Worker and storage | [weekly-schedule.ts](../../server/worker/weekly-schedule.ts), [schedule-store.ts](../../server/worker/schedule-store.ts) |
| API fixtures and schedule route | [app.ts](../../server/api/app.ts), [schedule.ts](../../server/api/schedule.ts) |
| Fixed research inputs | [data.ts](../../src/features/dashboard/data.ts), [props-fixtures.ts](../../src/features/dashboard/props-fixtures.ts), [adapter.ts](../../src/features/dashboard/player-screen/adapter.ts) |
| Simulated changes and community activity | [live-demo.ts](../../src/features/dashboard/live-demo.ts), [popularity.ts](../../src/features/dashboard/popularity.ts) |
| Local saves, Builder state and demo tier | [DashboardProvider.tsx](../../src/features/dashboard/DashboardProvider.tsx) |
| Local identity and subscription preview | [profile.ts](../../src/features/dashboard/profile.ts), [ProfilePage.tsx](../../src/features/dashboard/pages/ProfilePage.tsx) |
| Media fixtures | [media-fixtures.ts](../../src/features/dashboard/media-fixtures.ts) |
| Mounted landing composition / sample content | [LandingPage.tsx](../../src/features/landing/LandingPage.tsx), [ResearchArena.tsx](../../src/features/landing/components/ResearchArena.tsx), [HeroRatingBadge.tsx](../../src/features/landing/components/HeroRatingBadge.tsx) |
| Pricing and footer destinations | [Pricing.tsx](../../src/features/landing/sections/Pricing.tsx), [Footer.tsx](../../src/features/landing/sections/Footer.tsx) |
| Configured promotion object | [BonusesPage.tsx](../../src/features/bonuses/BonusesPage.tsx) |
| Coming-soon tools versus static Help | [ToolsPages.tsx](../../src/features/dashboard/pages/ToolsPages.tsx), [SavedPage.tsx](../../src/features/dashboard/pages/SavedPage.tsx) |

When a feature is converted:

1. Identify checklist ID, field IDs, sport, route and exact book/market/period scope.
2. Record the accepted source and a sanitized sample or delivery reference.
3. Verify storage/replay and the page's actual API use; remove mock fallback for
   that capability without hiding unsupported fields behind fabricated values.
4. Check scheduled refresh, corrections, source timestamps, empty/stale/error
   behavior and any required authenticated persistence.
5. Run focused tests and page-level desktop/mobile review. For ratings, add
   model-validation evidence separately from frontend rendering tests.
6. Change the relevant box to `[x]`, update the page/sport/field status and add a
   dated completion-log entry. Leave mixed pages mixed until remaining items pass.

### Completion log

| Verified date | IDs / scope | Evidence | Remaining limitation |
| --- | --- | --- | --- |
| 2026-09-08 | B01–B07, P10.1, P11.1 / NBA schedule | Local API returned 1,267 games; weekly policy, stable replay, private-table checks and responsive schedule QA documented in runbook | Other datasets, other sports, hosted operation and capacity remain open |

2026-09-08 mapping follow-up: restored the shared matchup row design; verified
P10.5 for local NBA event bookmarks. The focused 19-test suite, build and lint
passed; desktop/mobile/tablet review verified the same event across Matchups,
Saved and detail. Auth, media completeness and coverage counts remain open.

Copy this entry for future conversions:

```text
Verified date:
Checklist IDs and requirement IDs:
Sport / competition / market / book / period scope:
Page / module:
Previous source and new source:
Delivery / canonical IDs / schema or calculation version:
Refresh policy and source timestamp:
Storage, API and visible-page verification:
Missing/stale/correction or auth checks:
Tests / screenshots / supporting artifact:
Remaining limitations:
```
