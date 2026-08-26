import { useMemo, useState } from 'react';
import { ArrowLeft, Bookmark, Check, ChevronDown } from 'lucide-react';
import { bestBook, formatOdds, playerById, propsForPlayer } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { DiffBadge, EmptyState, HitRateBadge, PlayerAvatar, SectionCard, hitTone } from '@/features/dashboard/components/common';
import { TrendChart } from '@/features/dashboard/components/TrendChart';
import { cn } from '@/lib/utils';

function PropSelector({ current, options, onChange }: { current: string; options: string[]; onChange: (m: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-[#F5C542]/40 bg-[#F5C542]/10 px-3.5 py-2 text-sm font-semibold text-[#F5C542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
      >
        {current} <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-11 z-40 w-64 rounded-lg border border-[#2a2a2a] bg-[#141414] p-1.5 shadow-2xl">
          {options.map((m) => (
            <button
              key={m}
              role="menuitemradio"
              aria-checked={m === current}
              onClick={() => { onChange(m); setOpen(false); }}
              className={cn(
                'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm',
                m === current ? 'bg-[#F5C542]/10 text-[#F5C542]' : 'text-zinc-300 hover:bg-[#1c1c1c]',
              )}
            >
              {m}
              {m === current && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PlayerPage() {
  const { playerId, navigate, saved, toggleSave } = useDashboard();
  const player = playerId ? playerById(playerId) : null;
  const playerProps = useMemo(() => (player ? propsForPlayer(player.id) : []), [player]);
  const [market, setMarket] = useState<string | null>(null);

  if (!player || playerProps.length === 0) {
    return (
      <EmptyState
        title="We couldn't load this player. Try again."
        action={
          <button onClick={() => navigate('players')} className="rounded-md border border-[#F5C542]/40 px-3 py-1.5 text-xs font-semibold text-[#F5C542] hover:bg-[#F5C542]/10">
            Back to Players
          </button>
        }
      />
    );
  }

  const prop = playerProps.find((p) => p.market === market) ?? playerProps[0];
  const best = bestBook(prop, 'over');
  const bestUnder = bestBook(prop, 'under');
  const isSaved = saved.players.includes(player.id);

  const hitCards: [string, number, number][] = [
    ['L5', prop.l5, 5], ['L10', prop.l10, 10], ['L15', prop.l15, 15], ['Season', prop.season, prop.seasonGames],
  ];

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate('props')}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#F5C542] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542] rounded"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Props
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#1f1f1f] bg-gradient-to-r from-[#141414] to-[#0d0d0d] p-4 sm:p-5">
        <PlayerAvatar name={player.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-white sm:text-2xl">{player.name}</h1>
            <button
              onClick={() => toggleSave('players', player.id)}
              aria-label={isSaved ? 'Remove player from saved' : 'Save player'}
              aria-pressed={isSaved}
              className={cn(
                'rounded-md border px-2 py-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]',
                isSaved ? 'border-[#F5C542]/50 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#2a2a2a] text-zinc-400 hover:bg-[#181818]',
              )}
            >
              <Bookmark className={cn('mr-1 inline h-3 w-3', isSaved && 'fill-[#F5C542]')} />
              {isSaved ? 'Saved' : 'Save Player'}
            </button>
          </div>
          <p className="mt-0.5 text-sm text-zinc-400">{player.team} · {player.pos} · #{player.jersey} · {player.sport}</p>
          <p className="text-xs text-zinc-500">
            {player.home ? 'vs' : '@'} {player.opponent} · Today {player.gameTime} · <span className="text-emerald-400">Scheduled</span>
          </p>
        </div>
        <PropSelector current={prop.market} options={playerProps.map((p) => p.market)} onChange={setMarket} />
      </div>

      {/* Current prop + best line */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard className="lg:col-span-1 border-[#F5C542]/25">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F5C542]">Current Prop</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-sm text-zinc-400">{prop.market}</p>
              <p className="text-3xl font-bold tabular-nums text-white">{prop.line}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Best Line</p>
              <p className="text-lg font-bold text-[#F5C542]">{best.book} {formatOdds(best.over)}</p>
              <p className="text-[10px] text-zinc-600">Updated {best.updatedAt < 60 ? `${best.updatedAt}s` : `${Math.round(best.updatedAt / 60)}m`} ago</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-[#0b0b0b] px-3 py-2">
            <span className="text-xs text-zinc-500">Premium Picks Projection</span>
            <span className="flex items-center gap-2 text-sm font-bold tabular-nums text-[#F5C542]">
              {prop.projection.toFixed(1)} <DiffBadge diff={prop.diff} />
            </span>
          </div>
        </SectionCard>

        {/* Hit rate cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-2">
          {hitCards.map(([label, v, n]) => {
            const tone = hitTone(v);
            return (
              <div key={label} className="rounded-xl border border-[#1f1f1f] bg-[#121212] p-4 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
                <p className={cn(
                  'mt-1 text-2xl font-bold tabular-nums',
                  tone === 'strong' ? 'text-emerald-400' : tone === 'mid' ? 'text-[#D9B45B]' : 'text-red-400',
                )}>
                  {v}%
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">{Math.round((v / 100) * n)} / {n} games</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend chart */}
      <SectionCard title="Recent Games vs. Line">
        <TrendChart gameLog={prop.gameLog} line={prop.line} height={190} />
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Game log */}
        <SectionCard title="Game Log">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-zinc-500">
                  <th className="pb-2 pr-3">Date</th>
                  <th className="pb-2 pr-3">Opp</th>
                  {player.sport !== 'MLB' && player.sport !== 'NHL' && <th className="pb-2 pr-3 text-right">Min</th>}
                  <th className="pb-2 pr-3 text-right">{prop.market}</th>
                  <th className="pb-2 pr-3 text-right">Line</th>
                  <th className="pb-2 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181818]">
                {prop.gameLog.map((g, i) => (
                  <tr key={i}>
                    <td className="py-1.5 pr-3 text-zinc-400">{g.date}</td>
                    <td className="py-1.5 pr-3 text-zinc-300">{g.home ? 'vs' : '@'} {g.opp}</td>
                    {player.sport !== 'MLB' && player.sport !== 'NHL' && <td className="py-1.5 pr-3 text-right tabular-nums text-zinc-400">{g.minutes || '—'}</td>}
                    <td className="py-1.5 pr-3 text-right font-semibold tabular-nums text-zinc-100">{g.value}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums text-zinc-500">{g.line}</td>
                    <td className="py-1.5 text-right">
                      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold', g.over ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400')}>
                        {g.over ? 'OVER' : 'UNDER'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="space-y-4">
          {/* Sportsbook comparison */}
          <SectionCard title="Sportsbook Comparison">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-zinc-500">
                  <th className="pb-2 pr-2">Book</th>
                  <th className="pb-2 pr-2 text-right">Line</th>
                  <th className="pb-2 pr-2 text-right">Over</th>
                  <th className="pb-2 pr-2 text-right">Under</th>
                  <th className="pb-2 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181818]">
                {prop.books.map((b) => (
                  <tr key={b.book}>
                    <td className="py-1.5 pr-2 font-semibold text-zinc-200">{b.bookName}</td>
                    <td className="py-1.5 pr-2 text-right tabular-nums text-zinc-300">{b.line}</td>
                    <td className={cn('py-1.5 pr-2 text-right tabular-nums', b.book === best.book ? 'font-bold text-[#F5C542]' : 'text-zinc-300')}>
                      {formatOdds(b.over)}
                      {b.book === best.book && <span className="ml-1 rounded bg-[#F5C542] px-1 text-[8px] font-bold text-black">BEST</span>}
                    </td>
                    <td className={cn('py-1.5 pr-2 text-right tabular-nums', b.book === bestUnder.book ? 'font-bold text-[#F5C542]' : 'text-zinc-300')}>
                      {formatOdds(b.under)}
                      {b.book === bestUnder.book && b.book !== best.book && <span className="ml-1 rounded bg-[#F5C542] px-1 text-[8px] font-bold text-black">BEST</span>}
                    </td>
                    <td className="py-1.5 text-right text-zinc-600">{b.updatedAt < 60 ? `${b.updatedAt}s ago` : `${Math.round(b.updatedAt / 60)}m ago`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          {/* Matchup insights */}
          <SectionCard title="Matchup Insights">
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-zinc-500">Opponent</dt><dd className="font-medium text-zinc-200">{player.opponent}</dd></div>
              <div className="flex justify-between"><dt className="text-zinc-500">H2H hit rate vs {player.opponent}</dt><dd><HitRateBadge pct={prop.h2h} label="H2H" /></dd></div>
              <div className="flex justify-between"><dt className="text-zinc-500">Season average</dt><dd className="tabular-nums text-zinc-200">{prop.avg}</dd></div>
              <div className="flex justify-between"><dt className="text-zinc-500">Current streak</dt>
                <dd className={cn('font-semibold', prop.streak.type === 'Over' ? 'text-emerald-400' : 'text-red-400')}>
                  {prop.streak.count} {prop.streak.type}
                </dd>
              </div>
              <div className="flex justify-between"><dt className="text-zinc-500">Game time</dt><dd className="text-zinc-200">Today, {player.gameTime}</dd></div>
            </dl>
          </SectionCard>

          {/* Other props */}
          <SectionCard title="Other Props">
            <div className="space-y-1">
              {playerProps.filter((p) => p.id !== prop.id).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setMarket(p.market)}
                  className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm hover:bg-[#181818] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542]"
                >
                  <span className="text-zinc-300">{p.market}</span>
                  <span className="flex items-center gap-3 text-xs">
                    <span className="tabular-nums text-zinc-400">Line {p.line}</span>
                    <HitRateBadge pct={p.l10} label="L10" />
                  </span>
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
