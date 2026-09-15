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
    const sportsNav = screen.getByRole('navigation', { name: 'Sports' });
    expect(sportsNav).toHaveClass('sports-scrollbar', 'overflow-x-auto', 'overflow-y-hidden');
    expect(sportsNav).not.toHaveClass('no-scrollbar');
    expect(await screen.findByRole('button', { name: 'Discrepancies' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Popular' }).length).toBeGreaterThan(0);
    const primary = screen.getByLabelText('Primary');
    expect(within(primary).getByText('Research')).toBeInTheDocument();
    expect(within(primary).getByText('Edge')).toBeInTheDocument();
    expect(within(primary).getByText('Workspace')).toBeInTheDocument();
    expect(within(primary).getByText('Tools')).toBeInTheDocument();
    expect(within(primary).getByRole('button', { name: 'Calculators' })).toBeInTheDocument();
    expect(within(primary).getByRole('button', { name: 'Promos' })).toBeInTheDocument();
    expect(within(primary).getByRole('button', { name: 'Guides' })).toBeInTheDocument();
    expect(within(primary).getByRole('button', { name: 'Open profile' })).toBeInTheDocument();
    expect(within(primary).queryByRole('button', { name: 'Help / Guide' })).not.toBeInTheDocument();
    const builder = screen.getByLabelText('Pick Builder');
    expect(builder).toHaveClass('w-14', 'min-w-[3.5rem]', 'max-w-[3.5rem]', 'shrink-0');
    fireEvent.click(screen.getByRole('button', { name: 'Expand Pick Builder' }));
    expect(builder).toHaveClass('w-72', 'min-w-[18rem]', 'max-w-[18rem]');
  });

  it('opens the placeholder calculator and guides tools', async () => {
    renderRoute('/dashboard/calculators');
    expect(await screen.findByRole('heading', { name: 'Calculators' })).toBeInTheDocument();
    expect(screen.getByText('Calculator modules will be added here', { exact: false })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Guides' })[0]);
    expect(await screen.findByRole('heading', { name: 'Guides' })).toBeInTheDocument();
    expect(screen.getByText('reserved for guides', { exact: false })).toBeInTheDocument();
  });

  it('shows a dismissible frontend-only Discord community prompt', async () => {
    const view = renderRoute('/dashboard/ev');
    const prompt = await screen.findByRole('dialog', { name: 'Join the Premium Picks Discord' });
    expect(prompt).toHaveTextContent('Connect Discord');

    fireEvent.click(within(prompt).getByRole('button', { name: 'Connect Discord' }));
    expect(within(prompt).getByRole('status')).toHaveTextContent('frontend preview and is not active yet');

    fireEvent.click(within(prompt).getByRole('button', { name: 'Maybe later' }));
    expect(screen.queryByRole('dialog', { name: 'Join the Premium Picks Discord' })).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem('arena-discord-prompt-dismissed')).toBe('true');

    view.unmount();
    renderRoute('/dashboard/props');
    expect(screen.queryByRole('dialog', { name: 'Join the Premium Picks Discord' })).not.toBeInTheDocument();
  });

  it('pairs sportsbook logos with the selected side price and filter choices', async () => {
    renderRoute('/dashboard/props');
    expect(await screen.findByRole('table', { name: 'Props research table' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Props filters' })).toHaveTextContent('Filters');

    const selectedOffers = screen.getAllByRole('button', { name: /Choose sportsbook offer\..*over/i });
    expect(selectedOffers.length).toBeGreaterThan(0);
    expect(selectedOffers[0]).toHaveAccessibleName(/line \d/i);
    expect(selectedOffers[0].querySelector('[data-sportsbook-logo="DK"]')).toBeInTheDocument();
    const selectedOfferRow = screen.getAllByRole('group', { name: /DraftKings sportsbook offer, line .* over .* under/i })[0];
    expect(selectedOfferRow).toHaveTextContent('DraftKings');
    expect(selectedOfferRow.querySelector('[data-other-offer-count="3"]')).toHaveTextContent('+3');
    expect(selectedOfferRow.querySelector('[aria-label^="Line "]')).toBeInTheDocument();
    expect(within(selectedOfferRow).getByRole('button', { name: /^over /i })).toBeInTheDocument();
    expect(within(selectedOfferRow).getByRole('button', { name: /^under /i })).toBeInTheDocument();

    fireEvent.click(selectedOffers[0]);
    const goblinOffer = screen.getByRole('button', { name: /FanDuel, goblin line/i });
    expect(goblinOffer.querySelector('img[src="/assets/green-goblin.png"]')).toBeInTheDocument();
    expect(screen.getAllByTitle('Best available over price').length).toBeGreaterThan(0);
    expect(screen.getAllByTitle('Best available under price').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'Sportsbooks' }));
    expect(document.querySelector('img[src="/assets/sportsbooks/fanatics.svg"]')).toBeInTheDocument();
    expect(document.querySelector('img[src="/assets/sportsbooks/bet365.svg"]')).toBeInTheDocument();
  });

  it('sorts projection difference directly from the Props table header', async () => {
    renderRoute('/dashboard/props');
    const table = await screen.findByRole('table', { name: 'Props research table' });

    fireEvent.click(screen.getByRole('button', { name: 'Sort by Projection descending' }));
    expect(within(within(table).getAllByRole('row')[1]).getByTitle(/Projection .* versus line/)).toHaveTextContent('+');

    fireEvent.click(screen.getByRole('button', { name: 'Sort by Projection ascending' }));
    expect(within(within(table).getAllByRole('row')[1]).getByTitle(/Projection .* versus line/)).toHaveTextContent('-');
  });

  it('uses continuous alternating surfaces for desktop research rows', async () => {
    renderRoute('/dashboard/props');
    const table = await screen.findByRole('table', { name: 'Props research table' });
    const [, firstRow, secondRow] = within(table).getAllByRole('row');

    expect(firstRow).toHaveClass('bg-[#0d1010]');
    expect(secondRow).toHaveClass('bg-[#121515]');
    expect(within(firstRow).getAllByRole('cell')[0]).toHaveClass('bg-[#0d1010]');
    expect(within(secondRow).getAllByRole('cell')[0]).toHaveClass('bg-[#121515]');
  });

  it('renders desktop player headshots as bottom-anchored card cutouts', async () => {
    renderRoute('/dashboard/props');
    const table = await screen.findByRole('table', { name: 'Props research table' });
    const firstPlayerCell = within(table).getAllByRole('row')[1].querySelector('td');
    const headshot = firstPlayerCell?.querySelector<HTMLImageElement>('img[src*="cdn.nba.com/headshots"]');

    expect(headshot).toHaveClass('absolute', 'bottom-0', 'object-contain', 'object-bottom');
    expect(headshot).toHaveAttribute('loading', 'eager');
    expect(headshot?.parentElement).toHaveClass('absolute', 'inset-y-0', 'overflow-hidden');
    expect(firstPlayerCell?.querySelector('button')).toHaveClass('pl-[72px]');
  });

  it('keeps line type and advanced controls in one filter surface', async () => {
    renderRoute('/dashboard/props');
    await screen.findByRole('table', { name: 'Props research table' });

    const toolbar = screen.getByRole('group', { name: 'Props filters' });
    expect(within(toolbar).getByRole('button', { name: 'Line Type' })).toBeInTheDocument();
    expect(within(toolbar).getByRole('button', { name: 'More Filters' })).toBeInTheDocument();

    fireEvent.click(within(toolbar).getByRole('button', { name: 'Line Type' }));
    expect(screen.getByRole('menuitemradio', { name: 'Goblins' }).querySelector('img[src="/assets/green-goblin.png"]')).toBeInTheDocument();
    expect(screen.getByRole('menuitemradio', { name: 'Devils' }).querySelector('img[src="/assets/red-devil.png"]')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Regular' }));
    fireEvent.click(within(toolbar).getByRole('button', { name: /Clear all/ }));

    expect(within(toolbar).queryByRole('button', { name: 'Status' })).not.toBeInTheDocument();
    expect(within(toolbar).getByRole('button', { name: 'Line Type' })).toBeInTheDocument();
    expect(within(toolbar).queryByRole('button', { name: 'Sort' })).not.toBeInTheDocument();
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
    const highestL5 = within(within(table).getAllByRole('row')[1]).getByTitle(/Last 5:/);
    expect(highestL5).toHaveTextContent('100%');
    expect(highestL5).toHaveClass('text-[#40f5d0]');

    fireEvent.click(screen.getByRole('button', { name: 'Sort by L5 ascending' }));
    const lowestL5 = within(within(table).getAllByRole('row')[1]).getByTitle(/Last 5:/);
    expect(lowestL5).toHaveTextContent('0%');
    expect(lowestL5).toHaveClass('text-[#ff817e]');
  }, 15_000);

  it('merges the old Projections destination into Props', async () => {
    renderRoute('/dashboard/projections');
    expect(await screen.findByRole('table', { name: 'Props research table' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Projections' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sort' })).not.toBeInTheDocument();
  });

  it('keeps shared team abbreviations scoped to the selected sport', async () => {
    renderRoute('/dashboard/matchups');
    fireEvent.click(await screen.findByRole('button', { name: 'NFL' }));

    expect(await screen.findByText('Dallas Cowboys', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Philadelphia Eagles', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Miami Dolphins', { exact: false })).toBeInTheDocument();
    expect(screen.queryByText('Dallas Mavericks', { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByAltText('Dallas Mavericks badge')).not.toBeInTheDocument();
  });
});
