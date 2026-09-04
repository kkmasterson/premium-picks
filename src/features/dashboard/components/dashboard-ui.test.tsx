import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { DashboardPageHeader, MetricStrip, SegmentedControl } from './dashboard-ui';

describe('dashboard presentation primitives', () => {
  it('exposes the page purpose and semantic metric descriptions', () => {
    render(<><DashboardPageHeader title="Research Trends" description="Ranked recent performance." /><MetricStrip metrics={[{ label: 'L10', value: '70%', sample: '7/10 hits', tone: 'positive', accessibilityDescription: 'Last 10 hit rate 70 percent' }]} /></>);
    expect(screen.getByRole('heading', { name: 'Research Trends' })).toBeInTheDocument();
    expect(screen.getByText('Ranked recent performance.')).toBeInTheDocument();
    expect(screen.getByLabelText('Last 10 hit rate 70 percent')).toHaveTextContent('70%');
    expect(screen.getByText('7/10 hits')).toBeInTheDocument();
  });

  it('supports arrow-key navigation for segmented controls', () => {
    function Example() {
      const [value, setValue] = useState<'All' | 'Props' | 'Players'>('All');
      return <SegmentedControl value={value} options={['All', 'Props', 'Players'] as const} onChange={setValue} label="Saved type" />;
    }
    render(<Example />);
    const all = screen.getByRole('button', { name: 'All' });
    fireEvent.keyDown(all, { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: 'Props' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Props' })).toHaveFocus();
  });
});
