# Arena Props Product Expansion Blueprint

## Status and intent

**Mapped:** `2026-08-31`

**Decisions incorporated:** `2026-09-01`

**Scope:** Product and UI direction for the existing routed Arena Props SPA.

**Implementation status:** Planning only; this document does not claim that a
screen, provider, calculation, or model is production-ready.

This blueprint converts the supplied feature list and eight screenshots into a
cohesive dashboard plan. The screenshots are visual references, not product or
technical instructions. Existing Arena Props contracts, provider-neutral IDs,
snapshot history, feature gates, and the frozen NBA reference scope remain
authoritative.

## Product outcome

Arena Props should make one question easy to answer:

> What is the strongest available version of this prop, what evidence supports
> it, and how fresh is that evidence?

The product should feel like a focused research workspace rather than a wall of
metrics. The default view exposes only the signals needed to scan and compare;
deeper evidence remains one click or tap away.

## Brand, audience, and product boundary

- **Premium Picks** is the parent company, affiliate/promotions owner, and
  Discord community brand.
- **Arena Props** is the prop-research product and the name used throughout the
  application.
- The primary audience is traditional sportsbook bettors.
- Arena Props is research-only. It compares lines and odds received through
  contracted APIs and does not place, transmit, or execute wagers.
- Use every sportsbook and pick'em provider demonstrably available through the
  approved APIs. A book appears only when its market coverage, mapping,
  freshness, rights, and current offer pass the Arena Props eligibility rules.
- The primary dashboard job is **Find a prop**, and `/dashboard/props` remains
  the default signed-in route.

## Visual direction

Trial **charcoal/black with teal as the primary analytical accent**. Retain gold
as a restrained Premium Picks/premium-plan accent rather than using it for
every selected or positive state. This is the first test direction, not an
irreversible brand lock; visual QA may justify refining the palette.

| Role | Direction | Use |
| --- | --- | --- |
| Base | Near-black and charcoal | App background, rails, cards, tables |
| Primary accent | Deep teal/cyan | Selected controls, links, focus, chart emphasis |
| Brand accent | Muted gold | Logo, PRO badge, premium/featured treatment |
| Positive | Green | Favorable or over results only |
| Negative | Red | Unfavorable or under results only |
| Warning | Amber | Stale, mixed, or limited-sample states |

This keeps selected state separate from betting outcome. Teal means "active";
green and red retain analytical meaning. Exact values and labels must always be
present because color is supplementary.

### Density rules

- Prefer one strong page title, one filter bar, and one main results surface.
- Use 14px minimum body text on phone and 12px minimum dense-table text on
  desktop; metadata may be smaller only when contrast remains accessible.
- Use section headers, space, and subtle surface changes instead of heavy
  borders around every value.
- Let secondary metrics scroll or expand before shrinking them into illegible
  columns.
- Offer Compact, Standard, and Comfortable density on desktop; phone uses one
  readable density.
- Never place a chat, Discord, or Pick Builder control over the mobile bottom
  navigation or a primary action.

## Reference-image takeaways

| Image | Pattern to retain | Arena Props adaptation |
| --- | --- | --- |
| 1 | Scannable promo-card grid | Dedicated Bonuses page with copy-code and terms |
| 2 | Grouped sidebar and prominent Discord CTA | Clear nav groups plus a Discord action above the user card |
| 3 | Dismissible Discord prompt and floating utility | One respectful prompt; persistent entry remains available |
| 4 | Strong list/page heading | Plain competition header, result count, and freshness |
| 5 | Player photos in compact prop rows | Licensed headshot with initials/team-color fallback |
| 6 | One line trigger that reveals all lines/books | Grouped line-and-book offer selector |
| 7 | Matchup moneyline context beside research | Compact event-odds module tied to the prop's event |
| 8 | Restrained dark theme and compact data table | Teal analytical theme with optional density/columns |

## Information architecture

### Desktop navigation

```text
Analysis
  Props
  +EV
  Discrepancies
  Players
  Trends
  Matchups
  Projections

Community
  Popular

Build
  Parlay Builder

Personal
  Saved

Tools
  Bonuses · Premium Picks

Support
  Premium Picks Discord
  Help / Guide

Post-launch roadmap
  AI Assistant
```

The Pick Builder may remain a persistent desktop rail, but it also receives a
real route so it works as a full screen on phone and can be shared/bookmarked.

