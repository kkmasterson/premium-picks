import { GAMES, PLAYERS, propsForGame, teamName } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { EmptyState } from '@/features/dashboard/components/common';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { PropsTable } from '@/features/dashboard/components/PropsTable';
import { cn } from '@/lib/utils';
import { DashboardPageHeader, MetricStrip, ResearchSurface } from '@/features/dashboard/components/dashboard-ui';
import { TeamBadge } from '@/features/dashboard/components/EntityMedia';

export function MatchupsPage() {
  const { sport, navigate, saved, toggleSave } = useDashboard();
  const games = GAMES.filter((g) => sport === 'All' || g.sport === sport).sort((a, b) => {
    const statusOrder = (status: string) => status.toLowerCase().includes('live') ? 0 : status.toLowerCase().includes('final') ? 2 : 1;
    const timeValue = (time: string) => { const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i); if (!match) return Number.MAX_SAFE_INTEGER; const hour = Number(match[1]) % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0); return hour * 60 + Number(match[2]); };
    return statusOrder(a.status) - statusOrder(b.status) || timeValue(a.time) - timeValue(b.time);
  });

  if (games.length === 0) return <EmptyState title="No games scheduled for this sport today." />;

  return (
    <div className="space-y-3">
      <DashboardPageHeader eyebrow="Schedule" title="Today's Matchups" description="Games ordered by start time and status, with available player-prop coverage at a glance." />
      <ResearchSurface className="divide-y divide-[var(--dashboard-border)]">
        {games.map((g) => {
          const props = propsForGame(g.id);
          const players = PLAYERS.filter((p) => p.sport === g.sport && (p.team === g.homeTeam || p.team === g.awayTeam));
          const isSaved = saved.games.includes(g.id);
          return (
            <article
              key={g.id}
              className="group cursor-pointer px-3 py-3.5 transition-colors hover:bg-[var(--dashboard-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 sm:px-4"
              onClick={() => navigate('game', { gameId: g.id })}
              onKeyDown={(e) => e.key === 'Enter' && navigate('game', { gameId: g.id })}
              tabIndex={0}
              role="link"
              aria-label={`${teamName(g.awayTeam, g.sport)} at ${teamName(g.homeTeam, g.sport)}, ${g.time}`}
            >
              <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(220px,1.5fr)_minmax(290px,1fr)_auto] sm:items-center">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex shrink-0 -space-x-1.5" aria-hidden="true">
                    <TeamBadge team={g.awayTeam} sport={g.sport} className="h-9 w-9 bg-[#111515]" />
                    <TeamBadge team={g.homeTeam} sport={g.sport} className="h-9 w-9 bg-[#111515]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-white sm:text-base">{g.awayTeam} <span className="text-zinc-600">@</span> {g.homeTeam}</p>
                    <p className="truncate text-[10px] text-zinc-500">{teamName(g.awayTeam, g.sport)} at {teamName(g.homeTeam, g.sport)}</p>
                    <p className="mt-1 text-[10px] font-medium text-teal-300">{g.time} · {g.status} · {g.sport}</p>
                  </div>
                </div>
                <MetricStrip compact metrics={[{ label: 'Props', value: props.length, sample: 'available', tone: 'active' }, { label: 'Players', value: players.length, sample: 'covered' }, { label: 'Books', value: new Set(props.flatMap((p) => p.books.map((b) => b.book))).size, sample: 'providers' }]} />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave('games', g.id); }}
                  aria-label={isSaved ? 'Remove game from saved' : 'Save game'}
                  aria-pressed={isSaved}
                  className="justify-self-end rounded-md border border-[var(--dashboard-border)] p-2 text-zinc-600 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
                >
                  <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current text-teal-300')} />
                </button>
              </div>
            </article>
          );
        })}
      </ResearchSurface>
    </div>
  );
}

export function GamePage() {
  const { gameId, navigate } = useDashboard();
  const game = gameId ? GAMES.find((g) => g.id === gameId) : null;
  if (!game) return <EmptyState title="We couldn't load this game. Try again." />;
  const props = propsForGame(game.id);
  const players = PLAYERS.filter((p) => p.sport === game.sport && (p.team === game.homeTeam || p.team === game.awayTeam));

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate('matchups')}
        className="flex items-center gap-1.5 rounded text-xs text-zinc-400 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Games
      </button>

      <div className="flex items-center gap-2.5 text-xs text-zinc-400" aria-label={`${teamName(game.awayTeam, game.sport)} at ${teamName(game.homeTeam, game.sport)}`}>
        <TeamBadge team={game.awayTeam} sport={game.sport} className="h-10 w-10" />
        <span className="font-semibold text-zinc-200">{game.awayTeam}</span>
        <span className="text-zinc-600">@</span>
        <TeamBadge team={game.homeTeam} sport={game.sport} className="h-10 w-10" />
        <span className="font-semibold text-zinc-200">{game.homeTeam}</span>
      </div>

      <DashboardPageHeader eyebrow={`${game.sport} · ${game.status} · ${game.time}`} title={`${game.awayTeam} @ ${game.homeTeam}`} description={`${teamName(game.awayTeam, game.sport)} at ${teamName(game.homeTeam, game.sport)} · ${props.length} props · ${players.length} players · ${new Set(props.flatMap((p) => p.books.map((b) => b.book))).size} providers`} />

      {props.length === 0 ? (
        <EmptyState title="No supported sportsbook lines are currently available for this game." />
      ) : (
        <PropsTable props={props} />
      )}
    </div>
  );
}
