import { lazy, Suspense, type ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { RouteTheme } from '@/app/RouteTheme';
import DashboardLayout from '@/features/dashboard/DashboardLayout';
import { PlayerPage } from '@/features/dashboard/pages/PlayerPage';

function lazyNamed<T extends Record<string, ComponentType>>(loader: () => Promise<T>, name: keyof T) {
  return lazy(async () => ({ default: (await loader())[name] }));
}

const LandingPage = lazy(() => import('@/features/landing/LandingPage'));
const BonusesPage = lazy(() => import('@/features/bonuses/BonusesPage'));
const PropsPage = lazyNamed(() => import('@/features/dashboard/pages/PropsPage'), 'PropsPage');
const BuilderPage = lazyNamed(() => import('@/features/dashboard/components/PickBuilder'), 'BuilderPage');
const EvPage = lazyNamed(() => import('@/features/dashboard/pages/EvPage'), 'EvPage');
const PlayersPage = lazyNamed(() => import('@/features/dashboard/pages/PlayersPage'), 'PlayersPage');
const TrendsPage = lazyNamed(() => import('@/features/dashboard/pages/TrendsPage'), 'TrendsPage');
const MatchupsPage = lazyNamed(() => import('@/features/dashboard/pages/MatchupsPage'), 'MatchupsPage');
const GamePage = lazyNamed(() => import('@/features/dashboard/pages/MatchupsPage'), 'GamePage');
const DiscrepanciesPage = lazyNamed(() => import('@/features/dashboard/pages/DiscoveryPages'), 'DiscrepanciesPage');
const PopularPage = lazyNamed(() => import('@/features/dashboard/pages/DiscoveryPages'), 'PopularPage');
const SavedPage = lazyNamed(() => import('@/features/dashboard/pages/SavedPage'), 'SavedPage');
const HelpPage = lazyNamed(() => import('@/features/dashboard/pages/SavedPage'), 'HelpPage');

function Loading() { return <div className="grid min-h-64 place-items-center bg-[#080808] text-xs text-zinc-500">Loading Arena Props…</div>; }
function LandingRoute() { return <RouteTheme surface="landing" title="Arena Props | Sports Props Research & Analytics" description="Research player props, compare sportsbook lines, analyze trends, and explore sports data with Arena Props."><LandingPage /></RouteTheme>; }
function DashboardRoute() {
  return <RouteTheme surface="dashboard" title="Arena Props Dashboard" description="Explore player props, sportsbook lines, projections, matchups, and saved research in Arena Props."><DashboardLayout/></RouteTheme>;
}

export default function App() {
  return <Suspense fallback={<Loading/>}><Routes>
    <Route path="/" element={<LandingRoute/>}/>
    <Route path="/bonuses" element={<BonusesPage/>}/>
    <Route path="/dashboard" element={<DashboardRoute/>}>
      <Route index element={<Navigate to="props" replace/>}/><Route path="props" element={<PropsPage/>}/><Route path="ev" element={<EvPage/>}/><Route path="builder" element={<BuilderPage/>}/><Route path="discrepancies" element={<DiscrepanciesPage/>}/><Route path="players" element={<PlayersPage/>}/><Route path="players/:playerId" element={<PlayerPage/>}/><Route path="trends" element={<TrendsPage/>}/><Route path="matchups" element={<MatchupsPage/>}/><Route path="matchups/:gameId" element={<GamePage/>}/><Route path="projections" element={<Navigate to="/dashboard/props" replace/>}/><Route path="saved" element={<SavedPage/>}/><Route path="popular" element={<PopularPage/>}/><Route path="help" element={<HelpPage/>}/>
    </Route><Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></Suspense>;
}
