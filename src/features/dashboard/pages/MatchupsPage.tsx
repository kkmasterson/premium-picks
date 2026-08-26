import { GAMES, PLAYERS, propsForGame, teamName } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { EmptyState } from '@/features/dashboard/components/common';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { PropsTable } from '@/features/dashboard/components/PropsTable';
import { cn } from '@/lib/utils';

export function MatchupsPage() {
  const { sport, navigate, saved, toggleSave } = useDashboard();
  const games = GAMES.filter((g) => sport === 'All' || g.sport === sport);

  if (games.length === 0) return <EmptyState title="No games scheduled for this sport today." />;

  return (
    <div className="space-y-4">
      <h1 className="px-1 text-sm font-semibold text-zinc-200">Today's Games</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {games.map((g) => {
          const props = propsForGame(g.id);
          const players = PLAYERS.filter((p) => p.sport === g.sport && (p.team === g.homeTeam || p.team === g.awayTeam));
          const isSaved = saved.games.includes(g.id);
          return (
            <article
              key={g.id}
              className="group cursor-pointer rounded-xl border border-[#1f1f1f] bg-[#111111] p-4 transition-colors hover:border-[#F5C542]/30"
              onClick={() => navigate('game', { gameId: g.id })}
              onKeyDown={(e) => e.key === 'Enter' && navigate('game', { gameId: g.id })}
              tabIndex={0}
              role="link"
              aria-label={`${teamName(g.awayTeam)} at ${teamName(g.homeTeam)}, ${g.time}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold text-white">{g.awayTeam} <span className="text-zinc-600">@</span> {g.homeTeam}</p>
                  <p className="text-xs text-zinc-500">{teamName(g.awayTeam)} at {teamName(g.homeTeam)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave('games', g.id); }}
                  aria-label={isSaved ? 'Remove game from saved' : 'Save game'}
                  aria-pressed={isSaved}
                  className="rounded p-1.5 text-zinc-600 hover:text-[#F5C542] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542]"
                >
                  <Bookmark className={cn('h-4 w-4', isSaved && 'fill-[#F5C542] text-[#F5C542]')} />
                </button>
              </div>
              <p className="mt-1 text-sm font-medium text-[#F5C542]">{g.time} · {g.sport}</p>
              <div className="mt-3 flex gap-4 border-t border-[#1c1c1c] pt-3 text-xs text-zinc-500">
                <span><span className="font-semibold text-zinc-200">{props.length}</span> Player Props</span>
                <span><span className="font-semibold text-zinc-200">{players.length}</span> Players</span>
                <span><span className="font-semibold text-zinc-200">{new Set(props.flatMap((p) => p.books.map((b) => b.book))).size}</span> Sportsbooks</span>
              </div>
            </article>
          );
        })}
      </div>
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
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#F5C542] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542] rounded"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Games
      </button>

      <div className="rounded-xl border border-[#1f1f1f] bg-gradient-to-r from-[#141414] to-[#0d0d0d] p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{game.sport} · {game.status} · {game.time}</p>
        <h1 className="mt-1 text-2xl font-bold text-white">{game.awayTeam} @ {game.homeTeam}</h1>
        <p className="text-sm text-zinc-400">{teamName(game.awayTeam)} at {teamName(game.homeTeam)}</p>
        <div className="mt-3 flex gap-5 text-xs text-zinc-500">
          <span><span className="font-semibold text-zinc-200">{props.length}</span> props available</span>
          <span><span className="font-semibold text-zinc-200">{players.length}</span> players</span>
          <span><span className="font-semibold text-zinc-200">{new Set(props.flatMap((p) => p.books.map((b) => b.book))).size}</span> sportsbooks</span>
        </div>
      </div>

      {props.length === 0 ? (
        <EmptyState title="No supported sportsbook lines are currently available for this game." />
      ) : (
        <PropsTable props={props} />
      )}
    </div>
  );
}
