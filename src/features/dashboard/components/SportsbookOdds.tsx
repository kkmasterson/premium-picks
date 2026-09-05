import { cn } from '@/lib/utils';

export function bestAvailableOdds(values: Array<number | null | undefined>): number | null {
  const available = values.filter((value): value is number => value !== null && value !== undefined);
  return available.length ? Math.max(...available) : null;
}

export function OddsPriceCell({
  side,
  odds,
  best = false,
  compact = false,
  className,
}: {
  side: 'over' | 'under';
  odds: number | null;
  best?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const label = side === 'over' ? 'O' : 'U';
  const price = odds === null ? '—' : odds > 0 ? `+${odds}` : String(odds);
  const over = side === 'over';

  return <span
    data-best-odds={best ? side : undefined}
    title={best ? `Best available ${side} price` : `${side === 'over' ? 'Over' : 'Under'} price`}
    className={cn(
      'inline-flex shrink-0 items-center justify-between gap-1 rounded border font-semibold tabular-nums',
      compact ? 'h-6 min-w-[46px] px-1 text-[8px]' : 'h-6 min-w-[58px] px-1.5 text-[9px]',
      over
        ? 'border-emerald-400/15 bg-emerald-500/[0.045] text-emerald-100/90'
        : 'border-red-400/15 bg-red-500/[0.045] text-red-100/90',
      best && (over
        ? 'border-emerald-400/40 bg-emerald-500/[0.085] ring-1 ring-inset ring-emerald-300/20'
        : 'border-red-400/40 bg-red-500/[0.085] ring-1 ring-inset ring-red-300/20'),
      className,
    )}
  >
    <span className={cn('font-bold', over ? 'text-emerald-400' : 'text-red-400')}>{label}</span>
    <span>{price}</span>
  </span>;
}
