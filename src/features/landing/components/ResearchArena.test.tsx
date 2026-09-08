import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResearchArena } from './ResearchArena'

describe('hero research angles', () => {
  it('changes the example and explanation while retaining the demo disclosure', () => {
    render(<ResearchArena />)
    expect(screen.getByText('27.5')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /The form/ }))
    expect(screen.getByText('7/10')).toBeInTheDocument()
    expect(screen.queryByText('27.5')).not.toBeInTheDocument()
    expect(screen.getByText('Read recent results against the same line.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /The line/ })).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(screen.getByRole('button', { name: /The matchup/ }))
    expect(screen.getByText('AT BOSTON')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /The matchup/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/Illustrative research example · No live data/)).toBeInTheDocument()
  })
})
