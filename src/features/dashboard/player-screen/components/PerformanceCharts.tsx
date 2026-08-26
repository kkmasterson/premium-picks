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
  const data = [...history].reverse();
  const values = data.map((entry) => {
    const value = valueFor(entry);
    return componentBars && entry.components?.length ? entry.components.reduce((sum, item) => sum + item.value, 0) : value;
  }).filter((value): value is number => value !== null);
  const width = 760;
  const height = 260;
  const pad = { left: 34, right: 14, top: 26, bottom: 48 };
  const max = Math.max(1, ...values, line ?? 0) * 1.16;
  const baseline = height - pad.bottom;
  const chartHeight = baseline - pad.top;
  const y = (value: number) => pad.top + (1 - value / max) * chartHeight;
  const band = (width - pad.left - pad.right) / Math.max(data.length, 1);
  const lineY = line === undefined ? null : y(line);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[650px] w-full" role="img" aria-label={ariaLabel}>
        <defs>
          <linearGradient id="chartOver" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#147a5d" /></linearGradient>
          <linearGradient id="chartUnder" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#743434" /></linearGradient>
          <linearGradient id="chartNeutral" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a1a1aa" /><stop offset="100%" stopColor="#3f3f46" /></linearGradient>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.08" /><stop offset="100%" stopColor="#10b981" stopOpacity="0" /></linearGradient>
        </defs>
        <rect x={pad.left} y={pad.top} width={width - pad.left - pad.right} height={chartHeight} fill="url(#chartGlow)" />
        {[0.25, 0.5, 0.75].map((fraction) => (
          <line key={fraction} x1={pad.left} x2={width - pad.right} y1={pad.top + fraction * chartHeight} y2={pad.top + fraction * chartHeight} stroke="#242424" />
        ))}
        <text x={4} y={pad.top + 4} fontSize="9" fill="#666">{Math.round(max)}</text>
        <text x={4} y={baseline + 4} fontSize="9" fill="#666">0</text>
        {data.map((entry, index) => {
          const value = valueFor(entry);
          const x = pad.left + index * band + band * 0.16;
          const barWidth = band * 0.68;
          if (entry.availability !== 'played' || value === null) {
            return (
              <g key={entry.id}>
                <rect x={x} y={pad.top + 24} width={barWidth} height={chartHeight - 24} rx={3} fill="none" stroke="#4b4b4b" strokeDasharray="5 4" />
                <text x={x + barWidth / 2} y={pad.top + chartHeight / 2} textAnchor="middle" fontSize="10" fontWeight="700" fill="#71717a">{entry.availability === 'dnp' ? 'DNP' : 'N/A'}</text>
                <text x={x + barWidth / 2} y={height - 25} textAnchor="middle" fontSize="8" fill="#777">{entry.date}</text>
                <text x={x + barWidth / 2} y={height - 11} textAnchor="middle" fontSize="8" fill="#555">{entry.home ? 'vs' : '@'} {entry.opponent}</text>
              </g>
            );
          }
          const displayValue = componentBars && entry.components?.length ? entry.components.reduce((sum, item) => sum + item.value, 0) : value;
          const valueY = y(displayValue);
          const over = line === undefined || value > line;
          const fill = neutral ? 'url(#chartNeutral)' : over ? 'url(#chartOver)' : 'url(#chartUnder)';
          return (
            <g key={entry.id}>
              {componentBars && entry.components?.length ? entry.components.map((component, componentIndex) => {
                const previous = entry.components?.slice(0, componentIndex).reduce((sum, item) => sum + item.value, 0) ?? 0;
                const cumulative = previous + component.value;
                const top = y(cumulative);
                const bottom = y(previous);
                const componentFill = neutral ? (componentIndex === 0 ? '#71717a' : '#3f3f46') : over ? (componentIndex === 0 ? '#16a873' : '#0d6248') : componentIndex === 0 ? '#d65b5b' : '#763636';
                return <g key={component.label}><rect x={x} y={top} width={barWidth} height={Math.max(2, bottom - top)} rx={componentIndex === entry.components!.length - 1 ? 3 : 0} fill={componentFill}><title>{component.label}: {component.value}</title></rect>{bottom - top > 18 && <text x={x + barWidth / 2} y={top + 12} textAnchor="middle" fontSize="7" fontWeight="800" fill="#f4f4f5">{component.label.split(' ')[0]} {component.value}</text>}</g>;
              }) : <rect x={x} y={valueY} width={barWidth} height={Math.max(2, baseline - valueY)} rx={3} fill={fill}><title>{`${entry.date} ${entry.home ? 'vs' : '@'} ${entry.opponent}: ${value}${line === undefined ? '' : `, ${over ? 'over' : 'under'} line ${line}`}`}</title></rect>}
              <text x={x + barWidth / 2} y={valueY - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill="#d4d4d8">{displayValue}</text>
              {!neutral && <text x={x + barWidth / 2} y={valueY + 13} textAnchor="middle" fontSize="8" fontWeight="800" fill="#080808">{over ? 'O' : 'U'}</text>}
              <text x={x + barWidth / 2} y={height - 25} textAnchor="middle" fontSize="8" fill="#777">{entry.date}</text>
              <text x={x + barWidth / 2} y={height - 11} textAnchor="middle" fontSize="8" fill="#555">{entry.home ? 'vs' : '@'} {entry.opponent}</text>
            </g>
          );
        })}
        {lineY !== null && (
          <g>
            <line x1={pad.left} x2={width - pad.right} y1={lineY} y2={lineY} stroke="#F5C542" strokeWidth="1.5" strokeDasharray="7 5" />
            <rect x={width - 82} y={lineY - 17} width="68" height="15" rx="4" fill="#251f0d" />
            <text x={width - 48} y={lineY - 6} textAnchor="middle" fontSize="9" fontWeight="800" fill="#F5C542">LINE {line}</text>
          </g>
        )}
      </svg>
    </div>
  );
}

