import { Suspense } from 'react';
import { Link, Outlet } from 'react-router';
import { DashboardProvider, useDashboard } from '@/features/dashboard/DashboardProvider';
import { TopSportNav } from '@/features/dashboard/components/TopSportNav';
import { MobileBottomNav, Sidebar } from '@/features/dashboard/components/Sidebar';
import { PlayerDrawer } from '@/features/dashboard/components/PlayerDrawer';
import { PickBuilderDrawer, PickBuilderRail } from '@/features/dashboard/components/PickBuilder';
import { DiscordPrompt } from '@/features/dashboard/components/DiscordPrompt';

function Shell() {
  const { page, setSport } = useDashboard();
  return (
    <div className="min-h-screen max-w-full overflow-x-clip bg-[#080808]">
      <TopSportNav />
      <div className="flex w-full min-w-0 max-w-full">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-x-clip px-3 pb-24 pt-2 sm:px-5 md:pb-8">
          {page !== 'matchups' && page !== 'game' && page !== 'players' && <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--dashboard-border)] pb-2 text-[11px] text-zinc-500"><span>Demo research · Live hit rates, projections, confidence and EV are unavailable. Research metrics below are fixtures.</span><Link to="/dashboard/matchups" onClick={() => setSport('NBA')} className="rounded text-teal-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">NBA schedule & observed odds →</Link></div>}
          <Suspense fallback={<div className="grid min-h-64 place-items-center text-xs text-zinc-600">Loading research…</div>}><Outlet /></Suspense>
        </main>
        <PickBuilderRail />
      </div>
      <MobileBottomNav />
      <PickBuilderDrawer />
      <PlayerDrawer />
      <DiscordPrompt />
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <DashboardProvider>
      <Shell />
    </DashboardProvider>
  );
}
