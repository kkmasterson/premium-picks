# Valorant Player Page UI Outline

> **Category:** Esports
>
> **Game:** Valorant
>
> **Visible analysis role:** Not shown
>
> **Selected market:** Maps 1-2 Kills

## Player header and market navigation

- Player handle, team matchup, scheduled time, and Valorant mark form the identity context.
- The market row contains individual-map and combined-map kill, assist, first-blood, and related abbreviations.
- Filters shown are Opponent and Event in the supplied state.

## Series chart presentation

- Each historical series is one stacked bar.
- Map 1 and Map 2 kills are labeled inside the stack, with the combined total above.
- Green represents over, red represents under, and gray represents a neutral/push-like or otherwise non-green state whose exact meaning still needs confirmation.
- Special icons beside some totals indicate additional context not defined by the screenshot.
- A Last 15 Games table begins below with detailed map-market columns.

## Last 15 Games table

- Date and opponent anchor each row.
- Individual-map kills, combined-map kills, assists, and other map-range categories occupy horizontally dense columns.
- The table reuses the same abbreviations as the market row, making chart totals traceable to exact historical values.
- Horizontal overflow is expected rather than compressing the full Valorant stat set.

## Right-side modules

- Line Movement and Prop History.
- Primary controls are Matchup and Player Stats.
- Secondary controls are Match Odds and Team Form.
- Matchup identifies the VCT competition, region/year, tier, LAN status, teams, and best-of format.
- Moneyline probabilities use a shared horizontal comparison bar.
- Match-score odds present summary outcomes and ordered exact-series-score rows.
- A lower Per-Map Odds section begins outside the visible crop.

### Complete Match Odds state

- The competition header shows VCT region/year plus Tier and LAN chips.
- Team logos, abbreviations, full names, and best-of format establish the series context.
- Moneyline probabilities and odds sit at opposite ends of one shared implied-win bar.
- Match-score summary pills show Win At Least 1 Map, Win All 2 Maps, and Lose All Maps probabilities.
- Exact series scores are ranked by likelihood and represented with colored bars and odds.
- The Per-Map Odds card explicitly shows unavailable Kills Spread and Alt Lines states when providers have no values.

## Line Movement

- Multiple line records can appear with timestamps.
- A small directional badge beside the newest line communicates the size and direction of movement.
- Older line records remain visible beneath the new line for immediate comparison.

## Prop History

Selecting `Prop History` replaces Line Movement with a compact historical-result workspace at the top of the right column while leaving the normal contextual tabs and Match Odds content below it.

- The header combines a market selector with the current line and the historical average line, making the selected history scope explicit.
- Summary chips present recent hit count and rate, current over streak, and average difference in both raw and percentage form.
- Valorant adds opponent head-to-head and current match win-chance chips beside the general prop summary.
- A short scope note explains the history window and that only standard main lines are included.
- Historical results are arranged as two cards per row in the visible desktop state.
- Each card includes date, over/under result badge, both teams, match win/loss state, implied-win percentages, and final series score.
- A bordered result box at the bottom separates the historical prop line and provider odds from the player's actual result.
- Green communicates an over result or stronger implied side, while red communicates an under/loss state; match result and prop result remain visually separate.
- The cards preserve team logos and provider marks so users can interpret the historical result without opening another page.

## Player Stats tab

Selecting `Player Stats` keeps the historical series chart and game log in the center while turning the right column into a vertically scrollable performance profile.

### Summary cards

- The section header includes a `PER ROUND` toggle, allowing the same visual structure to switch between aggregate and normalized statistics.
- Two equal-width cards divide the summary into `Record` and `Performance` rather than presenting one long metric list.
- Record groups volume and efficiency measures such as maps, kills per map, and K/D ratio.
- Performance groups per-map averages such as kills, deaths, and assists.
- Labels remain muted while positive or notable values receive green emphasis, maintaining a fast scan path through otherwise dense numeric content.

### Map Stats list

- Each map is represented by a wide image-backed card with a dark readability overlay.
- The left side anchors the map name and sample size; aligned columns on the right show kills, K/D, and assists.
- Green, amber, red, and neutral text provide relative performance cues without changing the shared card structure.
- Maps are ordered vertically in one independently scrollable list so the user can compare the complete pool without compressing each row.
- The image treatment is contextual rather than decorative: every map keeps a distinct visual identity while typography and metric positions remain fixed.

## Team Form tab

Selecting `Team Form` replaces the right-column odds view with recent team results and roster context.

### Recent form timeline

- A compact header compares both teams using recent W/L records and a games-played win-rate summary.
- The active player's team receives a simple record and map-win percentage summary before the match list.
- Each result is a timeline row with date, event or stage chip, competition label, team marks, series score, and individual map-score pills.
- Winning scores and map pills use green; losses use red. Neutral metadata remains muted so result direction is readable before the exact scores.
- Rows are separated by subtle dividers and a colored timeline edge, creating chronological rhythm without turning every result into a large card.

### Rosters

- The roster module is split into two equal team columns under team-logo headers.
- Players appear as compact avatar-and-handle rows with a small role or position indicator where available.
- Both lineups remain visible in one card, supporting quick opponent comparison directly beneath recent form.
- The right column keeps its own scroll boundary when the form timeline and both rosters exceed the visible viewport.

## Role sensitivity

No agent role is shown for this player. If Premium Picks uses Duelist, Initiator, Controller, or Sentinel groupings, we need explicit UI or product confirmation before making those groupings part of the player page.

## Additional reference needed

- Per-Map Odds populated with actual spread or alternate-line values.
- A page that explicitly displays the player's role or agent pool, if supported.
- Meaning of gray bars and special chart icons.
