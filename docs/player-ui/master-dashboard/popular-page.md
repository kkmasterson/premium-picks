# Popular Page

## Status

- Required top-level Community page.
- Planned route: `/dashboard/popular`.
- Not currently implemented in the Arena Props prototype.
- Desktop reference confirmed; mobile composition remains unconfirmed.

## Purpose in the UI

Popular is a community-discovery view that surfaces props receiving the most
user favorites. It is not the same as Saved: Saved contains the current user's
bookmarks, while Popular shows community interest across sports and apps.

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
- Blue favorite-count pill with a star icon.
- Matchup and event time on a secondary line.
- Optional compact league or event badge.

The favorite count is the defining popularity signal and remains visible near
the prop identity rather than inside the performance strip.

### Optional consensus indicator

Some cards display a compact circular indicator at the upper-right. The ring
visually separates the available Over and Under percentages and prints both
values inside the circle. Cards without sufficient consensus information omit
the ring without leaving an empty placeholder.

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

- Selecting the star/favorite control adds or removes the prop from the Pick
  Builder and exposes a visible selected state.
- Selecting the card identity opens the corresponding player analysis page at
  the represented market and line.
- Selecting an app offer targets that provider offer without triggering the
  card-level navigation.
- Sports and Apps selections persist while the user opens a player and returns
  to Popular.
- Results should preserve their scroll position when returning from a player
  detail page.

## Relationship to other pages

- **Popular** ranks or surfaces community-favorited props.
- **Saved** contains only the current user's saved props, players, and games.
- **Props** is the full research table.
- **Trends** groups performance patterns.
- **Discrepancies** compares minimum and maximum lines between app groups.

Popular must remain its own Community destination because community interest is
its primary organizing signal.

## Responsive requirement

The supplied reference confirms a two-column desktop grid. The future
responsive layout should collapse to one card per row before reducing text or
metric readability. The performance strip may scroll horizontally at narrow
widths, while the identity header and favorite count remain fixed and visible.
Treat these mobile rules as planned behavior until a mobile reference is
available.
