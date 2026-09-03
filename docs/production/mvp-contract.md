# Arena Props NBA Reference Implementation Contract

## Decision status

**Status:** Frozen for the NBA reference build on `2026-08-27`; paid-tier shape
amended by owner decision on `2026-09-01`.

This document is deliberately narrow. The platform architecture remains
multi-sport, but NBA is the internal reference implementation used to prove the
complete system before the same patterns are repeated for every other intended
sport. Completing NBA does not authorize a public launch.

Phase 0 freezes the NBA proof scope. Launch-time pricing, promotion details,
country enablement and later-sport integrations remain configurable later-phase
decisions and do not block the reference build.

The `2026-09-01` amendment deliberately replaces the earlier one-paid-tier
working assumption with two paid tiers and no free Arena Props access. It
changes the entitlement shape to be implemented in Phase 5 but does not expand
the NBA provider proof, authorize a public launch, or move post-launch AI into
launch scope. Public tier names and prices remain intentionally changeable.

## Proposed NBA reference scope

| Decision | Proposed reference contract | Status |
| --- | --- | --- |
| Reference competition | NBA | Approved on `2026-08-26` as the proving ground, not the only launch competition |
| Public launch after NBA | No | Approved; public launch remains blocked pending the multi-sport expansion and a separate launch manifest |
| Market timing | Pregame and live; live sports data and supported live props update every 30–60 seconds with visible freshness | Approved on `2026-08-26`; governed by `live-refresh-policy.md` |
| Sportsbooks | DraftKings, FanDuel, BetMGM and Caesars | Approved target set on `2026-08-26`; each book/market pair still requires a paid fixture and accepted rights before enablement |
| Player markets | Points, Rebounds, Assists, 3PM, PRA, PR, PA and RA | Approved target set on `2026-08-26`; provider mappings and settlement tests remain required |
| Odds region and public jurisdiction | Acquire the US sportsbook region; use a launch-time allowlist that enables paid access only after legal/payment/tax/privacy/provider-rights review | Approach approved on `2026-08-27`; governed by `jurisdiction-access-policy.md` |
| Historical player statistics | Current NBA season plus three completed seasons of event-level player statistics from BALLDONTLIE or an approved replacement statistics source | Approved depth target on `2026-08-26`; paid fixture and rights pending |
| Historical odds | The Odds API player-prop and game-market snapshots where available and contractually retainable, plus Arena Props snapshots from the moment ingestion begins | Approved source role on `2026-08-26`; licensed retention and coverage gaps pending |
| Sports truth | BALLDONTLIE NBA data through Arena Props adapters | Proposed; paid fixture and rights acceptance pending |
| Current NBA market truth | BALLDONTLIE through Arena Props adapters; The Odds API may be used for comparison, repair or a demonstrated coverage gap | Approved source role on `2026-08-26`; BetMGM player-prop and every book/market fixture still require verification |
| Images | TheSportsDB where coverage and commercial rights are accepted; player initials over team-color backgrounds when an approved image is unavailable | Approved fallback on `2026-08-26`; media rights pending |
| Accounts | Managed authentication with email/password and Google OAuth mapped to Arena Props canonical user IDs; optional authenticator-app TOTP for users and mandatory MFA for privileged administrators | Approved requirements on `2026-08-26`; vendor pending |
| Billing | Stripe as billing platform and billing authority | Approved on `2026-08-26`; products, prices and webhook implementation remain pending |
| Paid access | Backend-enforced subscriptions and entitlements with no free Arena Props access and two paid tiers: Tier 1 core research/full line movement/locked positive-EV signal; Tier 2 actual +EV data and EV tools | Shape approved on `2026-09-01`; public names and prices remain changeable Phase 5/pre-launch decisions |
| Discounts | Support Stripe Coupons and Promotion Codes without hardcoding campaign rules | Capability approved; visibility, limits, expiry and eligibility move to Phase 5/pre-launch |
| User state | Saved props and Pick Builder synchronized through the Arena Props API | Proposed |
| Community Popular | Disabled until authenticated action integrity and abuse controls are proven | Approved for deferral on `2026-08-26` |
| Public freshness copy | "Updates approximately every 60 seconds" plus a last-successful-refresh age and explicit delayed/stale states | Approved on `2026-08-26` |
| Next proving sport | NFL | Selected on `2026-08-26` under the delegated choice; starts only after NBA passes its proof gates |
| Provider purchase sequence | Buy only the NBA-specific access needed for the proof; do not buy BALLDONTLIE ALL-ACCESS or maximum-volume odds plans until NBA passes its proof gates and measured usage justifies an upgrade | Approved on `2026-08-26` |

## Proposed Arena Props calculations

The initial calculation engine may publish only reproducible calculations backed
by accepted event facts and economic prop history:

- L5, L10, L15 and L20 hit rates.
- Season hit rate.
- Average and eligible sample size.
- Over/Under streak.
- Best current eligible line and price.
- Book-specific opening, current, closing, minimum and maximum landmarks.
- Versioned consensus opening, current, closing, minimum and maximum landmarks.
- Line movement with generation time, source cutoff and rule versions.