### Proposed routes

| Destination | Route | Notes |
| --- | --- | --- |
| Props | `/dashboard/props` | Primary research entry point |
| +EV | `/dashboard/ev` | Ranked eligible offers, not just a table filter |
| Players | `/dashboard/players` | Directory and global player search |
| Popular | `/dashboard/popular` | Weighted community activity, distinct from Saved |
| Parlay Builder | `/dashboard/builder` | Full mobile page; rail/drawer on desktop |
| Bonuses | `/bonuses` | Public Premium Picks affiliate offers; linked from Arena Props |
| AI Assistant | `/dashboard/assistant` | Post-launch roadmap only; do not expose at launch |

Existing routes for discrepancies, trends, matchups, projections, saved, help,
and player/game detail remain unchanged.

### Phone bottom navigation

The request says five sections but names four. The recommended fifth item is
**Props**, because it is the primary research destination:

1. Props
2. Players
3. Popular
4. Builder
5. More

**More** opens a bottom sheet containing +EV, Projections, Trends, Matchups,
Discrepancies, Saved, Bonuses, Premium Picks Discord, account, and Help. The
sheet preserves the active state and supports vertical scrolling. The Builder
icon shows the current selection count. AI Assistant is added here only after
its post-launch phase is approved and implemented.

This replaces the prototype's Saved bottom-nav item with Builder. Saved remains
one tap away under More.

## Props discovery experience

### Default desktop scan order

Each prop row should read left to right in this order:

1. Save/Add control.
2. Player photo, name, team/role, matchup, and event time.
3. Market, side, and selected line.
4. Best eligible book and Over/Under price.
5. Projection and edge to line.
6. +EV and AI Confidence.
7. L5, L10, L15, H2H, and streak.
8. Game moneyline context.
9. Add to Builder action.

The approved Tier 2 default desktop view shows player, prop, selected
line/book, projection, +EV, 0–100 confidence, L5, L10, L15, H2H, streak, game
time, selected-book moneyline, a compact line-movement indicator, and the
Builder action. Tier 1 replaces the actual +EV value with the approved locked
`Positive EV detected` signal when applicable.
The full line-movement chart remains in expanded research. Users can hide or
reorder secondary columns with the existing Columns control.

### Pregame and live organization

- **All** is the default and may contain both pregame and live props.
- **Live** is a dedicated tab/filter containing only currently live eligible
  props.
- Every live row/card prints `LIVE`, current event status, and last update age.
- Pregame and live offers remain distinguishable when mixed; live state cannot
  be communicated by color alone.

### Phone prop card

```text
[photo] Player · team/role                  [save]
Matchup · local event time · freshness

Over 27.5 Points         Best: -105 · Book
[change line/book]       Team ML -125

AI Confidence 78         +EV 4.6%
Projection 29.1          Edge +1.6

L5 4/5 · L10 8/10 · L15 11/15 · H2H 3/4 · O3

[View research]                 [Add to Builder]
```

The full card expands for additional books, line movement, sample detail, and
score explanation. It should not expose every column at once.

### Line and sportsbook selector

The selected-offer trigger shows:

- selected line;
- best current Over and Under price at that line;
- selected or best book logo/name;
- number of additional eligible offers; and
- last update age.

The menu is grouped by **line**, then lists each sportsbook at that line. It
sorts lines numerically and prices by best Over or Under according to the
currently selected side.

Every offer row shows book, line, Over price, Under price, update age, and a
Best tag where applicable. Suspended or stale offers remain visible only when
useful, are clearly disabled/labeled, and can never win the Best calculation.

Changing the line must recalculate or fetch the line-specific hit rates,
projection edge, +EV, confidence, chart threshold, and Pick Builder selection.
Changing only the book/price updates price-specific +EV and selection state
without pretending the player's historical results changed.

### Regular, Goblin, Devil, and alternate lines

Every offer uses one of four line types:

| Line type | Meaning | Typical tradeoff | UI treatment |
| --- | --- | --- | --- |
| **Regular** | The provider's standard prop line and normal payout structure | Baseline difficulty and payout | Neutral `Regular` badge |
| **Green Goblin** | An alternate line specifically designated by the provider as easier/lower-risk than its regular counterpart | Usually a lower payout or multiplier | Green `Goblin` badge with a plain-text `Easier line` explanation |
| **Red Devil** | An alternate line specifically designated by the provider as harder/higher-risk than its regular counterpart | Usually a higher payout or multiplier | Red `Devil` badge with a plain-text `Harder line · Higher payout` explanation |
| **Alternate** | Any other alternate line that is not reliably designated Goblin or Devil | Provider-specific odds or payout | Neutral `Alternate` badge |

