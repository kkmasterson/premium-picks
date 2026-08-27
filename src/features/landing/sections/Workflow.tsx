import { SectionHeader } from '@/features/landing/components/SectionHeader'
import { Reveal } from '@/features/landing/hooks/Reveal'

const steps = [
  {
    n: '01',
    kicker: 'Choose the market',
    title: 'Start with exactly what you want to research.',
    copy: 'Set the sport, event, player, market, odds range, and sample threshold without rebuilding the search across different sites.',
    detail: 'Your active filters stay visible beside the result count.',
  },
  {
    n: '02',
    kicker: 'See the signal',
    title: 'Read every recent result against the same line.',
    copy: 'Compare exact game values with L5, L10, L15, and season samples. Green and red help with scanning, while printed numbers carry the meaning.',
    detail: 'The selected threshold remains visible across the chart.',
  },
  {
    n: '03',
    kicker: 'Compare the market',
    title: 'Put available lines next to each other.',
    copy: 'Review the same prop across supported providers without manually carrying the player, market, and line from tab to tab.',
    detail: 'Sample provider labels are used here until live coverage is verified.',
  },
  {
    n: '04',
    kicker: 'Add the context',
    title: 'Finish with the opponent and role around the number.',
    copy: 'Bring matchup history, event details, and sport-specific context into the same research path before deciding what deserves more attention.',
    detail: 'Context stays attached to the player and selected market.',
  },
]

