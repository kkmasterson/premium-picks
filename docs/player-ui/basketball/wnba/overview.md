# Player Stats Page UI Reference

> **Sport:** Basketball
>
> **League:** WNBA
>
> **Reference scope:** WNBA player props and player analysis
>
> **Dashboard planning status:** First sport-specific UI map for the future Arena Props master dashboard

## Purpose

This document records how the supplied reference application **visually represents WNBA player information** when a user moves from the Props page to a player page. It is a UI and interaction reference for designing the Arena Props basketball player page later.

It is intentionally **not** a database outline, API contract, or attempt to reproduce another product's internal calculations. The notes describe only what can be seen in the supplied screenshots.

This is the first entry in a planned set of sport-specific UI references. Each sport should receive its own document before the master dashboard is finalized so shared patterns can be separated from sport-specific analysis.

## Master dashboard planning context

The future Arena Props app will use one master dashboard shell while adapting the player analysis experience to the selected sport.

This WNBA reference helps identify two categories:

- **Shared dashboard patterns:** player identity, matchup context, prop line controls, sportsbook comparison, recent-game chart, filtering, hit-rate summaries, line movement, injuries, and saved props.
- **Basketball-specific patterns:** quarter and half filters, basketball stat markets, shot-zone court visualization, defense versus basketball position, supporting shooting stats, and offense-versus-defense basketball categories.

Future sport documents should use the same structure and clearly label their sport and league. After those maps exist, the master dashboard design can preserve the shared shell while loading the correct stat navigation, terminology, visualizations, and contextual panels for each sport.

## How to read the screenshots

- Screenshots 2-19 and 21-22 show the same WNBA player page. Most use the selected Points prop; Screenshot 20 switches to Rebounds, and Screenshot 22 shows the expanded 3-PT Attempts market state.
- The large left analysis area remains mostly fixed while the right insight column changes tabs or is scrolled vertically.
- Screenshots 3, 5, 7, and 9 are scrolled continuations that reveal content farther down the right column; they are not separate page layouts.
- Screenshot 11 repeats the Similar view and confirms its layout rather than introducing another state.
- Screenshots 13-19 are additional tab and scroll states for Rankings, Prop History, Supporting Stats, Depth Charts, and the game log.
- Screenshots 21-24 are close crops used to clarify how the basketball market-navigation row changes and scrolls horizontally.
- The red outline in Screenshot 3 is a user annotation, not part of the reference application's UI.
- Browser controls, browser tabs, the Windows taskbar, and browser bookmarks are outside the app UI.

## 1. Transition from Props to Player

### Props page presentation — Screenshot 1

The Props page uses a dense, scan-first table. Each player prop is represented as a horizontal row with:

- A player portrait, name, position, matchup, selected stat, and line grouped together in the first column.
- Sportsbook or pick-app logos and their available lines grouped in the next column.
- Compact Over and Under percentages inside one small probability card.
- Opponent defense rank shown as a colored ordinal badge.
- Recent average and difference displayed as numbers.
- L5, L10, L15, head-to-head, streak, and season results displayed as a heatmap.
- Green cells for favorable/high hit-rate results, red cells for unfavorable/low results, and yellow/orange for mixed results.
- Percentages as the primary value, with samples such as `4/4` or `4/11` shown underneath when useful.

The row is designed to let a user compare many players quickly. Selecting the player/prop transitions to a deep player analysis view while preserving the context of the chosen stat and line.

### Navigation context carried into the player page

The player page immediately repeats the important context from the selected row:

- Player identity and matchup.
- Selected market, shown here as Points.
- Selected line, shown here as 7.5.
- Available books or pick apps.
- Recent hit-rate summaries.

This avoids making the user reselect the prop after opening the player.

## 2. Overall Player Page Layout

At desktop width, the page is divided into three persistent vertical regions:

1. **Application sidebar** — global navigation and the pick builder.
2. **Primary analysis column** — player identity, prop controls, summary metrics, game chart, and supporting stats.
3. **Contextual insight column** — line movement plus switchable Matchup, Defense, Shooting, Similar, and Injuries views.

The main content sits inside a rounded application frame. A blue-to-purple header visually ties the primary and contextual columns together, while the analytical cards beneath use a dark navy surface.

