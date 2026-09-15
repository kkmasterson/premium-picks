import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, expect, it, vi } from 'vitest';
import { LiveOdds, NbaDirectory } from './components/FreeDataViews';

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
it('searches only imported player identities and never substitutes fixtures for an unavailable feed', async () => {
  const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: { observedAt: new Date().toISOString(), complete: true, teams: [], leagueImage: null, players: [{ id: 'f4000000-0000-4000-8000-000000000001', name: 'Imported Player', teamId: null, position: 'G', height: null, country: null, image: null }] }, freshness: 'fresh' }) });
  vi.stubGlobal('fetch', fetcher);
  render(<NbaDirectory />);
  expect(await screen.findByText('Imported Player')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Search NBA directory'), { target: { value: 'LeBron' } });
  expect(screen.getByText('No directory entries match your search.')).toBeInTheDocument();
  fetcher.mockResolvedValue({ ok: true, json: async () => ({ data: null, freshness: 'unavailable' }) });
  fireEvent.click(screen.getByText('Reload saved data'));
  expect(await screen.findByText('Directory unavailable. No demo records are substituted.')).toBeInTheDocument();
});
it('ages displayed odds without provider polling and removes best-price highlighting', async () => {
  vi.useFakeTimers();
  const at = new Date().toISOString();
  const snapshot = { eventId: 'f4000000-0000-4000-8000-000000000001', observedAt: at, markets: ['Points'], creditsRemaining: 496, quotes: [{ book: 'Book', market: 'Points', subject: 'Imported Player', side: 'Over', line: 20.5, decimal: 2, updatedAt: at, implied: 0.5, noVig: 0.5, best: true, consensus: 0.5, disagreement: 0 }] };
  const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: { current: snapshot, history: [snapshot], alerts: [] }, freshness: 'fresh' }) });
  vi.stubGlobal('fetch', fetcher);
  render(<MemoryRouter><LiveOdds /></MemoryRouter>);
  await act(async () => {});
  expect(screen.getByText('Best observed')).toBeInTheDocument();
  await act(async () => { vi.advanceTimersByTime(16 * 60000); });
  expect(screen.queryByText('Best observed')).not.toBeInTheDocument();
  expect(screen.getByText(/Observed .*Stale prices/)).toBeInTheDocument();
  expect(fetcher).toHaveBeenCalledTimes(1);
});
