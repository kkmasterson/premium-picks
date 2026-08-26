import type { Sport } from '@/features/dashboard/types';
import type { ChartPreset, ContextModuleDefinition, GameLogColumnDefinition, MarketDefinition, PlayerFilterKey, PlayerScreenProfile } from './types';

const market = (key: string, label: string, name: string, group: MarketDefinition['group'] = 'primary', step = 0.5, chartPreset?: ChartPreset): MarketDefinition => ({ key, label, market: name, group, step, chartPreset });
const column = (key: string, label: string, source: GameLogColumnDefinition['source'] = 'supporting'): GameLogColumnDefinition => ({ key, label, source });
const commonFilters: PlayerFilterKey[] = ['opponent', 'season', 'homeAway'];
const capabilities = { providerSelection: true, lineMovement: true, propHistory: true };
const commonContext: ContextModuleDefinition[] = [
  { key: 'matchup', label: 'Matchup' }, { key: 'defense', label: 'Defense' }, { key: 'similar', label: 'Similar' }, { key: 'injuries', label: 'Injuries' }, { key: 'rankings', label: 'Rankings' },
];

const basketballMarkets: MarketDefinition[] = [
  market('min', 'MIN', 'Minutes'), market('pts', 'PTS', 'Points'), market('rebs', 'REBS', 'Rebounds', 'primary', 0.5, 'rebounds'),
  market('oreb', 'O-REB', 'Offensive Rebounds'), market('dreb', 'D-REB', 'Defensive Rebounds'), market('asts', 'ASTS', 'Assists'),
  market('pa', 'PA', 'Points + Assists'), market('pr', 'PR', 'Points + Rebounds'), market('ra', 'RA', 'Rebounds + Assists'),
  market('pra', 'PRA', 'Points + Rebounds + Assists'), market('blks', 'BLKS', 'Blocks'), market('stl', 'STL', 'Steals'),
  market('to', 'TO', 'Turnovers', 'alternate'), market('3pm', '3PM', '3-Pointers Made', 'alternate'), market('3pa', '3PA', '3-Point Attempts', 'alternate', 1),
  market('2pm', '2PM', '2-Pointers Made', 'alternate'), market('2pa', '2PA', '2-Point Attempts', 'alternate'), market('ftm', 'FTM', 'Free Throws Made', 'alternate'),
  market('fta', 'FTA', 'Free Throw Attempts', 'alternate'), market('fgm', 'FGM', 'Field Goals Made', 'alternate'), market('fga', 'FGA', 'Field Goal Attempts', 'alternate'),
  market('bs', 'BS', 'Blocks + Steals', 'alternate'), market('fp', 'FP', 'Fantasy Points', 'alternate'), market('pf', 'PF', 'Personal Fouls', 'alternate'),
];

const basketballProfile: PlayerScreenProfile = {
  id: 'basketball-player', family: 'basketball', sports: ['NBA', 'WNBA', 'NCAAB'], competitions: ['NBA', 'WNBA', 'NCAAB'], roleLabel: 'Basketball player', matchesPosition: () => true,
  historyUnit: 'game', markets: basketballMarkets,
  periods: [{ key: 'full', label: 'Full Game' }, { key: '1q', label: '1Q' }, { key: '1h', label: '1H' }, { key: '2h', label: '2H' }, { key: '4q', label: '4Q' }],
  filters: commonFilters, chartPreset: 'standard', primaryModules: ['depth-charts', 'game-log'],
  supportingStats: ['Minutes', 'Personal Fouls', 'FG Made', '3-PT Made', 'FT Made'],
  contextModules: [{ key: 'matchup', label: 'Matchup' }, { key: 'defense', label: 'Defense' }, { key: 'shooting', label: 'Shooting' }, { key: 'similar', label: 'Similar' }, { key: 'injuries', label: 'Injuries' }],
  gameLogColumns: [column('market', 'Result', 'market'), column('Minutes', 'MIN'), column('FG Made', 'FGM'), column('3-PT Made', '3PM')], capabilities,
  proxyNotice: 'NBA and college basketball inherit the validated WNBA structure; league-specific markets, standings, and provider behavior remain unconfirmed.',
};

