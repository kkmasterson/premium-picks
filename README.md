# Premium Picks

Premium Picks is a single React application containing the public marketing site and the sports-research dashboard.

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
- `/dashboard/players` — player directory
- `/dashboard/players/:playerId` — player details
- `/dashboard/trends` — prop trends
- `/dashboard/matchups` — game matchups
- `/dashboard/matchups/:gameId` — matchup details
- `/dashboard/projections` — projections
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

## Checks

```bash
npm run lint
npm run build
npm run preview
```

Production hosting must serve `index.html` as the fallback for dashboard URLs because this is a browser-routed single-page application.
