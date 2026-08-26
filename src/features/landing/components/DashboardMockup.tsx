import { useState } from 'react'
import { propRows } from '@/features/landing/data'

function hitClass(v: number) {
  if (v >= 70) return 'bg-pos/15 text-pos'
  if (v >= 50) return 'bg-gold/10 text-gold'
  return 'bg-neg/10 text-neg'
}

function SportPills() {
  const pills = ['NBA', 'NFL', 'MLB', 'NHL', 'WNBA']
  return (
    <div className="flex items-center gap-1.5 overflow-hidden">
      {pills.map((p, i) => (
        <span
          key={p}
          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
            i === 0 ? 'bg-gold text-ink-950' : 'bg-ink-700 text-mist-secondary'
          }`}
        >
          {p}
        </span>
      ))}
    </div>
  )
}

export function DashboardMockup({ compact = false, onInteraction }: { compact?: boolean; onInteraction?: () => void }) {
  const [pointsOnly, setPointsOnly] = useState(false)
  const [highHitRate, setHighHitRate] = useState(false)
  const baseRows = compact ? propRows.slice(0, 4) : propRows
  const rows = baseRows.filter((row) => (!pointsOnly || row.prop === 'Points') && (!highHitRate || row.l10 >= 60))

  const togglePoints = () => {
    setPointsOnly((value) => !value)
    onInteraction?.()
  }

  const toggleHitRate = () => {
    setHighHitRate((value) => !value)
    onInteraction?.()
  }
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-line bg-ink-900 text-left shadow-card">
      {/* App top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-ink-850 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-mist">
            Premium <span className="text-gold">Picks</span>
          </span>
        </div>
        <SportPills />
        <span className="hidden rounded-md border border-line px-2.5 py-1 text-[11px] text-mist-muted sm:block">
          Props
        </span>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
        <div className="flex min-w-[160px] flex-1 items-center gap-2 rounded-md border border-line bg-ink-950 px-3 py-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8E8E8E" strokeWidth="2.4" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="text-xs text-mist-muted">Search players, teams, props…</span>
        </div>
        <button
          type="button"
          aria-pressed={pointsOnly}
          onClick={togglePoints}
          className={`hidden rounded-md border px-2.5 py-1.5 text-[11px] transition-colors md:block ${pointsOnly ? 'border-gold/45 bg-gold/10 text-gold' : 'border-line bg-ink-800 text-mist-secondary hover:border-gold/30'}`}
        >
          Market: {pointsOnly ? 'Points' : 'All'}
        </button>
        <span className="hidden rounded-md border border-line bg-ink-800 px-2.5 py-1.5 text-[11px] text-mist-secondary md:block">Odds: demo range</span>
        <button
          type="button"
          aria-pressed={highHitRate}
          onClick={toggleHitRate}
          className={`hidden rounded-md border px-2.5 py-1.5 text-[11px] transition-colors md:block ${highHitRate ? 'border-gold/45 bg-gold/10 text-gold' : 'border-line bg-ink-800 text-mist-secondary hover:border-gold/30'}`}
        >
          Hit Rate: {highHitRate ? '60%+' : 'All'}
        </button>
        <span className="hidden items-center gap-1 rounded-md border border-gold/40 bg-gold/10 px-2.5 py-1.5 text-[11px] font-medium text-gold md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Demo Lines
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse text-xs ${compact ? 'min-w-[500px]' : 'min-w-[560px]'}`}>
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-[0.14em] text-mist-muted">
              <th className="px-4 py-2.5 text-left font-medium">Player</th>
              <th className="px-2 py-2.5 text-left font-medium">Prop</th>
              <th className="px-2 py-2.5 text-right font-medium">Line</th>
              <th className="px-2 py-2.5 text-right font-medium">Odds</th>
              <th className="px-2 py-2.5 text-right font-medium">Avg</th>
              <th className="px-2 py-2.5 text-center font-medium">L5</th>
              <th className="px-2 py-2.5 text-center font-medium">L10</th>
              {!compact && <th className="px-2 py-2.5 text-center font-medium">L15</th>}
              <th className="px-4 py-2.5 text-center font-medium">Season</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.player} className="border-b border-line/60 last:border-0 hover:bg-ink-800/60">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-ink-700 text-[10px] font-bold text-gold">
                      {r.player.split(' ').map((n) => n[0]).join('').replace('.', '')}
                    </span>
                    <span>
                      <span className="block font-semibold text-mist">{r.player}</span>
                      <span className="block text-[10px] text-mist-muted">
                        {r.team} · {r.position}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2.5 text-mist-secondary">{r.prop}</td>
                <td className="px-2 py-2.5 text-right font-semibold text-mist">{r.line}</td>
                <td className="px-2 py-2.5 text-right text-mist-secondary">{r.odds}</td>
                <td className="px-2 py-2.5 text-right text-mist-secondary">{r.avg}</td>
                <td className="px-2 py-2.5 text-center">
                  <span className={`inline-block min-w-[40px] rounded px-1.5 py-0.5 font-semibold ${hitClass(r.l5)}`}>
                    {r.l5}%
                  </span>
                </td>
                <td className="px-2 py-2.5 text-center">
                  <span className={`inline-block min-w-[40px] rounded px-1.5 py-0.5 font-semibold ${hitClass(r.l10)}`}>
                    {r.l10}%
                  </span>
                </td>
                {!compact && (
                  <td className="px-2 py-2.5 text-center">
                    <span className={`inline-block min-w-[40px] rounded px-1.5 py-0.5 font-semibold ${hitClass(r.l15)}`}>
                      {r.l15}%
                    </span>
                  </td>
                )}
                <td className="px-4 py-2.5 text-center">
                  <span className={`inline-block min-w-[40px] rounded px-1.5 py-0.5 font-semibold ${hitClass(r.season)}`}>
                    {r.season}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer strip */}
      <div className="flex items-center justify-between border-t border-line bg-ink-850 px-4 py-2">
        <span className="text-[10px] text-mist-muted">{rows.length} fixed demo results · No live connection</span>
        <span className="flex items-center gap-1 text-[10px] font-medium text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Mock Data
        </span>
      </div>
    </div>
  )
}
