# Premium Picks Player UI Catalog

## Purpose

This catalog maps how player information should be represented across sports before the master dashboard is built. It separates the shared dashboard shell from sport-, league-, and role-specific UI.

The documents are visual references, not backend schemas. They record what is visibly confirmed in supplied screenshots and mark missing states instead of guessing.

## Resolution order

When planning a player page, read the documents in this order:

1. Master dashboard shared shell.
2. Sport or game overview.
3. League-specific adjustments, when applicable.
4. Player analysis-role adjustments.
5. Selected market and individual player context.

Conceptually:

```text
Shared shell
+ sport defaults
+ league adjustments
+ analysis-role adjustments
+ selected market state
```

## Coverage index

See [Reference Coverage Gaps](master-dashboard/reference-gaps.md) for the prioritized screenshot checklist.

The master dashboard also requires a dedicated
[Discrepancies page](master-dashboard/discrepancies-page.md) for cross-app
minimum/maximum line comparison. This page is documented but is not yet
implemented in the current prototype.

A separate [Popular page](master-dashboard/popular-page.md) is also required in
the Community navigation group. It represents community-favorited props and is
documented separately from the current user's Saved page.

| Category | League/game | Current reference | Visible role | Status |
| --- | --- | --- | --- | --- |
| Basketball | WNBA | [WNBA overview](basketball/wnba/overview.md) | Forward | Detailed, multiple tabs and scroll states |
| Baseball | MLB | [MLB overview](baseball/mlb/overview.md) | Position-player hitter and starting pitcher | Hitter, starter, complete Pitch Arsenal filters, Lineups, and ballpark Weather documented |
| Football | NFL | [NFL overview](football/nfl/overview.md) | Quarterback, running back, wide receiver, tight end, and kicker | Five role variants documented; no Depth Chart shown |
| Tennis | ATP/US Open examples | [Tennis overview](tennis/overview.md) | Singles player | Matchup, Player Form, H2H, and Advanced Averages documented |
| Soccer | Club soccer | [Soccer overview](soccer/overview.md) | Forward, midfielder, defender, and goalkeeper | Four core roles plus full-pitch Lineups documented |
| Esports | League of Legends | [LoL overview](esports/league-of-legends/overview.md) | Top | Matchup, Player Stats, Team Form, odds, and empty Prop History documented |
| Esports | Counter-Strike 2 | [CS2 overview](esports/cs2/overview.md) | Role not shown | Matchup, Maps, Player Stats, Prop History, Rankings, and Team Form documented |
| Esports | Valorant | [Valorant overview](esports/valorant/overview.md) | Role not shown | Core series, game log, match odds, Prop History, Player Stats, and Team Form documented |

## Blocked and excluded coverage

- NBA and college basketball are currently blocked. Use the WNBA reference as their temporary basketball UI proxy.
- College football is currently blocked. Use the NFL reference as its temporary football UI proxy.
- NHL is currently blocked. It may inherit the shared player shell, but hockey-specific markets and modules remain undefined until a valid reference becomes available.
- Dota 2 currently has no data and is excluded from the planned dashboard.
- Call of Duty currently has no data and is excluded from the planned dashboard.

See [Blocked League and Proxy Coverage](master-dashboard/proxy-coverage.md) for the inheritance rules.

## Documentation rule

Do not duplicate the whole player-page specification for each position. Each sport overview records the common layout, and future role files record only the differences in market priority, supporting visuals, comparison group, and matchup interpretation.
