import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import { DashboardProvider } from '@/features/dashboard/DashboardProvider';
import { PROPS } from '@/features/dashboard/data';
import { PropsTable } from './PropsTable';

describe('PropsTable density', () => {
  beforeEach(() => window.localStorage.clear());

  it('switches to compact rows and persists the selection', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/props']}>
        <DashboardProvider>
          <PropsTable props={PROPS.slice(0, 2)} />
        </DashboardProvider>
      </MemoryRouter>,
    );

    const compact = screen.getByRole('button', { name: 'compact' });
    fireEvent.click(compact);

    expect(compact).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(window.localStorage.getItem('pp-density')).toBe('compact'));
  });

  it('keeps extra sportsbook lines in a popover instead of adding row height', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/props']}>
        <DashboardProvider>
          <PropsTable props={PROPS.slice(0, 1)} />
        </DashboardProvider>
      </MemoryRouter>,
    );

    const moreBooks = screen.getByRole('button', { name: /Show \d+ more sportsbook lines/i });
    fireEvent.click(moreBooks);

    expect(await screen.findByRole('dialog')).toHaveAttribute('data-slot', 'popover-content');
  });
});