const footballMarkets = {
  qb: [
    market('pass-yds', 'PASS YDS', 'Passing Yards'), market('pass-td', 'PASS TD', 'Passing Touchdowns', 'primary', 1), market('pass-att', 'PASS ATT', 'Pass Attempts'),
    market('completions', 'COMP', 'Pass Completions', 'primary', 0.5, 'receiving-opportunity'), market('interceptions', 'INT', 'Interceptions', 'primary', 0.5), market('rush-yds', 'RUSH YDS', 'Rushing Yards'),
    market('rush-att', 'RUSH ATT', 'Rush Attempts', 'alternate'), market('rush-td', 'RUSH TD', 'Rushing Touchdowns', 'alternate', 1), market('long-rush', 'LONG RUSH', 'Longest Rush', 'alternate'),
    market('long-comp', 'LONG COMP', 'Longest Completion', 'alternate'), market('comp-pct', 'COMP %', 'Completion Percentage', 'alternate', 1), market('fumbles', 'FUM', 'Fumbles', 'alternate', 1),
  ],
  rb: [
    market('rush-rec-yds', 'R+R YDS', 'Rushing + Receiving Yards', 'primary', 0.5, 'football-combined'), market('rush-yds', 'RUSH YDS', 'Rushing Yards'), market('rush-att', 'RUSH ATT', 'Rush Attempts'),
    market('rush-td', 'RUSH TD', 'Rushing Touchdowns', 'primary', 1), market('receptions', 'REC', 'Receptions', 'primary', 0.5, 'receiving-opportunity'), market('rec-yds', 'REC YDS', 'Receiving Yards'),
    market('targets', 'TGT', 'Receiving Targets', 'alternate'), market('rz-targets', 'RZ TGT', 'Red-Zone Targets', 'alternate'), market('rec-td', 'REC TD', 'Receiving Touchdowns', 'alternate', 1),
    market('touches', 'TOUCHES', 'Touches', 'alternate'),
  ],
  receiver: [
    market('receptions', 'REC', 'Receptions', 'primary', 0.5, 'receiving-opportunity'), market('rec-yds', 'REC YDS', 'Receiving Yards'), market('targets', 'TGT', 'Receiving Targets'),
    market('rz-targets', 'RZ TGT', 'Red-Zone Targets'), market('rec-td', 'REC TD', 'Receiving Touchdowns', 'primary', 1), market('rush-yds', 'RUSH YDS', 'Rushing Yards', 'alternate'),
    market('rush-rec-yds', 'R+R YDS', 'Rushing + Receiving Yards', 'alternate', 0.5, 'football-combined'), market('long-rec', 'LONG REC', 'Longest Reception', 'alternate'), market('fumbles', 'FUM', 'Fumbles', 'alternate', 1),
  ],
  kicker: [market('fgm', 'FGS', 'Field Goals Made', 'primary', 1), market('xp', 'XP', 'Extra Points', 'primary', 1), market('kicking-points', 'KPTS', 'Kicking Points'), market('kicker-fs', 'K FS', 'Kicker Fantasy Score', 'alternate')],
};

function footballProfile(id: string, label: string, positions: string[], markets: MarketDefinition[], chartPreset: ChartPreset, supportingStats: string[], gameLogColumns: GameLogColumnDefinition[]): PlayerScreenProfile {
  return {
    id, family: 'football', sports: ['NFL', 'NCAAF'], competitions: ['NFL', 'NCAAF'], roleLabel: label, matchesPosition: (position) => positions.includes(position), historyUnit: 'game', markets,
    periods: [{ key: 'full', label: 'Full Game' }, { key: '1q', label: '1Q' }, { key: '1h', label: '1H' }, { key: '2h', label: '2H' }, { key: '4q', label: '4Q' }],
    filters: commonFilters, chartPreset, primaryModules: ['football-usage', 'game-log'], supportingStats, contextModules: commonContext, gameLogColumns, capabilities,
    proxyNotice: 'College football inherits the NFL role layout; college rankings, conferences, postseason context, and exact markets remain unconfirmed.',
  };
}

const hitterMarkets = [market('hits', 'H', 'Hits'), market('total-bases', 'TB', 'Total Bases'), market('runs', 'R', 'Runs'), market('rbi', 'RBI', 'Runs Batted In'), market('hr', 'HR', 'Home Runs', 'primary', 0.5), market('strikeouts', 'K', 'Hitter Strikeouts'), market('walks', 'BB', 'Batter Walks', 'alternate'), market('steals', 'SB', 'Stolen Bases', 'alternate'), market('hbp', 'HBP', 'Hit By Pitch', 'alternate')];
const pitcherMarkets = [market('strikeouts', 'K', 'Strikeouts'), market('outs', 'OUTS', 'Pitching Outs'), market('hits-allowed', 'H ALLOWED', 'Hits Allowed'), market('walks', 'BB', 'Walks Allowed'), market('earned-runs', 'ER', 'Earned Runs', 'alternate'), market('pitches', 'PITCHES', 'Pitches Thrown', 'alternate', 1)];