"Easier" and "harder" are relative to the regular line, not predictions or
guarantees. A provider's explicit classification is mapped when supplied.
Arena Props may also use a reliable, versioned provider-specific mapping rule,
but it must not apply a generic rule such as "every line below regular is a
Goblin" or "every line above regular is a Devil." Unclassified alternate lines
remain `alternate`.

Canonical UI/API value:

```text
line_type = regular | goblin | devil | alternate
```

Prop discovery receives an **All / Regular / Goblins / Devils / Alternates** filter. The
line selector groups specialty lines separately, shows the exact payout or
multiplier, and links to provider-specific rules. Cards and rows always print
the line-type label; green or red color alone is insufficient.

Every statistic and calculation remains tied to the exact side and threshold.
Selecting any Regular, Goblin, Devil, or Alternate line therefore refreshes
L5/L10/L15, H2H, streak, projection edge, +EV, and AI Confidence for that exact
line. The UI must not reuse values calculated for another threshold.

If a specialty line is unavailable, stale, suspended, incompatible with the
current entry, or missing verified payout rules, it cannot be added to the
Builder. Arena Props should display the reason instead of silently converting
it to a regular line.

### Moneyline beside a player prop

Moneyline is **event context**, not the payout for the player prop. The compact
module should show both participants where space permits, emphasize the
player's team, use the sportsbook selected by the user, and include freshness.
If that book has no eligible moneyline, show `Unavailable at selected book`
rather than silently switching books.

Example: `BOS -125 · NYK +110`.

Selecting this module opens matchup/game-odds detail. It must not silently add
a moneyline leg to the prop selection. If game-market legs are later supported,
they require a separate explicit Add action and compatibility checks.

## Player research page

The shared player shell remains valid, with this clearer hierarchy:

1. **Identity header:** player photo, name, role, team, opponent, start time,
   event status, and freshness.
2. **Decision bar:** side, market, line/book selector, best price, +EV,
   confidence, projection, and Add to Builder.
3. **Evidence summary:** L5, L10, L15, season, H2H, streak, average, and sample
   sizes.
4. **Performance chart:** exact result labels, selected-line threshold, filters,
   and unavailable states.
5. **Right context rail:** line movement/prop history first, then matchup,
   player stats, odds, and team/player form.
6. **Detailed evidence:** game log and sport-specific modules.

### Right-context rail readability

- Use full module titles such as **Matchup moneyline** and **Line movement**.
- Print participant names beside logos; do not rely on abbreviations alone.
- Pair every percentage with its sample, for example `75% · 6/8`.
- Keep odds labels explicit (`Moneyline`, `Over price`, `Under price`).
- Use tabs for sibling views and stacked cards for information that should be
  compared simultaneously.
- Collapse modules below the main chart on narrow screens in this order:
  line movement, matchup odds, player stats, team/player form.

## +EV definition

+EV can be shown only when Arena Props has a calibrated probability for the
exact player, market, side, line, and eligibility context. A raw recent hit rate
is not automatically a fair probability.

For one unit risked:

```text
decimal profit = American odds > 0
  ? American odds / 100
  : 100 / abs(American odds)

EV per unit = model probability * decimal profit
              - (1 - model probability)
```

The UI displays EV as a percentage and exposes the model probability, odds,
model version, input cutoff, and update time in the explanation. If the model
is unavailable, uncalibrated, stale, or outside its supported cohort, the UI
shows `Unavailable`; it must not substitute a hit rate or fabricated zero.

## AI Confidence

### Product meaning

**AI Confidence is a ranked research score, not the probability that a bet will
win.** It should help users compare the quality and agreement of available
signals while keeping the underlying evidence visible.

Proposed starting hypothesis for backtesting—not a frozen formula:

| Input | Starting weight | Guardrail |
| --- | ---: | --- |
| Recency-weighted historical hit evidence | 45% | Use one recency model so L5/L10/L15 are not triple-counted |
| Opponent H2H evidence | 15% | Show sample/context; do not automatically reduce the score solely because the sample is small |
| Calibrated expected value | 40% | Exact side/line/book and supported model cohort only |

