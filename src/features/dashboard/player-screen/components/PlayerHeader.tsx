import { ArrowLeft, Bookmark } from 'lucide-react';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { PlayerAvatar } from '@/features/dashboard/components/common';
import { cn } from '@/lib/utils';
import type { MarketSnapshot, PlayerResearchViewModel } from '../types';
import { useSearchParams } from 'react-router';

export function PlayerHeader({ viewModel, market }: { viewModel: PlayerResearchViewModel; market: MarketSnapshot }) {
  const { navigate, saved, toggleSave } = useDashboard();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('from');
  const returnPage = source === 'popular' || source === 'discrepancies' ? source : 'props';
  const returnLabel = source === 'popular' ? 'Popular' : source === 'discrepancies' ? 'Discrepancies' : 'Props';
  const playerSaved = saved.players.includes(viewModel.player.id);
  const consensus = market.hitRates.l10 ?? 50;
  const identityMeta = viewModel.profile.family === 'tennis'
    ? `${viewModel.player.team} · ${viewModel.roleLabel} · ${viewModel.competitionLabel}`
    : viewModel.profile.family === 'esports'
      ? `${viewModel.player.team} · ${viewModel.player.pos} · ${viewModel.competitionLabel}`
      : `${viewModel.player.team} · ${viewModel.player.pos} · #${viewModel.player.jersey} · ${viewModel.competitionLabel}`;

  return (
    <div className="space-y-2">
      <button
        onClick={() => navigate(returnPage)}
        className="flex items-center gap-1.5 rounded text-[11px] text-zinc-500 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to {returnLabel}
      </button>

      <header className="rounded-xl border border-white/[0.07] bg-[#0f1111]">
        <div className="flex flex-wrap items-center gap-3 px-3 py-3 sm:px-4">
          <PlayerAvatar name={viewModel.player.name} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-white sm:text-xl">{viewModel.player.name}</h1>
              <button
                onClick={() => toggleSave('players', viewModel.player.id)}
                aria-label={playerSaved ? 'Remove player from saved' : 'Save player'}
                aria-pressed={playerSaved}
                className={cn(
                  'rounded-md border px-2 py-1 text-[10px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400',
                  playerSaved ? 'border-teal-400/40 bg-teal-400/10 text-teal-300' : 'border-white/[0.09] text-zinc-500 hover:text-zinc-200',
                )}
              >
                <Bookmark className={cn('mr-1 inline h-3 w-3', playerSaved && 'fill-teal-300')} />
                {playerSaved ? 'Saved' : 'Save Player'}
              </button>
            </div>
            <p className="mt-0.5 text-[11px] text-zinc-400">{identityMeta}</p>
            <p className="text-[10px] text-zinc-600">{viewModel.eventLabel} · <span className="text-emerald-400">{viewModel.status}</span></p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-zinc-600">L10 consensus</p>
              <p className="text-xs font-bold"><span className="text-emerald-400">O {consensus}%</span><span className="mx-1.5 text-zinc-700">/</span><span className="text-red-400">U {100 - consensus}%</span></p>
            </div>
            <div className="hidden border-l border-white/[0.07] pl-4 text-right sm:block">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-600">Profile</p>
              <p className="text-[11px] font-semibold text-[#F5C542]">{viewModel.roleLabel}</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
