import { useLayoutEffect, type ReactNode } from 'react'

interface RouteThemeProps {
  children: ReactNode
  description: string
  surface: 'landing' | 'dashboard'
  title: string
}

export function RouteTheme({ children, description, surface, title }: RouteThemeProps) {
  useLayoutEffect(() => {
    const root = document.documentElement
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]')

    root.dataset.surface = surface
    document.title = title
    descriptionMeta?.setAttribute('content', description)

    return () => {
      delete root.dataset.surface
    }
  }, [description, surface, title])

  return children
}
