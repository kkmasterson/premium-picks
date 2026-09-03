import { BOOKS, propsForPlayer } from '@/features/dashboard/data';
import { propBoardRowById } from '@/features/dashboard/props-fixtures';
import type { GameLogEntry, Player, Prop } from '@/features/dashboard/types';
import type { ChartPreset, DepthChartEntry, FilterOption, MarketDefinition, MarketSnapshot, PlayerFilterKey, PlayerResearchAdapter, PlayerResearchViewModel, PlayerScreenProfile, ResearchHistoryEntry, SportModulePayload } from './types';

function hash(input: string): number {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function fixtureNumber(key: string, min: number, max: number): number {
  return min + (hash(key) % Math.max(1, max - min + 1));
}

function round(value: number, step = 0.5): number {
  return Math.max(step, Math.round(value / step) * step);
}

function periodScale(periodKey: string): number {
  if (periodKey === '1q' || periodKey === '4q') return 0.26;
  if (periodKey === '1h' || periodKey === '2h') return 0.52;
  if (periodKey.startsWith('set-')) return 0.42;
  if (periodKey.startsWith('map-')) return 0.36;
  return 1;
}

function estimatedLine(player: Player, profile: PlayerScreenProfile, definition: MarketDefinition): number {
  const name = definition.market.toLowerCase();
  let value = 5.5;
  if (name.includes('percentage') || name.includes('%')) value = 62;
  else if (name.includes('passing yards')) value = 255.5;
  else if (name.includes('rushing + receiving')) value = 88.5;
  else if (name.includes('receiving yards')) value = 64.5;
  else if (name.includes('rushing yards')) value = player.pos === 'QB' ? 28.5 : 72.5;
  else if (name.includes('longest')) value = 24.5;
  else if (name.includes('pass attempts')) value = 33.5;
  else if (name.includes('pass completions') || name === 'completions') value = 22.5;
  else if (name.includes('rush attempts')) value = player.pos === 'QB' ? 5.5 : 15.5;
  else if (name.includes('target')) value = 7.5;
  else if (name.includes('reception')) value = 4.5;
  else if (name.includes('touchdown')) value = 1.5;
  else if (name.includes('kicking points')) value = 7.5;
  else if (name.includes('field goals')) value = 2;
  else if (name.includes('extra points')) value = 2;
  else if (name.includes('minutes')) value = 31;
  else if (name.includes('points + rebounds + assists')) value = 32.5;
  else if (name.includes('points +')) value = 26.5;
  else if (name === 'points') value = profile.family === 'basketball' ? 20.5 : 0.5;
  else if (name.includes('rebound')) value = 7.5;
  else if (name.includes('assist')) value = profile.family === 'esports' ? 10.5 : profile.family === 'basketball' ? 5.5 : 0.5;
  else if (name.includes('strikeout')) value = player.pos === 'SP' ? 6.5 : 1.5;
  else if (name.includes('pitching outs')) value = 17.5;
  else if (name.includes('pitches')) value = 92.5;
  else if (name.includes('hits allowed')) value = 5.5;
  else if (name.includes('walk')) value = 2.5;
  else if (name === 'hits' || name.includes('total bases')) value = 1.5;
  else if (name.includes('passes')) value = 54.5;
  else if (name.includes('save')) value = profile.family === 'tennis' ? 4.5 : 3.5;
  else if (name.includes('games won')) value = 12.5;
  else if (name.includes('aces')) value = 7.5;
  else if (name.includes('break points')) value = 4.5;
  else if (name === 'kills') value = player.sport === 'LOL' ? 4.5 : 36.5;
  else if (name.includes('headshot')) value = 17.5;
  else if (name === 'cs') value = 276.5;
  value *= 0.9 + fixtureNumber(`${player.id}-${definition.key}-line`, 0, 20) / 100;
  return round(value, definition.step);
}

function supportingValue(label: string, key: string, primaryValue: number): number {
  const normalized = label.toLowerCase();
  if (normalized.includes('minute')) return fixtureNumber(key, 24, 38);
  if (normalized.includes('percentage') || normalized.includes('%') || normalized.includes('accuracy')) return fixtureNumber(key, 48, 91);
  if (normalized.includes('pass yards')) return fixtureNumber(key, 180, 330);
  if (normalized.includes('rush yards')) return fixtureNumber(key, 18, 112);
  if (normalized.includes('receiving yards')) return fixtureNumber(key, 15, 108);
  if (normalized.includes('attempt') || normalized.includes('target') || normalized.includes('touch')) return fixtureNumber(key, 4, 34);
  if (normalized.includes('snap') || normalized.includes('team play')) return fixtureNumber(key, 38, 74);
  if (normalized.includes('pitch')) return fixtureNumber(key, 72, 108);
  if (normalized.includes('inning')) return fixtureNumber(key, 4, 8);
  if (normalized.includes('serve')) return fixtureNumber(key, 48, 78);
  if (normalized.includes('gold') || normalized === 'cs') return fixtureNumber(key, 180, 390);
  if (normalized === 'kda' || normalized.includes('ratio')) return Math.round((1 + fixtureNumber(key, 1, 24) / 10) * 10) / 10;
  return Math.max(0, Math.round(primaryValue * (0.35 + fixtureNumber(key, 0, 80) / 100)));
}

function componentsFor(preset: ChartPreset, value: number, key: string): Array<{ label: string; value: number }> | undefined {
  if (preset === 'rebounds') {
    const offensive = Math.max(0, Math.round(value * 0.28));
    return [{ label: 'O-REB', value: offensive }, { label: 'D-REB', value: Math.max(0, value - offensive) }];
  }
  if (preset === 'football-combined') {
    const rush = Math.max(0, Math.round(value * (0.55 + fixtureNumber(`${key}-rush`, 0, 20) / 100)));
    return [{ label: 'RUSH', value: rush }, { label: 'REC', value: Math.max(0, value - rush) }];
  }
  if (preset === 'receiving-opportunity') {
    const targets = Math.max(value, value + fixtureNumber(`${key}-targets`, 1, 6));
    return [{ label: 'REC', value }, { label: 'UNCAUGHT TARGETS', value: targets - value }];
  }
  if (preset === 'tennis-break-points') return [{ label: 'WON', value }, { label: 'MISSED', value: fixtureNumber(`${key}-missed`, 1, 6) }];
  if (preset === 'soccer-saves') return [{ label: 'SAVES', value }, { label: 'GOALS ALLOWED', value: fixtureNumber(`${key}-goals`, 0, 3) }];
  if (preset === 'esports-maps') {
    const first = Math.max(0, Math.round(value * 0.34));
    const second = Math.max(0, Math.round(value * 0.36));
    return [{ label: 'Map 1', value: first }, { label: 'Map 2', value: second }, { label: 'Map 3', value: Math.max(0, value - first - second) }];
  }
  return undefined;
}

function historyFor(player: Player, profile: PlayerScreenProfile, definition: MarketDefinition, periodKey: string, template?: Prop): ResearchHistoryEntry[] {
  const scale = periodScale(periodKey);
  const line = round(estimatedLine(player, profile, definition) * scale, definition.step);
  const preset = definition.chartPreset ?? profile.chartPreset;
  const source: GameLogEntry[] = template?.gameLog ?? Array.from({ length: 15 }, (_, index) => ({ date: `Week ${15 - index}`, opp: player.opponent, home: index % 2 === 0, minutes: 0, value: 0, line, over: false }));
  return source.slice(0, 15).map((entry, index) => {
    const unavailable = index === 6 && profile.family !== 'tennis';
    const swing = 0.56 + fixtureNumber(`${player.id}-${definition.key}-${periodKey}-${index}`, 0, 92) / 100;
    const value = round(line * swing, definition.step >= 1 ? 1 : definition.step);
    return {
      id: `${player.id}-${definition.key}-${periodKey}-${index}`,
      date: entry.date,
      opponent: entry.opp,
      home: entry.home,
      availability: unavailable ? 'dnp' : 'played',
      value: unavailable ? null : value,
      line: unavailable ? null : line,
      minutes: unavailable ? null : supportingValue('Minutes', `${player.id}-minutes-${index}`, value),
      seasonKey: index < 10 ? 'current' : 'previous',
      eventKey: index % 2 === 0 ? 'featured' : 'tour',
      teamKey: index < 12 ? player.team : 'previous-team',
      courtType: ['hard', 'clay', 'grass'][index % 3],
      components: unavailable ? undefined : componentsFor(preset, value, `${player.id}-${definition.key}-${index}`),
      supporting: Object.fromEntries(profile.supportingStats.map((label) => [label, unavailable ? null : supportingValue(label, `${player.id}-${definition.key}-${label}-${index}`, value)])),
    };
  });
}

function rate(history: ResearchHistoryEntry[], line: number, count?: number): number | null {
  const played = history.filter((entry) => entry.availability === 'played' && entry.value !== null).slice(0, count);
  return played.length ? Math.round((played.filter((entry) => (entry.value ?? 0) > line).length / played.length) * 100) : null;
}

function marketSnapshot(player: Player, profile: PlayerScreenProfile, definition: MarketDefinition, periodKey: string, source?: Prop, template?: Prop): MarketSnapshot {
  const canonicalLine = round((source?.line ?? estimatedLine(player, profile, definition)) * periodScale(periodKey), definition.step);
  const history = historyFor(player, profile, definition, periodKey, source ?? template);
  const averageValues = history.filter((entry) => entry.availability === 'played' && entry.value !== null).map((entry) => entry.value as number);
  const average = averageValues.length ? Math.round((averageValues.reduce((sum, value) => sum + value, 0) / averageValues.length) * 10) / 10 : null;
  const bookSource = source?.books ?? template?.books ?? [];
  const canonicalOffers = source ? propBoardRowById(source.id)?.offers : undefined;
  return {
    definition,
    available: true,
    propId: source?.id ?? `research-${player.id}-${definition.key}`,
    canonicalLine,
    projection: average === null ? null : Math.round((average + fixtureNumber(`${player.id}-${definition.key}-projection`, -8, 8) / 10) * 10) / 10,
    average,
    hitRates: { l5: rate(history, canonicalLine, 5), l10: rate(history, canonicalLine, 10), l15: rate(history, canonicalLine, 15), season: rate(history, canonicalLine), h2h: rate(history.filter((entry) => entry.opponent === player.opponent), canonicalLine) },
    history,
    offers: canonicalOffers?.map((offer) => ({
      id: offer.id,
      name: offer.providerName,
      shortName: offer.providerShortName,
      line: round(offer.line * periodScale(periodKey), definition.step),
      overOdds: offer.overOdds,
      underOdds: offer.underOdds,
      updatedAt: Math.max(0, Math.round((new Date('2026-09-01T20:00:00.000Z').getTime() - new Date(offer.observedAt).getTime()) / 1000)),
      lineType: offer.lineType,
      status: offer.status,
    })) ?? bookSource.map((book, index) => ({
      id: book.book, name: book.bookName, shortName: book.book, line: round(canonicalLine + (book.line - (source?.line ?? template?.line ?? canonicalLine)) * periodScale(periodKey), definition.step), overOdds: book.over, underOdds: book.under, updatedAt: book.updatedAt, promotion: index === 1 ? '$50' : index === 3 ? '$200' : undefined,
    })),
  };
}

function depthChart(player: Player, opponent = false): DepthChartEntry[] {
  const prefix = opponent ? player.opponent : player.team;
  return ['G1', 'G2', 'F1', 'F2', 'C'].map((slot, row) => ({
    slot,
    players: Array.from({ length: 4 }, (_, index) => ({ name: row === 2 && index === 0 && !opponent ? player.name : `${prefix} ${slot}-${index + 1}`, current: row === 2 && index === 0 && !opponent, status: row === 1 && index === 2 ? 'Q' as const : row === 4 && index === 1 ? 'OFS' as const : undefined })),
  }));
}

function filterOptions(player: Player, profile: PlayerScreenProfile, markets: MarketSnapshot[]): Partial<Record<PlayerFilterKey, FilterOption[]>> {
  const history = markets[0]?.history ?? [];
  const all = (items: FilterOption[]) => [{ value: 'all', label: 'All' }, ...items];
  const options: Partial<Record<PlayerFilterKey, FilterOption[]>> = {};
  profile.filters.forEach((key) => {
    if (key === 'opponent') options[key] = all([...new Set(history.map((entry) => entry.opponent))].map((value) => ({ value, label: value })));
    if (key === 'season') options[key] = all([{ value: 'current', label: 'Current season' }, { value: 'previous', label: 'Previous season' }]);
    if (key === 'homeAway') options[key] = all([{ value: 'home', label: 'Home' }, { value: 'away', label: 'Away' }]);
    if (key === 'team') options[key] = all([{ value: player.team, label: player.team }, { value: 'previous-team', label: 'Previous team' }]);
    if (key === 'event') options[key] = all([{ value: 'featured', label: 'Featured event' }, { value: 'tour', label: 'Tour event' }]);
    if (key === 'courtType') options[key] = all([{ value: 'hard', label: 'Hard' }, { value: 'clay', label: 'Clay' }, { value: 'grass', label: 'Grass' }]);
  });
  return options;
}

function sportPayload(player: Player, profile: PlayerScreenProfile): SportModulePayload {
  if (profile.family === 'basketball') return { family: 'basketball' };
  if (profile.family === 'football') {
    const passRate = player.pos === 'QB' || player.pos === 'WR' || player.pos === 'TE' ? fixtureNumber(`${player.id}-pass-rate`, 54, 67) : fixtureNumber(`${player.id}-pass-rate`, 46, 59);
    const label = player.pos === 'RB' ? 'Rush Attempts' : player.pos === 'K' ? 'Kicking Opportunities' : 'Targets';
    const counts = [34, 24, 18, 13, 11].map((base, index) => base + fixtureNumber(`${player.id}-share-${index}`, 0, 8));
    const total = counts.reduce((sum, value) => sum + value, 0);
    return { family: 'football', passRate, opportunityLabel: label, opportunityShares: counts.map((count, index) => ({ name: index === 0 ? player.name : `${player.team} Teammate ${index}`, position: index === 0 ? player.pos : index % 2 ? 'WR' : 'RB', count, share: Math.round((count / total) * 100), current: index === 0 })) };
  }
  if (profile.family === 'baseball') return {
    family: 'baseball',
    startingPitchers: [{ team: player.team, name: player.pos === 'SP' ? player.name : `${player.team} Starter`, hand: 'RHP', era: 3.42, strikeouts: 124 }, { team: player.opponent, name: `${player.opponent} Starter`, hand: 'LHP', era: 3.88, strikeouts: 117 }],
    battingOrder: Array.from({ length: 9 }, (_, index) => ({ order: index + 1, team: index < 5 ? player.team : player.opponent, name: index === 2 && player.pos !== 'SP' ? player.name : `Batter ${index + 1}`, position: ['CF', 'SS', '3B', '1B', 'RF', 'LF', '2B', 'C', 'DH'][index], average: `.${fixtureNumber(`${player.id}-avg-${index}`, 218, 319)}` })),
    weather: { summary: 'Clear, mild hitting conditions', temperature: fixtureNumber(`${player.id}-temp`, 68, 84), wind: '8 mph out to left', precipitation: fixtureNumber(`${player.id}-rain`, 0, 12) },
    pitchArsenal: [{ pitch: 'Four-seam', usage: 38, velocity: 96.2, whiff: 24, opponentAverage: '.218' }, { pitch: 'Slider', usage: 27, velocity: 87.4, whiff: 39, opponentAverage: '.184' }, { pitch: 'Changeup', usage: 19, velocity: 88.1, whiff: 31, opponentAverage: '.229' }, { pitch: 'Curve', usage: 16, velocity: 81.6, whiff: 28, opponentAverage: '.241' }],
  };
  if (profile.family === 'soccer') return {
    family: 'soccer', projectedLineup: true,
    formations: { [player.team]: Array.from({ length: 11 }, (_, index) => ({ name: index === 8 ? player.name : `${player.team} Player ${index + 1}`, position: index === 0 ? 'GK' : index < 5 ? 'D' : index < 8 ? 'M' : 'F', current: index === 8 })), [player.opponent]: Array.from({ length: 11 }, (_, index) => ({ name: `${player.opponent} Player ${index + 1}`, position: index === 0 ? 'GK' : index < 5 ? 'D' : index < 8 ? 'M' : 'F' })) },
    teamStats: ['Goals', 'Shots', 'Possession', 'Pass Accuracy', 'Tackles', 'Cards'].map((label, index) => ({ label, playerTeam: fixtureNumber(`${player.id}-team-${index}`, 38, 72), opponent: fixtureNumber(`${player.id}-opp-${index}`, 38, 72) })),
    form: Array.from({ length: 5 }, (_, index) => ({ date: `Match ${5 - index}`, opponent: `Opponent ${index + 1}`, result: index % 3 === 1 ? 'L' : 'W', score: index % 3 === 1 ? '0-1' : '2-1' })),
  };
  if (profile.family === 'tennis') return {
    family: 'tennis', h2h: { playerWins: 3, opponentWins: 2, meetings: [{ event: 'Indian Wells', surface: 'Hard', result: 'W', score: '6-4 7-5' }, { event: 'Madrid', surface: 'Clay', result: 'L', score: '4-6 6-3 4-6' }, { event: 'US Open', surface: 'Hard', result: 'W', score: '7-6 6-4' }] },
    form: [{ event: 'US Open', surface: 'Hard', result: 'W', score: '3-1' }, { event: 'Cincinnati', surface: 'Hard', result: 'W', score: '2-0' }, { event: 'Montreal', surface: 'Hard', result: 'L', score: '1-2' }, { event: 'Wimbledon', surface: 'Grass', result: 'W', score: '3-2' }, { event: 'Queen’s', surface: 'Grass', result: 'W', score: '2-0' }],
    averages: ['Aces', 'Double Faults', '1st Serve %', 'Break Points Won'].map((label, index) => ({ label, overall: fixtureNumber(`${player.id}-overall-${index}`, 4, 72), venue: fixtureNumber(`${player.id}-venue-${index}`, 4, 72), opponent: fixtureNumber(`${player.id}-h2h-${index}`, 4, 72) })),
  };
  if (profile.family === 'esports') return {
    family: 'esports', mapStats: ['Map 1', 'Map 2', 'Map 3', 'Map 4', 'Map 5'].map((map, index) => ({ map, played: fixtureNumber(`${player.id}-played-${index}`, 4, 18), primary: fixtureNumber(`${player.id}-primary-${index}`, 12, 31), ratio: Math.round((0.8 + fixtureNumber(`${player.id}-ratio-${index}`, 0, 70) / 100) * 100) / 100, assists: fixtureNumber(`${player.id}-assists-${index}`, 4, 17), available: index < 4 })),
    teamForm: Array.from({ length: 5 }, (_, index) => ({ date: `Series ${5 - index}`, event: index < 2 ? 'Playoffs' : 'League', opponent: `Team ${index + 1}`, result: index === 2 ? 'L' : 'W', score: index === 2 ? '1-2' : '2-1' })),
    rosters: { [player.team]: [{ name: player.name, role: player.pos }, ...Array.from({ length: 4 }, (_, index) => ({ name: `${player.team} Player ${index + 2}`, role: `Role ${index + 2}` }))], [player.opponent]: Array.from({ length: 5 }, (_, index) => ({ name: `${player.opponent} Player ${index + 1}`, role: `Role ${index + 1}` })) },
    favorites: ['Primary', 'Secondary', 'Utility'].map((name, index) => ({ name: player.sport === 'LOL' ? ['Aatrox', 'Renekton', 'Kennen'][index] : name, games: fixtureNumber(`${player.id}-fav-games-${index}`, 8, 31), winRate: fixtureNumber(`${player.id}-fav-wr-${index}`, 48, 72) })),
  };
  return { family: 'hockey', unavailableReason: profile.proxyNotice ?? 'Hockey-specific research is unavailable.' };
}

export const mockPlayerResearchAdapter: PlayerResearchAdapter = {
  getPlayerResearch(player, profile): PlayerResearchViewModel {
    const props = propsForPlayer(player.id);
    const template = props[0];
    const marketsByPeriod = Object.fromEntries(profile.periods.map((period) => [period.key, profile.markets.map((definition) => marketSnapshot(player, profile, definition, period.key, props.find((prop) => prop.market === definition.market), template))]));
    const markets = marketsByPeriod[profile.periods[0].key];
    const defaultMarket = markets.find((item) => item.definition.key === 'pts') ?? markets[0];
    const win = fixtureNumber(`${player.id}-win`, 48, 72);
    return {
      profile, player, competitionLabel: player.sport, roleLabel: profile.roleLabel, eventLabel: `${player.home ? 'vs' : '@'} ${player.opponent} · Today ${player.gameTime}`, status: 'Scheduled', markets, marketsByPeriod,
      defaultMarketKey: defaultMarket.definition.key, filterOptions: filterOptions(player, profile, markets), depthCharts: { [player.team]: depthChart(player), [player.opponent]: depthChart(player, true) },
      lineMovement: Array.from({ length: 6 }, (_, index) => ({ id: `${player.id}-movement-${index}`, line: round(defaultMarket.canonicalLine + (index - 2) * defaultMarket.definition.step, defaultMarket.definition.step), provider: defaultMarket.offers[index % Math.max(1, defaultMarket.offers.length)]?.shortName ?? 'AP', secondsAgo: 45 + index * 240, direction: index === 0 ? 'up' : index === 1 ? 'down' : 'flat', delta: index === 0 ? defaultMarket.definition.step : index === 1 ? -defaultMarket.definition.step : 0 })),
      rankings: Array.from({ length: 12 }, (_, index) => ({ rank: index + 1, team: index === 4 ? player.team : `Team ${index + 1}`, record: `${fixtureNumber(`${player.id}-wins-${index}`, 4, 13)}-${fixtureNumber(`${player.id}-loss-${index}`, 1, 9)}`, pct: `.${fixtureNumber(`${player.id}-pct-${index}`, 520, 890)}`, streak: `${index % 3 ? 'W' : 'L'}${fixtureNumber(`${player.id}-streak-${index}`, 1, 6)}`, current: index === 4 })),
      sportPayload: sportPayload(player, profile),
      contextual: { winProbability: [win, 100 - win], opponentRank: fixtureNumber(`${player.id}-rank`, 2, 28), opponentAllowed: fixtureNumber(`${player.id}-allowed`, 18, 31), similarPlayers: Array.from({ length: 5 }, (_, index) => ({ name: `Comparable ${index + 1}`, value: fixtureNumber(`${player.id}-similar-value-${index}`, 5, 32), line: index === 3 ? null : fixtureNumber(`${player.id}-similar-line-${index}`, 6, 28) + 0.5, usage: fixtureNumber(`${player.id}-usage-${index}`, 4, 18), usageLabel: player.pos === 'RB' ? 'carries' : player.pos === 'WR' || player.pos === 'TE' ? 'targets' : 'minutes' })), injuries: [{ name: `${player.team} Teammate`, position: player.pos, status: 'Questionable', note: 'Game-time decision with limited participation at the latest practice.' }, { name: `${player.opponent} Starter`, position: profile.family === 'baseball' ? 'SP' : 'Starter', status: 'Out', note: 'Unavailable for today’s matchup.' }] },
    };
  },
};

export function getOfferName(shortName: string): string { return BOOKS[shortName] ?? shortName; }
