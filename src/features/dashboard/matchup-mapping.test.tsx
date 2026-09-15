import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import type { ScheduleGame } from '@arena/contracts';
import { DashboardProvider } from './DashboardProvider';
import { MatchupsPage, GamePage } from './pages/MatchupsPage';
import { SavedPage } from './pages/SavedPage';
import { scheduleMatchup } from './matchup-view';
import { TeamBadge } from './components/EntityMedia';
import { scheduleResponse } from '../../../server/api/schedule';

const first: ScheduleGame = {
  competition: 'nba', homeScore: null, awayScore: null, period: 0, clock: null,
  id: 'fa000000-0000-4000-8000-000000000001', date: '2026-10-04', startsAt: '2026-10-04T01:30:00Z', state: 'scheduled',
  away: { id: 'aa000000-0000-4000-8000-000000000001', name: 'Los Angeles Lakers', abbreviation: 'LAL' },
  home: { id: 'aa000000-0000-4000-8000-000000000002', name: 'Golden State Warriors', abbreviation: 'GSW' },
};
const later: ScheduleGame = { ...first, id: 'fa000000-0000-4000-8000-000000000002', date: '2026-11-06', startsAt: null, state: 'postponed' };
function setup(route = '/dashboard/matchups', games = [later, first]) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => scheduleResponse({ games, windowStart: '2026-09-01', windowEnd: '2027-08-31', observedAt: new Date().toISOString(), generation: 'fa000000-0000-4000-8000-000000000003' }) }));
  return render(<MemoryRouter initialEntries={[route]}><DashboardProvider><Routes>
    <Route path="/dashboard/matchups" element={<MatchupsPage />} />
    <Route path="/dashboard/matchups/:gameId" element={<GamePage />} />
    <Route path="/dashboard/saved" element={<SavedPage />} />
  </Routes></DashboardProvider></MemoryRouter>);
}
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
afterEach(() => vi.unstubAllGlobals());

it('keeps every date, correct Arizona day, canonical links, and unavailable coverage despite matching fixture teams', async () => {
  setup();
  const links = await screen.findAllByRole('link');
  expect(links).toHaveLength(2);
  expect(links[0]).toHaveAttribute('href', `/dashboard/matchups/${first.id}`);
  expect(links[0]).toHaveTextContent('2026-10-03 · 6:30 PM AZ · Scheduled');
  expect(links[1]).toHaveTextContent('2026-11-06 · Time TBD · Postponed');
  expect(within(links[0]).getAllByText('unavailable')).toHaveLength(3);
  expect(scheduleMatchup(first).counts).toEqual({ props: null, players: null, books: null });
  fireEvent.click(links[0]);
  expect(await screen.findByRole('heading', { name: 'LAL @ GSW' })).toBeInTheDocument();
  expect(await screen.findByText('No sportsbook snapshot has been collected for this game.')).toBeInTheDocument();
});

it('saves the canonical event without opening it, then resolves and removes it on Saved', async () => {
  const view = setup();
  const button = (await screen.findAllByRole('button', { name: /^Save game:/ }))[0];
  fireEvent.click(button);
  expect(screen.getByRole('heading', { name: 'NBA Matchups' })).toBeInTheDocument();
  await waitFor(() => expect(JSON.parse(localStorage.getItem('pp-saved')!).games).toEqual([first.id]));
  view.unmount();
  setup('/dashboard/saved');
  const gameLink = await screen.findByRole('link', { name: /Los Angeles Lakers at Golden State Warriors/ });
  expect(gameLink).toHaveAttribute('href', `/dashboard/matchups/${first.id}`);
  fireEvent.click(screen.getByRole('button', { name: /^Remove game from saved:/ }));
  expect(await screen.findByText('No saved research yet')).toBeInTheDocument();
});

it('retains an unresolved imported bookmark instead of dropping it or resolving fixture data', async () => {
  localStorage.setItem('pp-saved', JSON.stringify({ props: [], players: [], games: [first.id] }));
  setup('/dashboard/saved', []);
  expect(await screen.findByText('Saved game unavailable')).toBeInTheDocument();
  expect(screen.getByText('1 saved')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('pp-saved')!).games).toEqual([first.id]);
});

it('uses the shared row for demo sports without requesting an NBA schedule', async () => {
  localStorage.setItem('pp-sport', 'NFL');
  setup();
  expect(await screen.findByRole('heading', { name: "Today's Matchups" })).toBeInTheDocument();
  expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
  expect(fetch).not.toHaveBeenCalled();
});

it('does not show a known badge for a conflicting team name', () => {
  render(<TeamBadge team="LAL" name="Different Team" sport="NBA" />);
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(screen.getByLabelText('LAL team badge unavailable')).toBeInTheDocument();
});
