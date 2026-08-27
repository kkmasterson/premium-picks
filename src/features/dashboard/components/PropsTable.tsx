import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Prop } from '@/features/dashboard/types';
import { bestBook, formatOdds, playerById } from '@/features/dashboard/data';
import { useDashboard, type Density } from '@/features/dashboard/DashboardProvider';
import { cn } from '@/lib/utils';
import { DiffBadge, HitRateBadge, PlayerAvatar, hitTone } from './common';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SortKey = 'line' | 'avg' | 'projection' | 'diff' | 'l5' | 'l10' | 'l15' | 'season' | 'h2h' | 'streak' | 'time';

const SORT_LABELS: Partial<Record<SortKey, string>> = {
  line: 'Line', avg: 'Avg', projection: 'Proj', diff: 'Diff',
  l5: 'L5', l10: 'L10', l15: 'L15', season: 'SZN', h2h: 'H2H', streak: 'Streak', time: 'Time',
};

const TOOLTIPS: Partial<Record<SortKey, string>> = {
  l5: 'Percentage of the player\'s last 5 games clearing this line.',
  l10: 'Percentage of the player\'s last 10 games clearing this line.',
  l15: 'Percentage of the player\'s last 15 games clearing this line.',
  season: 'Percentage of season games clearing this line.',
  diff: 'Difference between the Arena Props projection and the sportsbook line.',
  projection: 'Arena Props model projection for this prop.',
  h2h: 'Hit rate in head-to-head meetings with this opponent.',
};

const DENSITY_ROW: Record<Density, string> = {
  comfortable: 'py-2.5',
  standard: 'py-1.5',
  compact: 'py-1',
};

interface Column { key: string; sortKey?: SortKey; label: string; align?: 'left' | 'right' | 'center'; optional?: boolean; }

const COLUMNS: Column[] = [
  { key: 'player', label: 'Player' },
  { key: 'prop', label: 'Prop' },
  { key: 'line', sortKey: 'line', label: 'Line', align: 'right' },
  { key: 'books', label: 'Books' },
  { key: 'avg', sortKey: 'avg', label: 'Avg', align: 'right' },
  { key: 'projection', sortKey: 'projection', label: 'Proj', align: 'right' },
  { key: 'diff', sortKey: 'diff', label: 'Diff', align: 'right' },
  { key: 'l5', sortKey: 'l5', label: 'L5', align: 'center' },
  { key: 'l10', sortKey: 'l10', label: 'L10', align: 'center' },
  { key: 'l15', sortKey: 'l15', label: 'L15', align: 'center' },
  { key: 'season', sortKey: 'season', label: 'SZN', align: 'center' },
  { key: 'h2h', sortKey: 'h2h', label: 'H2H', align: 'center', optional: true },
  { key: 'streak', sortKey: 'streak', label: 'Streak', align: 'center', optional: true },
  { key: 'time', sortKey: 'time', label: 'Game', align: 'right', optional: true },
];

function sortValue(p: Prop, key: SortKey): number | string {
  switch (key) {
    case 'line': return p.line;
    case 'avg': return p.avg;
    case 'projection': return p.projection;
    case 'diff': return p.diff;
    case 'l5': return p.l5;
    case 'l10': return p.l10;
    case 'l15': return p.l15;
    case 'season': return p.season;
    case 'h2h': return p.h2h;
    case 'streak': return p.streak.count * (p.streak.type === 'Over' ? 1 : -1);
    case 'time': return playerById(p.playerId)?.gameTime ?? '';
  }
}

