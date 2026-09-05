import { Bookmark, ChevronDown, Minus, Plus, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { LineType } from '@arena/contracts';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { SportsbookLogo } from '@/features/dashboard/components/SportsbookLogo';
import { bestAvailableOdds, OddsPriceCell } from '@/features/dashboard/components/SportsbookOdds';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { MarketSnapshot, PlayerFilterKey, PlayerResearchViewModel, PlayerRouteSelection, ResearchFilters } from '../types';

const GREEN_GOBLIN_ASSET = '/assets/green-goblin.png';
const DEVIL_ASSET = '/assets/red-devil.png';

const lineTypeMeta: Partial<Record<LineType, { label: string; asset?: string; color: string; surface: string }>> = {
  goblin: { label: 'Goblin', asset: GREEN_GOBLIN_ASSET, color: 'text-emerald-300', surface: 'border-emerald-500/35 bg-emerald-500/[0.07]' },
  devil: { label: 'Devil', asset: DEVIL_ASSET, color: 'text-red-300', surface: 'border-red-500/35 bg-red-500/[0.07]' },
  alternate: { label: 'Alternate', color: 'text-sky-300', surface: 'border-sky-500/30 bg-sky-500/[0.06]' },
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
      className="h-7 w-12 border-x border-white/[0.07] bg-transparent px-1 text-center text-sm font-bold tabular-nums text-white caret-teal-300 outline-none selection:bg-teal-400/40 selection:text-white hover:bg-white/[0.025] focus:bg-teal-400/[0.07] focus:ring-2 focus:ring-inset focus:ring-teal-400/70"
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
  const availableOffers = offers.filter((offer) => !offer.status || offer.status === 'active');
  const bestOverOdds = bestAvailableOdds(availableOffers.map((offer) => offer.overOdds));
  const bestUnderOdds = bestAvailableOdds(availableOffers.map((offer) => offer.underOdds));

  const choose = (offer: MarketSnapshot['offers'][number] | null) => {
    onSelect(offer);
    setOpen(false);
  };

  return (
    <div className="w-[132px] shrink-0">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-label="Sportsbook provider"
            aria-controls="sportsbook-provider-options"
            aria-haspopup="listbox"
            className={cn(
              'flex h-8 w-full items-center gap-1.5 rounded-md border bg-[#111313] px-2 text-left transition-colors hover:border-white/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70',
              selectedType ? selectedType.surface : 'border-white/[0.1]',
            )}
          >
            {selectedOffer ? <SportsbookLogo shortName={selectedOffer.shortName} compact /> : <span aria-hidden="true" className="grid h-5 w-8 place-items-center rounded bg-teal-500/10 text-[7px] font-bold text-teal-300 ring-1 ring-inset ring-teal-500/20">ALL</span>}
            <span className="min-w-0 flex-1">
              <span className="flex min-w-0 items-center gap-1"><span className="truncate text-[9px] font-semibold leading-none text-zinc-100">{selectedOffer?.name ?? 'All Books'}</span>{selectedType && <span className={cn('inline-flex shrink-0 items-center gap-0.5 text-[7px] font-semibold', selectedType.color)}>{selectedType.asset && <img src={selectedType.asset} alt="" className="h-3.5 w-3.5 object-contain" />}{selectedType.label}</span>}</span>
              {selectedOffer ? <span className="mt-0.5 flex items-center gap-1 text-[7px] leading-none tabular-nums"><span className="text-zinc-500">Line <strong className="text-zinc-200">{selectedOffer.line}</strong></span><span className="text-emerald-400">O {formatOdds(selectedOffer.overOdds)}</span><span className="text-red-400">U {formatOdds(selectedOffer.underOdds)}</span></span> : <span className="mt-0.5 block truncate text-[8px] leading-none text-zinc-500">{offers.length} available offers</span>}
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
          className="z-50 max-h-[var(--radix-popover-content-available-height)] w-[min(430px,calc(100vw-24px))] overflow-y-auto rounded-xl border-white/[0.12] bg-[#151818] p-1.5 text-zinc-100 shadow-[0_18px_60px_rgba(0,0,0,0.65)]"
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

            <div className="grid grid-cols-[minmax(120px,1fr)_44px_58px_58px] items-center gap-1.5 px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
              <span>Sportsbook</span><span className="text-center">Line</span><span className="text-center">Over</span><span className="text-center">Under</span>
            </div>

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
                    'grid w-full grid-cols-[minmax(120px,1fr)_44px_58px_58px] items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-40',
                    selectedOffer?.id === offer.id && 'bg-teal-500/[0.09]',
                  )}
                >
                  <span className="flex min-w-0 items-center gap-1.5"><SportsbookLogo shortName={offer.shortName} compact /><span className="min-w-0">
                    <span className="flex min-w-0 items-center gap-1">
                      <span className="truncate text-[11px] font-semibold text-zinc-100">{offer.name}</span>
                      {type && <span className={cn('inline-flex shrink-0 items-center gap-0.5 text-[9px] font-semibold', type.color)}>{type.asset && <img src={type.asset} alt="" className="h-4 w-4 object-contain" />}{type.label}</span>}
                    </span>
                    <span className={cn('mt-0.5 block text-[8px] capitalize', offer.status === 'active' ? 'text-zinc-600' : offer.status === 'stale' ? 'text-amber-300' : 'text-zinc-500')}>{offer.status}</span>
                  </span></span>
                  <span className="text-center text-[11px] font-semibold tabular-nums text-zinc-200">{offer.line}</span>
                  <OddsPriceCell side="over" odds={offer.overOdds} best={offer.overOdds !== null && offer.overOdds === bestOverOdds} />
                  <OddsPriceCell side="under" odds={offer.underOdds} best={offer.underOdds !== null && offer.underOdds === bestUnderOdds} />
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const groupMarkets = viewModel.markets.filter((item) => item.definition.group === group);
  const propSaved = market.propId ? saved.props.includes(market.propId) : false;
  const playedCount = market.history.filter((entry) => entry.availability === 'played' && entry.value !== null).length;
  const selectedOffer = market.offers.find((offer) => offer.id === providerId);
  const hitRates = useMemo(() => [
    { label: 'L5', value: rate(market.history, line, 5), sample: Math.min(5, playedCount) },
    { label: 'L10', value: rate(market.history, line, 10), sample: Math.min(10, playedCount) },
    { label: 'L15', value: rate(market.history, line, 15), sample: Math.min(15, playedCount) },
    { label: 'Season', value: rate(market.history, line), sample: playedCount },
    { label: 'H2H', value: market.hitRates.h2h, sample: Math.min(4, playedCount) },
  ], [line, market, playedCount]);
  const activeFilterCount = viewModel.profile.filters.filter((key) => filters[key] !== 'all').length;

  const selectClass = 'h-7 rounded-md border border-white/[0.08] bg-[#111313] px-2 text-[10px] text-zinc-200 outline-none transition-colors hover:border-white/[0.14] focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30';
  const filterLabels: Record<PlayerFilterKey, string> = { opponent: 'Opponent', season: 'Season', homeAway: 'Home/Away', team: 'Team', event: 'Event', courtType: 'Court' };

  return (
    <section aria-label="Player market workspace" className={cn('w-full min-w-0 max-w-full overflow-hidden bg-[#0f1111]', !embedded && 'rounded-xl border border-white/[0.07]')}>
      <div className="flex min-w-0 flex-nowrap items-center gap-1.5 border-b border-white/[0.06] px-3 py-1.5">
          <div className="flex shrink-0 rounded-md border border-white/[0.08] bg-[#090a0a] p-0.5 text-[9px] font-semibold">
            {(['primary', 'alternate'] as const).map((item) => (
              <button key={item} onClick={() => setGroup(item)} aria-pressed={group === item} className={cn('rounded px-2 py-1 capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400', group === item ? 'bg-teal-500/15 text-teal-300' : 'text-zinc-500 hover:text-zinc-200')}>
                {item}
              </button>
            ))}
          </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="no-scrollbar flex min-w-0 overflow-x-auto whitespace-nowrap" role="tablist" aria-label="Player markets">
            {groupMarkets.map((item) => (
              <button key={item.definition.key} role="tab" disabled={!item.available} aria-selected={market.definition.key === item.definition.key} onClick={() => update({ marketKey: item.definition.key })} title={item.available ? item.definition.market : `${item.definition.market} is unavailable`} className={cn('relative shrink-0 px-2 py-1.5 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400', market.definition.key === item.definition.key ? 'text-teal-300 after:absolute after:inset-x-1.5 after:bottom-0 after:h-px after:bg-teal-400' : 'text-zinc-500 hover:text-zinc-200', !item.available && 'cursor-not-allowed opacity-35')}>
                {item.definition.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="no-scrollbar flex min-w-0 items-center gap-1.5 overflow-x-auto border-b border-white/[0.06] px-3 py-1.5">
            <div className="w-[86px] shrink-0 border-r border-white/[0.065] pr-2">
              <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-zinc-600">Selected prop</p>
              <h2 className="truncate text-[12px] font-bold leading-tight text-zinc-100">{market.definition.market}</h2>
            </div>

            <div className="flex h-8 shrink-0 gap-0.5 rounded-md border border-white/[0.07] bg-[#111313] p-0.5" role="group" aria-label="Game period">
              {viewModel.profile.periods.map((period) => (
                <button key={period.key} onClick={() => update({ periodKey: period.key })} aria-pressed={periodKey === period.key} className={cn('shrink-0 rounded px-1.5 py-1 text-[9px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400', periodKey === period.key ? 'bg-teal-400/[0.12] text-teal-200' : 'text-zinc-500 hover:text-zinc-200')}>
                  {period.label}
                </button>
              ))}
            </div>

            <div className="flex h-8 shrink-0 items-center rounded-md border border-white/[0.1] bg-[#111313]">
              <span className="pl-2 text-[7px] font-semibold uppercase tracking-[0.12em] text-zinc-600">Line</span>
              <button onClick={() => update({ line: Math.max(0, line - market.definition.step) })} aria-label="Decrease line" className="ml-0.5 grid h-7 w-7 place-items-center text-zinc-500 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"><Minus className="h-3 w-3" /></button>
              <EditableLineInput line={line} onCommit={(nextLine) => update({ line: nextLine })} />
              <button onClick={() => update({ line: line + market.definition.step })} aria-label="Increase line" className="grid h-7 w-7 place-items-center text-zinc-500 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"><Plus className="h-3 w-3" /></button>
            </div>

            <SportsbookOfferSelector
              offers={market.offers}
              selectedOffer={selectedOffer}
              onSelect={(offer) => {
                onProviderChange(offer?.id ?? 'all');
                if (offer) update({ line: offer.line });
              }}
            />

            <button disabled={!market.propId} onClick={() => market.propId && toggleSave('props', market.propId)} aria-label={propSaved ? 'Remove prop from saved' : 'Save prop'} aria-pressed={propSaved} className={cn('inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-md border px-2 text-[9px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400', propSaved ? 'border-teal-400/40 bg-teal-400/10 text-teal-300' : 'border-white/[0.1] text-zinc-500 hover:text-teal-300')}>
              <Bookmark className={cn('h-3 w-3', propSaved && 'fill-teal-300')} />{propSaved ? 'Saved' : 'Save'}
            </button>
            <button type="button" onClick={() => setFiltersOpen((current) => !current)} aria-expanded={filtersOpen} aria-controls="player-history-filters" className={cn('inline-flex h-8 shrink-0 items-center gap-1 rounded-md border px-2 text-[9px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400', filtersOpen || activeFilterCount > 0 ? 'border-teal-400/35 bg-teal-400/[0.08] text-teal-300' : 'border-white/[0.1] text-zinc-500 hover:text-teal-300')}>
              <SlidersHorizontal className="h-3 w-3" />Filters{activeFilterCount > 0 && <span className="rounded bg-teal-400/15 px-1 text-[8px] tabular-nums">{activeFilterCount}</span>}<ChevronDown className={cn('h-3 w-3 transition-transform', filtersOpen && 'rotate-180')} />
            </button>
      </div>

      {filtersOpen && <div id="player-history-filters" className="no-scrollbar flex min-w-0 items-center gap-1.5 overflow-x-auto border-b border-white/[0.06] bg-black/10 px-3 py-1.5" aria-label="Player history filters">
          {viewModel.profile.filters.map((key) => <label key={key} className="flex shrink-0 items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-zinc-600"><span>{filterLabels[key]}</span><select aria-label={filterLabels[key]} value={filters[key]} onChange={(event) => updateFilter(key, event.target.value)} className={selectClass}>{(viewModel.filterOptions[key] ?? [{ value: 'all', label: 'All' }]).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>)}
          <button onClick={() => viewModel.profile.filters.forEach((key) => updateFilter(key, 'all'))} aria-label="Reset filters" title="Reset filters" className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md border border-white/[0.08] px-2 text-[9px] font-semibold text-zinc-500 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"><SlidersHorizontal className="h-3 w-3" />Reset</button>
      </div>}

      <div className="overflow-x-auto border-b border-white/[0.06]" aria-label="Hit-rate summary">
          <div className="grid min-w-[500px] grid-cols-5 divide-x divide-white/[0.065]">
          {hitRates.map((item) => {
            const hits = item.value === null ? null : Math.round((item.value / 100) * item.sample);
            return <div key={item.label} className="flex min-w-0 items-baseline justify-center gap-1.5 px-2 py-1.5 text-center"><p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-zinc-600">{item.label}</p><p className={cn('text-[12px] font-bold tabular-nums', gradeClass(item.value))}>{item.value === null ? '—' : `${item.value}%`}</p><p className="text-[8px] font-medium text-zinc-600">{item.value === null ? 'No sample' : `${hits}/${item.sample}`}</p></div>;
          })}
          </div>
      </div>

    </section>
  );
}
