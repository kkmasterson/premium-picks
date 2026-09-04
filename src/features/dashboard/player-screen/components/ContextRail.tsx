import { Activity, BarChart3, CloudSun, Crosshair, History, Map, Shield, Swords, TrendingDown, TrendingUp, UserRoundSearch, Users, Volleyball } from 'lucide-react';
import { useState } from 'react';
import { SportsbookLogo } from '@/features/dashboard/components/SportsbookLogo';
import { cn } from '@/lib/utils';
import type { ContextModuleKey, MarketSnapshot, PlayerResearchViewModel } from '../types';
import { ContextModuleContent } from './SportContextModules';

function LinePanel({ market, line, viewModel }: { market: MarketSnapshot; line: number; viewModel: PlayerResearchViewModel }) {
  const [tab, setTab] = useState<'movement' | 'history'>('movement');
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-[#202020] bg-[#101010]">
      <div className="grid grid-cols-2 border-b border-[#202020]">
        <button onClick={() => setTab('movement')} aria-pressed={tab === 'movement'} className={cn('flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold', tab === 'movement' ? 'border-b-2 border-teal-500 text-teal-300' : 'text-zinc-500 hover:text-zinc-300')}><TrendingUp className="h-3.5 w-3.5" />Line Movement</button>
        <button onClick={() => setTab('history')} aria-pressed={tab === 'history'} className={cn('flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold', tab === 'history' ? 'border-b-2 border-teal-500 text-teal-300' : 'text-zinc-500 hover:text-zinc-300')}><History className="h-3.5 w-3.5" />Prop History</button>
      </div>
      <div className="min-w-0 p-3">
        {tab === 'movement' ? (
          <div className="max-h-64 overflow-y-auto"><table className="w-full text-xs"><thead><tr className="text-left text-[9px] uppercase tracking-wider text-zinc-600"><th className="pb-2">Line</th><th className="pb-2">App</th><th className="pb-2">Move</th><th className="pb-2 text-right">Time</th></tr></thead><tbody className="divide-y divide-[#1d1d1d]">{viewModel.lineMovement.map((entry) => <tr key={entry.id}><td className="py-2 font-semibold tabular-nums text-zinc-200">{Math.max(0, line + entry.delta)}</td><td className="py-1.5"><span className="inline-flex items-center gap-1.5"><SportsbookLogo shortName={entry.provider} compact /><span className="text-[9px] font-semibold text-zinc-500">{entry.provider}</span></span></td><td className="py-2">{entry.direction === 'up' ? <span className="inline-flex items-center text-[9px] font-bold text-emerald-400"><TrendingUp className="mr-0.5 h-3 w-3" />+{Math.abs(entry.delta)}</span> : entry.direction === 'down' ? <span className="inline-flex items-center text-[9px] font-bold text-red-400"><TrendingDown className="mr-0.5 h-3 w-3" />-{Math.abs(entry.delta)}</span> : <span className="text-[9px] text-zinc-600">—</span>}</td><td className="py-2 text-right text-zinc-500">{entry.secondsAgo < 60 ? `${entry.secondsAgo}s` : `${Math.round(entry.secondsAgo / 60)}m`} ago</td></tr>)}</tbody></table></div>
        ) : (
          <div className="min-w-0"><div className="mb-3 flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-wider text-zinc-600">Current / filtered average</p><p className="text-lg font-bold text-white">{line} <span className="text-xs font-normal text-zinc-500">/ {market.average?.toFixed(1) ?? '—'}</span></p></div><span className="rounded bg-teal-500/10 px-2 py-1 text-xs font-semibold text-teal-300">{market.hitRates.l10 ?? '—'}% L10</span></div><div className="flex max-w-full gap-2 overflow-x-auto pb-2" role="region" aria-label="Prop history results" tabIndex={0}>{market.history.filter((entry) => entry.availability === 'played').slice(0, 5).map((entry) => { const over = (entry.value ?? 0) > (entry.line ?? 0); return <div key={entry.id} className={cn('min-w-[118px] shrink-0 rounded-lg border p-2.5', over ? 'border-emerald-500/25 bg-emerald-500/[0.04]' : 'border-red-500/25 bg-red-500/[0.04]')}><div className="flex justify-between text-[9px]"><span className="text-zinc-500">{entry.date}</span><span className={over ? 'font-bold text-emerald-400' : 'font-bold text-red-400'}>{over ? 'OVER' : 'UNDER'}</span></div><p className="mt-2 text-xs text-zinc-300">{entry.home ? 'vs' : '@'} {entry.opponent}</p><p className="mt-1 text-[10px] text-zinc-500">Line {entry.line} · Result <span className="font-bold text-zinc-200">{entry.value}</span></p></div>; })}</div>{!market.history.length && <p className="py-6 text-center text-xs text-zinc-500">No prop history matches the selected filters.</p>}</div>
        )}
      </div>
    </section>
  );
}