function BooksCell({ prop, density }: { prop: Prop; density: Density }) {
  const best = bestBook(prop, 'over');
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex w-fit items-center gap-1.5 whitespace-nowrap rounded border border-[#F5C542]/50 bg-[#F5C542]/5 px-1.5 py-px text-[10px] tabular-nums">
        <span className="w-7 font-bold text-[#F5C542]">{best.book}</span>
        <span className="text-zinc-200">{best.line}</span>
        <span className="text-zinc-500">O {formatOdds(best.over)}</span>
        {density !== 'compact' && <span className="text-zinc-500">U {formatOdds(best.under)}</span>}
        <span className="rounded bg-[#F5C542] px-1 text-[8px] font-bold text-black">BEST</span>
      </div>
      {prop.books.length > 1 && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 rounded text-[10px] font-medium text-[#F5C542] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542]"
              aria-label={`Show ${prop.books.length - 1} more sportsbook lines`}
            >
              +{prop.books.length - 1}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-max min-w-56 space-y-1 border-[#2a2a2a] bg-[#111] p-2 shadow-2xl shadow-black/70"
            onClick={(e) => e.stopPropagation()}
          >
            {prop.books.map((book) => (
              <div key={book.book} className={cn('flex items-center gap-2 rounded border px-2 py-1 text-[10px] tabular-nums', book.book === best.book ? 'border-[#F5C542]/40 bg-[#F5C542]/5' : 'border-[#242424] bg-[#161616]')}>
                <span className={cn('w-8 font-bold', book.book === best.book ? 'text-[#F5C542]' : 'text-zinc-300')}>{book.book}</span>
                <span className="w-8 text-zinc-200">{book.line}</span>
                <span className="text-zinc-500">O {formatOdds(book.over)}</span>
                <span className="text-zinc-500">U {formatOdds(book.under)}</span>
                {book.book === best.book && <span className="rounded bg-[#F5C542] px-1 text-[8px] font-bold text-black">BEST</span>}
              </div>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export function PropsTable({ props, showSport = false }: { props: Prop[]; showSport?: boolean }) {
  const { openDrawer, density, setDensity, saved, toggleSave } = useDashboard();
  const [sortKey, setSortKey] = useState<SortKey>('l10');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [visible, setVisible] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('pp-columns') || 'null') ?? COLUMNS.map((c) => c.key); }
    catch { return COLUMNS.map((c) => c.key); }
  });
  const [colMenu, setColMenu] = useState(false);

  const cols = COLUMNS.filter((c) => visible.includes(c.key));

  const sorted = useMemo(() => {
    const arr = [...props];
    arr.sort((a, b) => {
      const va = sortValue(a, sortKey), vb = sortValue(b, sortKey);
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [props, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const cur = Math.min(page, totalPages - 1);
  const rows = sorted.slice(cur * pageSize, (cur + 1) * pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
    setPage(0);
  };

  const rowPad = DENSITY_ROW[density];

  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#101010]">
        <div className="flex items-center justify-between border-b border-[#1f1f1f] px-3 py-1.5">
          <p className="text-xs text-zinc-500">{sorted.length} props</p>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-[#2a2a2a] bg-[#111] p-0.5" role="group" aria-label="Table density">
              {(['compact', 'standard', 'comfortable'] as Density[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setDensity(option)}
                  aria-pressed={density === option}
                  className={cn('rounded px-2 py-1 text-[10px] capitalize focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542]', density === option ? 'bg-[#F5C542]/15 text-[#F5C542]' : 'text-zinc-500 hover:text-zinc-300')}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="relative">
            <button
              onClick={() => setColMenu((c) => !c)}
              className="rounded-md border border-[#2a2a2a] px-2.5 py-1 text-xs text-zinc-300 hover:bg-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
              aria-haspopup="menu" aria-expanded={colMenu}
            >
              Columns
            </button>
            {colMenu && (
              <div role="menu" className="absolute right-0 top-8 z-30 w-44 rounded-lg border border-[#2a2a2a] bg-[#141414] p-2 shadow-xl">
                {COLUMNS.filter((c) => !['player', 'prop', 'line', 'books'].includes(c.key)).map((c) => (
                  <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs text-zinc-300 hover:bg-[#1c1c1c]">
                    <input
                      type="checkbox"
                      checked={visible.includes(c.key)}
                      onChange={() => {
                        const next = visible.includes(c.key) ? visible.filter((v) => v !== c.key) : [...visible, c.key];
                        setVisible(next);
                        localStorage.setItem('pp-columns', JSON.stringify(next));
                      }}
                      className="accent-[#F5C542]"
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#141414] text-left">
                <th className="w-8 px-2 py-1.5" aria-label="Save" />
                {cols.map((c) => (
                  <th
                    key={c.key}
                    className={cn(
                      'whitespace-nowrap px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500',
                      c.align === 'right' && 'text-right', c.align === 'center' && 'text-center',
                    )}
                    aria-sort={c.sortKey === sortKey ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    {c.sortKey ? (
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => toggleSort(c.sortKey!)}
                            className={cn(
                              'inline-flex items-center gap-1 uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542] rounded',
                              c.align === 'right' && 'flex-row-reverse',
                              sortKey === c.sortKey ? 'text-[#F5C542]' : 'hover:text-zinc-300',
                            )}
                          >
                            {SORT_LABELS[c.sortKey]}
                            {sortKey === c.sortKey
                              ? (sortDir === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)
                              : <ArrowUpDown className="h-3 w-3 opacity-40" />}
                          </button>
                        </TooltipTrigger>
                        {TOOLTIPS[c.sortKey] && (
                          <TooltipContent className="max-w-56 border-[#2a2a2a] bg-[#171717] text-xs text-zinc-200">{TOOLTIPS[c.sortKey]}</TooltipContent>
                        )}
                      </Tooltip>
                    ) : c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const pl = playerById(p.playerId)!;
                const isSaved = saved.props.includes(p.id);
                return (
                  <tr
                    key={p.id}
                    onClick={() => openDrawer(p.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter') openDrawer(p.id); }}
                    tabIndex={0}
                    className="cursor-pointer border-t border-[#181818] transition-colors hover:bg-[#161616] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#F5C542]"
                  >
                    <td className={cn('px-2', rowPad)}>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSave('props', p.id); }}
                        aria-label={isSaved ? `Remove ${pl.name} ${p.market} from saved` : `Save ${pl.name} ${p.market}`}
                        aria-pressed={isSaved}
                        className="rounded p-1 text-zinc-600 hover:text-[#F5C542] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542]"
                      >
                        <Bookmark className={cn('h-3.5 w-3.5', isSaved && 'fill-[#F5C542] text-[#F5C542]')} />
                      </button>
                    </td>
                    {cols.map((c) => {
                      switch (c.key) {
                        case 'player':
                          return (
                            <td key={c.key} className={cn('px-3', rowPad)}>
                              <div className="flex items-center gap-2.5">
                                <PlayerAvatar name={pl.name} size={density === 'comfortable' ? 'md' : 'sm'} />
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-semibold text-zinc-100">
                                    {pl.name}
                                    {showSport && <span className="ml-1.5 rounded bg-[#1d1d1d] px-1 text-[10px] font-semibold text-zinc-400">{pl.sport}</span>}
                                  </p>
                                  <p className="truncate text-[10px] text-zinc-500">{pl.team} · {pl.pos} · {pl.home ? 'vs' : '@'} {pl.opponent} · {pl.gameTime}</p>
                                </div>
                              </div>
                            </td>
                          );
                        case 'prop': return <td key={c.key} className={cn('whitespace-nowrap px-3 text-zinc-200', rowPad)}>{p.market}</td>;
                        case 'line': return <td key={c.key} className={cn('px-3 text-right font-semibold tabular-nums text-zinc-100', rowPad)}>{p.line}</td>;
                        case 'books': return <td key={c.key} className={cn('px-3', rowPad)}><BooksCell prop={p} density={density} /></td>;
                        case 'avg': return <td key={c.key} className={cn('px-3 text-right tabular-nums text-zinc-300', rowPad)}>{p.avg}</td>;
                        case 'projection': return <td key={c.key} className={cn('px-3 text-right font-semibold tabular-nums text-[#F5C542]', rowPad)}>{p.projection.toFixed(1)}</td>;
                        case 'diff': return <td key={c.key} className={cn('px-3 text-right', rowPad)}><DiffBadge diff={p.diff} /></td>;
                        case 'l5': case 'l10': case 'l15': case 'season': case 'h2h': {
                          const v = p[c.key as 'l5' | 'l10' | 'l15' | 'season' | 'h2h'];
                          return <td key={c.key} className={cn('px-3 text-center', rowPad)}><HitRateBadge pct={v} label={SORT_LABELS[c.sortKey!]} /></td>;
                        }
                        case 'streak': {
                          const tone = hitTone(p.streak.type === 'Over' ? 70 : 30);
                          return (
                            <td key={c.key} className={cn('px-3 text-center', rowPad)}>
                              <span className={cn('text-xs font-semibold', tone === 'strong' ? 'text-emerald-400' : 'text-red-400')}>
                                {p.streak.type[0]}{p.streak.count}
                              </span>
                            </td>
                          );
                        }
                        case 'time': return <td key={c.key} className={cn('whitespace-nowrap px-3 text-right text-xs text-zinc-400', rowPad)}>{pl.gameTime}</td>;
                        default: return null;
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#1f1f1f] px-3 py-2">
          <p className="text-xs text-zinc-500">Page {cur + 1} / {totalPages}</p>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-zinc-500">
              Rows:
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                className="rounded border border-[#2a2a2a] bg-[#141414] px-1.5 py-1 text-xs text-zinc-200 focus:border-[#F5C542]/50 focus:outline-none"
                aria-label="Rows per page"
              >
                {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={cur === 0}
              className="rounded-md border border-[#2a2a2a] p-1.5 text-zinc-300 hover:bg-[#1a1a1a] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={cur >= totalPages - 1}
              className="rounded-md border border-[#2a2a2a] p-1.5 text-zinc-300 hover:bg-[#1a1a1a] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
