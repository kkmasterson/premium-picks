import { Reveal } from '@/features/landing/hooks/Reveal'

const stats = [
  { value: '10K+', label: 'Props Analyzed' },
  { value: '15+', label: 'Sportsbooks' },
  { value: '8+', label: 'Sports Covered' },
  { value: '24/7', label: 'Data Updates' },
]

export function StatsStrip() {
  return (
    <section aria-label="Platform statistics" className="hero-metrics border-y border-white/[0.09]">
      <div className="hero-shell grid grid-cols-2 gap-y-6 py-5 md:grid-cols-4 md:py-6">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="text-center">
            <p className="text-2xl font-extrabold tracking-tight text-gold md:text-3xl">{s.value}</p>
            <p className="mt-1 text-xs text-mist-muted md:text-sm">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
