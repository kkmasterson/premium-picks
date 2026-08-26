import { HeroDashboardStack } from '@/features/landing/components/HeroDashboardStack'
import { HeroRatingBadge } from '@/features/landing/components/HeroRatingBadge'
import { Reveal } from '@/features/landing/hooks/Reveal'
import { StatsStrip } from '@/features/landing/sections/StatsStrip'

const trustPoints = ['Real-Time Data', 'Multi-Sport Coverage', 'Advanced Research Tools']

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="rgba(245,197,66,0.12)" />
      <path d="m8 12.5 2.5 2.5L16 9.5" stroke="#F5C542" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
        className="pointer-events-none absolute -top-24 left-1/2 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        aria-hidden="true"
      />

      <div className="hero-primary hero-shell relative grid grid-cols-1 items-center gap-10 pb-14 pt-14 md:pb-20 md:pt-20 lg:grid-cols-[480px_minmax(0,1fr)] lg:gap-16 lg:pb-24 lg:pt-8 xl:gap-20">
        {/* Copy */}
        <div className="hero-copy relative min-w-0">
          <Reveal>
            <p className="eyebrow rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              Smarter Sports Research Starts Here
            </p>
          </Reveal>

          <Reveal delay={40} className="hero-rating-placement">
            <HeroRatingBadge />
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-[42px] font-extrabold leading-[1.05] tracking-tight text-mist sm:text-6xl lg:text-[64px]">
              Make Smarter Picks
              <br />
              With <span className="gold-text">Better Data</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist-secondary">
              Premium Picks brings player trends, prop research, sportsbook lines, projections, and
              sports analytics into one platform built to make research faster and easier.
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
            <ul className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-3">
              {trustPoints.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm font-medium text-mist-secondary">
                  <CheckIcon />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Product visual */}
        <Reveal delay={200} direction="right" className="relative min-w-0">
          <div
            className="pointer-events-none absolute -inset-16 rounded-full opacity-70"
            style={{ background: 'radial-gradient(ellipse at center, rgba(245,197,66,0.13), transparent 66%)' }}
            aria-hidden="true"
          />
          <HeroDashboardStack />
        </Reveal>
      </div>
      <StatsStrip />
    </section>
  )
}
