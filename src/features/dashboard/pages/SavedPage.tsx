import { GAMES, bestBook, formatOdds, playerById, propById, teamName } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { DiffBadge, EmptyState, HitRateBadge, PlayerAvatar, SectionCard } from '@/features/dashboard/components/common';
import { Bookmark, Trash2 } from 'lucide-react';

export function SavedPage() {
  const { saved, toggleSave, openDrawer, navigate } = useDashboard();

  const savedProps = saved.props.map(propById).filter(Boolean);
  const savedPlayers = saved.players.map((id) => playerById(id)).filter(Boolean);
  const savedGames = saved.games.map((id) => GAMES.find((g) => g.id === id)).filter(Boolean);
  const empty = savedProps.length === 0 && savedPlayers.length === 0 && savedGames.length === 0;

  if (empty) {
    return (
      <EmptyState
        title="No saved research yet. Bookmark props, players, or games to find them here."
        action={
          <button
            onClick={() => navigate('props')}
            className="rounded-md border border-[#F5C542]/40 px-3 py-1.5 text-xs font-semibold text-[#F5C542] hover:bg-[#F5C542]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
          >
            Browse Props
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="px-1 text-sm font-semibold text-zinc-200">Saved Research</h1>

      {savedProps.length > 0 && (
        <SectionCard title={`Saved Props (${savedProps.length})`}>
          <div className="space-y-1">
            {savedProps.map((p) => {
              const pl = playerById(p!.playerId)!;
              const best = bestBook(p!, 'over');
              return (
                <div key={p!.id} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-[#181818]">
                  <button className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => openDrawer(p!.id)}>
                    <PlayerAvatar name={pl.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-100">{pl.name} · {p!.market}</p>
                      <p className="text-xs text-zinc-500">Line {p!.line} · Best: {best.book} {formatOdds(best.over)}</p>
                    </div>
                    <div className="hidden items-center gap-3 sm:flex">
                      <HitRateBadge pct={p!.l10} label="L10" />
                      <DiffBadge diff={p!.diff} />
                    </div>
                  </button>
                  <button
                    onClick={() => toggleSave('props', p!.id)}
                    aria-label={`Remove ${pl.name} ${p!.market} from saved`}
                    className="rounded p-1.5 text-zinc-600 hover:text-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {savedPlayers.length > 0 && (
        <SectionCard title={`Saved Players (${savedPlayers.length})`}>
          <div className="space-y-1">
            {savedPlayers.map((pl) => (
              <div key={pl!.id} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-[#181818]">
                <button className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => navigate('player', { playerId: pl!.id })}>
                  <PlayerAvatar name={pl!.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-100">{pl!.name}</p>
                    <p className="text-xs text-zinc-500">{pl!.team} · {pl!.pos} · {pl!.home ? 'vs' : '@'} {pl!.opponent} {pl!.gameTime}</p>
                  </div>
                </button>
                <button
                  onClick={() => toggleSave('players', pl!.id)}
                  aria-label={`Remove ${pl!.name} from saved`}
                  className="rounded p-1.5 text-zinc-600 hover:text-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {savedGames.length > 0 && (
        <SectionCard title={`Saved Games (${savedGames.length})`}>
          <div className="space-y-1">
            {savedGames.map((g) => (
              <div key={g!.id} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-[#181818]">
                <button className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => navigate('game', { gameId: g!.id })}>
                  <Bookmark className="h-4 w-4 fill-[#F5C542] text-[#F5C542]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-100">{g!.awayTeam} @ {g!.homeTeam}</p>
                    <p className="text-xs text-zinc-500">{teamName(g!.awayTeam)} at {teamName(g!.homeTeam)} · {g!.time}</p>
                  </div>
                </button>
                <button
                  onClick={() => toggleSave('games', g!.id)}
                  aria-label="Remove game from saved"
                  className="rounded p-1.5 text-zinc-600 hover:text-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5C542]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

export function HelpPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="px-1 text-sm font-semibold text-zinc-200">Help / Guide</h1>
      <SectionCard title="Getting Started">
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-300">
          <li>Pick a sport from the top navigation.</li>
          <li>Search for a player, team, or prop market.</li>
          <li>Use the filter toolbar to narrow the props table.</li>
          <li>Click any row to open quick player research.</li>
          <li>Open the full player page for game logs, charts, and sportsbook comparisons.</li>
        </ol>
      </SectionCard>
      <SectionCard title="Understanding the Metrics">
        <dl className="space-y-3 text-sm">
          <div><dt className="font-semibold text-zinc-200">L5 / L10 / L15</dt><dd className="text-zinc-400">Percentage of the player's last 5, 10, or 15 games in which the result cleared the listed line.</dd></div>
          <div><dt className="font-semibold text-zinc-200">SZN</dt><dd className="text-zinc-400">Season-long hit rate against the listed line.</dd></div>
          <div><dt className="font-semibold text-zinc-200">Proj / Diff</dt><dd className="text-zinc-400">The Arena Props projection and its difference from the current sportsbook line.</dd></div>
          <div><dt className="font-semibold text-zinc-200">Best Price</dt><dd className="text-zinc-400">The strongest available over price across supported sportsbooks.</dd></div>
        </dl>
      </SectionCard>
      <SectionCard title="Responsible Research">
        <p className="text-sm leading-relaxed text-zinc-400">
          Arena Props is a sports research and analytics platform. Hit rates describe historical performance only
          and do not guarantee future results. Nothing in this dashboard is a guarantee of any outcome.
        </p>
      </SectionCard>
    </div>
  );
}