A small H2H sample does not automatically lower confidence. The calculation
may retain a strong H2H contribution when matchup context, extreme results, and
repeatable structural advantages support it. The sample size and dates remain
visible, the H2H contribution remains capped, and sport/market-specific
backtests must validate how this behaves. Missing H2H does not become zero and
must not quietly inflate the remaining signals.

Confidence is displayed as a **0–100 score** with a color grade and exact
number. The grade must include a text label so color is not the only meaning.
Every sport and market family receives a separately calibrated score version.
When required inputs are unavailable or unsupported, the score is
`Unavailable` until the owners approve another missing-data policy.

Confidence may use a backend EV-derived component without exposing the exact
+EV value to Tier 1. Tier 1 receives the score and its component explanation;
the exact +EV opportunity, probability, and advanced EV tools remain Tier 2.
This separation must be tested so the explanation is useful without leaking or
misrepresenting the gated metric.

Every score opens an explanation containing:

- score version and last calculation time;
- the three component contributions;
- sample sizes and date ranges;
- selected line, side, and sportsbook price;
- freshness/data-quality warnings; and
- a plain statement that the score is not a guarantee or win probability.

Backtests must measure calibration, ranking lift, stability, and performance by
sport/market cohort. The score stays experimental and feature-gated until those
tests pass.

## AI Assistant

**Launch status:** Post-launch roadmap. Do not build, advertise, price, or
expose the AI Assistant before the core Arena Props product launches. Questions
about its launch jobs, sharing behavior, recommendation scope, context, chat
history, and message limits are deliberately deferred.

### Supported jobs

- Draft a concise prop write-up from the currently selected evidence.
- Explain L5/L10/L15, H2H, streak, line movement, projection, +EV, or confidence.
- Compare eligible books and lines without placing a wager.
- Summarize a player's recent form and matchup context.
- Explain the relative line and payout difference between Green Goblin,
  Regular, and Red Devil selections using the exact provider rules.
- Answer product/help questions.

### Trust requirements

- The assistant receives a server-created Arena Props context package, never
  raw vendor payloads or browser-held provider keys.
- Every factual write-up links back to the exact internal evidence cards and
  includes data cutoff/freshness.
- It distinguishes sourced facts, Arena Props calculations, model output, and
  generated commentary.
- It says when data is missing or conflicting and never invents lines, odds,
  injuries, trends, or citations.
- It cannot place bets, submit picks to a sportsbook, alter billing, or market a
  response as guaranteed profit.
- Prompts/responses are subject to access control, redaction, retention rules,
  abuse controls, and per-user rate limits.

Use an Arena Props model gateway so the UI/API contract does not depend on one
AI vendor. Model selection, cost limits, privacy terms, and evaluation remain
open post-launch decisions. AI is a likely future Tier 2 capability because of
its API/compute cost, but that entitlement is not final until the feature is
defined.

## Parlay Builder

The Builder is a research organizer, not a sportsbook bet slip.

- Allow mixed research selections from different sportsbooks and pick'em
  providers while preserving the provider attached to every leg.
- Add exact prop ID, side, line, sportsbook, odds, and snapshot time.
- Preserve the exact `regular`, `goblin`, `devil`, or `alternate` line type,
  provider payout/multiplier, and rule-set version.
- Detect duplicate, conflicting, stale, suspended, and same-event selections.
- Warn for correlations, same-player conflicts, duplicate props, and
  provider-restricted combinations. Warn by default; block only a combination
  proven invalid for the specific provider/rule set.
- Allow Regular, Goblin, Devil, and Alternate lines together when that
  provider's current rules permit the combination.
- Warn when a line or price changes; require the user to accept the new offer.
- Calculate an actionable combined payout only within a compatible
  single-provider group. A mixed-provider research list may show leg-level
  prices and provider subtotals, but never one combined payout as though a book
  offers that mixed entry.
- Do not add individual leg EV values to claim parlay EV; correlation and joint
  probability require a separate supported model.
- Persist authenticated selections through the Arena Props API and support a
  local session before sign-in according to the existing user-state contract.
- Phone uses the full Builder page; desktop may use both the route and rail.
- Later, support a shareable Arena Props link and rendered image for Premium
  Picks Discord/social use. Shared artifacts remain research-only and preserve
  offer timestamps.
- Later, after reliable projection data exists, evaluate estimated probability,
  implied probability, parlay EV, and an Arena Props parlay score.

