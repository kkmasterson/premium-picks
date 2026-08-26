import { SectionHeader } from '@/features/landing/components/SectionHeader'
import { Reveal } from '@/features/landing/hooks/Reveal'

const rows = [
  { feature: 'Player Data', premium: 'One platform', manual: 'Multiple websites' },
  { feature: 'Sportsbook Lines', premium: 'Side-by-side', manual: 'Check books individually' },
  { feature: 'Hit Rates', premium: 'Automatically calculated', manual: 'Manually researched' },
  { feature: 'Filters', premium: 'Advanced filtering', manual: 'Limited filtering' },
  { feature: 'Historical Trends', premium: 'Built into research', manual: 'Multiple sources' },
  { feature: 'Research Speed', premium: 'Fast', manual: 'Slow' },
]

function GoldCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      <circle cx="12" cy="12" r="10" fill="rgba(245,197,66,0.14)" />
      <path d="m8 12.5 2.5 2.5L16 9.5" stroke="#F5C542" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MutedX() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      <circle cx="12" cy="12" r="10" fill="rgba(142,142,142,0.12)" />
      <path d="m9 9 6 6M15 9l-6 6" stroke="#8E8E8E" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function Comparison() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-site">
        <SectionHeader
          eyebrow="Why Premium Picks"
          title="Spend Less Time Searching. More Time Analyzing."
        />

        {/* Desktop table */}
        <Reveal delay={120} className="mx-auto mt-14 hidden max-w-4xl md:block">
          <div className="card-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-ink-800 text-left">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist-muted">
                    Feature
                  </th>
                  <th className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
                      <img src="/logo.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
                      Premium Picks
                    </span>
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist-muted">
                    Typical Manual Research
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-line/60 last:border-0">
                    <td className="px-6 py-4 font-semibold text-mist">{r.feature}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-start gap-2.5 font-medium text-mist">
                        <GoldCheck />
                        {r.premium}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-start gap-2.5 text-mist-muted">
                        <MutedX />
                        {r.manual}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Mobile cards */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:hidden">
          {rows.map((r, i) => (
            <Reveal key={r.feature} delay={i * 60}>
              <div className="card-surface p-5">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-mist">{r.feature}</h3>
                <div className="mt-3 space-y-2.5 text-sm">
                  <p className="flex items-start gap-2.5 font-medium text-mist">
                    <GoldCheck />
                    <span>
                      <span className="text-gold">Premium Picks:</span> {r.premium}
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5 text-mist-muted">
                    <MutedX />
                    <span>
                      <span className="text-mist-secondary">Manual research:</span> {r.manual}
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