const baseballHitter: PlayerScreenProfile = {
  id: 'baseball-hitter', family: 'baseball', sports: ['MLB'], competitions: ['MLB'], roleLabel: 'Hitter', matchesPosition: (position) => position !== 'SP' && position !== 'RP', historyUnit: 'game',
  markets: hitterMarkets, periods: [{ key: 'full', label: 'Full Game' }], filters: [...commonFilters, 'team'], chartPreset: 'standard', primaryModules: ['game-log'],
  supportingStats: ['Plate Appearances', 'Hits', 'Batter Walks', 'Strikeouts'],
  contextModules: [{ key: 'matchup', label: 'Matchup' }, { key: 'lineups', label: 'Lineups' }, { key: 'weather', label: 'Weather' }, { key: 'similar', label: 'Similar' }, { key: 'injuries', label: 'Injuries' }],
  gameLogColumns: [column('market', 'Result', 'market'), column('Plate Appearances', 'PA'), column('Hits', 'H'), column('Batter Walks', 'BB'), column('Strikeouts', 'K')], capabilities,
};

const baseballPitcher: PlayerScreenProfile = {
  id: 'baseball-starting-pitcher', family: 'baseball', sports: ['MLB'], competitions: ['MLB'], roleLabel: 'Starting pitcher', matchesPosition: (position) => position === 'SP', historyUnit: 'game',
  markets: pitcherMarkets, periods: [{ key: 'full', label: 'Full Game' }], filters: [...commonFilters, 'team'], chartPreset: 'standard', primaryModules: ['game-log'],
  supportingStats: ['Pitches', 'Innings', 'Whiffs', 'Earned Runs'],
  contextModules: [{ key: 'matchup', label: 'Matchup' }, { key: 'pitch-arsenal', label: 'Pitch Arsenal' }, { key: 'lineups', label: 'Lineups' }, { key: 'weather', label: 'Weather' }, { key: 'injuries', label: 'Injuries' }],
  gameLogColumns: [column('market', 'Result', 'market'), column('Pitches', 'Pitches'), column('Innings', 'IP'), column('Whiffs', 'Whiffs'), column('Earned Runs', 'ER')], capabilities,
};

const hockeyProfile: PlayerScreenProfile = {
  id: 'hockey-shared-shell', family: 'hockey', sports: ['NHL'], competitions: ['NHL'], roleLabel: 'Hockey player', matchesPosition: () => true, historyUnit: 'game',
  markets: [market('points', 'POINTS', 'Points'), market('shots', 'SOG', 'Shots on Goal'), market('goals', 'GOALS', 'Goals'), market('assists', 'AST', 'Assists')],
  periods: [{ key: 'full', label: 'Full Game' }], filters: commonFilters, chartPreset: 'standard', primaryModules: ['game-log'], supportingStats: ['Time on Ice'], contextModules: [{ key: 'unavailable', label: 'Hockey Analysis' }],
  gameLogColumns: [column('market', 'Result', 'market'), column('Time on Ice', 'TOI')], capabilities: { ...capabilities, sharedShellOnly: true },
  proxyNotice: 'Hockey-specific roles, periods, markets, rink analysis, and matchup modules are awaiting a validated reference.',
};

function soccerProfile(id: string, label: string, positions: string[], markets: MarketDefinition[], supportingStats: string[], chartPreset: ChartPreset = 'standard'): PlayerScreenProfile {
  const goalkeeper = label === 'Goalkeeper';
  return {
    id, family: 'soccer', sports: ['SOCCER'], competitions: ['SOCCER'], roleLabel: label, matchesPosition: (position) => positions.includes(position), historyUnit: 'match', markets,
    periods: [{ key: 'full', label: 'Full Match' }, { key: '1h', label: '1H' }, { key: '2h', label: '2H' }], filters: ['opponent', 'season', 'homeAway', 'team'], chartPreset, primaryModules: ['game-log'], supportingStats,
    contextModules: goalkeeper ? [{ key: 'matchup', label: 'Matchup' }, { key: 'form', label: 'Form' }, { key: 'player-stats', label: 'Team Stats' }, { key: 'injuries', label: 'Injuries' }, { key: 'rankings', label: 'Rankings' }] : [{ key: 'matchup', label: 'Matchup' }, { key: 'similar', label: 'Similar' }, { key: 'lineups', label: 'Lineups' }, { key: 'form', label: 'Form' }],
    gameLogColumns: [column('market', 'Result', 'market'), ...supportingStats.slice(0, 4).map((item) => column(item, item))], capabilities,
  };
}

