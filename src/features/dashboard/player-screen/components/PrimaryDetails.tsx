import { useState } from 'react';
import { PlayerAvatar } from '@/features/dashboard/components/common';
import { cn } from '@/lib/utils';
import type { MarketSnapshot, PlayerResearchViewModel, ResearchHistoryEntry } from '../types';

export function DepthCharts({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  const teams = Object.keys(viewModel.depthCharts);
  const [team, setTeam] = useState(teams[0]);
  const chart = viewModel.depthCharts[team] ?? [];
  return (
    <section className="rounded-xl border border-[#202020] bg-[#101010]">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-[#202020] px-4 py-3">
        <div><h2 className="text-sm font-semibold text-zinc-100">Depth Charts</h2><p className="text-[10px] text-zinc-600">OUT · Q · DOUBT · OFS availability labels</p></div>
        <div className="flex gap-1">{teams.map((item) => <button key={item} onClick={() => setTeam(item)} aria-pressed={team === item} className={cn('rounded-full border px-2.5 py-1 text-[10px] font-semibold', team === item ? 'border-[#F5C542]/40 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#303030] text-zinc-500')}>{item}</button>)}</div>
      </header>
      <div className="overflow-x-auto p-4">
        <table className="w-full min-w-[620px] text-xs">
          <thead><tr className="text-left text-[9px] uppercase tracking-wider text-zinc-600"><th className="pb-2">Position</th><th className="pb-2">Starter</th><th className="pb-2">2nd</th><th className="pb-2">3rd</th><th className="pb-2">4th</th></tr></thead>
          <tbody className="divide-y divide-[#1d1d1d]">{chart.map((row) => <tr key={row.slot}><td className="py-2 font-semibold text-zinc-500">{row.slot}</td>{row.players.map((player, index) => <td key={`${row.slot}-${index}`} className="py-2 pr-3"><div className="flex items-center gap-2"><PlayerAvatar name={player.name} size="sm" /><div><p className={cn('max-w-24 truncate', player.current ? 'font-semibold text-[#F5C542]' : 'text-zinc-300')}>{player.name}</p>{player.status && <span className="text-[9px] font-bold text-red-400">{player.status}</span>}</div></div></td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function FootballUsage({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  if (viewModel.sportPayload.family !== 'football') return null;
  const payload = viewModel.sportPayload;
  return (
    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <article className="rounded-xl border border-[#202020] bg-[#101010] p-4">
        <div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold text-zinc-100">{viewModel.player.team} Pass vs Run Rate</h2><p className="text-[10px] text-zinc-600">Current season play-call split</p></div><span className="text-xs font-bold text-[#F5C542]">{payload.passRate}% PASS</span></div>
        <div className="mt-5 flex h-3 overflow-hidden rounded-full"><span className="bg-sky-500" style={{ width: `${payload.passRate}%` }} /><span className="flex-1 bg-emerald-500" /></div>
        <div className="mt-2 flex justify-between text-[10px] font-semibold"><span className="text-sky-400">Pass {payload.passRate}%</span><span className="text-emerald-400">Run {100 - payload.passRate}%</span></div>
      </article>
      <article className="rounded-xl border border-[#202020] bg-[#101010] p-4">
        <div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold text-zinc-100">{payload.opportunityLabel} Share</h2><p className="text-[10px] text-zinc-600">Team opportunity distribution</p></div><span className="text-[10px] text-zinc-500">Current season</span></div>
        <div className="mt-3 divide-y divide-[#202020]">{payload.opportunityShares.map((item) => <div key={item.name} className="grid grid-cols-[1fr_auto_minmax(80px,0.6fr)] items-center gap-3 py-2 text-xs"><div><p className={item.current ? 'font-semibold text-[#F5C542]' : 'text-zinc-300'}>{item.name}</p><p className="text-[9px] text-zinc-600">{item.position}</p></div><span className="tabular-nums text-zinc-400">{item.count}</span><div className="flex items-center gap-2"><div className="h-1.5 flex-1 rounded-full bg-[#252525]"><span className="block h-full rounded-full bg-[#F5C542]" style={{ width: `${item.share}%` }} /></div><span className="w-8 text-right tabular-nums text-zinc-500">{item.share}%</span></div></div>)}</div>
      </article>
    </section>
  );
}

function valueForColumn(entry: ResearchHistoryEntry, source: 'market' | 'supporting' | 'component', key: string): number | null {
  if (source === 'market') return entry.value;
  if (source === 'component') return entry.components?.find((item) => item.label.toLowerCase() === key.toLowerCase())?.value ?? null;
  return entry.supporting[key] ?? null;
}

export function ResearchGameLog({ market, viewModel }: { market: MarketSnapshot; viewModel: PlayerResearchViewModel }) {
  const unit = viewModel.profile.historyUnit === 'series' ? 'Series' : viewModel.profile.historyUnit === 'match' ? 'Matches' : 'Games';
  return (
    <section className="rounded-xl border border-[#202020] bg-[#101010]">
      <header className="border-b border-[#202020] px-4 py-3"><h2 className="text-sm font-semibold text-zinc-100">Gamelog · Last 15 {unit}</h2></header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-xs">
          <thead><tr className="bg-[#0d0d0d] text-left text-[9px] uppercase tracking-wider text-zinc-600"><th className="px-4 py-2">Date</th><th className="px-3 py-2">Opponent</th>{viewModel.profile.gameLogColumns.map((item) => <th key={item.key} className="px-3 py-2 text-right">{item.label}</th>)}<th className="px-4 py-2 text-right">Line result</th></tr></thead>
          <tbody className="divide-y divide-[#1b1b1b]">{market.history.map((entry) => {
            const played = entry.availability === 'played';
            const over = played && (entry.value ?? 0) > (entry.line ?? 0);
            return <tr key={entry.id} className="odd:bg-[#111] even:bg-[#0e0e0e]"><td className="px-4 py-2 text-zinc-400">{entry.date}</td><td className="px-3 py-2 text-zinc-300">{entry.home ? 'vs' : '@'} {entry.opponent}</td>{viewModel.profile.gameLogColumns.map((item) => <td key={item.key} className="px-3 py-2 text-right tabular-nums text-zinc-400">{played ? valueForColumn(entry, item.source, item.key) ?? '—' : 'DNP'}</td>)}<td className="px-4 py-2 text-right"><span className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold', !played ? 'bg-zinc-500/10 text-zinc-500' : over ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400')}>{!played ? 'DNP' : over ? 'OVER' : 'UNDER'}</span></td></tr>;
          })}</tbody>
        </table>
        {!market.history.length && <div className="p-8 text-center text-xs text-zinc-500">No events match the selected filters.</div>}
      </div>
    </section>
  );
}

const PRIMARY_REGISTRY = {
  'depth-charts': ({ viewModel }: { viewModel: PlayerResearchViewModel; market: MarketSnapshot }) => <DepthCharts viewModel={viewModel} />,
  'football-usage': ({ viewModel }: { viewModel: PlayerResearchViewModel; market: MarketSnapshot }) => <FootballUsage viewModel={viewModel} />,
  'game-log': ({ viewModel, market }: { viewModel: PlayerResearchViewModel; market: MarketSnapshot }) => <ResearchGameLog viewModel={viewModel} market={market} />,
};

export function PrimaryModules({ viewModel, market }: { viewModel: PlayerResearchViewModel; market: MarketSnapshot }) {
  return <>{viewModel.profile.primaryModules.map((key) => { const Component = PRIMARY_REGISTRY[key]; return <Component key={key} viewModel={viewModel} market={market} />; })}</>;
}
