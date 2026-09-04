import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { DashboardProvider } from '@/features/dashboard/DashboardProvider';
import { TopSportNav } from '@/features/dashboard/components/TopSportNav';
import { MobileBottomNav, Sidebar } from '@/features/dashboard/components/Sidebar';
import { PlayerDrawer } from '@/features/dashboard/components/PlayerDrawer';
import { PickBuilderDrawer, PickBuilderRail } from '@/features/dashboard/components/PickBuilder';

function Shell() {
  return (
    <div className="min-h-screen max-w-full overflow-x-clip bg-[#080808]">
      <TopSportNav />
      <div className="flex w-full min-w-0 max-w-full">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-x-clip px-3 pb-24 pt-2 sm:px-5 md:pb-8">
          <Suspense fallback={<div className="grid min-h-64 place-items-center text-xs text-zinc-600">Loading research…</div>}><Outlet /></Suspense>
        </main>
        <PickBuilderRail />
      </div>
      <MobileBottomNav />
      <PickBuilderDrawer />
      <PlayerDrawer />
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
