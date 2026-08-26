# NFL Wide Receiver UI

> **Analysis role:** Wide receiver
>
> **Visible designation:** WR
>
> **Selected market:** Receptions
>
> **Reference completeness:** Core page, full visible market navigation, Defense, Similar, and Rankings confirmed

## Wide-receiver market navigation

The visible row combines rushing and receiving markets:

- Rushing yards, attempts, and touchdowns.
- Receptions.
- Receiving yards.
- Targets.
- Red-zone targets.
- Receiving touchdowns.
- Combined rushing and receiving touchdowns.
- Combined rushing and receiving yards.
- Longest rush.
- Longest reception.
- Fumbles and additional abbreviated markets.

Quarter and half pills (`1Q`, `1H`, `2H`, `4Q`) remain aligned on the right. The market row scrolls horizontally to reveal the later receiving and combined markets.

The final close crop confirms the later ordering as red-zone targets, receiving touchdowns, combined rushing/receiving touchdowns, combined rushing/receiving yards, longest rush, longest reception, fumbles, and the final abbreviated market before the period pills. The crop also confirms that provider cards remain fixed above while the market row exposes its later options.

## Receptions chart composition

The Receptions chart overlays outcome and opportunity:

- One bar represents one game.
- The green lower segment shows completed receptions.
- A darker upper segment extends the bar to the target total.
- The target total is labeled at the top of the full bar.
- The reception count is labeled inside the green portion.
- The prop threshold crosses the reception portion as a dashed line.
- DNP games remain dashed empty columns.

This lets the user see whether a low reception result came from low usage or failed conversion without needing a separate chart.

## Supporting stats

Wide-receiver supporting categories visibly include:

- Receiving Targets.
- Receiving Yards.
- Receiving Touchdowns.

Each category displays an average. The lower supporting chart uses neutral gray bars and retains the same game timeline.

## Defense versus wide receiver

- The position selector displays WR.
- The opponent selector displays the defending team.
- The selected Receptions market shows allowed-per-game context and a large opponent rank.
- Qualitative weaker/tougher language and a scale marker reinforce rank direction.
- Season, Last 10, and Last 5 cards compare rank and average.
- Supporting defensive rows include Targets, Receiving Yards, and Receiving Touchdowns.

## Offense versus Defense

The lower comparison card includes visible rows for:

- Receptions.
- Receiving Yards.
- Receiving Targets.
- Receiving Touchdowns.
- Pass Yards and additional related categories below the crop.

The team's offensive rank/value appears opposite the defense rank/value on shared red/green tracks.

## Similar wide receivers

- The heading scopes the comparison to `Other WRs` against the current defense.
- A WR selector remains visible in the header.
- The summary can explicitly report `N/A Hit Over` when comparable lines are unavailable.
- Rows contain player identity, recency/opponent context, usage, actual receptions, and historical line.
- Usage is represented with target counts.
- `Line: N/A` is shown instead of inventing an over/under result.
- The over/under legend remains at the bottom of the table.

## Rankings

- `Last 5 Games` compares the two teams in parallel columns with date, opponent, result, and score.
- Season Standings uses NFC/AFC segmented controls.
- Columns include Rank, Team, W-L, PCT, GB, and STRK.
- The player's team row is highlighted in yellow.
- The standings card has its own vertical scrolling when the conference list exceeds the available height.
- Regular Season Averages follows beneath the standings.

## Remaining reference needed

- Full receiver game log.
- Injuries and Prop History.
- Confirmation of how pushes or missing historical lines affect the receptions chart.
