import { GAMES, PLAYERS, propsForGame, teamName } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { EmptyState } from '@/features/dashboard/components/common';
import { ArrowLeft } from 'lucide-react';
import { PropsTable } from '@/features/dashboard/components/PropsTable';
import { MatchupRow } from '@/features/dashboard/components/MatchupRow';
import { isCanonicalGameId } from '@/features/dashboard/matchup-view';
import { DashboardPageHeader, ResearchSurface } from '@/features/dashboard/components/dashboard-ui';
import { TeamBadge } from '@/features/dashboard/components/EntityMedia';
import { LiveMatchups } from './LiveMatchups';

export function MatchupsPage() {
  const { sport } = useDashboard();
  if (sport === 'NBA' || sport === 'All') return <LiveMatchups />;
  return <DemoMatchupsPage />;
}

function DemoMatchupsPage() {
  const { sport, saved, toggleSave } = useDashboard();
  const games = GAMES.filter((g) => sport === 'All' || g.sport === sport).sort((a, b) => {
    const statusOrder = (status: string) => status.toLowerCase().includes('live') ? 0 : status.toLowerCase().includes('final') ? 2 : 1;
    const timeValue = (time: string) => { const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i); if (!match) return Number.MAX_SAFE_INTEGER; const hour = Number(match[1]) % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0); return hour * 60 + Number(match[2]); };
    return statusOrder(a.status) - statusOrder(b.status) || timeValue(a.time) - timeValue(b.time);
  });

  if (games.length === 0) return <EmptyState title="No games scheduled for this sport today." />;

  return (
    <div className="space-y-3">
      <p className="text-xs text-amber-300">Fixed demo data · No live connection for this sport</p>
      <DashboardPageHeader eyebrow="Schedule" title="Today's Matchups" description="Games ordered by start time and status, with available player-prop coverage at a glance." />
      <ResearchSurface className="divide-y divide-[var(--dashboard-border)]">
        {games.map((g) => {
          const props = propsForGame(g.id);
          const players = PLAYERS.filter((p) => p.sport === g.sport && (p.team === g.homeTeam || p.team === g.awayTeam));
          const isSaved = saved.games.includes(g.id);
          return (
            <MatchupRow key={g.id} matchup={{
              id: g.id, sport: g.sport,
              away: { abbreviation: g.awayTeam, name: teamName(g.awayTeam, g.sport) },
              home: { abbreviation: g.homeTeam, name: teamName(g.homeTeam, g.sport) },
              timing: `${g.time} · ${g.status}`,
              counts: { props: props.length, players: players.length, books: new Set(props.flatMap((p) => p.books.map((b) => b.book))).size },
            }} isSaved={isSaved} onSave={() => toggleSave('games', g.id)} />
          );
        })}
      </ResearchSurface>
    </div>
  );
}

export function GamePage() {
  const { gameId } = useDashboard();
  if (gameId && isCanonicalGameId(gameId)) return <LiveMatchups gameId={gameId} />;
  return <DemoGamePage />;
}

function DemoGamePage() {
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