The layout gives the historical player performance chart the most space. Supplemental matchup information is narrower and modular so users can switch contexts without leaving the player.

## 3. Persistent Player Header

The header remains visually consistent throughout all player screenshots.

### Identity row

- A Back control appears at the upper left.
- The player portrait sits beside the player name.
- Position and height appear as compact secondary text on the name line.
- Matchup and scheduled time are shown directly below the name.
- Team and league marks are represented with small icons rather than long labels.

### Market offer strip

Below the identity row is a horizontal strip of bordered offer cards:

- The first card shows Over and Under percentages in green and red.
- Additional cards center a sportsbook/pick-app logo and its line or odds.
- Green promotional-value pills such as `$50` or `$200` overlap the top edge of some cards.
- The cards use a dark fill, subtle green border, and consistent height so they read as comparable options.

This strip behaves visually like a compact price comparison directly attached to the player header.

## 4. Primary Analysis Column

### Stat navigation

A horizontal stat tab row appears below the header. In the WNBA example it includes:

`MIN`, `PTS`, `REBS`, `O-REB`, `D-REB`, `ASTS`, `PA`, `PR`, `RA`, `PRA`, `BLKS`, and `STL`.

The active stat is represented with brighter text and an underline. Small circular count badges appear beside some labels. Quarter or period filters (`1Q`, `1H`, `2H`, `4Q`) are separated on the right as rounded pills.

The row is horizontally compact and behaves like a market switcher, not a page-level navigation bar.

These particular stat labels are basketball-specific. Other sports should replace this row with their own market families while retaining the same compact switching pattern where appropriate.

### Extended basketball market navigation — Screenshots 21-24

The compact crop in Screenshot 21 confirms the primary player-stat row and its count badges. Screenshot 22 shows that this same navigation region can switch to a second basketball market set rather than trying to display every market simultaneously.

Across the close crops, the alternate row visibly includes `TO`, `3PM`, `3PA`, `2PM`, `2PA`, `FTM`, `FTA`, `FGM`, `FGA`, `BS`, `FP`, `DUNK-ATT`, `PF`, `DBL-DBL`, and `TRP-DBL`. Period pills remain grouped at the right side of the market navigation.

Screenshots 23-24 confirm that this row is wider than its container and can be shifted horizontally to reveal later markets. The active market keeps its underline as the row moves. This is preferable to shrinking a long list of basketball markets until the labels become unreadable.

In the shown state:

- `3PA` is active and underlined.
- The section heading changes to `3-PT Attempts`.
- A full-width notice above the tabs states `No alt line selected`.
- The line stepper displays zero.
- An `Alt Lines` selector replaces the provider-logo selector beside the stepper.
- The save star and recent-sample summary tiles retain their established positions.

This shows that the market navigation is contextual. It can present different groups of basketball props while preserving the surrounding line controls and summary layout.

### Selected prop controls

The selected market name is used as a clear section heading. Directly below it:

- A minus button, numeric line, and plus button form a stepper.
- A neighboring control shows the selected app logos and a small count for additional sources.
- A star button allows the prop to be saved.

The controls are grouped close to the chart because changing the line changes the chart's over/under interpretation.

### Filters

Opponent, Season, and Home/Away filters appear as labeled dropdowns in a single row. A compact sliders button provides additional filters. Labels sit above the controls, which keeps the control values short and easy to scan.

### Hit-rate summary tiles

Five compact tiles summarize `L5`, `L10`, `L15`, season, and `H2H` performance.

- The sample name is the tile header.
- Hit rate is displayed as the emphasized percentage.
- Average is displayed on a smaller line underneath.
- The selected sample uses a slightly brighter filled card.
- H2H can include an additional game-count label such as `4G`.

The tiles sit above and to the right of the chart rather than inside a separate card, keeping the summary attached to the selected market.

### Recent-game bar chart

The main visualization uses one vertical bar per game:

- The actual stat result appears above each bar.
- Date and opponent appear below in two short lines.
- A dashed horizontal line represents the selected prop line.
- Bars use a bright green gradient when the displayed result clears the line.
- The chart background uses a subtle green glow below the data region.
- A game with no result is displayed as a dashed, empty `DNP` column so the timeline remains intact.
- Bars are equally spaced and aligned on a shared baseline for fast visual comparison.

