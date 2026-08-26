# Player UI Reference Coverage Gaps

## Current scope decisions

- Call of Duty has no data and is not planned. It is not a documentation gap.
- Dota 2 has no data and is not planned. It is not a documentation gap.
- NBA and college basketball are blocked and temporarily inherit the WNBA basketball reference.
- College football is blocked and temporarily inherits the NFL reference.
- NHL is blocked. It can inherit the shared shell, but hockey-specific content must remain undefined.

## Deferred backlog

Everything in this section is intentionally deferred. These references may be
captured later when access or a meaningful UI difference becomes available,
but none of them block master-dashboard design or implementation.

### Blocked leagues requiring later validation

- [ ] NBA league-specific differences when access becomes available.
- [ ] College basketball league-specific differences when access becomes available.
- [ ] College football league-specific differences when access becomes available.
- [ ] NHL sport-specific markets, roles, charts, and contextual modules when access becomes available.

The proxy rules allow work on shared structure while keeping unconfirmed league behavior clearly labeled.

### Optional role variants

- [ ] WNBA guard and center only if default ordering, defense, shooting, or Similar behavior differs from the documented forward.
- [ ] MLB relief pitcher only if the page differs materially from starting pitchers.
- [ ] Tennis doubles only if supported.
- [ ] LoL Jungle, Mid, ADC, and Support only where Player Stats wording or default markets differ.
- [ ] CS2 and Valorant role/agent-role presentation only if the app explicitly provides it.

### Optional sport-specific detail captures

### MLB

- [ ] Full hitter and pitcher game logs.

### NFL

- [ ] Complete quarterback and receiver game logs.
- [ ] Confirmation of the quarterback supporting-chart stacked values.

### Tennis

- [ ] Lower tennis game log.

### Soccer

- [ ] Full field-player and goalkeeper game logs.
- [ ] Complete goalkeeper Injuries state.

### CS2

- [ ] Per-map odds with real values instead of an unavailable state.
- [ ] Explanation or tooltip for High Round Maps and Blowout Maps.

### Valorant

- [ ] Per-map odds with real values.
- [ ] Explanation or tooltip for gray bars and special chart icons.

### League of Legends

- [ ] Any content below Team History or Rosters, if present.

## Reusable states that do not need repeating for every role

These patterns are already documented elsewhere and only need another screenshot when a sport changes them substantially:

- Injuries.
- Line Movement.
- Prop History card structure.
- Similar-player tables.
- Rankings and standings.
- Generic sportsbook offer cards.
- Common filters and recent-sample tiles.

Avoid capturing every shared tab for every position. Prioritize screenshots that show a new market group, chart composition, sport-specific module, or role-sensitive comparison.
