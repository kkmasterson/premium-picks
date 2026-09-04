import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import App from '@/app/App';
import { playerById } from '@/features/dashboard/data';
import { mockPlayerResearchAdapter } from './adapter';
import { resolvePlayerScreenProfile } from './profiles';
import { usePlayerScreenState } from './usePlayerScreenState';

function SelectionHarness() {
  const player = playerById('WNBA-a-ja-wilson')!;
  const model = mockPlayerResearchAdapter.getPlayerResearch(player, resolvePlayerScreenProfile(player.sport, player.pos));
  const selection = usePlayerScreenState(model);
  const location = useLocation();
  return <div><span data-testid="location">{location.search}</span><span data-testid="selection">{selection.selectedMarket.definition.key}:{selection.line}:{selection.selectedPeriod.key}</span></div>;
}

describe('player-screen route state', () => {
  it('canonicalizes invalid market, line, and period values', async () => {
    render(<MemoryRouter initialEntries={['/test?market=missing&line=bad&period=nope']}><Routes><Route path="*" element={<SelectionHarness />} /></Routes></MemoryRouter>);
    await waitFor(() => expect(screen.getByTestId('selection')).toHaveTextContent(/^pts:/));
    await waitFor(() => expect(screen.getByTestId('location').textContent).toContain('market=pts'));
    expect(screen.getByTestId('location').textContent).toContain('period=full');
  });

  it('updates the selected line and saved-player state interactively', async () => {
    window.localStorage.clear();
    render(<MemoryRouter initialEntries={['/dashboard/players/WNBA-a-ja-wilson?market=pts&line=20&period=full']}><App /></MemoryRouter>);
    const increase = await screen.findByRole('button', { name: 'Increase line' });
    const displayedLine = screen.getByRole('textbox', { name: 'Prop line' }) as HTMLInputElement;
    expect(displayedLine).toHaveValue('20');
    fireEvent.click(increase);
    expect(displayedLine).toHaveValue('20.5');

    fireEvent.focus(displayedLine);
    expect(displayedLine.selectionStart).toBe(0);
    expect(displayedLine.selectionEnd).toBe(4);
    fireEvent.change(displayedLine, { target: { value: '24.5' } });
    fireEvent.keyDown(displayedLine, { key: 'Enter' });
    expect(displayedLine).toHaveValue('24.5');

    const save = screen.getByRole('button', { name: 'Save player' });
    fireEvent.click(save);
    expect(screen.getByRole('button', { name: 'Remove player from saved' })).toHaveTextContent('Saved');
  });

  it('keeps provider, period, and secondary-filter controls functional', async () => {
    render(<MemoryRouter initialEntries={['/dashboard/players/WNBA-a-ja-wilson?market=pts&line=20&period=full']}><App /></MemoryRouter>);

    const provider = await screen.findByRole('combobox', { name: 'Sportsbook provider' });
    fireEvent.click(provider);
    const sportsbookOffers = screen.getByRole('listbox', { name: 'Sportsbook offers' });
    const providerOption = within(sportsbookOffers)
      .getAllByRole('option')
      .find((option) => !option.textContent?.includes('All books'))!;
    fireEvent.click(providerOption);
    await waitFor(() => expect(provider).toHaveTextContent(/Line/));

    const firstQuarter = screen.getByRole('button', { name: '1Q' });
    fireEvent.click(firstQuarter);
    await waitFor(() => expect(firstQuarter).toHaveAttribute('aria-pressed', 'true'));

    const season = screen.getByRole('combobox', { name: 'Season' });
    fireEvent.change(season, { target: { value: 'previous' } });
    expect(season).toHaveValue('previous');
  });

  it('shows explicit Goblin and Devil art only for the selected classified offer', async () => {
    render(<MemoryRouter initialEntries={['/dashboard/players/NFL-patrick-mahomes?market=pass-yds&period=full']}><App /></MemoryRouter>);
    const provider = await screen.findByRole('combobox', { name: 'Sportsbook provider' });

    fireEvent.click(provider);
    fireEvent.click(screen.getByRole('option', { name: /FanDuel.*Goblin/i }));
    expect(screen.getByText(/Goblin · O/)).toBeInTheDocument();
    expect(document.querySelector('img[src="/assets/sportsbooks/fanduel.svg"]')).toBeInTheDocument();
    expect(document.querySelector('img[src="/assets/green-goblin.png"]')).toBeInTheDocument();
    expect(document.querySelector('img[src="/assets/red-devil.png"]')).not.toBeInTheDocument();

    fireEvent.click(provider);
    fireEvent.click(screen.getByRole('option', { name: /BetMGM.*Devil/i }));
    expect(screen.getByText(/Devil · O/)).toBeInTheDocument();
    expect(document.querySelector('img[src="/assets/sportsbooks/betmgm.jpg"]')).toBeInTheDocument();
    expect(document.querySelector('img[src="/assets/red-devil.png"]')).toBeInTheDocument();
    expect(document.querySelector('img[src="/assets/green-goblin.png"]')).not.toBeInTheDocument();
  });

  it('reveals event details immediately when a chart bar is hovered', async () => {
    render(<MemoryRouter initialEntries={['/dashboard/players/NFL-patrick-mahomes?market=pass-yds&period=full']}><App /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Recent Passing Yards' });
    const bar = document.querySelector('[data-testid^="history-bar-"]') as SVGElement;
    fireEvent.mouseEnter(bar);
    expect(screen.getByTestId('chart-tooltip')).toHaveTextContent('Click to keep details visible');
  });

  it('switches contextual modes and exposes the NHL unavailable state', async () => {
    const { unmount } = render(<MemoryRouter initialEntries={['/dashboard/players/WNBA-a-ja-wilson?market=pts&line=20&period=full']}><App /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('tab', { name: /Shooting/i }));
    expect(screen.getByText('Shot Profile vs Opponent Defense')).toBeInTheDocument();
    expect(screen.getByTestId('shot-zone-rim')).toHaveStyle({ left: '50%', top: '82%' });
    expect(screen.getByTestId('shot-zone-left-corner')).toHaveStyle({ left: '13%', top: '83%' });
    expect(screen.getByTestId('shot-zone-right-corner')).toHaveStyle({ left: '87%', top: '83%' });
    unmount();
    render(<MemoryRouter initialEntries={['/dashboard/players/NHL-connor-mcdavid']}><App /></MemoryRouter>);
    expect(await screen.findByText('Analysis Awaiting Reference')).toBeInTheDocument();
    expect(screen.getAllByText(/awaiting a validated reference/i)).toHaveLength(1);
  });
});
