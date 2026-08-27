export interface PropRow {
  player: string
  team: string
  position: string
  prop: string
  line: string
  odds: string
  avg: string
  l5: number
  l10: number
  l15: number
  season: number
  trend: 'up' | 'down'
}

export const propRows: PropRow[] = [
  { player: 'J. Brunson', team: 'NYK', position: 'PG', prop: 'Points', line: '27.5', odds: '-115', avg: '28.9', l5: 80, l10: 70, l15: 73, season: 66, trend: 'up' },
  { player: 'T. Haliburton', team: 'IND', position: 'PG', prop: 'Assists', line: '9.5', odds: '-105', avg: '10.4', l5: 60, l10: 70, l15: 67, season: 63, trend: 'up' },
  { player: 'A. Davis', team: 'LAL', position: 'PF', prop: 'Rebounds', line: '12.5', odds: '-110', avg: '12.1', l5: 40, l10: 50, l15: 47, season: 52, trend: 'down' },
  { player: 'S. Gilgeous-Alexander', team: 'OKC', position: 'SG', prop: 'Points', line: '31.5', odds: '-120', avg: '32.7', l5: 80, l10: 80, l15: 80, season: 71, trend: 'up' },
  { player: 'J. Tatum', team: 'BOS', position: 'SF', prop: '3-Pointers', line: '3.5', odds: '+105', avg: '3.4', l5: 40, l10: 50, l15: 53, season: 49, trend: 'down' },
  { player: 'N. Jokic', team: 'DEN', position: 'C', prop: 'Assists', line: '8.5', odds: '-130', avg: '9.8', l5: 100, l10: 90, l15: 87, season: 78, trend: 'up' },
]

export interface SportsbookLine {
  book: string
  line: string
  over: string
  under: string
  best?: boolean
}

export const lineComparison: SportsbookLine[] = [
  { book: 'Book A', line: '27.5', over: '-115', under: '-105' },
  { book: 'Book B', line: '27.5', over: '-110', under: '-110', best: true },
  { book: 'Book C', line: '26.5', over: '-120', under: '+100' },
  { book: 'Book D', line: '28.5', over: '+100', under: '-120' },
]

export interface TrendGame {
  label: string
  value: number
  over: boolean
}

export const trendGames: TrendGame[] = [
  { label: 'G1', value: 24, over: false },
  { label: 'G2', value: 31, over: true },
  { label: 'G3', value: 29, over: true },
  { label: 'G4', value: 22, over: false },
  { label: 'G5', value: 35, over: true },
  { label: 'G6', value: 33, over: true },
  { label: 'G7', value: 26, over: false },
  { label: 'G8', value: 30, over: true },
]

export interface MatchupRow {
  opponent: string
  posDefense: string
  meetings: string
  avg: string
  hitRate: number
}

export const matchupRows: MatchupRow[] = [
  { opponent: 'BOS', posDefense: '4th vs PG', meetings: '3 games', avg: '30.7', hitRate: 67 },
  { opponent: 'MIA', posDefense: '11th vs PG', meetings: '4 games', avg: '28.1', hitRate: 50 },
  { opponent: 'CHI', posDefense: '27th vs PG', meetings: '3 games', avg: '34.3', hitRate: 100 },
]

export interface Sport {
  id: string
  abbr: string
  name: string
  league: string
  summary: string
  markets: string[]
  contextLabel: string
  contextValue: string
  samplePlayer: string
  sampleTeam: string
  sampleLine: string
  sampleAverage: string
  hitRates: [number, number, number, number]
  chart: number[]
}

