import { DashboardMockup } from '@/features/landing/components/DashboardMockup'
import { SectionHeader } from '@/features/landing/components/SectionHeader'
import { Reveal } from '@/features/landing/hooks/Reveal'

const callouts = [
  {
    title: 'Real-Time Prop Data',
    copy: 'Current player props and sportsbook lines in one place.',
    icon: (
      <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Advanced Filters',
    copy: 'Narrow large markets down to the players and props that matter.',
    icon: (
      <>
        <path d="M4 6h16" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </>
    ),
  },
  {
    title: 'Hit Rate Analysis',
    copy: 'Compare recent performance across L5, L10, L15, and season data.',
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
    title: 'Sportsbook Comparison',
    copy: 'Compare available lines from supported sportsbooks.',
    icon: (
      <>
        <path d="M8 3v18" />
        <path d="M16 3v18" />
        <path d="M3 8h18" />
        <path d="M3 16h18" />
      </>
    ),
  },
]

export function ProductPreview() {
  return (
    <section id="platform" className="relative overflow-hidden py-20 md:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-16 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-60"
        style={{ background: 'radial-gradient(ellipse at center, rgba(245,197,66,0.08), transparent 65%)' }}
        aria-hidden="true"
      />
      <div className="container-site relative">
        <SectionHeader
          eyebrow="The Platform"
          title="Everything You Need in One Place"
          copy="Research players, compare lines, identify trends, and make faster decisions without jumping between multiple websites."
        />

        {/* Browser frame */}
        <Reveal delay={120} className="mx-auto mt-14 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-line bg-ink-850 shadow-gold-glow">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#3a3a3a]" />
              <span className="h-3 w-3 rounded-full bg-[#3a3a3a]" />
              <span className="h-3 w-3 rounded-full bg-gold/70" />
              <div className="ml-3 flex flex-1 items-center gap-2 rounded-md border border-line bg-ink-950 px-3 py-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#646464" strokeWidth="2.4" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <span className="text-[11px] text-mist-muted">app.premiumpicks.com/props</span>
              </div>
            </div>
            <div className="p-3 sm:p-5">
              <DashboardMockup />
            </div>
          </div>
        </Reveal>

        {/* Callouts */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {callouts.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <div className="group card-surface h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    {c.icon}
                  </svg>
                </span>
                <h3 className="mt-4 text-base font-bold text-mist">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mist-muted">{c.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
