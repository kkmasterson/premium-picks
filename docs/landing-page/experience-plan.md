# Arena Props Landing Page Experience Plan

## Status

- Living design and implementation roadmap.
- The first interactive build slice was implemented on 2026-08-26.
- Based on the seven competitor-reference images supplied on 2026-08-26 and a live review of the current Arena Props landing page.
- The references are inspiration for interaction patterns and information hierarchy, not a visual template to copy.
- Product availability, sportsbook coverage, prices, testimonials, user counts, and performance claims must be verified before publication.

## Implementation progress — 2026-08-26

### Completed in the first build slice

- [x] Converted the repeated static platform preview into an accessible four-view Product Tour.
- [x] Added Props, Player Analysis, Trends, and Matchups previews with matching dashboard destinations.
- [x] Added click, arrow-key, Home, and End navigation for the Product Tour tabs.
- [x] Replaced the generic three-card workflow with the four-stage Research Trail.
- [x] Added alternating left/right desktop entrances from beyond the viewport edge for all four Research Trail visuals, with a vertical gold trail and numbered checkpoints.
- [x] Added reduced-motion behavior and vertical mobile reveals.
- [x] Replaced the static sports grid with the interactive Sport Lab.
- [x] Added seven current landing-page sport categories with changing markets, sample data, chart, and sport-specific context.
- [x] Added click and arrow-key navigation for the Sport Lab tabs.
- [x] Updated hero, navigation, and footer anchors to the new experience.
- [x] Added focused interaction tests and completed desktop/mobile browser QA.

### Next implementation steps

- [x] Replace the flat hero dashboard with a cinematic three-surface stack led by a full player-page preview that crops through the right edge.
- [x] Move only the hero copy group roughly 50% closer to the left edge on large screens while keeping the dashboard stack and metrics alignment anchored in their prior positions.
- [x] Lower the complete desktop dashboard stack by 105px so the player page sits deeper in the hero and continues farther behind the metrics overlay.
- [x] Enlarge the desktop dashboard stack by 12% from its lower-left anchor so the screens reach higher while retaining the selected lower placement.
- [x] Increase the dashboard-layer tilt to an 8-degree upward-right slant for a stronger cinematic composition.
- [x] Replace the visible hand-built hero previews with sharp views derived from the real Patrick Mahomes player page, keeping the full page uncropped on the front layer.
- [x] Use the real Projections table as the wide rear dashboard behind the main Patrick Mahomes player page.
- [x] Trigger each Research Trail dashboard from its stationary step row so the off-screen visual reliably slides into place while scrolling.
- [x] Keep the four requested desktop edge entrances active even when the browser reports a reduced-motion preference.
- [x] Flip both Sport Lab cards together when a sport changes, swapping to the selected sport at the midpoint of the turn.
- [x] Remove the Free pricing tier and mark all displayed pre-launch prices and plan details as subject to change.
- [x] Convert the statistics block into a short transparent overlay with the dashboard artwork continuing behind it.
- [x] Pin the metrics overlay to the bottom of the hero viewport across desktop browser zoom levels.
- [x] Add an Arena Props-styled `97% of users` five-star trust badge to the hero; verify the claim source before publication.
- [ ] Replace or verify the statistics strip so every published count has a production source.
- [ ] Build the verified Line Coverage section after the supported provider list and trademark usage are confirmed.
- [ ] Expand the comparison into Arena Props versus manual research versus a typical multi-tool workflow.
- [ ] Separate available-now and planned features inside pricing.
- [ ] Connect plan buttons to the final signup or checkout flow instead of the prototype dashboard destination.
- [ ] Preserve the selected sport or tool in the final call to action.
- [ ] Complete a final copy and claims review before publication.

## Goal

Make the landing page feel like a short, guided product experience instead of a long stack of marketing sections. A first-time visitor should understand what Arena Props does, see how the dashboard supports a research decision, explore the sports and tools that matter to them, and reach pricing without needing to interpret dense copy.

The desired visitor takeaway is:

> Arena Props brings the research workflow together, shows me the product before I sign up, and makes it easy to see whether it fits how I research.

## Experience principles

