import { Navigate, Route, Routes } from 'react-router'
import { RouteTheme } from '@/app/RouteTheme'
import DashboardLayout from '@/features/dashboard/DashboardLayout'
import { MatchupsPage, GamePage } from '@/features/dashboard/pages/MatchupsPage'
import { PlayerPage } from '@/features/dashboard/pages/PlayerPage'
import { PlayersPage } from '@/features/dashboard/pages/PlayersPage'
import { ProjectionsPage } from '@/features/dashboard/pages/ProjectionsPage'
import { PropsPage } from '@/features/dashboard/pages/PropsPage'
import { HelpPage, SavedPage } from '@/features/dashboard/pages/SavedPage'
import { TrendsPage } from '@/features/dashboard/pages/TrendsPage'
import { DiscrepanciesPage, PopularPage } from '@/features/dashboard/pages/DiscoveryPages'
import LandingPage from '@/features/landing/LandingPage'

const landingDescription =
  'Research player props, compare sportsbook lines, analyze trends, and explore sports data with Arena Props.'

const dashboardDescription =
  'Explore player props, sportsbook lines, projections, matchups, and saved research in Arena Props.'

function LandingRoute() {
  return (
    <RouteTheme
      surface="landing"
      title="Arena Props | Sports Props Research & Analytics"
      description={landingDescription}
    >
      <LandingPage />
    </RouteTheme>
  )
}

function DashboardRoute() {
  return (
    <RouteTheme
      surface="dashboard"
      title="Arena Props Dashboard"
      description={dashboardDescription}
    >
      <DashboardLayout />
    </RouteTheme>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      <Route path="/dashboard" element={<DashboardRoute />}>
        <Route index element={<Navigate to="props" replace />} />
        <Route path="props" element={<PropsPage />} />
        <Route path="discrepancies" element={<DiscrepanciesPage />} />
        <Route path="players" element={<PlayersPage />} />
        <Route path="players/:playerId" element={<PlayerPage />} />
        <Route path="trends" element={<TrendsPage />} />
        <Route path="matchups" element={<MatchupsPage />} />
        <Route path="matchups/:gameId" element={<GamePage />} />
        <Route path="projections" element={<ProjectionsPage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="popular" element={<PopularPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
