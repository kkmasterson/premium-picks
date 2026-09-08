import { HeroDashboardStack } from '@/features/landing/components/HeroDashboardStack'
import { HeroRatingBadge } from '@/features/landing/components/HeroRatingBadge'
import { Reveal } from '@/features/landing/hooks/Reveal'
import { StatsStrip } from '@/features/landing/sections/StatsStrip'

const trustPoints = [
  { title: 'Feed-Ready Updates', detail: 'Odds, props + stats' },
  { title: '12 Sports + Esports', detail: 'One workspace' },
  { title: 'Full Research Stack', detail: 'Discovery → builder' },
]

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="rgba(45,212,191,0.12)" />
      <path d="m8 12.5 2.5 2.5L16 9.5" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Hero() {
  return (
    <section id="top" className="hero-stage texture-diagonal relative overflow-hidden">
      {/* Background effects */}
      <div className="hero-glow glow-drift pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="vignette pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-teal-400/40 to-transparent"
        aria-hidden="true"
      />

      <div className="hero-primary hero-shell relative grid grid-cols-1 items-center gap-10 pb-14 pt-14 md:pb-20 md:pt-20 lg:grid-cols-[480px_minmax(0,1fr)] lg:gap-16 lg:pb-40 lg:pt-8 xl:gap-20">
        {/* Copy */}
        <div className="hero-copy relative min-w-0">
          <Reveal>
            <p className="eyebrow rounded-full border border-teal-500/30 bg-teal-500/5 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" aria-hidden="true" />
              Built to Match the Category. Designed to Lead It.
            </p>
          </Reveal>

          <Reveal delay={40} className="hero-rating-placement">
            <HeroRatingBadge />
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-[42px] font-extrabold leading-[1.05] tracking-tight text-mist sm:text-6xl lg:text-[64px]">
              Your Complete Prop
              <br />
              Research <span className="gold-text">Arena</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist-secondary">
              Compare sportsbook lines, projections, hit rates, matchup context, discrepancies,
              and community momentum across traditional sports and esports—without stitching
              together multiple research tools.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#pricing" className="btn-primary px-8 text-base">
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </a>
              <a href="#product-tour" className="btn-secondary px-8 text-base">
                Tour the Platform
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <ul className="mt-7 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              {trustPoints.map((point) => (
                <li key={point.title} className="flex items-start gap-2.5 border-t border-line/80 pt-3 text-sm text-mist-secondary">
                  <CheckIcon />
                  <span>
                    <span className="block font-semibold text-mist">{point.title}</span>
                    <span className="mt-0.5 block text-[11px] text-mist-muted">{point.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Product visual */}
        <Reveal delay={200} direction="right" className="relative min-w-0">
          <div
            className="pointer-events-none absolute -inset-16 rounded-full opacity-70"
            style={{ background: 'radial-gradient(ellipse at center, rgba(45,212,191,0.12), transparent 66%)' }}
            aria-hidden="true"
          />
          <HeroDashboardStack />
        </Reveal>
      </div>
      <StatsStrip />
    </section>
  )
}
