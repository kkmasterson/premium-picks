import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Bookmark, ListPlus, TrendingUp } from 'lucide-react';
import { BOOKS, PROPS, SPORTS, formatOdds, playerById } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { marketKeyForName } from '@/features/dashboard/player-screen/profiles';
import { DashboardPageHeader, DashboardToolbar, EntityIdentity, HelpAction, MetricStrip, ResearchSurface, StatusDelta, type DashboardMetric } from '@/features/dashboard/components/dashboard-ui';
import { cn } from '@/lib/utils';
import type { BookLine, Prop } from '@/features/dashboard/types';
import { fixturePopularity } from '@/features/dashboard/popularity';

function useStoredArray(key: string) {
  const [value, setValue] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem(key) ?? '[]'); } catch { return []; } });
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
    const timer = window.setTimeout(() => window.scrollTo(0, Number(sessionStorage.getItem(key) ?? 0)), 0);
    return () => { window.clearTimeout(timer); sessionStorage.setItem(key, String(window.scrollY)); };
  }, [key]);
}

function toggleValue(values: string[], value: string) { return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]; }

function MultiFilter({ label, values, options, onChange }: { label: string; values: string[]; options: Array<{ value: string; label: string }>; onChange: (values: string[]) => void }) {
  const buttonClass = (active: boolean) => cn('shrink-0 rounded-md border px-2.5 py-1.5 text-[10px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60', active ? 'border-teal-500/35 bg-teal-500/10 text-teal-300' : 'border-[var(--dashboard-border)] text-zinc-500 hover:text-zinc-200');
  return <fieldset className="min-w-0"><legend className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">{label}</legend><div className="no-scrollbar flex gap-1 overflow-x-auto pb-1"><button onClick={() => onChange([])} aria-pressed={!values.length} className={buttonClass(!values.length)}>All</button>{options.map((option) => <button key={option.value} onClick={() => onChange(toggleValue(values, option.value))} aria-pressed={values.includes(option.value)} aria-label={`${label}: ${option.label}`} className={buttonClass(values.includes(option.value))}>{option.value}</button>)}</div></fieldset>;
}

function toneForPercent(value: number): DashboardMetric['tone'] { return value >= 70 ? 'positive' : value >= 50 ? 'warning' : 'negative'; }

function performanceMetrics(prop: Prop): DashboardMetric[] {
  return [
    { label: 'L5', value: `${prop.l5}%`, sample: 'recent 5', tone: toneForPercent(prop.l5), accessibilityDescription: `Last 5 hit rate ${prop.l5} percent` },
    { label: 'L10', value: `${prop.l10}%`, sample: 'recent 10', tone: toneForPercent(prop.l10), accessibilityDescription: `Last 10 hit rate ${prop.l10} percent` },
    { label: 'L15', value: `${prop.l15}%`, sample: 'recent 15', tone: toneForPercent(prop.l15), accessibilityDescription: `Last 15 hit rate ${prop.l15} percent` },
    { label: 'H2H', value: `${prop.h2h}%`, sample: 'matchups', tone: toneForPercent(prop.h2h), accessibilityDescription: `Head to head hit rate ${prop.h2h} percent` },
    { label: 'Streak', value: `${prop.streak.type === 'Over' ? 'O' : 'U'}${prop.streak.count}`, sample: prop.streak.type, tone: prop.streak.type === 'Over' ? 'positive' : 'negative', accessibilityDescription: `${prop.streak.count} game ${prop.streak.type} streak` },
    { label: 'Avg', value: prop.avg.toFixed(1), sample: `line ${prop.line}`, accessibilityDescription: `Average ${prop.avg.toFixed(1)}` },
    { label: 'Diff', value: `${prop.diff > 0 ? '+' : ''}${prop.diff.toFixed(1)}`, sample: 'vs line', tone: prop.diff >= 0 ? 'positive' : 'negative', accessibilityDescription: `Difference versus line ${prop.diff.toFixed(1)}` },
  ];
}

