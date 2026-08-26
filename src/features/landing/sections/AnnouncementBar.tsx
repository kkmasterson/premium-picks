export function AnnouncementBar() {
  return (
    <div className="border-b border-gold/25 bg-gradient-to-r from-ink-900 via-[#171204] to-ink-900">
      <div className="container-site flex min-h-[40px] flex-wrap items-center justify-center gap-x-4 gap-y-1 py-1.5 text-center">
        <p className="text-[13px] text-mist-secondary">
          <span className="font-semibold text-gold">Limited Launch Offer:</span> Save 20% on Premium
          Picks Pro
        </p>
        <a
          href="#pricing"
          className="text-[13px] font-semibold text-gold underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold-hover"
        >
          Claim Offer →
        </a>
      </div>
    </div>
  )
}
