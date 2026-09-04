import { describe, expect, it } from 'vitest';
import { SPORTS } from '@/features/dashboard/data';
import { SPORT_MEDIA, TEAM_MEDIA, teamMediaFor } from '@/features/dashboard/media-fixtures';

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
});
