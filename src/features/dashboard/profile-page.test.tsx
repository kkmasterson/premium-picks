import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from '@/app/App';

function renderProfile(route = '/dashboard/profile') {
  return render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
}

describe('account profile', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.setItem('arena-discord-prompt-dismissed', 'true');
  });

  it('opens from the account menu and keeps Settings on the profile screen', async () => {
    renderProfile('/dashboard/props');
    fireEvent.pointerDown(await screen.findByRole('button', { name: 'Account menu' }));
    const profileLink = await screen.findByRole('menuitem', { name: 'Profile' });
    expect(screen.queryByRole('menuitem', { name: 'Settings' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Subscription' })).not.toBeInTheDocument();
    fireEvent.click(profileLink);
    expect(await screen.findByRole('heading', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage billing' })).toBeInTheDocument();
  });

  it('keeps old subscription links on the profile overview', async () => {
    renderProfile('/dashboard/profile?panel=subscription');
    expect(await screen.findByRole('heading', { name: 'About' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Subscription' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage billing' })).toBeInTheDocument();
  });

  it('edits and persists profile details in the interactive preview', async () => {
    const view = renderProfile();
    fireEvent.click(await screen.findByRole('button', { name: 'Edit profile' }));
    const displayName = screen.getByLabelText('Display name');
    fireEvent.change(displayName, { target: { value: 'Kaleb Davis' } });
    fireEvent.click(screen.getByRole('radio', { name: /FanDuel/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Profile changes saved');
    expect(screen.getAllByText('Kaleb Davis').length).toBeGreaterThan(0);
    expect(JSON.parse(window.localStorage.getItem('arena-profile') ?? '{}')).toMatchObject({ displayName: 'Kaleb Davis', favoriteSportsbook: 'FD' });
    expect(screen.getByText('FanDuel')).toBeInTheDocument();

    view.unmount();
    renderProfile();
    expect((await screen.findAllByText('Kaleb Davis')).length).toBeGreaterThan(0);
  });

  it('saves profile settings and applies dashboard density', async () => {
    renderProfile('/dashboard/profile?panel=settings');
    expect(await screen.findByRole('heading', { name: 'Research preferences' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Decimal/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Compact' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Product updates' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));

    await waitFor(() => expect(window.localStorage.getItem('pp-density')).toBe('compact'));
    expect(JSON.parse(window.localStorage.getItem('arena-profile-preferences') ?? '{}')).toMatchObject({ oddsFormat: 'Decimal', productUpdates: true });
    expect(screen.getByRole('status')).toHaveTextContent('Settings saved');
  });
});
