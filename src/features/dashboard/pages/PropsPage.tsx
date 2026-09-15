import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Activity, ArrowDown, ArrowUp, ChevronDown, ChevronsUpDown, Clock3, ListPlus, TrendingDown, TrendingUp } from 'lucide-react';
import type { LineType, PropBoardRow, PropOffer, Side } from '@arena/contracts';
import { PROPS, bestBook, playerById } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { GlobalSearch } from '@/features/dashboard/components/GlobalSearch';
import { SportsbookLogo } from '@/features/dashboard/components/SportsbookLogo';
import { bestAvailableOdds, OddsPriceCell } from '@/features/dashboard/components/SportsbookOdds';
import { DEFAULT_FILTERS, FilterToolbar, filterProps } from '@/features/dashboard/components/FilterToolbar';
import { EmptyState, PlayerAvatar } from '@/features/dashboard/components/common';
import { PROP_BOARD_ROWS, builderSelectionFor, metricsFor, offerFor, redactEvForTier } from '@/features/dashboard/props-fixtures';
import { LIVE_DEMO_REFRESH_MS, liveDemoRowsAt } from '@/features/dashboard/live-demo';
import type { Filters } from '@/features/dashboard/types';
import { cn } from '@/lib/utils';

type LineFilter = 'all' | LineType;
type StatSortField = 'moneyline' | 'projection' | 'confidence' | 'l5' | 'l10' | 'l15' | 'h2h' | 'streak' | 'ev';
type SortDirection = 'asc' | 'desc';

interface StatSort {
  field: StatSortField;
  direction: SortDirection;
}
const GOBLIN_ASSET = '/assets/green-goblin.png';
const DEVIL_ASSET = '/assets/red-devil.png';
const POSITIVE_HEAT = '0 220 166';
const NEGATIVE_HEAT = '224 46 52';
const POSITIVE_STAT_TEXT = 'text-[#40f5d0]';
const NEGATIVE_STAT_TEXT = 'text-[#ff817e]';

const TYPE_STYLE: Record<LineType, string> = {
  regular: 'text-zinc-500',
  goblin: 'text-[#49e3aa]',
  devil: 'text-[#ff7379]',
  alternate: 'text-sky-400',
};

function LineTypeMark({ lineType, compact = false }: { lineType: LineType; compact?: boolean }) {
  if (lineType === 'goblin') {
    return <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#7af0c8]" title="Provider-designated Goblin line">
      <span className={cn('relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-green-950/70 ring-1 ring-inset ring-[#49e3aa]/50', compact ? 'h-4 w-4' : 'h-5 w-5')}>
        <img src={GOBLIN_ASSET} alt="" className="h-[115%] w-[115%] max-w-none object-contain drop-shadow-[0_0_5px_rgba(73,227,170,0.8)]" />
      </span>
      <span className={compact ? 'text-[8px]' : 'text-[9px]'}>Goblin</span>
    </span>;
  }
  if (lineType === 'devil') {
    return <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#ff9a9f]" title="Provider-designated Devil line">
      <span className={cn('relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-red-950/70 ring-1 ring-inset ring-[#ff7379]/50', compact ? 'h-4 w-4' : 'h-5 w-5')}>
        <img src={DEVIL_ASSET} alt="" className="h-[115%] w-[115%] max-w-none object-contain drop-shadow-[0_0_5px_rgba(255,115,121,0.8)]" />
      </span>
      <span className={compact ? 'text-[8px]' : 'text-[9px]'}>Devil</span>
    </span>;
  }
  return <span className={cn('inline-flex shrink-0 items-center gap-1 font-medium capitalize', compact ? 'text-[8px]' : 'text-[9px]', TYPE_STYLE[lineType])}>
    <span className="h-1 w-1 rounded-full bg-current opacity-70" />{lineType}
  </span>;
}

function oddsLabel(value: number | null) {
  return value === null ? '—' : value > 0 ? `+${value}` : String(value);
}

function PlayerCutout({ name, src }: { name: string; src: string | null }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const showHeadshot = Boolean(src && failedSrc !== src);

  return <span className="pointer-events-none absolute inset-y-0 left-0 w-[72px] overflow-hidden" aria-hidden="true">
    <span className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />
    {showHeadshot ? <img
      src={src!}
      alt=""
      loading="eager"
      decoding="async"
      className="absolute bottom-0 left-[-4px] h-[78px] w-[82px] max-w-none object-contain object-bottom drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]"
      onError={() => setFailedSrc(src!)}
    /> : <span className="absolute bottom-3 left-3 text-[10px] font-bold text-teal-300/80">
      {name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
    </span>}
  </span>;
}

function freshness(observedAt: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(observedAt).getTime()) / 1000));
  return seconds < 60 ? `${seconds}s` : `${Math.round(seconds / 60)}m`;
}

