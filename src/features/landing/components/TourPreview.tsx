import { useState, type ReactNode } from 'react'
import { DashboardMockup } from '@/features/landing/components/DashboardMockup'
import { PlayerAvatar } from '@/features/dashboard/components/common'
import { TeamBadge } from '@/features/dashboard/components/EntityMedia'
import type { ProductTourId } from '@/features/landing/data'

const performance = [24, 31, 29, 22, 35, 33, 26, 30] as const
const samples = ['L5', 'L10', 'L15', 'Season'] as const
type Sample = (typeof samples)[number]

const sampleData: Record<Sample, { rate: string; games: number; over: number }> = {
  L5: { rate: '80%', games: 5, over: 4 },
  L10: { rate: '70%', games: 8, over: 5 },
  L15: { rate: '73%', games: 8, over: 6 },
  Season: { rate: '66%', games: 8, over: 5 },
}

const opponents = [
  { team: 'BOS', name: 'Boston', rank: '4th vs PG', meetings: '3 games', average: '30.7', rate: '67%', note: 'Boston ranks 4th in this fixed opponent sample.' },
  { team: 'MIA', name: 'Miami', rank: '11th vs PG', meetings: '4 games', average: '28.1', rate: '50%', note: 'Miami shows the closest result to the selected 27.5 line.' },
  { team: 'CHI', name: 'Chicago', rank: '27th vs PG', meetings: '3 games', average: '34.3', rate: '100%', note: 'Chicago has the highest hit rate in this fixed three-team sample.' },
] as const

function PreviewShell({ children, path }: { children: ReactNode; path: string }) {
  return (
    <div data-preview-source="landing-static" className="overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900 shadow-card">
      <div className="flex items-center gap-2 border-b border-white/[0.07] bg-ink-950 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-teal-500/70" />
        <div className="ml-2 min-w-0 flex-1 truncate rounded-md border border-white/[0.07] bg-ink-900 px-3 py-1.5 text-[11px] text-zinc-600">
          Arena Props / {path}
        </div>
        <span className="hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-300 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          Fixed Mock Data · No live connection
        </span>
      </div>
      <div className="min-h-[390px] p-3 sm:p-5">{children}</div>
    </div>
  )
}

