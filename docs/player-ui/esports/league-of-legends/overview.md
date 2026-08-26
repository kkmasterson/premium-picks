# League of Legends Player Page UI Outline

> **Category:** Esports
>
> **Game:** League of Legends
>
> **Visible analysis role:** Top
>
> **Selected market:** Maps 1-3 Kills

## Player header and market navigation

- Player name is followed by the in-game role `Top`.
- Team matchup and scheduled time appear beneath the player.
- Provider cards use series-level odds.
- The market row is a dense sequence of map ranges and metrics such as M 1-2K, M 1-2A, M 1-3K, M 1-3A, and individual-map kills/assists/damage variants.
- Filters shown are Opponent, Event, and Team.

## Series chart presentation

- Each bar represents one historical series.
- Total kills appear above the bar.
- The bar is stacked into map-level kill components labeled M1, M2, and M3.
- Green or red outer-bar treatment communicates the total prop outcome.
- The selected threshold remains a dashed horizontal line.
- Supporting Stats begins with Maps 1-3 Assists, Damage, and Healing.

### Supporting chart

- The supporting chart repeats the historical series timeline in neutral gray.
- Each series bar is stacked by M1, M2, and M3 components.
- The supporting total appears above the stack and map components remain labeled inside it.
- This preserves the same map-composition reading pattern as the selected kills chart.

## Right-side modules

- Line Movement shows multiple timestamped line entries and a directional change badge.
- Primary controls are Matchup and Player Stats.
- Secondary controls are Match Odds and Team Form.
- Matchup identifies competition, season, tier, online status, teams, and best-of format.
- A moneyline comparison uses percentages, American odds, and a shared implied-win bar.
- A `Potential Blowout` warning is visually prominent.
- Match-score odds use summary probability pills and ranked scorelines with bars.

### Per-map and alternate odds

- Per-Map Odds can show opposing team kill spreads for the selected map.
- Alt Lines use tabs for Total Kills, individual team kills, and Duration.
- A compact Over / Line / Under row represents each alternate market.
- This deeper odds content continues within the right column rather than opening a separate betting page.

## Player Stats

The Player Stats view is tailored to the visible Top role.

- A role card names `Top Lane` and gives a short explanation of the role's isolated lane, carry/tank archetypes, and matchup-dependent performance.
- A per-map mode label appears in the header.
- Record and Performance use two equal metric cards.
- Record includes win rate, maps, K/D/A, and K/D ratio.
- Performance includes champion damage, CS at 14, healing, and wards.

### Favorite Heroes

- Champions are listed with artwork and name.
- Each row shows wins/losses, a win-rate bar, win-rate text, and games played.
- The list communicates both preference and results without requiring a separate champion table.

### Team History

- The current organization appears in an Active card.
- Previous organizations follow in a separate history region.
- Team identity and tenure context remain secondary to current player-performance cards.

## Team Form

- Both teams receive compact recent W/L summaries at the top.
- A record and map-win percentage summarize the selected team's recent form.
- Matches are arranged as a vertical timeline with date and tournament tag.
- Each row shows opponent, series score, and individual map-score pills.
- Win/loss color is applied at the series and map level.

## Prop History

The supplied LoL reference confirms the empty historical-data state for a series fantasy-score market.

- Selecting `Prop History` replaces Line Movement at the top of the right column while leaving Matchup, Player Stats, Match Odds, Team Form, and the active match context below it.
- The header contains a market selector and the current line. An average line is not forced into the layout when no archived sample exists.
- Context chips still show opponent head-to-head and current match win chance, so useful matchup context remains available even without historical prop cards.
- A short scope note explains the archive window and that only standard main lines are considered.
- The history region retains the normal two-column desktop footprint: one side shows muted skeleton placeholders while the other displays the explicit empty-state message.
- The empty state uses a centered hourglass icon, `No historical data` heading, and market-specific explanation stating that no archived projections exist and more data may be added over time.
- The bordered empty card preserves the same dimensions as populated Prop History cards, preventing the rest of the contextual column from jumping upward or changing width.
- This state should be treated as valid unavailable data, not a loading error and not a reason to remove the Prop History tab.

## Gamelog: Last 15 Games

The LoL game log appears beneath the supporting chart in the primary analysis column.

- Date and opponent anchor the left side of each row.
- Columns then follow the same map-range abbreviations used by the market navigation.
- Visible columns include Maps 1-2 kills and assists, Maps 1-3 kills and assists, individual-map kills, and individual-map assists.
- Each row represents one historical series and exposes the component values behind the stacked charts above.
- The table extends horizontally and provides a scrollbar along its bottom edge.
- The interface preserves readable column widths instead of compressing the full map-stat set.
- The player header remains visible at the top while deeper primary-column content is reviewed.

This screenshot also confirms that the primary history column and contextual right column can expose different vertical sections at the same time: the game log is visible on the left while Team Form and Rosters remain visible on the right.

### Rosters

- A two-column roster card aligns the opposing teams.
- Player handles are paired with their in-game roles, such as ADC, Jungle, and Support.
- The roster provides matchup context directly below team form.

## Role sensitivity

League of Legends role files should cover Top, Jungle, Mid, ADC, and Support. Role should influence default markets and supporting stats, but map-based series visualization can remain shared.

## Additional reference needed

- Jungle, Mid, ADC, and Support examples if their page defaults differ.
- Any content below Team History or Rosters.
- Confirmation of role-specific Player Stats wording for the other four roles.
