import { useState } from 'react'
import { Link } from 'react-router'
import { SectionHeader } from '@/features/landing/components/SectionHeader'
import { Reveal } from '@/features/landing/hooks/Reveal'

interface Tier {
  name: string
  monthly: number
  yearly: number
  tagline: string
  features: string[]
  cta: string
  featured?: boolean
}

const tiers: Tier[] = [
  {
    name: 'Premium',
    monthly: 29,
    yearly: 23,
    tagline: 'The full research toolkit',
    features: [
      'Full prop access',
      'Advanced filters',
      'Full player pages',
      'L5 / L10 / L15 trends',
      'Sportsbook comparisons',
      'Projections',
    ],
    cta: 'Get Premium',
    featured: true,
  },
  {
    name: 'Pro',
    monthly: 59,
    yearly: 47,
    tagline: 'For power researchers',
    features: [
      'Everything in Premium',
      '+EV tools',
      'Arbitrage',
      'Real-time alerts',
      'Advanced analytics',
      'Expanded sportsbook coverage',
    ],
    cta: 'Go Pro',
  },
]

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-mist-secondary">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
        <path d="m6 12.5 4 4L18 8" stroke="#F5C542" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text}
    </li>
  )
}

export function Pricing() {
  const [yearly, setYearly] = useState(true)

  return (
    <section id="pricing" className="border-t border-line bg-ink-900 py-20 md:py-28">
      <div className="container-site">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple Plans. Serious Tools."
          copy="Choose the level of research that fits how you use Premium Picks."
        />

        <Reveal delay={80} className="mt-6 text-center">
          <p className="inline-flex rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-xs font-semibold text-gold">
            Pre-launch pricing — all prices and plan details are subject to change.
          </p>
        </Reveal>

        {/* Billing toggle */}
        <Reveal delay={100} className="mt-10 flex items-center justify-center gap-3">
          <span className={`text-sm font-medium ${!yearly ? 'text-mist' : 'text-mist-muted'}`}>Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            aria-label="Toggle yearly billing"
            onClick={() => setYearly((v) => !v)}
            className={`relative h-7 rounded-full border transition-colors ${
              yearly ? 'border-gold/50 bg-gold/20' : 'border-line bg-ink-700'
            }`}
            style={{ width: 52 }}
          >
            <span
              className={`absolute top-0.5 rounded-full transition-all ${
                yearly ? 'left-[26px] bg-gold' : 'left-0.5 bg-mist-muted'
              }`}
              style={{ height: 22, width: 22 }}
            />
          </button>
          <span className={`text-sm font-medium ${yearly ? 'text-mist' : 'text-mist-muted'}`}>
            Yearly
            <span className="ml-2 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[11px] font-semibold text-gold">
              Save 20%
            </span>
          </span>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
          {tiers.map((t, i) => {
            const price = yearly ? t.yearly : t.monthly
            return (
              <Reveal key={t.name} delay={i * 100} className="h-full">
                <article
                  className={`relative flex h-full flex-col rounded-xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                    t.featured
                      ? 'border-gold/50 bg-ink-800 shadow-gold-glow'
                      : 'border-line bg-ink-850 shadow-card hover:border-gold/30'
                  }`}
                >
                  {t.featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-950">
                      Most Popular
                    </span>
                  )}

                  <h3 className={`text-lg font-bold ${t.featured ? 'text-gold' : 'text-mist'}`}>{t.name}</h3>
                  <p className="mt-1 text-[13px] text-mist-muted">{t.tagline}</p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-[44px] font-extrabold leading-none tracking-tight text-mist">
                      ${price}
                    </span>
                    <span className="text-sm text-mist-muted">/ month</span>
                  </div>
                  <p className="mt-1.5 h-4 text-[12px] text-mist-muted">
                    {yearly ? 'Billed yearly' : 'Billed monthly'}
                  </p>

                  <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                    {t.features.map((f) => (
                      <CheckItem key={f} text={f} />
                    ))}
                  </ul>

                  <Link
                    to="/dashboard/props"
                    className={`mt-8 w-full ${t.featured ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {t.cta}
                  </Link>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={200} className="mt-10 text-center">
          <p className="text-sm text-mist-muted">
            Cancel anytime. Premium Picks is a research platform and does not process wagers.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
