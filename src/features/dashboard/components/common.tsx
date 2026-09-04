import { avatarColor, initials } from '@/features/dashboard/data';
import { cn } from '@/lib/utils';

export function PlayerAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'sm' ? 'h-8 w-8 text-[10px]' : size === 'lg' ? 'h-16 w-16 text-xl' : 'h-10 w-10 text-xs';
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-full border border-teal-500/25 bg-teal-500/[0.06] font-semibold text-teal-300', sz)}
      style={{ background: avatarColor(name) }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}

export function hitTone(pct: number): 'strong' | 'mid' | 'weak' {
  if (pct >= 70) return 'strong';
  if (pct >= 50) return 'mid';
  return 'weak';
}

export function HitRateBadge({ pct, label }: { pct: number; label?: string }) {
  const tone = hitTone(pct);
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums',
        tone === 'strong' && 'bg-emerald-500/15 text-emerald-400',
        tone === 'mid' && 'bg-[#F5C542]/10 text-[#D9B45B]',
        tone === 'weak' && 'bg-red-500/15 text-red-400',
      )}
      aria-label={label ? `${label} hit rate ${pct} percent` : `${pct} percent hit rate`}
    >
      {pct}%
    </span>
  );
}

export function DiffBadge({ diff }: { diff: number }) {
  return (
    <span className={cn('text-xs font-semibold tabular-nums', diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-zinc-400')}>
      {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
    </span>
  );
}

export function EmptyState({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#2a2a2a] bg-[#0e0e0e] px-6 py-16 text-center">
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      {action}
    </div>
  );
}

export function SectionCard({ title, children, className, action }: { title?: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <section className={cn('rounded-xl border border-[#1f1f1f] bg-[#121212]', className)}>
      {title && (
        <header className="flex items-center justify-between border-b border-[#1f1f1f] px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function GoldShield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 2 20 5v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3Z" fill="#F5C542" />
      <path d="M12 5.2 17.5 7v4.2c0 3.6-2.3 6.9-5.5 8.2-3.2-1.3-5.5-4.6-5.5-8.2V7L12 5.2Z" fill="#080808" />
      <path d="M12 7.4 15.6 9v2.4c0 2.4-1.5 4.7-3.6 5.7-2.1-1-3.6-3.3-3.6-5.7V9L12 7.4Z" fill="#F5C542" />
      <text x="12" y="14.6" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#080808" fontFamily="system-ui">P</text>
    </svg>
  );
}

export function FreshnessTag({ seconds }: { seconds: number }) {
  const label = seconds < 60 ? `Updated ${seconds}s ago` : `Updated ${Math.round(seconds / 60)}m ago`;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
      {label}
    </span>
  );
}