## Bonuses page

Public route: `/bonuses`, with links from the marketing site and Arena Props.

Bonuses are owned and branded by **Premium Picks**, the parent company. They
remain publicly visible for search discovery and affiliate conversion; an
Arena Props account is not required.

The card grid includes Kalshi and only other partners with an active Premium
Picks affiliate relationship when the current offer, code, destination, terms,
jurisdiction, and commercial relationship have been verified.

**Initially confirmed affiliate partner:** Kalshi. No other partner card is
published until Premium Picks confirms the affiliate relationship and offer.

Each card contains:

- provider logo and name;
- short verified offer summary;
- promo code with Copy action, or `No code required`;
- eligibility/region and expiration when known;
- key terms and a Terms link;
- affiliate/sponsorship disclosure;
- primary Claim offer action; and
- an `Already signed up` dismissal when applicable.

Premium Picks admin staff own verification. Offers come from an admin-managed
configuration rather than hardcoded React copy. Expired or unverified offers
automatically stop displaying. Analytics
distinguish impression, copy, outbound click, and dismissal without recording
sensitive payment information.

## Discord surfaces

- Desktop sidebar: persistent **Join the Premium Picks Discord** action above
  the account card.
- Phone: Premium Picks Discord appears in More and Support.
- Bottom-right notification: shown only to signed-in users who have not
  permanently dismissed it;
  includes Join and Not now, is keyboard accessible, and records dismissal.
- After `Not now`, suppress for a configurable three-to-four-day period; use
  four days as the initial default.
- Include a separate **Don't show again** action that permanently suppresses
  the prompt for that account unless the user resets the preference.
- The notification must yield to the AI Assistant, system alerts, and Pick
  Builder and must not stack over the mobile nav.

The invite URL, campaign copy, active flag, and suppression window are product
configuration. Never hardcode an expiring invite in the component.

## Provider and service ownership

All sources terminate at typed Arena Props adapters. React consumes only Arena
Props read models and canonical IDs.

| Need | Candidate/owner | Boundary and evidence gate |
| --- | --- | --- |
| Player/event/stat facts | BALLDONTLIE or approved replacement | Verify each regular-sport competition, historical depth, corrections, rate limits, media, and commercial rights |
| Regular-sport props, lines, spreads, totals, moneylines | The Odds API and/or approved source | Verify every sport/book/market pair, historical coverage, cadence, retention, and display/derivative rights |
| Esports props and moneylines | PropLine candidate | Endpoint, identity mapping, market/segment semantics, history, settlement, cadence, and rights are all unverified until fixtures/contracts prove them |
| Canonical database and durable queue | Supabase PostgreSQL/Queues candidate | Browser does not query canonical tables directly; Arena Props API/worker own authorization and writes |
| Backend API and workers | Arena Props service | Normalize providers, calculate read models, enforce entitlements, cache, audit, and expose stable versioned contracts |
| Subscription billing | Stripe | Stripe is billing authority; webhook events are verified and applied idempotently by the backend |
| AI chat/analysis | Post-launch provider TBD behind Arena Props gateway | Do not select/build for launch; later require privacy, structured-output, evaluation, latency, cost, retention, and fallback evidence |
| Player images | Approved media source | Store rights/source metadata; render initials/team-color fallback when unavailable |

BALLDONTLIE must not be assumed to cover esports from the phrase "sports and
esports." Esports remains a separate evidence and procurement path unless a
tested contract proves otherwise. Likewise, naming PropLine here records the
candidate requested; it does not confirm coverage or authorize a purchase.

## Data-contract additions to design before implementation

| Read-model area | Required additions |
| --- | --- |
| `PropTableRow` | Headshot, selected offer, available line groups, `line_type` (`regular`, `goblin`, `devil`, `alternate`), payout/multiplier, event time/freshness, event moneyline summary, gated positive-EV signal, +EV state, confidence state |
| `PlayerResearchView` | Confidence explanation, EV explanation, line/book selector groups, specialty-line rules, event moneyline, clearer contextual-module titles |
| `PickBuilderView` | Snapshot time, line-change state, specialty-line classification/rules, payout or multiplier, compatibility and correlation warnings, exact selected offer |
| `PopularPropCard` | Weighted activity score/version, total activity, builder adds, saves, pick activity, clicks, recency contribution, Over/Under percentages, integrity state |
| `UserPreferences` | Preferred books, sports, timezone, default filters, Discord prompt dismissal/permanent-dismissal state |
| New `EvOpportunityCard` | Eligible offer, model probability/version, EV, evidence coverage, freshness |
| New `BonusOfferCard` | Configured offer, code, terms, region, expiry, disclosure, campaign status |
| New `AssistantContext` | Canonical references, facts, calculations, model outputs, data cutoffs, allowed actions |