export function PerformanceChart({ market, line, periodLabel }: { market: MarketSnapshot; line: number; periodLabel: string }) {
  const [range, setRange] = useState<Range>(15);
  const history = useMemo(() => range === 'season' ? market.history : market.history.slice(0, range), [market.history, range]);
  return (
    <section className="rounded-xl border border-[#202020] bg-[#101010]">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-[#202020] px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Recent {market.definition.market} by {market.history.length && 'event'}</h2>
          <p className="text-[10px] text-zinc-600">{periodLabel} · Exact results with explicit over/under labels</p>
        </div>
        <div className="flex gap-1" role="group" aria-label="Performance range">
          {([5, 10, 15, 'season'] as Range[]).map((item) => (
            <button key={String(item)} onClick={() => setRange(item)} aria-pressed={range === item} className={cn('rounded px-2 py-1 text-[10px] font-semibold', range === item ? 'bg-[#F5C542]/15 text-[#F5C542]' : 'text-zinc-500 hover:text-zinc-300')}>{item === 'season' ? 'SZN' : `L${item}`}</button>
          ))}
        </div>
      </header>
      <div className="p-3 sm:p-4">
        <Chart history={history} line={line} valueFor={(entry) => entry.value} componentBars={Boolean(market.definition.chartPreset && market.definition.chartPreset !== 'standard')} ariaLabel={`${market.definition.market} history compared with line ${line}`} />
        <div className="mt-1 flex flex-wrap gap-4 text-[10px] text-zinc-500">
          <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-emerald-400" />Over line</span>
          <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-red-400" />Under line</span>
          <span><span className="mr-1 inline-block h-2 w-2 rounded-sm border border-dashed border-zinc-500" />DNP / unavailable</span>
        </div>
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
    <section className="rounded-xl border border-[#202020] bg-[#101010]">
      <header className="border-b border-[#202020] px-4 py-3"><h2 className="text-sm font-semibold text-zinc-100">Supporting Stats</h2></header>
      <div className="p-3 sm:p-4">
        <div className="no-scrollbar mb-3 flex overflow-x-auto border-b border-[#202020]" role="tablist" aria-label="Supporting statistics">
          {stats.map((stat) => (
            <button key={stat} role="tab" aria-selected={selected === stat} onClick={() => setSelected(stat)} className={cn('relative shrink-0 px-3 pb-2 text-xs', selected === stat ? 'text-[#F5C542] after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-[#F5C542]' : 'text-zinc-500 hover:text-zinc-300')}>
              <span className="block font-medium">{stat}</span>
              <span className="text-[9px] text-zinc-600">Avg {averages[stat] === null ? '—' : averages[stat].toFixed(1)}</span>
            </button>
          ))}
        </div>
        <Chart history={market.history} valueFor={(entry) => entry.supporting[selected] ?? null} neutral ariaLabel={`${selected} supporting-stat history`} />
      </div>
    </section>
  );
}
