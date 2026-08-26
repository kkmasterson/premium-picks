import { ArrowLeft, Bookmark } from 'lucide-react';
import { formatOdds } from '@/features/dashboard/data';
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
    <div className="space-y-3">
      <button
        onClick={() => navigate(returnPage)}
        className="flex items-center gap-1.5 rounded text-xs text-zinc-400 hover:text-[#F5C542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to {returnLabel}
      </button>

      <header className="overflow-hidden rounded-xl border border-[#242424] bg-gradient-to-r from-[#151515] to-[#0d0d0d]">
        <div className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
          <PlayerAvatar name={viewModel.player.name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-white sm:text-2xl">{viewModel.player.name}</h1>
              <button
                onClick={() => toggleSave('players', viewModel.player.id)}
                aria-label={playerSaved ? 'Remove player from saved' : 'Save player'}
                aria-pressed={playerSaved}
                className={cn(
                  'rounded-md border px-2 py-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]',
                  playerSaved ? 'border-[#F5C542]/50 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#303030] text-zinc-400 hover:bg-[#1a1a1a]',
                )}
              >
                <Bookmark className={cn('mr-1 inline h-3 w-3', playerSaved && 'fill-[#F5C542]')} />
                {playerSaved ? 'Saved' : 'Save Player'}
              </button>
            </div>
            <p className="mt-0.5 text-sm text-zinc-400">
              {identityMeta}
            </p>
            <p className="text-xs text-zinc-500">
              {viewModel.eventLabel} · <span className="text-emerald-400">{viewModel.status}</span>
            </p>
          </div>
          <div className="rounded-lg border border-[#F5C542]/30 bg-[#F5C542]/5 px-3 py-2 text-right">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-500">Profile</p>
            <p className="text-xs font-semibold text-[#F5C542]">{viewModel.roleLabel}</p>
          </div>
        </div>

        <div className="border-t border-[#222] bg-[#0c0c0c]/75 px-4 py-3 sm:px-5">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" aria-label="Provider offers">
            <div className="min-w-[148px] shrink-0 rounded-lg border border-[#294539] bg-emerald-500/[0.04] px-3 py-2">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Consensus</p>
              <div className="mt-1 flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-400">Over {consensus}%</span>
                <span className="text-red-400">Under {100 - consensus}%</span>
              </div>
            </div>
            {market.offers.map((offer) => (
              <div key={offer.id} className="min-w-[132px] shrink-0 rounded-lg border border-[#284133] bg-[#111713] px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-zinc-100">{offer.shortName}</span>
                  <span className="flex items-center gap-1.5">
                    {offer.promotion && <span className="rounded bg-emerald-500 px-1.5 py-px text-[8px] font-bold leading-none text-black">{offer.promotion}</span>}
                    <span className="text-[10px] text-zinc-600">{offer.updatedAt < 60 ? `${offer.updatedAt}s` : `${Math.round(offer.updatedAt / 60)}m`}</span>
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold tabular-nums text-[#F5C542]">
                  {offer.line} <span className="text-[10px] text-zinc-400">O {formatOdds(offer.overOdds)}</span>
                </p>
              </div>
            ))}
            {market.offers.length === 0 && (
              <div className="min-w-[180px] shrink-0 rounded-lg border border-dashed border-[#303030] px-3 py-3 text-xs text-zinc-500">No provider offers for this market</div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
