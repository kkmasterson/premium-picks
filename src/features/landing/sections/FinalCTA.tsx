import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/features/landing/hooks/Reveal'

export function FinalCTA() {
  return (
    <section className="arena-final">
      <div className="container-site">
        <Reveal className="arena-final-inner">
          <div><p className="arena-kicker">Your next angle starts here</p><h2>Bring your curiosity.<br /><span>Find your Arena.</span></h2></div>
          <div><p>One place to compare, explore, and build your own perspective.</p><a href="#product-tour" className="btn-primary">Explore the Platform <ArrowUpRight size={18} aria-hidden="true" /></a><a href="#pricing" className="arena-text-link">See launch access <span aria-hidden="true">→</span></a></div>
        </Reveal>
      </div>
    </section>
  )
}
