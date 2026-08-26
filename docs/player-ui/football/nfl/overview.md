# NFL Player Page UI Outline

> **Sport:** American football
>
> **League:** NFL
>
> **Visible analysis roles:** Quarterback, running back, wide receiver, tight end, and kicker
>
> **Selected market:** Extra Points

## Player header

- Player identity includes a `K` role label.
- Matchup uses team abbreviations, date/time, and an NFL mark.
- The shown offer strip contains a single wide provider card centered beneath the header.

## Market and chart presentation

- Kicker-specific market tabs include FGS, XP, KPTS, and K FS.
- The active XP market is underlined and expanded to `Extra Points`.
- Filters shown are Opponent, Season, Home/Away, and Team.
- The chart uses one bar per game, exact extra-point totals, date/opponent labels, and a dashed threshold.
- H2H is displayed as unavailable when no useful sample exists.

## Supporting presentation

- Supporting Stats uses kicker-relevant categories such as FG Made and Kicking Points.
- Averages appear beneath the category labels.

## Right-side modules

- Line Movement and Prop History.
- Primary tabs: Matchup, Defense, Similar, Injuries.
- Secondary tabs: Odds and Rankings.
- Matchup uses a team win-probability donut and moneyline/spread/total cards.
- Preseason is explicitly labeled in the contextual cards.
- No Depth Chart control is visible in the supplied NFL player-page states. It should not be treated as a required module unless a later reference explicitly confirms one.

## Role sensitivity

The supplied references confirm that NFL player pages preserve one shared shell while changing market navigation, supporting stats, chart composition, and defensive comparisons by role.

- [Quarterbacks](roles/quarterbacks.md)
- [Running backs](roles/running-backs.md)
- [Wide receivers](roles/wide-receivers.md)
- [Tight ends](roles/tight-ends.md)

The original page in this overview is a specialist example and cannot define the default NFL experience. Role coverage should include:

- Quarterback.
- Running back.
- Wide receiver and tight end.
- Kicker.
- Defensive player, if individual defensive props are supported.
- Team defense/special teams, if represented as a player-like entity.

## Additional reference needed

- Defense, Injuries, and Prop History open states.
- Complete NFL game logs.