const tennisProfile: PlayerScreenProfile = {
  id: 'tennis-singles', family: 'tennis', sports: ['TENNIS'], competitions: ['TENNIS'], roleLabel: 'Singles player', matchesPosition: () => true, historyUnit: 'match',
  markets: [market('games-won', 'GAMES', 'Games Won'), market('aces', 'ACES', 'Aces'), market('double-faults', 'DF', 'Double Faults'), market('break-points', 'BP WON', 'Break Points Won', 'primary', 0.5, 'tennis-break-points')],
  periods: [{ key: 'match', label: 'Match' }, { key: 'set-1', label: 'Set 1' }, { key: 'set-2', label: 'Set 2' }], filters: ['opponent', 'event', 'courtType'], chartPreset: 'standard', primaryModules: ['game-log'],
  supportingStats: ['First Serve %', 'Winners', 'Unforced Errors', 'Break Points Saved'],
  contextModules: [{ key: 'matchup', label: 'Matchup' }, { key: 'form', label: 'Player Form' }, { key: 'head-to-head', label: 'H2H' }, { key: 'advanced-averages', label: 'Averages' }],
  gameLogColumns: [column('market', 'Result', 'market'), column('First Serve %', '1st Serve %'), column('Winners', 'Winners'), column('Unforced Errors', 'UE')], capabilities,
};

function esportsProfile(sport: 'LOL' | 'CS2' | 'VALORANT', markets: MarketDefinition[], supportingStats: string[]): PlayerScreenProfile {
  return {
    id: `esports-${sport.toLowerCase()}`, family: 'esports', sports: [sport], competitions: [sport], roleLabel: sport === 'LOL' ? 'League role' : 'Esports player', matchesPosition: () => true, historyUnit: 'series', markets,
    periods: [{ key: 'series', label: 'Series' }, { key: 'map-1', label: 'Map 1' }, { key: 'map-2', label: 'Map 2' }, { key: 'map-3', label: 'Map 3' }], filters: ['opponent', 'event', 'team'], chartPreset: 'esports-maps', primaryModules: ['game-log'], supportingStats,
    contextModules: [{ key: 'matchup', label: 'Matchup' }, { key: 'maps', label: 'Maps' }, { key: 'player-stats', label: 'Player Stats' }, { key: 'team-form', label: 'Team Form' }],
    gameLogColumns: [column('market', 'Result', 'market'), column('Map 1', 'Map 1', 'component'), column('Map 2', 'Map 2', 'component'), column('Map 3', 'Map 3', 'component')], capabilities,
  };
}

const soccerForward = soccerProfile('soccer-forward', 'Forward', ['F'], [market('shots-on-target', 'SOT', 'Shots on Target'), market('goals', 'GOALS', 'Goals'), market('shots', 'SHOTS', 'Shots Attempted')], ['Minutes', 'Touches', 'Passes', 'Chances Created']);
const soccerMidfielder = soccerProfile('soccer-midfielder', 'Midfielder', ['M'], [market('shots', 'SHOTS', 'Shots Attempted'), market('passes', 'PASSES', 'Passes'), market('tackles', 'TACKLES', 'Tackles')], ['Minutes', 'Touches', 'Pass Accuracy', 'Chances Created']);
const soccerDefender = soccerProfile('soccer-defender', 'Defender', ['D'], [market('fouls', 'FOULS', 'Fouls'), market('tackles', 'TACKLES', 'Tackles'), market('clearances', 'CLEAR', 'Clearances')], ['Minutes', 'Duels', 'Interceptions', 'Blocks']);
const soccerGoalkeeper = soccerProfile('soccer-goalkeeper', 'Goalkeeper', ['GK'], [market('saves', 'SAVES', 'Saves', 'primary', 0.5, 'soccer-saves'), market('goals-allowed', 'GA', 'Goals Allowed'), market('clean-sheet', 'CS', 'Clean Sheet', 'primary', 1)], ['Minutes', 'Shots Faced', 'Claims', 'Passes']);

