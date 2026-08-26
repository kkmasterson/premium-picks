# Soccer Goalkeeper UI

> **Analysis role:** Goalkeeper
>
> **Visible designation:** GK
>
> **Selected market:** Goalie Saves
>
> **Reference completeness:** Core page, Stats, and Form confirmed

## Goalkeeper market navigation

The goalkeeper uses the shared soccer market row rather than a completely separate navigation component. Across the full page and close crops, the row visibly includes general soccer markets such as:

- Minutes.
- Goals and Goals + Assists.
- Shots and Shots on Target.
- Pass Attempts and Passes.
- Touches, Possession, and Opponent Possession.
- Assists and Crosses.
- Shot attempts, Clearances, Tackles, and Fouls Drawn abbreviations.
- Saves.
- Goals Allowed.
- Additional shot, dribble, foul, and fantasy-style abbreviations.

`SAVES` is active, underlined, and has a count badge. The readable section heading expands it to `Goalie Saves`.

## Controls and sample summaries

- The selected save line uses the standard minus/value/plus stepper.
- Provider and save controls retain their shared positions.
- Filters are Opponent, League, and Home/Away.
- L5, L10, L15, season, and H2H summary positions remain stable.
- H2H is shown as unavailable when no matchup sample exists.

## Goalie Saves chart composition

The main goalkeeper chart combines shot volume and saves:

- Each bar represents one match.
- The full bar height represents shots on target faced.
- The save count is displayed inside the colored lower portion.
- The total shots-on-target-faced value appears at the top of the full bar.
- Green indicates that the saves result cleared the selected line.
- Red marks a saves result below the line.
- A dark upper segment visually represents the difference between shots faced and saves, corresponding to goals allowed.
- The selected saves threshold remains a dashed horizontal line.
- Date and opponent remain beneath each match.

This composition lets the user distinguish workload from save output in one visualization.

## Supporting stats

Goalkeeper-specific supporting categories visibly include:

- Minutes.
- Goals Allowed.
- Shots on Target Faced.

Each label includes an average. The selected Minutes chart uses neutral gray bars, and the visible matches show repeated full-match values, making playing-time consistency immediately obvious.

## Shared contextual controls

The goalkeeper retains the soccer contextual layout:

- Line Movement and Prop History.
- Primary tabs: Matchup, Similar, Lineups, Injuries.
- Secondary tabs: Odds, Stats, Form.

The supplied Injuries crop confirms the tab and team selectors but does not expose enough of the injury content to document a goalkeeper-specific variation.

## Form view

### Last 5 Games

- The player's club is identified at the top.
- Each row shows date, home/away marker, opponent, result letter, and score.
- Wins, losses, and draws receive distinct compact result labels.

### Season Standings

- The table follows directly beneath recent form.
- Columns visibly include Rank, Team, Played, Wins, Draws, Losses, Goal Difference, and Points.
- The player's club row is highlighted with yellow text.
- The standings region supports its own vertical scrolling.
- The reusable Averages card follows below it.

## Stats view: Team Comparison

The Stats panel compares the player's team and opponent using per-game averages.

- Team names/logos anchor opposite sides of the card.
- L5, L15, and L30 pills change the comparison window.
- Attack, Possession, Defense, and Cards form a secondary category switcher.
- Each metric uses a shared horizontal comparison track with the left-team value at one side and the opponent value at the other.
- A dash is used when the opposing sample is unavailable rather than inventing a value.

### Attack

Visible metrics include Goals, Shots, Shots on Target, Shots in Box, Big Chances, Box Touches, Corners, Chances Created, and Crosses.

### Possession

Visible metrics include Possession, Passes, Pass Accuracy, and Dribbles.

### Defense

Visible metrics include Tackles, Clearances, and Saves.

### Cards and discipline

Visible metrics include Fouls Won, Offsides, Yellow Cards, and Red Cards.

## Averages

The soccer Averages component is reused beneath Form and Stats:

- The visible current sample is labeled `Last 53 Games`.
- Compact cards show soccer statistics and provider availability.
- Home and Away Averages are collapsible rows.
- The opponent row explicitly communicates when there are no games against the current opponent.

## Remaining reference needed

- Full goalkeeper game log.
- Similar and Lineups open states.
- Complete Injuries content.
- Prop History for Goalie Saves.
- Confirmation of any goalkeeper-only markets beyond the visible row.

