export type Sport =
  | 'NBA'
  | 'NFL'
  | 'MLB'
  | 'NHL'
  | 'WNBA'
  | 'NCAAB'
  | 'NCAAF'
  | 'SOCCER'
  | 'TENNIS'
  | 'LOL'
  | 'CS2'
  | 'VALORANT';

export interface BookLine {
  book: string;
  bookName: string;
  line: number;
  over: number;
  under: number;
  updatedAt: number; // seconds ago
}

export interface GameLogEntry {
  date: string;
  opp: string;
  home: boolean;
  minutes: number;
  value: number;
  line: number;
  over: boolean;
}

export interface Prop {
  id: string;
  playerId: string;
  market: string;
  line: number;
  books: BookLine[];
  avg: number;
  projection: number;
  diff: number;
  l5: number;
  l10: number;
  l15: number;
  season: number;
  seasonGames: number;
  h2h: number;
  streak: { type: 'Over' | 'Under'; count: number };
  gameLog: GameLogEntry[];
}

export interface Player {
  id: string;
  name: string;
  team: string;
  pos: string;
  sport: Sport;
  jersey: number;
  opponent: string;
  home: boolean;
  gameTime: string;
  gameId: string;
}

export interface Game {
  id: string;
  sport: Sport;
  homeTeam: string;
  awayTeam: string;
  time: string;
  status: string;
}

export type PageKey =
  | 'props'
  | 'discrepancies'
  | 'players'
  | 'trends'
  | 'matchups'
  | 'projections'
  | 'saved'
  | 'popular'
  | 'player'
  | 'game'
  | 'help';

export interface PickBuilderItem {
  propId: string;
  side: 'over' | 'under';
  book?: string;
}

export interface Filters {
  gameId: string | null;
  playerId: string | null;
  market: string | null;
  books: string[];
  minOdds: number | null;
  maxOdds: number | null;
  minHitRate: number | null;
  hitRateRange: 'l5' | 'l10' | 'l15' | 'season';
  date: string;
  homeAway: 'all' | 'home' | 'away';
  minBooks: number;
  minDiff: number | null;
}
