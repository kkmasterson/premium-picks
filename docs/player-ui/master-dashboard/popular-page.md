# Popular Page

## Status

- Required top-level Community page.
- Route: `/dashboard/popular`.
- A mock-data prototype exists; weighted ranking and production community
  integrity are not implemented.
- Desktop reference confirmed; target mobile behavior is defined below.

## Purpose in the UI

Popular is a community-discovery view ranked by weighted activity and recency.
Builder additions and saves carry more weight than basic clicks because they
show stronger intent. Pick activity may contribute when it has a precise,
abuse-resistant event definition. It is not the same as Saved: Saved contains
the current user's bookmarks, while Popular shows anonymous aggregate interest
across sports and apps.

The approved launch-weight hypothesis is:

```text
action_points = Builder add: 5
              | Save: 4
              | Valid Over/Under side selection: 3
              | Deduplicated click/view: 1

popularity_score = sum(action_points * recency_decay(action_age))
```

The `5 / 4 / 3 / 1` weights are the simple first version. The recency function
must make activity from the last few hours matter substantially more than
activity from the prior day. Its exact curve, minimum cohorts, deduplication,
and anti-abuse rules remain versioned configuration that must pass production
testing. Raw clicks cannot outweigh stronger-intent activity.

The page belongs in a separate **Community** navigation group below the
Analysis group.

## Desktop page composition

1. A compact blue title bar labels the page **Popular** and includes a Help
   control.
2. A two-part filter row sits immediately below the title bar.
3. Popular props appear in a dense two-column card grid.
4. The persistent sidebar and Pick Builder remain visible.
5. The result area scrolls vertically inside the dashboard shell.

## Filter row

- **Sports**: multi-select sport or league icons with an overflow count.
- **Apps**: multi-select sportsbook/app icons with an overflow count.

Filters update the visible cards in place. Icon-only controls require
accessible sport and app names, selected-state styling, and a clear way to
review overflow selections.

## Popular prop card

Each card is a compact, full-width interactive module with three primary
regions.

### Identity and popularity header

- Player avatar.
- Player name, position, and league/sport mark.
- Over or Under selection, line, and market name on the second line.
- Total-activity pill with a clear label.
- Matchup and event time on a secondary line.
- Optional compact league or event badge.

Total weighted activity is the defining popularity signal and remains visible
near the prop identity rather than inside the performance strip. A detail
tooltip/sheet may explain the activity types without publishing security- or
abuse-sensitive scoring rules.

### Optional consensus indicator

Cards with a sufficient valid cohort display a compact circular indicator at the upper-right. The ring
visually separates the available Over and Under percentages and prints both
values inside the circle. Cards without sufficient consensus information omit
the ring without leaving an empty placeholder.

Example: `72% Over / 28% Under`. The percentages use valid community side
selections, not page clicks, and display their sample size or an availability
explanation.

The ring requires text labels or an accessible description because color alone
cannot identify the two sides.

### Performance strip

The lower part of the card uses a heatmap-like row containing:

- L5.
- L10.
- L15.
- H2H.
- Streak.
- Average.
- Difference.
- Season where the available width permits.

Green or teal cells communicate stronger/favorable results, red communicates
weaker/unfavorable results, amber marks mixed values, and neutral gray with a
dash represents an unavailable sample. Exact values remain printed in every
cell.

### Available-app footer

- One or more app logos appear below the performance strip.
- Each app shows its current Over and Under odds in a compact stacked treatment.
- Cards may show a single app or a longer horizontal group of available apps.
- Overflow providers may collapse behind a compact count instead of wrapping
  the entire card.

## Interaction requirements

- Saving and adding to the Builder remain separate explicit actions and feed
  separate popularity events.
- Selecting the card identity opens the corresponding player analysis page at
  the represented market and line.
- Selecting an app offer targets that provider offer without triggering the
  card-level navigation.
- Sports and Apps selections persist while the user opens a player and returns
  to Popular.
- Results should preserve their scroll position when returning from a player
  detail page.

## Relationship to other pages

- **Popular** ranks weighted, recent, anonymous community activity.
- **Saved** contains only the current user's saved props, players, and games.
- **Props** is the full research table.
- **Trends** groups performance patterns.
- **Discrepancies** compares minimum and maximum lines between app groups.

Popular must remain its own Community destination because community interest is
its primary organizing signal. Written community picks, profiles, verified
records, leaderboards, and following are post-launch roadmap features.

## Responsive requirement

The supplied reference confirms a two-column desktop grid. The future
responsive layout should collapse to one card per row before reducing text or
metric readability. The performance strip may scroll horizontally at narrow
widths, while the identity header and favorite count remain fixed and visible.
Treat these mobile rules as planned behavior until a mobile reference is
available.
