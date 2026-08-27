# Arena Props

Arena Props is a single React application containing the public marketing site and the sports-research dashboard.

## Requirements

- Node.js 20 or newer
- npm

## Development

```bash
npm ci
npm run dev
```

Vite serves the app at `http://localhost:3000` by default.

## Routes

- `/` — marketing landing page
- `/dashboard/props` — player props
- `/dashboard/discrepancies` — cross-provider line discrepancies
- `/dashboard/players` — player directory
- `/dashboard/players/:playerId` — player details
- `/dashboard/trends` — prop trends
- `/dashboard/matchups` — game matchups
- `/dashboard/matchups/:gameId` — matchup details
- `/dashboard/projections` — projections
- `/dashboard/popular` — community-popular props
- `/dashboard/saved` — saved research
- `/dashboard/help` — dashboard help

`/dashboard` redirects to `/dashboard/props`. Unknown URLs redirect to the landing page.

## Project structure

```text
src/
  app/                 Application routing and route-level theming
  components/ui/       Shared shadcn UI primitives
  features/landing/    Landing-page sections, components, hooks, and mock data
  features/dashboard/  Dashboard layout, screens, components, state, data, and types
  hooks/               Shared hooks
  lib/                 Shared utilities
```

The two surfaces use route-specific CSS variables so their original colors and component styling remain isolated while sharing a single Tailwind build.

## Player research screens

Player routes resolve a typed screen profile from the player's competition and position. The shared player shell owns identity, provider offers, market controls, history charts, supporting stats, line movement, and responsive behavior; each profile supplies its market groups, period controls, supporting categories, and contextual modules.

Spatial modules use typed, normalized coordinate layouts rather than grid flow. Basketball shot zones are anchored to a basket-at-the-bottom half court, and soccer players are assigned to role-correct 4-3-3 formation slots. Sports without a validated field, court, rink, or map overlay remain chart/table based or explicitly unavailable.

The selected research state is deep-linkable:

```text
/dashboard/players/:playerId?market=:marketKey&line=:number&period=:periodKey
```

Invalid or unavailable query values are replaced with the profile's canonical defaults. Props and research-drawer links carry the selected market and line into this route.

Current profiles cover basketball (WNBA plus NBA/NCAAB proxies), football roles, MLB hitters and starting pitchers, the NHL shared-shell placeholder, soccer field and goalkeeper roles, tennis singles, and LoL/CS2/Valorant series layouts. Dota 2 and Call of Duty are intentionally excluded.

Popular, Discrepancies, and player-research cards feed one persistent Pick Builder. Selections retain the chosen Over/Under side and provider across dashboard navigation and browser refreshes. The builder is a fixed wide-screen rail and becomes an accessible drawer when the viewport cannot fit the rail without squeezing the research workspace.

## Checks

```bash
npm run lint
npm test
npm run build
npm run preview
```

Production hosting must serve `index.html` as the fallback for dashboard URLs because this is a browser-routed single-page application.

## Product documentation

- [Landing page experience plan](docs/landing-page/experience-plan.md)
- [Player UI catalog](docs/player-ui/README.md)
- [Data platform documentation](docs/data-platform/README.md)
