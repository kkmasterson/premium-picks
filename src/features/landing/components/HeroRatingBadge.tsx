function Laurel({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg
      className="h-12 w-8 shrink-0 text-gold"
      viewBox="0 0 28 48"
      fill="none"
      aria-hidden="true"
      style={{ transform: mirrored ? 'scaleX(-1)' : undefined }}
    >
      <path d="M23.5 3.5C10 12 5.5 29 17.5 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.72" />
      <g fill="currentColor">
        <ellipse cx="19.8" cy="7.4" rx="1.7" ry="3.7" transform="rotate(42 19.8 7.4)" />
        <ellipse cx="14.2" cy="12.7" rx="1.7" ry="3.7" transform="rotate(31 14.2 12.7)" />
        <ellipse cx="10.2" cy="19.2" rx="1.7" ry="3.7" transform="rotate(18 10.2 19.2)" />
        <ellipse cx="8.7" cy="26.6" rx="1.7" ry="3.7" transform="rotate(4 8.7 26.6)" />
        <ellipse cx="10.5" cy="34" rx="1.7" ry="3.7" transform="rotate(-16 10.5 34)" />
        <ellipse cx="15.2" cy="40.2" rx="1.7" ry="3.7" transform="rotate(-34 15.2 40.2)" />
      </g>
    </svg>
  )
}

export function HeroRatingBadge() {
  return (
    <div
      className="flex items-center gap-1.5"
      role="img"
      aria-label="97 percent of users give Arena Props a five-star rating"
    >
      <Laurel />
      <div className="min-w-[105px] text-center">
        <p className="whitespace-nowrap text-[15px] font-semibold leading-none text-mist">
          <span className="text-xl font-extrabold">97%</span> of users
        </p>
        <div className="mt-1 flex justify-center gap-0.5 text-[14px] leading-none text-gold" aria-hidden="true">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-mist-secondary">
          Five-Star Ratings
        </p>
      </div>
      <Laurel mirrored />
    </div>
  )
}
