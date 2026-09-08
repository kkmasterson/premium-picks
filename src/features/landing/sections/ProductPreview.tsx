import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { SectionHeader } from '@/features/landing/components/SectionHeader'
import { TourPreview } from '@/features/landing/components/TourPreview'
import { productTourItems, type ProductTourId } from '@/features/landing/data'
import { Reveal } from '@/features/landing/hooks/Reveal'

const icons: Record<ProductTourId, ReactNode> = {
  props: <><path d="M4 7h16M4 12h10M4 17h13" /><circle cx="18" cy="12" r="2" /></>,
  player: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
  trends: <><path d="m4 17 5-5 4 3 7-8" /><path d="M15 7h5v5" /></>,
  matchups: <><path d="M8 3 4 7l4 4M16 21l4-4-4-4" /><path d="M4 7h10a6 6 0 0 1 6 6v4M20 17H10a6 6 0 0 1-6-6V7" /></>,
}

export function ProductPreview() {
  const [activeId, setActiveId] = useState<ProductTourId>('props')
  const [completed, setCompleted] = useState<Set<ProductTourId>>(() => new Set())
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const active = productTourItems.find((item) => item.id === activeId) ?? productTourItems[0]

  const markInteracted = (id: ProductTourId) => {
    setCompleted((current) => {
      if (current.has(id)) return current
      const next = new Set(current)
      next.add(id)
      return next
    })
  }

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const last = productTourItems.length - 1
    let next = index
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = last
    const nextItem = productTourItems[next]
    setActiveId(nextItem.id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="product-tour" className="relative overflow-hidden py-20 md:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-16 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-60"
        style={{ background: 'radial-gradient(ellipse at center, rgba(20,184,166,0.09), transparent 65%)' }}
        aria-hidden="true"
      />
      <div className="container-site relative">
        <SectionHeader
          eyebrow="Interactive Product Tour"
          title="Explore the Research Before You Sign Up"
          copy="Choose a research view to see how Arena Props keeps the market, player, trend, and matchup connected."
        />

        <div className="mt-14 grid min-w-0 items-start gap-6 lg:grid-cols-[330px_minmax(0,1fr)] lg:gap-8">
          <Reveal direction="left" className="min-w-0">
            <div className="min-w-0 lg:sticky lg:top-28">
              <div
                role="tablist"
                aria-label="Arena Props product views"
                className="no-scrollbar flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible"
              >
                {productTourItems.map((item, index) => {
                  const selected = item.id === activeId
                  const isComplete = completed.has(item.id)
                  return (
                    <button
                      key={item.id}
                      ref={(node) => { tabRefs.current[index] = node }}
                      type="button"
                      role="tab"
                      id={`tour-tab-${item.id}`}
                      aria-label={`${item.step}. ${item.label}`}
                      aria-selected={selected}
                      aria-controls="tour-preview-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActiveId(item.id)}
                      onKeyDown={(event) => onTabKeyDown(event, index)}
                      className={`group min-w-[220px] rounded-xl border p-4 text-left transition-all duration-200 lg:min-w-0 ${selected ? 'border-teal-500/40 bg-teal-500/10 shadow-teal-soft' : 'border-line bg-ink-850 hover:border-teal-500/30 hover:bg-ink-800'}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${selected ? 'border-teal-400/40 bg-teal-400 text-ink-950' : 'border-line bg-ink-950 text-mist-muted group-hover:text-teal-300'}`}>
                          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[item.id]}</svg>
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-teal-300">
                            {item.step}
                            {isComplete && <span aria-label="Preview step tried" className="text-pos">✓ Tried</span>}
                            {selected && !isComplete && <span className="text-mist-muted">Try it →</span>}
                          </span>
                          <span className="mt-0.5 block text-sm font-bold text-mist">{item.label}</span>
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-5 min-w-0 overflow-hidden rounded-xl border border-line bg-ink-850 p-5" aria-live="polite">
                <p className="text-lg font-bold leading-snug text-mist">{active.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-mist-muted">{active.description}</p>
                <p className="mt-4 border-t border-line pt-4 text-xs font-semibold leading-relaxed text-teal-300">{active.proof}</p>
                <Link to={active.route} className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-teal-500/35 bg-teal-500/10 px-6 text-sm font-semibold text-teal-200 transition hover:bg-teal-500/15 hover:text-white">
                  {active.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} direction="right" className="min-w-0">
            <div
              id="tour-preview-panel"
              role="tabpanel"
              aria-labelledby={`tour-tab-${active.id}`}
              className="tour-preview-swap"
              key={active.id}
            >
              <TourPreview view={active.id} onInteraction={() => markInteracted(active.id)} />
            </div>
          </Reveal>
        </div>

        <Reveal delay={160} className="mt-8 text-center">
          <p className="text-sm text-mist-muted">
            This tour uses a fixed landing-page mock dataset. It is not connected to live dashboards,
            accounts, APIs, sportsbook feeds, or real user data.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
