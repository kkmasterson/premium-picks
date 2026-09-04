import type { HTMLAttributes, ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlayerAvatar } from '@/features/dashboard/components/common';

export type MetricTone = 'neutral' | 'active' | 'positive' | 'negative' | 'warning' | 'premium';

export interface DashboardMetric {
  label: string;
  value: ReactNode;
  sample?: ReactNode;
  tone?: MetricTone;
  accessibilityDescription?: string;
}

const toneClasses: Record<MetricTone, string> = {
  neutral: 'text-zinc-200',
  active: 'text-teal-300',
  positive: 'text-emerald-400',
  negative: 'text-rose-400',
  warning: 'text-amber-300',
  premium: 'text-[#F5C542]',
};

export function DashboardPageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex min-w-0 flex-wrap items-start justify-between gap-3 border-b border-[var(--dashboard-border)] px-1 pb-3">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-teal-400">{eyebrow}</p>}
        <h1 className="text-base font-bold tracking-tight text-[var(--dashboard-text-primary)] sm:text-lg">{title}</h1>
        <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-[var(--dashboard-text-muted)] sm:text-xs">{description}</p>
      </div>
      {actions}
    </header>
  );
}

export function HelpAction({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--dashboard-border-strong)] bg-[var(--dashboard-surface)] px-2.5 text-[10px] font-semibold text-zinc-400 transition hover:border-teal-500/35 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60">
      <CircleHelp className="h-3.5 w-3.5" /> Help
    </button>
  );
}

export function DashboardToolbar({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn('rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] p-3', className)} {...props} />;
}

export function ResearchSurface({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn('min-w-0 overflow-hidden rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)]', className)} {...props} />;
}

export function MetricStrip({ metrics, className, compact = false }: { metrics: DashboardMetric[]; className?: string; compact?: boolean }) {
  return (
    <div className={cn('no-scrollbar grid min-w-0 auto-cols-[minmax(62px,1fr)] grid-flow-col divide-x divide-[var(--dashboard-border)] overflow-x-auto bg-black/10', className)} aria-label="Performance summary">
      {metrics.map((metric) => (
        <div key={metric.label} className={cn('min-w-[62px] px-2 text-center', compact ? 'py-2' : 'py-2.5')} aria-label={metric.accessibilityDescription}>
          <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-zinc-600">{metric.label}</p>
          <p className={cn('mt-0.5 text-[11px] font-bold tabular-nums', toneClasses[metric.tone ?? 'neutral'])}>{metric.value}</p>
          {metric.sample != null && <p className="mt-0.5 text-[8px] tabular-nums text-zinc-600">{metric.sample}</p>}
        </div>
      ))}
    </div>
  );
}

export function EntityIdentity({
  name,
  meta,
  detail,
  badge,
  onOpen,
  size = 'sm',
}: {
  name: string;
  meta?: ReactNode;
  detail?: ReactNode;
  badge?: ReactNode;
  onOpen?: () => void;
  size?: 'sm' | 'md';
}) {
  const content = (
    <>
      <PlayerAvatar name={name} size={size} />
      <span className="min-w-0 flex-1 text-left">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-xs font-semibold text-zinc-100 sm:text-[13px]">{name}</span>
          {badge}
        </span>
        {meta && <span className="mt-0.5 block truncate text-[10px] text-zinc-500">{meta}</span>}
        {detail && <span className="mt-0.5 block truncate text-[10px] text-zinc-600">{detail}</span>}
      </span>
    </>
  );
  return onOpen ? (
    <button onClick={onOpen} className="flex min-w-0 items-center gap-2.5 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60">{content}</button>
  ) : <div className="flex min-w-0 items-center gap-2.5">{content}</div>;
}

export function StatusDelta({ value, label, tone = 'positive' }: { value: ReactNode; label: string; tone?: MetricTone }) {
  return (
    <span className={cn('inline-flex shrink-0 flex-col rounded-md bg-white/[0.025] px-2 py-1 text-right', toneClasses[tone])}>
      <span className="text-xs font-bold tabular-nums">{value}</span>
      <span className="text-[8px] font-medium text-zinc-600">{label}</span>
    </span>
  );
}

export function SegmentedControl<T extends string>({ value, options, onChange, label }: { value: T; options: readonly T[]; onChange: (value: T) => void; label: string }) {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto" role="group" aria-label={label}>
      {options.map((option) => (
        <button key={option} onClick={() => onChange(option)} onKeyDown={(event) => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const current = options.indexOf(option); const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : event.key === 'ArrowRight' ? (current + 1) % options.length : (current - 1 + options.length) % options.length; onChange(options[next]); (event.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus(); }} aria-pressed={value === option} className={cn('shrink-0 rounded-md border px-2.5 py-1.5 text-[10px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60', value === option ? 'border-teal-500/35 bg-teal-500/10 text-teal-300' : 'border-[var(--dashboard-border)] text-zinc-500 hover:text-zinc-200')}>
          {option}
        </button>
      ))}
    </div>
  );
}