function openPlayer(prop: Prop, from: 'popular' | 'discrepancies', navigate: ReturnType<typeof useDashboard>['navigate']) {
  const player = playerById(prop.playerId)!;
  navigate('player', { playerId: player.id, sport: player.sport, marketKey: marketKeyForName(prop.market, player.sport, player.pos), line: prop.line, periodKey: 'full', from });
}

function PopularRow({ prop, rank }: { prop: Prop; rank: number }) {
  const { navigate, selectPick, togglePick, toggleSave, isSaved, isInPickBuilder } = useDashboard();
  const player = playerById(prop.playerId)!;
  const inBuilder = isInPickBuilder(prop.id);
  const saved = isSaved('props', prop.id);
  const activity = fixturePopularity(prop.id);
  return <article className="min-w-0 px-3 py-3.5 transition hover:bg-[var(--dashboard-surface-hover)]/60 sm:px-4">
    <div className="grid min-w-0 gap-3 lg:grid-cols-[2rem_minmax(230px,1.2fr)_minmax(410px,2fr)_auto] lg:items-center">
      <span className="hidden text-center text-[11px] font-bold tabular-nums text-zinc-600 lg:block">{String(rank).padStart(2, '0')}</span>
      <EntityIdentity name={player.name} meta={<><span className="font-medium text-teal-300">Over {prop.line} · {prop.market}</span> · {player.pos}</>} detail={`${player.team} ${player.home ? 'vs' : '@'} ${player.opponent} · ${player.gameTime}`} onOpen={() => openPlayer(prop, 'popular', navigate)} />
      <MetricStrip metrics={performanceMetrics(prop)} compact />
      <div className="flex items-center justify-between gap-2 lg:justify-end"><span className="rounded-md bg-teal-500/[0.08] px-2 py-1.5 text-[9px] font-semibold text-teal-300" aria-label={`Consensus Over ${activity.overPct} percent, Under ${100 - activity.overPct} percent`}>O {activity.overPct}% <span className="text-zinc-600">/</span> U {100 - activity.overPct}% · n={activity.sampleSize}</span><button onClick={() => toggleSave('props', prop.id)} aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Save'} ${player.name} ${prop.market}`} className={cn('rounded-md border p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60', saved ? 'border-teal-500/35 bg-teal-500/10 text-teal-300' : 'border-[var(--dashboard-border)] text-zinc-500 hover:text-teal-300')}><Bookmark className={cn('h-3.5 w-3.5', saved && 'fill-current')} /></button></div>
    </div>
    <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2 border-t border-[var(--dashboard-border)] pt-2.5 lg:ml-11"><div className="no-scrollbar flex min-w-0 gap-1.5 overflow-x-auto">{prop.books.map((book) => <button key={book.book} onClick={() => selectPick(prop.id, 'over', book.book)} className="shrink-0 rounded-md bg-white/[0.035] px-2.5 py-1.5 text-[9px] text-zinc-400 hover:bg-teal-500/10 hover:text-teal-300"><span className="font-semibold text-zinc-300">{book.book}</span><span className="ml-2">O {formatOdds(book.over)}</span></button>)}</div><div className="flex gap-1.5"><button onClick={() => openPlayer(prop, 'popular', navigate)} className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[9px] font-semibold text-zinc-500 hover:text-teal-300">Research <ArrowUpRight className="h-3 w-3" /></button><button onClick={() => togglePick(prop.id, 'over', prop.books[0]?.book)} aria-label={inBuilder ? `Remove ${player.name} ${prop.market} from Pick Builder` : `Add ${player.name} ${prop.market} to Pick Builder`} className={cn('flex items-center gap-1 rounded-md border px-2 py-1.5 text-[9px] font-semibold', inBuilder ? 'border-teal-500/35 bg-teal-500/10 text-teal-300' : 'border-[var(--dashboard-border)] text-zinc-400 hover:text-teal-300')}><ListPlus className="h-3 w-3" /> {inBuilder ? 'Remove from Builder' : 'Add to Builder'}</button></div></div>
  </article>;
}

