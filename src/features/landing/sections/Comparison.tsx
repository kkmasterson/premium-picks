import { SectionHeader } from '@/features/landing/components/SectionHeader'
import { Reveal } from '@/features/landing/hooks/Reveal'

const categoryStandard = [
  'Multi-sport player-prop discovery',
  'Advanced filtering and sorting',
  'Player trends, game logs, and hit rates',
  'Sportsbook line comparison',
  'Projections and matchup context',
]

const arenaAdvantages = [
  'Discrepancy-first opportunity discovery',
  'Community popularity signals',
  'Saved props, players, and games',
  'A persistent integrated Pick Builder',
  'One workflow across sports and esports',
]

const mvpInputs = [
  { title: 'Line movement', detail: 'The Odds API historical snapshots' },
  { title: '+EV', detail: 'The Odds API odds + Arena Props calculations' },
  { title: 'Arbitrage', detail: 'Multi-book odds + Arena Props scanner' },
  { title: 'Injury feeds', detail: 'BALLDONTLIE availability data' },
]

const arenaBuilds = [
  '+EV engine',
  'Arbitrage scanner',
  'Line movement detection',
  'User alerts',
  'Injury impact models',
  'Market movement alerts',
]

const advancedRoadmap = [
  'Advanced injury impact intelligence',
  'Sharp-money identification',
  'Betting handle and ticket percentages',
  'Steam-move detection',
  'AI injury and news interpretation',
  'Highly sophisticated real-time alerting',
]

function GoldCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      <circle cx="12" cy="12" r="10" fill="rgba(245,197,66,0.14)" />
      <path d="m8 12.5 2.5 2.5L16 9.5" stroke="#F5C542" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Comparison() {
  return (
    <section id="advantage" className="relative overflow-hidden border-t border-line py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,rgba(245,197,66,0.07),transparent_65%)]" aria-hidden="true" />
      <div className="container-site">
        <SectionHeader
          eyebrow="Competitive Coverage"
          title="Everything the Category Expects. More Ways to Find the Signal."
          copy="Arena Props is being built against the feature standard set by leading prop-research platforms—not below it. The difference is how those tools connect into one focused workflow."
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2">
          <Reveal direction="left">
            <article className="card-surface h-full p-6 md:p-8">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-ink-950 text-lg font-extrabold text-mist-secondary">01</span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mist-muted">Core parity</p>
                  <h3 className="mt-1 text-xl font-bold text-mist">The modern research baseline</h3>
                </div>
              </div>
              <ul className="mt-7 space-y-4">
                {categoryStandard.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-mist-secondary">
                    <GoldCheck />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal direction="right" delay={80}>
            <article className="relative h-full overflow-hidden rounded-xl border border-gold/35 bg-gradient-to-br from-gold/[0.11] via-ink-850 to-ink-900 p-6 shadow-gold-glow md:p-8">
              <img src="/logo.png" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-14 -right-10 w-52 opacity-[0.08] mix-blend-screen" />
              <div className="relative flex items-center gap-4">
                <img src="/logo.png" alt="" aria-hidden="true" className="h-14 w-14 rounded-lg object-contain" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Arena advantage</p>
                  <h3 className="mt-1 text-xl font-bold text-mist">More connected ways to research</h3>
                </div>
              </div>
              <ul className="relative mt-7 space-y-4">
                {arenaAdvantages.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-mist">
                    <GoldCheck />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>

        <Reveal delay={140} className="mx-auto mt-8 max-w-5xl">
          <div id="capability-classification" className="overflow-hidden rounded-xl border border-line bg-ink-900/80">
            <div className="border-b border-line px-6 py-5 md:px-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Capability Classification</p>
              <h3 className="mt-2 text-xl font-bold text-mist">What the data unlocks—and what Arena Props builds.</h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-mist-muted">Available provider inputs make the MVP possible. Arena Props turns those inputs into the research engines, scanners, models, and alerts users interact with.</p>
            </div>

            <div className="grid lg:grid-cols-3">
              <div className="border-b border-line p-6 lg:border-b-0 lg:border-r md:p-8">
                <p className="inline-flex rounded-full border border-pos/30 bg-pos/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-pos">Verified / MVP-Capable</p>
                <ul className="mt-6 space-y-5">
                  {mvpInputs.map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <GoldCheck />
                      <span>
                        <span className="block text-sm font-bold text-mist">{item.title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-mist-muted">{item.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-b border-line p-6 lg:border-b-0 lg:border-r md:p-8">
                <p className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gold">Arena Props Features We Build</p>
                <ul className="mt-6 space-y-3.5">
                  {arenaBuilds.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-semibold text-mist">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold/25 bg-gold/10 text-xs text-gold" aria-hidden="true">⚙</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 md:p-8">
                <p className="inline-flex rounded-full border border-line bg-ink-950 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-mist-secondary">Advanced Roadmap</p>
                <ul className="mt-6 space-y-3.5">
                  {advancedRoadmap.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-mist-secondary">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mist-disabled" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
