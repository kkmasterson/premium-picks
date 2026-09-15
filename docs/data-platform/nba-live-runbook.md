# Running the first live NBA path

Implemented on 2026-09-08 in `C:\Picks\PremiumPicks`.

## Scope

BALLDONTLIE NBA games -> typed server adapter -> local Supabase PostgreSQL ->
cached Arena API -> existing Matchups screen and game details. Matchups shows
every imported game in date order, with a visible date on each row. The import window covers September 1 through August 31 of the current NBA season. Regular-season/playoff and preseason queries are both collected.

NBA/All Matchups use this feed. Other sports remain explicitly marked demo.
Player research, player statistics, sportsbook props, headshots and analytics
have not been connected by this slice. The three provider keys are configured,
but this worker consumes only BALLDONTLIE. No production deployment or 5,000-user
capacity claim is made.

## Start after restarting Windows

Open Docker Desktop and wait for the engine. The arena-props-local Docker network has the localhost binding option configured. On this Windows Docker installation, published ports still report all interfaces; do not treat this as verified network isolation or expose/forward these development ports. On a new machine, first create it with: docker network create -o com.docker.network.bridge.host_binding_ipv4=127.0.0.1 arena-props-local. In the app directory run:

```powershell
npx --no-install supabase start --network-id arena-props-local
```

Then run these in three terminals in the app directory:

```powershell
npm run start:api
npm run start:worker
npm run dev -- --host 127.0.0.1 --port 3000 --strictPort
```

Open `http://127.0.0.1:3000/dashboard/matchups`. Stop a foreground process with
Ctrl+C. `npx --no-install supabase stop` stops this project's database services
without requesting a data reset. Do not use `db reset` on this imported database
unless intentionally discarding its local data.

`server/.env.local` holds provider keys and the local `DATABASE_URL`. It is ignored
by Git. `npm run check:env` reports only presence, never values. Supabase API URL
and service-role key are not required by the direct PostgreSQL adapter. The
provider keys must never use a `VITE_` prefix.

## Import and serving behavior

- `npm run start:worker -- --once` checks persisted eligibility and imports only
  when due. Bootstrap runs immediately; subsequent checks are Monday 04:00 Arizona.
  The continuous process checks the local job record each minute, not the provider.
  `arena_private.dataset_jobs` persists next due/attempt/success and safe errors.
  Provider requests within a sweep are spaced by sixteen seconds. The database
  advisory lock excludes competing workers. Failed/crashed imports wait until
  the next due check; the current schedule worker performs no automatic retry.
  A stopped computer catches up once when the worker is next started.
- A complete, validated sweep is committed atomically. Failed requests, invalid
  schemas and incomplete pagination preserve the last published snapshot.
- Canonical UUIDs persist through provider crosswalks. Repeated input does not
  create duplicate games or deliveries. Provider IDs stay behind the API boundary.
- Sanitized, schema-accepted source records are archived in ignored `server/data/raw`.
  This is local development storage. Cloud archive storage, retention enforcement,
  richer quarantine records and production operations remain follow-up work.
- API reads never call a provider. A ten-second in-process cache coalesces database
  reads. The browser reads once on mount and on manual Reload saved schedule;
  there is no recurring network poll. ETags remain supported by the API.
- A schedule older than eight days is overdue. Database/network failures preserve
  last-known rows where available. Source timestamps do not change on cache reads.
  The contract declares a seven-day import interval and no automatic browser refresh.
  Scores and clocks are omitted. Status is labeled as of the import; changing
  results, player statistics and odds will have independent dataset policies.
- The public UI uses Arizona times. This Vite proxy setup is for local development;
  hosted frontend/API routing and production authentication require separate work.

## Verification

```powershell
npm test
npm run lint
npm run build
node --env-file=server/.env.local --import tsx server/verify-nba.ts
```

The final command requires this local Supabase port and already imported real
records. It replays the accepted payload, checks canonical IDs and row counts,
and verifies that anonymous/authenticated database roles cannot query internal
tables. It retains the original observation time and does not fabricate freshness.

Initial evidence: 25 games imported, 55 entity crosswalks, stable replay with one
delivery, and access denied for browser roles. Provider/freshness tests cover
pagination, schema drift, 429 handling, error redaction, game lifecycle, concurrent
read coalescing, outage fallback and freshness-aware ETags. A cache unit test is
not a production load test.

## Next slices

1. Player/team directory ingestion and verified cross-provider identity mapping.
2. Approved TheSportsDB media and one current sportsbook-odds path with a credit budget.
3. Paid-plan player game statistics, historical odds, and evidence-backed analytics.
4. Hosted Supabase staging, limited database roles, production auth, durable operations,
   archive lifecycle, recovery testing and measured 5,000-session load validation.

The new schedule migration applied successfully on local Supabase PostgreSQL 17.
Keep migrations under `supabase/migrations`; apply the same reviewed schema to
hosted Supabase later, and migrate licensed records separately from schema changes.

Weekly scheduling regression evidence: 94 tests passed across 20 files, lint and build passed. Tests cover Arizona season boundaries, Monday timing, persisted not-due skips, competing workers, failed-attempt reservation, eight-day freshness and absence of browser polling. See [the complete field policy](nba-data-refresh-plan.md) for remaining datasets.

Full-season verification on 2026-09-08: 1,267 imported games across 170 dates (2026-10-03 to 2027-04-11), within the requested 2026-09-01 to 2027-08-31 season window. These are the games currently returned by the provider; unpublished future rounds remain absent. Restart returned not_due for 2026-09-14 04:00 Arizona. Replay preserved 1,267 events, 1,298 crosswalks and two deliveries, with browser-role access denied. The final additional API test checks stale fallback after a failed provider import.
