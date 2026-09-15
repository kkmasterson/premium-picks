import type { ScheduleGame } from '@arena/contracts';
import type { Sport } from './types';
import type { Directory, OddsSnapshot } from '../../../packages/contracts/src/free-data';

export interface MatchupSummary {
  id: string;
  sport: Sport;
  away: { abbreviation: string; name: string; image?: string | null };
  home: { abbreviation: string; name: string; image?: string | null };
  imported?: boolean;
  timing: string;
  counts: { props: number | null; players: number | null; books: number | null };
}

export const isCanonicalGameId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
const dateFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Phoenix', year: 'numeric', month: '2-digit', day: '2-digit' });
const timeFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Phoenix', hour: 'numeric', minute: '2-digit' });
const states: Record<ScheduleGame['state'], string> = { scheduled: 'Scheduled', in_progress: 'In progress at last import', final: 'Final at last import', postponed: 'Postponed', canceled: 'Canceled', delayed: 'Delayed', suspended: 'Suspended', abandoned: 'Abandoned', unknown: 'Status unavailable' };

export const scheduleDate = (game: ScheduleGame) => game.startsAt ? dateFormat.format(new Date(game.startsAt)) : game.date;

/** Map only the accepted schedule read model; never join fixture research by team or date. */
export function scheduleMatchup(game: ScheduleGame, directory?: Directory | null, odds?: OddsSnapshot | null): MatchupSummary {
  const quotes = odds?.eventId === game.id ? odds.quotes : null;
  const props = quotes?.filter((q) => q.subject !== 'Game');
  return {
    id: game.id, sport: 'NBA', imported: true,
    away: { ...game.away, image: directory?.teams.find((t) => t.id === game.away.id)?.image ?? null },
    home: { ...game.home, image: directory?.teams.find((t) => t.id === game.home.id)?.image ?? null },
    timing: `${scheduleDate(game)} · ${game.startsAt ? `${timeFormat.format(new Date(game.startsAt))} AZ` : 'Time TBD'} · ${states[game.state]}${game.homeScore !== null && game.awayScore !== null ? ` · ${game.awayScore}–${game.homeScore}` : ''}${game.period ? ` · P${game.period}${game.clock ? ` ${game.clock}` : ''}` : ''}${game.postseason ? ' · Postseason' : ''}`,
    counts: { props: props ? new Set(props.map((q) => JSON.stringify([q.subject, q.market, q.line]))).size : null, players: props ? new Set(props.map((q) => q.subject)).size : null, books: quotes ? new Set(quotes.map((q) => q.book)).size : null },
  };
}