1. **Show the product early.** Dashboard visuals should be large enough to read and connected to the claim being made.
2. **Let visitors choose a path.** Sport, tool, and dashboard selectors should update the preview in place.
3. **Tell one research story.** Each section should advance the same journey instead of resetting to a new collection of cards.
4. **Use motion to explain.** Scroll animation should reveal relationships and progression, not exist only as decoration.
5. **Keep claims credible.** Clearly separate available tools from roadmap items and avoid unverified competitor or outcome claims.
6. **Make every interaction accessible.** The experience must still work with a keyboard, reduced motion, small screens, and no animation.

## What the reference page does well

| Reference pattern | What works | Why it helps the visitor | What Arena Props should learn from it |
| --- | --- | --- | --- |
| Dashboard collage behind the hero | The product is the main visual rather than a generic sports image. | Visitors see the depth of the platform immediately. | Keep our dashboard-led hero, but make the active screen easier to read and tie it to the headline. |
| Visual tool cards | Each feature is paired with a purpose-built mini interface. | A visitor can understand a tool before reading the description. | Our current feature visuals are a strong start; give them active states and connect them into a workflow. |
| Alternating scroll entrances | Content arrives from the left and right as the visitor moves down the page. | The page feels paced and each step receives a moment of focus. | Use a four-step alternating research sequence with an Arena Props gold data trail. |
| Sportsbook logo wall | Many providers surround one central value statement. | Coverage feels tangible without a long paragraph. | Create a verified line-coverage section only after the supported provider list is confirmed. Do not use placeholder logos or imply unsupported coverage. |
| Clickable sport selector | Choosing a sport changes league logos, dashboard art, and listed capabilities. | Visitors can personalize the pitch around what they follow. | Replace our static sport cards with an interactive Sport Lab that changes a real Arena Props preview. |
| Clickable dashboard/tool showcase | A side list controls a large dashboard preview. | It demonstrates multiple product areas without making the visitor scroll through repeated screenshots. | Turn our Product Preview into the central interactive product tour. |
| Competitor comparison beside social proof | The comparison answers objections while quotes add reassurance. | It makes the value proposition easier to evaluate. | Compare Arena Props with manual research and a typical multi-tool workflow. Use named competitors, exact prices, or testimonials only when verified and approved. |
| Standard pricing cards after the comparison | Visitors first understand value, then see the plans. | Price appears in context instead of being the first decision. | Keep our pricing cards and billing toggle, but connect each tier to the tools demonstrated above it. |

## Current Arena Props landing page audit

The current page already contains most of the right content. Its primary weakness is that the sections behave like static exhibits rather than one connected experience.

| Current section | What is already strong | Current limitation | Recommended direction |
| --- | --- | --- | --- |
| Announcement and navigation | Clear launch offer, simple anchors, visible Log In and Get Started actions. | Navigation does not help visitors jump to sport coverage or the product tour. | Add Product Tour and Sports anchors; keep the main navigation compact. |
| Hero | Strong black-and-gold identity, clear headline, dashboard preview, and two focused calls to action. | The dashboard was a fixed, fully readable table and the floating stat cards made the hero feel like a generated dashboard preview. | Use one dominant, angled product surface with two supporting dashboard layers behind it. Crop the stack through the right edge so it reads as visual product atmosphere; keep detailed interaction in the Product Tour below. |
| Statistics strip | Quickly communicates scale and recency. | Counts can look like claims without context or verification. | Show only verified metrics and add precise labels such as `sports supported` or `data refreshed`, not ambiguous vanity numbers. |
| Platform preview | Large browser frame, realistic dashboard, and four concise callouts. | It repeats the hero table and the callouts are not clickable. | Convert it into a clickable dashboard tour with a controlled preview and contextual copy. |
| Research tools | Six detailed mini interfaces explain features better than icon-only cards. | The two-column grid is long, visually even, and disconnected from a decision sequence. | Keep the strongest visuals, then reorganize them into four alternating workflow moments plus an expandable tool gallery. |
| Three-step workflow | Simple and easy to scan. | The steps are generic cards and do not demonstrate what changes at each step. | Merge the workflow and feature story so each step changes the dashboard state. |
| Sports coverage | The supported leagues and sample markets are easy to scan. | Cards are static, repeated sport names dilute the hierarchy, and the preview does not react. | Replace the grid with accessible sport tabs and a changing league/market/dashboard panel. |
| Comparison | The Arena Props versus manual-research framing is credible and useful. | It compares only two choices and is visually separated from proof or product context. | Compare three workflows: Arena Props, manual research, and a typical multi-tool stack. Keep wording qualitative unless facts are substantiated. |
| Pricing | Monthly/yearly toggle, clear hierarchy, and feature lists are already functional. | Roadmap tools appear inside a paid tier, which can imply they are available now. | Add `Available now` and `Coming later` groupings or hold roadmap features until launch status is confirmed. |
| FAQ and final call to action | Good safety language and a clear close. | The final action sends visitors back to pricing instead of reflecting their chosen sport or tool. | Preserve the selection context in the final message and route the primary action to the appropriate signup/dashboard entry. |

