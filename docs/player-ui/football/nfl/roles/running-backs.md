# NFL Running Back UI

> **Analysis role:** Running back
>
> **Visible designation:** RB
>
> **Selected market:** Rushing + Receiving Yards
>
> **Reference completeness:** Core page, usage share, game log, Defense, and Similar confirmed

## Running-back market navigation

The visible running-back row includes:

- Rushing yards.
- Rush attempts.
- Rushing touchdowns.
- Receptions.
- Receiving yards.
- Targets.
- Red-zone targets.
- Receiving touchdowns.
- Quarter and half splits (`1Q`, `1H`, `2H`, `4Q`).

Count badges appear beside markets with multiple variants. The selected combined Rushing + Receiving Yards market expands to the readable heading `Rush + Rec Yds` even when the combined option is not visible in the current horizontal portion of the market row.

## Combined rushing and receiving chart

The main chart represents a combined prop without hiding its components:

- One bar represents one game.
- The lower segment contains rushing yards and is labeled `RUSH`.
- The upper segment contains receiving yards and is labeled `REC`.
- The combined rushing-plus-receiving total appears above the full bar.
- Green bars represent totals over the selected line.
- Red represents a combined total under the line.
- A dashed horizontal line represents the combined-yardage threshold.
- DNP games remain empty dashed columns.

This allows the user to see whether a result was driven by rushing production, receiving production, or a balanced combination.

## Supporting stats

Running-back supporting categories visibly include:

- Rush Attempts.
- Receiving Targets.
- Rush Yards.
- Receiving Yards.

Each category displays its average. The selected supporting category uses a neutral gray per-game chart aligned with the same timeline as the combined production chart.

## Team pass-versus-run rate

A dedicated horizontal comparison bar appears beneath the supporting chart:

- The card is labeled with the player's team, `Pass vs Run Rate`, and season.
- Pass and rush percentages appear at opposite ends.
- Two colors divide the single shared bar according to the play-call split.

This gives team-level opportunity context before the player's individual share is considered.

## Rush and target share

The next card represents how team opportunities are distributed among players.

- Rush Attempts and Targets are tab choices.
- A donut chart displays each player's share of the selected opportunity type.
- A table lists player identity, position, opportunity count, and percentage share.
- The current running back is highlighted with yellow text.
- Donut segments correspond to the player rows rather than using only one player-versus-team percentage.

## Gamelog: Last 15 Games

The running-back game log follows the share analysis.

- Date and opponent anchor each row.
- Visible columns include Rushing Yards, Rush Attempts, Rushing Touchdowns, Receptions, Receiving Yards, Targets, Red-Zone Targets, and Receiving Touchdowns.
- DNP is repeated across the relevant cells instead of being represented as zeros.
- The combined chart above can be traced back to separate rushing and receiving game-log values.

## Line Movement

- Multiple historical lines appear in the standard Line/App/Time structure.
- A directional badge on the newer line communicates the size and direction of movement.
- Previous line entries remain visible for direct comparison.

## Defense versus running back

- The position selector displays RB.
- The opponent selector identifies the defense.
- Rushing + Receiving Yards allowed per game appears beneath the selected market.
- A large ordinal rank and qualitative label such as `Solid defense` summarize the matchup.
- Season, Last 10, and Last 5 cards compare rank and average.
- Supporting rows include Rush Attempts, Targets, Rush Yards, and Receiving Yards.

## Offense versus Defense

Visible comparison rows include:

- Rushing + Receiving Yards.
- Rushing Yards.
- Rush Attempts.
- Receiving Yards.
- Receiving Targets.

The offense and defense retain the shared opposing-rank/value layout with red and green advantage tracks.

## Similar running backs

- The heading scopes results to `Other RBs` against the selected defense.
- The RB selector remains visible in the header.
- The summary can display `N/A Hit Over` when sportsbook lines are unavailable.
- Rows include player identity, recency/opponent, usage measured in carries, actual combined rushing/receiving yards, and historical line.
- `Line: N/A` is shown explicitly when a comparable prop line does not exist.
- The standard over/under legend remains below the table.

## Remaining reference needed

- Injuries and Prop History.
- Rankings if the RB state differs from the documented WR rankings view.
- Confirmation of how pushes are represented in combined-yardage bars.

