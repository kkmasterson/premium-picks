import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from '@/app/App';

function renderRoute(route: string) {
  return render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
}

describe('expanded dashboard destinations', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('renders discrepancies and adds a provider-targeted selection to the Pick Builder', async () => {
    const view = renderRoute('/dashboard/discrepancies');
    expect(await screen.findByRole('heading', { name: 'Discrepancies' })).toBeInTheDocument();
    expect(screen.getByText('Largest differences first')).toBeInTheDocument();

    const addButtons = await screen.findAllByRole('button', { name: 'Add minimum line' });
    fireEvent.click(addButtons[0]);
    expect(await screen.findAllByRole('button', { name: 'Update Pick Builder' })).not.toHaveLength(0);
    expect(screen.getByLabelText('Pick Builder')).toHaveTextContent('1 research selection');

    await waitFor(() => expect(JSON.parse(window.localStorage.getItem('pp-pick-builder') ?? '[]')).toHaveLength(1));
    view.unmount();
    renderRoute('/dashboard/props');
    expect(screen.getByLabelText('Pick Builder')).toHaveTextContent('1 research selection');
  });

  it('renders community popularity and returns to Popular from player research', async () => {
    renderRoute('/dashboard/popular');
    expect(await screen.findByRole('heading', { name: 'Popular' })).toBeInTheDocument();
    expect(screen.getByText('Most saved props')).toBeInTheDocument();

    const addButtons = await screen.findAllByRole('button', { name: /Add .* to Pick Builder/ });
    fireEvent.click(addButtons[0]);
    expect(await screen.findAllByRole('button', { name: /Remove .* from Pick Builder/ })).not.toHaveLength(0);

    fireEvent.click(screen.getAllByRole('button', { name: 'Research' })[0]);
    expect(await screen.findByRole('button', { name: 'Back to Popular' })).toBeInTheDocument();
  });

  it('exposes both new destinations in the desktop navigation', async () => {
    renderRoute('/dashboard/props');
    expect(await screen.findByRole('button', { name: 'Discrepancies' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Popular' }).length).toBeGreaterThan(0);
    const builder = screen.getByLabelText('Pick Builder');
    expect(builder).toHaveClass('w-14', 'min-w-[3.5rem]', 'max-w-[3.5rem]', 'shrink-0');
    fireEvent.click(screen.getByRole('button', { name: 'Expand Pick Builder' }));
    expect(builder).toHaveClass('w-72', 'min-w-[18rem]', 'max-w-[18rem]');
  });

  it('pairs sportsbook logos with the selected side price and filter choices', async () => {
    renderRoute('/dashboard/props');
    expect(await screen.findByRole('heading', { name: /Player Props/ })).toBeInTheDocument();

    const selectedOffers = screen.getAllByRole('button', { name: /Choose sportsbook offer\..*over/i });
    expect(selectedOffers.length).toBeGreaterThan(0);
    expect(selectedOffers[0]).toHaveAccessibleName(/line \d/i);
    expect(selectedOffers[0].querySelector('[data-sportsbook-logo="DK"]')).toBeInTheDocument();

    fireEvent.click(selectedOffers[0]);
    const goblinOffer = screen.getByRole('button', { name: /FanDuel, goblin line/i });
    expect(goblinOffer.querySelector('img[src="/assets/green-goblin.png"]')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sportsbooks' }));
    expect(document.querySelector('img[src="/assets/sportsbooks/fanatics.svg"]')).toBeInTheDocument();
    expect(document.querySelector('img[src="/assets/sportsbooks/bet365.svg"]')).toBeInTheDocument();
  });

  it('sorts the new Props table by positive or negative projection difference', async () => {
    renderRoute('/dashboard/props');
    const table = await screen.findByRole('table', { name: 'Props research table' });

    fireEvent.click(screen.getByRole('button', { name: 'Largest Positive Diff' }));
    expect(screen.getByRole('button', { name: 'Largest Positive Diff' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(within(table).getAllByRole('row')[1]).getByTitle(/Projection .* versus line/)).toHaveTextContent('+');

    fireEvent.click(screen.getByRole('button', { name: 'Largest Negative Diff' }));
    expect(screen.getByRole('button', { name: 'Largest Negative Diff' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(within(table).getAllByRole('row')[1]).getByTitle(/Projection .* versus line/)).toHaveTextContent('-');
  });

  it('sorts every research metric in descending or ascending order', async () => {
    renderRoute('/dashboard/props');
    const table = await screen.findByRole('table', { name: 'Props research table' });

    for (const label of ['Moneyline', 'Projection', 'Confidence', 'L5', 'L10', 'L15', 'H2H', 'Streak', '+EV']) {
      fireEvent.click(screen.getByRole('button', { name: `Sort by ${label} descending` }));
      expect(screen.getByRole('columnheader', { name: label })).toHaveAttribute('aria-sort', 'descending');
    }

    fireEvent.click(screen.getByRole('button', { name: 'Sort by +EV ascending' }));
    expect(screen.getByRole('columnheader', { name: '+EV' })).toHaveAttribute('aria-sort', 'ascending');

    fireEvent.click(screen.getByRole('button', { name: 'Sort by L5 descending' }));
    expect(within(within(table).getAllByRole('row')[1]).getByTitle(/Last 5:/)).toHaveTextContent('100%');

    fireEvent.click(screen.getByRole('button', { name: 'Sort by L5 ascending' }));
    expect(within(within(table).getAllByRole('row')[1]).getByTitle(/Last 5:/)).toHaveTextContent('0%');
  }, 15_000);

  it('merges the old Projections destination into Props', async () => {
    renderRoute('/dashboard/projections');
    expect(await screen.findByRole('heading', { name: /Player Props/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Projections' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Largest Positive Diff' })).toHaveAttribute('aria-pressed', 'true');
  });
});
