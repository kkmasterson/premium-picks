import { Reveal } from '@/features/landing/hooks/Reveal'

export function FinalCTA() {
  return (
    <section className="pb-20 pt-4 md:pb-28">
      <div className="container-site">
        <Reveal>
          <div className="texture-diagonal relative overflow-hidden rounded-2xl border border-gold/25 bg-ink-900 px-6 py-16 text-center shadow-gold-glow md:px-12 md:py-20">
            {/* Watermark logo */}
            <img
              src="/logo.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 w-72 opacity-[0.09] mix-blend-screen"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 110%, rgba(245,197,66,0.12), transparent 65%)' }}
              aria-hidden="true"
            />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-mist sm:text-4xl lg:text-[44px]">
                Ready to <span className="gold-text">Research Smarter?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-mist-muted md:text-lg">
                Everything you need to research player props, compare lines, and understand
                performance trends in one platform.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="#pricing" className="btn-primary px-8 text-base">
                  Get Started
                </a>
                <a href="#pricing" className="btn-secondary px-8 text-base">
                  View Pricing
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
