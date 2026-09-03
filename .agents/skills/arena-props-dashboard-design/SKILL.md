---
name: arena-props-dashboard-design
description: Design or revise Arena Props dashboard pages, prop tables, filters, cards, drawers, charts, and responsive navigation in the React, Tailwind, and Radix application. Use for visual hierarchy, modern sports-data presentation, interaction design, responsive UX, or visual QA; do not use for landing-page marketing or backend-only work.
---

# Arena Props Dashboard Design

Create a calm, modern research workspace that helps users compare props quickly. Preserve the underlying product behavior while improving hierarchy, legibility, interaction, and visual encoding.

## Read the relevant guidance

- Read [references/design-system.md](references/design-system.md) for any visible dashboard change.
- Read [references/dashboard-patterns.md](references/dashboard-patterns.md) when working on props, players, Popular, Builder, projections, trends, or other data-heavy surfaces.
- Read [references/visual-qa.md](references/visual-qa.md) before accepting a substantial layout or responsive change.

Also inspect the live component, its surrounding layout, and `src/index.css`. Treat the running page as the source of truth for density, clipping, and visual balance.

## Design approach

1. Identify the user's primary task on the screen and give it the strongest visual path.
2. Separate identity, selection, evidence, context, and action through spacing and alignment before adding containers.
3. Replace raw numeric text with an appropriate compact visual when the relationship matters: a meter, micro-bar, sparkline, delta marker, or distribution.
4. Keep secondary research available through expansion, drawers, popovers, or tooltips instead of giving every value equal weight.
5. Implement with existing React, Tailwind, Radix, Lucide, and Recharts primitives unless a new dependency has a clear product benefit.
6. Verify the result in the browser at the target widths and iterate on the screenshot, not only the code.

## Arena Props invariants

- Dashboard interaction and selection use teal. Gold denotes Premium Picks identity or premium access. Green, red, and amber communicate data meaning.
- Do not create a wall of independent cards, badges, borders, or filled statistic boxes. Use color and surfaces sparingly.
- Core values must remain readable without relying on color alone. Keep core data at 11px or larger; micro-labels may be 9–10px.
- Preserve exact offer selection, provider identity, line type, Over/Under state, selected-book moneyline, movement, confidence, EV redaction, event status, and Builder identity.
- Goblin and Devil labels come only from explicit provider classification or a reliable mapping; visual treatment must not imply classification.
- Fixture screens must continue to state `Fixed demo data` and `No live connection`.
- Keep the confirmed mobile navigation order: Props, Players, Popular, Builder, More.
- The dashboard must remain usable without hover and with keyboard focus.

## Acceptance

For substantial work, deliver a browser-verified interface and run the relevant tests, lint, and production build. Report the visual decisions made, any information moved behind progressive disclosure, and any remaining layout compromise.
