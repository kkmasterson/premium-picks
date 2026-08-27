import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    expect(screen.getByLabelText('Pick Builder')).toHaveClass('w-72', 'min-w-[18rem]', 'max-w-[18rem]', 'shrink-0');
  });
});