The chart prioritizes the raw game result while the threshold line communicates over/under performance without requiring a second chart.

### Supporting stats

A separate card begins below the main chart with the heading `Supporting Stats`. Visible column headings include Minutes, Personal Fouls, FG Made, 3-PT Made, and FT Made. This section is visually secondary and appears below the fold so it does not compete with the main prop chart.

These supporting-stat headings are specific to basketball and should not be treated as universal dashboard fields.

### Supporting-stat chart — Screenshots 17-18

When the primary column is scrolled, Supporting Stats becomes a complete secondary visualization rather than only a row of labels.

- A horizontal selector lists supporting categories and displays each category's average directly below its label.
- The selected supporting category is brighter and underlined.
- The chart repeats the same game dates and opponents used by the main prop chart.
- Bars change to a neutral gray gradient, separating supporting context from the green/red prop-result encoding.
- Each bar displays its exact supporting-stat value above it.
- The DNP game remains an empty dashed column to preserve timeline alignment.

Reusing the same timeline makes it easy to compare the selected prop against playing time or another supporting factor without learning a different chart structure.

### Rebounds chart composition — Screenshot 20

Selecting Rebounds changes more than the heading and line:

- The chart uses green for games over the selected line and red for games under it.
- Each bar shows the total rebound result at its top.
- Labels inside the bar identify offensive and defensive rebound components.
- A subtle internal division represents the composition of the total while the outer bar still communicates total height.
- The dashed prop threshold, date/opponent labels, and DNP treatment remain unchanged.
- The Rebounds summary tile in Regular Season Averages receives the active outline, matching the selected market.

This is a useful basketball pattern: a combined prop can retain one simple total bar while exposing its components inside the bar.

### Depth Charts — Screenshots 17-18

The Depth Charts card appears below Supporting Stats.

- Team pills in the header switch between the player's team and opponent.
- A legend explains short injury-status codes such as OUT, Q, DOUBT, and OFS.
- Columns represent Starter, 2nd, 3rd, and 4th depth positions.
- Rows are grouped by basketball positions such as G1, G2, F1, F2, and C.
- Each player is represented by a portrait, abbreviated name, and small action/status controls.
- The current player is highlighted with yellow text.
- An unavailable player can carry a visible status such as `OFS` directly below the name.
- The card supports horizontal overflow, indicated by the scrollbar along its bottom edge.

The presentation functions like a compact roster matrix, making lineup position and replacement order visible without leaving the player page.

### Gamelog — Screenshots 18-19

The `Gamelog - Last 15 Games` card follows the depth chart and uses a dense horizontally scrollable table.

- Date and opponent remain fixed at the left edge of the visible table.
- Basketball stat abbreviations become individual columns.
- Rows alternate subtly against the dark background for scanability.
- Opponent logos and home/away markers appear inside the opponent cell.
- DNP is repeated across the unavailable game's stat cells rather than presenting misleading zeros.
- The game log extends beyond the visible width, allowing detailed stats without compressing every column.

The main chart provides fast pattern recognition; this table provides the exact per-game detail underneath it.

## 5. Contextual Insight Column

### Line Movement / Prop History panel — Screenshot 12

The top of the right column contains a standalone tabbed card that stays above the deeper analysis tabs.

- `Line Movement` and `Prop History` are presented as two equal-width tabs.
- The active Line Movement tab has brighter text and an upward-trend icon.
- The inactive Prop History tab is muted and uses a history icon.
- A simple three-column table uses the headers `Line`, `App`, and `Time`.
- The line is rendered as plain numeric text.
- The app is rendered as a compact pill containing provider logos and a dropdown chevron.
- The timestamp is shown in a subdued rounded badge.
- The sparse layout leaves generous horizontal space and makes each recorded change easy to scan.

Only one line-movement entry is visible in the supplied state. The screenshots do not show how multiple Line Movement entries or a chart are rendered, so those behaviors should not be assumed.

### Prop History panel — Screenshot 15

Selecting `Prop History` replaces the simple line table with a summary and historical result cards.