function FilterStage() {
  const filters = [['Sport', 'NBA'], ['Event', 'NYK @ BOS'], ['Player', 'J. Brunson'], ['Market', 'Points'], ['Hit rate', '60%+'], ['Sample', 'L10']]
  return (
    <div className="rounded-2xl border border-line bg-ink-850 p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">Research filters</p><p className="mt-1 text-sm font-bold text-mist">Build the view once</p></div>
        <span className="rounded-full border border-pos/25 bg-pos/10 px-3 py-1 text-[10px] font-bold text-pos">38 results</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {filters.map(([label, value], index) => (
          <div key={label} className={`rounded-lg border p-3 ${index < 4 ? 'border-gold/25 bg-gold/5' : 'border-line bg-ink-950'}`}>
            <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-mist-muted">{label}</p>
            <p className="mt-1 truncate text-xs font-bold text-mist">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-xs">
        <span className="font-semibold text-gold">6 filters active</span><span className="text-mist-muted">Preview research state</span>
      </div>
    </div>
  )
}

function TrendStage() {
  const values = [24, 31, 29, 22, 35, 33, 26, 30]
  return (
    <div className="rounded-2xl border border-line bg-ink-850 p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between">
        <div><p className="text-sm font-bold text-mist">J. Brunson · Points</p><p className="text-[11px] text-mist-muted">Last 8 games</p></div>
        <span className="rounded-md border border-gold/35 bg-gold/10 px-3 py-2 text-xs font-bold text-gold">Line 27.5</span>
      </div>
      <div className="relative mt-5 flex h-52 items-end gap-2 border-b border-line">
        <span className="absolute inset-x-0 bottom-[66%] border-t border-dashed border-gold/60" aria-hidden="true" />
        {values.map((value, index) => (
          <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center justify-end gap-1">
            <span className={`text-[9px] font-bold ${value > 27.5 ? 'text-pos' : 'text-neg'}`}>{value}</span>
            <span className={`w-full max-w-10 rounded-t-md ${value > 27.5 ? 'bg-gradient-to-t from-pos/25 to-pos' : 'bg-gradient-to-t from-neg/25 to-neg'}`} style={{ height: `${value * 3.6}px` }} />
            <span className="text-[8px] text-mist-disabled">G{index + 1}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[['L5', '80%'], ['L10', '70%'], ['L15', '73%'], ['Season', '66%']].map(([label, value]) => (
          <div key={label} className="rounded-md bg-ink-950 px-2 py-2 text-center"><p className="text-[8px] uppercase tracking-wide text-mist-muted">{label}</p><p className="mt-1 text-xs font-extrabold text-pos">{value}</p></div>
        ))}
      </div>
    </div>
  )
}

function ComparisonStage() {
  const rows = [
    ['Provider A', '26.5', '-120', '+100', 'Lowest line'],
    ['Provider B', '27.5', '-110', '-110', ''],
    ['Provider C', '28.5', '+105', '-125', 'Highest line'],
    ['Provider D', '27.5', '-105', '-115', ''],
  ]
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink-850 shadow-card">
      <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">Sample line comparison</p><p className="mt-1 text-sm font-bold text-mist">J. Brunson · Points</p></div><span className="text-[10px] text-mist-muted">Illustrative data</span></div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-xs">
          <thead><tr className="border-b border-line bg-ink-950 text-[9px] uppercase tracking-[0.13em] text-mist-muted"><th className="px-5 py-3 text-left">Provider</th><th className="px-3 py-3 text-left">Line</th><th className="px-3 py-3 text-left">Over</th><th className="px-3 py-3 text-left">Under</th><th className="px-5 py-3 text-right">Range</th></tr></thead>
          <tbody>{rows.map(([provider, line, over, under, label]) => (
            <tr key={provider} className={`border-b border-line/60 last:border-0 ${label ? 'bg-gold/5' : ''}`}><td className="px-5 py-4 font-bold text-mist">{provider}</td><td className="px-3 py-4 font-bold text-mist">{line}</td><td className="px-3 py-4 text-mist-secondary">{over}</td><td className="px-3 py-4 text-mist-secondary">{under}</td><td className="px-5 py-4 text-right">{label && <span className="rounded border border-gold/30 bg-gold/10 px-2 py-1 text-[9px] font-bold text-gold">{label}</span>}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}

function ContextStage() {
  return (
    <div className="rounded-2xl border border-line bg-ink-850 p-5 shadow-card sm:p-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {[['BOS', '4th vs PG', '67%'], ['MIA', '11th vs PG', '50%'], ['CHI', '27th vs PG', '100%']].map(([team, rank, rate]) => (
          <div key={team} className="rounded-lg border border-line bg-ink-950 p-4"><span className="flex h-9 w-9 items-center justify-center rounded-md border border-gold/25 bg-gold/10 text-[10px] font-extrabold text-gold">{team}</span><p className="mt-3 text-xs font-bold text-mist">{rank}</p><p className="mt-1 text-[10px] text-mist-muted">Recent matchup hit rate</p><p className="mt-3 text-lg font-extrabold text-pos">{rate}</p></div>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="rounded-lg border border-gold/30 bg-gold/5 p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gold">Research summary</p><p className="mt-2 text-sm font-semibold leading-relaxed text-mist">Market, recent form, available lines, and matchup context stay connected.</p></div>
        <div className="flex min-w-40 flex-col justify-center rounded-lg border border-line bg-ink-950 p-4"><p className="text-[9px] uppercase tracking-[0.13em] text-mist-muted">Selected view</p><p className="mt-1 text-xs font-bold text-mist">Points · 27.5</p></div>
      </div>
    </div>
  )
}

const visuals = [<FilterStage />, <TrendStage />, <ComparisonStage />, <ContextStage />]

export function Workflow() {
  return (
    <section id="research-trail" className="relative overflow-hidden py-20 md:py-28">
      <div className="container-site">
        <SectionHeader
          eyebrow="The Research Trail"
          title="Four Decisions. One Connected View."
          copy="Follow the same player and market from the first filter to the final matchup check."
        />

        <div className="relative mx-auto mt-16 max-w-6xl space-y-20 md:space-y-28">
          <div className="research-trail-line pointer-events-none absolute bottom-8 left-1/2 top-8 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/55 to-transparent lg:block" aria-hidden="true" />
          {steps.map((s, i) => (
            <article key={s.n} className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-20">
              <span className="absolute left-1/2 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-ink-950 text-[10px] font-extrabold text-gold shadow-gold-soft lg:flex" aria-hidden="true">{s.n}</span>
              <Reveal direction={i % 2 === 0 ? 'left' : 'right'} className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className={i % 2 === 1 ? 'lg:pl-4' : 'lg:pr-4'}>
                  <div className="flex items-center gap-3"><span className="text-5xl font-extrabold tracking-tight text-gold/20">{s.n}</span><span className="eyebrow">{s.kicker}</span></div>
                  <h3 className="mt-5 text-3xl font-extrabold leading-tight text-mist">{s.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-mist-muted">{s.copy}</p>
                  <p className="mt-5 flex items-start gap-2.5 text-sm font-semibold leading-relaxed text-mist-secondary"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold shadow-[0_0_12px_rgba(245,197,66,0.7)]" />{s.detail}</p>
                </div>
              </Reveal>
              <Reveal
                direction={i % 2 === 0 ? 'right' : 'left'}
                delay={80}
                observeParent
                className={`research-step-visual ${i % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                <div>{visuals[i]}</div>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
