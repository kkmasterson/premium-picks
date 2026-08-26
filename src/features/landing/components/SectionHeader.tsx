import type { ReactNode } from 'react'
import { Reveal } from '@/features/landing/hooks/Reveal'

interface SectionHeaderProps {
  eyebrow: string
  title: ReactNode
  copy?: string
  align?: 'center' | 'left'
}

export function SectionHeader({ eyebrow, title, copy, align = 'center' }: SectionHeaderProps) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <Reveal className={`flex flex-col ${alignCls}`}>
      <p className="eyebrow">
        <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
        {eyebrow}
        <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
      </p>
      <h2 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-mist sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
        {title}
      </h2>
      {copy && <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-muted md:text-lg">{copy}</p>}
    </Reveal>
  )
}
