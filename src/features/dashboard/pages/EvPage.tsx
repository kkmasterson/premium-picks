import { useEffect, useMemo, useState } from 'react';
import { Info, LockKeyhole, Sparkles } from 'lucide-react';
import type { HitRate } from '@arena/contracts';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { SportsbookLogo } from '@/features/dashboard/components/SportsbookLogo';
import { PROP_BOARD_ROWS, metricsFor, offerFor } from '@/features/dashboard/props-fixtures';
import { LIVE_DEMO_REFRESH_MS, liveDemoRowsAt } from '@/features/dashboard/live-demo';

function oddsLabel(value: number | null) {
  if (value === null) return 'Unavailable';
  return value > 0 ? `+${value}` : String(value);
}

function profitMultiplier(odds: number | null) {
  if (odds === null) return 0;
  return odds > 0 ? odds / 100 : 100 / Math.abs(odds);
}

function RateEvidence({ label, rate }: { label: string; rate: HitRate }) {
  const tone = rate.pct >= 70 ? 'text-emerald-300' : rate.pct >= 50 ? 'text-amber-300' : 'text-red-300';
  return <div className="min-w-0 border-l border-white/[0.06] pl-3 first:border-l-0 first:pl-0">
    <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-zinc-600">{label}</p>
    <p className={`mt-1 text-sm font-bold tabular-nums ${tone}`}>{rate.pct}%</p>
    <p className="text-[9px] tabular-nums text-zinc-600">{rate.hits}/{rate.total} hits</p>
  </div>;
}

function EvidenceValue({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="min-w-0 border-l border-white/[0.06] pl-3 first:border-l-0 first:pl-0">
    <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-zinc-600">{label}</p>
    <p className="mt-1 truncate text-sm font-bold tabular-nums text-zinc-100">{value}</p>
    <p className="truncate text-[9px] text-zinc-600">{detail}</p>
  </div>;
}

export function EvPage() {
  const [demoNow, setDemoNow] = useState(() => Date.now());
  const { accessTier } = useDashboard();

  useEffect(() => {
    const interval = window.setInterval(() => setDemoNow(Date.now()), LIVE_DEMO_REFRESH_MS);
    return () => window.clearInterval(interval);
  }, []);

  const demoRows = useMemo(() => liveDemoRowsAt(demoNow, PROP_BOARD_ROWS), [demoNow]);

  if (accessTier === 'tier1') {
    return <div className="mx-auto max-w-xl rounded-2xl border border-amber-500/25 bg-amber-500/5 p-8 text-center">
      <LockKeyhole className="mx-auto h-9 w-9 text-amber-300" />
      <h1 className="mt-4 text-xl font-bold text-white">+EV tools are included with Tier 2</h1>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">Tier 1 can see when a positive-EV signal is detected, but Arena Props does not send EV percentages, implied probability, fair odds, edge calculations, sorting, or filters to Tier 1 clients.</p>
      <button disabled className="mt-6 rounded-lg border border-amber-500/30 px-4 py-2 text-xs font-semibold text-amber-300 opacity-70">Pricing available at launch</button>
    </div>;
  }

  const rows = demoRows.flatMap((row) => {
    const offer = offerFor(row);
    return (['over', 'under'] as const).flatMap((side) => {
      const details = offer.ev[side].details;
      if (!details || details.evPercent <= 0) return [];
      return [{
        row,
        offer,
        side,
        details,
        odds: side === 'over' ? offer.overOdds : offer.underOdds,
        metrics: metricsFor(row, offer.line)[side],
      }];
    });
  }).sort((a, b) => b.details.evPercent - a.details.evPercent).slice(0, 20);

  return <div className="space-y-3">
    <div>
      <h1 className="flex items-center gap-2 text-lg font-bold text-white"><Sparkles className="h-5 w-5 text-amber-300" />+EV research</h1>
      <p className="text-xs text-zinc-500">Interactive demo preview · every result includes its supporting inputs and calculation · no sportsbook/API connection.</p>
    </div>

    {rows.map(({ row, offer, side, details, odds, metrics }) => {
      const fairPercent = details.fairProbability * 100;
      const impliedPercent = details.impliedProbability * 100;
      const probabilityEdge = details.edge * 100;
      const profit = profitMultiplier(odds);
      const losingProbability = (1 - details.fairProbability) * 100;

      return <article key={`${row.id}:${side}`} className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#101111] shadow-[0_8px_28px_rgba(0,0,0,0.16)]">
        <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <SportsbookLogo shortName={offer.providerShortName} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{row.playerName} · {side === 'over' ? 'Over' : 'Under'} {offer.line}</p>
              <p className="mt-0.5 truncate text-[10px] text-zinc-500">{row.market} · {offer.providerName} {oddsLabel(odds)} · {row.team} vs {row.opponent}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold tabular-nums text-emerald-300">+{details.evPercent}%</p>
            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-zinc-600">Expected value</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-3 border-y border-white/[0.055] bg-white/[0.012] px-4 py-3 sm:grid-cols-4 lg:grid-cols-9">
          <EvidenceValue label="Book price" value={oddsLabel(odds)} detail={`${profit.toFixed(2)}x profit`} />
          <EvidenceValue label="Implied" value={`${impliedPercent.toFixed(1)}%`} detail="From book odds" />
          <EvidenceValue label="Demo model" value={`${fairPercent.toFixed(1)}%`} detail={`Fair ${oddsLabel(details.fairOdds)}`} />
          <EvidenceValue label="Probability edge" value={`${probabilityEdge >= 0 ? '+' : ''}${probabilityEdge.toFixed(1)} pts`} detail="Model minus implied" />
          <EvidenceValue label="Projection" value={metrics.projection === null ? '—' : String(metrics.projection)} detail={`Line ${offer.line} · ${metrics.edge !== null && metrics.edge >= 0 ? '+' : ''}${metrics.edge ?? '—'} edge`} />
          <RateEvidence label="L5" rate={metrics.l5} />
          <RateEvidence label="L10" rate={metrics.l10} />
          <RateEvidence label="L15" rate={metrics.l15} />
          <RateEvidence label="H2H" rate={metrics.h2h} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
          <p className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <Info className="h-3 w-3 shrink-0 text-teal-400" />
            <span className="font-medium text-zinc-300">EV calculation:</span>
            <span className="tabular-nums">({fairPercent.toFixed(1)}% × {profit.toFixed(2)} profit) − {losingProbability.toFixed(1)}% loss = <strong className="text-emerald-300">+{details.evPercent}%</strong></span>
          </p>
          <p className="text-[8px] text-zinc-700">{details.modelVersion} · demo inputs</p>
        </div>
      </article>;
    })}
  </div>;
}
