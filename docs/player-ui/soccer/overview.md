# Soccer Player Page UI Outline

> **Sport:** Soccer
>
> **League:** Club competition not fully identified in the screenshot
>
> **Visible analysis roles:** Forward, midfielder, defender, and goalkeeper
>
> **Selected market:** Shots Attempted

## Player header

- Player name is followed by a compact position label.
- Club matchup, scheduled time, and soccer mark appear beneath it.
- The provider comparison supports numerous cards in a horizontally dense strip.

## Market and chart presentation

- Visible markets include Minutes, Goals, Goals + Assists, Shots, Shots on Target, Pass Attempts, Passes, Touches, Possession, Opponent Possession, Assists, and Crosses, with more markets continuing beyond the crop.
- Count badges identify some market groups.
- Filters adapt to Opponent, League, and Home/Away.
- The main chart uses one bar per match with result, date, opponent, and threshold.
- Supporting Stats begins with Minutes, Shots on Target, and Goals.

## Right-side modules

- Line Movement and Prop History.
- Primary tabs: Matchup, Similar, Lineups, Injuries.
- Secondary tabs: Odds, Stats, Form.
- Matchup uses a win predictor and club odds cards.
- Soccer odds use moneyline, handicap, and total terminology.
- Averages begins below the shown odds card.

## Lineups tab

Selecting `Lineups` replaces the contextual right column with a vertically oriented full-pitch formation comparison while preserving the player analysis chart in the center column.

- The card header names the module and displays a status pill such as `Previous`, making the lineup's confidence and recency visible before the formation.
- When confirmed lineups are unavailable, a high-contrast warning explains that the display uses each team's recent lineup and that the eventual confirmed selection may differ.
- The warning must remain attached to the formation card; projected or previous lineups should never be styled as confirmed data.
- Both teams share one full-field diagram and face inward from opposite ends, allowing the user to understand likely positional matchups spatially.
- Each team receives a compact abbreviation-and-formation label near its end of the field, such as `4-2-3-1` or `4-3-3`.
- Player markers use team-colored shirts, kit numbers, and compact player names. Contrasting kits keep the two lineups distinguishable across the same pitch.
- Players are placed according to formation lines rather than in a generic roster grid: goalkeeper, defenders, midfield lines, and forwards occupy their expected field regions.
- White field markings, alternating grass bands, and clear penalty areas provide positional landmarks without competing with the player markers.
- The formation card uses most of the right-column width and a tall fixed visual region; normal Averages content continues beneath it.
- On narrower layouts, the pitch should scale proportionally or become internally scrollable rather than collapsing player labels into overlapping markers.

## Role sensitivity

Future soccer role files should cover:

- [Goalkeeper](roles/goalkeepers.md) — now documented.
- [Defender](roles/defenders.md) — now documented.
- [Midfielder](roles/midfielders.md) — now documented.
- Forward.

The role should change default market order, supporting categories, comparison group, and relevant matchup modules without changing the master shell.

## Additional reference needed

- Similar and Injuries open states.
- Full soccer market row and detailed game log.