## Recommended concept: The Research Trail

The new page should feel like the visitor is building a research view as they scroll. A thin gold “data trail” travels through the main experience, connecting four decisions:

1. Choose what to research.
2. See the signal.
3. Compare the market.
4. Understand the context.

The line, step numbers, and dashboard state make the sequence feel uniquely Arena Props. This takes the useful left/right reveal idea from the reference without reproducing its card layout, purple styling, wording, or exact composition.

### Signature visual language

- Arena Props black, warm gold, off-white, green, and red remain the core palette.
- Gold represents the visitor's selected path or active control—not every border on the page.
- Real dashboard surfaces replace generic decorative illustrations.
- A subtle field-grid or data-grid texture can sit behind major preview areas.
- The gold data trail pulses once as each step becomes active; it should not animate continuously.
- Each section includes one dominant visual instead of several elements competing at the same weight.

## Proposed page journey

| Order | Section | Visitor question answered | Primary interaction |
| --- | --- | --- | --- |
| 1 | Hero: See the Research, Not Just the Pitch | What is this and why should I care? | Switch between two or three representative product views. |
| 2 | Verified proof strip | Is the data broad and current enough for me? | None; concise factual proof only. |
| 3 | Interactive Product Tour | What tools do I actually get? | Select Props, Player Analysis, Trends, Matchups, Popular, or Discrepancies to update a large preview. |
| 4 | Four-step Research Trail | How does this help me make a research decision? | Scroll activates four alternating scenes from left and right. |
| 5 | Sport Lab | Does it support what I follow? | Select a sport; league marks, markets, and dashboard content update together. |
| 6 | Line Coverage | Which books or apps can I compare? | Filter or reveal verified providers; link to full coverage details. |
| 7 | Workflow comparison | Why not keep using my current process? | Compare Arena Props, manual research, and a typical multi-tool stack. |
| 8 | Plans | Which option fits me? | Monthly/yearly control and clear available-now entitlements. |
| 9 | FAQ and final call to action | What do I need to know before starting? | Context-aware Start Researching action. |

## Section specifications

### 1. Hero: See the Research, Not Just the Pitch

#### Purpose

Explain Arena Props in one sentence and make the dashboard the immediate proof.

#### Recommended composition

- Left: eyebrow, outcome-based headline, two-line supporting copy, primary call to action, and a `Tour the platform` secondary action.
- Right: one readable dashboard surface in front with two offset screens behind it for depth.
- The back screens should be dim and non-interactive. The active screen should remain level and legible rather than heavily tilted.
- A small selector above the active screen can switch between `Find Props`, `Analyze a Player`, and `Compare Lines`.
- Switching a view updates both the screenshot/module and a one-sentence benefit. It must not rotate automatically while the visitor is reading.

#### Copy direction

Possible headline:

> Research the pick. See the whole picture.

Possible supporting copy:

> Compare player performance, current prop lines, projections, and matchup context in one focused research workspace.

The final copy should avoid promising wins or implying that the platform places wagers.

### 2. Verified proof strip

Use three or four compact facts immediately below the hero. Potential categories are:

- Verified sports or competitions supported.
- Verified sportsbook/app coverage.
- Clearly defined update frequency.
- Number of research views or market types available.

Do not publish counts until the production data source and calculation are known. If a fact cannot be verified, replace it with a non-numeric trust point such as `Side-by-side lines` or `Sport-specific player pages`.

### 3. Interactive Product Tour

This becomes the main product demonstration and replaces the current repeated static browser frame plus four non-interactive callout cards.

#### Desktop layout

- Left column: stacked tool buttons with an icon, short label, and one-line purpose.
- Right column: a large, stable dashboard frame.
- The selected button uses a gold outline and a small step indicator.
- A `Open this view` link appears below the description and routes to the matching dashboard page when that page is implemented.

#### Candidate destinations

