# Tennis Player Page UI Outline

> **Sport:** Tennis
>
> **Competition shown:** ATP Challenger men's singles
>
> **Analysis role:** Singles player; no conventional team-sport position
>
> **Selected market:** Games Won

## Player header

- Player name is paired with handedness.
- The opponent appears as `vs` player name and ranking.
- Event time and a tennis icon replace team/league framing.
- Provider offer cards still use the shared header strip.

## Market and chart presentation

- Market tabs include Games, Games Won, Games Lost, fantasy points, break points won/returned/win percentage, aces, double faults, points, double faults-related abbreviations, and Sets Won.
- Filters adapt to Opponent, Event, and Court Type.
- The chart uses one bar per match and labels the historical opponent below each date.
- Recent-sample tiles omit season when it is not shown and mark H2H unavailable when necessary.
- Supporting Stats begins with Total Games and Sets Won.

### Break Points Won chart

The supplied Break Points Won state shows how tennis combines conversion and opportunity:

- `BP WON` is active and underlined in the market row.
- One bar represents one match.
- The green lower portion shows break points won.
- The full darker bar reaches the total break-point opportunity count shown at the top.
- The selected break-points-won count is labeled inside the colored portion.
- Green/red outcome color remains tied to the selected prop line while the darker cap preserves opportunity context.
- Date and opponent appear below each match.

### Break-point supporting stat

- `BP Win Percentage` appears as the supporting category.
- Its average is displayed beneath the label.
- The neutral gray chart expresses each match as a percentage rather than a count.
- Exact percentages appear above the bars.

## Matchup presentation

- The right column uses only Matchup and Similar Players as its large primary choices in the supplied state.
- Competition name, round, court surface/environment, and best-of format appear as chips above the player comparison.
- Players face each other in a symmetrical two-column card.
- Age, rank movement, win probability, odds, and historical win rate appear on the respective player sides.
- Player Form and H2H are collapsible rows.
- Advanced Averages includes player toggles and filters such as rank context and recent-match window.

## Player Form

When expanded, Player Form compares both players in parallel columns.

- Each player header summarizes recent match record, sets record, and games record.
- Historical matches are displayed as bordered cards.
- Each card includes date, surface/environment chip, competition name, win/loss result, opponent and rank, match score, and individual set-score pills.
- Wins and losses receive green/red treatment while set scores retain their own result colors.
- The columns may contain different numbers of available matches without breaking alignment.
- Pagination at the bottom indicates that additional form pages can be reviewed inside the card.

## Head-to-head

The expanded `H2H (Past 2 Years)` row uses a compact historical-match card:

- Date, surface/environment, and tournament appear first.
- Winner/loser treatment is explicit.
- Match score and set-by-set results are displayed together.
- The H2H count appears in the accordion label, making sample size visible before expansion.

## Advanced Averages

The Advanced Averages card is a dense, horizontally scrollable comparison table.

### Controls

- Player tabs switch which competitor is emphasized.
- A `VS Rank` control changes ranking context.
- A recent-match selector such as `Last 15` changes the sample window.

### Table presentation

- Rows segment performance by All, Hard, Clay, Grass, versus right-handed players, versus left-handed players, and H2H.
- Visible columns include win-loss record, fantasy points, dominance ratio, games won, hold percentage, and additional break-point/return metrics beyond the crop.
- Values are enclosed in compact pills.
- Green, yellow, red, blue, and neutral treatments communicate relative strength or weakness while exact values remain readable.
- The table supports horizontal scrolling instead of reducing the metric columns to unreadable widths.

### Abbreviation legend

A legend under the table explains metrics including:

- Match: win-loss record.
- FP: fantasy points.
- DR: dominance ratio.
- Games: games won/played.
- Hold %: service hold percentage.
- BP W%: break points won percentage.
- BP GU: break points given up per match.
- RPW%: return points won percentage.
- Aces: aces per match.

Keeping this legend attached to the table is important because the compact column headings would otherwise be difficult to interpret.

## Role sensitivity

Tennis should not invent positions. Useful variants are competition context instead:

- Singles versus doubles.
- Men's versus women's tour only where presentation differs.
- Surface and indoor/outdoor context.
- Best-of-three versus best-of-five.

## Additional reference needed

- Similar Players open state.
- Doubles page if supported.
- Tennis Prop History and lower game log.
