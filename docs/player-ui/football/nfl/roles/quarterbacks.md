# NFL Quarterback UI

> **Analysis role:** Quarterback
>
> **Visible designation:** QB
>
> **Selected market:** Longest Completion
>
> **Reference completeness:** Core page, line movement, and Defense confirmed

## Quarterback market navigation

The quarterback row combines passing and rushing markets. Across the supplied screenshots it visibly includes:

- Passing yards.
- Passing touchdowns.
- Pass attempts.
- Pass completions.
- Interceptions.
- Rushing yards.
- Rush attempts.
- Rushing touchdowns.
- Combined touchdown and yardage abbreviations.
- Longest rush.
- Longest completion.
- Completion percentage.
- Fumbles and additional abbreviated markets.

The row extends horizontally. Count badges show where multiple variants are available, and the active `LONG COMP` label is underlined before expanding to the readable heading `Longest Completion`.

## Selected market and summary behavior

- The selected line uses the shared stepper and provider controls.
- Filters remain Opponent, Season, and Home/Away in the shown state.
- L5, L10, L15, season, and H2H cards retain their shared locations.
- Samples can show `N/A` when the active season has not produced a usable average.
- Changing the displayed line changes the hit-rate and average interpretation without changing the surrounding layout.

## Main chart

- One bar represents one game.
- Exact longest-completion distance appears above the bar.
- A dashed horizontal threshold represents the selected line.
- Green bars communicate results over the line.
- DNP or unavailable games remain as dashed empty columns.
- Date and opponent are shown below each bar.

## Supporting stats

Quarterback supporting categories visibly include:

- Pass Completions.
- Pass Attempts.
- Pass Yards.

The secondary chart uses neutral gray tones. Some bars contain a lighter lower segment and a darker upper segment with separate values, visually connecting a selected passing result with its companion volume. The exact stacking rule is not fully established by the screenshots, so it should be confirmed before implementation.

## Line Movement

- Multiple line records can appear in a vertically scrollable table.
- Each record retains Line, App, and Time columns.
- Small green upward or red downward badges annotate line direction.
- The visible examples show adjacent historical lines and timestamps rather than replacing the older entry.

## Defense versus quarterback

The Defense card is position-aware:

- The position selector displays QB.
- The opponent selector displays the defending team.
- The selected market name and amount allowed per game appear at the top.
- A large ordinal rank and qualitative tougher/weaker label appear on the right.
- Season, Last 10, and Last 5 cards compare rank and average.
- Supporting defensive rows include Pass Completions, Pass Attempts, and Pass Yards, each with season/recent ranks on a tougher-to-weaker scale.

## Offense versus Defense

The lower comparison card places the quarterback's offense against the opponent defense. Visible rows include:

- Longest Completion.
- Pass Yards.
- Pass Attempts.
- Pass Completions.
- Passing touchdowns and additional passing categories below the crop.

Red and green segments meet on a shared track, with offensive and defensive ranks and values anchored to opposing sides.

## Remaining reference needed

- Full quarterback supporting chart and game log.
- Similar and Injuries states.
- Rankings and Prop History.
- Confirmation of the secondary-chart stacked values.

