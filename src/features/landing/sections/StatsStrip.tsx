import { Reveal } from '@/features/landing/hooks/Reveal'

const stats = [
  { value: '10K+', label: 'Props Analyzed' },
  { value: '15+', label: 'Sportsbooks' },
  { value: '8+', label: 'Sports Covered' },
  { value: '24/7', label: 'Data Updates' },
]

export function StatsStrip() {
  return (
    <section aria-label="Platform statistics" className="border-y border-line bg-ink-900">
      <div className="container-site grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:py-12">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="text-center">
            <p className="text-3xl font-extrabold tracking-tight text-gold md:text-4xl">{s.value}</p>
            <p className="mt-1.5 text-sm text-mist-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