function iconFor(key: ContextModuleKey) {
  switch (key) {
    case 'matchup': return Swords;
    case 'defense': return Shield;
    case 'shooting': return Crosshair;
    case 'similar': return UserRoundSearch;
    case 'injuries': return Activity;
    case 'pitch-arsenal': return Volleyball;
    case 'lineups': return Users;
    case 'weather': return CloudSun;
    case 'maps': return Map;
    case 'rankings': return BarChart3;
    default: return TrendingUp;
  }
}

function SeasonAverages({ viewModel, selectedMarket }: { viewModel: PlayerResearchViewModel; selectedMarket: MarketSnapshot }) {
  return <section className="rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] p-4"><div className="flex items-center justify-between"><div><h2 className="text-xs font-semibold text-zinc-200">Regular Season Averages</h2><p className="text-[9px] text-zinc-600">Current filters · {selectedMarket.history.filter((entry) => entry.availability === 'played').length} events</p></div><span className="text-[10px] text-zinc-600">⌃</span></div><div className="mt-3 grid grid-cols-2 divide-x divide-y divide-[var(--dashboard-border)] sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">{viewModel.markets.slice(0, 6).map((market) => <div key={market.definition.key} className={cn('p-2', market.definition.key === selectedMarket.definition.key ? 'bg-teal-500/[0.05]' : 'bg-transparent')}><p className="text-[9px] font-semibold text-zinc-600">{market.definition.label}</p><p className={cn('text-base font-bold', market.definition.key === selectedMarket.definition.key ? 'text-teal-300' : 'text-zinc-200')}>{market.average?.toFixed(1) ?? '—'}</p><p className="text-[8px] text-zinc-600">{market.offers.length ? `${market.offers.length} providers` : 'No lines'}</p></div>)}</div></section>;
}

export function ContextRail({ viewModel, market, line }: { viewModel: PlayerResearchViewModel; market: MarketSnapshot; line: number }) {
  const [requestedMode, setRequestedMode] = useState<ContextModuleKey>(viewModel.profile.contextModules[0]?.key ?? 'unavailable');
  const mode = viewModel.profile.contextModules.some((item) => item.key === requestedMode) ? requestedMode : viewModel.profile.contextModules[0]?.key ?? 'unavailable';
  return (
    <aside className="min-w-0 space-y-3" aria-label="Contextual player analysis">
      <LinePanel market={market} line={line} viewModel={viewModel} />
      <section className="rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] p-2"><div className={cn('grid gap-1', viewModel.profile.contextModules.length >= 5 ? 'grid-cols-5' : viewModel.profile.contextModules.length === 4 ? 'grid-cols-4' : viewModel.profile.contextModules.length === 3 ? 'grid-cols-3' : 'grid-cols-2')} role="tablist" aria-label="Analysis modes">{viewModel.profile.contextModules.map((module) => { const Icon = iconFor(module.key); return <button key={module.key} role="tab" aria-selected={mode === module.key} onClick={() => setRequestedMode(module.key)} className={cn('flex min-w-0 flex-col items-center gap-1 rounded-md px-1 py-2 text-[9px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500', mode === module.key ? 'bg-teal-500/10 text-teal-300' : 'text-zinc-500 hover:bg-[#171717] hover:text-zinc-300')}><Icon className="h-4 w-4" /><span className="w-full truncate text-center">{module.label}</span></button>; })}</div></section>
      <ContextModuleContent mode={mode} viewModel={viewModel} market={market} />
      <SeasonAverages viewModel={viewModel} selectedMarket={market} />
    </aside>
  );
}
