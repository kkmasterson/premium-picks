import { Outlet } from 'react-router';
import { DashboardProvider } from '@/features/dashboard/DashboardProvider';
import { TopSportNav } from '@/features/dashboard/components/TopSportNav';
import { MobileBottomNav, Sidebar } from '@/features/dashboard/components/Sidebar';
import { PlayerDrawer } from '@/features/dashboard/components/PlayerDrawer';

function Shell() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <TopSportNav />
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1 px-3 pb-24 pt-4 sm:px-5 md:pb-8">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
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
