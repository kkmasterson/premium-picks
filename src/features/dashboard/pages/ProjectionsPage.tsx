import { useMemo, useState } from 'react';
import { PROPS, playerById } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { PropsTable } from '@/features/dashboard/components/PropsTable';

export function ProjectionsPage() {
  const { sport } = useDashboard();
  const [mode, setMode] = useState<'positive' | 'negative'>('positive');

  const props = useMemo(() => {
    const pool = PROPS.filter((p) => sport === 'All' || playerById(p.playerId)!.sport === sport);
    return [...pool].sort((a, b) => (mode === 'positive' ? b.diff - a.diff : a.diff - b.diff));
  }, [sport, mode]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <h1 className="text-sm font-semibold text-zinc-200">Projections</h1>
          <p className="text-xs text-zinc-500">Arena Props model projections vs. current sportsbook lines.</p>
        </div>
        <div className="flex gap-1.5" role="group" aria-label="Sort projections">
          <button
            onClick={() => setMode('positive')}
            aria-pressed={mode === 'positive'}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] ${mode === 'positive' ? 'border-[#F5C542]/50 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#2a2a2a] text-zinc-400 hover:bg-[#181818]'}`}
          >
            Largest Positive Diff
          </button>
          <button
            onClick={() => setMode('negative')}
            aria-pressed={mode === 'negative'}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] ${mode === 'negative' ? 'border-[#F5C542]/50 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#2a2a2a] text-zinc-400 hover:bg-[#181818]'}`}
          >
            Largest Negative Diff
          </button>
        </div>
      </div>
      <PropsTable props={props} showSport={sport === 'All'} />
    </div>
  );
}
