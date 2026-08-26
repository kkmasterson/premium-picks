import { useMemo, useState } from 'react';
import { PROPS, bestBook, playerById } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { GlobalSearch } from '@/features/dashboard/components/GlobalSearch';
import { DEFAULT_FILTERS, FilterToolbar, filterProps } from '@/features/dashboard/components/FilterToolbar';
import { PropsTable } from '@/features/dashboard/components/PropsTable';
import { EmptyState, HitRateBadge, PlayerAvatar, DiffBadge } from '@/features/dashboard/components/common';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatOdds } from '@/features/dashboard/data';
import type { Filters } from '@/features/dashboard/types';

function MobilePropCards({ filters }: { filters: Filters }) {
  const { sport, openDrawer, saved, toggleSave } = useDashboard();
  const props = useMemo(() => filterProps(
    PROPS, filters, sport,
    (id) => playerById(id),
    (p) => p[filters.hitRateRange === 'season' ? 'season' : filters.hitRateRange],
    (p) => bestBook(p, 'over').over,
  ), [filters, sport]);

  if (props.length === 0) return <EmptyState title="No props match these filters." />;
  return (
    <div className="space-y-3">
      {props.slice(0, 40).map((p) => {
        const pl = playerById(p.playerId)!;
        const best = bestBook(p, 'over');
        const isSaved = saved.props.includes(p.id);
        return (
          <article key={p.id} className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-3.5">
            <div className="flex items-start gap-3">
              <PlayerAvatar name={pl.name} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-zinc-100">{pl.name}</p>
                  <button
                    onClick={() => toggleSave('props', p.id)}
                    aria-label={isSaved ? 'Remove from saved' : 'Save prop'}
                    aria-pressed={isSaved}
                    className="rounded p-1 text-zinc-500 hover:text-[#F5C542]"
                  >
                    <Bookmark className={cn('h-4 w-4', isSaved && 'fill-[#F5C542] text-[#F5C542]')} />
                  </button>
                </div>
                <p className="text-xs text-zinc-500">{pl.team} {pl.home ? 'vs' : '@'} {pl.opponent} · {pl.gameTime}</p>
                <div className="mt-2 flex items-center justify-between rounded-lg bg-[#0c0c0c] px-3 py-2">
                  <div>
                    <p className="text-xs text-zinc-500">{p.market}</p>
                    <p className="text-base font-bold tabular-nums text-zinc-100">Line {p.line}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">Best Line</p>
                    <p className="text-sm font-bold text-[#F5C542]">{best.book} {formatOdds(best.over)}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-[10px] text-zinc-500">L5 <HitRateBadge pct={p.l5} /></span>
                    <span className="text-[10px] text-zinc-500">L10 <HitRateBadge pct={p.l10} /></span>
                    <span className="text-[10px] text-zinc-500">SZN <HitRateBadge pct={p.season} /></span>
                  </div>
                  <DiffBadge diff={p.diff} />
                </div>
                <button
                  onClick={() => openDrawer(p.id)}
                  className="mt-3 w-full rounded-md border border-[#F5C542]/40 py-2 text-xs font-semibold text-[#F5C542] hover:bg-[#F5C542]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
                >
                  View Research
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function PropsPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const { sport, setSport } = useDashboard();

  const filtered = useMemo(() => filterProps(
    PROPS, filters, sport,
    (id) => playerById(id),
    (p) => p[filters.hitRateRange === 'season' ? 'season' : filters.hitRateRange],
    (p) => bestBook(p, 'over').over,
  ), [filters, sport]);

  const minUpdated = useMemo(
    () => (filtered.length ? Math.min(...filtered.flatMap((p) => p.books.map((b) => b.updatedAt))) : 0),
    [filtered],
  );

  return (
    <div className="space-y-3">
      <GlobalSearch onPickPlayer={(id) => setFilters({ ...filters, playerId: id })} />
      <FilterToolbar filters={filters} setFilters={setFilters} />

      <div className="flex items-center justify-between px-1">
        <h1 className="text-sm font-semibold text-zinc-200">
          {sport === 'All' ? 'All Sports' : sport} Player Props
        </h1>
        {filtered.length > 0 && (
          <p className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Updated {minUpdated < 60 ? `${minUpdated}s` : `${Math.round(minUpdated / 60)}m`} ago
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden">
        <MobilePropCards filters={filters} />
      </div>

      {/* Desktop / tablet table */}
      <div className="hidden md:block">
        {filtered.length === 0 ? (
          <EmptyState
            title="No props match these filters."
            action={
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="rounded-md border border-[#F5C542]/40 px-3 py-1.5 text-xs font-semibold text-[#F5C542] hover:bg-[#F5C542]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <PropsTable props={filtered} showSport={sport === 'All'} />
        )}
      </div>

      {sport === 'All' && filtered.length === 0 && (
        <p className="px-1 text-xs text-zinc-600">
          Try selecting a sport like{' '}
          <button className="text-[#F5C542] hover:underline" onClick={() => setSport('NBA')}>NBA</button> to browse today's props.
        </p>
      )}
    </div>
  );
}