The frontend receives these values from Arena Props read models. It must not
calculate hit rates, best lines, consensus or line landmarks from raw provider
payloads.

## Deferred from the NBA reference implementation

The following are outside the NBA reference implementation unless this
contract is deliberately reopened. Sports listed here are not rejected from the
product; they are queued for Phase 8 after NBA proves the reusable system:

- Push, email, SMS or device real-time alerts. Live dashboard refreshes remain
  included in the NBA reference implementation.
- Arbitrage alerts.
- Advanced proprietary projections and injury-impact models.
- DFS products.
- StoryStats or narrative feeds.
- Popular/community consensus.
- NBA shot-location and deep tracking modules.
- NFL, MLB, NHL, WNBA, NCAAB, NCAAF, soccer and tennis until
  each repeats the NBA proof gates.
- Any additional book, market, region or historical depth not listed above.

Existing frontend screens for deferred capabilities are prototypes. They must be
feature-gated, labeled unavailable/coming later, or excluded from production
entitlements until their phase gates pass.

## NBA reference proof case

The first end-to-end production milestone is intentionally smaller than the
full NBA reference implementation:

```text
one NBA event
  -> one resolved player
  -> one canonical player prop
  -> multiple sportsbook offers
  -> economic-state snapshot history
  -> one reproducible calculation/read model
  -> Redis or equivalent shared cache
  -> GET /api/v1/props
  -> Props screen
```

The proof is incomplete if any provider ID or raw provider field is required by
the public response or React state.

## Phase 0 decisions — frozen

- [x] Approve NBA as the internal reference competition and proving ground; it
  is not the only launch competition and completing it does not trigger launch.
- [x] Approve pregame and live market timing with 30–60-second live dashboard
  updates and a last-successful-refresh timer.
- [x] Approve DraftKings, FanDuel, BetMGM and Caesars as target books, subject to verified coverage and rights.
- [x] Approve Points, Rebounds, Assists, 3PM, PRA, PR, PA and RA as the initial market set.
- [x] Select the US odds-acquisition region.
- [x] Approve the country/region allowlist policy; exact paid jurisdictions are a
  launch-time compliance decision and an odds region is not legal authorization.
- [x] Select current season plus three completed seasons as the minimum historical player-stat depth.
- [x] Approve player initials over team-color backgrounds when an approved headshot is unavailable.
- [x] Supersede the earlier one-paid-tier working assumption with no free Arena
  Props access and two paid tiers: Tier 1 core research/full line movement with
  only a locked positive-EV signal, and Tier 2 actual +EV data/tools. Approved
  on `2026-09-01`; public names and prices remain changeable until Phase 5.
- [x] Require Stripe promotion-code capability while deferring campaign rules to Phase 5/pre-launch.
- [x] Approve Stripe as the billing platform and billing authority.
- [x] Approve deferring Popular, advanced projections, arbitrage and push alerts
  and all other sports from the NBA reference implementation. Live dashboard
  updates are not deferred.
- [x] Approve the public freshness language; it may not promise a cadence faster than the selected upstream source.
- [x] Approve an NBA-only provider purchase first; multi-sport/all-access and
  maximum-volume plans require proof results and a separate upgrade decision.
- [x] Freeze the later-sport roadmap labels as NBA, NFL, MLB, NHL, WNBA, NCAAB,
  NCAAF, Soccer, Tennis, LoL, CS2 and Valorant. Specific leagues, tours,
  providers and enablement order are Phase 8 decisions.

## Phase 0 exit gate

Phase 0 exited on `2026-08-27`. Provider-dependent items remain conditional and
must pass their later evidence gates. Landing/pricing claims may not imply that
completing NBA equals public availability, and later phases may not silently
expand the NBA proof scope.

## Multi-sport handoff after NBA

After the NBA path passes Phases 0–7:

1. Preserve the provider-neutral API, canonical identities, queue contracts,
   snapshot semantics, entitlement enforcement and freshness states proven by
   NBA.
2. Add one intended sport at a time through sport-specific provider fixtures,
   market mappings, settlement rules, rights checks and load measurements.
3. Do not inherit NBA assumptions where a sport has different periods, event
   structures, player roles, markets or settlement behavior.
4. Keep each sport disabled until its own proof evidence passes.
5. Prepare a separate public-launch manifest only after the intended
   multi-sport package is complete.

NFL is the next proving sport after NBA. The frozen roadmap labels, matching the
product navigation, are NBA, NFL, MLB, NHL, WNBA, NCAAB, NCAAF, Soccer, Tennis,
LoL, CS2 and Valorant. Only NBA is funded and implemented during the reference
proof. Phase 8 selects the provider, specific competition/tour, order and launch
gate for each later label; roadmap inclusion does not authorize advance
subscription purchases or make every label a Phase 0 blocker.

## Data-source distinction

Historical odds and historical player statistics are different datasets. The
Odds API supplies timestamped sportsbook-market snapshots, including supported
historical player props. It does not supply the event-level player box-score
history used to calculate L5/L10/L15/L20 and season hit rates. Those facts come
from BALLDONTLIE or a replacement statistics provider and are joined to The
Odds API history through canonical Arena Props event, player and market IDs.