export const sports: Sport[] = [
  {
    id: 'nba',
    abbr: 'NBA',
    name: 'Basketball',
    league: 'NBA player research',
    summary: 'Compare scoring, rebounding, assist, and three-point markets with recent-game context.',
    markets: ['Points', 'Rebounds', 'Assists', '3-Pointers'],
    contextLabel: 'Position matchup',
    contextValue: 'Opponent ranks 24th vs PG',
    samplePlayer: 'Jalen Brunson',
    sampleTeam: 'NYK · PG',
    sampleLine: '27.5 points',
    sampleAverage: '28.9 avg',
    hitRates: [80, 70, 73, 66],
    chart: [24, 31, 29, 22, 35, 33, 26, 30],
  },
  {
    id: 'nfl',
    abbr: 'NFL',
    name: 'Football',
    league: 'NFL player research',
    summary: 'Explore role-specific passing, rushing, receiving, and kicking markets in one view.',
    markets: ['Passing', 'Rushing', 'Receiving', 'Kicking'],
    contextLabel: 'Defense context',
    contextValue: 'Opponent allows 248 pass yds/game',
    samplePlayer: 'Patrick Mahomes',
    sampleTeam: 'KC · QB',
    sampleLine: '275.5 pass yds',
    sampleAverage: '286.4 avg',
    hitRates: [60, 70, 67, 64],
    chart: [263, 291, 312, 244, 286, 301, 278, 295],
  },
  {
    id: 'mlb',
    abbr: 'MLB',
    name: 'Baseball',
    league: 'MLB player research',
    summary: 'Move between hitter and pitcher markets with game logs and role-specific supporting data.',
    markets: ['Hits', 'Total Bases', 'Strikeouts', 'Runs'],
    contextLabel: 'Pitching matchup',
    contextValue: 'Opposing starter · RHP',
    samplePlayer: 'Aaron Judge',
    sampleTeam: 'NYY · RF',
    sampleLine: '1.5 total bases',
    sampleAverage: '2.1 avg',
    hitRates: [80, 70, 67, 61],
    chart: [1, 3, 2, 0, 4, 2, 1, 3],
  },
  {
    id: 'nhl',
    abbr: 'NHL',
    name: 'Hockey',
    league: 'NHL player research',
    summary: 'Review player shot, point, goal, and assist performance alongside recent results.',
    markets: ['Shots', 'Points', 'Goals', 'Assists'],
    contextLabel: 'Opponent context',
    contextValue: 'Opponent allows 31.2 shots/game',
    samplePlayer: 'Connor McDavid',
    sampleTeam: 'EDM · C',
    sampleLine: '3.5 shots',
    sampleAverage: '4.1 avg',
    hitRates: [60, 70, 73, 68],
    chart: [3, 5, 4, 2, 6, 4, 3, 5],
  },
  {
    id: 'wnba',
    abbr: 'WNBA',
    name: 'Basketball',
    league: 'WNBA player research',
    summary: 'Research player markets with recent form, opponent history, and position context.',
    markets: ['Points', 'Rebounds', 'Assists', '3-Pointers'],
    contextLabel: 'Position matchup',
    contextValue: 'Opponent ranks 19th vs F',
    samplePlayer: 'Breanna Stewart',
    sampleTeam: 'NY · F',
    sampleLine: '21.5 points',
    sampleAverage: '22.8 avg',
    hitRates: [80, 80, 73, 69],
    chart: [18, 26, 24, 21, 29, 23, 20, 27],
  },
  {
    id: 'ncaab',
    abbr: 'NCAAB',
    name: 'College Basketball',
    league: 'College basketball research',
    summary: 'Compare player scoring and all-around markets across the college schedule.',
    markets: ['Points', 'Rebounds', 'Assists', '3-Pointers'],
    contextLabel: 'Team matchup',
    contextValue: 'Opponent pace · 72.4 possessions',
    samplePlayer: 'Sample Guard',
    sampleTeam: 'COL · G',
    sampleLine: '18.5 points',
    sampleAverage: '19.7 avg',
    hitRates: [60, 70, 67, 62],
    chart: [16, 22, 19, 14, 25, 21, 18, 23],
  },
  {
    id: 'ncaaf',
    abbr: 'NCAAF',
    name: 'College Football',
    league: 'College football research',
    summary: 'Explore passing, rushing, and receiving markets with role-aware context.',
    markets: ['Passing', 'Rushing', 'Receiving', 'Touchdowns'],
    contextLabel: 'Defense context',
    contextValue: 'Opponent ranks 87th vs pass',
    samplePlayer: 'Sample Quarterback',
    sampleTeam: 'COL · QB',
    sampleLine: '249.5 pass yds',
    sampleAverage: '261.8 avg',
    hitRates: [80, 70, 67, 63],
    chart: [238, 271, 264, 219, 302, 278, 246, 289],
  },
  {
    id: 'soccer',
    abbr: 'SOCCER',
    name: 'Soccer',
    league: 'Soccer player research',
    summary: 'Research shots, shots on target, passes, and goal contributions with league-aware context.',
    markets: ['Shots', 'Shots on Target', 'Passes', 'Goals + Assists'],
    contextLabel: 'Opponent context',
    contextValue: 'Opponent allows 13.1 shots per match',
    samplePlayer: 'Sample Forward',
    sampleTeam: 'MCI · FWD',
    sampleLine: '2.5 shots',
    sampleAverage: '3.2 avg',
    hitRates: [80, 70, 67, 64],
    chart: [2, 4, 3, 1, 5, 4, 2, 4],
  },
  {
    id: 'tennis',
    abbr: 'TENNIS',
    name: 'Tennis',
    league: 'Tennis player research',
    summary: 'Compare aces, games won, break points, and match totals with surface and opponent context.',
    markets: ['Aces', 'Games Won', 'Break Points', 'Match Totals'],
    contextLabel: 'Surface context',
    contextValue: 'Hard court · 71% service points won',
    samplePlayer: 'Sample Player',
    sampleTeam: 'ITA · ATP',
    sampleLine: '8.5 aces',
    sampleAverage: '9.4 avg',
    hitRates: [60, 70, 67, 62],
    chart: [7, 11, 9, 6, 13, 10, 8, 11],
  },
  {
    id: 'lol',
    abbr: 'LOL',
    name: 'League of Legends',
    league: 'League of Legends research',
    summary: 'Track kills, assists, map performance, and series markets with role-specific samples.',
    markets: ['Kills', 'Assists', 'Maps', 'Fantasy Score'],
    contextLabel: 'Role matchup',
    contextValue: 'Opponent allows 3.8 mid-lane kills per map',
    samplePlayer: 'Sample Mid Laner',
    sampleTeam: 'T1 · MID',
    sampleLine: '5.5 kills',
    sampleAverage: '6.2 avg',
    hitRates: [80, 70, 73, 68],
    chart: [4, 7, 6, 3, 8, 7, 5, 8],
  },
  {
    id: 'cs2',
    abbr: 'CS2',
    name: 'Counter-Strike 2',
    league: 'CS2 player research',
    summary: 'Analyze kills, headshots, assists, and map totals across match and series samples.',
    markets: ['Kills', 'Headshots', 'Assists', 'Map Totals'],
    contextLabel: 'Map context',
    contextValue: 'Projected series · 2.7 maps',
    samplePlayer: 'Sample Rifler',
    sampleTeam: 'NAVI · RIFLER',
    sampleLine: '18.5 kills',
    sampleAverage: '19.8 avg',
    hitRates: [60, 70, 67, 64],
    chart: [17, 22, 19, 14, 24, 21, 18, 23],
  },
  {
    id: 'valorant',
    abbr: 'VAL',
    name: 'Valorant',
    league: 'Valorant player research',
    summary: 'Review kills, assists, first bloods, and map performance with agent and matchup context.',
    markets: ['Kills', 'Assists', 'First Bloods', 'Map Totals'],
    contextLabel: 'Series context',
    contextValue: 'Opponent map win rate · 54%',
    samplePlayer: 'Sample Duelist',
    sampleTeam: 'SEN · DUELIST',
    sampleLine: '16.5 kills',
    sampleAverage: '17.9 avg',
    hitRates: [80, 80, 73, 69],
    chart: [15, 20, 18, 13, 22, 19, 16, 21],
  },
]

