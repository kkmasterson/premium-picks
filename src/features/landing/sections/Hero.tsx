import { DashboardMockup } from '@/features/landing/components/DashboardMockup'
import { Reveal } from '@/features/landing/hooks/Reveal'

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
    <section id="top" className="texture-diagonal relative overflow-hidden">
      {/* Background effects */}
      <div className="hero-glow glow-drift pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="vignette pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        aria-hidden="true"
      />

      <div className="container-site relative grid grid-cols-1 items-center gap-14 pb-20 pt-14 md:pb-28 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Copy */}
        <div className="min-w-0">
          <Reveal>
            <p className="eyebrow rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              Smarter Sports Research Starts Here
            </p>
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
              <a href="#platform" className="btn-secondary px-8 text-base">
                See How It Works
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
        <Reveal delay={200} className="relative min-w-0">
          <div
            className="pointer-events-none absolute -inset-10 rounded-full opacity-80"
            style={{ background: 'radial-gradient(ellipse at center, rgba(245,197,66,0.16), transparent 62%)' }}
            aria-hidden="true"
          />
          <div className="float-soft relative">
            <DashboardMockup compact />

            {/* Floating hit-rate card */}
            <div className="absolute -bottom-6 -left-4 hidden rounded-xl border border-line bg-ink-800/95 p-4 shadow-card backdrop-blur-sm sm:block md:-left-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-mist-muted">
                Hit Rate · L10
              </p>
              <p className="mt-1 text-2xl font-extrabold text-pos">80%</p>
              <div className="mt-2 flex items-end gap-1" aria-hidden="true">
                {[35, 55, 40, 70, 60, 85, 75, 95].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1.5 rounded-sm ${h >= 60 ? 'bg-pos/80' : 'bg-neg/70'}`}
                    style={{ height: `${h * 0.28}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Floating edge card */}
            <div className="absolute -right-3 -top-6 hidden rounded-xl border border-gold/30 bg-ink-800/95 p-4 shadow-gold-soft backdrop-blur-sm sm:block md:-right-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-mist-muted">
                Projection Edge
              </p>
              <p className="mt-1 text-2xl font-extrabold text-gold">+3.3</p>
              <p className="text-[11px] text-mist-muted">vs. sportsbook line</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