- A market dropdown appears at the upper left.
- The current line and average line are shown together at the upper right.
- Three compact summary badges show hit count/rate, current over streak, and average difference from the line.
- A short note clarifies that only main lines are represented in this view.
- Historical games are displayed as side-by-side cards rather than table rows.
- Each game card shows date, an Over/Under result badge, game outcome, team/opponent score, historical line, and actual player result.
- Green outlines and badges communicate the shown over results, while team game outcomes retain their own win/loss colors.

The card separates **the team result** from **the prop result**, preventing a team loss from being confused with an unsuccessful player prop.

### Analysis mode tabs

Immediately below the line panel is a row of five large icon buttons:

- Matchup
- Defense
- Shooting
- Similar
- Injuries

Each button uses an icon above its label. The selected mode is communicated through brighter text/icon treatment; the card shape and dimensions remain unchanged. Switching these buttons replaces only the contextual content below them.

### Persistent Regular Season Averages card

The Regular Season Averages card appears below several contextual modes and is often revealed by scrolling the right column.

- The current-season row can expand to show small stat cards.
- Each stat card pairs an abbreviated label with a bold average.
- Available provider icons and an additional-provider count can appear below an average.
- `No lines` appears when no provider line is available.
- Other samples are accordion rows: prior season, current-season home, current-season away, and versus the current opponent.
- Each row includes its game count and a chevron.

This component is reused across modes instead of repeating the averages inside every tab.

## 6. Matchup Mode

### Initial Matchup state — Screenshot 2

The Matchup view uses stacked cards:

- **Win Predictor:** a large donut chart compares the two teams. Team logos, records, and percentages sit on either side. Green occupies the favored share and red the smaller opposing share.
- **Matchup Odds:** each team gets its own row with three equal metric cards for moneyline, spread, and total. The sportsbook/pick-app mark is placed beside the most important value, and conventional odds appear below in smaller text.
- `Odds` and `Rankings` appear as a secondary two-button switch above these cards.

### Scrolled Matchup continuation — Screenshot 3

Scrolling the right column reveals the lower part of Matchup Odds followed by Regular Season Averages. The primary chart on the left remains in the same visual state. This confirms that the right side is a long contextual panel rather than a sequence of separate pages.

### Rankings view — Screenshots 13-16

Switching the Matchup secondary control from Odds to Rankings replaces the win predictor and odds cards with schedule and standings context.

#### Last 5 Games

- The card splits into two equal team columns.
- Each column starts with a team logo and abbreviated or full team name.
- Five recent games are arranged as compact rows with date, home/away indicator, opponent logo and abbreviation, result letter, and final score.
- Wins are colored green and losses red while scores remain neutral.
- Both teams are aligned row-for-row, making recent form directly comparable.

#### Season Standings

- East and West are segmented controls in the card header.
- The active conference receives a brighter filled treatment.
- The table uses columns for Rank, Team, W-L, PCT, GB, and STRK.
- Rank is placed inside a small colored circle.
- Team logo and full team name share one cell.
- The player's team is highlighted across the row with yellow text and a slightly different surface.
- Winning and losing streaks use green and red.

Screenshots 14 and 16 show the right column scrolled farther down, exposing the complete standings table and then Regular Season Averages. The page keeps the standings compact enough to display a full conference without turning it into a separate screen.

## 7. Defense Mode

### Defense vs Position — Screenshot 4

The Defense view opens with a card titled `Defense VS Position`.

- Position and opponent are compact selectors in the title row.
- The selected stat is named prominently with the amount allowed per game below it.
- A large ordinal rank is aligned to the right and paired with a qualitative label such as `Tougher defense`.
- A horizontal tougher-to-weaker scale uses a colored marker to place the opponent visually.
- Three summary cards compare Season, Last 10, and Last 5 rank and average.
- Individual rows such as PF, FGM, 3PM, and FTM use a horizontal scale marker plus separate SZN, L10, and L5 ranks.
- Rank colors shift from red/orange for tougher results toward green for weaker results.

The UI represents defensive difficulty spatially and by color, while still retaining the exact rank and average.

### Offense vs Defense continuation — Screenshot 5

Farther down the Defense view, the `Offense vs Defense` card compares the player's team with the opponent.

