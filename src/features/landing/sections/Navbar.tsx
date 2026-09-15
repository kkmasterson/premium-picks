import { useEffect, useState } from 'react'
import { Link } from 'react-router'

const navLinks = [
  { label: 'Product Tour', href: '#product-tour' },
  { label: 'Features', href: '#features' },
  { label: 'Sports', href: '#sports' },
  { label: 'Pricing', href: '#pricing' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`arena-entrance-nav sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-line bg-ink-950/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-site flex h-[68px] items-center justify-between" aria-label="Main navigation">
        <a href="#top" aria-label="Arena Props home" className="shrink-0">
          <span className="arena-entrance-wordmark" aria-hidden="true">Arena<small><i />Props<i /></small><span className="arena-entrance-tagline">Premium Picks</span></span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 lg:flex">
          {navLinks.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-sm font-medium text-mist-secondary transition-colors hover:text-teal-300"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/dashboard/props"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-mist-secondary transition-colors hover:text-teal-300"
          >
            Log In
          </Link>
          <a href="#pricing" className="btn-primary !min-h-[40px] px-5">
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-ink-850 text-mist lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <path d="M5 5l14 14" />
                <path d="M19 5L5 19" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-ink-950/97 backdrop-blur-md lg:hidden">
          <ul className="container-site flex flex-col gap-1 py-4">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-mist-secondary transition-colors hover:bg-ink-850 hover:text-teal-300"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="mt-2 flex flex-col gap-2 border-t border-line px-4 pt-4">
              <Link
                to="/dashboard/props"
                onClick={() => setOpen(false)}
                className="btn-secondary w-full"
              >
                Log In
              </Link>
              <a href="#pricing" onClick={() => setOpen(false)} className="btn-primary w-full">
                Get Started
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
