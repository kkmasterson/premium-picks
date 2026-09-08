import { useState } from 'react'
import { BarChart3, ChevronDown, ListPlus, Search, SlidersHorizontal } from 'lucide-react'
import { PlayerAvatar } from '@/features/dashboard/components/common'
import { SportsbookLogo } from '@/features/dashboard/components/SportsbookLogo'
import { propRows } from '@/features/landing/data'

const fullNames: Record<string, string> = {
  'J. Brunson': 'Jalen Brunson',
  'T. Haliburton': 'Tyrese Haliburton',
  'A. Davis': 'Anthony Davis',
  'S. Gilgeous-Alexander': 'Shai Gilgeous-Alexander',
  'J. Tatum': 'Jayson Tatum',
  'N. Jokic': 'Nikola Jokic',
}

function rateTone(value: number) {
  return value >= 50
    ? 'border-[#66ff33]/20 bg-[#66ff33]/[0.10] text-[#66ff33] shadow-[inset_0_-2px_0_rgba(102,255,51,0.68)]'
    : 'border-[#ff5252]/20 bg-[#ff5252]/[0.10] text-[#ff5252] shadow-[inset_0_-2px_0_rgba(255,82,82,0.68)]'
}

function SportNav() {
  return (
    <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
      {['All', 'NBA', 'NFL', 'MLB', 'NHL', 'WNBA'].map((sport) => (
        <span
          key={sport}
          className={`relative shrink-0 px-2.5 py-2 text-[9px] font-semibold ${sport === 'NBA' ? 'text-teal-300 after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-teal-400' : 'text-zinc-500'}`}
        >
          {sport}
        </span>
      ))}
    </div>
  )
}

function FilterButton({ active = false, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-[9px] font-semibold ${active ? 'border-teal-500/35 bg-teal-500/10 text-teal-300' : 'border-white/[0.08] bg-[#111515] text-zinc-500'}`}>
      {children}<ChevronDown className="h-3 w-3" />
    </span>
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
    <div data-demo-source="landing-static" className="w-full min-w-0 overflow-hidden rounded-xl border border-white/[0.07] bg-[#0d1010] text-left shadow-card">
      <div className="flex h-11 items-center gap-3 border-b border-white/[0.07] bg-[#080909] px-3">
        <div className="flex shrink-0 items-center gap-2">
          <img src="/logo.png" alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
          <span className="hidden text-[10px] font-bold text-white sm:block">Arena <span className="text-gold">Props</span><small className="mt-0.5 block text-[5px] font-medium uppercase tracking-[0.18em] text-zinc-600">Premium Picks</small></span>
        </div>
        <SportNav />
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-400 text-[8px] font-bold text-ink-950">JD</span>
      </div>

      <div className="border-b border-white/[0.055] bg-[#0d1010] p-2.5">
        <div className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#111515] px-3 text-[10px] text-zinc-600">
          <Search className="h-3.5 w-3.5" />
          Search players, teams, games, or props…
        </div>
        <div className="no-scrollbar mt-2 flex items-center gap-1.5 overflow-x-auto">
          <FilterButton>Game</FilterButton>
          <button type="button" aria-label={`Market: ${pointsOnly ? 'Points' : 'All'}`} aria-pressed={pointsOnly} onClick={togglePoints} className="contents"><FilterButton active={pointsOnly}>Prop: {pointsOnly ? 'Points' : 'All'}</FilterButton></button>
          <FilterButton>Sportsbooks</FilterButton>
          <FilterButton>Line Type</FilterButton>
          <button type="button" aria-pressed={highHitRate} onClick={toggleHitRate} className="contents"><FilterButton active={highHitRate}>Hit Rate: {highHitRate ? '60%+' : 'All'}</FilterButton></button>
          <span className="ml-auto inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-white/[0.08] px-2.5 text-[9px] font-semibold text-zinc-400"><SlidersHorizontal className="h-3 w-3" />More</span>
          <span className="shrink-0 text-[8px] text-zinc-600">{rows.length} props</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full border-collapse text-[9px] ${compact ? 'min-w-[650px]' : 'min-w-[760px]'}`}>
          <thead>
            <tr className="border-b border-white/[0.055] bg-[#0b0d0d] text-[7px] uppercase tracking-[0.12em] text-zinc-600">
              <th className="px-3 py-2 text-left font-semibold">Player · Prop</th>
              <th className="px-2 py-2 text-left font-semibold">Book · Line · Odds</th>
              <th className="px-2 py-2 text-center font-semibold">Projection</th>
              <th className="px-2 py-2 text-center font-semibold">Confidence</th>
              <th className="px-2 py-2 text-center font-semibold">L5</th>
              <th className="px-2 py-2 text-center font-semibold">L10</th>
              {!compact && <th className="px-2 py-2 text-center font-semibold">H2H</th>}
              <th className="px-2 py-2 text-center font-semibold">Builder</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const projection = Number(row.avg)
              const line = Number(row.line)
              const difference = projection - line
              const confidence = Math.round((row.l5 + row.l10 + row.season) / 3)
              return (
                <tr key={row.player} className={`border-b border-white/[0.045] last:border-0 ${index % 2 ? 'bg-[#121515]' : 'bg-[#0d1010]'}`}>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <PlayerAvatar name={fullNames[row.player] ?? row.player} size="xs" />
                      <span className="min-w-0"><strong className="block truncate text-[10px] text-zinc-100">{fullNames[row.player] ?? row.player}</strong><small className="block truncate text-[7px] text-zinc-600">{row.team} · {row.position} · {row.prop}</small></span>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1.5"><SportsbookLogo shortName="DK" compact /><span className="text-zinc-300">{row.line}</span><span className="rounded border border-[#66ff33]/35 bg-[#66ff33]/[0.10] px-1.5 py-1 font-semibold text-[#66ff33]">O {row.odds}</span><span className="rounded border border-[#ff5252]/25 bg-[#ff5252]/[0.08] px-1.5 py-1 text-[#ff7a7a]">U -105</span></div>
                  </td>
                  <td className="px-2 py-2 text-center"><strong className="text-[10px] text-zinc-100">{row.avg}</strong><small className={`ml-1 ${difference >= 0 ? 'text-[#66ff33]' : 'text-[#ff5252]'}`}>{difference >= 0 ? '+' : ''}{difference.toFixed(1)}</small></td>
                  <td className={`border-l border-white/[0.04] px-2 py-2 text-center ${rateTone(confidence)}`}><strong>{confidence}</strong><small className="ml-1 opacity-55">{confidence >= 60 ? 'MOD' : 'LOW'}</small></td>
                  <td className={`border-l border-white/[0.04] px-2 py-2 text-center font-bold ${rateTone(row.l5)}`}>{row.l5}%</td>
                  <td className={`border-l border-white/[0.04] px-2 py-2 text-center font-bold ${rateTone(row.l10)}`}>{row.l10}%</td>
                  {!compact && <td className={`border-l border-white/[0.04] px-2 py-2 text-center font-bold ${rateTone(row.season)}`}>{row.season}%</td>}
                  <td className="px-2 py-2 text-center"><span className="inline-grid h-7 w-7 place-items-center rounded-md border border-teal-500/25 bg-teal-500/[0.08] text-teal-300"><ListPlus className="h-3.5 w-3.5" /></span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.055] bg-[#0b0d0d] px-3 py-2">
        <span className="text-[9px] text-zinc-600">{rows.length} matching results · Preview data</span>
        <span className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-teal-300"><BarChart3 className="h-3 w-3" />Fixed Mock Data · No live connection</span>
      </div>
    </div>
  )
}
