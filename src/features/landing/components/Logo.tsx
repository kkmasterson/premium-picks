export function Logo({ size = 40, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Premium Picks logo"
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: 'auto' }}
      />
      {withWordmark && (
        <span className="leading-none">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.32em] text-mist-muted">
            Premium
          </span>
          <span className="block text-lg font-extrabold uppercase tracking-[0.14em] text-mist">
            Picks
          </span>
        </span>
      )}
    </span>
  )
}