The normative frontend requirements, coverage matrix, ingestion specification,
and API schemas must receive stable requirement IDs before live implementation.

## Current-state reconciliation

| Capability | Current repo state | Work implied by this blueprint |
| --- | --- | --- |
| Props, players, trends, matchups, projections, saved | Prototype routes/screens exist | Rework hierarchy and replace mock data through production phases |
| L5/L10/L15, H2H, streak, projection, time, books | Present in prototype/data requirements | Improve grouping, samples, freshness, and line-specific behavior |
| Line/book dropdown | Compact book popover exists | Replace with grouped line-first selector and dependent metric updates |
| Regular/Goblin/Devil/Alternate lines | Newly defined product requirement | Add four-value provider classification/rules, filters, exact-line metrics, payout display, and Builder compatibility |
| Player pictures | Requirement exists; prototype fallback exists | Add approved media source and rights-aware fallback |
| Line movement | Required snapshot/calculation contract exists | Surface clearly and back with retained snapshots |
| Game moneyline | Data requirement exists | Add compact prop context and full matchup link |
| Pick Builder | Prototype rail/drawer exists | Add full route, phone nav placement, offer-change/conflict logic |
| Popular | Prototype currently emphasizes favorites; production feature is gated | Replace favorite-only rank with weighted intent/recency score and keep integrity/abuse gate |
| +EV | New product calculation/surface | Define calibrated probability contract and validation |
| AI Confidence | New experimental score | Backtest, calibrate, explain, and feature-gate |
| AI Assistant | Post-launch roadmap | Do not implement for launch; later define gateway, context, evaluation, privacy, entitlements, and cost controls |
| Bonuses | New public Premium Picks page | Add admin configuration, verification, disclosure, and expiry workflow |
| Discord CTA/prompt | New shell surfaces | Add configurable link/campaign and suppression behavior |

## Delivery sequence

### UX Track A — readability and navigation

1. Approve teal-primary/gold-brand visual direction.
2. Adopt the five-item phone nav and full Builder route.
3. Recompose prop rows/cards around the fixed decision hierarchy.
4. Improve player-detail headers, labels, samples, and context-rail order.

### UX Track B — offers and event context

1. Build the grouped line/book selector against typed fixtures.
2. Add Regular/Goblin/Devil/Alternate filters, badges, provider rules, and
   exact payout or multiplier states.
3. Add event time/freshness and compact game moneyline context.
4. Tie selected offers to charts, calculations, and Builder state.
5. Add line-change, stale, suspended, incompatible, and unavailable states.

### Product Track C — acquisition and community

1. Add the public Premium Picks Bonuses admin model and page.
2. Add Premium Picks Discord sidebar/mobile actions, four-day suppression, and
   permanent dismissal.
3. Replace favorite-only Popular ranking with weighted activity plus recency.
4. Keep Popular behind its existing authentication/integrity gate.

### Model Track D — projections, +EV, and confidence

1. Start with transparent, simpler statistical projections rather than an
   advanced proprietary model.
2. Define and validate exact-market model probability.
3. Launch +EV internally with full calculation provenance.
4. Backtest and calibrate separate 0–100 Confidence models by sport/market.
5. Add the full score breakdown before confidence ranking is public.

### Post-launch Track F — AI and extended community

1. Define the AI Assistant jobs and entitlement only after launch.
2. Evaluate AI providers behind the Arena Props gateway, then pilot cited
   write-ups.
3. Later evaluate community profiles, verified records, leaderboards,
   following, alerts/watchlists, and shareable Builder artifacts.

### Production Track E — live enablement

Follow the existing production phases: provider fixtures and rights, canonical
storage/snapshots, Arena Props API/cache, auth/billing/entitlements, frontend
live states, then load/failure/security/recovery evidence. Repeat the proof for
all 12 intended competitions before the separate public-launch decision.

UX prototypes may proceed in parallel with fixture data, but prototype presence
must never be used as evidence that a feature or provider is production-ready.

