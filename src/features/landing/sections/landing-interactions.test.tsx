import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { ProductPreview } from '@/features/landing/sections/ProductPreview'
import { Pricing } from '@/features/landing/sections/Pricing'
import { SportsCoverage } from '@/features/landing/sections/SportsCoverage'
import { Workflow } from '@/features/landing/sections/Workflow'

describe('landing page interactive product tour', () => {
  it('switches the preview and destination when a product view is selected', () => {
    render(
      <MemoryRouter>
        <ProductPreview />
      </MemoryRouter>,
    )

    const playerTab = screen.getByRole('tab', { name: /Analyze a Player/i })
    fireEvent.click(playerTab)

    expect(playerTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Move from one prop into the full player story.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Open Player Analysis/i })).toHaveAttribute(
      'href',
      '/dashboard/players/NBA-jalen-brunson?market=points&line=27.5&period=full',
    )
  })

  it('supports arrow-key navigation between product tabs', () => {
    render(
      <MemoryRouter>
        <ProductPreview />
      </MemoryRouter>,
    )

    const propsTab = screen.getByRole('tab', { name: /Find Props/i })
    fireEvent.keyDown(propsTab, { key: 'ArrowRight' })

    expect(screen.getByRole('tab', { name: /Analyze a Player/i })).toHaveAttribute('aria-selected', 'true')
  })

  it('filters the prop preview and labels its data state', () => {
    render(
      <MemoryRouter>
        <ProductPreview />
      </MemoryRouter>,
    )

    expect(screen.getByText('6 matching results · Preview data')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Market: All' }))

    expect(screen.getByRole('button', { name: 'Market: Points' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('2 matching results · Preview data')).toBeInTheDocument()
    expect(screen.getByText(/not connected to live dashboards, accounts, APIs/i)).toBeInTheDocument()
    expect(screen.getByText('✓ Tried')).toBeInTheDocument()
    expect(screen.queryByText('Synced')).not.toBeInTheDocument()
    expect(screen.queryByText('Live Lines')).not.toBeInTheDocument()
  })

  it('changes player and trend samples without leaving the mock tour', () => {
    render(
      <MemoryRouter>
        <ProductPreview />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('tab', { name: /Analyze a Player/i }))
    const playerSamples = screen.getByLabelText('Select a fixed player sample')
    fireEvent.click(within(playerSamples).getByRole('button', { name: /L5/i }))
    expect(within(playerSamples).getByRole('button', { name: /L5/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('L5 · 80% hit rate')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: /Read the Trend/i }))
    const trendSamples = screen.getByLabelText('Select a fixed trend sample')
    fireEvent.click(within(trendSamples).getByRole('button', { name: 'L15' }))
    expect(within(trendSamples).getByRole('button', { name: 'L15' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('L15 fixed sample')).toBeInTheDocument()
    expect(screen.getByText('6 of 8 over · 73%')).toBeInTheDocument()
  })

  it('updates matchup context from fixed opponent rows', () => {
    render(
      <MemoryRouter>
        <ProductPreview />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('tab', { name: /Add Context/i }))
    const miami = screen.getByRole('button', { name: 'Use Miami mock matchup' })
    fireEvent.click(miami)

    expect(miami).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Jalen Brunson vs Miami')).toBeInTheDocument()
    expect(screen.getByText(/Miami shows the closest result/i)).toBeInTheDocument()
  })
})

describe('landing page Sport Lab', () => {
  it('flips both cards before revealing the selected sport', async () => {
    const { container } = render(
      <MemoryRouter>
        <SportsCoverage />
      </MemoryRouter>,
    )

    const nflTab = screen.getByRole('tab', { name: 'NFL' })
    fireEvent.click(nflTab)

    expect(nflTab).toHaveAttribute('aria-selected', 'true')
    expect(container.querySelectorAll('.sport-card-flip-out')).toHaveLength(2)
    expect(screen.getByText('Jalen Brunson')).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelectorAll('.sport-card-flip-in')).toHaveLength(2)
      expect(screen.getByText('Patrick Mahomes')).toBeInTheDocument()
      expect(screen.getByText('275.5 pass yds')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Explore NFL Props/i })).toHaveAttribute(
        'href',
        '/dashboard/props?sport=NFL',
      )
    })
  })

  it('supports arrow-key navigation between sport tabs', () => {
    render(
      <MemoryRouter>
        <SportsCoverage />
      </MemoryRouter>,
    )

    const nbaTab = screen.getByRole('tab', { name: 'NBA' })
    fireEvent.keyDown(nbaTab, { key: 'ArrowRight' })

    expect(screen.getByRole('tab', { name: 'NFL' })).toHaveAttribute('aria-selected', 'true')
  })
})

describe('landing page pricing', () => {
  it('shows only paid tiers and labels the pricing as provisional', () => {
    render(
      <MemoryRouter>
        <Pricing />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('heading', { name: 'Free' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByText(/all prices and plan details are subject to change/i)).toBeInTheDocument()
  })
})

describe('landing page Research Trail motion', () => {
  it('assigns alternating edge entrances to all four visual stages', () => {
    const { container } = render(<Workflow />)
    const visuals = Array.from(container.querySelectorAll('.research-step-visual'))

    expect(visuals).toHaveLength(4)
    expect(visuals.map((visual) => visual.classList.contains('reveal-right'))).toEqual([
      true,
      false,
      true,
      false,
    ])
    expect(visuals.map((visual) => visual.classList.contains('reveal-left'))).toEqual([
      false,
      true,
      false,
      true,
    ])
  })

  it('observes each stationary step row instead of its off-screen visual', () => {
    const observed: Element[] = []
    class MockIntersectionObserver {
      observe(target: Element) { observed.push(target) }
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

    try {
      const { container } = render(<Workflow />)
      const steps = Array.from(container.querySelectorAll('article'))

      expect(steps).toHaveLength(4)
      steps.forEach((step) => expect(observed).toContain(step))
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
