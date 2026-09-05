import type { BookLine, Game, GameLogEntry, Player, Prop, Sport } from '@/features/dashboard/types';

// ---------- deterministic RNG ----------
function hash(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rngFor = (key: string) => mulberry32(hash(key));

// ---------- static data ----------
export const SPORTS: Sport[] = ['NBA', 'NFL', 'MLB', 'NHL', 'WNBA', 'NCAAB', 'NCAAF', 'SOCCER', 'TENNIS', 'LOL', 'CS2', 'VALORANT'];

export const BOOKS: Record<string, string> = {
  DK: 'DraftKings', FD: 'FanDuel', MGM: 'BetMGM', CZR: 'Caesars', FAN: 'Fanatics', B365: 'bet365',
};

const TEAMS: Record<Sport, string[]> = {
  NBA: ['NYK', 'BOS', 'LAL', 'GSW', 'DEN', 'MIL', 'PHX', 'DAL', 'MIA', 'PHI', 'CLE', 'OKC', 'IND', 'CHI'],
  NFL: ['KC', 'BUF', 'SF', 'DAL', 'PHI', 'BAL', 'MIA', 'CIN'],
  MLB: ['NYY', 'LAD', 'HOU', 'ATL', 'BOS', 'PHI'],
  NHL: ['EDM', 'TOR', 'BOS', 'COL', 'NYR', 'FLA'],
  WNBA: ['LV', 'NY', 'CON', 'CHI', 'IND', 'SEA'],
  NCAAB: ['DUKE', 'KU', 'UNC', 'UCONN', 'UK', 'GONZ'],
  NCAAF: ['UGA', 'ALA', 'OSU', 'MICH', 'TEX', 'USC'],
  SOCCER: ['ARS', 'MCI', 'RMA', 'BAR', 'BAY', 'PSG', 'LIV', 'CHE'],
  TENNIS: ['USA', 'ESP', 'POL', 'BLR', 'ITA', 'SRB', 'GBR', 'GRE'],
  LOL: ['T1', 'GEN', 'G2', 'FNC', 'TL', 'C9'],
  CS2: ['NAVI', 'VIT', 'G2E', 'FZE', 'MOUZ', 'SPIR'],
  VALORANT: ['SEN', 'LOUD', 'FNCV', 'PRX', 'GENG', 'LEV'],
};

const TEAM_NAMES: Record<string, string> = {
  NYK: 'New York Knicks', BOS: 'Boston Celtics', LAL: 'Los Angeles Lakers', GSW: 'Golden State Warriors',
  DEN: 'Denver Nuggets', MIL: 'Milwaukee Bucks', PHX: 'Phoenix Suns', DAL: 'Dallas Mavericks',
  MIA: 'Miami Heat', PHI: 'Philadelphia 76ers', CLE: 'Cleveland Cavaliers', OKC: 'Oklahoma City Thunder',
  IND: 'Indiana Pacers', CHI: 'Chicago Bulls',
  KC: 'Kansas City Chiefs', BUF: 'Buffalo Bills', SF: 'San Francisco 49ers', BAL: 'Baltimore Ravens',
  CIN: 'Cincinnati Bengals',
  NYY: 'New York Yankees', LAD: 'Los Angeles Dodgers', HOU: 'Houston Astros', ATL: 'Atlanta Braves',
  EDM: 'Edmonton Oilers', TOR: 'Toronto Maple Leafs', COL: 'Colorado Avalanche', NYR: 'New York Rangers',
  FLA: 'Florida Panthers',
  LV: 'Las Vegas Aces', NY: 'New York Liberty', CON: 'Connecticut Sun', SEA: 'Seattle Storm',
  DUKE: 'Duke Blue Devils', KU: 'Kansas Jayhawks', UNC: 'North Carolina Tar Heels', UCONN: 'UConn Huskies',
  UK: 'Kentucky Wildcats', GONZ: 'Gonzaga Bulldogs',
  UGA: 'Georgia Bulldogs', ALA: 'Alabama Crimson Tide', OSU: 'Ohio State Buckeyes', MICH: 'Michigan Wolverines',
  TEX: 'Texas Longhorns', USC: 'USC Trojans',
  ARS: 'Arsenal', MCI: 'Manchester City', RMA: 'Real Madrid', BAR: 'Barcelona', BAY: 'Bayern Munich', PSG: 'Paris Saint-Germain', LIV: 'Liverpool', CHE: 'Chelsea',
  USA: 'United States', ESP: 'Spain', POL: 'Poland', BLR: 'Belarus', ITA: 'Italy', SRB: 'Serbia', GBR: 'Great Britain', GRE: 'Greece',
  T1: 'T1', GEN: 'Gen.G', G2: 'G2 Esports', FNC: 'Fnatic', TL: 'Team Liquid', C9: 'Cloud9',
  NAVI: 'Natus Vincere', VIT: 'Vitality', G2E: 'G2 Esports', FZE: 'FaZe Clan', MOUZ: 'MOUZ', SPIR: 'Team Spirit',
  SEN: 'Sentinels', LOUD: 'LOUD', FNCV: 'Fnatic', PRX: 'Paper Rex', GENG: 'Gen.G', LEV: 'Leviatán',
};

const SPORT_TEAM_NAME_OVERRIDES: Partial<Record<Sport, Record<string, string>>> = {
  NFL: {
    KC: 'Kansas City Chiefs', BUF: 'Buffalo Bills', SF: 'San Francisco 49ers', DAL: 'Dallas Cowboys',
    PHI: 'Philadelphia Eagles', BAL: 'Baltimore Ravens', MIA: 'Miami Dolphins', CIN: 'Cincinnati Bengals',
  },
};

export const teamName = (abbr: string, sport?: Sport) => SPORT_TEAM_NAME_OVERRIDES[sport ?? 'NBA']?.[abbr] ?? TEAM_NAMES[abbr] ?? abbr;

interface PlayerSeed { name: string; team: string; pos: string; jersey: number; }

const PLAYER_SEEDS: Record<Sport, PlayerSeed[]> = {
  NBA: [
    { name: 'Jalen Brunson', team: 'NYK', pos: 'PG', jersey: 11 },
    { name: 'Jayson Tatum', team: 'BOS', pos: 'SF', jersey: 0 },
    { name: 'LeBron James', team: 'LAL', pos: 'SF', jersey: 23 },
    { name: 'Stephen Curry', team: 'GSW', pos: 'PG', jersey: 30 },
    { name: 'Nikola Jokic', team: 'DEN', pos: 'C', jersey: 15 },
    { name: 'Giannis Antetokounmpo', team: 'MIL', pos: 'PF', jersey: 34 },
    { name: 'Kevin Durant', team: 'PHX', pos: 'PF', jersey: 35 },
    { name: 'Luka Doncic', team: 'DAL', pos: 'PG', jersey: 77 },
    { name: 'Jimmy Butler', team: 'MIA', pos: 'SF', jersey: 22 },
    { name: 'Joel Embiid', team: 'PHI', pos: 'C', jersey: 21 },
    { name: 'Donovan Mitchell', team: 'CLE', pos: 'SG', jersey: 45 },
    { name: 'Shai Gilgeous-Alexander', team: 'OKC', pos: 'PG', jersey: 2 },
    { name: 'Anthony Davis', team: 'LAL', pos: 'PF', jersey: 3 },
    { name: 'Tyrese Haliburton', team: 'IND', pos: 'PG', jersey: 0 },
    { name: 'Devin Booker', team: 'PHX', pos: 'SG', jersey: 1 },
    { name: 'Zach LaVine', team: 'CHI', pos: 'SG', jersey: 8 },
  ],
  NFL: [
    { name: 'Patrick Mahomes', team: 'KC', pos: 'QB', jersey: 15 },
    { name: 'Josh Allen', team: 'BUF', pos: 'QB', jersey: 17 },
    { name: 'Christian McCaffrey', team: 'SF', pos: 'RB', jersey: 23 },
    { name: 'CeeDee Lamb', team: 'DAL', pos: 'WR', jersey: 88 },
    { name: 'Jalen Hurts', team: 'PHI', pos: 'QB', jersey: 1 },
    { name: 'Lamar Jackson', team: 'BAL', pos: 'QB', jersey: 8 },
    { name: 'Tyreek Hill', team: 'MIA', pos: 'WR', jersey: 10 },
    { name: "Ja'Marr Chase", team: 'CIN', pos: 'WR', jersey: 1 },
    { name: 'Travis Kelce', team: 'KC', pos: 'TE', jersey: 87 },
    { name: 'Justin Tucker', team: 'BAL', pos: 'K', jersey: 9 },
  ],
  MLB: [
    { name: 'Aaron Judge', team: 'NYY', pos: 'RF', jersey: 99 },
    { name: 'Shohei Ohtani', team: 'LAD', pos: 'DH', jersey: 17 },
    { name: 'Jose Altuve', team: 'HOU', pos: '2B', jersey: 27 },
    { name: 'Ronald Acuna Jr.', team: 'ATL', pos: 'RF', jersey: 13 },
    { name: 'Rafael Devers', team: 'BOS', pos: '3B', jersey: 11 },
    { name: 'Bryce Harper', team: 'PHI', pos: '1B', jersey: 3 },
    { name: 'Gerrit Cole', team: 'NYY', pos: 'SP', jersey: 45 },
    { name: 'Max Fried', team: 'ATL', pos: 'SP', jersey: 54 },
  ],
  NHL: [
    { name: 'Connor McDavid', team: 'EDM', pos: 'C', jersey: 97 },
    { name: 'Auston Matthews', team: 'TOR', pos: 'C', jersey: 34 },
    { name: 'David Pastrnak', team: 'BOS', pos: 'RW', jersey: 88 },
    { name: 'Nathan MacKinnon', team: 'COL', pos: 'C', jersey: 29 },
    { name: 'Artemi Panarin', team: 'NYR', pos: 'LW', jersey: 10 },
    { name: 'Matthew Tkachuk', team: 'FLA', pos: 'LW', jersey: 19 },
  ],
  WNBA: [
    { name: "A'ja Wilson", team: 'LV', pos: 'F', jersey: 22 },
    { name: 'Breanna Stewart', team: 'NY', pos: 'F', jersey: 30 },
    { name: 'Alyssa Thomas', team: 'CON', pos: 'F', jersey: 25 },
    { name: 'Angel Reese', team: 'CHI', pos: 'F', jersey: 5 },
    { name: 'Caitlin Clark', team: 'IND', pos: 'G', jersey: 22 },
    { name: 'Jewell Loyd', team: 'SEA', pos: 'G', jersey: 24 },
  ],
  NCAAB: [
    { name: 'Cameron Ellis', team: 'DUKE', pos: 'G', jersey: 4 },
    { name: 'Malik Turner', team: 'KU', pos: 'F', jersey: 21 },
    { name: 'Jaylen Brooks', team: 'UNC', pos: 'G', jersey: 2 },
    { name: 'Andre Whitfield', team: 'UCONN', pos: 'C', jersey: 33 },
    { name: 'Trey Donovan', team: 'UK', pos: 'G', jersey: 10 },
    { name: 'Marcus Hale', team: 'GONZ', pos: 'F', jersey: 14 },
  ],
  NCAAF: [
    { name: 'Jaden Carter', team: 'UGA', pos: 'QB', jersey: 7 },
    { name: 'Marcus Reed', team: 'ALA', pos: 'WR', jersey: 3 },
    { name: 'Dylan Shaw', team: 'OSU', pos: 'RB', jersey: 28 },
    { name: 'Andre Coleman', team: 'MICH', pos: 'QB', jersey: 12 },
    { name: 'Trey Marshall', team: 'TEX', pos: 'RB', jersey: 5 },
    { name: 'Isaiah Ford', team: 'USC', pos: 'WR', jersey: 9 },
    { name: 'Evan Brooks', team: 'MICH', pos: 'TE', jersey: 86 },
    { name: 'Luke Hayes', team: 'ALA', pos: 'K', jersey: 39 },
  ],
  SOCCER: [
    { name: 'Bukayo Saka', team: 'ARS', pos: 'F', jersey: 7 },
    { name: 'Erling Haaland', team: 'MCI', pos: 'F', jersey: 9 },
    { name: 'Jude Bellingham', team: 'RMA', pos: 'M', jersey: 5 },
    { name: 'Pedri', team: 'BAR', pos: 'M', jersey: 8 },
    { name: 'Virgil van Dijk', team: 'LIV', pos: 'D', jersey: 4 },
    { name: 'William Saliba', team: 'ARS', pos: 'D', jersey: 2 },
    { name: 'Thibaut Courtois', team: 'RMA', pos: 'GK', jersey: 1 },
    { name: 'Gianluigi Donnarumma', team: 'PSG', pos: 'GK', jersey: 99 },
  ],
  TENNIS: [
    { name: 'Coco Gauff', team: 'USA', pos: 'Singles', jersey: 1 },
    { name: 'Carlos Alcaraz', team: 'ESP', pos: 'Singles', jersey: 1 },
    { name: 'Iga Swiatek', team: 'POL', pos: 'Singles', jersey: 1 },
    { name: 'Aryna Sabalenka', team: 'BLR', pos: 'Singles', jersey: 1 },
    { name: 'Jannik Sinner', team: 'ITA', pos: 'Singles', jersey: 1 },
    { name: 'Novak Djokovic', team: 'SRB', pos: 'Singles', jersey: 1 },
  ],
  LOL: [
    { name: 'Zeus', team: 'T1', pos: 'Top', jersey: 1 },
    { name: 'Faker', team: 'T1', pos: 'Mid', jersey: 1 },
    { name: 'Chovy', team: 'GEN', pos: 'Mid', jersey: 1 },
    { name: 'Caps', team: 'G2', pos: 'Mid', jersey: 1 },
    { name: 'Impact', team: 'TL', pos: 'Top', jersey: 1 },
    { name: 'Blaber', team: 'C9', pos: 'Jungle', jersey: 1 },
  ],
  CS2: [
    { name: 's1mple', team: 'NAVI', pos: 'AWP', jersey: 1 },
    { name: 'ZywOo', team: 'VIT', pos: 'AWP', jersey: 1 },
    { name: 'm0NESY', team: 'G2E', pos: 'AWP', jersey: 1 },
    { name: 'NiKo', team: 'G2E', pos: 'Rifler', jersey: 1 },
    { name: 'ropz', team: 'FZE', pos: 'Rifler', jersey: 1 },
    { name: 'donk', team: 'SPIR', pos: 'Rifler', jersey: 1 },
  ],
  VALORANT: [
    { name: 'TenZ', team: 'SEN', pos: 'Duelist', jersey: 1 },
    { name: 'aspas', team: 'LEV', pos: 'Duelist', jersey: 1 },
    { name: 'Less', team: 'LOUD', pos: 'Sentinel', jersey: 1 },
    { name: 'Boaster', team: 'FNCV', pos: 'Controller', jersey: 1 },
    { name: 'something', team: 'PRX', pos: 'Duelist', jersey: 1 },
    { name: 't3xture', team: 'GENG', pos: 'Duelist', jersey: 1 },
  ],
};

// market base ranges per sport/pos
interface MarketDef { market: string; min: number; max: number; step: number; variance: number; }
function marketsFor(sport: Sport, pos: string): MarketDef[] {
  const bball: MarketDef[] = [
    { market: 'Minutes', min: 24, max: 38, step: 1, variance: 5 },
    { market: 'Points', min: 14, max: 33, step: 0.5, variance: 6 },
    { market: 'Rebounds', min: 3.5, max: 12.5, step: 0.5, variance: 2.5 },
    { market: 'Offensive Rebounds', min: 0.5, max: 4.5, step: 0.5, variance: 1.5 },
    { market: 'Defensive Rebounds', min: 2.5, max: 9.5, step: 0.5, variance: 2.2 },
    { market: 'Assists', min: 2.5, max: 10.5, step: 0.5, variance: 2 },
    { market: 'Points + Assists', min: 18, max: 42, step: 0.5, variance: 7 },
    { market: 'Points + Rebounds', min: 20, max: 44, step: 0.5, variance: 7 },
    { market: 'Rebounds + Assists', min: 7, max: 20, step: 0.5, variance: 4 },
    { market: 'Points + Rebounds + Assists', min: 24, max: 50, step: 0.5, variance: 8 },
    { market: 'Blocks', min: 0.5, max: 3.5, step: 0.5, variance: 1 },
    { market: 'Steals', min: 0.5, max: 2.5, step: 0.5, variance: 1 },
    { market: 'Turnovers', min: 1.5, max: 5.5, step: 0.5, variance: 1.5 },
    { market: '3-Pointers Made', min: 0.5, max: 5.5, step: 0.5, variance: 1.2 },
    { market: '3-Point Attempts', min: 2, max: 11, step: 1, variance: 3 },
    { market: '2-Pointers Made', min: 2.5, max: 10.5, step: 0.5, variance: 2.5 },
    { market: '2-Point Attempts', min: 5.5, max: 18.5, step: 0.5, variance: 4 },
    { market: 'Free Throws Made', min: 1.5, max: 8.5, step: 0.5, variance: 2 },
    { market: 'Free Throw Attempts', min: 2.5, max: 10.5, step: 0.5, variance: 2.5 },
    { market: 'Field Goals Made', min: 4.5, max: 13.5, step: 0.5, variance: 3 },
    { market: 'Field Goal Attempts', min: 10.5, max: 24.5, step: 0.5, variance: 5 },
    { market: 'Blocks + Steals', min: 1.5, max: 5.5, step: 0.5, variance: 1.5 },
    { market: 'Fantasy Points', min: 22, max: 55, step: 0.5, variance: 9 },
    { market: 'Dunk Attempts', min: 0.5, max: 4.5, step: 0.5, variance: 1.5 },
    { market: 'Personal Fouls', min: 1.5, max: 4.5, step: 0.5, variance: 1.2 },
    { market: 'Double Double', min: 0, max: 1, step: 1, variance: 0.5 },
    { market: 'Triple Double', min: 0, max: 1, step: 1, variance: 0.4 },
  ];
  switch (sport) {
    case 'NBA': case 'WNBA': case 'NCAAB': return bball;
    case 'NFL': case 'NCAAF':
      if (pos === 'QB') return [
        { market: 'Passing Yards', min: 210, max: 320, step: 0.5, variance: 45 },
        { market: 'Rushing Yards', min: 18, max: 55, step: 0.5, variance: 15 },
        { market: 'Passing Touchdowns', min: 1, max: 4, step: 1, variance: 1.4 },
        { market: 'Completions', min: 18.5, max: 29.5, step: 0.5, variance: 4 },
      ];
      if (pos === 'RB') return [
        { market: 'Rushing Yards', min: 45, max: 105, step: 0.5, variance: 25 },
        { market: 'Receiving Yards', min: 15, max: 55, step: 0.5, variance: 15 },
        { market: 'Receptions', min: 2.5, max: 7.5, step: 0.5, variance: 2 },
        { market: 'Touches', min: 12.5, max: 25.5, step: 0.5, variance: 5 },
      ];
      if (pos === 'K') return [
        { market: 'Kicking Points', min: 5.5, max: 11.5, step: 0.5, variance: 3 },
        { market: 'Field Goals Made', min: 1, max: 4, step: 1, variance: 1.3 },
      ];
      return [
        { market: 'Receiving Yards', min: 45, max: 105, step: 0.5, variance: 25 },
        { market: 'Receptions', min: 3.5, max: 8.5, step: 0.5, variance: 1.8 },
        { market: 'Targets', min: 5.5, max: 12.5, step: 0.5, variance: 3 },
      ];
    case 'MLB':
      if (pos === 'SP') return [
        { market: 'Strikeouts', min: 4.5, max: 9.5, step: 0.5, variance: 2.2 },
        { market: 'Pitching Outs', min: 14.5, max: 20.5, step: 0.5, variance: 3 },
        { market: 'Hits Allowed', min: 3.5, max: 7.5, step: 0.5, variance: 2 },
        { market: 'Walks Allowed', min: 1.5, max: 4.5, step: 0.5, variance: 1.4 },
      ];
      return [
        { market: 'Hits', min: 0.5, max: 1.5, step: 0.5, variance: 0.7 },
        { market: 'Total Bases', min: 0.5, max: 2.5, step: 0.5, variance: 1.2 },
        { market: 'Runs', min: 0.5, max: 1.5, step: 0.5, variance: 0.7 },
        { market: 'Runs Batted In', min: 0.5, max: 1.5, step: 0.5, variance: 0.7 },
        { market: 'Home Runs', min: 0.5, max: 0.5, step: 0.5, variance: 0.5 },
      ];
    case 'NHL':
      return [
        { market: 'Points', min: 0.5, max: 1.5, step: 0.5, variance: 0.9 },
        { market: 'Shots on Goal', min: 1.5, max: 4.5, step: 0.5, variance: 1.2 },
        { market: 'Goals', min: 0.5, max: 0.5, step: 0.5, variance: 0.5 },
        { market: 'Assists', min: 0.5, max: 1.5, step: 0.5, variance: 0.8 },
      ];
    case 'SOCCER':
      if (pos === 'GK') return [
        { market: 'Saves', min: 1.5, max: 6.5, step: 0.5, variance: 2 },
        { market: 'Goals Allowed', min: 0.5, max: 3.5, step: 0.5, variance: 1.2 },
        { market: 'Clean Sheet', min: 0, max: 1, step: 1, variance: 0.5 },
      ];
      if (pos === 'D') return [
        { market: 'Fouls', min: 0.5, max: 3.5, step: 0.5, variance: 1.2 },
        { market: 'Tackles', min: 1.5, max: 5.5, step: 0.5, variance: 1.5 },
        { market: 'Clearances', min: 2.5, max: 7.5, step: 0.5, variance: 2 },
      ];
      if (pos === 'M') return [
        { market: 'Shots Attempted', min: 0.5, max: 4.5, step: 0.5, variance: 1.5 },
        { market: 'Passes', min: 35.5, max: 82.5, step: 0.5, variance: 14 },
        { market: 'Tackles', min: 0.5, max: 4.5, step: 0.5, variance: 1.5 },
      ];
      return [
        { market: 'Shots on Target', min: 0.5, max: 3.5, step: 0.5, variance: 1.2 },
        { market: 'Goals', min: 0.5, max: 1.5, step: 0.5, variance: 0.7 },
        { market: 'Shots Attempted', min: 1.5, max: 5.5, step: 0.5, variance: 1.8 },
      ];
    case 'TENNIS':
      return [
        { market: 'Games Won', min: 9.5, max: 16.5, step: 0.5, variance: 3 },
        { market: 'Aces', min: 2.5, max: 12.5, step: 0.5, variance: 4 },
        { market: 'Double Faults', min: 1.5, max: 5.5, step: 0.5, variance: 1.5 },
        { market: 'Break Points Won', min: 2.5, max: 7.5, step: 0.5, variance: 2 },
      ];
    case 'LOL':
      return [
        { market: 'Kills', min: 2.5, max: 7.5, step: 0.5, variance: 2 },
        { market: 'Assists', min: 4.5, max: 12.5, step: 0.5, variance: 3 },
        { market: 'CS', min: 210.5, max: 340.5, step: 0.5, variance: 40 },
      ];
    case 'CS2':
      return [
        { market: 'Kills', min: 28.5, max: 48.5, step: 0.5, variance: 8 },
        { market: 'Headshots', min: 10.5, max: 24.5, step: 0.5, variance: 5 },
        { market: 'Assists', min: 7.5, max: 15.5, step: 0.5, variance: 3 },
      ];
    case 'VALORANT':
      return [
        { market: 'Kills', min: 28.5, max: 48.5, step: 0.5, variance: 8 },
        { market: 'Headshots', min: 9.5, max: 23.5, step: 0.5, variance: 5 },
        { market: 'Assists', min: 8.5, max: 18.5, step: 0.5, variance: 4 },
      ];
  }
}

const GAME_TIMES = ['1:05 PM', '4:05 PM', '7:00 PM', '7:30 PM', '8:00 PM', '10:00 PM'];

// ---------- build games ----------
export const GAMES: Game[] = [];
SPORTS.forEach((sport) => {
  const teams = TEAMS[sport];
  const r = rngFor('games-' + sport);
  for (let i = 0; i + 1 < teams.length; i += 2) {
    const away = teams[i], home = teams[i + 1];
    GAMES.push({
      id: `${sport}-${away}-${home}`,
      sport,
      awayTeam: away,
      homeTeam: home,
      time: GAME_TIMES[Math.floor(r() * GAME_TIMES.length)],
      status: 'Scheduled',
    });
  }
});

function gameForTeam(sport: Sport, team: string): Game {
  const g = GAMES.find((g) => g.sport === sport && (g.homeTeam === team || g.awayTeam === team));
  return g ?? GAMES.find((g) => g.sport === sport)!;
}

// ---------- build players ----------
export const PLAYERS: Player[] = [];
SPORTS.forEach((sport) => {
  PLAYER_SEEDS[sport].forEach((p) => {
    const g = gameForTeam(sport, p.team);
    const home = g.homeTeam === p.team;
    PLAYERS.push({
      id: `${sport}-${p.name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
      name: p.name, team: p.team, pos: p.pos, sport, jersey: p.jersey,
      opponent: home ? g.awayTeam : g.homeTeam,
      home,
      gameTime: g.time,
      gameId: g.id,
    });
  });
});

// ---------- build props ----------
const BOOK_KEYS = Object.keys(BOOKS);
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

function buildProp(player: Player, def: MarketDef): Prop {
  const key = `${player.id}-${def.market}`;
  const r = rngFor(key);
  const avg = Math.round((def.min + r() * (def.max - def.min)) * 2) / 2;
  // line near avg
  const lineRaw = avg + (r() - 0.5) * def.variance * 0.8;
  const line = Math.max(def.step, Math.round(lineRaw / def.step) * def.step - (r() > 0.5 ? 0 : 0)) ;

  // season: 40 game values
  const games: number[] = [];
  for (let i = 0; i < 40; i++) {
    const v = avg + (r() - 0.5) * 2 * def.variance + Math.sin(i / 3 + r() * 2) * def.variance * 0.4;
    games.push(Math.max(0, Math.round(v)));
  }
  const over = (v: number) => v > line;
  const last = (n: number) => games.slice(-n);
  const pct = (arr: number[]) => Math.round((arr.filter(over).length / arr.length) * 100);

  const l5 = pct(last(5)), l10 = pct(last(10)), l15 = pct(last(15)), season = pct(games);

  // streak
  const streakType: 'Over' | 'Under' = over(games[39]) ? 'Over' : 'Under';
  let streakCount = 0;
  for (let i = 39; i >= 0; i--) {
    if ((over(games[i]) ? 'Over' : 'Under') === streakType) streakCount++; else break;
  }

  // game log: last 15
  const gameLog: GameLogEntry[] = [];
  for (let i = 0; i < 15; i++) {
    const gi = 39 - i;
    const oppPool = TEAMS[player.sport].filter((t) => t !== player.team);
    const opp = oppPool[Math.floor(rngFor(key + '-opp' + i)() * oppPool.length)];
    const home = rngFor(key + '-home' + i)() > 0.5;
    const gameLine = Math.max(def.step, Math.round((line + (rngFor(key + '-gl' + i)() - 0.5) * 2) * 2) / 2);
    gameLog.push({
      date: `${MONTHS[Math.floor(i / 3) % MONTHS.length]} ${28 - i * 2 > 0 ? 28 - i * 2 : 28 - i}`,
      opp, home,
      minutes: player.sport === 'NBA' || player.sport === 'WNBA' || player.sport === 'NCAAB' ? Math.round(24 + rngFor(key + '-min' + i)() * 14) : 0,
      value: games[gi],
      line: gameLine,
      over: games[gi] > gameLine,
    });
  }

  // books
  const nBooks = 3 + Math.floor(r() * 4);
  const shuffled = [...BOOK_KEYS].sort(() => rngFor(key + '-bk' + r())() - 0.5).slice(0, nBooks);
  const books: BookLine[] = shuffled.map((bk, i) => {
    const br = rngFor(key + '-book-' + bk);
    const bline = Math.max(def.step, Math.round((line + (br() - 0.5) * 1) * 2) / 2);
    const norm = (o: number) => (o > -100 && o < 100 ? (o >= 0 ? o + 100 : o - 100) : o);
    const base = -135 + Math.floor(br() * 40); // -135..-96
    const over = norm(br() > 0.75 ? 100 + Math.floor(br() * 10) : base + Math.floor(br() * 20) - 10);
    const under = norm(-over - 20 - Math.floor(br() * 10));
    return { book: bk, bookName: BOOKS[bk], line: bline, over, under, updatedAt: 5 + Math.floor(br() * 300) + i };
  });

  const projection = Math.round((avg + (r() - 0.5) * def.variance * 0.5) * 10) / 10;
  const diff = Math.round((projection - line) * 10) / 10;
  const h2h = Math.min(100, Math.max(0, season + Math.round((r() - 0.5) * 20)));

  return {
    id: key, playerId: player.id, market: def.market, line, books,
    avg: Math.round((games.reduce((a, b) => a + b, 0) / games.length) * 10) / 10,
    projection, diff, l5, l10, l15, season, seasonGames: 40, h2h,
    streak: { type: streakType, count: streakCount }, gameLog,
  };
}

export const PROPS: Prop[] = [];
PLAYERS.forEach((p) => {
  marketsFor(p.sport, p.pos).forEach((def) => PROPS.push(buildProp(p, def)));
});

// ---------- lookups ----------
export const playerById = (id: string) => PLAYERS.find((p) => p.id === id);
export const gameById = (id: string) => GAMES.find((g) => g.id === id);
export const propById = (id: string) => PROPS.find((p) => p.id === id);
export const propsForPlayer = (id: string) => PROPS.filter((p) => p.playerId === id);
export const propsForGame = (id: string) => {
  const g = gameById(id);
  if (!g) return [];
  const playerIds = PLAYERS.filter((p) => p.gameId === id || (p.sport === g.sport && (p.team === g.homeTeam || p.team === g.awayTeam))).map((p) => p.id);
  return PROPS.filter((p) => playerIds.includes(p.playerId));
};
export const marketsForSport = (sport: Sport | 'All') =>
  [...new Set(PROPS.filter((p) => sport === 'All' || playerById(p.playerId)!.sport === sport).map((p) => p.market))];

export function bestBook(prop: Prop, side: 'over' | 'under' = 'over'): BookLine {
  return prop.books.reduce((best, b) => (side === 'over' ? b.over > best.over : b.under > best.under) ? b : best, prop.books[0]);
}

export function formatOdds(o: number | null): string {
  if (o === null) return '—';
  return o > 0 ? `+${o}` : `${o}`;
}

export function initials(name: string): string {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

// deterministic avatar color from name
const AV_COLORS = ['#3b3b1f', '#1f2e3b', '#3b1f2a', '#233b1f', '#2a1f3b', '#3b2f1f'];
export function avatarColor(name: string): string {
  return AV_COLORS[hash(name) % AV_COLORS.length];
}
