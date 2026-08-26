import { Link } from 'react-router'
import { Logo } from '@/features/landing/components/Logo'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Product Tour', href: '#product-tour' },
      { label: 'Sports', href: '#sports' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Log In', href: '/dashboard/props' },
      { label: 'Get Started', href: '#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#top' },
      { label: 'Contact', href: '#top' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '#top' },
      { label: 'Privacy Policy', href: '#top' },
      { label: 'Cookie Policy', href: '#top' },
      { label: 'Responsible Gambling', href: '#top' },
    ],
  },
]

const socials = [
  {
    name: 'Discord',
    href: '#top',
    icon: (
      <path d="M18.6 5.3A16 16 0 0 0 14.7 4l-.5 1a14.7 14.7 0 0 0-4.4 0L9.3 4a16 16 0 0 0-3.9 1.3C3 9.3 2.3 13.2 2.6 17a16 16 0 0 0 4.8 2.5l1-1.7a10 10 0 0 1-1.6-.8l.4-.3a11.4 11.4 0 0 0 9.6 0l.4.3c-.5.3-1 .6-1.6.8l1 1.7a16 16 0 0 0 4.8-2.5c.4-4.4-.6-8.2-2.8-11.7ZM9.7 14.9c-.9 0-1.7-.9-1.7-1.9s.7-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9Zm4.6 0c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.7 1.9-1.7 1.9Z" />
    ),
  },
  {
    name: 'X',
    href: '#top',
    icon: (
      <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L5 21H1.9l7.3-8.3L2.2 3h6.4l4.4 5.9L17.5 3Zm-1.1 16.1h1.7L7.6 4.8H5.8l10.6 14.3Z" />
    ),
  },
  {
    name: 'Instagram',
    href: '#top',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" />
      </>
    ),
  },
  {
    name: 'YouTube',
    href: '#top',
    icon: (
      <>
        <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.9C18.2 4.9 12 4.9 12 4.9s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27.4 27.4 0 0 0 2 12a27.4 27.4 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.9c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.9A27.4 27.4 0 0 0 22 12a27.4 27.4 0 0 0-.4-4.8ZM10 15.1V8.9l5.2 3.1L10 15.1Z" />
      </>
    ),
  },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-900">
      <div className="container-site grid grid-cols-1 gap-12 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:py-16">
        {/* Brand */}
        <div>
          <a href="#top" aria-label="Premium Picks home">
            <Logo size={46} />
          </a>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist-muted">
            Sports research made easier with powerful data, analytics, and player insights.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-ink-850 text-mist-muted transition-all hover:border-gold/40 hover:text-gold"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <nav key={col.title} aria-label={`Footer — ${col.title}`}>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-mist">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith('/') ? (
                    <Link
                      to={l.href}
                      className="text-sm text-mist-muted transition-colors hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      className="text-sm text-mist-muted transition-colors hover:text-gold"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-3 py-6 text-[12px] leading-relaxed text-mist-disabled md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Premium Picks. All rights reserved.</p>
          <p className="max-w-2xl">
            Premium Picks is an independent sports research and analytics platform. Premium Picks
            does not accept wagers or operate as a sportsbook. Information is provided for research
            and entertainment purposes only.
          </p>
        </div>
      </div>
    </footer>
  )
}
