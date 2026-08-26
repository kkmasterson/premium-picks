import { describe, expect, it } from 'vitest';
import { playerById } from '@/features/dashboard/data';
import { mockPlayerResearchAdapter } from './adapter';
import { marketKeyForName, resolvePlayerScreenProfile } from './profiles';
import { filterMarketSnapshot } from './usePlayerResearchFilters';

describe('player-screen profile resolution', () => {
  it('resolves basketball proxies and football position variants', () => {
    expect(resolvePlayerScreenProfile('WNBA', 'F').family).toBe('basketball');
    expect(resolvePlayerScreenProfile('NBA', 'PG').id).toBe('basketball-player');
    expect(resolvePlayerScreenProfile('NCAAB', 'C').id).toBe('basketball-player');
    expect(resolvePlayerScreenProfile('NFL', 'QB').id).toBe('football-quarterback');
    expect(resolvePlayerScreenProfile('NFL', 'RB').id).toBe('football-running-back');
    expect(resolvePlayerScreenProfile('NFL', 'WR').id).toBe('football-wide-receiver');
    expect(resolvePlayerScreenProfile('NFL', 'TE').id).toBe('football-tight-end');
    expect(resolvePlayerScreenProfile('NFL', 'K').id).toBe('football-kicker');
  });

  it('resolves specialized baseball, soccer, tennis, esports, and hockey profiles', () => {
    expect(resolvePlayerScreenProfile('MLB', 'SP').id).toBe('baseball-starting-pitcher');
    expect(resolvePlayerScreenProfile('MLB', 'RF').id).toBe('baseball-hitter');
    expect(resolvePlayerScreenProfile('SOCCER', 'GK').id).toBe('soccer-goalkeeper');
    expect(resolvePlayerScreenProfile('TENNIS', 'Singles').id).toBe('tennis-singles');
    expect(resolvePlayerScreenProfile('LOL', 'Top').id).toBe('esports-lol');
    expect(resolvePlayerScreenProfile('CS2', 'AWP').id).toBe('esports-cs2');
    expect(resolvePlayerScreenProfile('VALORANT', 'Duelist').id).toBe('esports-valorant');
    expect(resolvePlayerScreenProfile('NHL', 'C').id).toBe('hockey-shared-shell');
  });

  it('normalizes prop names for deep-link navigation', () => {
    expect(marketKeyForName('Points')).toBe('pts');
    expect(marketKeyForName('Passing Yards')).toBe('pass-yds');
    expect(marketKeyForName('Assists', 'CS2', 'AWP')).toBe('assists');
  });
});

describe('mock player research adapter', () => {
  it('produces a normalized WNBA model with explicit DNP and component data', () => {
    const player = playerById('WNBA-a-ja-wilson');
    expect(player).toBeDefined();
    const profile = resolvePlayerScreenProfile(player!.sport, player!.pos);
    const model = mockPlayerResearchAdapter.getPlayerResearch(player!, profile);
    expect(model.defaultMarketKey).toBe('pts');
    expect(model.markets.find((item) => item.definition.key === '3pa')?.available).toBe(true);
    expect(model.markets.find((item) => item.definition.key === 'pts')?.history.some((entry) => entry.availability === 'dnp')).toBe(true);
    expect(model.markets.find((item) => item.definition.key === 'rebs')?.history.some((entry) => entry.components?.length === 2)).toBe(true);
  });

  it('produces map components for esports series charts', () => {
    const player = playerById('CS2-zywoo');
    expect(player).toBeDefined();
    const profile = resolvePlayerScreenProfile(player!.sport, player!.pos);
    const model = mockPlayerResearchAdapter.getPlayerResearch(player!, profile);
    expect(model.markets[0].history[0].components).toHaveLength(3);
  });

  it('produces period snapshots and documented markets for every profile', () => {
    const playerIds = ['NFL-patrick-mahomes', 'NFL-christian-mccaffrey', 'NFL-ceedee-lamb', 'NFL-travis-kelce', 'NFL-justin-tucker', 'MLB-aaron-judge', 'MLB-gerrit-cole', 'SOCCER-thibaut-courtois', 'TENNIS-coco-gauff', 'LOL-faker', 'CS2-zywoo', 'VALORANT-tenz'];
    playerIds.forEach((id) => {
      const player = playerById(id)!;
      const profile = resolvePlayerScreenProfile(player.sport, player.pos);
      const model = mockPlayerResearchAdapter.getPlayerResearch(player, profile);
      expect(Object.keys(model.marketsByPeriod)).toHaveLength(profile.periods.length);
      expect(model.markets.every((item) => item.available && item.history.length > 0)).toBe(true);
      expect(profile.filters.length).toBeGreaterThan(0);
      expect(profile.primaryModules).toContain('game-log');
    });
  });

  it('builds role-specific component bars and discriminated payloads', () => {
    const cases = [
      ['NFL-christian-mccaffrey', 'rush-rec-yds', 'football'],
      ['NFL-ceedee-lamb', 'receptions', 'football'],
      ['SOCCER-thibaut-courtois', 'saves', 'soccer'],
      ['TENNIS-coco-gauff', 'break-points', 'tennis'],
      ['CS2-zywoo', 'kills', 'esports'],
    ] as const;
    cases.forEach(([id, marketKey, family]) => {
      const player = playerById(id)!;
      const model = mockPlayerResearchAdapter.getPlayerResearch(player, resolvePlayerScreenProfile(player.sport, player.pos));
      expect(model.sportPayload.family).toBe(family);
      expect(model.markets.find((item) => item.definition.key === marketKey)?.history[0].components?.length).toBeGreaterThan(1);
    });
    const pitcher = playerById('MLB-gerrit-cole')!;
    const pitcherModel = mockPlayerResearchAdapter.getPlayerResearch(pitcher, resolvePlayerScreenProfile(pitcher.sport, pitcher.pos));
    expect(pitcherModel.sportPayload.family).toBe('baseball');
    if (pitcherModel.sportPayload.family === 'baseball') expect(pitcherModel.sportPayload.pitchArsenal).toHaveLength(4);
  });

  it('filters history and recalculates market summaries', () => {
    const player = playerById('NFL-patrick-mahomes')!;
    const model = mockPlayerResearchAdapter.getPlayerResearch(player, resolvePlayerScreenProfile(player.sport, player.pos));
    const market = model.markets[0];
    const opponent = market.history[0].opponent;
    const filtered = filterMarketSnapshot(market, { opponent, season: 'all', homeAway: 'all', team: 'all', event: 'all', courtType: 'all' }, market.canonicalLine);
    expect(filtered.history.length).toBeGreaterThan(0);
    expect(filtered.history.every((entry) => entry.opponent === opponent)).toBe(true);
    expect(filtered.hitRates.l5 === null || filtered.hitRates.l5 >= 0).toBe(true);
  });
});