function OfferSelector({ row, selected, side, onChange, onSideChange, lineFilter, compact = false }: {
  row: PropBoardRow;
  selected: PropOffer;
  side: Side;
  onChange: (offer: PropOffer) => void;
  onSideChange: (side: Side) => void;
  lineFilter: LineFilter;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const offers = lineFilter === 'all' ? row.offers : row.offers.filter((offer) => offer.lineType === lineFilter);
  const availableOffers = offers.filter((offer) => offer.status === 'active');
  const otherOfferCount = offers.filter((offer) => offer.id !== selected.id).length;
  const bestOverOdds = bestAvailableOdds(availableOffers.map((offer) => offer.overOdds));
  const bestUnderOdds = bestAvailableOdds(availableOffers.map((offer) => offer.underOdds));
  const selectedOdds = side === 'over' ? selected.overOdds : selected.underOdds;

  return <div
    role="group"
    aria-label={`${selected.providerName} sportsbook offer, line ${selected.line}, over ${oddsLabel(selected.overOdds)}, under ${oddsLabel(selected.underOdds)}`}
    className={cn(
      'relative grid max-w-full shrink-0 items-center rounded-md bg-white/[0.018]',
      compact
        ? 'h-10 w-[312px] grid-cols-[minmax(0,1fr)_32px_56px_56px] gap-1 p-1'
        : 'h-8 w-[240px] grid-cols-[minmax(0,1fr)_26px_46px_46px] gap-0.5 p-0.5 sm:w-[244px]',
    )}
  >
    <button
      type="button"
      onClick={() => setOpen((value) => !value)}
      aria-expanded={open}
      aria-label={`Choose sportsbook offer. ${selected.providerName}, ${side} ${oddsLabel(selectedOdds)}, line ${selected.line}`}
      className={cn(
        'flex min-w-0 items-center rounded text-left transition-colors hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50',
        compact ? 'h-8 gap-1.5 px-1' : 'h-7 gap-1 px-0.5',
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-1">
        <span className="relative shrink-0">
          <SportsbookLogo shortName={selected.providerShortName} compact className={cn('rounded', compact ? 'h-6 w-8' : 'w-5')} />
          {selected.lineType === 'goblin' && <img src={GOBLIN_ASSET} alt="Goblin line" className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#111] object-contain drop-shadow-[0_0_4px_rgba(34,197,94,0.45)]" />}
          {selected.lineType === 'devil' && <img src={DEVIL_ASSET} alt="Devil line" className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#111] object-contain drop-shadow-[0_0_4px_rgba(239,68,68,0.45)]" />}
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-0.5">
          <span className={cn('min-w-0 truncate font-semibold text-zinc-100', compact ? 'text-[10px]' : 'text-[9px]')}>{selected.providerName}</span>
          {otherOfferCount > 0 && <span
            data-other-offer-count={otherOfferCount}
            title={`${otherOfferCount} other sportsbook offers`}
              className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.07] px-1 font-bold leading-none tabular-nums text-zinc-200',
                compact ? 'h-7 min-w-7 text-[11px]' : 'h-6 min-w-6 text-[10px]',
              )}
          >+{otherOfferCount}</span>}
        </span>
      </span>
      <ChevronDown className={cn('shrink-0 text-zinc-500', compact ? 'h-3 w-3' : 'h-2 w-2')} />
    </button>

    <span aria-label={`Line ${selected.line}`} className={cn('text-center font-semibold tabular-nums text-zinc-300', compact ? 'text-[12px]' : 'text-[10px]')}>{selected.line}</span>
    {(['over', 'under'] as Side[]).map((value) => <button
      key={value}
      type="button"
      onClick={() => onSideChange(value)}
      aria-label={`${value} ${oddsLabel(value === 'over' ? selected.overOdds : selected.underOdds)}`}
      aria-pressed={side === value}
      className={cn('min-w-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60', compact ? 'h-8' : 'h-6')}
    ><OddsPriceCell
      side={value}
      odds={value === 'over' ? selected.overOdds : selected.underOdds}
      best={value === 'over'
        ? selected.overOdds !== null && selected.overOdds === bestOverOdds
        : selected.underOdds !== null && selected.underOdds === bestUnderOdds}
      compact
      className={cn(
        'w-full', compact && 'h-8 min-w-0 px-1.5 text-[10px]',
        side === value && (value === 'over'
          ? 'border-[#7af0c8]/75 bg-[#49e3aa]/[0.18] shadow-[0_0_10px_rgba(73,227,170,0.24)]'
          : 'border-[#ff9a9f]/75 bg-[#ff7379]/[0.18] shadow-[0_0_10px_rgba(255,115,121,0.24)]'),
      )}
    /></button>)}

    {open && <div className="absolute right-0 top-full z-30 mt-1 max-h-80 w-[min(410px,calc(100vw-24px))] overflow-y-auto rounded-xl border border-[#303030] bg-[#101010] p-2 shadow-2xl md:left-0 md:right-auto">
      {offers.length === 0 ? <p className="p-3 text-xs text-zinc-500">No offers in this line group.</p> : <>
        <div className="grid grid-cols-[minmax(120px,1fr)_42px_58px_58px] items-center gap-1.5 px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-zinc-600"><span>Sportsbook</span><span className="text-center">Line</span><span className="text-center">Over</span><span className="text-center">Under</span></div>
        {offers.map((offer) => <button
          key={offer.id}
          disabled={offer.status !== 'active'}
          onClick={() => { onChange(offer); setOpen(false); }}
          aria-label={`${offer.providerName}, ${offer.lineType} line ${offer.line}, over ${oddsLabel(offer.overOdds)}, under ${oddsLabel(offer.underOdds)}, ${offer.status}`}
          className={cn(
            'mb-1 grid w-full grid-cols-[minmax(120px,1fr)_42px_58px_58px] items-center gap-1.5 overflow-hidden rounded-lg border border-transparent px-2 py-1.5 text-left last:mb-0',
            selected.id === offer.id ? 'bg-teal-500/[0.08]' : 'hover:bg-white/[0.035]',
            offer.lineType === 'goblin' && 'border-[#49e3aa]/25 bg-gradient-to-r from-[#49e3aa]/[0.10] to-transparent',
            offer.lineType === 'devil' && 'border-[#ff7379]/25 bg-gradient-to-r from-[#ff7379]/[0.10] to-transparent',
            offer.status !== 'active' && 'cursor-not-allowed opacity-50',
          )}
        >
          <span className="flex min-w-0 items-center gap-1.5"><SportsbookLogo shortName={offer.providerShortName} compact /><span className="min-w-0"><span className="flex min-w-0 items-center gap-1"><span className="truncate text-[10px] font-medium text-zinc-100">{offer.providerName}</span><LineTypeMark lineType={offer.lineType} compact /></span><span className="block text-[7px] text-zinc-600">{offer.status} · {freshness(offer.observedAt)} ago</span></span></span>
          <span className="text-center text-[10px] font-semibold tabular-nums text-zinc-200">{offer.line}</span>
          <OddsPriceCell side="over" odds={offer.overOdds} best={offer.overOdds !== null && offer.overOdds === bestOverOdds} compact />
          <OddsPriceCell side="under" odds={offer.underOdds} best={offer.underOdds !== null && offer.underOdds === bestUnderOdds} compact />
        </button>)}
      </>}
    </div>}
  </div>;
}

function percentTone(value: number) {
  if (value >= 50) return POSITIVE_STAT_TEXT;
  return NEGATIVE_STAT_TEXT;
}

function heatColor(value: number) {
  if (value >= 50) return POSITIVE_HEAT;
  return NEGATIVE_HEAT;
}

function heatStyle(value: number): CSSProperties {
  return { '--stat-heat': heatColor(value) } as CSSProperties;
}

function edgeHeatStyle(value: number | null): CSSProperties | undefined {
  if (value === null || value === 0) return undefined;
  return { '--stat-heat': value > 0 ? POSITIVE_HEAT : NEGATIVE_HEAT } as CSSProperties;
}

function Metric({ label, value, percent }: { label: string; value: string; percent?: number }) {
  return <div className={cn('rounded-md bg-white/[0.025] px-1 py-1 text-center', percent !== undefined && percentTone(percent))}>
    <p className="text-[7px] uppercase text-zinc-600">{label}</p>
    <p className={cn('text-[10px] font-semibold', percent === undefined && 'text-zinc-200')}>{value}</p>
  </div>;
}

function RateBox({ value, sample, title }: { value: number; sample?: string; title: string }) {
  return <div className={cn('mx-auto w-14 px-1 text-center tabular-nums', percentTone(value))} title={title}>
    <div className="flex items-baseline justify-center gap-1">
      <p className="text-[12px] font-semibold leading-none">{value}%</p>
      {sample && <p className="text-[9px] font-medium leading-none text-white/70">{sample}</p>}
    </div>
  </div>;
}

function ConfidenceMeter({ score, grade }: { score: number; grade: string }) {
  return <div className="mx-auto w-16 text-center tabular-nums" title={`${grade} confidence · demo fixture`}>
    <div className="flex items-baseline justify-between px-0.5">
      <span className={cn('text-[12px] font-bold', percentTone(score))}>{score}</span>
      <span className="text-[8px] font-semibold uppercase tracking-wide text-white/70">{grade.slice(0, 3)}</span>
    </div>
    <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.07]">
      <span className={cn('block h-full rounded-full', score >= 50 ? 'bg-[#19e5bc]' : 'bg-[#ff7278]')} style={{ width: `${score}%` }} />
    </div>
  </div>;
}

function ProjectionSignal({ projection, line, edge }: { projection: number | null; line: number; edge: number | null }) {
  if (projection === null) return <span className="text-zinc-600">—</span>;
  const delta = edge ?? projection - line;
  return <div className="mx-auto w-20 text-center tabular-nums" title={`Projection ${projection} versus line ${line}`}>
    <div className="flex items-baseline justify-center gap-1.5">
      <span className="text-[13px] font-bold text-zinc-100">{projection}</span>
      <span className={cn('text-[9px] font-semibold', delta > 0 ? POSITIVE_STAT_TEXT : delta < 0 ? NEGATIVE_STAT_TEXT : 'text-zinc-500')}>{delta > 0 ? '+' : ''}{delta.toFixed(1)}</span>
    </div>
    <p className="mt-1 text-[8px] font-medium uppercase tracking-wide text-white/70">line {line}</p>
  </div>;
}

function MovementSparkline({ points }: { points: PropBoardRow['lineMovement'] }) {
  if (points.length === 0) return <span className="text-[9px] text-zinc-600">Unavailable</span>;
  const values = points.map((point) => point.line);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coordinates = values.map((value, index) => `${4 + (index * 48) / Math.max(1, values.length - 1)},${18 - ((value - min) / range) * 12}`).join(' ');
  const latest = points.at(-1)!;
  const first = points[0];
  const changed = latest.line - first.line;
  return <div className="mx-auto w-[72px] text-center" title={`Line history: ${values.join(' → ')}`}>
    <svg viewBox="0 0 56 22" className="mx-auto h-6 w-16 overflow-visible" aria-hidden="true">
      <path d="M4 18H52" stroke="currentColor" className="text-white/[0.06]" strokeWidth="1" />
      <polyline points={coordinates} fill="none" stroke="currentColor" className={changed > 0 ? 'text-[#49e3aa]' : changed < 0 ? 'text-[#ff7379]' : 'text-zinc-500'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={52} cy={18 - ((latest.line - min) / range) * 12} r="2" fill="currentColor" className={changed > 0 ? 'text-[#49e3aa]' : changed < 0 ? 'text-[#ff7379]' : 'text-zinc-500'} />
    </svg>
    <p className="mt-0.5 text-[10px] font-semibold leading-none tabular-nums text-zinc-400">{first.line} → <span className={changed > 0 ? 'text-[#49e3aa]' : changed < 0 ? 'text-[#ff7379]' : 'text-zinc-300'}>{latest.line}</span></p>
  </div>;
}

function selectedOfferFor(row: PropBoardRow, lineFilter: LineFilter, selectedOfferId?: string) {
  const eligible = lineFilter === 'all' ? row.offers : row.offers.filter((offer) => offer.lineType === lineFilter);
  const eligibleId = eligible.some((offer) => offer.id === selectedOfferId)
    ? selectedOfferId
    : eligible.find((offer) => offer.status === 'active')?.id;
  return offerFor(row, eligibleId);
}

function statSortValue(
  row: PropBoardRow,
  field: StatSortField,
  lineFilter: LineFilter,
  selectedOfferId: string | undefined,
  side: Side,
) {
  const selected = selectedOfferFor(row, lineFilter, selectedOfferId);
  const metrics = metricsFor(row, selected.line)[side];
  if (field === 'moneyline') {
    return row.moneylines.find((price) => price.providerId === selected.providerId)?.playerTeamOdds ?? null;
  }
  if (field === 'projection') return metrics.edge ?? (metrics.projection === null ? null : metrics.projection - selected.line);
  if (field === 'confidence') return metrics.confidence?.score ?? null;
  if (field === 'ev') return selected.ev[side].details?.evPercent ?? null;
  if (field === 'streak') return metrics.streak.count * (metrics.streak.side === side ? 1 : -1);
  return metrics[field].pct;
}

function sortRows(
  rows: PropBoardRow[],
  statSort: StatSort | null,
  lineFilter: LineFilter,
  selectedOfferIds: Record<string, string>,
  selectedSides: Record<string, Side>,
) {
  if (statSort) {
    return [...rows].sort((a, b) => {
      const aValue = statSortValue(a, statSort.field, lineFilter, selectedOfferIds[a.id], selectedSides[a.id] ?? 'over');
      const bValue = statSortValue(b, statSort.field, lineFilter, selectedOfferIds[b.id], selectedSides[b.id] ?? 'over');
      if (aValue === null && bValue === null) return a.id.localeCompare(b.id);
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      const difference = statSort.direction === 'desc' ? bValue - aValue : aValue - bValue;
      return difference || a.id.localeCompare(b.id);
    });
  }
  return interleaveRowsByPlayer(rows);
}

function PropCard({ row, lineFilter, selectedOfferId, selectedSide, onOfferChange, onSideChange }: {
  row: PropBoardRow;
  lineFilter: LineFilter;
  selectedOfferId?: string;
  selectedSide: Side;
  onOfferChange: (offerId: string) => void;
  onSideChange: (side: Side) => void;
}) {
  const { accessTier, addPick, navigate } = useDashboard();
  const side = selectedSide;
  const selected = selectedOfferFor(row, lineFilter, selectedOfferId);
  const metrics = metricsFor(row, selected.line)[side];
  const moneyline = row.moneylines.find((price) => price.providerId === selected.providerId);
  const ev = redactEvForTier(selected.ev[side], accessTier);
  const movement = row.lineMovement.filter((point) => point.providerId === selected.providerId).sort((a, b) => a.observedAt.localeCompare(b.observedAt));
  const direction = movement.at(-1)?.direction ?? 'flat';

  return <article className={cn(
    'min-w-0 rounded-lg border bg-[#101010] p-2 shadow-sm',
    selected.lineType === 'goblin' && 'border-[#49e3aa]/45 shadow-[inset_2px_0_0_#49e3aa]',
    selected.lineType === 'devil' && 'border-[#ff7379]/45 shadow-[inset_2px_0_0_#ff7379]',
    selected.lineType !== 'goblin' && selected.lineType !== 'devil' && 'border-[#202020]',
  )}>
    <div className="flex items-center justify-between gap-2">
      <button onClick={() => navigate('player', { playerId: row.playerId })} className="flex min-w-0 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
        <PlayerAvatar name={row.playerName} size="xs" />
        <span className="min-w-0">
          <span className="flex min-w-0 items-center gap-1"><span className="truncate text-[11px] font-semibold text-white">{row.playerName}</span><span className="rounded bg-white/[0.055] px-1 py-0.5 text-[7px] font-semibold text-zinc-500">{row.position}</span></span>
          <span className="block truncate text-[8px] text-zinc-500">{row.team} vs {row.opponent} · {row.event.startTimeLabel}</span>
          <span className="mt-0.5 block truncate text-[8px] font-semibold text-zinc-300">{row.market} <span className="font-normal text-zinc-600">· {selected.lineType}</span></span>
        </span>
      </button>
      <OfferSelector row={row} selected={selected} side={side} onChange={(offer) => onOfferChange(offer.id)} onSideChange={onSideChange} lineFilter={lineFilter} />
    </div>

    <div className="mt-1.5 grid grid-cols-4 gap-1">
      <Metric label="Proj" value={String(metrics.projection)} />
      <Metric label="Conf" value={metrics.confidence ? `${metrics.confidence.score}` : '—'} percent={metrics.confidence?.score} />
      <Metric label="L10" value={`${metrics.l10.pct}%`} percent={metrics.l10.pct} />
      <Metric label="H2H" value={`${metrics.h2h.pct}%`} percent={metrics.h2h.pct} />
    </div>

    <details className="group mt-1.5 rounded border border-[#202020] bg-[#0d0d0d]">
      <summary className="cursor-pointer list-none px-2 py-1 text-[8px] font-semibold text-zinc-500 hover:text-teal-300">More stats <span className="float-right group-open:rotate-180">⌄</span></summary>
      <div className="space-y-1.5 border-t border-[#202020] p-2">
        <div className="grid grid-cols-4 gap-1"><Metric label="L5" value={`${metrics.l5.pct}%`} percent={metrics.l5.pct} /><Metric label="L15" value={`${metrics.l15.pct}%`} percent={metrics.l15.pct} /><Metric label="Streak" value={`${metrics.streak.side === 'over' ? 'O' : 'U'}${metrics.streak.count}`} /><Metric label="Avg" value={String(metrics.average)} /></div>
        <div className="rounded border border-[#222] p-1.5 text-[8px] text-zinc-400"><span className="text-zinc-600">Moneyline: </span>{moneyline?.playerTeamOdds === null || !moneyline ? 'Unavailable at selected book' : `${row.team} ${oddsLabel(moneyline.playerTeamOdds)} · ${row.opponent} ${oddsLabel(moneyline.opponentOdds)}`}</div>
        <div className="rounded border border-[#222] p-1.5 text-[8px] text-zinc-400"><span className="inline-flex items-center gap-1 text-zinc-600">Movement {direction === 'up' ? <TrendingUp className="h-2.5 w-2.5 text-[#49e3aa]" /> : direction === 'down' ? <TrendingDown className="h-2.5 w-2.5 text-[#ff7379]" /> : <Activity className="h-2.5 w-2.5" />}</span> {movement.map((point) => point.line).join(' → ') || 'Unavailable'}</div>
        <div className="rounded border border-[#222] p-1.5 text-[8px] text-zinc-400"><span className="text-zinc-600">+EV: </span>{accessTier === 'tier1' ? ev.positiveEvDetected ? <span className="font-semibold text-amber-300">🔒 Positive EV detected</span> : 'No positive EV signal' : ev.details ? <span className={ev.details.evPercent > 0 ? 'font-semibold text-[#7af0c8]' : ''}>{ev.details.evPercent > 0 ? '+' : ''}{ev.details.evPercent}% · demo</span> : 'Unavailable'}</div>
      </div>
    </details>

    <div className="mt-1.5 flex items-center justify-between gap-1">
      <p className="flex min-w-0 items-center gap-1 truncate text-[7px] text-zinc-600"><Clock3 className="h-2.5 w-2.5 shrink-0" />{row.event.statusLabel} · Demo</p>
      <LineTypeMark lineType={selected.lineType} compact />
      <button
        disabled={selected.status !== 'active'}
        onClick={() => addPick(builderSelectionFor(row, selected, side))}
        className="inline-flex shrink-0 items-center gap-1 rounded bg-teal-500 px-2 py-1 text-[8px] font-bold text-black hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
      ><ListPlus className="h-3 w-3" />Add</button>
    </div>
  </article>;
}

function PropTableRow({ row, lineFilter, selectedOfferId, selectedSide, onOfferChange, onSideChange, alternate }: {
  row: PropBoardRow;
  lineFilter: LineFilter;
  selectedOfferId?: string;
  selectedSide: Side;
  onOfferChange: (offerId: string) => void;
  onSideChange: (side: Side) => void;
  alternate: boolean;
}) {
  const { accessTier, addPick, navigate } = useDashboard();
  const side = selectedSide;
  const selected = selectedOfferFor(row, lineFilter, selectedOfferId);
  const metrics = metricsFor(row, selected.line)[side];
  const moneyline = row.moneylines.find((price) => price.providerId === selected.providerId);
  const ev = redactEvForTier(selected.ev[side], accessTier);
  const movement = row.lineMovement.filter((point) => point.providerId === selected.providerId).sort((a, b) => a.observedAt.localeCompare(b.observedAt));
  const selectedOdds = side === 'over' ? selected.overOdds : selected.underOdds;
  const teamMoneyline = moneyline?.playerTeamOdds === null || !moneyline ? null : moneyline.playerTeamOdds;
  const streakMatches = metrics.streak.side === side;

  return <tr className={cn(
    'group border-t border-white/[0.05] transition-colors hover:bg-[#171b1a]',
    alternate ? 'bg-[#121515]' : 'bg-[#0d1010]',
    selected.lineType === 'goblin' && 'shadow-[inset_0_-1px_0_rgba(34,197,94,0.18)]',
    selected.lineType === 'devil' && 'shadow-[inset_0_-1px_0_rgba(239,68,68,0.18)]',
  )}>
    <td className={cn(
      'sticky left-0 z-10 overflow-hidden p-0 transition-colors group-hover:bg-[#171b1a]',
      alternate ? 'bg-[#121515]' : 'bg-[#0d1010]',
      selected.lineType === 'goblin' && 'shadow-[inset_2px_0_0_#22c55e]',
      selected.lineType === 'devil' && 'shadow-[inset_2px_0_0_#ef4444]',
    )}>
      <button onClick={() => navigate('player', { playerId: row.playerId })} className="relative flex min-h-[78px] w-full min-w-0 items-center py-2 pl-[72px] pr-3 text-left focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500">
        <PlayerCutout name={row.playerName} src={row.headshotUrl} />
        <span className="relative min-w-0 flex-1">
          <span className="flex min-w-0 items-center gap-1.5"><span className="truncate text-[12px] font-semibold text-zinc-100">{row.playerName}</span><span className="rounded bg-white/[0.055] px-1 py-0.5 text-[8px] font-semibold text-zinc-500">{row.position}</span></span>
          <span className="mt-0.5 flex items-center gap-1 truncate text-[9px] text-zinc-500"><span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', row.event.phase === 'live' ? 'bg-[#49e3aa]' : 'bg-zinc-700')} />{row.team} vs {row.opponent} · {row.event.startTimeLabel}</span>
          <span className="mt-1 flex min-w-0 items-center gap-1.5"><span className="truncate text-[10px] font-semibold text-zinc-300">{row.market}</span><LineTypeMark lineType={selected.lineType} compact /></span>
        </span>
      </button>
    </td>
    <td className="px-2 py-2">
      <OfferSelector row={row} selected={selected} side={side} onChange={(offer) => onOfferChange(offer.id)} onSideChange={onSideChange} lineFilter={lineFilter} compact />
    </td>
    <td className="border-l border-white/[0.045] px-1 py-2 text-center">
      {teamMoneyline === null ? <span className="text-[9px] text-zinc-600">N/A</span> : <span className="inline-flex min-w-11 justify-center rounded-full border border-teal-500/25 bg-teal-500/[0.08] px-2 py-1 text-[10px] font-semibold tabular-nums text-teal-300" title={`${row.team} moneyline at ${selected.providerShortName}`}>{oddsLabel(teamMoneyline)}</span>}
    </td>
    <td className={cn('border-l border-white/[0.045] px-1 py-2 text-center', metrics.edge !== null && metrics.edge !== 0 && 'stat-heat-cell stat-heat-cell--soft')} style={edgeHeatStyle(metrics.edge)}><ProjectionSignal projection={metrics.projection} line={selected.line} edge={metrics.edge} /></td>
    <td className="stat-heat-cell border-l border-white/[0.045] px-1 py-2 text-center" style={heatStyle(metrics.confidence?.score ?? 0)}>{metrics.confidence ? <ConfidenceMeter score={metrics.confidence.score} grade={metrics.confidence.grade} /> : <span className="text-zinc-600">—</span>}</td>
    <td className="stat-heat-cell border-l border-white/[0.045] px-1 py-2" style={heatStyle(metrics.l5.pct)}><RateBox value={metrics.l5.pct} sample={`${metrics.l5.hits}/${metrics.l5.total}`} title={`Last 5: ${metrics.l5.hits} of ${metrics.l5.total}`} /></td>
    <td className="stat-heat-cell border-l border-white/[0.045] px-1 py-2" style={heatStyle(metrics.l10.pct)}><RateBox value={metrics.l10.pct} sample={`${metrics.l10.hits}/${metrics.l10.total}`} title={`Last 10: ${metrics.l10.hits} of ${metrics.l10.total}`} /></td>
    <td className="stat-heat-cell border-l border-white/[0.045] px-1 py-2" style={heatStyle(metrics.l15.pct)}><RateBox value={metrics.l15.pct} sample={`${metrics.l15.hits}/${metrics.l15.total}`} title={`Last 15: ${metrics.l15.hits} of ${metrics.l15.total}`} /></td>
    <td className="stat-heat-cell border-l border-white/[0.045] px-1 py-2" style={heatStyle(metrics.h2h.pct)}><RateBox value={metrics.h2h.pct} sample={`${metrics.h2h.hits}/${metrics.h2h.total}`} title={`Head to head: ${metrics.h2h.hits} of ${metrics.h2h.total}`} /></td>
    <td className="stat-heat-cell border-l border-white/[0.045] px-1 py-2 text-center" style={{ '--stat-heat': streakMatches ? POSITIVE_HEAT : NEGATIVE_HEAT } as CSSProperties} title={`Streak ${metrics.streak.side} ${metrics.streak.count}; ${streakMatches ? 'supports' : 'opposes'} selected ${side}`}><span className={cn('inline-flex min-w-10 items-center justify-center gap-1 text-[11px] font-semibold', streakMatches ? POSITIVE_STAT_TEXT : NEGATIVE_STAT_TEXT)}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{metrics.streak.side === 'over' ? 'O' : 'U'}{metrics.streak.count}</span></td>
    <td className="border-l border-white/[0.045] px-1 py-2 text-center"><MovementSparkline points={movement} /></td>
    <td className="border-l border-white/[0.045] px-2 py-2 text-center">
      <span className="text-[12px] font-semibold tabular-nums">{accessTier === 'tier1' ? ev.positiveEvDetected ? <span className="text-amber-300">🔒 Detected</span> : <span className="text-zinc-700">—</span> : ev.details ? <span className={ev.details.evPercent > 0 ? 'font-bold text-[#7af0c8]' : 'font-bold text-[#ff9a9f]'}>{ev.details.evPercent > 0 ? '+' : ''}{ev.details.evPercent}%</span> : <span className="text-zinc-700">—</span>}</span>
    </td>
    <td className={cn('sticky right-0 z-10 px-2 py-2 text-right transition-colors group-hover:bg-[#171b1a]', alternate ? 'bg-[#121515]' : 'bg-[#0d1010]')}>
      <button
        disabled={selected.status !== 'active'}
        onClick={() => addPick(builderSelectionFor(row, selected, side))}
        aria-label={`Add ${row.playerName} ${row.market} ${side} ${selected.line} at ${oddsLabel(selectedOdds)}`}
        title="Add to Builder"
        className="inline-grid place-items-center rounded-lg bg-teal-500/[0.11] p-2 text-teal-300 ring-1 ring-inset ring-teal-500/20 transition-all hover:-translate-y-0.5 hover:bg-teal-500/20 hover:text-teal-100 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
      ><ListPlus className="h-4 w-4" /></button>
    </td>
  </tr>;
}

function interleaveRowsByPlayer(rows: PropBoardRow[]) {
  const buckets = Object.values(rows.reduce<Record<string, PropBoardRow[]>>((result, row) => {
    (result[row.playerId] ??= []).push(row);
    return result;
  }, {}));
  const interleaved: PropBoardRow[] = [];
  for (let marketIndex = 0; interleaved.length < rows.length; marketIndex += 1) {
    let added = false;
    for (const bucket of buckets) {
      if (bucket[marketIndex]) {
        interleaved.push(bucket[marketIndex]);
        added = true;
      }
    }
    if (!added) break;
  }
  return interleaved;
}

function SortableStatHeader({ label, field, sort, onSort, className }: {
  label: string;
  field: StatSortField;
  sort: StatSort | null;
  onSort: (field: StatSortField) => void;
  className?: string;
}) {
  const active = sort?.field === field;
  const nextDirection: SortDirection = active && sort.direction === 'desc' ? 'asc' : 'desc';

  return <th
    aria-sort={active ? (sort.direction === 'desc' ? 'descending' : 'ascending') : 'none'}
    className={cn('px-1 py-3 text-center', className)}
  >
    <button
      type="button"
      onClick={() => onSort(field)}
      aria-label={`Sort by ${label} ${nextDirection === 'desc' ? 'descending' : 'ascending'}`}
      className={cn(
        'mx-auto inline-flex min-h-7 items-center justify-center gap-1 rounded px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60',
        active ? 'bg-teal-500/[0.1] text-teal-200' : 'text-zinc-400 hover:bg-white/[0.035] hover:text-zinc-100',
      )}
    >
      {label}
      {active
        ? sort.direction === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />
        : <ChevronsUpDown className="h-3 w-3 opacity-65" />}
    </button>
  </th>;
}

export function PropsPage() {
  const [demoNow, setDemoNow] = useState(() => Date.now());
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [lineType, setLineType] = useState<LineFilter>('all');
  const [selectedOfferIds, setSelectedOfferIds] = useState<Record<string, string>>({});
  const [selectedSides, setSelectedSides] = useState<Record<string, Side>>({});
  const [statSort, setStatSort] = useState<StatSort | null>(null);
  const { sport, setSport } = useDashboard();
  useEffect(() => {
    const interval = window.setInterval(() => setDemoNow(Date.now()), LIVE_DEMO_REFRESH_MS);
    return () => window.clearInterval(interval);
  }, []);
  const liveDemoRows = useMemo(() => liveDemoRowsAt(demoNow, PROP_BOARD_ROWS), [demoNow]);
  const oldFiltered = useMemo(() => filterProps(
    PROPS,
    filters,
    sport,
    (id) => playerById(id),
    (prop) => prop[filters.hitRateRange === 'season' ? 'season' : filters.hitRateRange],
    (prop) => bestBook(prop, 'over').over,
  ), [filters, sport]);
  const allowedIds = new Set(oldFiltered.map((prop) => prop.id));
  const rows = liveDemoRows.filter((row) => allowedIds.has(row.id)
    && (lineType === 'all' || row.offers.some((offer) => offer.lineType === lineType)));
  const visibleRows = sortRows(rows, statSort, lineType, selectedOfferIds, selectedSides).slice(0, 60);
  const updateOffer = (propId: string, offerId: string) => setSelectedOfferIds((current) => ({ ...current, [propId]: offerId }));
  const updateSide = (propId: string, side: Side) => setSelectedSides((current) => ({ ...current, [propId]: side }));
  const updateStatSort = (field: StatSortField) => {
    setStatSort((current) => current?.field === field
      ? { field, direction: current.direction === 'desc' ? 'asc' : 'desc' }
      : { field, direction: 'desc' });
  };

  return <div className="space-y-3 md:space-y-0">
    <div className="sticky top-14 z-30 space-y-1.5 rounded-xl border border-white/[0.065] bg-[#0d1010]/95 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur md:rounded-b-none md:border-b-0">
      <GlobalSearch onPickPlayer={(id) => setFilters({ ...filters, playerId: id })} />
      <FilterToolbar
        filters={filters}
        setFilters={setFilters}
        resultCount={rows.length}
        lineType={lineType}
        setLineType={setLineType}
      />
    </div>
    <div className="flex gap-1 overflow-x-auto pb-1 md:hidden" role="group" aria-label="Sort props by stats">
      {([['moneyline', 'Moneyline'], ['projection', 'Projection'], ['confidence', 'Confidence'], ['l5', 'L5'], ['l10', 'L10'], ['l15', 'L15'], ['h2h', 'H2H'], ['streak', 'Streak'], ['ev', '+EV']] as const).map(([field, label]) => {
        const active = statSort?.field === field;
        const nextDirection: SortDirection = active && statSort.direction === 'desc' ? 'asc' : 'desc';
        return <button
          key={field}
          type="button"
          onClick={() => updateStatSort(field)}
          aria-label={`Mobile sort by ${label} ${nextDirection === 'desc' ? 'descending' : 'ascending'}`}
          className={cn(
            'inline-flex h-7 shrink-0 items-center gap-1 rounded-md border px-2 text-[9px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60',
            active ? 'border-teal-500/35 bg-teal-500/[0.11] text-teal-200' : 'border-[#272727] bg-[#111] text-zinc-500',
          )}
        >
          {label}
          {active
            ? statSort.direction === 'desc' ? <ArrowDown className="h-2.5 w-2.5" /> : <ArrowUp className="h-2.5 w-2.5" />
            : <ChevronsUpDown className="h-2.5 w-2.5 opacity-50" />}
        </button>;
      })}
    </div>
    {rows.length ? <>
      <div className="grid grid-cols-1 gap-2 md:hidden">{visibleRows.slice(0, 40).map((row) => <PropCard key={`${row.id}:${lineType}:card`} row={row} lineFilter={lineType} selectedOfferId={selectedOfferIds[row.id]} selectedSide={selectedSides[row.id] ?? 'over'} onOfferChange={(offerId) => updateOffer(row.id, offerId)} onSideChange={(side) => updateSide(row.id, side)} />)}</div>
      <div className="hidden overflow-hidden rounded-xl border border-white/[0.055] bg-[#0d0f0f] shadow-[0_12px_40px_rgba(0,0,0,0.16)] md:block md:rounded-t-none">
        <div className="overflow-x-auto">
          <table aria-label="Props research table" className="w-full min-w-[1272px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.07] bg-[#101212] text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
                <th className="sticky left-0 z-20 w-[210px] bg-[#101212] px-3 py-3">Player · Prop</th>
                <th className="w-[330px] px-2 py-3">Book · Line · Odds</th>
                <SortableStatHeader label="Moneyline" field="moneyline" sort={statSort} onSort={updateStatSort} className="w-[80px]" />
                <SortableStatHeader label="Projection" field="projection" sort={statSort} onSort={updateStatSort} className="w-[94px]" />
                <SortableStatHeader label="Confidence" field="confidence" sort={statSort} onSort={updateStatSort} className="w-[92px]" />
                <SortableStatHeader label="L5" field="l5" sort={statSort} onSort={updateStatSort} className="w-[66px]" />
                <SortableStatHeader label="L10" field="l10" sort={statSort} onSort={updateStatSort} className="w-[66px]" />
                <SortableStatHeader label="L15" field="l15" sort={statSort} onSort={updateStatSort} className="w-[66px]" />
                <SortableStatHeader label="H2H" field="h2h" sort={statSort} onSort={updateStatSort} className="w-[66px]" />
                <SortableStatHeader label="Streak" field="streak" sort={statSort} onSort={updateStatSort} className="w-[62px]" />
                <th className="w-[88px] px-1 py-3 text-center">Movement</th>
                <SortableStatHeader label="+EV" field="ev" sort={statSort} onSort={updateStatSort} className="w-[84px]" />
                <th className="sticky right-0 z-20 w-[48px] bg-[#101212] px-2 py-3 text-center" aria-label="Builder"><ListPlus className="mx-auto h-4 w-4 text-zinc-500" /></th>
              </tr>
            </thead>
            <tbody>{visibleRows.map((row, index) => <PropTableRow key={`${row.id}:${lineType}:row`} row={row} lineFilter={lineType} selectedOfferId={selectedOfferIds[row.id]} selectedSide={selectedSides[row.id] ?? 'over'} onOfferChange={(offerId) => updateOffer(row.id, offerId)} onSideChange={(side) => updateSide(row.id, side)} alternate={index % 2 === 1} />)}</tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/[0.045] px-3 py-2 text-[8px] text-zinc-600">
          <span className="font-semibold uppercase tracking-wider text-zinc-500">Percentage grade</span>
          <span className="text-[#7af0c8]">50% and above Green</span>
          <span className="text-[#ff9a9f]">Below 50% Red</span>
        </div>
      </div>
    </> : <EmptyState title="No props match these filters." action={<button onClick={() => { setFilters(DEFAULT_FILTERS); setLineType('all'); setSport('All'); }} className="rounded border border-teal-500/40 px-3 py-1.5 text-xs text-teal-300">Clear filters</button>} />}
  </div>;
}
