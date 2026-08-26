import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li'
  direction?: 'up' | 'left' | 'right'
  observeParent?: boolean
}

export function Reveal({ children, delay = 0, className = '', as = 'div', direction = 'up', observeParent = false }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') return
    const target = observeParent ? el.parentElement : el
    if (!target) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -32px 0px' },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [observeParent])

  const Tag = as as 'div'
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${direction} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
