import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, CircleHelp, ListPlus, Star, TrendingUp } from 'lucide-react';
import { BOOKS, PROPS, SPORTS, formatOdds, playerById } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { marketKeyForName } from '@/features/dashboard/player-screen/profiles';
import { PlayerAvatar } from '@/features/dashboard/components/common';
import { cn } from '@/lib/utils';
import type { BookLine, Prop } from '@/features/dashboard/types';

function useStoredArray(key: string) {
  const [value, setValue] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(key) ?? '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}

function useStoredNumber(key: string, fallback: number) {
  const [value, setValue] = useState(() => Number(localStorage.getItem(key) ?? fallback));
  useEffect(() => { localStorage.setItem(key, String(value)); }, [key, value]);
  return [value, setValue] as const;
}

function useScrollRestore(key: string) {
  useEffect(() => {
    const position = Number(sessionStorage.getItem(key) ?? 0);
    const timer = window.setTimeout(() => window.scrollTo(0, position), 0);
    return () => {
      window.clearTimeout(timer);
      sessionStorage.setItem(key, String(window.scrollY));
    };
  }, [key]);
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function PageHeading({ title, description }: { title: string; description: string }) {
  const { navigate } = useDashboard();
  return <header className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[#242424] bg-gradient-to-r from-[#17140b] to-[#0d0d0d] px-4 py-3">
    <div><h1 className="text-lg font-bold text-white">{title}</h1><p className="mt-0.5 text-xs text-zinc-500">{description}</p></div>
    <button onClick={() => navigate('help')} className="flex items-center gap-1.5 rounded-md border border-[#303030] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-400 hover:border-[#F5C542]/40 hover:text-[#F5C542]"><CircleHelp className="h-3.5 w-3.5" /> Help</button>
  </header>;
}

function MultiFilter({ label, values, options, onChange }: { label: string; values: string[]; options: Array<{ value: string; label: string }>; onChange: (values: string[]) => void }) {
  return <fieldset className="min-w-0"><legend className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">{label}</legend><div className="no-scrollbar flex gap-1 overflow-x-auto pb-1">
    <button onClick={() => onChange([])} aria-pressed={values.length === 0} className={cn('shrink-0 rounded-md border px-2.5 py-1.5 text-[10px] font-semibold', values.length === 0 ? 'border-[#F5C542]/40 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#292929] text-zinc-500')}>All</button>
    {options.map((option) => <button key={option.value} onClick={() => onChange(toggleValue(values, option.value))} aria-pressed={values.includes(option.value)} aria-label={`${label}: ${option.label}`} className={cn('shrink-0 rounded-md border px-2.5 py-1.5 text-[10px] font-bold', values.includes(option.value) ? 'border-[#F5C542]/40 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#292929] bg-[#111] text-zinc-500 hover:text-zinc-200')}>{option.value}</button>)}
  </div></fieldset>;
}

function toneForPercent(value: number) {
  if (value >= 70) return 'border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-400';
  if (value >= 50) return 'border-[#F5C542]/20 bg-[#F5C542]/[0.06] text-[#D9B45B]';
  return 'border-red-500/20 bg-red-500/[0.06] text-red-400';
}

function PerformanceStrip({ prop }: { prop: Prop }) {
  const cells = [
    { label: 'L5', value: `${prop.l5}%`, tone: toneForPercent(prop.l5) },
    { label: 'L10', value: `${prop.l10}%`, tone: toneForPercent(prop.l10) },
    { label: 'L15', value: `${prop.l15}%`, tone: toneForPercent(prop.l15) },
    { label: 'H2H', value: `${prop.h2h}%`, tone: toneForPercent(prop.h2h) },
    { label: 'Streak', value: `${prop.streak.type === 'Over' ? 'O' : 'U'}${prop.streak.count}`, tone: prop.streak.type === 'Over' ? toneForPercent(80) : toneForPercent(20) },
    { label: 'AVG', value: prop.avg.toFixed(1), tone: 'border-[#282828] bg-[#151515] text-zinc-300' },
    { label: 'DIFF', value: `${prop.diff > 0 ? '+' : ''}${prop.diff.toFixed(1)}`, tone: prop.diff >= 0 ? toneForPercent(80) : toneForPercent(20) },
  ];
  return <div className="no-scrollbar flex gap-1 overflow-x-auto" aria-label="Performance summary">{cells.map((cell) => <div key={cell.label} className={cn('min-w-[54px] flex-1 rounded-md border px-1.5 py-2 text-center', cell.tone)}><p className="text-[8px] font-semibold uppercase tracking-wider opacity-60">{cell.label}</p><p className="mt-0.5 text-[11px] font-bold tabular-nums">{cell.value}</p></div>)}</div>;
}

function communityFavorites(prop: Prop): number {
  return 180 + [...prop.id].reduce((total, character) => total + character.charCodeAt(0), 0) * 7 % 8300;
}

function openPlayer(prop: Prop, from: 'popular' | 'discrepancies', navigate: ReturnType<typeof useDashboard>['navigate']) {
  const player = playerById(prop.playerId)!;
  navigate('player', { playerId: player.id, sport: player.sport, marketKey: marketKeyForName(prop.market, player.sport, player.pos), line: prop.line, periodKey: 'full', from });
}

function PopularCard({ prop }: { prop: Prop }) {
  const { navigate, togglePick, selectPick, isInPickBuilder } = useDashboard();
  const player = playerById(prop.playerId)!;
  const inBuilder = isInPickBuilder(prop.id);
  const over = Math.max(8, Math.min(92, prop.l10));
  const favorites = communityFavorites(prop);
  return <article className="min-w-0 rounded-xl border border-[#242424] bg-[#101010] p-3.5 shadow-sm shadow-black/20">
    <div className="flex items-start gap-3">
      <PlayerAvatar name={player.name} />
      <button onClick={() => openPlayer(prop, 'popular', navigate)} className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"><p className="truncate text-sm font-semibold text-white">{player.name} <span className="text-[10px] font-normal text-zinc-600">{player.pos} · {player.sport}</span></p><p className="mt-0.5 text-xs font-semibold text-[#F5C542]">Over {prop.line} · {prop.market}</p><p className="mt-0.5 text-[10px] text-zinc-600">{player.team} {player.home ? 'vs' : '@'} {player.opponent} · {player.gameTime}</p></button>
      <div className="flex shrink-0 items-start gap-2">
        <div aria-label={`Consensus Over ${over} percent, Under ${100 - over} percent`} className="grid h-11 w-11 place-items-center rounded-full" style={{ background: `conic-gradient(#34d399 0 ${over}%, #f87171 ${over}% 100%)` }}><span className="grid h-8 w-8 place-content-center rounded-full bg-[#101010] text-center"><span className="text-[7px] font-bold leading-none text-emerald-300">O {over}</span><span className="mt-0.5 text-[7px] font-bold leading-none text-rose-300">U {100 - over}</span></span></div>
        <button onClick={() => togglePick(prop.id, 'over')} aria-pressed={inBuilder} aria-label={inBuilder ? `Remove ${player.name} ${prop.market} from Pick Builder` : `Add ${player.name} ${prop.market} to Pick Builder`} className={cn('rounded-md border p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]', inBuilder ? 'border-[#F5C542]/50 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#303030] text-zinc-500 hover:text-[#F5C542]')}><Star className={cn('h-4 w-4', inBuilder && 'fill-[#F5C542]')} /></button>
      </div>
    </div>
    <div className="mt-3 flex items-center justify-between"><span className="inline-flex items-center gap-1 rounded-full bg-[#F5C542]/10 px-2 py-1 text-[9px] font-bold text-[#F5C542]"><Star className="h-3 w-3 fill-[#F5C542]" /> {favorites.toLocaleString()} community saves</span><button onClick={() => openPlayer(prop, 'popular', navigate)} className="flex items-center gap-1 text-[9px] font-semibold text-zinc-500 hover:text-[#F5C542]">Research <ArrowUpRight className="h-3 w-3" /></button></div>
    <div className="mt-3"><PerformanceStrip prop={prop} /></div>
    <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto border-t border-[#202020] pt-3">{prop.books.map((book) => <button key={book.book} onClick={() => selectPick(prop.id, 'over', book.book)} className="shrink-0 rounded-md border border-[#292929] bg-[#151515] px-2.5 py-1.5 text-left hover:border-[#F5C542]/40"><span className="text-[9px] font-bold text-[#F5C542]">{book.book}</span><span className="ml-2 text-[9px] text-zinc-400">O {formatOdds(book.over)}</span></button>)}</div>
  </article>;
}

interface DiscrepancyResult { prop: Prop; minLine: number; maxLine: number; difference: number; percent: number; minOffers: BookLine[]; maxOffers: BookLine[] }

function discrepancyFor(prop: Prop, selectedMinBooks: string[]): DiscrepancyResult | null {
  const minPool = selectedMinBooks.length ? prop.books.filter((book) => selectedMinBooks.includes(book.book)) : prop.books;
  if (!minPool.length || !prop.books.length) return null;
  const minLine = Math.min(...minPool.map((book) => book.line));
  const maxLine = Math.max(...prop.books.map((book) => book.line));
  const difference = maxLine - minLine;
  const percent = minLine === 0 ? 0 : difference / Math.abs(minLine) * 100;
  return { prop, minLine, maxLine, difference, percent, minOffers: minPool.filter((book) => book.line === minLine), maxOffers: prop.books.filter((book) => book.line === maxLine) };
}

function OfferPanel({ label, line, offers, onPick }: { label: string; line: number; offers: BookLine[]; onPick: (book: string) => void }) {
  return <div className="rounded-lg border border-[#292929] bg-[#151515] p-3"><p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-zinc-600">{label}</p><p className="mt-1 text-xl font-black tabular-nums text-white">{line}</p><div className="mt-2 flex flex-wrap gap-1">{offers.slice(0, 2).map((offer) => <button key={offer.book} onClick={() => onPick(offer.book)} className="rounded bg-[#F5C542]/10 px-1.5 py-1 text-[9px] font-bold text-[#F5C542]">{offer.book} <span className="font-normal text-zinc-400">O {formatOdds(offer.over)}</span></button>)}{offers.length > 2 && <span className="rounded bg-[#222] px-1.5 py-1 text-[9px] text-zinc-500">+{offers.length - 2}</span>}</div></div>;
}

function DiscrepancyCard({ result }: { result: DiscrepancyResult }) {
  const { navigate, selectPick, isInPickBuilder } = useDashboard();
  const { prop } = result;
  const player = playerById(prop.playerId)!;
  return <article className="min-w-0 rounded-xl border border-[#242424] bg-[#101010] p-3.5">
    <div className="flex items-start gap-3"><PlayerAvatar name={player.name} /><button onClick={() => openPlayer(prop, 'discrepancies', navigate)} className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"><p className="truncate text-sm font-semibold text-white">{player.name} <span className="text-[10px] font-normal text-zinc-600">{player.pos} · {player.sport}</span></p><p className="mt-0.5 text-xs text-zinc-300">{prop.market}</p><p className="text-[10px] text-zinc-600">{player.team} {player.home ? 'vs' : '@'} {player.opponent} · {player.gameTime}</p></button><span className="shrink-0 rounded-md border border-emerald-500/25 bg-emerald-500/[0.08] px-2 py-1 text-right"><span className="flex items-center gap-1 text-xs font-bold text-emerald-400"><TrendingUp className="h-3.5 w-3.5" /> +{result.difference.toFixed(1)}</span><span className="block text-[8px] text-emerald-500/70">{result.percent.toFixed(1)}% diff</span></span></div>
    <div className="mt-3"><PerformanceStrip prop={prop} /></div>
    <div className="mt-3 grid grid-cols-2 gap-2"><OfferPanel label="Min line" line={result.minLine} offers={result.minOffers} onPick={(book) => selectPick(prop.id, 'over', book)} /><OfferPanel label="Max line" line={result.maxLine} offers={result.maxOffers} onPick={(book) => selectPick(prop.id, 'over', book)} /></div>
    <button onClick={() => selectPick(prop.id, 'over', result.minOffers[0]?.book)} className={cn('mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border py-2 text-[10px] font-semibold', isInPickBuilder(prop.id) ? 'border-[#F5C542]/40 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#303030] text-zinc-400 hover:text-[#F5C542]')}><ListPlus className="h-3.5 w-3.5" /> {isInPickBuilder(prop.id) ? 'Update Pick Builder' : 'Add minimum line'}</button>
  </article>;
}

const sportOptions = SPORTS.map((sport) => ({ value: sport, label: sport }));
const bookOptions = Object.entries(BOOKS).map(([value, label]) => ({ value, label }));

export function PopularPage() {
  useScrollRestore('pp-scroll-popular');
  const [sports, setSports] = useStoredArray('pp-popular-sports');
  const [books, setBooks] = useStoredArray('pp-popular-books');
  const { sport } = useDashboard();
  const results = useMemo(() => PROPS.filter((prop) => {
    const player = playerById(prop.playerId)!;
    if (sport !== 'All' && player.sport !== sport) return false;
    if (sports.length && !sports.includes(player.sport)) return false;
    if (books.length && !prop.books.some((book) => books.includes(book.book))) return false;
    return true;
  }).sort((a, b) => communityFavorites(b) - communityFavorites(a)).slice(0, 30), [books, sport, sports]);

  return <div className="min-w-0 space-y-3"><PageHeading title="Popular" description="Community-favorited player props across sports and providers." /><section className="grid min-w-0 gap-3 rounded-xl border border-[#202020] bg-[#0e0e0e] p-3 lg:grid-cols-2"><MultiFilter label="Sports" values={sports} options={sportOptions} onChange={setSports} /><MultiFilter label="Apps" values={books} options={bookOptions} onChange={setBooks} /></section><div className="flex items-center justify-between px-1"><p className="text-xs font-semibold text-zinc-300">Most saved props</p><p className="text-[10px] text-zinc-600">{results.length} results</p></div>{results.length ? <div className="grid min-w-0 gap-3 xl:grid-cols-2">{results.map((prop) => <PopularCard key={prop.id} prop={prop} />)}</div> : <div className="rounded-xl border border-dashed border-[#292929] py-16 text-center text-xs text-zinc-500">No popular props match the selected filters.</div>}</div>;
}

export function DiscrepanciesPage() {
  useScrollRestore('pp-scroll-discrepancies');
  const [sports, setSports] = useStoredArray('pp-discrepancy-sports');
  const [minBooks, setMinBooks] = useStoredArray('pp-discrepancy-books');
  const [minimumPercent, setMinimumPercent] = useStoredNumber('pp-discrepancy-percent', 0);
  const { sport } = useDashboard();
  const results = useMemo(() => PROPS.flatMap((prop) => {
    const player = playerById(prop.playerId)!;
    if (sport !== 'All' && player.sport !== sport) return [];
    if (sports.length && !sports.includes(player.sport)) return [];
    const result = discrepancyFor(prop, minBooks);
    return result && result.percent >= minimumPercent ? [result] : [];
  }).sort((a, b) => b.percent - a.percent).slice(0, 36), [minBooks, minimumPercent, sport, sports]);

  return <div className="space-y-3">
    <PageHeading title="Discrepancies" description="Compare the lowest and highest available lines across providers." />
    <section className="rounded-xl border border-[#202020] bg-[#0e0e0e] p-3">
      <MultiFilter label="Sports" values={sports} options={sportOptions} onChange={setSports} />
      <div className="mt-3 grid items-end gap-4 border-t border-[#1d1d1d] pt-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <MultiFilter label="Min-line apps" values={minBooks} options={bookOptions} onChange={setMinBooks} />
        <label className="grid content-start gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">Diff %<select value={minimumPercent} onChange={(event) => setMinimumPercent(Number(event.target.value))} className="h-8 rounded-md border border-[#292929] bg-[#111] px-2 text-[10px] text-zinc-300 focus:border-[#F5C542]/50 focus:outline-none"><option value={0}>Any difference</option><option value={2}>2% or more</option><option value={5}>5% or more</option><option value={10}>10% or more</option></select></label>
      </div>
    </section>
    <div className="flex items-center justify-between px-1"><p className="text-xs font-semibold text-zinc-300">Largest differences first</p><p className="text-[10px] text-zinc-600">{results.length} results</p></div>
    {results.length ? <div className="grid gap-3 xl:grid-cols-2">{results.map((result) => <DiscrepancyCard key={result.prop.id} result={result} />)}</div> : <div className="rounded-xl border border-dashed border-[#292929] py-16 text-center text-xs text-zinc-500">No line discrepancies match the selected filters.</div>}
  </div>;
}
