import { useMemo, useState } from 'react';
import type { GameLogEntry } from '@/features/dashboard/types';
import { cn } from '@/lib/utils';

type Range = 5 | 10 | 15 | 'season';

export function TrendChart({ gameLog, line, height = 160 }: { gameLog: GameLogEntry[]; line: number; height?: number }) {
  const [range, setRange] = useState<Range>(15);
  const data = useMemo(() => {
    const arr = range === 'season' ? gameLog : gameLog.slice(0, range);
    return [...arr].reverse(); // oldest -> newest
  }, [gameLog, range]);

  const W = 560, H = height;
  const padL = 34, padR = 10, padT = 12, padB = 22;
  const vals = data.map((d) => d.value);
  const max = Math.max(...vals, line) * 1.12;
  const min = Math.min(0, Math.min(...vals, line));
  const y = (v: number) => padT + (1 - (v - min) / (max - min || 1)) * (H - padT - padB);
  const bw = (W - padL - padR) / Math.max(data.length, 1);
  const lineY = y(line);

  return (
    <div>
      <div className="mb-2 flex gap-1" role="group" aria-label="Chart range">
        {([5, 10, 15, 'season'] as Range[]).map((r) => (
          <button
            key={String(r)}
            onClick={() => setRange(r)}
            aria-pressed={range === r}
            className={cn(
              'rounded px-2 py-0.5 text-[11px] font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542]',
              range === r ? 'bg-[#F5C542]/15 text-[#F5C542]' : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            {r === 'season' ? 'SZN' : `L${r}`}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Recent game results against the ${line} line`}>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={padL} x2={W - padR} y1={padT + f * (H - padT - padB)} y2={padT + f * (H - padT - padB)} stroke="#1e1e1e" strokeWidth="1" />
        ))}
        <text x={4} y={y(max / 1.12) + 4} fontSize="9" fill="#666">{Math.round(max / 1.12)}</text>
        <text x={4} y={y((max / 1.12 + min) / 2) + 4} fontSize="9" fill="#666">{Math.round((max / 1.12 + min) / 2)}</text>
        {data.map((d, i) => {
          const x = padL + i * bw + bw * 0.18;
          const w = bw * 0.64;
          const vy = y(d.value);
          const over = d.value > d.line;
          return (
            <g key={i}>
              <rect
                x={x} y={vy} width={w} height={Math.max(2, H - padB - vy)}
                rx={2}
                fill={over ? 'rgba(52, 211, 153, 0.75)' : 'rgba(248, 113, 113, 0.55)'}
              >
                <title>{`${d.date} ${d.home ? 'vs' : '@'} ${d.opp}: ${d.value} (line ${d.line})`}</title>
              </rect>
              <text x={x + w / 2} y={vy - 4} textAnchor="middle" fontSize="9" fill="#a1a1aa">{d.value}</text>
              {(data.length <= 15 || i % 3 === 0) && (
                <text x={x + w / 2} y={H - 6} textAnchor="middle" fontSize="8.5" fill="#555">G{i + 1}</text>
              )}
            </g>
          );
        })}
        <line x1={padL} x2={W - padR} y1={lineY} y2={lineY} stroke="#F5C542" strokeWidth="1.5" strokeDasharray="6 4" />
        <text x={W - padR} y={lineY - 4} textAnchor="end" fontSize="9.5" fontWeight="700" fill="#F5C542">LINE {line}</text>
      </svg>
    </div>
  );
}
