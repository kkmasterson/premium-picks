# Counter-Strike 2 Player Page UI Outline

> **Category:** Esports
>
> **Game:** Counter-Strike 2
>
> **Visible analysis role:** Not shown
>
> **Selected market:** Maps 1-2 Kills

## Player header and market navigation

- Player handle is the primary identity.
- Team matchup and scheduled time appear beneath it.
- The market row uses dense map abbreviations for map kills, combined-map kills, headshots, assists, and related variants.
- Filters shown are Opponent, Event, and Team.
- High Round Maps and Blowout Maps appear as contextual toggles or indicators above the chart.

## Series chart presentation

- Each bar represents a historical series.
- The total appears above the bar and individual M1/M2 components appear within the stack.
- Green represents over, gray represents a non-over/neutral state in the visible examples, and warning/check icons annotate special map conditions.
- The threshold is a dashed horizontal line.
- A detailed Last 15 Games table begins directly below the chart with map-specific columns.

## Right-side modules

- Line Movement and Prop History.
- Primary tabs: Matchup, Maps, Player Stats.
- Secondary tabs: Match Odds and Team Form.
- Matchup identifies tournament, city/year, tier, LAN status, teams, and best-of format.
- Moneyline probability is displayed with a red/green shared bar and a Potential Blowout warning.
- Match-score odds display outcome summaries and probable series scores with colored progress bars.

### Per-map availability states

- A lower Per-Map Odds card identifies the selected map.
- Kills Spread and Alt Lines are separated into their own regions.
- The empty state uses explicit messages such as no spread odds or no alternate lines available.
- Empty availability remains inside the normal card structure so the user does not mistake missing odds for a loading failure.

## Player Stats

The Player Stats tab turns the right column into a player-performance dashboard.

- A per-round toggle appears in the card header.
- Record and Performance are presented as two equal metric groups.
- Record visibly includes maps, kills per map, K/D ratio, and HLTV rating.
- Performance visibly includes headshot percentage, headshots per map, average kills, and average deaths.
- Key values use green emphasis while labels remain muted.

### Map Stats

- Each map is a wide visual card with map artwork as its background.
- Map name and sample count appear on the left.
- Kills, kills per round, headshot percentage, and K/D are aligned as comparable columns.
- Value colors indicate stronger, mixed, or weak results.
- Cards stack vertically for Anubis, Ancient, Cache, Inferno, Nuke, Mirage, Overpass, and other maps in the player's sample.

## Maps: Map Picks

The Maps tab displays a scrollable `Map Picks` panel marked Beta and scoped to a recent time window.

- A filter control can reduce the chart to the top maps.
- Maps are ranked vertically and represented with thumbnail artwork.
- Each row includes an overall selection percentage and progress bar.
- Team-specific rows beneath each map show pick, ban, win, and timing context.
- The panel has its own internal scrollbar so map-veto research does not expand the whole page indefinitely.

## Prop History

The CS2 Prop History tab follows the shared historical-card pattern but adds esports context:

- A market selector, current line, and average line appear in the header.
- Summary badges show hit count/rate, over streak, and average difference.
- Additional chips show opponent head-to-head context and match win chance.
- Each history card shows date, prop result, teams, implied win percentages, series score, historical line, provider odds, and actual player result.
- Team win/loss and prop over/under remain visually distinct.

## Team Form tab

Selecting `Team Form` keeps the player chart and Last 15 Games table in place while replacing the right column with a ranking comparison followed by recent match history.

### Team Rankings comparison

- The comparison is a separate card above recent form rather than being folded into the match timeline.
- Two equal team columns use searchable select controls, allowing either side to be changed without leaving the player page.
- A selected team can display an ordinal world-rank badge beside the selector.
- Known roster members appear as compact handle chips beneath the selected team, fitting a five-player lineup into a small area.
- An explanatory footer acknowledges imperfect team-name matching and links the ranking source. This keeps data provenance and correction behavior visible instead of hiding uncertainty.
- An unselected side remains an explicit `Select team` state rather than rendering empty ranking metrics.

### Recent Team Form

- The section header compares both teams with compact recent W/L and games-played summaries.
- The active team receives a prominent record and map-win percentage directly below the header.
- Results are organized as a chronological timeline with date, stage or event-type chip, tournament label, team marks, and series score.
- Individual map results appear as small score pills beneath each series result.
- Green indicates series or map wins, red indicates losses, and muted metadata keeps tournament context secondary to outcome.
- A thin colored timeline edge and dividers connect the rows while preserving the compact density of the right column.
- The card scrolls independently when the match history extends beyond the available viewport.

## Role sensitivity

The supplied UI does not display a CS2 role, so no position-specific behavior is confirmed. If Premium Picks uses role-aware comparisons, likely role labels must come from another source and should not be assumed from this screenshot.

## Additional reference needed

- A page where the player's CS2 role is explicitly shown, if supported.
- Meaning and state behavior of High Round Maps and Blowout Maps.
- Per-map odds populated with actual values rather than the empty state.
- Lower Map Stats content if additional summaries follow the visible cards.
