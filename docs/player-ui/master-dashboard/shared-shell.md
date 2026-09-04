# Master Dashboard Visual System

## Props-led source of truth

The live Props screen defines the visual language for every `/dashboard` route. The system uses a near-black canvas, one quiet research surface, hairline dividers, compact evidence rows, and high-contrast values. Page-specific card grids and title bars are retired.

- Gold is reserved for the Arena Props identity, the selected global sport, premium access, and premium notices.
- Teal identifies page navigation, filters, tabs, focus, selections, and primary actions.
- Green, red, and amber communicate positive, negative, and mixed data meaning only.
- Every color-coded state includes a visible label, value, or accessibility description.
- Three elevation levels are available: canvas, research surface, and a restrained raised/hover state.
- Core comparison values remain 11px or larger.

The shared presentation layer is implemented by `DashboardPageHeader`, `DashboardToolbar`, `ResearchSurface`, `MetricStrip`, `EntityIdentity`, and compact status/delta primitives. They centralize hierarchy and semantics without changing provider or API contracts.

## Stable page regions

The supplied sports use the same desktop information hierarchy:

1. Global sidebar and pick builder.
2. Player header and event context.
3. Provider offer strip.
4. Sport-specific market navigation.
5. Selected market controls and filters.
6. L5/L10/L15/season/H2H summary tiles when available.
7. Recent-event performance chart.
8. Supporting stats or detailed game log below the chart.
9. Right-side Line Movement and Prop History panel.
10. Sport-specific contextual analysis tabs.

## Required top-level research pages

- Props.
- Discrepancies.
- Players.
- Trends.
- Matchups.
- Projections.
- Saved.
- Popular, under a separate Community navigation group.

The wider planned product navigation, including +EV, Parlay Builder, AI
Assistant, Bonuses, Discord, and the five-item phone navigation, is defined in
the [Product Expansion Blueprint](product-expansion-blueprint.md). Those items
remain planned or feature-gated unless their individual production evidence is
complete.

Discrepancies is a dedicated cross-app minimum/maximum line comparison page,
not a variation of the Trends page. See
[Discrepancies Page](discrepancies-page.md) for its card-grid specification.

Popular is a weighted community-activity discovery page and must remain
distinct from the current user's Saved page. See
[Popular Page](popular-page.md) for its intent- and recency-ranked card-grid
specification.

## Shared visual behavior

- The selected market is underlined in a horizontally dense market row.
- The selected prop line is adjusted with minus and plus controls.
- Provider logos are presented as compact cards or pills.
- The main chart uses one bar per historical game, match, or series.
- A dashed horizontal line represents the selected prop threshold.
- Green communicates an over or favorable state; red communicates an under or unfavorable state.
- Exact results appear on or above the bars so color is never the only signal.
- Supporting charts reuse the same event timeline when practical.
- The right column swaps contextual modules without leaving the player page.
- Intentional metric lanes may scroll horizontally and remain discoverable. Page-level horizontal overflow is not allowed.
- Desktop research uses aligned rows or tables; phone layouts use purpose-built lists and cards instead of squeezed desktop columns.
- Mobile navigation remains Props, Players, Popular, Builder, More.

## Required sport overrides

Every sport must define:

- Identity and event terminology.
- Analysis roles or the fact that positions do not apply.
- Market-navigation groups.
- Period, map, set, inning, or segment filters.
- Main bar composition rules.
- Supporting-stat categories.
- Contextual right-panel modules.
- Matchup format and competition structure.
- Game-log columns.
- Unavailable-event treatment.

## Do not force universal equivalence

- A basketball position is not equivalent to an esports role.
- Tennis does not need a team depth chart.
- A baseball pitcher and hitter require substantially different market groups.
- NFL specialists require different supporting statistics from offensive skill players.
- Esports charts may stack map-level components inside one series total.
