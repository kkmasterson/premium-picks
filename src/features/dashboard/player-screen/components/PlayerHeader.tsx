import { ArrowLeft, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { playerMediaForName } from '@/features/dashboard/media-fixtures';
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
  const playerMedia = playerMediaForName(viewModel.player.name);
  const headshotUrl = playerMedia?.headshotUrl;
  const [failedHeadshot, setFailedHeadshot] = useState<string>();
  const showHeadshot = Boolean(headshotUrl && failedHeadshot !== headshotUrl);

  return (
    <div className="space-y-2">
      <button
        onClick={() => navigate(returnPage)}
        className="flex items-center gap-1.5 rounded text-[11px] text-zinc-500 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to {returnLabel}
      </button>

      <section aria-label={`${viewModel.player.name} player profile`} className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f1111] shadow-[0_16px_50px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(20,184,166,0.055),transparent_42%)]" />
        <div className="relative grid min-h-[158px] grid-cols-[112px_minmax(0,1fr)] sm:grid-cols-[172px_minmax(0,1fr)]">
          <div className="relative overflow-hidden border-r border-white/[0.055] bg-[radial-gradient(circle_at_40%_100%,rgba(20,184,166,0.18),transparent_68%)]">
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0f1111] to-transparent" />
            {showHeadshot ? <img
              src={headshotUrl!}
              alt={`${viewModel.player.name} headshot`}
              loading="eager"
              decoding="async"
              className="absolute bottom-0 left-[-20px] h-[158px] w-[154px] max-w-none object-contain object-bottom drop-shadow-[0_8px_14px_rgba(0,0,0,0.55)] sm:left-[-8px] sm:h-[170px] sm:w-[188px]"
              onError={() => setFailedHeadshot(headshotUrl!)}
            /> : <div className="absolute inset-0 grid place-items-center text-center" aria-hidden="true">
              <div><p className="text-3xl font-black tracking-tight text-teal-300/70">{viewModel.player.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</p><p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">{viewModel.player.sport}</p></div>
            </div>}
          </div>

          <div className="min-w-0 p-3 sm:p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-teal-400/70">Player analytics</p>
                <h1 className="mt-0.5 truncate text-xl font-bold tracking-tight text-white sm:text-2xl">{viewModel.player.name}</h1>
                <p className="mt-0.5 truncate text-[10px] text-zinc-500 sm:text-[11px]">{viewModel.competitionLabel} · {viewModel.roleLabel}{viewModel.profile.family !== 'tennis' && viewModel.profile.family !== 'esports' ? ` · #${viewModel.player.jersey}` : ''}</p>
              </div>
              <button
                onClick={() => toggleSave('players', viewModel.player.id)}
                aria-label={playerSaved ? 'Remove player from saved' : 'Save player'}
                aria-pressed={playerSaved}
                className={cn(
                  'inline-flex shrink-0 items-center rounded-md border px-2.5 py-1.5 text-[10px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400',
                  playerSaved ? 'border-teal-400/40 bg-teal-400/10 text-teal-300' : 'border-white/[0.09] text-zinc-500 hover:text-zinc-200',
                )}
              >
                <Bookmark className={cn('mr-1 inline h-3 w-3', playerSaved && 'fill-teal-300')} />
                {playerSaved ? 'Saved' : 'Save Player'}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-lg border border-white/[0.06] bg-black/15 sm:grid-cols-5 sm:divide-x sm:divide-white/[0.055]">
              <ProfileFact label="Position" value={viewModel.player.pos} />
              <ProfileFact label="Team" value={viewModel.player.team} />
              <ProfileFact label="Opponent" value={`${viewModel.player.home ? 'vs' : '@'} ${viewModel.player.opponent}`} />
              <ProfileFact label="Game" value={`Today · ${viewModel.player.gameTime}`} />
              <div className="border-t border-white/[0.055] px-2.5 py-2 sm:border-t-0">
                <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-zinc-600">L10 lean</p>
                <p className="mt-0.5 truncate text-[10px] font-bold"><span className="text-emerald-400">O {consensus}%</span><span className="mx-1 text-zinc-700">/</span><span className="text-red-400">U {100 - consensus}%</span></p>
              </div>
            </div>
            <p className="mt-2 text-[9px] text-zinc-600">{viewModel.eventLabel} · <span className="font-semibold text-emerald-400">{viewModel.status}</span></p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return <div className="border-t border-white/[0.055] px-2.5 py-2 first:border-t-0 sm:border-t-0">
    <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-zinc-600">{label}</p>
    <p className="mt-0.5 truncate text-[10px] font-semibold text-zinc-200">{value}</p>
  </div>;
}
