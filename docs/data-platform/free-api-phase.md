# Free NBA data phase

Implemented September 11, 2026 in the existing routed dashboard. This is a local development proof, not a deployment or a paid provider subscription.

## Visible features

- `/dashboard/matchups`: prepared NBA schedule with canonical event IDs. Score, period, clock and postseason fields reflect the displayed observation time. The expanded sportsbook sample links to its game.
- `/dashboard/matchups/:id`: a game's stored sportsbook prices, selected player props, implied and paired no-vig probabilities, same-selection best prices, consensus and disagreement. Recent observations expire after 15 minutes. The history panel shows actual stored observations and detected changes, never an invented opening or closing line.
- `/dashboard/players`: the established research table, portraits, filters and player-workspace navigation are preserved. Its sample team assignments, matchups and prop counts are explicitly labeled demo data. The imported directory remains available through the backend, but does not replace the product page: incomplete or historical identities must first map reliably into the existing presentation. Verified artwork and home venue metadata remain available for enrichment; home venue is not a guarantee of the event's venue.
- Fixture research elsewhere remains explicitly labeled; no live L5/L10/L15, projections, confidence or true EV is claimed.

## Server-only operation

Run commands from the repository root. Private values belong only in ignored `server/.env.local`; the example contains no credentials.

```powershell
npm run data:migrate
npm run data:free -- directory
npm run data:free -- artwork
npm run data:free -- schedule
npm run data:free -- scores
npm run data:free -- odds
npm run start:api
npm run start:worker
```

`data:migrate` uses Supabase's local migration runner and records migration history. Normal hosted deployment must apply all versioned Supabase migrations. `repair-identity` is an idempotent offline reconciliation for directories imported with the earlier name-based team uniqueness constraint; it uses archived IDs and requires a complete import. No raw provider IDs are sent in public contracts.

The worker checks persisted eligibility once a minute. Weekly season imports remain separate from recent-score checks (five minutes near scheduled games, daily otherwise). The directory refreshes monthly and resumes unfinished pages. Artwork is checked daily, with team lookups cached for 30 days. API/browser reads never call providers. The worker runs only while its process is running; this is not an installed Windows startup service.

## Credit and freshness policy

The default odds proof requests **one verified NBA event**, one US region, and moneyline, spread, total and player points. It reserves four credits before the request. At most one attempt is allowed per six hours, persisted across restarts and protected by a database advisory lock. The default local cap is 100 credits per calendar month, hard-clamped to 450; the current provider remaining-credit header must also leave ten credits in reserve. A missing/invalid header stops collection. The local calendar cap does not assume the provider's billing-cycle reset. Failed requests conservatively retain their reservations.

`ARENA_ODDS_EVENT_ID` optionally pins a canonical event UUID. Otherwise the next future event with exact, unique home/away team names and tipoff match is selected. Unmatched events stay private. `ARENA_ODDS_MARKETS` allows up to six supported market keys, including rebounds, assists, threes, points/rebounds/assists combinations and selected alternate markets. This allows targeted experiments; it does not establish coverage for every market. Only the default four markets were probed live.

Best-price groups require the same market, player label/selection, side and line. No-vig requires a complete opposing pair at the same book and line (opposite signs for spreads). Three-way or incomplete pairs have no no-vig value. Consensus is the mean of eligible book no-vig probabilities; disagreement is the range in percentage points. Stale/future-dated books are excluded at collection. These are market calculations, not calibrated win probabilities or EV.

The 15-minute freshness threshold deliberately differs from the six-hour collection interval: the free proof spends most of its time displaying clearly stale observations. The history panel returns the latest 30 snapshots for a game; the private database retains all collected observations. Alerts represent observed line changes, improved best prices and disappearance between comparable collections, not guaranteed continuous monitoring or push notifications.

## Media and terms

Team matching requires exact full name (with an explicit Clippers alias), NBA league and abbreviation. Player matching requires exact identity (including an explicit Jokic spelling alias), verified team association, basketball sport and affirmative Creative Commons metadata from the full player lookup. Ambiguous identities and unverified rights are withheld. Artwork hosts are allowlisted. The free artwork proof is served only outside `NODE_ENV=production`; production rights need their own review. Attribution is displayed, logos are unmodified, and failed images show initials.

- [BALLDONTLIE NBA access and rate limits](https://docs.balldontlie.io/): free teams, players, games; five requests/minute. NBA requests are spaced 16 seconds apart.
- [The Odds API current endpoint and quota rules](https://the-odds-api.com/liveapi/guides/v4/): event discovery is quota-free; current event odds cost by market/region. No historical endpoint is called.
- [The Odds API terms](https://the-odds-api.com/terms-and-conditions.html), checked September 11, 2026: explicitly permit indefinite retention and derived values in user-facing applications; prohibit raw data feed resale.
- [TheSportsDB documentation](https://www.thesportsdb.com/documentation) and [terms](https://www.thesportsdb.com/docs_terms_of_use.php): free development artwork, 30 requests/minute, limited list results; third-party rights still apply. Individual lookups are paced at least 2.2 seconds apart.

## Verification

Verified local result on September 11: 1,267 games, 7,397 players, 89 distinct team identities, artwork for 30 current NBA teams and three players, and an NBA league badge. The one-game odds proof returned 42 prices across seven books, including points props for two players; 496 provider credits remained. All 115 tests, lint and production build passed. Browser checks covered 390px, 768px and desktop widths. The build retains existing bundle-size and mixed-import warnings.

`npm test`, `npm run lint`, `npm run build`, and the live local `server/verify-free.ts` script cover calculation rules, safe matching, quota guards, public response validation, unique canonical identities and denied browser-role access to internal tables. The probe script reports only status/counts/remaining credits, never keys. Provider game status cannot be verified as in-play when there are no games in the recent window.

Local rollback: stop the worker/API and retain the database snapshot. The new data tables are private; the frontend returns explicit unavailable states when the prepared feed is absent. Do not reset or delete the existing database to undo this phase.
