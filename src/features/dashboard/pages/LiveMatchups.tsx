import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { useLiveSchedule } from '@/features/dashboard/live-schedule';
import { scheduleDate, scheduleMatchup } from '@/features/dashboard/matchup-view';
import { DashboardPageHeader, ResearchSurface } from '@/features/dashboard/components/dashboard-ui';
import { MatchupRow } from '@/features/dashboard/components/MatchupRow';
import { EmptyState } from '@/features/dashboard/components/common';
import { FreeArtwork, LiveOdds } from '@/features/dashboard/components/FreeDataViews';
import { useDirectory, useOdds } from '@/features/dashboard/free-data';

export function LiveMatchups({ gameId }: { gameId?: string }) {
  const { navigate, saved, toggleSave } = useDashboard();
  const { snapshot, freshness, loading, retry } = useLiveSchedule();
  const { value: directory } = useDirectory();
  const { value: odds } = useOdds(gameId);
  const games = snapshot?.games.filter((game) => !gameId || game.id === gameId).sort((a, b) => scheduleDate(a).localeCompare(scheduleDate(b)) || (a.startsAt ?? '').localeCompare(b.startsAt ?? '')) ?? [];
  const selected = gameId ? games[0] : undefined;
  return <div className="space-y-3">
    {gameId && <button onClick={() => navigate('matchups')} className="flex items-center gap-1.5 rounded text-xs text-zinc-400 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"><ArrowLeft className="h-3.5 w-3.5" />Back to Matchups</button>}
    <DashboardPageHeader eyebrow="Schedule" title={selected ? `${selected.away.abbreviation} @ ${selected.home.abbreviation}` : gameId ? 'Game detail' : 'NBA Matchups'} description={selected ? `${selected.away.name} at ${selected.home.name}` : 'All published NBA games, ordered by date and start time. Times shown in Arizona time.'} />
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="min-w-0 space-y-1" role="status">
        <p className={`text-[10px] ${freshness === 'fresh' ? 'text-teal-300' : 'text-amber-300'}`}>{loading ? 'Loading saved schedule…' : freshness === 'fresh' ? 'Schedule saved · Checked weekly' : freshness === 'stale' ? 'Refresh overdue or unavailable · Showing saved schedule' : 'NBA schedule unavailable'}{snapshot && ` · Last imported ${new Date(snapshot.observedAt).toLocaleString('en-US', { timeZone: 'America/Phoenix' })} AZ`}</p>
        {!gameId && snapshot && <p className="text-[10px] text-zinc-500">{games.length.toLocaleString('en-US')} games · {snapshot.windowStart} through {snapshot.windowEnd}</p>}
      </div>
      <button onClick={retry} disabled={loading} aria-label="Reload saved schedule" title="Read the saved schedule; does not request a provider import" className="rounded-md border border-[var(--dashboard-border)] p-2 text-zinc-500 hover:text-teal-300 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"><RefreshCw className="h-3.5 w-3.5" /></button>
    </div>
    {!gameId && <details className="rounded-xl border border-white/10 p-3 text-xs text-teal-300"><summary className="cursor-pointer">Latest sportsbook sample · Open comparison</summary><div className="mt-3"><LiveOdds /></div></details>}
    {games.length ? <ResearchSurface className="divide-y divide-[var(--dashboard-border)]">{games.map((game) => <MatchupRow key={game.id} matchup={scheduleMatchup(game, directory?.data, odds?.data?.current)} isSaved={saved.games.includes(game.id)} onSave={() => toggleSave('games', game.id)} />)}</ResearchSurface>
      : <EmptyState title={loading ? 'Loading NBA schedule…' : !snapshot ? 'The NBA data connection is not ready yet.' : gameId ? 'This game is outside the imported season.' : 'No NBA games were returned for the imported season.'} />}
    {selected && <ResearchSurface className="flex flex-wrap items-center gap-3 p-4">{[selected.away, selected.home].map((team) => <FreeArtwork key={team.id} url={directory?.data?.teams.find((t) => t.id === team.id)?.image} name={team.name} fallback={team.abbreviation} />)}<div className="text-xs text-zinc-400"><p>{selected.away.name} {selected.awayScore ?? '—'} · {selected.home.name} {selected.homeScore ?? '—'}</p><p>Period {selected.period || '—'} · Clock {selected.clock || '—'} · {selected.postseason === undefined || selected.postseason === null ? 'Postseason status unavailable' : selected.postseason ? 'Postseason' : 'Not postseason'}</p><p>Status observed {new Date(selected.observedAt ?? snapshot!.observedAt).toLocaleString()}</p><p>{directory?.data?.teams.find((t) => t.id === selected.home.id)?.venue ? `Home venue: ${directory.data.teams.find((t) => t.id === selected.home.id)!.venue} · Event venue not independently verified` : 'Venue unavailable'}</p></div></ResearchSurface>}
    {gameId && <LiveOdds key={gameId} eventId={gameId} />}
  </div>;
}