| Tour item | Preview focus | Intended route | Publication rule |
| --- | --- | --- | --- |
| Props | Filters, live line, L5/L10/L15/season columns | `/dashboard/props` | Available now. |
| Player Analysis | Player header, market selection, performance chart, contextual panel | `/dashboard/players/:playerId` | Use a stable sample player and supported sport profile. |
| Trends | Recent performance and threshold line | `/dashboard/trends` | Available now. |
| Matchups | Event and opponent context | `/dashboard/matchups` | Available now. |
| Popular | Community-favorited props | `/dashboard/popular` | Do not link until the documented page is implemented. |
| Discrepancies | Cross-app minimum/maximum line comparison | Future documented route | Do not present as available until implemented. |

#### Interaction behavior

- Tool buttons use tab semantics when they switch content in place.
- Arrow keys move between tabs; Enter or Space activates the current item.
- The dashboard frame keeps a consistent outer size so the page does not jump.
- Crossfade the interior in roughly 180–240 ms; do not slide an entire dashboard across the screen for every click.
- On mobile, the tabs become a horizontally scrollable segmented control above the preview.

### 4. Four-step Research Trail

This is the original Arena Props spin on the reference's numbered left/right scroll entrances.

#### Step 01: Choose the market

- Copy enters from the left; a filter panel enters from the right.
- Show the visitor selecting sport, event, player, and market.
- The gold data trail begins at the selected sport and continues into the next scene.

#### Step 02: See the signal

- A performance chart enters from the left; copy enters from the right.
- Show exact L5, L10, L15, season, average, and threshold values where supported.
- The message is about seeing recent performance, not predicting an outcome.

#### Step 03: Compare the market

- Copy enters from the left; line-comparison results enter from the right.
- Highlight the minimum and maximum available line or the best currently displayed price using labels in addition to color.
- Provider data must use verified current data or clearly labeled sample data.

#### Step 04: Add the context

- Matchup and supporting-stat modules enter from the left; copy enters from the right.
- Show that the same headline number can be evaluated with opponent, role, event, or sport-specific context.
- End with a compact summary panel that brings the four decisions together.

#### Motion behavior

- Alternate horizontal origin by step: `01 left`, `02 right`, `03 left`, `04 right` for the copy block, with the visual entering from the opposite side.
- Use opacity plus 32–48 px of translation, not full-screen travel.
- Target 480–650 ms with a soft ease-out.
- Trigger once when approximately 20% of the step enters the viewport.
- Content exists in the normal document flow before animation runs.
- Under `prefers-reduced-motion: reduce`, show the final state immediately and disable trail pulsing.
- On mobile, use a short vertical rise rather than opposing horizontal motion.

### 5. Sport Lab

The current static league-card grid should become a controlled preview that answers “What can I research for my sport?”

#### Interaction model

- Use text-and-icon tabs for the verified supported sports.
- Selecting a sport updates four connected regions:
  1. League or competition marks.
  2. Available market groups.
  3. A representative player/dashboard preview.
  4. Sport-specific context modules, such as position defense, pitch arsenal, maps, sets, or team form where supported.
- The selected sport persists if the visitor continues into the product tour or final call to action.
- Each tab has a clear selected state, visible focus style, accessible name, and equal click target.

#### Important content rule

The live landing page currently describes soccer, tennis, MMA, and esports as `coming soon`, while the player UI catalog contains planned or implemented coverage for some of those categories. Reconcile production availability before writing the final tab list. Planned UI documentation alone is not proof that a sport is launch-ready.

#### Original visual direction

Use a `field-to-data` transition: a subtle sport-specific field, court, diamond, rink, pitch, or map grid sits behind the preview, while the foreground remains the same Arena Props dashboard shell. This shows that the platform adapts to each sport without becoming a collection of unrelated mini-sites.

### 6. Line Coverage

This section can borrow the reference's sense of scale without duplicating its centered logo wall.

#### Arena Props treatment

- Place a horizontal `data lane` through the section.
- Verified provider marks arrive from alternating sides and lock into comparable line columns.
- The center panel demonstrates why coverage matters: fewer tabs, side-by-side lines, and visible differences.
- Add `View current coverage` rather than a generic Get Started button.

Only use provider trademarks the product is permitted to display. Do not imply an official partnership when the relationship is data coverage only.

### 7. Workflow comparison

The current Arena Props-versus-manual table should expand to three columns:

