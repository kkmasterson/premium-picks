# MLB Starting Pitcher UI

> **Analysis role:** Starting pitcher
>
> **Visible player designation:** SP, RHP / RHB
>
> **Selected market:** Pitching Outs
>
> **Reference completeness:** Core page and complete Pitch Arsenal confirmed

## Shared-shell adaptation

- The identity row adds starter designation, throwing hand, and batting side.
- The matchup and provider strip retain the shared MLB page structure.
- The main history unit remains one game/start per bar.
- Line Movement, Prop History, Matchup, Similar, Injuries, Odds, Lineups, Weather, and Rankings retain the general MLB contextual positions.

## Pitcher market navigation

The visible pitcher row includes:

- IP.
- Pitches.
- K's.
- Hits allowed.
- Pitcher walks.
- Earned runs.
- Pitching outs.
- Fantasy-point variants for different providers.
- NRFI.
- First-inning pitching, strikeout, and hits-allowed markets.
- Batters faced.
- Additional markets continuing beyond the visible crop.

Small count badges appear beside markets with multiple available variants. `PO` is active and underlined in the supplied state, while the readable section heading expands it to `Pitching Outs`.

## Controls and recent-sample summary

- The selected line uses the shared minus/value/plus stepper.
- Provider selection and save controls retain the shared positions.
- Filters are Opponent, Season, Home/Away, and Team.
- L5, L10, L15, season, and H2H tiles display hit rate and average.
- H2H can use a compact game-count label.

## Main pitching-outs chart

- One bar represents one pitching appearance/start.
- Exact outs appear above each bar.
- Green bars represent results above the selected line.
- Red represents a result below the selected line.
- The dashed threshold crosses every bar at the selected pitching-outs line.
- Date and opponent appear below each bar.
- Bar width, spacing, and labels match the hitter chart so the sport retains a consistent visual language.

## Supporting stats

The visible starting-pitcher Supporting Stats selector begins with:

- Innings Pitched.
- Total Pitches.

Each category displays its average beneath the label. The selected supporting category is underlined, and its per-game results use neutral gray bars aligned to the same start history as the main chart.

## Pitch Arsenal module

Selecting `Pitch Arsenal` replaces the normal Matchup content in the right column.

### Pitch-mix summary

- Season pills switch between the current and previous season.
- The pitcher identity and throwing hand appear in the card header.
- A donut chart represents pitch-type usage.
- The year is centered inside the donut.
- A color-keyed legend lists each pitch and its percentage.
- The visible pitch types are Sinker, Slider, Cutter, Fastball, Curveball, and Changeup.

The donut prioritizes pitch distribution rather than pitch effectiveness.

### Batters vs Pitch Arsenal

- A second card compares opposing batters against the selected pitch mix.
- Filter chips allow All or an individual pitch type.
- The visible abbreviations correspond to the pitch types used in the donut.
- Batters appear in batting-order rows with portrait, name, and batting handedness.
- Columns shown include plate appearances, pitch count, strikeout percentage, and wOBA.
- A footer legend indicates that color treatment compares the batter with season performance.

This module combines the pitcher's usage profile with opponent-batter performance without leaving the player page.

### Pitch-type filter behavior

- The chip row is generated from the selected pitcher's available arsenal rather than showing a fixed universal list.
- `All` is the default and uses a high-contrast filled state; individual pitch chips use compact outlined states until selected.
- Selecting a pitch filters the batter table in place while preserving batting-order rows, aligned columns, comparison colors, and the footer legend.
- The required abbreviation mapping is:

| Chip | Pitch label |
| --- | --- |
| `FA` | Fastball |
| `CH` | Changeup |
| `SL` | Slider |
| `CB` | Curveball |
| `SI` | Sinker, when present |
| `CT` | Cutter, when present |

- The UI may display only a subset such as `FA`, `CH`, `SL`, and `CB` when those are the relevant pitch types for the selected pitcher.
- Full pitch names should remain available to accessible labels or tooltips so the abbreviation-only chip row is not ambiguous.
- If a pitch has no usable batter sample, keep the selected filter visible and show an explicit unavailable state rather than silently returning the `All` table.

### End of module

The batter table, comparison legend, and following Regular Season Averages card are the confirmed end of Pitch Arsenal content. No additional hidden Pitch Arsenal summary is required below this state.

## Remaining screenshots for a complete pitcher reference

The core starting-pitcher design is sufficiently documented. The following would complete it:

- Full Supporting Stats and the pitcher game log.
- Prop History for a pitcher market.
- Similar and Injuries open states.
- Lineups, Weather, and Rankings open states.
- A relief-pitcher page, but only if relievers use a meaningfully different layout or market set.
