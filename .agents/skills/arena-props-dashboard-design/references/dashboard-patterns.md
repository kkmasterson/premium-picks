# Arena Props dashboard patterns

## Props research listing

Give each row or mobile card five recognizable zones:

1. Player identity: headshot, player, team, opponent, and time.
2. Selection: market, line type, provider, exact line, side, and price.
3. Evidence: projection, confidence, L5, L10, L15, and H2H.
4. Context: streak, movement, selected-book moneyline, freshness, and live state.
5. Action: one clear Add to Builder control.

Use whitespace, column alignment, and typography to form the zones. Avoid outlining every zone.

Consider grouping consecutive props for the same player so the portrait and matchup do not compete in every row. Keep a sticky header and, when helpful, a sticky player column. Provide an obvious way to expand a row for deeper research.

## Preferred visual encodings

- Hit rates: one aligned evidence strip with percentages, sample counts, and optional thin progress tracks.
- Confidence: a compact horizontal meter or small ring plus the numeric score and grade.
- Projection versus line: show both on a tiny shared scale or display the delta prominently; do not present two unrelated numbers.
- Line movement: use a small sparkline with first/current values and direction.
- Over/Under: use a restrained segmented control where selection is visible through tint, text, and focus treatment.
- Freshness and availability: use a small dot plus concise status text.

Use Recharts only when it improves interpretation. Simple bars, tracks, and markers can remain CSS-native.

## Progressive disclosure

Keep scanning fields visible. Put calculation explanations, full line history, alternate books, EV breakdowns, and long H2H detail in a row expansion, popover, or research drawer. Do not hide the exact selected line, provider, side, price, projection, confidence, or key hit rates.

## Builder

The persistent Builder rail should collapse so the research table can reclaim width. Opening or closing it must not lose selections. A mixed-provider list must remain research-only and must not show one actionable combined payout.

## Responsive behavior

- Desktop: aligned research table, sticky header, expandable detail, collapsible Builder.
- Tablet: reduce secondary columns or move them into expansion before allowing uncontrolled horizontal overflow.
- Phone: readable cards with the same information hierarchy; do not miniaturize the desktop table.
- Never let the Discord prompt overlap bottom navigation or Builder controls.

## Useful modern interactions

Use only where they support the research task:

- Row hover that reveals secondary actions without shifting layout
- Animated row expansion for research detail
- Line-selector popover with grouping, freshness, and unavailable states
- Skeleton rows that match final geometry
- Save/watch controls with clear state
- Comparison mode for two or more exact offers
- Subtle live-data pulse only when the event is actually live