| Evaluation area | Arena Props | Manual research | Typical multi-tool workflow |
| --- | --- | --- | --- |
| Player and prop context | Connected in one research view | Gathered by hand | Split across separate products |
| Line comparison | Side-by-side where supported | Books checked individually | May require a separate odds tool |
| Recent performance | Calculated in the interface | Calculated or searched manually | Often separated from live lines |
| Sport-specific analysis | Uses sport and role context where available | Depends on the researcher's sources | Varies by product |
| Workflow continuity | Filters and research state stay together | Notes and tabs managed by the user | Context must be carried between tools |

This wording is deliberately qualitative. Do not add exact competitor prices, coverage counts, time savings, or performance advantages without a dated source and a maintenance owner.

#### Optional proof pairing

If genuine customer feedback becomes available, place one or two approved quotes beside the comparison. Until then, use an annotated product screenshot or a short “before/after workflow” illustration. Never fabricate testimonials, star ratings, profit claims, or user counts.

### 8. Plans

Keep the current three-card format and monthly/yearly control, with these changes:

- Add a short `Best for` label to each plan.
- Separate `Available now` from `Planned` or remove planned features from purchasable tiers.
- When the visitor chooses a tour item or sport, reflect it above pricing: for example, `Your NBA player research setup is included in Premium` only if that statement is true.
- Keep the featured tier visually prominent without making the other tiers look disabled.
- Explain yearly billing in plain language and show the total charge before checkout.
- Route plan buttons through the actual signup/checkout flow when available; the current dashboard route is suitable only as an interim prototype destination.

### 9. FAQ and final call to action

Preserve the existing research-platform and no-guarantee language. Add questions only when there is a real recurring objection, such as:

- Is the data live or delayed?
- Which sports and providers are currently supported?
- What is included with each paid plan?
- Can I use the same account on mobile and desktop?

The final action should use the visitor's context:

- Default: `Start researching`.
- After selecting a sport: `Explore NBA research`, for example.
- After selecting a tool: `Open player analysis`, when that route is ready.

## User-friendliness improvements across the page

### Navigation and orientation

- Keep the sticky navigation, but reduce it to the five most useful destinations.
- Add active-section feedback as the visitor scrolls.
- Use descriptive labels such as `Product Tour` and `Sports`, not vague labels such as `Tools` when multiple things qualify as tools.
- Preserve the visitor's chosen sport/tool in page state without putting sensitive data in storage.

### Scannability

- Limit most paragraphs to two or three lines at desktop width.
- Use one claim, one visual, and one action per major section.
- Put definitions next to unfamiliar metrics instead of relying on the FAQ.
- Keep dashboard labels large enough to read at the displayed preview size.

### Interaction clarity

- Selected controls need text, shape, and color differences.
- Any non-functional mock control should be visually presented as a preview, not as a clickable button.
- Interactive preview controls should update immediately and never navigate unexpectedly.
- Deep links should take visitors to the exact dashboard view promised by the control.

### Responsive behavior

- Collapse dashboard collages to one primary screen on small devices.
- Preserve the chosen tab and main benefit above any horizontally scrollable data.
- Disable sticky storytelling when it would consume most of the viewport.
- Keep pricing and comparison content as stacked cards rather than compressed tables.
- Test at narrow phone width, large phone width, tablet, laptop, and wide desktop.

### Accessibility

- All tab groups, switches, accordions, and links must be keyboard operable.
- Use visible focus rings that meet contrast requirements against black surfaces.
- Keep exact values and labels so green/red are never the only signal.
- Maintain heading order and landmarks even when sections become visually sticky.
- Announce significant preview changes with concise accessible status text, not a verbose live region.
- Reduced-motion behavior is a release requirement, not a later polish task.

### Performance

- Build preview surfaces from lightweight HTML/CSS and existing product components when practical.
- Load below-the-fold preview imagery lazily.
- Avoid background video in the hero.
- Reserve image and preview dimensions to prevent layout shift.
- Keep animation to transform and opacity where possible.

## What not to copy

- The reference's purple gradient, logo treatment, pricing-card styling, exact layouts, slogans, or wording.
- Its exact stagger timing, rotations, or dashboard collage composition.
- Named competitor claims or prices without current evidence.
- Testimonials, ratings, user totals, profit screenshots, urgency timers, or discount claims that Arena Props cannot substantiate.
- Tools such as arbitrage, +EV, alerts, or community features presented as live before implementation is complete.

## Recommended reuse of the current code

