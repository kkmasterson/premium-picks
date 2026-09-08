import { ArrowUpRight, ScanLine, ChartNoAxesCombined, Layers3 } from 'lucide-react'
import { Reveal } from '@/features/landing/hooks/Reveal'

const features = [
  { number: '01', icon: ScanLine, title: 'Find your starting point.', copy: 'Filter down to your sport, player, and market. Compare sportsbook lines and spot the differences worth a closer look.', tags: ['Advanced filters', 'Line comparison', 'Discrepancies'] },
  { number: '02', icon: ChartNoAxesCombined, title: 'Look beyond the line.', copy: 'Connect recent form, hit rates, projections, and opponent history. Get the context behind the number before you make it part of your research.', tags: ['Player trends', 'Projections', 'Matchup context'] },
  { number: '03', icon: Layers3, title: 'Make the research yours.', copy: 'Keep interesting props close. Save your research and bring selections into the builder so your next step starts where you left off.', tags: ['Saved props', 'Popular activity', 'Pick builder'] },
]

export function Features() {
  return (
    <section id="features" className="arena-features">
      <div className="container-site">
        <Reveal className="arena-section-intro"><p className="arena-kicker">The bigger picture</p><h2>Less tab hopping.<br /><span>More connecting the dots.</span></h2><p>A clear path from the first interesting line to your own informed perspective.</p></Reveal>
        <div className="arena-feature-grid">
          {features.map(({ number, icon: Icon, title, copy, tags }, index) => <Reveal key={number} delay={index * 80}><article className="arena-feature"><div className="arena-feature-top"><span>{number}</span><Icon size={27} strokeWidth={1.3} aria-hidden="true" /></div><h3>{title}</h3><p>{copy}</p><ul>{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></article></Reveal>)}
        </div>
        <a href="#product-tour" className="arena-text-link">Take the research flow for a spin <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
    </section>
  )
}
