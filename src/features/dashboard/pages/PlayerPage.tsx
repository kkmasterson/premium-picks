import { useMemo } from 'react';
import { playerById } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { EmptyState } from '@/features/dashboard/components/common';
import { mockPlayerResearchAdapter } from '@/features/dashboard/player-screen/adapter';
import { resolvePlayerScreenProfile } from '@/features/dashboard/player-screen/profiles';
import { usePlayerScreenState } from '@/features/dashboard/player-screen/usePlayerScreenState';
import { usePlayerResearchFilters } from '@/features/dashboard/player-screen/usePlayerResearchFilters';
import { PlayerHeader } from '@/features/dashboard/player-screen/components/PlayerHeader';
import { MarketWorkspace } from '@/features/dashboard/player-screen/components/MarketWorkspace';
import { PerformanceChart, SupportingStatsChart } from '@/features/dashboard/player-screen/components/PerformanceCharts';
import { PrimaryModules } from '@/features/dashboard/player-screen/components/PrimaryDetails';
import { ContextRail } from '@/features/dashboard/player-screen/components/ContextRail';
import type { PlayerResearchViewModel } from '@/features/dashboard/player-screen/types';

export function PlayerPage() {
  const { playerId, navigate } = useDashboard();
  const player = playerId ? playerById(playerId) : undefined;
  const profile = player ? resolvePlayerScreenProfile(player.sport, player.pos) : null;
  const viewModel = useMemo(
    () => player && profile ? mockPlayerResearchAdapter.getPlayerResearch(player, profile) : null,
    [player, profile],
  );

  if (!viewModel) {
    return (
      <EmptyState
        title="We couldn't load this player. Try again."
        action={<button onClick={() => navigate('players')} className="rounded-md border border-teal-500/40 px-3 py-1.5 text-xs font-semibold text-teal-300 hover:bg-teal-500/10">Back to Players</button>}
      />
    );
  }

  return <ResolvedPlayerScreen key={viewModel.player.id} viewModel={viewModel} />;
}

function ResolvedPlayerScreen({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  const { selectedMarket, selectedPeriod, line, update } = usePlayerScreenState(viewModel);
  const { filters, updateFilter, providerId, setProviderId, filteredMarket } = usePlayerResearchFilters(selectedMarket, line);
  return (
    <div className="space-y-3">
      <PlayerHeader viewModel={viewModel} market={selectedMarket} />
      <div className="grid min-w-0 items-start gap-3 xl:grid-cols-[minmax(0,2.7fr)_minmax(260px,1fr)]">
        <main className="min-w-0 space-y-3">
          <section aria-label="Player stats workspace" className="overflow-hidden rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)]">
            <MarketWorkspace embedded viewModel={viewModel} market={filteredMarket} periodKey={selectedPeriod.key} line={line} update={update} filters={filters} updateFilter={updateFilter} providerId={providerId} onProviderChange={setProviderId} />
            <PerformanceChart embedded market={filteredMarket} line={line} />
          </section>
          <SupportingStatsChart market={filteredMarket} stats={viewModel.profile.supportingStats} />
          <PrimaryModules market={filteredMarket} viewModel={viewModel} />
        </main>
        <div className="min-w-0 xl:col-start-2 xl:row-start-1">
          <ContextRail viewModel={viewModel} market={filteredMarket} line={line} />
        </div>
      </div>
    </div>
  );
}