interface DiscrepancyResult { prop: Prop; minLine: number; maxLine: number; difference: number; percent: number; minOffers: BookLine[]; maxOffers: BookLine[] }
function discrepancyFor(prop: Prop, selectedMinBooks: string[]): DiscrepancyResult | null {
  const minPool = selectedMinBooks.length ? prop.books.filter((book) => selectedMinBooks.includes(book.book)) : prop.books;
  if (!minPool.length || !prop.books.length) return null;
  const minLine = Math.min(...minPool.map((book) => book.line));
  const maxLine = Math.max(...prop.books.map((book) => book.line));
  const difference = maxLine - minLine;
  return { prop, minLine, maxLine, difference, percent: minLine === 0 ? 0 : difference / Math.abs(minLine) * 100, minOffers: minPool.filter((book) => book.line === minLine), maxOffers: prop.books.filter((book) => book.line === maxLine) };
}

function OfferCell({ label, line, offers, onPick }: { label: string; line: number; offers: BookLine[]; onPick: (book: string) => void }) {
  return <div className="min-w-0"><p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-zinc-600">{label}</p><p className="mt-1 text-lg font-black tabular-nums text-zinc-100">{line}</p><div className="no-scrollbar mt-1.5 flex gap-1 overflow-x-auto">{offers.slice(0, 2).map((offer) => <button key={offer.book} onClick={() => onPick(offer.book)} className="shrink-0 rounded bg-teal-500/[0.08] px-1.5 py-1 text-[9px] font-semibold text-teal-300">{offer.book} <span className="font-normal text-zinc-500">O {formatOdds(offer.over)}</span></button>)}{offers.length > 2 && <span className="rounded bg-white/[0.035] px-1.5 py-1 text-[9px] text-zinc-500">+{offers.length - 2}</span>}</div></div>;
}

function DiscrepancyRow({ result }: { result: DiscrepancyResult }) {
  const { navigate, selectPick, isInPickBuilder } = useDashboard();
  const { prop } = result;
  const player = playerById(prop.playerId)!;
  const inBuilder = isInPickBuilder(prop.id);
  return <article className="min-w-0 px-3 py-3.5 transition hover:bg-[var(--dashboard-surface-hover)]/60 sm:px-4"><div className="grid min-w-0 gap-3 md:grid-cols-[minmax(220px,1.35fr)_minmax(105px,.55fr)_minmax(105px,.55fr)_auto_auto] md:items-center"><EntityIdentity name={player.name} meta={<span className="text-teal-300">{prop.market}</span>} detail={`${player.team} ${player.home ? 'vs' : '@'} ${player.opponent} · ${player.gameTime}`} onOpen={() => openPlayer(prop, 'discrepancies', navigate)} /><div className="grid grid-cols-2 gap-3 md:contents"><OfferCell label="Minimum line" line={result.minLine} offers={result.minOffers} onPick={(book) => selectPick(prop.id, 'over', book)} /><OfferCell label="Maximum line" line={result.maxLine} offers={result.maxOffers} onPick={(book) => selectPick(prop.id, 'over', book)} /></div><StatusDelta value={<span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />+{result.difference.toFixed(1)}</span>} label={`${result.percent.toFixed(1)}% difference`} /><button onClick={() => selectPick(prop.id, 'over', result.minOffers[0]?.book)} aria-label={inBuilder ? 'Update Pick Builder' : 'Add minimum line'} className={cn('flex h-8 items-center justify-center gap-1.5 rounded-md border px-2.5 text-[10px] font-semibold', inBuilder ? 'border-teal-500/35 bg-teal-500/10 text-teal-300' : 'border-[var(--dashboard-border-strong)] text-zinc-400 hover:text-teal-300')}><ListPlus className="h-3.5 w-3.5" /> {inBuilder ? 'Update Builder' : 'Add min line'}</button></div><MetricStrip metrics={performanceMetrics(prop)} compact className="mt-3 border-t border-[var(--dashboard-border)] md:ml-[232px]" /></article>;
}

const sportOptions = SPORTS.map((sport) => ({ value: sport, label: sport }));
const bookOptions = Object.entries(BOOKS).map(([value, label]) => ({ value, label }));

