import { SectionHeader } from '@/features/landing/components/SectionHeader'
import { Reveal } from '@/features/landing/hooks/Reveal'
import { sports } from '@/features/landing/data'

export function SportsCoverage() {
  return (
    <section className="border-t border-line bg-ink-900 py-20 md:py-28">
      <div className="container-site">
        <SectionHeader
          eyebrow="Sports Coverage"
          title="One Platform. Multiple Sports."
          copy="Research props and player performance across the sports you follow."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sports.map((s, i) => (
            <Reveal key={s.abbr} delay={i * 60}>
              <div className="group card-surface h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 md:p-6">
                <span className="inline-flex h-11 min-w-[52px] items-center justify-center rounded-lg border border-gold/25 bg-gold/10 px-2 text-sm font-extrabold tracking-wide text-gold">
                  {s.abbr}
                </span>
                <h3 className="mt-4 text-base font-bold text-mist">{s.name}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-mist-muted">{s.markets}</p>
              </div>
            </Reveal>
          ))}

          <Reveal delay={sports.length * 60}>
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-line p-6 text-center">
              <p className="text-sm font-semibold text-mist-secondary">More sports coming soon</p>
              <p className="mt-1 text-[13px] text-mist-muted">Soccer · Tennis · MMA · Esports</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