- Team identities anchor opposite sides of the card.
- Each stat row places the offense rank/value at left and defense rank/value at right.
- Red and green horizontal segments meet on a shared track to show which side has the advantage.
- Labels beneath the card explain the direction of offensive and defensive advantage.
- Visible comparison rows include Points, Rebounds, Offensive Rebounds, Defensive Rebounds, Assists, and a combined Points + Assists row beginning below the crop.

The presentation is a matchup balance view, not a time-series chart.

## 8. Shooting Mode

### Shot chart — Screenshot 6

The Shooting view replaces the contextual content with a stylized half-court diagram.

- Court regions are divided into familiar shot zones.
- Each zone contains a floating badge with the player's share of made shots and the opponent's defensive rank for that zone.
- The percentage is the largest value; the rank appears beneath it.
- Court-zone fill color communicates defensive difficulty.
- Explanatory text above the court clarifies that percentages describe the player's made-shot distribution while court colors describe opponent defense.
- A legend below the court maps rank ranges from red (harder defense) to green (weaker defense).

This overlays player tendency and opponent difficulty in one visual instead of presenting two separate tables.

The half-court shot-zone view is a basketball-specific module. A different sport may need a field, rink, diamond, pitch, map, or no spatial visualization at all.

### Shooting interpretation continuation — Screenshot 7

Below the court, short written insights translate the visualization into decisions:

- Points, 3-PT Made, and 2-PT Made are separate rows.
- Each row explains the player's inside/outside distribution and references the relevant zone rank.
- A compact verdict pill appears at the far right, such as `LEAN UNDER` or `NEUTRAL`.

The text acts as an interpretation layer for users who do not want to decode the court chart themselves.

## 9. Similar Mode

### Similar-player comparison — Screenshot 8

The Similar view is titled around players at the same position against the current opponent, such as `Other Forwards vs CONN`.

- A position selector appears in the card header.
- Summary badges show how many comparable results went over and the average difference from the line.
- A table uses Player, Minutes, and Line as the main columns.
- Each player row includes portrait, name, recency, opponent, minutes, actual result, and original line.
- A thin horizontal result bar uses green for over and red for under.
- The sportsbook/pick-app icon is shown beside the historical line.
- Rows use alternating dark surfaces and generous height to fit identity and result context.

### Scrolled Similar continuation — Screenshot 9

The bottom of the table includes a fixed-looking legend for `Went over line` and `Went under line`. The next Regular Season Averages card begins immediately below it. The left analysis column is unchanged.

### Repeated Similar state — Screenshot 11

Screenshot 11 repeats the same Similar layout and confirms the header badges, table columns, result bars, and placement of the over/under legend. It does not show a distinct additional mode.

## 10. Injuries Mode

### Injury context — Screenshot 10

The Injuries view presents team-specific availability information.

- Team toggle pills appear in the card header.
- Each injury is a bordered card with a player avatar, name, position, report date, and status badge.
- The status badge is red and aligned to the far right so severity is immediately visible.
- A short narrative report appears below the identity row.
- `Without`, `With`, and `Stats` buttons sit beneath the narrative as comparison or detail controls.
- A full-width player search field appears below the injury card.
- Regular Season Averages continues beneath the injuries section.

The exact behavior of Without, With, and Stats is not shown, so only their visual grouping should be treated as confirmed.

## 11. What Remains Stable While the Right Side Changes

Across Matchup, Defense, Shooting, Similar, Injuries, and the scrolled screenshots:

- Player identity and selected prop remain visible.
- The sportsbook offer strip remains visible.
- The stat tabs, line control, filters, summary tiles, and game chart remain unchanged.
- The right-side mode buttons remain in the same order.
- Contextual content changes within the same column instead of navigating to another route.
- Scrolling exposes lower right-side content without representing a new player or new prop.

This consistency is important: the player chart acts as the analytical anchor while the user changes the question being asked on the right.

## 12. UI Patterns Worth Carrying Into Arena Props

### Information hierarchy

1. Preserve the selected player, market, and line at the top.
2. Make recent game performance the dominant visualization.
3. Keep common filters adjacent to the chart they affect.
4. Use small summary tiles for recent samples instead of additional charts.
5. Put specialized analysis into a replaceable right-side panel.
6. Reuse a collapsible averages component under multiple analysis modes.

### Visual language