const lolProfile = esportsProfile('LOL', [market('kills', 'KILLS', 'Kills', 'primary', 0.5, 'esports-maps'), market('assists', 'AST', 'Assists', 'primary', 0.5, 'esports-maps'), market('cs', 'CS', 'CS', 'alternate', 0.5, 'esports-maps')], ['KDA', 'CS', 'Gold', 'Vision Score']);
const cs2Profile = esportsProfile('CS2', [market('kills', 'KILLS', 'Kills', 'primary', 0.5, 'esports-maps'), market('headshots', 'HS', 'Headshots', 'primary', 0.5, 'esports-maps'), market('assists', 'AST', 'Assists', 'alternate', 0.5, 'esports-maps')], ['ACS', 'Headshot %', 'First Kills', 'Clutches']);
const valorantProfile = esportsProfile('VALORANT', [market('kills', 'KILLS', 'Kills', 'primary', 0.5, 'esports-maps'), market('headshots', 'HS', 'Headshots', 'primary', 0.5, 'esports-maps'), market('assists', 'AST', 'Assists', 'alternate', 0.5, 'esports-maps')], ['ACS', 'Headshot %', 'First Kills', 'Clutches']);

export const PLAYER_SCREEN_PROFILES: PlayerScreenProfile[] = [
  basketballProfile,
  footballProfile('football-quarterback', 'Quarterback', ['QB'], footballMarkets.qb, 'standard', ['Pass Completions', 'Pass Attempts', 'Pass Yards', 'Rush Attempts'], [column('market', 'Result', 'market'), column('Pass Completions', 'COMP'), column('Pass Attempts', 'ATT'), column('Pass Yards', 'PASS YDS')]),
  footballProfile('football-running-back', 'Running back', ['RB'], footballMarkets.rb, 'standard', ['Rush Attempts', 'Receiving Targets', 'Rush Yards', 'Receiving Yards'], [column('market', 'R+R YDS', 'market'), column('Rush Yards', 'RUSH YDS'), column('Rush Attempts', 'CAR'), column('Receiving Yards', 'REC YDS'), column('Receiving Targets', 'TGT')]),
  footballProfile('football-wide-receiver', 'Wide receiver', ['WR'], footballMarkets.receiver, 'standard', ['Receiving Targets', 'Receiving Yards', 'Receiving Touchdowns'], [column('market', 'REC', 'market'), column('Receiving Targets', 'TGT'), column('Receiving Yards', 'REC YDS'), column('Receiving Touchdowns', 'REC TD')]),
  footballProfile('football-tight-end', 'Tight end', ['TE'], footballMarkets.receiver, 'standard', ['Receiving Targets', 'Receiving Yards', 'Receiving Touchdowns'], [column('market', 'REC', 'market'), column('Receiving Targets', 'TGT'), column('Receiving Yards', 'REC YDS'), column('Receiving Touchdowns', 'REC TD')]),
  footballProfile('football-kicker', 'Kicker', ['K'], footballMarkets.kicker, 'standard', ['Field Goals Made', 'Kicking Points', 'Extra Points'], [column('market', 'Result', 'market'), column('Field Goals Made', 'FGM'), column('Extra Points', 'XP'), column('Kicking Points', 'KPTS')]),
  baseballPitcher, baseballHitter, hockeyProfile, soccerForward, soccerMidfielder, soccerDefender, soccerGoalkeeper, tennisProfile, lolProfile, cs2Profile, valorantProfile,
];

export function resolvePlayerScreenProfile(sport: Sport, position: string, competition = sport): PlayerScreenProfile {
  return PLAYER_SCREEN_PROFILES.find((profile) => profile.sports.includes(sport) && profile.competitions.includes(competition) && profile.matchesPosition(position)) ?? hockeyProfile;
}

export function marketKeyForName(name: string, sport?: Sport, position?: string): string {
  const candidates = sport && position ? resolvePlayerScreenProfile(sport, position).markets : PLAYER_SCREEN_PROFILES.flatMap((profile) => profile.markets);
  const fromProfile = candidates.find((item) => item.market === name);
  return fromProfile?.key ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
