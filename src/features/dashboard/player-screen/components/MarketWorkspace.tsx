import { Bookmark, ChevronDown, Minus, Plus, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { LineType } from '@arena/contracts';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { SportsbookLogo } from '@/features/dashboard/components/SportsbookLogo';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { MarketSnapshot, PlayerFilterKey, PlayerResearchViewModel, PlayerRouteSelection, ResearchFilters } from '../types';

const GREEN_GOBLIN_ASSET = '/assets/green-goblin.png';
const DEVIL_ASSET = '/assets/red-devil.png';

const lineTypeMeta: Partial<Record<LineType, { label: string; asset: string; color: string; surface: string }>> = {
  goblin: { label: 'Goblin', asset: GREEN_GOBLIN_ASSET, color: 'text-emerald-300', surface: 'border-emerald-500/35 bg-emerald-500/[0.07]' },
  devil: { label: 'Devil', asset: DEVIL_ASSET, color: 'text-red-300', surface: 'border-red-500/35 bg-red-500/[0.07]' },
};

function rate(history: MarketSnapshot['history'], line: number, count?: number): number | null {
  const played = history.filter((entry) => entry.availability === 'played' && entry.value !== null).slice(0, count);
  if (!played.length) return null;
  return Math.round((played.filter((entry) => (entry.value ?? 0) > line).length / played.length) * 100);
}

function gradeClass(value: number | null): string {
  if (value === null) return 'text-zinc-600';
  if (value >= 80) return 'text-emerald-400';
  if (value >= 60) return 'text-teal-300';
  if (value >= 40) return 'text-amber-300';
  return 'text-red-400';
}

function formatOdds(value: number | null): string {
  if (value === null) return '—';
  return value > 0 ? `+${value}` : String(value);
}

function EditableLineInput({ line, onCommit }: { line: number; onCommit: (line: number) => void }) {
  const [draft, setDraft] = useState(String(line));

  useEffect(() => {
    setDraft(String(line));
  }, [line]);

  const commit = () => {
    const nextLine = Number(draft);
    if (draft.trim() !== '' && Number.isFinite(nextLine) && nextLine >= 0) {
      onCommit(nextLine);
      setDraft(String(nextLine));
      return;
    }
    setDraft(String(line));
  };

  return (
    <input
      aria-label="Prop line"
      type="text"
      inputMode="decimal"
      spellCheck={false}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onFocus={(event) => event.currentTarget.select()}
      onClick={(event) => event.currentTarget.select()}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
        if (event.key === 'Escape') {
          setDraft(String(line));
          event.currentTarget.blur();
        }
      }}
      className="h-9 w-14 border-x border-white/[0.07] bg-transparent px-1 text-center text-base font-bold tabular-nums text-white caret-teal-300 outline-none selection:bg-teal-400/40 selection:text-white hover:bg-white/[0.025] focus:bg-teal-400/[0.07] focus:ring-2 focus:ring-inset focus:ring-teal-400/70"
    />
  );
}

