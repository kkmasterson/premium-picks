import { useMemo, useRef, useState, useEffect } from 'react';
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import type { Filters, Sport } from '@/features/dashboard/types';
import { BOOKS, GAMES, PLAYERS, marketsForSport } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { SportsbookLogo } from '@/features/dashboard/components/SportsbookLogo';
import { cn } from '@/lib/utils';

export const DEFAULT_FILTERS: Filters = {
  gameId: null, playerId: null, market: null, books: [],
  minOdds: null, maxOdds: null, minHitRate: null, hitRateRange: 'l10',
  date: 'Today', homeAway: 'all', minBooks: 1, minDiff: null,
};

interface PopoverProps {
  label: string;
  active?: boolean;
  children: (close: () => void) => React.ReactNode;
  activeLabel?: string;
}

function FilterPopover({ label, active, children, activeLabel }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]',
          active
            ? 'border-[#F5C542]/50 bg-[#F5C542]/10 text-[#F5C542]'
            : 'border-[#2a2a2a] bg-[#141414] text-zinc-300 hover:bg-[#1b1b1b]',
        )}
      >
        {active && activeLabel ? `${label}: ${activeLabel}` : label}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-9 z-40 max-h-80 w-64 overflow-y-auto rounded-lg border border-[#2a2a2a] bg-[#141414] p-1.5 shadow-2xl shadow-black/60">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function OptionRow({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      role="menuitemradio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542]',
        selected ? 'bg-[#F5C542]/10 text-[#F5C542]' : 'text-zinc-300 hover:bg-[#1c1c1c]',
      )}
    >
      <span className="truncate">{children}</span>
      {selected && <Check className="h-3.5 w-3.5 shrink-0" />}
    </button>
  );
}

function SearchableList({ items, onPick, selectedId, placeholder }: {
  items: { id: string; label: string; sub?: string }[];
  onPick: (id: string | null) => void;
  selectedId: string | null;
  placeholder: string;
}) {
  const [q, setQ] = useState('');
  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="mb-1 h-8 w-full rounded-md border border-[#2a2a2a] bg-[#101010] px-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-[#F5C542]/50 focus:outline-none"
      />
      <OptionRow selected={selectedId === null} onClick={() => onPick(null)}>All</OptionRow>
      {filtered.map((i) => (
        <OptionRow key={i.id} selected={selectedId === i.id} onClick={() => onPick(i.id)}>
          {i.label}{i.sub && <span className="ml-1 text-zinc-500">{i.sub}</span>}
        </OptionRow>
      ))}
    </div>
  );
}