- Green consistently signals over, favorable, or weaker opponent defense depending on context.
- Red consistently signals under, unfavorable, or tougher opponent defense.
- Yellow/orange communicates a middle or caution state.
- Exact numbers accompany color so meaning is not color-only.
- Pills handle short statuses, ranks, filters, and verdicts.
- Cards separate analysis types without breaking the page into unrelated screens.
- Muted labels and smaller secondary values keep dense information readable.

### Interaction behavior to preserve

- Opening a player from Props should carry the selected prop and line into the player view.
- Changing a stat should update the market title, chart, summary tiles, and contextual interpretations together.
- Changing the line should move the threshold and update over/under presentation.
- Right-side analysis tabs should swap content in place.
- The right column should support long content and clearly preserve its scroll continuation.
- Back should return the user to the prior Props context.

## 13. Design Cautions for Our Version

- Do not rely on green and red alone; retain labels, values, and symbols for accessibility.
- Avoid making the right column feel like a separate page when it scrolls. Keep its header or selected mode visually clear.
- On smaller screens, stack the primary analysis before the contextual panels so the chart remains the main focus.
- Preserve horizontal scrolling or a compact selector for long stat-tab rows rather than shrinking labels beyond readability.
- Keep chart threshold, DNP treatment, selected filters, and sample sizes explicit.
- Define tooltips for abbreviations and ranking direction in our implementation.
- Treat decision labels such as `Lean Under` as explainable summaries, with supporting context visible nearby.

## 14. Rules for Future Sport UI Maps

Create a separate reference document for each sport or league being evaluated. Every document should state:

- Sport and league.
- Props-page presentation.
- Player-page structure.
- Sport-specific stat and period selectors.
- Main historical-performance visualization.
- Matchup and opponent-analysis presentation.
- Sport-specific spatial visualization, when applicable.
- Injury and availability presentation.
- Elements shared with the master dashboard.
- Elements that must change when the selected sport changes.

The final master dashboard should be designed from the repeated patterns across these documents, not by treating the WNBA basketball layout as the default for every sport.

## Screenshot Index

| Screenshot | UI state represented | What changes from the base player view |
| --- | --- | --- |
| 1 | Props table | Dense discovery and comparison view before opening a player. |
| 2 | Player + Matchup | Base player layout, chart, line panel, win predictor, and matchup odds. |
| 3 | Matchup scrolled | Lower matchup odds and Regular Season Averages become visible. |
| 4 | Defense | Defense-vs-position ranks, averages, scales, and trend windows. |
| 5 | Defense scrolled | Offense-vs-defense comparison rows become visible. |
| 6 | Shooting | Shot-zone court combines player distribution with opponent defense rank. |
| 7 | Shooting scrolled | Written shot-profile interpretations and verdict pills become visible. |
| 8 | Similar | Comparable players, actual results, historical lines, and over/under bars. |
| 9 | Similar scrolled | Table footer legend and the averages card below it become visible. |
| 10 | Injuries | Team injury cards, status, narrative, comparison controls, and search. |
| 11 | Similar repeated | Confirms the Similar table structure; no new layout state. |
| 12 | Line Movement | Confirms the Line/App/Time table and tab relationship above Injuries. |
| 13 | Matchup Rankings | Last-five comparison and the beginning of conference standings. |
| 14 | Rankings scrolled | Full West standings and Regular Season Averages below. |
| 15 | Prop History | Historical prop-result cards, summary badges, and current versus average line. |
| 16 | Rankings continuation | Confirms recent games, full standings, highlighted team row, and averages placement. |
| 17 | Primary column scrolled | Supporting-stat chart begins and Depth Charts appears below it. |
| 18 | Depth Charts | Full roster matrix and the beginning of the Last 15 Games table. |
| 19 | Gamelog | Expanded detailed basketball game-log table with DNP handling. |
| 20 | Rebounds | Over/under bar colors with offensive and defensive rebound composition. |
| 21 | Primary market tabs | Close view confirming labels, active underline, and count badges. |
| 22 | Extended market tabs | Alternate basketball markets and the no-alt-line state for 3-PT Attempts. |
| 23 | Extended market close-up | Confirms the 3-PT Attempts state, Alt Lines control, and recent-sample tiles. |
| 24 | Extended market row scrolled | Reveals the later DBL-DBL and TRP-DBL markets and confirms horizontal overflow. |
