import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { SectionHeader } from '@/features/landing/components/SectionHeader'
import { Reveal } from '@/features/landing/hooks/Reveal'
import { sports } from '@/features/landing/data'
import { PlayerAvatar } from '@/features/dashboard/components/common'

function rateClass(value: number) {
  return value >= 50 ? 'border-pos/25 bg-pos/10 text-pos' : 'border-neg/25 bg-neg/10 text-neg'
}

export function SportsCoverage() {
  const [selectedId, setSelectedId] = useState(sports[0].id)
  const [displayedId, setDisplayedId] = useState(sports[0].id)
  const [flipPhase, setFlipPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const displayed = sports.find((sport) => sport.id === displayedId) ?? sports[0]
  const chartMax = Math.max(...displayed.chart, 1)
  const flipClass = flipPhase === 'out' ? 'sport-card-flip-out' : flipPhase === 'in' ? 'sport-card-flip-in' : ''

  useEffect(() => () => {
    if (swapTimer.current) clearTimeout(swapTimer.current)
    if (settleTimer.current) clearTimeout(settleTimer.current)
  }, [])

  const selectSport = (id: string) => {
    if (id === selectedId || flipPhase !== 'idle') return
    setSelectedId(id)
    setFlipPhase('out')
    swapTimer.current = setTimeout(() => {
      setDisplayedId(id)
      setFlipPhase('in')
      settleTimer.current = setTimeout(() => setFlipPhase('idle'), 320)
    }, 320)
  }

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const last = sports.length - 1
    let next = index
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = last
    selectSport(sports[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="sports" className="relative overflow-hidden border-t border-line bg-ink-900 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.07),transparent_65%)]" aria-hidden="true" />
      <div className="container-site relative">
        <SectionHeader
          eyebrow="12-Sport Coverage Map"
          title="Traditional Sports and Esports. One Research Language."
          copy="The current Arena Props experience spans 12 sport categories, with the same focused workflow adapting to each market, sample, and matchup context."
        />

        <Reveal delay={80} className="mt-10">
          <div role="tablist" aria-label="Sport research previews" className="no-scrollbar mx-auto flex max-w-4xl gap-2 overflow-x-auto rounded-xl border border-line bg-ink-950/80 p-2">
            {sports.map((sport, index) => {
              const active = sport.id === selectedId
              return (
                <button
                  key={sport.id}
                  ref={(node) => { tabRefs.current[index] = node }}
                  type="button"
                  role="tab"
                  id={`sport-tab-${sport.id}`}
                  aria-selected={active}
                  aria-controls="sport-preview-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectSport(sport.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={`min-h-11 min-w-[86px] flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all ${active ? 'bg-teal-400 text-ink-950 shadow-teal-soft' : 'text-mist-muted hover:bg-ink-800 hover:text-teal-200'}`}
                >
                  {sport.abbr}
                </button>
              )
            })}
          </div>
        </Reveal>

        <div id="sport-preview-panel" role="tabpanel" aria-labelledby={`sport-tab-${selectedId}`} className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal direction="left" className="sport-flip-stage min-w-0">
            <div className={`sport-flip-card flex h-full flex-col rounded-2xl border border-line bg-ink-850 p-6 shadow-card md:p-8 ${flipClass}`}>
              <div className="flex items-center justify-between">
                <span className="inline-flex h-14 min-w-16 items-center justify-center rounded-xl border border-teal-500/35 bg-teal-500/10 px-3 text-base font-extrabold tracking-wide text-teal-300">{displayed.abbr}</span>
                <span className="rounded-full border border-line bg-ink-950 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-mist-muted">Sample preview</span>
              </div>
              <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-300">{displayed.league}</p>
              <h3 className="mt-2 text-2xl font-extrabold text-mist">Built around {displayed.name.toLowerCase()} context.</h3>
              <p className="mt-4 text-sm leading-relaxed text-mist-muted">{displayed.summary}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {displayed.markets.map((market, index) => (
                  <span key={market} className={`rounded-md border px-3 py-2 text-xs font-semibold ${index === 0 ? 'border-teal-500/40 bg-teal-500/10 text-teal-300' : 'border-line bg-ink-950 text-mist-secondary'}`}>{market}</span>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <Link to={`/dashboard/props?sport=${displayed.abbr}`} className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-teal-500/35 bg-teal-500/10 px-6 text-sm font-semibold text-teal-200 transition hover:bg-teal-500/15 hover:text-white">
                  Explore {displayed.abbr} Props <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={80} className="sport-flip-stage min-w-0">
            <div className={`sport-flip-card relative overflow-hidden rounded-2xl border border-line bg-ink-950 p-3 shadow-card sm:p-5 ${flipClass}`}>
              <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(20,184,166,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} aria-hidden="true" />
              <div className="relative rounded-xl border border-line bg-ink-900/95 p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-4 border-b border-line pb-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <PlayerAvatar name={displayed.samplePlayer} size="md" />
                    <div>
                      <p className="text-sm font-bold text-mist">{displayed.samplePlayer}</p>
                      <p className="text-[11px] text-mist-muted">{displayed.sampleTeam}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded-md border border-teal-500/35 bg-teal-500/10 px-3 py-2 text-xs font-bold text-teal-300">{displayed.sampleLine}</span>
                    <span className="rounded-md border border-line bg-ink-850 px-3 py-2 text-xs font-semibold text-mist-secondary">{displayed.sampleAverage}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {['L5', 'L10', 'L15', 'Season'].map((label, index) => (
                    <div key={label} className={`rounded-lg border p-3 ${rateClass(displayed.hitRates[index])}`}>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.13em] opacity-75">{label}</p>
                      <p className="mt-1 text-lg font-extrabold">{displayed.hitRates[index]}%</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[1.35fr_0.8fr]">
                  <div className="rounded-lg border border-line bg-ink-950 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-mist">Recent results</p>
                      <span className="text-[10px] text-mist-muted">8 events</span>
                    </div>
                    <div className="mt-4 flex h-36 items-end gap-2 border-b border-line">
                      {displayed.chart.map((value, index) => (
                        <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center justify-end gap-1">
                          <span className="text-[8px] font-semibold text-mist-muted">{value}</span>
                          <span className={`w-full max-w-8 rounded-t-sm ${index % 3 === 0 ? 'bg-neg/70' : 'bg-pos/75'}`} style={{ height: `${Math.max(18, (value / chartMax) * 92)}px` }} />
                          <span className="text-[8px] text-mist-disabled">{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex-1 rounded-lg border border-line bg-ink-950 p-4">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-mist-muted">{displayed.contextLabel}</p>
                      <p className="mt-3 text-sm font-bold leading-relaxed text-mist">{displayed.contextValue}</p>
                    </div>
                    <div className="rounded-lg border border-teal-500/30 bg-teal-500/[0.055] p-4">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-teal-300">Workspace stays familiar</p>
                      <p className="mt-2 text-xs leading-relaxed text-mist-secondary">Markets and context change. The research flow does not.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-7 text-center">
          <p className="text-sm text-mist-muted">More sports can join this experience as production coverage is verified.</p>
        </Reveal>
      </div>
    </section>
  )
}
