import { Bookmark, ChevronDown, Minus, Plus, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { cn } from '@/lib/utils';
import type { MarketSnapshot, PlayerFilterKey, PlayerResearchViewModel, PlayerRouteSelection, ResearchFilters } from '../types';

function rate(history: MarketSnapshot['history'], line: number, count?: number): number | null {
  const played = history.filter((entry) => entry.availability === 'played' && entry.value !== null).slice(0, count);
  if (!played.length) return null;
  return Math.round((played.filter((entry) => (entry.value ?? 0) > line).length / played.length) * 100);
}

export function MarketWorkspace({
  viewModel,
  market,
  periodKey,
  line,
  update,
  filters,
  updateFilter,
  providerId,
  onProviderChange,
}: {
  viewModel: PlayerResearchViewModel;
  market: MarketSnapshot;
  periodKey: string;
  line: number;
  update: (changes: Partial<PlayerRouteSelection>) => void;
  filters: ResearchFilters;
  updateFilter: (key: PlayerFilterKey, value: string) => void;
  providerId: string;
  onProviderChange: (providerId: string) => void;
}) {
  const { saved, toggleSave } = useDashboard();
  const [group, setGroup] = useState(market.definition.group);

  const groupMarkets = viewModel.markets.filter((item) => item.definition.group === group);
  const propSaved = market.propId ? saved.props.includes(market.propId) : false;
  const hitRates = useMemo(() => [
    { label: 'L5', value: rate(market.history, line, 5), sample: 5 },
    { label: 'L10', value: rate(market.history, line, 10), sample: 10 },
    { label: 'L15', value: rate(market.history, line, 15), sample: 15 },
    { label: 'Season', value: rate(market.history, line), sample: market.history.filter((entry) => entry.availability === 'played').length },
    { label: 'H2H', value: market.hitRates.h2h, sample: Math.min(4, market.history.length) },
  ], [line, market]);

  const selectClass = 'h-9 rounded-md border border-[#2a2a2a] bg-[#111] px-2.5 text-xs text-zinc-200 focus:border-[#F5C542]/50 focus:outline-none';
  const filterLabels: Record<PlayerFilterKey, string> = { opponent: 'Opponent', season: 'Season', homeAway: 'Home/Away', team: 'Team', event: 'Event', courtType: 'Court' };

  return (
    <section className="rounded-xl border border-[#202020] bg-[#101010]">
      <div className="border-b border-[#202020] px-3 pt-3 sm:px-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex rounded-md border border-[#292929] bg-[#0b0b0b] p-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {(['primary', 'alternate'] as const).map((item) => (
              <button key={item} onClick={() => setGroup(item)} className={cn('rounded px-2.5 py-1.5 capitalize', group === item ? 'bg-[#F5C542]/15 text-[#F5C542]' : 'text-zinc-500 hover:text-zinc-300')}>
                {item}
              </button>
            ))}
          </div>
          <p className="hidden text-[10px] text-zinc-600 sm:block">Swipe or scroll to reveal more markets</p>
        </div>
        <div className="flex items-end gap-3">
          <div className="no-scrollbar flex min-w-0 flex-1 overflow-x-auto" role="tablist" aria-label="Player markets">
            {groupMarkets.map((item) => (
              <button
                key={item.definition.key}
                role="tab"
                disabled={!item.available}
                aria-selected={market.definition.key === item.definition.key}
                onClick={() => update({ marketKey: item.definition.key })}
                title={item.available ? item.definition.market : `${item.definition.market} is unavailable`}
                className={cn(
                  'relative shrink-0 px-3 pb-3 pt-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]',
                  market.definition.key === item.definition.key ? 'text-[#F5C542] after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-[#F5C542]' : 'text-zinc-400 hover:text-zinc-100',
                  !item.available && 'cursor-not-allowed opacity-35',
                )}
              >
                {item.definition.label}
              </button>
            ))}
          </div>
          <div className="no-scrollbar flex shrink-0 gap-1 overflow-x-auto pb-2">
            {viewModel.profile.periods.map((period) => (
              <button
                key={period.key}
                onClick={() => update({ periodKey: period.key })}
                aria-pressed={periodKey === period.key}
                className={cn('shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold', periodKey === period.key ? 'border-[#F5C542]/40 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#292929] text-zinc-500 hover:text-zinc-300')}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-3 sm:p-4">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Selected market</p>
            <h2 className="mt-0.5 text-lg font-bold text-white">{market.definition.market}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div className="flex h-10 items-center rounded-lg border border-[#303030] bg-[#0a0a0a]">
                <button onClick={() => update({ line: Math.max(0, line - market.definition.step) })} aria-label="Decrease line" className="grid h-10 w-10 place-items-center text-zinc-400 hover:text-[#F5C542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F5C542]"><Minus className="h-4 w-4" /></button>
                <span className="min-w-16 border-x border-[#252525] px-3 text-center text-lg font-bold tabular-nums text-white">{line}</span>
                <button onClick={() => update({ line: line + market.definition.step })} aria-label="Increase line" className="grid h-10 w-10 place-items-center text-zinc-400 hover:text-[#F5C542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F5C542]"><Plus className="h-4 w-4" /></button>
              </div>
              <label className="relative flex h-10 items-center rounded-lg border border-[#303030] bg-[#111] text-xs text-zinc-300 hover:bg-[#171717]">
                <span className="sr-only">Sportsbook provider</span>
                <select
                  value={providerId}
                  onChange={(event) => {
                    const value = event.target.value;
                    onProviderChange(value);
                    const offer = market.offers.find((item) => item.id === value);
                    if (offer) update({ line: offer.line });
                  }}
                  className="h-full appearance-none bg-transparent pl-3 pr-8 font-bold text-[#F5C542] focus:outline-none"
                >
                  <option value="all">All books</option>
                  {market.offers.map((offer) => <option key={offer.id} value={offer.id}>{offer.shortName} · {offer.line}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-zinc-600" />
              </label>
              <button
                disabled={!market.propId}
                onClick={() => market.propId && toggleSave('props', market.propId)}
                aria-label={propSaved ? 'Remove prop from saved' : 'Save prop'}
                aria-pressed={propSaved}
                className={cn('grid h-10 w-10 place-items-center rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]', propSaved ? 'border-[#F5C542]/50 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#303030] text-zinc-500 hover:text-[#F5C542]')}
              >
                <Bookmark className={cn('h-4 w-4', propSaved && 'fill-[#F5C542]')} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            {viewModel.profile.filters.map((key) => (
              <label key={key} className="grid gap-1 text-[10px] uppercase tracking-wider text-zinc-600">
                {filterLabels[key]}
                <select value={filters[key]} onChange={(event) => updateFilter(key, event.target.value)} className={selectClass}>
                  {(viewModel.filterOptions[key] ?? [{ value: 'all', label: 'All' }]).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
            ))}
            <button onClick={() => viewModel.profile.filters.forEach((key) => updateFilter(key, 'all'))} aria-label="Reset filters" title="Reset filters" className="grid h-9 w-9 place-items-center rounded-md border border-[#2a2a2a] text-zinc-500 hover:text-[#F5C542]"><SlidersHorizontal className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {hitRates.map((item, index) => (
            <div key={item.label} className={cn('rounded-lg border p-3 text-center', index === 1 ? 'border-[#F5C542]/30 bg-[#F5C542]/[0.06]' : 'border-[#242424] bg-[#0d0d0d]')}>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-500">{item.label}</p>
              <p className={cn('mt-1 text-xl font-bold tabular-nums', item.value === null ? 'text-zinc-600' : item.value >= 70 ? 'text-emerald-400' : item.value >= 50 ? 'text-[#D9B45B]' : 'text-red-400')}>{item.value === null ? '—' : `${item.value}%`}</p>
              <p className="text-[10px] text-zinc-600">{item.value === null ? 'No sample' : `${Math.round((item.value / 100) * item.sample)}/${item.sample} events`}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