export type ProductTourId = 'props' | 'player' | 'trends' | 'matchups'

export interface ProductTourItem {
  id: ProductTourId
  step: string
  label: string
  title: string
  description: string
  route: string
  cta: string
  proof: string
}

export const productTourItems: ProductTourItem[] = [
  {
    id: 'props',
    step: '01',
    label: 'Find Props',
    title: 'Start with the market, not a maze of tabs.',
    description: 'Filter the board by sport, game, player, market, odds, and recent performance while keeping the important numbers together.',
    route: '/dashboard/props',
    cta: 'Open Props',
    proof: 'Interactive props board · Advanced filters · Side-by-side context',
  },
  {
    id: 'player',
    step: '02',
    label: 'Analyze a Player',
    title: 'Move from one prop into the full player story.',
    description: 'Review the selected line against recent games, longer samples, role-specific stats, and matchup context without rebuilding the search.',
    route: '/dashboard/players/NBA-jalen-brunson?market=points&line=27.5&period=full',
    cta: 'Open Player Analysis',
    proof: 'L5 / L10 / L15 · Game log · Matchup modules',
  },
  {
    id: 'trends',
    step: '03',
    label: 'Read the Trend',
    title: 'See the threshold against every recent result.',
    description: 'Exact game values, last 5, last 10, last 15, and season hit rates make the pattern readable without relying on color alone.',
    route: '/dashboard/trends',
    cta: 'Open Trends',
    proof: 'Exact results · Multiple samples · Clear threshold',
  },
  {
    id: 'matchups',
    step: '04',
    label: 'Add Context',
    title: 'Check the matchup before you finish the research.',
    description: 'Bring opponent history, event details, and position or role context into the same workflow before moving on.',
    route: '/dashboard/matchups',
    cta: 'Open Matchups',
    proof: 'Opponent history · Event context · Role-aware analysis',
  },
]

