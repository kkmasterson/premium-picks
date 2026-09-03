import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { MarketSnapshot, ResearchHistoryEntry } from '../types';

type Range = 5 | 10 | 15 | 'season';

function Chart({
  history,
  line,
  valueFor,
  neutral = false,
  componentBars = false,
  ariaLabel,
}: {
  history: ResearchHistoryEntry[];
  line?: number;
  valueFor: (entry: ResearchHistoryEntry) => number | null;
  neutral?: boolean;
  componentBars?: boolean;
  ariaLabel: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const data = [...history].reverse();
  const values = data.map((entry) => {
    const value = valueFor(entry);
    return componentBars && entry.components?.length ? entry.components.reduce((sum, item) => sum + item.value, 0) : value;
  }).filter((value): value is number => value !== null);
  const width = 760;
  const height = 248;
  const pad = { left: 10, right: 8, top: 22, bottom: 46 };
  const max = Math.max(1, ...values, line ?? 0) * 1.16;
  const baseline = height - pad.bottom;
  const chartHeight = baseline - pad.top;
  const y = (value: number) => pad.top + (1 - value / max) * chartHeight;
  const band = (width - pad.left - pad.right) / Math.max(data.length, 1);
  const lineY = line === undefined ? null : y(line);
  const bars = data.map((entry, index) => {
    const value = valueFor(entry);
    const displayValue = value === null ? null : componentBars && entry.components?.length ? entry.components.reduce((sum, item) => sum + item.value, 0) : value;
    const x = pad.left + index * band + band * 0.07;
    const barWidth = band * 0.86;
    return { entry, value, displayValue, x, barWidth, valueY: displayValue === null ? pad.top + 24 : y(displayValue), over: value !== null && (line === undefined || value > line) };
  });
  const active = bars.find((bar) => bar.entry.id === activeId) ?? null;
  const tooltipWidth = 172;
  const tooltipHeight = 59;
  const tooltipX = active ? Math.max(pad.left, Math.min(width - pad.right - tooltipWidth, active.x + active.barWidth / 2 - tooltipWidth / 2)) : 0;
  const tooltipY = active ? Math.max(5, Math.min(baseline - tooltipHeight - 5, active.valueY - tooltipHeight - 10)) : 0;

  return (
    <div className="overflow-x-auto" onMouseLeave={() => setActiveId(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[650px]" role="img" aria-label={ariaLabel}>
        <defs>
          <linearGradient id="chartOver" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#147a5d" /></linearGradient>
          <linearGradient id="chartUnder" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#743434" /></linearGradient>
          <linearGradient id="chartNeutral" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a1a1aa" /><stop offset="100%" stopColor="#3f3f46" /></linearGradient>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14b8a6" stopOpacity="0.075" /><stop offset="100%" stopColor="#14b8a6" stopOpacity="0" /></linearGradient>
        </defs>
        <rect x={pad.left} y={pad.top} width={width - pad.left - pad.right} height={chartHeight} fill="url(#chartGlow)" />
        {[0.25, 0.5, 0.75].map((fraction) => <line key={fraction} x1={pad.left} x2={width - pad.right} y1={pad.top + fraction * chartHeight} y2={pad.top + fraction * chartHeight} stroke="#242727" />)}
        {active && <rect x={active.x - band * 0.07} y={pad.top} width={band} height={chartHeight} rx="5" fill="#2dd4bf" fillOpacity="0.055" stroke="#2dd4bf" strokeOpacity="0.2" />}

        {bars.map(({ entry, value, displayValue, x, barWidth, valueY, over }) => {
          const activeBar = activeId === entry.id;
          const eventLabel = `${entry.date} ${entry.home ? 'vs' : '@'} ${entry.opponent}`;
          const detailLabel = entry.availability !== 'played' || value === null ? `${eventLabel}: ${entry.availability === 'dnp' ? 'DNP' : 'unavailable'}` : `${eventLabel}: ${displayValue}, ${line === undefined ? 'result' : over ? 'over' : 'under'}${line === undefined ? '' : ` line ${line}`}`;
          return (
            <g key={entry.id} role="button" tabIndex={0} aria-label={detailLabel} data-testid={`history-bar-${entry.id}`} onMouseEnter={() => setActiveId(entry.id)} onFocus={() => setActiveId(entry.id)} onBlur={() => setActiveId(null)} onClick={() => setActiveId((current) => current === entry.id ? null : entry.id)} className="cursor-pointer outline-none">
              {entry.availability !== 'played' || value === null || displayValue === null ? (
                <>
                  <rect x={x} y={pad.top + 24} width={barWidth} height={chartHeight - 24} rx={4} fill={activeBar ? '#181b1b' : 'none'} stroke={activeBar ? '#2dd4bf' : '#4b4b4b'} strokeWidth={activeBar ? 2 : 1} strokeDasharray="5 4" />
                  <text x={x + barWidth / 2} y={pad.top + chartHeight / 2} textAnchor="middle" fontSize="10" fontWeight="700" fill="#71717a">{entry.availability === 'dnp' ? 'DNP' : 'N/A'}</text>
                </>
              ) : (
                <>
                  {componentBars && entry.components?.length ? entry.components.map((component, componentIndex) => {
                    const previous = entry.components?.slice(0, componentIndex).reduce((sum, item) => sum + item.value, 0) ?? 0;
                    const cumulative = previous + component.value;
                    const top = y(cumulative);
                    const bottom = y(previous);
                    const componentFill = neutral ? (componentIndex === 0 ? '#71717a' : '#3f3f46') : over ? (componentIndex === 0 ? '#16a873' : '#0d6248') : componentIndex === 0 ? '#d65b5b' : '#763636';
                    return <g key={component.label}><rect x={x} y={top} width={barWidth} height={Math.max(2, bottom - top)} rx={componentIndex === entry.components!.length - 1 ? 4 : 0} fill={componentFill} stroke={activeBar ? '#5eead4' : 'transparent'} strokeWidth={activeBar ? 1.5 : 0} />{bottom - top > 18 && <text x={x + barWidth / 2} y={top + 12} textAnchor="middle" fontSize="7" fontWeight="800" fill="#f4f4f5">{component.label.split(' ')[0]} {component.value}</text>}</g>;
                  }) : <rect x={x} y={valueY} width={barWidth} height={Math.max(2, baseline - valueY)} rx={4} fill={neutral ? 'url(#chartNeutral)' : over ? 'url(#chartOver)' : 'url(#chartUnder)'} stroke={activeBar ? '#d5fffa' : 'transparent'} strokeWidth={activeBar ? 2 : 0} />}
                  <text x={x + barWidth / 2} y={valueY - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill={activeBar ? '#f4fffd' : '#d4d4d8'}>{displayValue}</text>
                  {!neutral && <text x={x + barWidth / 2} y={valueY + 13} textAnchor="middle" fontSize="8" fontWeight="800" fill="#080808">{over ? 'O' : 'U'}</text>}
                </>
              )}
              <rect x={x - band * 0.07} y={pad.top} width={band} height={chartHeight} fill="transparent" />
              <text x={x + barWidth / 2} y={height - 23} textAnchor="middle" fontSize="8" fill={activeBar ? '#a1a1aa' : '#777'}>{entry.date}</text>
              <text x={x + barWidth / 2} y={height - 9} textAnchor="middle" fontSize="8" fill={activeBar ? '#71717a' : '#555'}>{entry.home ? 'vs' : '@'} {entry.opponent}</text>
            </g>
          );
        })}

        {lineY !== null && <g pointerEvents="none"><line x1={pad.left} x2={width - pad.right} y1={lineY} y2={lineY} stroke="#F5C542" strokeWidth="1.5" strokeDasharray="7 5" /><rect x={width - 82} y={lineY - 17} width="68" height="15" rx="4" fill="#251f0d" /><text x={width - 48} y={lineY - 6} textAnchor="middle" fontSize="9" fontWeight="800" fill="#F5C542">LINE {line}</text></g>}

        {active && (
          <g pointerEvents="none" data-testid="chart-tooltip">
            <rect x={tooltipX} y={tooltipY} width={tooltipWidth} height={tooltipHeight} rx="7" fill="#121616" stroke="#2dd4bf" strokeOpacity="0.65" />
            <text x={tooltipX + 10} y={tooltipY + 15} fontSize="9" fontWeight="700" fill="#f4f4f5">{active.entry.date} · {active.entry.home ? 'vs' : '@'} {active.entry.opponent}</text>
            <text x={tooltipX + 10} y={tooltipY + 32} fontSize="13" fontWeight="800" fill={active.value === null ? '#a1a1aa' : active.over || neutral ? '#5eead4' : '#f87171'}>{active.displayValue ?? (active.entry.availability === 'dnp' ? 'DNP' : 'N/A')}</text>
            <text x={tooltipX + 52} y={tooltipY + 31} fontSize="9" fill="#a1a1aa">{active.value === null || line === undefined ? 'Recorded result' : `${active.over ? 'Over' : 'Under'} ${line}`}</text>
            <text x={tooltipX + 10} y={tooltipY + 48} fontSize="8" fill="#71717a">{active.entry.minutes ? `${active.entry.minutes} minutes · ` : ''}Click to keep details visible</text>
          </g>
        )}
      </svg>
      <span className="sr-only" aria-live="polite">{active ? `${active.entry.date}, ${active.displayValue ?? active.entry.availability}` : ''}</span>
    </div>
  );
}

export function PerformanceChart({ market, line, periodLabel, embedded = false }: { market: MarketSnapshot; line: number; periodLabel: string; embedded?: boolean }) {
  const [range, setRange] = useState<Range>(15);
  const history = useMemo(() => range === 'season' ? market.history : market.history.slice(0, range), [market.history, range]);
  return (
    <section className={cn('bg-[#0f1111]', !embedded && 'rounded-xl border border-white/[0.07]')}>
      <header className="flex flex-wrap items-center justify-between gap-2 px-4 pb-1 pt-3">
        <div>
          <h2 className="text-[13px] font-semibold text-zinc-100">Recent {market.definition.market}</h2>
          <p className="text-[9px] text-zinc-600">{periodLabel} · Hover, focus, or tap a bar for instant event detail</p>
        </div>
        <div className="flex gap-1" role="group" aria-label="Performance range">
          {([5, 10, 15, 'season'] as Range[]).map((item) => <button key={String(item)} onClick={() => setRange(item)} aria-pressed={range === item} className={cn('rounded px-2 py-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400', range === item ? 'bg-teal-400/15 text-teal-300' : 'text-zinc-500 hover:text-zinc-300')}>{item === 'season' ? 'SZN' : `L${item}`}</button>)}
        </div>
      </header>
      <div className={cn('pb-3 pt-1', embedded ? 'px-0' : 'px-3 sm:px-4')}>
        <Chart history={history} line={line} valueFor={(entry) => entry.value} componentBars={Boolean(market.definition.chartPreset && market.definition.chartPreset !== 'standard')} ariaLabel={`${market.definition.market} history compared with line ${line}`} />
        <div className="mt-1 flex flex-wrap gap-4 px-3 text-[9px] text-zinc-600 sm:px-4"><span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-emerald-400" />Over line</span><span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-red-400" />Under line</span><span><span className="mr-1 inline-block h-2 w-2 rounded-sm border border-dashed border-zinc-500" />DNP / unavailable</span></div>
      </div>
    </section>
  );
}

export function SupportingStatsChart({ market, stats }: { market: MarketSnapshot; stats: string[] }) {
  const [selected, setSelected] = useState(stats[0] ?? 'Supporting stat');
  const averages = Object.fromEntries(stats.map((stat) => {
    const values = market.history.map((entry) => entry.supporting[stat]).filter((value): value is number => value !== null && value !== undefined);
    return [stat, values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null];
  }));
  return (
    <section className="rounded-xl border border-white/[0.07] bg-[#0f1111]">
      <header className="border-b border-white/[0.06] px-4 py-3"><h2 className="text-sm font-semibold text-zinc-100">Supporting Stats</h2></header>
      <div className="p-3 sm:p-4">
        <div className="no-scrollbar mb-3 flex overflow-x-auto border-b border-white/[0.06]" role="tablist" aria-label="Supporting statistics">
          {stats.map((stat) => <button key={stat} role="tab" aria-selected={selected === stat} onClick={() => setSelected(stat)} className={cn('relative shrink-0 px-3 pb-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400', selected === stat ? 'text-teal-300 after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-teal-400' : 'text-zinc-500 hover:text-zinc-300')}><span className="block font-medium">{stat}</span><span className="text-[9px] text-zinc-600">Avg {averages[stat] === null ? '—' : averages[stat].toFixed(1)}</span></button>)}
        </div>
        <Chart history={market.history} valueFor={(entry) => entry.supporting[selected] ?? null} neutral ariaLabel={`${selected} supporting-stat history`} />
      </div>
    </section>
  );
}
