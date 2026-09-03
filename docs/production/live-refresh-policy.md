# NBA Dynamic Acquisition and Live Refresh Policy

## Decision status

**Status:** Approved product requirement and reference design on `2026-08-26`.

The NBA reference implementation includes pregame and live game data. During a
live game, Arena Props targets visible sports-data updates every 15–60 seconds
and supported player-prop updates approximately every 60 seconds. The interface
shows when odds were last successfully refreshed.

This is a near-real-time dashboard requirement. Push, email, SMS and device
alerts are separate capabilities and remain deferred.

## Verified provider boundaries

- BALLDONTLIE officially documents `nba.game.started`, `nba.game.ended`,
  `nba.injury.created`, `nba.injury.updated`, `nba.injury.cleared` and granular
  NBA player-stat events. Deliveries may be delayed by up to one minute, so a
  webhook is a priority trigger rather than the only source of truth. Injury
  and granular events require the applicable paid plan. See the
  [BALLDONTLIE webhook documentation](https://www.balldontlie.io/webhooks).
- BALLDONTLIE deliveries are signed and include an immutable webhook ID and
  source timestamp. Receivers verify the HMAC over the exact raw body, enforce
  a replay window and deduplicate before side effects.
- Full injury and granular-stat webhook types and production-scale delivery
  allowances require ALL-ACCESS. The NBA proof uses the NBA-only GOAT API plan,
  so polling/reconciliation is primary and webhook receipt is an optional,
  non-critical upgrade path.
- The Odds API documents an approximately 60-second update interval for player
  props, alternates and period markets. Arena Props therefore does not poll
  that source every 5–30 seconds or claim sub-60-second source freshness. See
  [The Odds API update intervals](https://the-odds-api.com/sports-odds-data/update-intervals.html).

Exact paid-plan limits, licensed retention and production payload fixtures
remain procurement gates.

## Two independent state axes

Do not overload one status field with both sports truth and scheduler behavior.

### Canonical event status

The sports record retains the provider-normalized state:

```text
scheduled | pregame | live | delayed | postponed | cancelled | final
```

### Acquisition state

The scheduler independently assigns an acquisition state:

| State | Normal entry condition | Purpose |
| --- | --- | --- |
| `COLD` | More than 72 hours before scheduled start | Cheap schedule, injury and early-market discovery |
| `WARM` | 24–72 hours before scheduled start | Increase context and market checks |
| `HOT` | 2–24 hours before scheduled start | Progressive event-specific acquisition |
| `PREGAME` | 0–2 hours before start and not live | Critical state, injury, lineup and prop acquisition |
| `LIVE` | Accepted provider state says live, or an enabled trusted start webhook arrives | Polling-first sports updates; optional webhook triggers plus frequent reconciliation |
| `FINALIZING` | Accepted provider state says final, or an enabled trusted end webhook arrives | Immediate full fetch, metric recalculation and correction sweeps |
| `FINAL` | Required finalization sweeps completed or reviewed | Stop hot polling; retain slower correction checks only where required |

The scheduled clock may move an event through `COLD`, `WARM`, `HOT` and
`PREGAME`. It must not mark an event `LIVE` solely because the scheduled start
passed. Accepted provider status makes that transition; an enabled trusted
start webhook may accelerate it. The NBA proof does not require webhook delivery.

Special handling:

- `delayed`: remain in a bounded pregame cadence and re-evaluate provider state.
- `postponed`: recompute from the replacement start time and leave the hot path.
- `cancelled`: stop market execution and run one final reconciliation.
- corrections after `FINAL`: append revisions and trigger targeted recalculation
  without reopening unrelated acquisition work.

## One scheduler, not one cron per game

A single scheduler evaluates active events and independently due data classes.
It does not create custom cron definitions for each game.

```text
time_until_start = scheduled_start_at - now
event_status = accepted canonical sports status
acquisition_state = policy(time_until_start, event_status, finalization state)

for each data class required by this event:
  cadence = policy(acquisition_state, time_until_start, data_class)
  if next_due_at <= now and not leased/backed off:
    atomically claim job
    enqueue idempotent acquisition command
```

One scheduler instance or several cooperating instances may run. Competing
instances claim due work with a lease or an atomic database/queue primitive so
only one logical job is scheduled. Queue delivery remains at least once; every
worker is idempotent.

Each event/data-class/provider combination tracks at least:

```text
event_id
provider_product_id
data_class
acquisition_state
schedule_policy_version
last_attempt_at
last_success_at
next_due_at
lease_until
consecutive_failures
backoff_until
last_error_code
```

Suggested acquisition-command idempotency key:

```text
provider_product_id:event_id:data_class:scheduled_window:policy_version
```

## Data-class cadence policy

Reference data such as team identity and player biography is not placed on the
event hot path. The scheduler creates independent jobs for event metadata,
injuries, lineups, props/odds, game state and live stats.

| Window | Event metadata/state | Injuries | Lineups | Props/odds | Live stats |
| --- | --- | --- | --- | --- | --- |
| 7+ days | 6–12 hours | 6 hours; optional trigger | Off | 4–6 hours if available | Off |
| 3–7 days | 3–6 hours | 3–6 hours; optional trigger | Off | 2–3 hours | Off |
| 24–72 hours | 1–2 hours | 1 hour; optional trigger | Off unless useful/available | 30–60 minutes | Off |
| 6–24 hours | 30 minutes | 30 minutes; optional trigger | Provider-dependent | 10–15 minutes | Off |
| 2–6 hours | 10–15 minutes | 10 minutes; optional trigger | Provider-dependent | 5 minutes | Off |
| 30 minutes–2 hours | 2–5 minutes | 2–5 minutes; optional trigger | 2–5 minutes where supplied | 60 seconds | Off |
| 0–30 minutes | 30–60 seconds | 60 seconds; optional trigger | 60 seconds where supplied | 60 seconds | Off until provider says live |
| Live | 15–30 seconds; optional trigger | Targeted polling; optional trigger | On change/provider-dependent | Approximately 60 seconds if live props are supported | 15–30 seconds polling; optional granular triggers after upgrade |
| Finalizing | Immediate, +5 minutes, +30–60 minutes and optional next-day sweep | On relevant correction | Final accepted snapshot | Capture final eligible pre-lock state; no executable live offer | Immediate full fetch plus correction sweeps |
| Final | Daily/targeted correction policy only | On correction | Off | Off | Off except accepted correction |

The exact interval within a range is chosen by a versioned policy using time to
start, provider rate/credit budget, recent change velocity, last source update,
failure state and whether a webhook just arrived.

All scheduled times receive bounded jitter. Provider-wide token buckets and
credit budgets take precedence over low-priority work. A high-priority webhook
may move a targeted job forward, but it does not create duplicate work when an
equivalent job is already queued or running.

## Optional webhook receiver contract

The receiver is designed and fixture-tested during the NBA proof so a later
upgrade does not require an architectural rewrite. It is not an availability
dependency while Arena Props uses NBA-only GOAT. Scheduler polling must satisfy
all state transitions and freshness objectives without it.

All BALLDONTLIE webhook types use the same secure ingress sequence:

```text
receive exact raw body and required headers
  -> verify HMAC-SHA256 with constant-time comparison
  -> reject timestamps outside the replay window
  -> persist receipt under unique X-BDL-Webhook-Id
  -> enqueue a durable typed command
  -> return 2xx after durable handoff
  -> process provider reconciliation asynchronously
```

Heavy API fetches, calculations and cache work never run inline before the
webhook acknowledgement. Duplicate deliveries return success after confirming
the existing receipt; they do not repeat side effects.

The system monitors delivery failures and endpoint disablement, because the
provider retries failed deliveries and may disable repeatedly failing
endpoints. Webhook delivery logs do not replace Arena Props receipts or queue
state.

## Targeted webhook flows

### Injury created, updated or cleared

```text
nba.injury.created | nba.injury.updated | nba.injury.cleared
  -> verify, persist receipt and deduplicate
  -> enqueue injury.refresh(player_id)
  -> fetch/normalize the affected injury record
  -> append availability revision if context state changed
  -> mark affected player/event calculations dirty
  -> recalculate only enabled dependent context/projections
  -> rebuild affected read models
  -> invalidate dependent cache tags after commit
```

### Game started

```text
nba.game.started
  -> verify, persist receipt and deduplicate
  -> idempotently transition acquisition state to LIVE
  -> fetch latest canonical game state
  -> enqueue initial live-stat reconciliation
  -> assign live cadence to game-state and live-stat jobs
  -> invalidate the event status/read-model cache after commit
```

The transition remains safe if polling observed `LIVE` first or the webhook is
replayed later.

### Granular player-stat events

Events such as `nba.player.scored`, `nba.player.rebound` and
`nba.player.assist` can occur frequently. They mark the event/player dirty and
are coalesced into a short reconciliation window. Arena Props does not perform
a full metric rebuild and cache fan-out for every individual delivery.

```text
granular player event
  -> verify, persist and deduplicate
  -> mark event/player live-stat dependency dirty
  -> coalesce nearby events
  -> fetch or apply an accepted incremental fact
  -> publish one versioned live read-model update
```

Final hit rates and settled research metrics are not recomputed from provisional
live scoring events.

### Game ended

```text
nba.game.ended
  -> verify, persist receipt and deduplicate
  -> idempotently transition acquisition state to FINALIZING
  -> fetch final game and participant state
  -> fetch final player/team statistics
  -> store accepted revisions as provisional or final
  -> recalculate affected finalized metrics
  -> rebuild player/event/prop read models
  -> invalidate dependent cache tags after commit
  -> schedule +5 minute correction sweep
  -> schedule +30–60 minute correction sweep
  -> optionally schedule next-day reconciliation
  -> transition to FINAL after required sweeps succeed or are reviewed
```

Canonical event status may already be `final` while acquisition remains
`FINALIZING`. That distinction allows the UI to show the game result while
clearly marking statistics and derived metrics as provisional.

## Change propagation and cache invalidation

Workers commit canonical facts and calculations before invalidating cache
entries. Suggested dependency tags include:

```text
event:{event_id}
player:{player_id}
prop:{prop_market_id}
nba:current-props
nba:live-events
```

Invalidation is emitted through a transactional outbox or equivalent durable
post-commit mechanism. Consumers rebuild or expire only affected read models.
If Redis is unavailable, canonical writes continue and invalidation events are
retried; the API must not treat a stale cache write as canonical truth.

## Serving and frontend freshness contract

```text
provider webhook/poll
  -> Arena Props ingestion and canonical commit
  -> calculation/read-model update
  -> shared cache
  -> Arena Props API
  -> jittered browser refresh or managed invalidation
```

- React never calls BALLDONTLIE or The Odds API directly.
- User count never multiplies provider polling.
- The initial user experience may use jittered API polling against shared cache.
  Persistent SSE/WebSocket delivery remains optional for this latency target.
- A failed provider refresh does not reset the user-facing freshness timer.
- Suspended, removed, stale and unavailable offers remain distinct.
- Final pre-lock odds are not settlement truth; settlement uses accepted sports
  facts and versioned rules.

Every live odds/read-model response includes:

```text
generated_at
source_cutoff_at
provider_updated_at (when supplied)
last_successful_refresh_at
freshness_state
next_refresh_expected_at
```

The interface may display:

```text
Odds refreshed 42 seconds ago
```

The timer uses `last_successful_refresh_at`, not browser request/render time.
When a verified threshold is exceeded, the UI changes to `delayed`, `stale` or
`unavailable` and stops presenting the offer as current or executable.

Exact stale thresholds remain a Phase 1 decision based on paid-plan fixtures,
provider jitter and observed outage behavior.

## Capacity implications

The initial public-launch target is 500 simultaneously active users with a
tested ceiling of 1,000:

- 500 clients refreshing every 30 seconds is approximately 17 requests/second;
- 1,000 clients refreshing every 30 seconds is approximately 33 requests/second;
- 1,000 clients refreshing every 60 seconds is approximately 17 requests/second;
- shared cache serves the overwhelming majority of those reads;
- client and scheduler jitter prevent synchronized origin bursts;
- cache coalescing prevents many misses from rebuilding the same read model;
- provider requests remain based on event/data-class policy, not user sessions.

The same architecture retains a future horizontal path to 5,000 simultaneously
active users, but that capacity is not provisioned or paid for before traffic
evidence exists. Load tests cover both launch client schedules, provider credit
consumption, webhook bursts, queue replay, cache misses, ingestion delays,
missed start/end events, finalization sweeps and recovery after provider or
optional Redis outages.
