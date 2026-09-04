import { describe, expect, it } from 'vitest';
import { SPORTS } from '@/features/dashboard/data';
import { PLAYER_MEDIA, SPORT_MEDIA, TEAM_MEDIA, playerMediaFor, teamMediaFor } from '@/features/dashboard/media-fixtures';

describe('dashboard media fixtures', () => {
  it('covers every sport tab with an HTTPS competition badge', () => {
    expect(Object.keys(SPORT_MEDIA)).toEqual(expect.arrayContaining(SPORTS));
    for (const sport of SPORTS) {
      expect(SPORT_MEDIA[sport].sourceEntityId).toMatch(/^\d+$/);
      expect(SPORT_MEDIA[sport].url).toMatch(/^https:\/\/r2\.thesportsdb\.com\/images\/media\/league\/badge\//);
    }
  });

  it('provides both badge and logo variants for every NBA demo team', () => {
    const nbaTeams = ['NYK', 'BOS', 'LAL', 'GSW', 'DEN', 'MIL', 'PHX', 'DAL', 'MIA', 'PHI', 'CLE', 'OKC', 'IND', 'CHI'];
    for (const team of nbaTeams) {
      expect(teamMediaFor(team)?.badgeUrl).toMatch(/^https:\/\//);
      expect(teamMediaFor(team)?.logoUrl).toMatch(/^https:\/\//);
    }
    expect(Object.keys(TEAM_MEDIA)).toHaveLength(nbaTeams.length);
  });

  it('allows unsupported teams to use the component fallback', () => {
    expect(teamMediaFor('UNKNOWN')).toBeUndefined();
  });

  it('covers every NBA demo player with a verified official headshot', () => {
    const nbaPlayers = [
      'NBA-jalen-brunson', 'NBA-jayson-tatum', 'NBA-lebron-james', 'NBA-stephen-curry',
      'NBA-nikola-jokic', 'NBA-giannis-antetokounmpo', 'NBA-kevin-durant', 'NBA-luka-doncic',
      'NBA-jimmy-butler', 'NBA-joel-embiid', 'NBA-donovan-mitchell', 'NBA-shai-gilgeous-alexander',
      'NBA-anthony-davis', 'NBA-tyrese-haliburton', 'NBA-devin-booker', 'NBA-zach-lavine',
    ];

    expect(Object.keys(PLAYER_MEDIA)).toHaveLength(nbaPlayers.length);
    for (const playerId of nbaPlayers) {
      expect(playerMediaFor(playerId)?.headshotUrl).toMatch(/^https:\/\/cdn\.nba\.com\/headshots\/nba\/latest\/1040x760\/\d+\.png$/);
    }
  });
});
