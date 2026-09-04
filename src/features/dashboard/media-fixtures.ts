import type { Sport } from '@/features/dashboard/types';

export interface FixtureMediaAsset {
  source: 'thesportsdb';
  sourceEntityId?: string;
  label: string;
  url: string;
  verifiedAt: '2026-09-03';
}

export interface FixtureTeamMedia {
  source: 'thesportsdb';
  sourceEntityId: string;
  label: string;
  badgeUrl: string;
  logoUrl: string;
  verifiedAt: '2026-09-03';
}

const navigationAsset = (sourceEntityId: string, label: string, url: string): FixtureMediaAsset => ({
  source: 'thesportsdb',
  sourceEntityId,
  label,
  url,
  verifiedAt: '2026-09-03',
});

/**
 * Fixed demo snapshot from TheSportsDB's free V1 media. These are the actual
 * league or competition badges represented by each Arena Props navigation tab,
 * not the generic green sport-category pictograms.
 */
export const SPORT_MEDIA: Record<Sport, FixtureMediaAsset> = {
  NBA: navigationAsset('4387', 'NBA', 'https://r2.thesportsdb.com/images/media/league/badge/frdjqy1536585083.png'),
  NFL: navigationAsset('4391', 'NFL', 'https://r2.thesportsdb.com/images/media/league/badge/g85fqz1662057187.png'),
  MLB: navigationAsset('4424', 'MLB', 'https://r2.thesportsdb.com/images/media/league/badge/c5r83j1521893739.png'),
  NHL: navigationAsset('4380', 'NHL', 'https://r2.thesportsdb.com/images/media/league/badge/4cem2k1619616539.png'),
  WNBA: navigationAsset('4516', 'WNBA', 'https://r2.thesportsdb.com/images/media/league/badge/47llb31573154455.png'),
  NCAAB: navigationAsset('4607', 'NCAA Division I Basketball Mens', 'https://r2.thesportsdb.com/images/media/league/badge/ibf3d21731087087.png'),
  NCAAF: navigationAsset('4479', 'NCAA Division 1 Football', 'https://r2.thesportsdb.com/images/media/league/badge/hm3cyr1758455622.png'),
  SOCCER: navigationAsset('4480', 'UEFA Champions League', 'https://r2.thesportsdb.com/images/media/league/badge/facv1u1742998896.png'),
  TENNIS: navigationAsset('4464', 'ATP World Tour', 'https://r2.thesportsdb.com/images/media/league/badge/q7aej51769857150.png'),
  LOL: navigationAsset('4531', 'League of Legends Championship Series', 'https://r2.thesportsdb.com/images/media/league/badge/nu81po1705482188.png'),
  CS2: navigationAsset('5425', 'ESL Pro League', 'https://r2.thesportsdb.com/images/media/league/badge/iwnm681705172445.png'),
  VALORANT: navigationAsset('5422', 'Valorant Champions Tour', 'https://r2.thesportsdb.com/images/media/league/badge/ihvdp41748984192.png'),
};

/** NBA teams present in the current fixed demo data. */
export const TEAM_MEDIA: Record<string, FixtureTeamMedia> = {
  BOS: {
    source: 'thesportsdb', sourceEntityId: '134860', label: 'Boston Celtics',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/4j85bn1667936589.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/d2jooe1778227792.png', verifiedAt: '2026-09-03',
  },
  CHI: {
    source: 'thesportsdb', sourceEntityId: '134870', label: 'Chicago Bulls',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/ehq8l31778197349.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/45ow8l1778227882.png', verifiedAt: '2026-09-03',
  },
  CLE: {
    source: 'thesportsdb', sourceEntityId: '134871', label: 'Cleveland Cavaliers',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/pch9ct1778195828.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/35ahyo1778227941.png', verifiedAt: '2026-09-03',
  },
  DAL: {
    source: 'thesportsdb', sourceEntityId: '134875', label: 'Dallas Mavericks',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/s5dx7c1778197536.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/5fktod1778227986.png', verifiedAt: '2026-09-03',
  },
  DEN: {
    source: 'thesportsdb', sourceEntityId: '134885', label: 'Denver Nuggets',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/s8ch7m1778197814.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/mf9w7e1778228078.png', verifiedAt: '2026-09-03',
  },
  GSW: {
    source: 'thesportsdb', sourceEntityId: '134865', label: 'Golden State Warriors',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/xokycb1778197905.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/2p7y6k1778228304.png', verifiedAt: '2026-09-03',
  },
  IND: {
    source: 'thesportsdb', sourceEntityId: '134873', label: 'Indiana Pacers',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/y3lutb1778226511.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/181w9y1778228339.png', verifiedAt: '2026-09-03',
  },
  LAL: {
    source: 'thesportsdb', sourceEntityId: '134867', label: 'Los Angeles Lakers',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/d8uoxw1714254511.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/dezp651778228551.png', verifiedAt: '2026-09-03',
  },
  MIA: {
    source: 'thesportsdb', sourceEntityId: '134882', label: 'Miami Heat',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/b9tye31778226616.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/zui4v11778228670.png', verifiedAt: '2026-09-03',
  },
  MIL: {
    source: 'thesportsdb', sourceEntityId: '134874', label: 'Milwaukee Bucks',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/olhug01621594702.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/mw4xqi1778228713.png', verifiedAt: '2026-09-03',
  },
  NYK: {
    source: 'thesportsdb', sourceEntityId: '134862', label: 'New York Knicks',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/4k8obt1778226764.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/k6nlj91778228924.png', verifiedAt: '2026-09-03',
  },
  OKC: {
    source: 'thesportsdb', sourceEntityId: '134887', label: 'Oklahoma City Thunder',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/bkhj5p1778199006.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/w7r38h1778228812.png', verifiedAt: '2026-09-03',
  },
  PHI: {
    source: 'thesportsdb', sourceEntityId: '134863', label: 'Philadelphia 76ers',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/j6rlbi1778226857.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/8t8nvz1778229063.png', verifiedAt: '2026-09-03',
  },
  PHX: {
    source: 'thesportsdb', sourceEntityId: '134868', label: 'Phoenix Suns',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/xfyknc1778198971.png',
    logoUrl: 'https://r2.thesportsdb.com/images/media/team/logo/4zpte51778229171.png', verifiedAt: '2026-09-03',
  },
};

export const sportMediaFor = (sport: Sport) => SPORT_MEDIA[sport];
export const teamMediaFor = (team: string) => TEAM_MEDIA[team];