export function FilterToolbar({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) {
  const { sport } = useDashboard();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sportGames = useMemo(() => GAMES.filter((g) => sport === 'All' || g.sport === sport), [sport]);
  const sportPlayers = useMemo(() => PLAYERS.filter((p) => sport === 'All' || p.sport === sport), [sport]);
  const markets = useMemo(() => marketsForSport(sport), [sport]);

  const set = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch });
  const activeCount =
    (filters.gameId ? 1 : 0) + (filters.playerId ? 1 : 0) + (filters.market ? 1 : 0) +
    (filters.books.length > 0 ? 1 : 0) + (filters.minHitRate != null ? 1 : 0) +
    (filters.minOdds != null || filters.maxOdds != null ? 1 : 0) +
    (filters.date !== 'Today' ? 1 : 0) +
    (filters.homeAway !== 'all' ? 1 : 0) + (filters.minBooks > 1 ? 1 : 0) + (filters.minDiff != null ? 1 : 0);

  const gameLabel = filters.gameId ? (() => { const g = sportGames.find((g) => g.id === filters.gameId); return g ? `${g.awayTeam} @ ${g.homeTeam}` : null; })() : null;
  const playerLabel = filters.playerId ? sportPlayers.find((p) => p.id === filters.playerId)?.name : undefined;

  return (
    <div className="sticky top-14 z-30 -mx-1 border-b border-[#1a1a1a] bg-[#080808]/95 px-1 py-2 backdrop-blur">
      <div className="flex flex-wrap items-center gap-1.5">
        <FilterPopover label="Game" active={!!filters.gameId} activeLabel={gameLabel ?? undefined}>
          {(close) => (
            <SearchableList
              placeholder="Search games..."
              selectedId={filters.gameId}
              onPick={(id) => { set({ gameId: id }); close(); }}
              items={sportGames.map((g) => ({ id: g.id, label: `${g.awayTeam} @ ${g.homeTeam}`, sub: g.time }))}
            />
          )}
        </FilterPopover>

        <FilterPopover label="Player" active={!!filters.playerId} activeLabel={playerLabel}>
          {(close) => (
            <SearchableList
              placeholder="Search players..."
              selectedId={filters.playerId}
              onPick={(id) => { set({ playerId: id }); close(); }}
              items={sportPlayers.map((p) => ({ id: p.id, label: p.name, sub: `${p.team} · ${p.pos}` }))}
            />
          )}
        </FilterPopover>

        <FilterPopover label="Prop" active={!!filters.market} activeLabel={filters.market ?? undefined}>
          {(close) => (
            <div>
              <OptionRow selected={!filters.market} onClick={() => { set({ market: null }); close(); }}>All props</OptionRow>
              {markets.map((m) => (
                <OptionRow key={m} selected={filters.market === m} onClick={() => { set({ market: m }); close(); }}>{m}</OptionRow>
              ))}
            </div>
          )}
        </FilterPopover>

        <FilterPopover label="Sportsbooks" active={filters.books.length > 0} activeLabel={filters.books.length ? `${filters.books.length}` : undefined}>
          {() => (
            <div>
              <OptionRow selected={filters.books.length === 0} onClick={() => set({ books: [] })}>All sportsbooks</OptionRow>
              {Object.entries(BOOKS).map(([k, name]) => {
                const sel = filters.books.includes(k);
                return (
                  <OptionRow
                    key={k}
                    selected={sel}
                    onClick={() => set({ books: sel ? filters.books.filter((b) => b !== k) : [...filters.books, k] })}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <SportsbookLogo shortName={k} compact />
                      <span className="truncate">{name} <span className="text-zinc-500">{k}</span></span>
                    </span>
                  </OptionRow>
                );
              })}
            </div>
          )}
        </FilterPopover>

        <FilterPopover label="Odds" active={filters.minOdds != null || filters.maxOdds != null} activeLabel={filters.minOdds != null ? `${filters.minOdds}+` : undefined}>
          {() => (
            <div className="p-1.5">
              <p className="pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Best over odds range</p>
              <div className="flex items-center gap-2">
                <input
                  type="number" placeholder="Min" value={filters.minOdds ?? ''}
                  onChange={(e) => set({ minOdds: e.target.value === '' ? null : Number(e.target.value) })}
                  aria-label="Minimum odds"
                  className="h-8 w-24 rounded-md border border-[#2a2a2a] bg-[#101010] px-2 text-xs text-zinc-100 focus:border-[#F5C542]/50 focus:outline-none"
                />
                <span className="text-zinc-600">—</span>
                <input
                  type="number" placeholder="Max" value={filters.maxOdds ?? ''}
                  onChange={(e) => set({ maxOdds: e.target.value === '' ? null : Number(e.target.value) })}
                  aria-label="Maximum odds"
                  className="h-8 w-24 rounded-md border border-[#2a2a2a] bg-[#101010] px-2 text-xs text-zinc-100 focus:border-[#F5C542]/50 focus:outline-none"
                />
              </div>
              <button
                onClick={() => set({ minOdds: null, maxOdds: null })}
                className="mt-2 text-xs text-zinc-500 hover:text-zinc-300"
              >Clear</button>
            </div>
          )}
        </FilterPopover>

        <FilterPopover label="Hit Rate" active={filters.minHitRate != null} activeLabel={filters.minHitRate != null ? `${filters.minHitRate}%+` : undefined}>
          {(close) => (
            <div>
              <p className="px-2.5 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Minimum hit rate</p>
              {[null, 60, 70, 80, 90].map((v) => (
                <OptionRow key={String(v)} selected={filters.minHitRate === v} onClick={() => { set({ minHitRate: v }); close(); }}>
                  {v == null ? 'Any' : `${v}%+`}
                </OptionRow>
              ))}
              <p className="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Range</p>
              {(['l5', 'l10', 'l15', 'season'] as const).map((r) => (
                <OptionRow key={r} selected={filters.hitRateRange === r} onClick={() => set({ hitRateRange: r })}>
                  {r === 'season' ? 'Season' : r.toUpperCase()}
                </OptionRow>
              ))}
            </div>
          )}
        </FilterPopover>

        <FilterPopover label="Date" active={filters.date !== 'Today'} activeLabel={filters.date !== 'Today' ? filters.date : undefined}>
          {(close) => (
            <div>
              {['Today', 'Tomorrow', 'This Week'].map((d) => (
                <OptionRow key={d} selected={filters.date === d} onClick={() => { set({ date: d }); close(); }}>{d}</OptionRow>
              ))}
            </div>
          )}
        </FilterPopover>

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border border-[#2a2a2a] bg-[#141414] px-2.5 text-xs font-medium text-zinc-300 hover:bg-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" /> More Filters
        </button>

        {activeCount > 0 && (
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-zinc-400 hover:text-[#F5C542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
          >
            <X className="h-3.5 w-3.5" /> Clear Filters
          </button>
        )}
      </div>

      {/* Advanced filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Advanced filters">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-[#222] bg-[#0e0e0e] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1c1c1c] px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-100">Advanced Filters</h2>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close advanced filters" className="rounded p-1 text-zinc-400 hover:bg-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-4">
              <div>
                <p className="mb-1.5 text-xs font-semibold text-zinc-300">Home / Away</p>
                <div className="flex gap-1.5">
                  {(['all', 'home', 'away'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => set({ homeAway: v })}
                      aria-pressed={filters.homeAway === v}
                      className={cn(
                        'flex-1 rounded-md border px-2 py-1.5 text-xs capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]',
                        filters.homeAway === v ? 'border-[#F5C542]/50 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#2a2a2a] text-zinc-400 hover:bg-[#181818]',
                      )}
                    >
                      {v === 'all' ? 'All' : v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold text-zinc-300">Minimum sportsbook count</p>
                <input
                  type="range" min={1} max={6} value={filters.minBooks}
                  onChange={(e) => set({ minBooks: Number(e.target.value) })}
                  aria-label="Minimum sportsbook count"
                  aria-valuetext={`${filters.minBooks} sportsbooks`}
                  className="w-full accent-[#F5C542]"
                />
                <p className="text-xs text-zinc-500">{filters.minBooks}+ books</p>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold text-zinc-300">Minimum projection difference</p>
                <div className="flex gap-1.5">
                  {[null, 1, 2, 3, 5].map((v) => (
                    <button
                      key={String(v)}
                      onClick={() => set({ minDiff: v })}
                      aria-pressed={filters.minDiff === v}
                      className={cn(
                        'flex-1 rounded-md border px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]',
                        filters.minDiff === v ? 'border-[#F5C542]/50 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#2a2a2a] text-zinc-400 hover:bg-[#181818]',
                      )}
                    >
                      {v == null ? 'Any' : `+${v}`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold text-zinc-300">Hit rate thresholds</p>
                <p className="text-xs leading-relaxed text-zinc-500">
                  L5 / L10 / L15 / Season thresholds can be set from the Hit Rate filter in the toolbar.
                </p>
              </div>
            </div>
            <div className="flex gap-2 border-t border-[#1c1c1c] p-4">
              <button
                onClick={() => { setFilters(DEFAULT_FILTERS); }}
                className="flex-1 rounded-md border border-[#2a2a2a] py-2 text-xs font-medium text-zinc-300 hover:bg-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
              >
                Reset
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 rounded-md bg-[#F5C542] py-2 text-xs font-bold text-black hover:bg-[#FFD95A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD95A]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function filterProps<T extends { playerId: string; market: string; books: unknown[]; diff: number }>(
  props: T[], filters: Filters, sport: Sport | 'All',
  getPlayer: (id: string) => { sport: Sport; gameId: string; home: boolean } | undefined,
  getHitRate: (p: T) => number,
  getBestOver: (p: T) => number,
): T[] {
  return props.filter((p) => {
    const pl = getPlayer(p.playerId);
    if (!pl) return false;
    if (sport !== 'All' && pl.sport !== sport) return false;
    if (filters.gameId && pl.gameId !== filters.gameId) return false;
    if (filters.playerId && p.playerId !== filters.playerId) return false;
    if (filters.market && p.market !== filters.market) return false;
    if (filters.books.length > 0 && !(p.books as { book: string }[]).some((b) => filters.books.includes(b.book))) return false;
    if (filters.minHitRate != null && getHitRate(p) < filters.minHitRate) return false;
    if (filters.minOdds != null && getBestOver(p) < filters.minOdds) return false;
    if (filters.maxOdds != null && getBestOver(p) > filters.maxOdds) return false;
    if (filters.homeAway !== 'all' && (filters.homeAway === 'home') !== pl.home) return false;
    if (p.books.length < filters.minBooks) return false;
    if (filters.minDiff != null && p.diff < filters.minDiff) return false;
    return true;
  });
}