## Plans and entitlements

Arena Props will have two paid tiers. Prices and public plan names remain open.
Both tiers receive preferred books, preferred sports, timezone, and default
filter customization.

There is **no free Arena Props access**. The marketing site and Premium Picks
Bonuses page remain public, but Arena Props research requires an active Tier 1
or Tier 2 entitlement. Public tier names and prices are intentionally subject
to change until the pricing decision is frozen.

### Tier 1 — core research

- Prop browsing and sportsbook/pick'em comparison.
- Regular, Goblin, Devil, and Alternate lines.
- Hit rates and simpler statistical projections.
- 0–100 Confidence with its breakdown.
- Full available line movement: change times, prior values, current value, and
  movement direction.
- Parlay Builder.
- Popular/community aggregate activity.
- Filters, preferred books, sports, timezone, and defaults.
- Access to public Premium Picks bonuses/partner offers.
- A locked `+EV` signal on qualifying props, such as `Positive EV detected`,
  without the percentage, sorting/filtering, probabilities, fair odds, or edge
  calculations.

### Tier 2 — advanced EV

- Everything in Tier 1.
- +EV page and Props-page +EV filter.
- Actual EV percentage, EV sorting/filtering, implied probability, fair
  probability/odds, edge calculations, and EV-aware line/book comparison.
- The same complete raw line-movement history as Tier 1; line movement is not
  artificially split into standard and advanced tiers.
- Later, advanced parlay probability/EV and AI-driven analysis when each
  post-launch feature is approved and production-ready.

### Later roadmap

- AI Assistant.
- Community profiles, verified records, leaderboards, and following.
- Alerts and watchlists.
- Shareable Builder links/images.
- Sportsbook deep links or integrations; direct wager execution remains out of
  scope.

## Confirmed decisions — `2026-09-01`

- Premium Picks is the parent company; Arena Props is the product.
- Traditional sportsbook bettors are the primary audience.
- Find a prop is the primary job and Props remains the default route.
- Phone navigation is Props / Players / Popular / Builder / More.
- Trial charcoal/black + teal, with restrained gold parent/premium accents.
- Use the approved default prop columns and recalculate statistics when a line
  changes.
- Moneyline context follows the user's selected sportsbook.
- Keep regular sports and esports in the same overall experience for now.
- All may mix pregame/live; Live provides a dedicated filtered tab.
- +EV is both a dedicated Tier 2 page and a Props-page filter.
- Start with simpler statistical projections.
- Missing unsupported confidence/EV is `Unavailable`.
- Confidence is 0–100, color graded, fully explained, and separately calibrated
  by sport/market; small H2H samples receive no automatic penalty solely for
  being small.
- AI Assistant is post-launch roadmap work.
- Builder supports mixed research, provider-specific validation, warnings, and
  research-only behavior.
- Popular uses weighted activity and recency, shows total activity and
  Over/Under percentages, and begins anonymously.
- Bonuses are public, affiliate-backed, and Premium Picks admin-managed.
- The Discord prompt targets signed-in users, returns after three to four days
  when deferred, and supports permanent dismissal.
- Arena Props has two paid tiers with Tier 2 focused on +EV and advanced
  analytics; basic preferences are available to both.
- There is no free Arena Props access; public marketing and Bonuses do not
  include product research access.
- Every offer uses `regular`, `goblin`, `devil`, or `alternate`; only explicit
  provider designations or reliable provider-specific rules can assign Goblin
  or Devil.
- Full line movement is identical in both tiers.
- Kalshi is the first and only currently confirmed affiliate partner.
- Popular launch weights are Builder add `5`, Save `4`, side selection `3`, and
  click/view `1`, followed by a recency-decay multiplier.
- Tier 1 sees only a locked positive-EV signal; Tier 2 receives the actual EV
  values, explanations, filters, sorting, and views.

## Remaining product decisions

1. Choose public tier names and prices when the owners are ready; both remain
   intentionally changeable for now.
2. Freeze the Popular recency-decay curve, deduplication window, and anti-abuse
   thresholds while keeping the approved `5 / 4 / 3 / 1` action weights.
3. Approve the launch manifest of books actually proven through contracted API
   coverage; do not promise all books in advance.
4. Define the Premium Picks admin workflow for Kalshi and any later confirmed
   affiliate partners.
5. Define additional updated-stat modules later, as requested.