| Current file | Recommended role in the redesign |
| --- | --- |
| `src/features/landing/sections/Hero.tsx` | Retain the core layout and calls to action; use the cinematic `HeroDashboardStack` as a non-interactive product composition. |
| `src/features/landing/components/DashboardMockup.tsx` | Split into reusable shell and view-specific preview modules. |
| `src/features/landing/sections/ProductPreview.tsx` | Become the Interactive Product Tour. |
| `src/features/landing/sections/Features.tsx` | Supply the strongest existing visuals to the four-step trail and expandable gallery. |
| `src/features/landing/sections/Workflow.tsx` | Merge into the Research Trail rather than remaining a separate generic card row. |
| `src/features/landing/sections/SportsCoverage.tsx` | Become the stateful Sport Lab. |
| `src/features/landing/sections/Comparison.tsx` | Expand to the three-workflow comparison and optional verified proof. |
| `src/features/landing/sections/Pricing.tsx` | Keep the functional toggle and cards; separate live entitlements from roadmap features. |
| `src/features/landing/hooks/Reveal.tsx` | Extend with direction and distance options while preserving IntersectionObserver and reduced-motion support. |
| `src/features/landing/data.ts` | Add typed landing-tour, sport, and comparison content; do not mix it with dashboard production data. |

## Implementation sequence

### Phase 1: Content and interaction architecture

1. Verify current sports, providers, tools, routes, and prices.
2. Finalize the new section order and claims.
3. Build typed data for product-tour items and sport states.
4. Convert Product Preview and Sports Coverage into accessible tabbed experiences.
5. Remove duplicated explanations after the interactive versions are in place.

### Phase 2: Research Trail and visual polish

1. Merge the current Workflow and strongest Feature visuals into four connected steps.
2. Add directional reveal options and the gold trail.
3. Refine the hero dashboard hierarchy and screen layering.
4. Add mobile and reduced-motion variants at the same time as desktop motion.

### Phase 3: Conversion and evidence

1. Rework the comparison around verified claims.
2. Reconcile pricing entitlements with actual availability.
3. Add approved customer proof if it exists.
4. Connect calls to action to the correct signup and dashboard destinations.
5. Validate analytics events without collecting unnecessary visitor data.

## Suggested analytics questions

Track only enough to learn whether the experience helps:

- Which product-tour item is selected most often?
- Which sport is selected most often?
- Do visitors who interact with a preview reach pricing more often?
- Which plan call to action is chosen after a sport or tool selection?
- Where do visitors leave the page?

Event names should describe the interaction, not the visitor. Avoid logging player searches, betting interests, or other potentially sensitive free-form content from a landing-page preview.

## Release acceptance criteria

- A new visitor can explain Arena Props after the hero and first product-tour interaction.
- Product Tour, Sport Lab, pricing toggle, FAQ, and all calls to action work with mouse, touch, and keyboard.
- Every public sport, provider, feature, price, and metric is verified as current.
- Available and planned tools are visibly separated.
- The four-step trail alternates from the left and right on desktop without hiding content or causing layout shift.
- Reduced-motion mode presents the same information with no required animation.
- Mobile layouts retain readable dashboard labels and do not force the entire page into horizontal scrolling.
- Dashboard preview controls have stable dimensions and no unexpected navigation.
- Each call to action leads to the view or flow it promises.
- No copied competitor branding, composition, wording, or unverified comparison claim remains.

## Implemented first build slice

The implementation started with these three connected changes:

1. Convert the current Product Preview into a clickable tour using Props, Player Analysis, Trends, and Matchups.
2. Convert Sports Coverage into the Sport Lab using only verified live sports.
3. Merge Workflow with four existing feature visuals to prove the alternating Research Trail.

This slice is now implemented and tested. Comparison, pricing refinement, verified proof, hero interaction, and line coverage remain the next major phases.

### Fixed mock-data boundary for the product tour

- Every Product Tour value is defined in landing-page code as a fixed preview constant.
- The preview does not call dashboard APIs, subscribe to sportsbook feeds, read account state, or import production dashboard data.
- Interactive filters, sample windows, charts, and matchup rows only select among the fixed mock values bundled with the landing page.
- The preview browser uses an Arena Props label and clearly distinguishes sample data from connected production feeds.
- A persistent disclosure states that the tour is not connected to live dashboards, accounts, APIs, sportsbook feeds, or real user data.
- Visitors may use the Product Tour to understand the workflow, but cannot operate the real dashboard through the landing page.
