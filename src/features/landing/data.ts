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
  abbr: string
  name: string
  markets: string
}

export const sports: Sport[] = [
  { abbr: 'NBA', name: 'Basketball', markets: 'Points · Rebounds · Assists · 3PT' },
  { abbr: 'NFL', name: 'Football', markets: 'Passing · Rushing · Receiving' },
  { abbr: 'MLB', name: 'Baseball', markets: 'Hits · Strikeouts · Total Bases' },
  { abbr: 'NHL', name: 'Hockey', markets: 'Goals · Assists · Shots' },
  { abbr: 'WNBA', name: 'Basketball', markets: 'Points · Rebounds · Assists' },
  { abbr: 'NCAAB', name: 'College Basketball', markets: 'Points · Rebounds · Assists' },
  { abbr: 'NCAAF', name: 'College Football', markets: 'Passing · Rushing · Receiving' },
]

export interface FaqItem {
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    question: 'What is Premium Picks?',
    answer:
      'Premium Picks is a sports research platform designed to bring player props, trends, sportsbook lines, projections, and analytics into one place, so you can research faster without jumping between multiple websites.',
  },
  {
    question: 'What sports does Premium Picks support?',
    answer:
      'At launch, Premium Picks covers the NBA, NFL, MLB, NHL, WNBA, NCAA Basketball, and NCAA Football, with more sports planned as the platform grows.',
  },
  {
    question: 'Which sportsbooks are supported?',
    answer:
      'Premium Picks aggregates lines from a range of major regulated US sportsbooks, with the list of supported books expanding over time. The current lineup is shown inside the platform.',
  },
  {
    question: 'Does Premium Picks place bets for me?',
    answer:
      'No. Premium Picks is a research and analytics platform. It does not place, accept, or process wagers of any kind.',
  },
  {
    question: 'Is Premium Picks a sportsbook?',
    answer:
      'No. Premium Picks does not accept or process wagers and is not a sportsbook. It provides data, research tools, and analytics only.',
  },
  {
    question: 'How often is the data updated?',
    answer:
      'Player stats, props, and sportsbook lines are refreshed continuously throughout the day, so the numbers you see reflect the latest available information.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes. You can cancel your subscription at any time from your account settings. Your access remains active until the end of the current billing period.',
  },
  {
    question: 'Can I use Premium Picks on mobile?',
    answer:
      'Yes. The Premium Picks website and application are fully responsive, so you can research on desktop, tablet, or phone.',
  },
  {
    question: 'Does Premium Picks guarantee winning bets?',
    answer:
      'No. Premium Picks provides research and analytics tools and does not guarantee betting results. All information is provided for research and entertainment purposes only.',
  },
]
