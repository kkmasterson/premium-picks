# Discrepancies Page

## Status

- Required top-level dashboard page.
- Planned route: `/dashboard/discrepancies`.
- Not currently implemented in the Arena Props prototype.
- Desktop reference confirmed; mobile composition remains unconfirmed.

## Purpose in the UI

This is a market-comparison workspace, not a player-detail or general Trends
view. It lets the user scan where the available minimum and maximum lines differ
across selected apps while retaining enough recent-performance context to judge
the discrepancy.

The page belongs in the **Analysis** navigation directly after **Props**.

## Desktop page composition

1. A compact blue title bar labels the page **Discrepancies** and includes a
   small Help control.
2. A single filter row sits directly below the title bar.
3. Results use a dense two-column card grid inside the main scroll region.
4. The persistent dashboard sidebar and Pick Builder remain visible.
5. The results region scrolls vertically without changing the global shell.

## Filter row

The reference shows three compact controls:

- **Sports**: multi-select represented by league or sport icons with a compact
  overflow count.
- **Min-Line Apps**: multi-select sportsbook/app icons used for the lower side
  of the comparison.
- **Diff %**: the active sort or threshold control at the right edge.

Filters should update the result grid in place. Selected app groups must remain
visually distinguishable even when logos are the only visible labels; each logo
therefore needs an accessible app name.

## Discrepancy result card

Each card is a compact, bordered module with four visual regions.

### Identity header

- Player avatar.
- Player name, position, and sport/league mark.
- Selected prop-market label.
- Matchup and scheduled time on a secondary line.
- A compact upper-right difference badge with a trend icon, difference value,
  and percentage caption.

The whole identity area should act as the entry point to the corresponding
player analysis page.

### Performance strip

A seven-cell heatmap-like row displays:

- L5.
- L10.
- L15.
- H2H.
- Streak.
- Average.
- Difference.
- Season may replace or extend the final cell where the available width permits.

Cells use the dashboard's green, amber, red, and neutral states. Exact values
remain visible so the color is supplementary rather than the sole indicator.
Unavailable samples use a neutral cell and dash instead of a zero.

### Minimum-line panel

- Labeled **Min line**.
- Shows the smallest available line prominently.
- Includes the supplying app logo and odds in a compact inline treatment.
- May show multiple apps when they share the same minimum.

### Maximum-line panel

- Labeled **Max line**.
- Shows the largest available line prominently.
- Includes the supplying app logo and odds.
- Additional matching providers collapse behind a `+N` overflow pill.

The minimum and maximum panels sit side by side and share equal visual weight.

## Reusable states

- Positive/favorable performance cells: green or teal.
- Negative/unfavorable cells: red.
- Mixed or borderline results: amber.
- Missing samples: neutral gray with a dash.
- Large and small discrepancies use the same card anatomy; sorting changes
  their order, not their structure.
- Cards from different sports share the shell while retaining sport-specific
  market names, icons, and event terminology.

## Relationship to existing pages

- **Props** is the broad prop research table.
- **Trends** groups notable performance patterns.
- **Discrepancies** specifically compares the minimum and maximum market lines
  available from selected app groups.

The Discrepancies page should remain separate from Trends because its primary
interaction is cross-app line comparison rather than performance ranking.

## Responsive requirement

The supplied reference confirms the dense two-column desktop grid only. For the
future responsive build, collapse to one card per row before compressing card
content below readable widths. Keep the performance strip horizontally
scrollable if necessary and stack the Min line and Max line panels only on the
narrowest layout. Treat these mobile rules as planned behavior until a mobile
reference is supplied.