export interface FaqItem {
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    question: 'What is Arena Props?',
    answer:
      'Arena Props is a sports research platform designed to bring player props, trends, sportsbook lines, projections, and analytics into one place, so you can research faster without jumping between multiple websites.',
  },
  {
    question: 'What sports does Arena Props support?',
    answer:
      'The current Arena Props experience includes the NBA, NFL, MLB, NHL, WNBA, NCAA Basketball, NCAA Football, soccer, tennis, League of Legends, CS2, and Valorant. Final production availability will be confirmed against our contracted data coverage.',
  },
  {
    question: 'Which sportsbooks are supported?',
    answer:
      'Arena Props aggregates lines from a range of major regulated US sportsbooks, with the list of supported books expanding over time. The current lineup is shown inside the platform.',
  },
  {
    question: 'Does Arena Props place bets for me?',
    answer:
      'No. Arena Props is a research and analytics platform. It does not place, accept, or process wagers of any kind.',
  },
  {
    question: 'Is Arena Props a sportsbook?',
    answer:
      'No. Arena Props does not accept or process wagers and is not a sportsbook. It provides data, research tools, and analytics only.',
  },
  {
    question: 'How often is the data updated?',
    answer:
      'Arena Props is being designed for feed-driven updates to player stats, props, and sportsbook lines. Exact refresh timing will be published after the production providers and sport-specific service levels are finalized.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes. You can cancel your subscription at any time from your account settings. Your access remains active until the end of the current billing period.',
  },
  {
    question: 'Can I use Arena Props on mobile?',
    answer:
      'Yes. The Arena Props website and application are fully responsive, so you can research on desktop, tablet, or phone.',
  },
  {
    question: 'Does Arena Props guarantee winning bets?',
    answer:
      'No. Arena Props provides research and analytics tools and does not guarantee betting results. All information is provided for research and entertainment purposes only.',
  },
]
