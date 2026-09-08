import { ArrowDown, ArrowRight, Check } from 'lucide-react'
import { ResearchArena } from '@/features/landing/components/ResearchArena'
import { HeroRatingBadge } from '@/features/landing/components/HeroRatingBadge'

const trustPoints = [
  { title: 'Compare the lines', detail: 'Find the differences' },
  { title: 'Know the player', detail: 'Form meets context' },
  { title: 'Build your view', detail: 'Keep it all together' },
]

export function Hero() {
  return (
    <section id="top" className="arena-hero">
      <div className="container-site arena-hero-grid">
        <div className="arena-hero-copy">
          <p className="arena-kicker"><span /> A new angle on player props</p>
          <div className="arena-title-block">
            <h1>Your Complete<br />Prop Research<br /><span>Arena.</span></h1>
            <div className="arena-hero-rating"><HeroRatingBadge /></div>
          </div>
          <p className="arena-hero-description">Compare the lines. Understand the player. See the whole picture. Your sports and esports research, together in one place.</p>
          <div className="arena-hero-actions">
            <a href="#pricing" className="btn-primary">Get Started <ArrowRight size={17} aria-hidden="true" /></a>
            <a href="#product-tour" className="btn-secondary">Tour the Platform <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
          <ul className="arena-trust">
            {trustPoints.map((point) => <li key={point.title}><Check size={14} aria-hidden="true" /><span><strong>{point.title}</strong><small>{point.detail}</small></span></li>)}
          </ul>
        </div>
        <ResearchArena />
      </div>
      <div className="container-site arena-hero-foot">
        <span>ONE WORKSPACE. <strong>EVERY ANGLE.</strong></span>
        <a href="#features">See what comes together <ArrowDown size={14} aria-hidden="true" /></a>
        <span className="arena-edition">ARENA PROPS <i /> RESEARCH, REFOCUSED</span>
      </div>
    </section>
  )
}
