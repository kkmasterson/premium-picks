import type { Player, Sport } from '@/features/dashboard/types';
import type { LineType, OfferStatus } from '@arena/contracts';

export type PlayerScreenFamily = 'basketball' | 'football' | 'baseball' | 'hockey' | 'soccer' | 'tennis' | 'esports';
export type HistoryAvailability = 'played' | 'dnp' | 'unavailable';
export type PlayerFilterKey = 'opponent' | 'season' | 'homeAway' | 'team' | 'event' | 'courtType';
export type ChartPreset = 'standard' | 'rebounds' | 'football-combined' | 'receiving-opportunity' | 'tennis-break-points' | 'soccer-saves' | 'esports-maps';
export type PrimaryModuleKey = 'depth-charts' | 'football-usage' | 'game-log';
export type ContextModuleKey = 'matchup' | 'defense' | 'shooting' | 'similar' | 'injuries' | 'pitch-arsenal' | 'lineups' | 'weather' | 'form' | 'head-to-head' | 'advanced-averages' | 'maps' | 'player-stats' | 'team-form' | 'rankings' | 'unavailable';

export interface MarketDefinition {
  key: string;
  label: string;
  market: string;
  group: 'primary' | 'alternate';
  step: number;
  chartPreset?: ChartPreset;
}

export interface PeriodDefinition { key: string; label: string; }
export interface ContextModuleDefinition { key: ContextModuleKey; label: string; }
export interface GameLogColumnDefinition { key: string; label: string; source: 'market' | 'supporting' | 'component'; }

export interface PlayerScreenCapabilities {
  providerSelection: boolean;
  lineMovement: boolean;
  propHistory: boolean;
  sharedShellOnly?: boolean;
  proxy?: boolean;
}

export interface PlayerScreenProfile {
  id: string;
  family: PlayerScreenFamily;
  sports: Sport[];
  competitions: string[];
  roleLabel: string;
  matchesPosition: (position: string) => boolean;
  historyUnit: 'game' | 'match' | 'series';
  markets: MarketDefinition[];
  periods: PeriodDefinition[];
  filters: PlayerFilterKey[];
  chartPreset: ChartPreset;
  primaryModules: PrimaryModuleKey[];
  supportingStats: string[];
  contextModules: ContextModuleDefinition[];
  gameLogColumns: GameLogColumnDefinition[];
  capabilities: PlayerScreenCapabilities;
  proxyNotice?: string;
}

export interface ProviderOffer {
  id: string;
  name: string;
  shortName: string;
  line: number;
  overOdds: number | null;
  underOdds: number | null;
  updatedAt: number;
  lineType?: LineType;
  status?: OfferStatus;
  promotion?: string;
}

export interface ResearchHistoryEntry {
  id: string;
  date: string;
  opponent: string;
  home: boolean;
  availability: HistoryAvailability;
  value: number | null;
  line: number | null;
  minutes: number | null;
  seasonKey: string;
  eventKey: string;
  teamKey: string;
  courtType?: string;
  components?: Array<{ label: string; value: number }>;
  supporting: Record<string, number | null>;
}

export interface MarketSnapshot {
  definition: MarketDefinition;
  available: boolean;
  propId: string | null;
  canonicalLine: number;
  projection: number | null;
  average: number | null;
  hitRates: { l5: number | null; l10: number | null; l15: number | null; season: number | null; h2h: number | null; };
  history: ResearchHistoryEntry[];
  offers: ProviderOffer[];
}

export interface DepthChartEntry {
  slot: string;
  players: Array<{ name: string; status?: 'OUT' | 'Q' | 'DOUBT' | 'OFS'; current?: boolean }>;
}

export interface FilterOption { value: string; label: string; }
export interface LineMovementEntry { id: string; line: number; provider: string; secondsAgo: number; direction: 'up' | 'down' | 'flat'; delta: number; }
export interface RankingRow { rank: number; team: string; record: string; pct: string; streak: string; current?: boolean; }

export type SportModulePayload =
  | { family: 'basketball' }
  | { family: 'football'; passRate: number; opportunityLabel: string; opportunityShares: Array<{ name: string; position: string; count: number; share: number; current?: boolean }> }
  | { family: 'baseball'; startingPitchers: Array<{ team: string; name: string; hand: string; era: number; strikeouts: number }>; battingOrder: Array<{ order: number; team: string; name: string; position: string; average: string }>; weather: { summary: string; temperature: number; wind: string; precipitation: number }; pitchArsenal: Array<{ pitch: string; usage: number; velocity: number; whiff: number; opponentAverage: string }> }
  | { family: 'soccer'; projectedLineup: boolean; formations: Record<string, Array<{ name: string; position: string; current?: boolean }>>; teamStats: Array<{ label: string; playerTeam: number; opponent: number }>; form: Array<{ date: string; opponent: string; result: string; score: string }> }
  | { family: 'tennis'; h2h: { playerWins: number; opponentWins: number; meetings: Array<{ event: string; surface: string; result: string; score: string }> }; form: Array<{ event: string; surface: string; result: string; score: string }>; averages: Array<{ label: string; overall: number; venue: number; opponent: number }> }
  | { family: 'esports'; mapStats: Array<{ map: string; played: number; primary: number; ratio: number; assists: number; available: boolean }>; teamForm: Array<{ date: string; event: string; opponent: string; result: string; score: string }>; rosters: Record<string, Array<{ name: string; role?: string }>>; favorites: Array<{ name: string; games: number; winRate: number }> }
  | { family: 'hockey'; unavailableReason: string };

export interface PlayerResearchViewModel {
  profile: PlayerScreenProfile;
  player: Player;
  competitionLabel: string;
  roleLabel: string;
  eventLabel: string;
  status: string;
  markets: MarketSnapshot[];
  marketsByPeriod: Record<string, MarketSnapshot[]>;
  defaultMarketKey: string;
  filterOptions: Partial<Record<PlayerFilterKey, FilterOption[]>>;
  depthCharts: Record<string, DepthChartEntry[]>;
  lineMovement: LineMovementEntry[];
  rankings: RankingRow[];
  sportPayload: SportModulePayload;
  contextual: {
    winProbability: [number, number];
    opponentRank: number;
    opponentAllowed: number;
    similarPlayers: Array<{ name: string; value: number; line: number | null; usage: number; usageLabel: string }>;
    injuries: Array<{ name: string; position: string; status: string; note: string }>;
  };
}

export interface PlayerResearchAdapter { getPlayerResearch(player: Player, profile: PlayerScreenProfile): PlayerResearchViewModel; }
export interface PlayerRouteSelection { marketKey: string; line: number; periodKey: string; }
export type ResearchFilters = Record<PlayerFilterKey, string>;
