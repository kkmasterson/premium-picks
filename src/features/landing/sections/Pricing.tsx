import { SectionHeader } from '@/features/landing/components/SectionHeader';
import { Reveal } from '@/features/landing/hooks/Reveal';

const tiers = [
  { name: 'Tier 1', tagline: 'Core Arena Props research', featured: true, features: ['Prop browsing and line comparison', 'Goblin, Regular, Devil, and alternate lines', 'Hit rates, projections, confidence, and H2H', 'Full line movement', 'Builder and Popular activity', 'Locked positive-EV signal'] },
  { name: 'Tier 2', tagline: 'Advanced EV research', featured: false, features: ['Everything in Tier 1', 'Actual EV percentage', 'Implied and fair probability', 'Fair odds and edge calculations', 'EV filters and sorting', 'Future higher-end AI analytics'] },
];

function CheckItem({ text }: { text: string }) {
  return <li className="flex items-start gap-2.5 text-sm text-mist-secondary"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0"><path d="m6 12.5 4 4L18 8" stroke="#F5C542" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>{text}</li>;
}

export function Pricing() {
  return <section id="pricing" className="border-t border-line bg-ink-900 py-20 md:py-28">
    <div className="container-site">
      <SectionHeader eyebrow="Access" title="Two Paid Tiers. Pricing Comes Later." copy="Arena Props will not have a free production tier. Public plan names and pricing remain hidden until they are approved."/>
      <Reveal delay={80} className="mt-6 text-center"><p className="inline-flex rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-xs font-semibold text-gold">Pre-launch feature comparison — all prices and plan details are subject to change.</p></Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
        {tiers.map((tier, index) => <Reveal key={tier.name} delay={index * 100} className="h-full"><article className={`relative flex h-full flex-col rounded-xl border p-7 ${tier.featured ? 'border-gold/50 bg-ink-800 shadow-gold-glow' : 'border-line bg-ink-850 shadow-card'}`}>
          {tier.featured && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-950">Core research</span>}
          <h3 className={`text-lg font-bold ${tier.featured ? 'text-gold' : 'text-mist'}`}>{tier.name}</h3><p className="mt-1 text-[13px] text-mist-muted">{tier.tagline}</p>
          <div className="mt-6 rounded-lg border border-line bg-ink-950/50 px-4 py-4"><p className="text-xs font-semibold uppercase tracking-wider text-mist-muted">Price</p><p className="mt-1 text-xl font-bold text-mist">To be announced</p></div>
          <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">{tier.features.map((feature) => <CheckItem key={feature} text={feature}/>)}</ul>
          <button disabled className="btn-secondary mt-8 w-full cursor-not-allowed opacity-60">Available at launch</button>
        </article></Reveal>)}
      </div>
      <Reveal delay={200} className="mt-10 text-center"><p className="text-sm text-mist-muted">Checkout is disabled until names and prices are approved. Arena Props is research-only and does not process wagers.</p></Reveal>
    </div>
  </section>;
}
