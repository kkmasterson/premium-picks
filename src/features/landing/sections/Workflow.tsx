import { SectionHeader } from '@/features/landing/components/SectionHeader'
import { Reveal } from '@/features/landing/hooks/Reveal'

const steps = [
  {
    n: '01',
    title: 'Choose Your Sport',
    copy: 'Select the sport, league, games, players, and markets you want to research.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a15 15 0 0 1 0 18" />
        <path d="M12 3a15 15 0 0 0 0 18" />
        <path d="M3.5 9h17" />
        <path d="M3.5 15h17" />
      </>
    ),
  },
  {
    n: '02',
    title: 'Analyze the Data',
    copy: 'Review player performance, historical trends, sportsbook lines, and projections.',
    icon: (
      <>
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M22 20H2" />
      </>
    ),
  },
  {
    n: '03',
    title: 'Find Your Edge',
    copy: 'Use the information to identify the opportunities that fit your research strategy.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </>
    ),
  },
]

export function Workflow() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-site">
        <SectionHeader eyebrow="How It Works" title="Research Smarter in Three Steps" />

        <div className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* connecting line (desktop) */}
          <div
            className="pointer-events-none absolute left-[16%] right-[16%] top-[52px] hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent md:block"
            aria-hidden="true"
          />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="group card-surface relative h-full p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/40">
                <span className="pointer-events-none absolute right-5 top-4 text-5xl font-extrabold tracking-tight text-ink-700 transition-colors group-hover:text-gold/20" aria-hidden="true">
                  {s.n}
                </span>
                <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                    {s.icon}
                  </svg>
                </span>
                <h3 className="mt-5 text-lg font-bold text-mist">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-muted">{s.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
