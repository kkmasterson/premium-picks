import { useMemo, useState, type ReactNode } from 'react';
import { PROPS, playerById } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { DashboardPageHeader, DashboardToolbar, EntityIdentity, ResearchSurface, SegmentedControl } from '@/features/dashboard/components/dashboard-ui';

type LaneName = 'L5 Leaders' | 'L10 Leaders' | 'Projection Edge' | 'Over Streaks' | 'Under Streaks';
const laneNames: readonly LaneName[] = ['L5 Leaders', 'L10 Leaders', 'Projection Edge', 'Over Streaks', 'Under Streaks'];

function TrendRow({ propId, metric }: { propId: string; metric: ReactNode }) {
  const { openDrawer } = useDashboard();
  const prop = PROPS.find((p) => p.id === propId)!;
  const player = playerById(prop.playerId)!;
  return <button onClick={() => openDrawer(prop.id)} className="flex w-full min-w-0 items-center gap-2.5 px-3 py-2.5 text-left transition hover:bg-[var(--dashboard-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500"><EntityIdentity name={player.name} meta={`${prop.market} · Line ${prop.line}`} detail={`${player.home ? 'vs' : '@'} ${player.opponent}`} /><span className="ml-auto shrink-0 text-right">{metric}</span></button>;
}

function Lane({ title, rows }: { title: LaneName; rows: Array<{ id: string; metric: ReactNode }> }) {
  return <section className="min-w-0"><h2 className="border-b border-[var(--dashboard-border)] px-3 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{title}</h2><div className="divide-y divide-[var(--dashboard-border)]">{rows.map((row) => <TrendRow key={row.id} propId={row.id} metric={row.metric} />)}</div></section>;
}

export function TrendsPage() {
  const { sport } = useDashboard();
  const [market, setMarket] = useState('');
  const [activeLane, setActiveLane] = useState<LaneName>('L5 Leaders');
  const pool = useMemo(() => PROPS.filter((prop) => { const player = playerById(prop.playerId)!; return (sport === 'All' || player.sport === sport) && (!market || prop.market === market); }), [sport, market]);
  const markets = useMemo(() => [...new Set(PROPS.filter((prop) => sport === 'All' || playerById(prop.playerId)!.sport === sport).map((prop) => prop.market))].sort(), [sport]);
  const top = (items: typeof pool, key: (prop: (typeof pool)[number]) => number) => [...items].sort((a, b) => key(b) - key(a)).slice(0, 5);
  const lanes: Record<LaneName, Array<{ id: string; metric: ReactNode }>> = {
    'L5 Leaders': top(pool, (prop) => prop.l5).map((prop) => ({ id: prop.id, metric: <><strong className="block text-sm text-emerald-400">{prop.l5}%</strong><small className="text-[8px] text-zinc-600">L5 hit rate</small></> })),
    'L10 Leaders': top(pool, (prop) => prop.l10).map((prop) => ({ id: prop.id, metric: <><strong className="block text-sm text-emerald-400">{prop.l10}%</strong><small className="text-[8px] text-zinc-600">L10 hit rate</small></> })),
    'Projection Edge': top(pool, (prop) => prop.diff).map((prop) => ({ id: prop.id, metric: <><strong className={prop.diff >= 0 ? 'block text-sm text-emerald-400' : 'block text-sm text-rose-400'}>{prop.diff >= 0 ? '+' : ''}{prop.diff.toFixed(1)}</strong><small className="text-[8px] text-zinc-600">vs line</small></> })),
    'Over Streaks': top(pool.filter((prop) => prop.streak.type === 'Over'), (prop) => prop.streak.count).map((prop) => ({ id: prop.id, metric: <><strong className="block text-sm text-emerald-400">O{prop.streak.count}</strong><small className="text-[8px] text-zinc-600">Over streak</small></> })),
    'Under Streaks': top(pool.filter((prop) => prop.streak.type === 'Under'), (prop) => prop.streak.count).map((prop) => ({ id: prop.id, metric: <><strong className="block text-sm text-rose-400">U{prop.streak.count}</strong><small className="text-[8px] text-zinc-600">Under streak</small></> })),
  };

  return <div className="space-y-3"><DashboardPageHeader eyebrow="Analysis" title="Research Trends" description="Five ranked views of recent performance patterns — a research starting point, not betting advice." /><DashboardToolbar className="flex flex-wrap items-end justify-between gap-3"><label className="grid gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">Prop market<select value={market} onChange={(event) => setMarket(event.target.value)} aria-label="Filter trends by prop market" className="h-8 min-w-48 rounded-md border border-[var(--dashboard-border-strong)] bg-[var(--dashboard-surface-raised)] px-2 text-xs text-zinc-200 focus:border-teal-500/50 focus:outline-none"><option value="">All prop markets</option>{markets.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><div className="w-full md:hidden"><SegmentedControl value={activeLane} options={laneNames} onChange={setActiveLane} label="Trend category" /></div></DashboardToolbar><ResearchSurface><div className="md:hidden"><Lane title={activeLane} rows={lanes[activeLane]} /></div><div className="hidden grid-cols-2 divide-x divide-[var(--dashboard-border)] md:grid xl:grid-cols-5">{laneNames.map((name) => <Lane key={name} title={name} rows={lanes[name]} />)}</div></ResearchSurface></div>;
}
