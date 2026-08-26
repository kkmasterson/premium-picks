# MLB Player Page UI Outline

> **Sport:** Baseball
>
> **League:** MLB
>
> **Visible analysis roles:** Position player / hitter at third base and starting pitcher
>
> **Selected market:** Hitter Strikeouts

## Player header

- Player name is followed by fielding position, throwing hand, and batting side.
- Matchup uses team abbreviations and scheduled time.
- The offer strip supports many providers in a horizontally dense row.

## Market and chart presentation

- The market row contains hitter-specific categories such as 3B, HR, Bases, Steals, Caught, BB, Hit Into, HBP, pitches seen, strikes, first-pitch seen, and first-pitch strikes.
- Some market labels have small count badges.
- The active market is underlined and expanded into the section heading `Hitter Strikeouts`.
- Filters shown are Opponent, Season, Home/Away, and Team.
- The main chart uses one bar per game with date and opponent below, exact strikeout result above, a dashed prop line, and a dashed DNP column.

## Supporting presentation

- Supporting Stats begins with Plate Appearances, Hits, and Batter Walks.
- Each supporting category displays its average before the neutral secondary chart.

## Right-side modules

- Line Movement and Prop History.
- Primary tabs: Matchup, Pitch Arsenal, Similar, Injuries.
- Secondary tabs: Odds, Lineups, Weather, Rankings.
- Matchup uses a win-probability donut and team odds cards for moneyline, spread, and total.
- Regular Season Averages continues below the visible crop.

## Lineups tab

Selecting `Lineups` preserves the player chart in the center column and replaces the right-column matchup content with two vertically stacked, baseball-specific tables.

### Starting Pitchers card

- The card header combines season pills with a two-team selector, allowing the same panel to switch year or side without leaving the player page.
- A compact pitcher identity row shows team mark, abbreviated name, throwing hand, and the currently selected comparison context.
- The table uses metric labels down the left and comparison scopes across the top. The visible scopes are full season, versus the opposing team, versus left-handed batters, and versus right-handed batters.
- Values use restrained red and green text to call attention to weaker and stronger splits while unavailable comparisons remain simple dashes.
- A short plain-language scouting callout appears below the metrics. It pairs an observation and supporting sentence with a small edge badge such as `BATTER EDGE`.
- A two-color comparison legend closes the card and explains that highlighted values are being compared with season performance.

### Batting Order & Stats card

- This card repeats the season and team controls so the batting order can be inspected independently.
- A second segmented filter row changes the statistical lens: current season, versus pitcher handedness, previous season, versus the named starter, and all-time.
- The lineup is presented as a dense ordered table rather than player cards. Each row includes batting-order number, avatar, abbreviated player name, batting side, and aligned performance columns.
- The selected page player is highlighted with accent-colored text, making their place in the opposing order immediately visible.
- Alternating row surfaces and fixed column alignment support quick vertical comparison across a full lineup.
- A small comparison legend is repeated at the bottom because this table has its own scrollable card boundary.

## Weather tab

Selecting `Weather` replaces the contextual column with a single `Ballpark Weather` card followed by the normal season-average modules.

- The venue header identifies indoor/outdoor status, city, stadium name, and an information control.
- A compact hourly selector uses pill buttons; changing the selected hour updates the condition summary and weather details in place.
- The primary condition row gives temperature oversized visual priority, with a weather icon on the left and a short condition label aligned on the right.
- The central visualization is a top-down baseball-field diagram. Wind direction is drawn over the diamond/outfield so the user can understand its relationship to play, not merely read a compass value.
- A compact detail list sits beside the field and shows wind, precipitation, humidity, cloud cover, and dew point with small category icons.
- The module ends with a plain-language interpretation strip explaining the likely baseball effect, such as wind blowing toward the outfield helping ball carry.
- This representation should preserve an unavailable or indoor-stadium state instead of displaying a misleading outdoor field forecast.

## Role sensitivity

The supplied references now confirm that the shared MLB shell resolves into substantially different hitter and starting-pitcher experiences. Pitchers do not inherit hitter market navigation or hitter supporting stats.

See [Starting Pitchers](roles/starting-pitchers.md) for the confirmed pitching variant.

MLB role files should at minimum separate:

- Starting pitchers.
- Relief pitchers.
- Position-player hitters.
- Catchers only if catcher-specific analysis differs materially.

## Additional reference needed

- Similar and Injuries open states.
- Hitter pages for other positions only if their UI differs.
- Full MLB supporting chart and game log.
- Relief-pitcher page if relievers are supported as a distinct player-page experience.
- Remaining starting-pitcher contextual tabs listed in the pitcher role document.
