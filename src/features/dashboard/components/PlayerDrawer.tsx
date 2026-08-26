import { useEffect } from 'react';
import { ArrowRight, Bookmark, ListPlus, X } from 'lucide-react';
import { bestBook, formatOdds, playerById, propById } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { cn } from '@/lib/utils';
import { DiffBadge, HitRateBadge, PlayerAvatar } from './common';
import { TrendChart } from './TrendChart';
import { marketKeyForName } from '@/features/dashboard/player-screen/profiles';

export function PlayerDrawer() {
  const { drawerPropId, closeDrawer, navigate, saved, toggleSave, togglePick, isInPickBuilder } = useDashboard();
  const prop = drawerPropId ? propById(drawerPropId) : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
    if (prop) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [prop, closeDrawer]);

  if (!prop) return null;
  const player = playerById(prop.playerId)!;
  const best = bestBook(prop, 'over');
  const isSaved = saved.props.includes(prop.id);
  const inBuilder = isInPickBuilder(prop.id);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`${player.name} research`}>
      <div className="absolute inset-0 bg-black/60" onClick={closeDrawer} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-[#222] bg-[#0e0e0e] shadow-2xl">
        <div className="flex items-start gap-3 border-b border-[#1c1c1c] p-4">
          <PlayerAvatar name={player.name} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-white">{player.name}</h2>
            <p className="text-xs text-zinc-400">{player.team} · {player.pos} · #{player.jersey}</p>
            <p className="text-xs text-zinc-500">{player.home ? 'vs' : '@'} {player.opponent} · {player.gameTime}</p>
          </div>
          <button onClick={closeDrawer} aria-label="Close research drawer" className="rounded p-1.5 text-zinc-400 hover:bg-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          <section aria-label="Current prop" className="rounded-lg border border-[#222] bg-[#121212] p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-100">{prop.market}</p>
                <p className="text-xs text-zinc-500">Line <span className="font-semibold text-zinc-200">{prop.line}</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Best Price</p>
                <p className="text-sm font-bold text-[#F5C542]">{best.book} {formatOdds(best.over)}</p>
              </div>
            </div>
          </section>

          <section aria-label="Recent performance">
            <div className="grid grid-cols-4 gap-2">
              {([['L5', prop.l5], ['L10', prop.l10], ['L15', prop.l15], ['SZN', prop.season]] as const).map(([label, v]) => (
                <div key={label} className="rounded-lg border border-[#222] bg-[#121212] p-2 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
                  <HitRateBadge pct={v} label={label} />
                  <p className="mt-1 text-[10px] text-zinc-600">
                    {Math.round((v / 100) * (label === 'L5' ? 5 : label === 'L10' ? 10 : label === 'L15' ? 15 : prop.seasonGames))}/{label === 'L5' ? 5 : label === 'L10' ? 10 : label === 'L15' ? 15 : prop.seasonGames}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section aria-label="Recent games trend" className="rounded-lg border border-[#222] bg-[#121212] p-3">
            <p className="mb-1 text-xs font-semibold text-zinc-300">Recent Games</p>
            <TrendChart gameLog={prop.gameLog} line={prop.line} height={150} />
          </section>

          <section aria-label="Projection" className="rounded-lg border border-[#F5C542]/25 bg-[#F5C542]/5 p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#F5C542]">Premium Picks Projection</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold tabular-nums text-[#F5C542]">{prop.projection.toFixed(1)}</p>
                <p className="text-xs text-zinc-500">vs line {prop.line}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Difference</p>
                <p className="text-lg"><DiffBadge diff={prop.diff} /></p>
              </div>
            </div>
          </section>

          <section aria-label="Sportsbook lines" className="rounded-lg border border-[#222] bg-[#121212]">
            <p className="border-b border-[#1c1c1c] px-3 py-2 text-xs font-semibold text-zinc-300">Sportsbook Lines</p>
            <div className="divide-y divide-[#181818]">
              {prop.books.map((b) => {
                const isBest = b.book === best.book;
                return (
                  <div key={b.book} className={cn('flex items-center gap-2 px-3 py-2 text-xs tabular-nums', isBest && 'bg-[#F5C542]/5')}>
                    <span className={cn('w-9 font-bold', isBest ? 'text-[#F5C542]' : 'text-zinc-300')}>{b.book}</span>
                    <span className="w-10 text-zinc-200">{b.line}</span>
                    <span className="text-zinc-500">O {formatOdds(b.over)}</span>
                    <span className="text-zinc-500">U {formatOdds(b.under)}</span>
                    {isBest && <span className="ml-auto rounded bg-[#F5C542] px-1 py-px text-[9px] font-bold text-black">BEST PRICE</span>}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2 border-t border-[#1c1c1c] p-4 max-[430px]:grid-cols-2">
          <button
            onClick={() => navigate('player', { playerId: player.id, marketKey: marketKeyForName(prop.market, player.sport, player.pos), line: prop.line, periodKey: 'full', sport: player.sport })}
            className="flex min-w-0 items-center justify-center gap-1.5 rounded-md bg-[#F5C542] py-2.5 text-sm font-bold text-black hover:bg-[#FFD95A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD95A] max-[430px]:col-span-2"
          >
            Open Player <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleSave('props', prop.id)}
            aria-pressed={isSaved}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-md border px-4 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]',
              isSaved ? 'border-[#F5C542]/50 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#2a2a2a] text-zinc-300 hover:bg-[#181818]',
            )}
          >
            <Bookmark className={cn('h-4 w-4', isSaved && 'fill-[#F5C542]')} />
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={() => togglePick(prop.id, 'over', best.book)}
            aria-pressed={inBuilder}
            className={cn('flex items-center justify-center gap-1.5 rounded-md border px-3 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]', inBuilder ? 'border-[#F5C542]/50 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#2a2a2a] text-zinc-300 hover:bg-[#181818]')}
          >
            <ListPlus className="h-4 w-4" /> {inBuilder ? 'Added' : 'Picks'}
          </button>
        </div>
      </div>
    </div>
  );
}
