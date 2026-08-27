export function Logo({ size = 40, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Arena Props logo"
        width={size}
        height={size}
        className="rounded-md object-contain drop-shadow-[0_0_12px_rgba(245,197,66,0.18)]"
        style={{ width: size, height: 'auto' }}
      />
      {withWordmark && (
        <span className="leading-none">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.32em] text-mist-muted">
            Arena
          </span>
          <span className="block text-lg font-extrabold uppercase tracking-[0.14em] text-mist">
            Props
          </span>
        </span>
      )}
    </span>
  )
}
