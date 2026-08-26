import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import App from '@/app/App';

function renderPlayer(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
}

describe('sport-specific player modules', () => {
  it('renders running-back usage and position-aware defense', async () => {
    renderPlayer('/dashboard/players/NFL-christian-mccaffrey?market=rush-rec-yds&period=full');
    expect(await screen.findByText('SF Pass vs Run Rate')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Defense' }));
    expect(screen.getByText('Defense vs RB')).toBeInTheDocument();
  });

  it('renders pitcher, goalkeeper, and tennis research modes', async () => {
    const pitcher = renderPlayer('/dashboard/players/MLB-gerrit-cole');
    fireEvent.click(await screen.findByRole('tab', { name: 'Pitch Arsenal' }));
    expect(screen.getByRole('button', { name: 'Slider' })).toBeInTheDocument();
    pitcher.unmount();

    const goalkeeper = renderPlayer('/dashboard/players/SOCCER-thibaut-courtois');
    fireEvent.click(await screen.findByRole('tab', { name: 'Team Stats' }));
    expect(screen.getByText('Team Stats Comparison')).toBeInTheDocument();
    goalkeeper.unmount();

    renderPlayer('/dashboard/players/TENNIS-coco-gauff');
    expect(screen.getByTestId('h2h-player')).toHaveClass('items-center');
    expect(screen.getByTestId('h2h-opponent')).toHaveClass('items-center');
    fireEvent.click(await screen.findByRole('tab', { name: 'H2H' }));
    expect(screen.getByText('3-2 career record')).toBeInTheDocument();
  });

  it('positions soccer players in role-correct 4-3-3 rows', async () => {
    renderPlayer('/dashboard/players/SOCCER-bukayo-saka');
    fireEvent.click(await screen.findByRole('tab', { name: 'Lineups' }));
    expect(screen.getByRole('group', { name: 'Soccer 4-3-3 formation, attacking upward' })).toBeInTheDocument();
    expect(screen.getByTestId('formation-slot-gk-0')).toHaveStyle({ left: '50%', top: '91%' });
    expect(screen.getByTestId('formation-slot-d-0')).toHaveStyle({ left: '14%', top: '70%' });
    expect(screen.getByTestId('formation-slot-m-1')).toHaveStyle({ left: '50%', top: '43%' });
    expect(screen.getByTestId('formation-slot-f-1')).toHaveStyle({ left: '50%', top: '16%' });
  });

  it('renders map availability, esports stats, and team form without invented odds', async () => {
    renderPlayer('/dashboard/players/CS2-zywoo?market=kills&period=series');
    fireEvent.click(await screen.findByRole('tab', { name: 'Maps' }));
    expect(screen.getByText('Map Picks and Availability')).toBeInTheDocument();
    expect(screen.getByText('ODDS N/A')).toBeInTheDocument();
  });
});
