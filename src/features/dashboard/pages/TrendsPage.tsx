import { useMemo, useState } from 'react';
import { PROPS, playerById } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { DiffBadge, HitRateBadge, PlayerAvatar, SectionCard } from '@/features/dashboard/components/common';

function TrendRow({ propId, metric }: { propId: string; metric: React.ReactNode }) {
  const { openDrawer } = useDashboard();
  const prop = PROPS.find((p) => p.id === propId)!;
  const pl = playerById(prop.playerId)!;
  return (
    <button
      onClick={() => openDrawer(prop.id)}
      className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left hover:bg-[#181818] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542]"
    >
      <PlayerAvatar name={pl.name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-100">{pl.name}</p>
        <p className="text-[11px] text-zinc-500">{prop.market} · Line {prop.line} · {pl.home ? 'vs' : '@'} {pl.opponent}</p>
      </div>
      {metric}
    </button>
  );
}

export function TrendsPage() {
  const { sport } = useDashboard();
  const [market, setMarket] = useState<string>('');

  const pool = useMemo(
    () => PROPS.filter((p) => {
      const pl = playerById(p.playerId)!;
      if (sport !== 'All' && pl.sport !== sport) return false;
      if (market && p.market !== market) return false;
      return true;
    }),
    [sport, market],
  );
  const markets = useMemo(() => [...new Set(pool.map((p) => p.market))].sort(), [pool]);

  const top = (arr: typeof pool, key: (p: (typeof pool)[number]) => number, n = 5) =>
    [...arr].sort((a, b) => key(b) - key(a)).slice(0, n);

  const highestL5 = top(pool, (p) => p.l5);
  const highestL10 = top(pool, (p) => p.l10);
  const overStreaks = top(pool.filter((p) => p.streak.type === 'Over'), (p) => p.streak.count);
  const underStreaks = top(pool.filter((p) => p.streak.type === 'Under'), (p) => p.streak.count);
  const biggestDiff = top(pool, (p) => p.diff);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <h1 className="text-sm font-semibold text-zinc-200">Research Trends</h1>
          <p className="text-xs text-zinc-500">Notable recent performance patterns — a research starting point, not betting advice.</p>
        </div>
        <select
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          aria-label="Filter trends by prop market"
          className="h-8 rounded-md border border-[#2a2a2a] bg-[#141414] px-2 text-xs text-zinc-200 focus:border-[#F5C542]/50 focus:outline-none"
        >
          <option value="">All prop markets</option>
          {markets.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SectionCard title="Highest L5 Hit Rates">
          <div className="space-y-0.5">{highestL5.map((p) => <TrendRow key={p.id} propId={p.id} metric={<HitRateBadge pct={p.l5} label="L5" />} />)}</div>
        </SectionCard>
        <SectionCard title="Highest L10 Hit Rates">
          <div className="space-y-0.5">{highestL10.map((p) => <TrendRow key={p.id} propId={p.id} metric={<HitRateBadge pct={p.l10} label="L10" />} />)}</div>
        </SectionCard>
        <SectionCard title="Largest Projection Differences">
          <div className="space-y-0.5">{biggestDiff.map((p) => <TrendRow key={p.id} propId={p.id} metric={<DiffBadge diff={p.diff} />} />)}</div>
        </SectionCard>
        <SectionCard title="Longest Over Streaks">
          <div className="space-y-0.5">{overStreaks.map((p) => <TrendRow key={p.id} propId={p.id} metric={<span className="text-sm font-bold text-emerald-400">{p.streak.count} Over</span>} />)}</div>
        </SectionCard>
        <SectionCard title="Longest Under Streaks">
          <div className="space-y-0.5">{underStreaks.map((p) => <TrendRow key={p.id} propId={p.id} metric={<span className="text-sm font-bold text-red-400">{p.streak.count} Under</span>} />)}</div>
        </SectionCard>
      </div>
    </div>
  );
}