function PlayerPreview({ onInteraction }: { onInteraction?: () => void }) {
  const [activeSample, setActiveSample] = useState<Sample>('L10')
  const selected = sampleData[activeSample]
  const chartValues = performance.slice(-Math.min(selected.games, performance.length))

  const selectSample = (sample: Sample) => {
    setActiveSample(sample)
    onInteraction?.()
  }

  return (
    <PreviewShell path="players/mock-jalen-brunson">
      <div className="rounded-xl border border-white/[0.065] bg-ink-900 p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <PlayerAvatar name="Jalen Brunson" size="lg" />
            <div>
              <p className="text-base font-bold text-mist">Jalen Brunson</p>
              <p className="text-xs text-mist-muted">NYK · PG · Player research profile</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="rounded-md border border-teal-500/35 bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-300">Points 27.5</span>
            <span className="rounded-md border border-line bg-ink-850 px-3 py-2 text-xs font-semibold text-mist-secondary">Full game</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Select a fixed player sample">
          {samples.map((sample) => {
            const isSelected = sample === activeSample
            return (
              <button
                key={sample}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectSample(sample)}
                className={`rounded-lg border p-3 text-left transition-colors ${isSelected ? 'border-teal-500/40 bg-teal-500/10' : 'border-line bg-ink-950 hover:border-teal-500/30'}`}
              >
                <span className={`block text-[9px] uppercase tracking-[0.14em] ${isSelected ? 'text-teal-300' : 'text-mist-muted'}`}>{sample}</span>
                <span className="mt-1 block text-lg font-extrabold text-pos">{sampleData[sample].rate}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_0.8fr]">
          <div className="rounded-lg border border-line bg-ink-950 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-mist">{activeSample} performance</span>
              <span className="rounded border border-teal-500/40 bg-teal-500/10 px-2 py-1 font-semibold text-teal-300">Line 27.5</span>
            </div>
            <div className="relative mt-4 flex h-36 items-end gap-2 border-b border-line">
              <span className="absolute inset-x-0 bottom-[68%] border-t border-dashed border-teal-400/55" aria-hidden="true" />
              {chartValues.map((value, index) => (
                <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-[9px] font-semibold text-mist-muted">{value}</span>
                  <span className={`w-full max-w-8 rounded-t-sm ${value > 27.5 ? 'bg-pos/80' : 'bg-neg/70'}`} style={{ height: `${value * 2.4}px` }} />
                  <span className="text-[8px] text-mist-disabled">G{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg border border-line bg-ink-950 p-4">
              <p className="text-[9px] uppercase tracking-[0.14em] text-mist-muted">Selected sample</p>
              <p className="mt-2 text-sm font-bold text-mist">{activeSample} · {selected.rate} hit rate</p>
              <p className="mt-1 text-xs text-mist-muted">{selected.over} of {selected.games} matching results</p>
            </div>
            <div className="rounded-lg border border-teal-500/25 bg-teal-500/[0.055] p-4">
              <p className="text-[9px] uppercase tracking-[0.14em] text-teal-300">Mock research</p>
              <p className="mt-2 text-sm font-bold text-mist">Points · Over 27.5</p>
              <p className="mt-1 text-xs text-mist-muted">No account or dashboard data</p>
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  )
}

function TrendsPreview({ onInteraction }: { onInteraction?: () => void }) {
  const [activeSample, setActiveSample] = useState<Sample>('L10')
  const selected = sampleData[activeSample]
  const chartValues = performance.slice(-Math.min(selected.games, performance.length))

  const selectSample = (sample: Sample) => {
    setActiveSample(sample)
    onInteraction?.()
  }

  return (
    <PreviewShell path="trends/mock-sample">
      <div className="rounded-xl border border-line bg-ink-900 p-4 sm:p-5">
        <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-300">Mock trend explorer</p>
            <h3 className="mt-1 text-lg font-bold text-mist">Jalen Brunson · Points</h3>
            <p className="text-xs text-mist-muted">Recent results against the selected line</p>
          </div>
          <div className="flex gap-2" aria-label="Select a fixed trend sample">
            {samples.map((sample) => {
              const isSelected = sample === activeSample
              return (
                <button
                  key={sample}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => selectSample(sample)}
                  className={`rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${isSelected ? 'border-teal-500/40 bg-teal-500/10 text-teal-300' : 'border-line bg-ink-850 text-mist-muted hover:border-teal-500/30'}`}
                >
                  {sample}
                </button>
              )
            })}
          </div>
        </div>
        <div className="mt-5 rounded-lg border border-line bg-ink-950 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-mist">{activeSample} fixed sample</span>
            <span className="text-xs font-bold text-pos">{selected.over} of {selected.games} over · {selected.rate}</span>
          </div>
          <div className="relative mt-5 flex h-52 items-end gap-3 border-b border-line">
            <div className="absolute inset-x-0 bottom-[64%] flex items-center border-t border-dashed border-teal-400/60">
              <span className="ml-auto -translate-y-3 rounded border border-teal-400/40 bg-teal-500/15 px-2 py-0.5 text-[9px] font-bold text-teal-200">27.5 line</span>
            </div>
            {chartValues.map((value, index) => (
              <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center justify-end gap-1.5">
                <span className={`text-[10px] font-bold ${value > 27.5 ? 'text-pos' : 'text-neg'}`}>{value}</span>
                <span className={`w-full max-w-12 rounded-t-md ${value > 27.5 ? 'bg-gradient-to-t from-pos/30 to-pos' : 'bg-gradient-to-t from-neg/30 to-neg'}`} style={{ height: `${value * 4}px` }} />
                <span className="text-[9px] text-mist-disabled">G{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PreviewShell>
  )
}

function MatchupsPreview({ onInteraction }: { onInteraction?: () => void }) {
  const [selectedTeam, setSelectedTeam] = useState<(typeof opponents)[number]['team']>('BOS')
  const selected = opponents.find((item) => item.team === selectedTeam) ?? opponents[0]

  const selectOpponent = (team: (typeof opponents)[number]['team']) => {
    setSelectedTeam(team)
    onInteraction?.()
  }

  return (
    <PreviewShell path="matchups/mock-sample">
      <div className="rounded-xl border border-line bg-ink-900 p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-300">Mock matchup context</p>
            <h3 className="mt-1 text-lg font-bold text-mist">Jalen Brunson vs {selected.name}</h3>
          </div>
          <span className="hidden rounded-md border border-line bg-ink-950 px-3 py-2 text-xs font-semibold text-mist-secondary sm:block">Selected event</span>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="overflow-hidden rounded-lg border border-line bg-ink-950">
            <div className="grid grid-cols-[0.6fr_1.2fr_0.8fr_0.6fr] border-b border-line px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-mist-muted">
              <span>Opponent</span><span>Position defense</span><span>Average</span><span>Hit rate</span>
            </div>
            {opponents.map((item) => {
              const isSelected = item.team === selectedTeam
              return (
                <button
                  key={item.team}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`Use ${item.name} mock matchup`}
                  onClick={() => selectOpponent(item.team)}
                  className={`grid w-full grid-cols-[0.6fr_1.2fr_0.8fr_0.6fr] items-center border-b border-line/60 px-4 py-4 text-left text-xs transition-colors last:border-0 ${isSelected ? 'bg-teal-500/10 shadow-[inset_2px_0_0_#14b8a6]' : 'hover:bg-ink-850'}`}
                >
                  <span className="flex items-center gap-2 font-extrabold text-zinc-200"><TeamBadge team={item.team} sport="NBA" className="h-7 w-7" />{item.team}</span>
                  <span className="font-semibold text-mist">{item.rank}<small className="mt-0.5 block font-normal text-mist-muted">{item.meetings}</small></span>
                  <span className="font-bold text-mist-secondary">{item.average}</span>
                  <span className="font-extrabold text-pos">{item.rate}</span>
                </button>
              )
            })}
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-line bg-ink-950 p-4">
              <p className="text-[9px] uppercase tracking-[0.14em] text-mist-muted">Selected mock matchup</p>
              <div className="mt-4 flex items-center justify-between">
                <TeamBadge team="NYK" sport="NBA" className="h-11 w-11" />
                <span className="text-xs font-semibold text-mist-muted">at</span>
                <TeamBadge team={selected.team} sport="NBA" className="h-11 w-11" />
              </div>
            </div>
            <div className="rounded-lg border border-teal-500/25 bg-teal-500/[0.055] p-4">
              <p className="text-[9px] uppercase tracking-[0.14em] text-teal-300">Mock research note</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-mist">{selected.note}</p>
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  )
}

export function TourPreview({ view, onInteraction }: { view: ProductTourId; onInteraction?: () => void }) {
  if (view === 'player') return <PlayerPreview onInteraction={onInteraction} />
  if (view === 'trends') return <TrendsPreview onInteraction={onInteraction} />
  if (view === 'matchups') return <MatchupsPreview onInteraction={onInteraction} />
  return (
    <PreviewShell path="props/mock-sample">
      <DashboardMockup onInteraction={onInteraction} />
    </PreviewShell>
  )
}
