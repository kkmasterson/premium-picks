import { HeroRatingBadge } from '@/features/landing/components/HeroRatingBadge'
import './arena-entrance.css'

export function Hero() {
  return (
    <section id="top" className="arena-entrance" aria-labelledby="arena-headline">
      <div className="arena-entrance-scene">
        <img className="arena-entrance-backdrop" src="/landing/arena-entrance-floor.png" alt="Gold arena arch with sports logos on the left flag, esports logos on the right flag, and ARENA lettering on the court" fetchPriority="high" width="1644" height="957" />
      </div>
      <div className="arena-entrance-copy">
        <h1 id="arena-headline">Welcome to the <span>Arena</span></h1>
        <p>Compare the lines. Understand the player. See the whole picture.</p>
        <div className="arena-entrance-actions">
          <a href="#pricing" className="btn-primary">Get Started</a>
          <a href="#product-tour" className="btn-secondary">Tour the Platform</a>
        </div>
        <div className="arena-entrance-rating"><HeroRatingBadge /></div>
      </div>
      <div className="arena-court-example" aria-label="Illustrative research example, not live data">
        <dl><div><dt>Line</dt><dd>27.5</dd></div><div><dt>Avg</dt><dd>28.9</dd></div><div><dt>Recent</dt><dd>7/10</dd></div></dl>
        <p>Illustrative example</p>
      </div>
      <div className="arena-entrance-footer"><span>Compare lines</span><span>Read the form</span><span>Know the matchup</span></div>
    </section>
  )
}
