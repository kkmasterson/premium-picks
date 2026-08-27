import { Reveal } from '@/features/landing/hooks/Reveal'

const stats = [
  { overline: 'Covering', value: '12', label: 'Sports + Esports' },
  { overline: 'Comparing', value: '15+', label: 'Sportsbooks' },
  { overline: 'Built In', value: '8', label: 'Research Tools' },
  { overline: 'Tracking', value: 'Live + Historical', label: 'Odds, Stats + Movement' },
]

export function StatsStrip() {
  return (
    <section aria-label="Arena Props platform coverage" className="hero-metrics border-y border-gold/20">
      <div className="hero-shell grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal
            key={stat.label}
            delay={index * 70}
            className="border-line/70 px-3 py-3 text-center even:border-l md:border-l md:first:border-l-0 md:py-3.5"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-mist-muted">{stat.overline}</p>
            <p className={`mt-0.5 font-extrabold tracking-tight text-gold ${stat.value.length > 4 ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'}`}>{stat.value}</p>
            <p className="mt-0.5 text-[10px] font-medium text-mist-secondary md:text-[11px]">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