export function PopularPage() {
  useScrollRestore('pp-scroll-popular');
  const [sports, setSports] = useStoredArray('pp-popular-sports');
  const [books, setBooks] = useStoredArray('pp-popular-books');
  const { sport, navigate } = useDashboard();
  const results = useMemo(() => PROPS.filter((prop) => { const player = playerById(prop.playerId)!; return (sport === 'All' || player.sport === sport) && (!sports.length || sports.includes(player.sport)) && (!books.length || prop.books.some((book) => books.includes(book.book))); }).sort((a, b) => fixturePopularity(b.id).score - fixturePopularity(a.id).score).slice(0, 30), [books, sport, sports]);
  return <div className="min-w-0 space-y-3"><DashboardPageHeader eyebrow="Community" title="Popular" description="Anonymous activity ranked by stronger intent and a six-hour recency half-life." actions={<HelpAction onClick={() => navigate('help')} />} /><DashboardToolbar className="grid min-w-0 gap-3 lg:grid-cols-2"><MultiFilter label="Sports" values={sports} options={sportOptions} onChange={setSports} /><MultiFilter label="Apps" values={books} options={bookOptions} onChange={setBooks} /></DashboardToolbar><div className="flex items-center justify-between px-1"><div><p className="sr-only">Most saved props</p><p className="text-xs font-semibold text-zinc-300">Strongest recent intent</p></div><p className="text-[10px] text-zinc-600">{results.length} results</p></div>{results.length ? <ResearchSurface className="divide-y divide-[var(--dashboard-border)]">{results.map((prop, index) => <PopularRow key={prop.id} prop={prop} rank={index + 1} />)}</ResearchSurface> : <div className="rounded-xl border border-dashed border-[var(--dashboard-border-strong)] py-16 text-center text-xs text-zinc-500">No popular props match the selected filters.</div>}</div>;
}

export function DiscrepanciesPage() {
  useScrollRestore('pp-scroll-discrepancies');
  const [sports, setSports] = useStoredArray('pp-discrepancy-sports');
  const [minBooks, setMinBooks] = useStoredArray('pp-discrepancy-books');
  const [minimumPercent, setMinimumPercent] = useStoredNumber('pp-discrepancy-percent', 0);
  const { sport, navigate } = useDashboard();
  const results = useMemo(() => PROPS.flatMap((prop) => { const player = playerById(prop.playerId)!; if ((sport !== 'All' && player.sport !== sport) || (sports.length && !sports.includes(player.sport))) return []; const result = discrepancyFor(prop, minBooks); return result && result.percent >= minimumPercent ? [result] : []; }).sort((a, b) => b.percent - a.percent).slice(0, 36), [minBooks, minimumPercent, sport, sports]);
  return <div className="space-y-3"><DashboardPageHeader eyebrow="Analysis" title="Discrepancies" description="Compare the lowest and highest available lines across providers." actions={<HelpAction onClick={() => navigate('help')} />} /><DashboardToolbar><MultiFilter label="Sports" values={sports} options={sportOptions} onChange={setSports} /><div className="mt-3 grid items-end gap-4 border-t border-[var(--dashboard-border)] pt-3 sm:grid-cols-[minmax(0,1fr)_12rem]"><MultiFilter label="Min-line apps" values={minBooks} options={bookOptions} onChange={setMinBooks} /><label className="grid content-start gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">Difference<select value={minimumPercent} onChange={(event) => setMinimumPercent(Number(event.target.value))} className="h-8 rounded-md border border-[var(--dashboard-border-strong)] bg-[var(--dashboard-surface-raised)] px-2 text-[10px] text-zinc-300 focus:border-teal-500/50 focus:outline-none"><option value={0}>Any difference</option><option value={2}>2% or more</option><option value={5}>5% or more</option><option value={10}>10% or more</option></select></label></div></DashboardToolbar><div className="flex items-center justify-between px-1"><p className="text-xs font-semibold text-zinc-300">Largest differences first</p><p className="text-[10px] text-zinc-600">{results.length} results</p></div>{results.length ? <ResearchSurface className="divide-y divide-[var(--dashboard-border)]">{results.map((result) => <DiscrepancyRow key={result.prop.id} result={result} />)}</ResearchSurface> : <div className="rounded-xl border border-dashed border-[var(--dashboard-border-strong)] py-16 text-center text-xs text-zinc-500">No line discrepancies match the selected filters.</div>}</div>;
}
