# NFL Tight End UI

> **Analysis role:** Tight end
>
> **Visible designation:** TE
>
> **Selected market:** Receptions
>
> **Reference completeness:** Core page and receiving chart confirmed

## Relationship to the receiver template

The tight-end page uses the NFL receiving template already established by wide receivers. It should be implemented as a role configuration of the shared receiving UI rather than a separately designed page.

Confirmed shared behavior includes:

- Receptions as a primary market.
- Receiving yards, targets, red-zone targets, and receiving touchdowns in the market row.
- Combined rushing/receiving touchdown and yardage markets later in the row.
- Period pills aligned to the right of the horizontally scrollable market navigation.
- Opponent, Season, and Home/Away filters above the chart.
- The shared Matchup, Defense, Similar, Injuries, Odds, and Rankings contextual controls.

## Receptions chart

- One stacked bar represents each game.
- The green lower segment shows completed receptions.
- A darker upper segment extends the bar to total receiving targets.
- The complete target total appears above the stack while the reception value appears inside the green region.
- The dashed prop line crosses the chart at the selected receptions threshold.
- A zero-reception under can appear as a small red bar while the opportunity layer is absent or minimal.
- Dashed DNP columns remain in the same timeline positions as other NFL roles.

This composition lets the user distinguish low receiving output caused by limited usage from low conversion on a larger target sample.

## Supporting Stats

The visible tight-end supporting categories are:

- Receiving Targets.
- Receiving Yards.
- Receiving Touchdowns.

Each category shows an average above the neutral gray supporting chart. The chart preserves the same game order and stacked opportunity pattern as the selected-market view where applicable.

## Role-sensitive behavior

- The player header displays `TE` and otherwise follows the shared NFL identity structure.
- Defense and Similar views should resolve the comparison position to tight end when position-aware data is available.
- The page should not silently mix tight ends into a wide-receiver comparison label, even though both roles reuse the same receiving components.
- A lack of TE-specific comparison data should use the established unavailable or `N/A` state rather than falling back to WR without disclosure.

## Contextual column

- The visible Matchup state uses the standard NFL win-probability donut and team moneyline, spread, and total cards.
- Regular Season Averages continues below the matchup cards.
- No Depth Chart tab or module is visible in the supplied tight-end reference.

## Remaining reference needed

- Tight-end Defense or Similar open state only if the position labeling or comparison population differs from the wide-receiver pattern.
- Complete tight-end game log only if its column set differs from the receiver game log.
- Injuries and Prop History only if their content differs materially from the shared NFL states.
