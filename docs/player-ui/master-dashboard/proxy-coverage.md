# Blocked League and Proxy Coverage

## Purpose

Some planned leagues are currently blocked from direct inspection. Arena Props can still plan their page structure by inheriting a validated same-sport reference while keeping league-specific behavior unconfirmed.

This is a planning fallback, not evidence that every market, period, ranking, or contextual module is identical.

## Coverage rules

| Target league | Current state | Temporary UI proxy | Safe to inherit | Must remain unconfirmed |
| --- | --- | --- | --- | --- |
| NBA | Blocked | WNBA | Basketball shell, game chart, quarters/halves, common basketball modules | Exact market list/order, league labels, standings, season context, provider availability |
| College basketball | Blocked | WNBA | Basketball shell, game chart, basketball stats, defense/shooting patterns | College-specific rankings, conferences, tournament context, exact markets and samples |
| College football | Blocked | NFL | Football shell, position-aware markets, game chart, defense comparison, standings pattern | College rankings, conferences, bowls/playoffs, exact markets, team/season context |
| NHL | Blocked | Shared master shell only | Header, offer strip, line controls, recent samples, history chart, Line Movement, Prop History | Hockey positions, periods, markets, rink visuals, goalie/skater differences, standings and matchup modules |

## Basketball inheritance

NBA and college basketball may initially resolve from:

```text
Shared player shell
+ WNBA basketball UI patterns
+ target-league label
+ explicitly confirmed target-league overrides later
```

Do not assume identical stat-tab order, season structure, standings, or contextual analysis until those leagues are accessible.

## Football inheritance

College football may initially resolve from:

```text
Shared player shell
+ NFL position-role patterns
+ college-football label
+ explicitly confirmed college overrides later
```

Quarterback, receiver, running-back, kicker, and defense concepts can share the NFL structural model. College rankings, conferences, postseason structure, and exact prop availability remain separate concerns.

## NHL limitation

NHL does not have a validated same-sport proxy in the current catalog. Reusing WNBA, NFL, or MLB sport-specific stats would create a misleading hockey reference.

For NHL, reuse only universal presentation components:

- Player identity and matchup header.
- Provider offer strip.
- Market selection container.
- Line controls and filters.
- Recent-sample tiles.
- Threshold-based history chart.
- Supporting-stat container.
- Line Movement and Prop History.
- Replaceable contextual right column.

Hockey-specific market navigation, positions, period controls, rink analysis, skater/goalie charts, and matchup modules should remain placeholders until valid NHL information is available.

## Excluded games

### Dota 2

No usable data is available. Dota 2 is excluded from the planned dashboard and should not appear as an unfinished documentation requirement.

### Call of Duty

No usable data is available. Call of Duty is excluded from the planned dashboard and should not appear as an unfinished documentation requirement.