function SportsbookOfferSelector({
  offers,
  selectedOffer,
  onSelect,
}: {
  offers: MarketSnapshot['offers'];
  selectedOffer: MarketSnapshot['offers'][number] | undefined;
  onSelect: (offer: MarketSnapshot['offers'][number] | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedType = selectedOffer?.lineType ? lineTypeMeta[selectedOffer.lineType] : undefined;

  const choose = (offer: MarketSnapshot['offers'][number] | null) => {
    onSelect(offer);
    setOpen(false);
  };

  return (
    <div className="min-w-[190px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-label="Sportsbook provider"
            aria-controls="sportsbook-provider-options"
            aria-haspopup="listbox"
            className={cn(
              'flex h-10 w-full items-center gap-2 rounded-lg border bg-[#111313] px-2 text-left transition-colors hover:border-white/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70',
              selectedType ? selectedType.surface : 'border-white/[0.1]',
            )}
          >
            {selectedOffer ? <SportsbookLogo shortName={selectedOffer.shortName} /> : <span aria-hidden="true" className="grid h-6 w-10 place-items-center rounded-md bg-teal-500/10 text-[8px] font-bold text-teal-300 ring-1 ring-inset ring-teal-500/20">ALL</span>}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] font-semibold text-zinc-100">{selectedOffer?.name ?? 'All books'}</span>
              <span className="block truncate text-[9px] text-zinc-500">
                {selectedOffer ? `Line ${selectedOffer.line} · O ${formatOdds(selectedOffer.overOdds)} · U ${formatOdds(selectedOffer.underOdds)}` : `Compare ${offers.length} available offers`}
              </span>
            </span>
            <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform', open && 'rotate-180')} />
          </button>
        </PopoverTrigger>

        <PopoverContent
          id="sportsbook-provider-options"
          role="listbox"
          aria-label="Sportsbook offers"
          align="start"
          sideOffset={6}
          collisionPadding={16}
          className="z-50 max-h-[var(--radix-popover-content-available-height)] w-[min(320px,calc(100vw-32px))] overflow-y-auto rounded-xl border-white/[0.12] bg-[#151818] p-1.5 text-zinc-100 shadow-[0_18px_60px_rgba(0,0,0,0.65)]"
        >
            <button
              type="button"
              role="option"
              aria-selected={!selectedOffer}
              onClick={() => choose(null)}
              className={cn('flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400', !selectedOffer && 'bg-teal-500/[0.09]')}
            >
              <span aria-hidden="true" className="grid h-6 w-10 shrink-0 place-items-center rounded-md bg-teal-500/10 text-[8px] font-bold text-teal-300 ring-1 ring-inset ring-teal-500/20">ALL</span>
              <span className="min-w-0 flex-1"><span className="block text-[11px] font-semibold text-zinc-100">All books</span><span className="block text-[9px] text-zinc-500">Compare every available offer</span></span>
              {!selectedOffer && <span className="text-[9px] font-semibold text-teal-300">Selected</span>}
            </button>

            <div className="my-1 h-px bg-white/[0.06]" />

            {offers.map((offer) => {
              const type = offer.lineType ? lineTypeMeta[offer.lineType] : undefined;
              const disabled = offer.status === 'suspended' || offer.status === 'closed';
              return (
                <button
                  key={offer.id}
                  type="button"
                  role="option"
                  aria-selected={selectedOffer?.id === offer.id}
                  disabled={disabled}
                  onClick={() => choose(offer)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-40',
                    selectedOffer?.id === offer.id && 'bg-teal-500/[0.09]',
                  )}
                >
                  <SportsbookLogo shortName={offer.shortName} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[11px] font-semibold text-zinc-100">{offer.name}</span>
                      {type && <span className={cn('inline-flex shrink-0 items-center gap-0.5 text-[9px] font-semibold', type.color)}><img src={type.asset} alt="" className="h-4 w-4 object-contain" />{type.label}</span>}
                      {offer.lineType === 'alternate' && <span className="shrink-0 text-[9px] font-semibold text-sky-300">Alternate</span>}
                    </span>
                    <span className="mt-0.5 block text-[10px] tabular-nums text-zinc-400">Line <strong className="font-semibold text-zinc-100">{offer.line}</strong> · O {formatOdds(offer.overOdds)} · U {formatOdds(offer.underOdds)}</span>
                  </span>
                  <span className={cn('shrink-0 text-[9px] capitalize', offer.status === 'active' ? 'text-emerald-400' : offer.status === 'stale' ? 'text-amber-300' : 'text-zinc-500')}>{offer.status}</span>
                </button>
              );
            })}
        </PopoverContent>
      </Popover>
    </div>
  );
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
  embedded = false,
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
  embedded?: boolean;
}) {
  const { saved, toggleSave } = useDashboard();
  const [group, setGroup] = useState(market.definition.group);
  const groupMarkets = viewModel.markets.filter((item) => item.definition.group === group);
  const propSaved = market.propId ? saved.props.includes(market.propId) : false;
  const playedCount = market.history.filter((entry) => entry.availability === 'played' && entry.value !== null).length;
  const selectedOffer = market.offers.find((offer) => offer.id === providerId);
  const selectedType = selectedOffer?.lineType ? lineTypeMeta[selectedOffer.lineType] : undefined;
  const hitRates = useMemo(() => [
    { label: 'L5', value: rate(market.history, line, 5), sample: Math.min(5, playedCount) },
    { label: 'L10', value: rate(market.history, line, 10), sample: Math.min(10, playedCount) },
    { label: 'L15', value: rate(market.history, line, 15), sample: Math.min(15, playedCount) },
    { label: 'Season', value: rate(market.history, line), sample: playedCount },
    { label: 'H2H', value: market.hitRates.h2h, sample: Math.min(4, playedCount) },
  ], [line, market, playedCount]);

  const selectClass = 'h-8 rounded-md border border-white/[0.08] bg-[#111313] px-2.5 text-[11px] text-zinc-200 outline-none transition-colors hover:border-white/[0.14] focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30';
  const filterLabels: Record<PlayerFilterKey, string> = { opponent: 'Opponent', season: 'Season', homeAway: 'Home/Away', team: 'Team', event: 'Event', courtType: 'Court' };

  return (
    <section className={cn('w-full min-w-0 max-w-full overflow-hidden bg-[#0f1111]', !embedded && 'rounded-xl border border-white/[0.07]')}>
      <div className={cn('px-3 pt-3 sm:px-4', !embedded && 'border-b border-white/[0.06]')}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex rounded-md border border-white/[0.08] bg-[#090a0a] p-0.5 text-[10px] font-semibold">
            {(['primary', 'alternate'] as const).map((item) => (
              <button key={item} onClick={() => setGroup(item)} aria-pressed={group === item} className={cn('rounded px-3 py-1.5 capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400', group === item ? 'bg-teal-500/15 text-teal-300' : 'text-zinc-500 hover:text-zinc-200')}>
                {item}
              </button>
            ))}
          </div>
          <p className="hidden text-[10px] text-zinc-600 sm:block">Swipe or scroll to reveal more markets</p>
        </div>

        <div className="flex min-w-0 items-end gap-3 overflow-hidden">
          <div className="no-scrollbar flex min-w-0 flex-1 overflow-x-auto" role="tablist" aria-label="Player markets">
            {groupMarkets.map((item) => (
              <button key={item.definition.key} role="tab" disabled={!item.available} aria-selected={market.definition.key === item.definition.key} onClick={() => update({ marketKey: item.definition.key })} title={item.available ? item.definition.market : `${item.definition.market} is unavailable`} className={cn('relative shrink-0 px-3 pb-2.5 pt-1 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400', market.definition.key === item.definition.key ? 'text-teal-300 after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-teal-400' : 'text-zinc-500 hover:text-zinc-100', !item.available && 'cursor-not-allowed opacity-35')}>
                {item.definition.label}
              </button>
            ))}
          </div>
          <div className="no-scrollbar flex min-w-0 max-w-[54%] shrink gap-1 overflow-x-auto pb-2 sm:max-w-none sm:shrink-0">
            {viewModel.profile.periods.map((period) => (
              <button key={period.key} onClick={() => update({ periodKey: period.key })} aria-pressed={periodKey === period.key} className={cn('shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400', periodKey === period.key ? 'border-teal-400/40 bg-teal-400/10 text-teal-300' : 'border-white/[0.08] text-zinc-500 hover:text-zinc-300')}>
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 px-3 py-3 sm:px-4 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.45fr)] lg:items-center">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-600">Selected market</p>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
            <h2 className="text-base font-bold text-zinc-100">{market.definition.market}</h2>
            <span className="text-[10px] text-zinc-600">{periodKey === 'full' ? 'Full Game' : viewModel.profile.periods.find((period) => period.key === periodKey)?.label}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <div className="flex h-9 items-center rounded-lg border border-white/[0.1] bg-[#090a0a]">
              <button onClick={() => update({ line: Math.max(0, line - market.definition.step) })} aria-label="Decrease line" className="grid h-9 w-8 place-items-center text-zinc-500 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"><Minus className="h-3.5 w-3.5" /></button>
              <EditableLineInput line={line} onCommit={(nextLine) => update({ line: nextLine })} />
              <button onClick={() => update({ line: line + market.definition.step })} aria-label="Increase line" className="grid h-9 w-8 place-items-center text-zinc-500 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"><Plus className="h-3.5 w-3.5" /></button>
            </div>

            <SportsbookOfferSelector
              offers={market.offers}
              selectedOffer={selectedOffer}
              onSelect={(offer) => {
                onProviderChange(offer?.id ?? 'all');
                if (offer) update({ line: offer.line });
              }}
            />

            {selectedType && selectedOffer && <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold', selectedType.color)}><img src={selectedType.asset} alt="" className="h-5 w-5 object-contain" />{selectedType.label} · O {formatOdds(selectedOffer.overOdds)}</span>}
            <button disabled={!market.propId} onClick={() => market.propId && toggleSave('props', market.propId)} aria-label={propSaved ? 'Remove prop from saved' : 'Save prop'} aria-pressed={propSaved} className={cn('grid h-9 w-9 place-items-center rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400', propSaved ? 'border-teal-400/40 bg-teal-400/10 text-teal-300' : 'border-white/[0.1] text-zinc-500 hover:text-teal-300')}>
              <Bookmark className={cn('h-3.5 w-3.5', propSaved && 'fill-teal-300')} />
            </button>
          </div>
        </div>

        <div className={cn('grid w-full min-w-0 grid-cols-5 divide-x divide-white/[0.06] py-1', !embedded && 'border-y border-white/[0.06] lg:border-y-0')}>
          {hitRates.map((item) => {
            const hits = item.value === null ? null : Math.round((item.value / 100) * item.sample);
            return <div key={item.label} className="min-w-0 px-1 py-1.5 text-center sm:px-3"><p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-zinc-600 sm:text-[9px]">{item.label}</p><p className={cn('mt-0.5 text-sm font-bold tabular-nums sm:text-base', gradeClass(item.value))}>{item.value === null ? '—' : `${item.value}%`}</p><p className="truncate text-[8px] text-zinc-600 sm:text-[9px]">{item.value === null ? 'No sample' : `${hits}/${item.sample} events`}</p></div>;
          })}
        </div>
      </div>

      <div className={cn('flex flex-wrap items-end gap-2 px-3 py-2 sm:px-4', !embedded && 'border-t border-white/[0.05]')}>
        {viewModel.profile.filters.map((key) => <label key={key} className="grid gap-1 text-[9px] font-semibold uppercase tracking-[0.11em] text-zinc-600">{filterLabels[key]}<select aria-label={filterLabels[key]} value={filters[key]} onChange={(event) => updateFilter(key, event.target.value)} className={selectClass}>{(viewModel.filterOptions[key] ?? [{ value: 'all', label: 'All' }]).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>)}
        <button onClick={() => viewModel.profile.filters.forEach((key) => updateFilter(key, 'all'))} aria-label="Reset filters" title="Reset filters" className="grid h-8 w-8 place-items-center rounded-md border border-white/[0.08] text-zinc-500 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"><SlidersHorizontal className="h-3.5 w-3.5" /></button>
        <span className="ml-auto hidden text-[9px] text-zinc-700 md:inline">Fixed demo data · No live connection</span>
      </div>
    </section>
  );
}
