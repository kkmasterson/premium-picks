import { useState, type ReactNode } from 'react';
import { useLiveSchedule } from '@/features/dashboard/live-schedule';
import { isCanonicalGameId, scheduleMatchup } from '@/features/dashboard/matchup-view';
import { MatchupRow } from '@/features/dashboard/components/MatchupRow';
import { GAMES, bestBook, formatOdds, playerById, propById, teamName } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { DashboardPageHeader, EntityIdentity, MetricStrip, ResearchSurface, SegmentedControl } from '@/features/dashboard/components/dashboard-ui';
import { Bookmark, BookOpen, ListFilter, Trash2 } from 'lucide-react';

type SavedFilter = 'All' | 'Props' | 'Players' | 'Games';
const savedFilters: readonly SavedFilter[] = ['All', 'Props', 'Players', 'Games'];

export function SavedPage() {
  const { saved, toggleSave, openDrawer, navigate } = useDashboard();
  const [filter, setFilter] = useState<SavedFilter>('All');
  const savedProps = saved.props.map(propById).filter(Boolean);
  const savedPlayers = saved.players.map(playerById).filter(Boolean);
  const hasImportedGames = saved.games.some(isCanonicalGameId);
  const { snapshot, loading, freshness, retry } = useLiveSchedule(hasImportedGames);
  const importedGames = new Map(snapshot?.games.map((game) => [game.id, game]));
  const savedGames = saved.games.map((id) => {
    if (isCanonicalGameId(id)) {
      const game = importedGames.get(id);
      return { id, matchup: game ? scheduleMatchup(game) : null };
    }
    const game = GAMES.find((candidate) => candidate.id === id);
    return { id, matchup: game ? {
      id, sport: game.sport,
      away: { abbreviation: game.awayTeam, name: teamName(game.awayTeam, game.sport) },
      home: { abbreviation: game.homeTeam, name: teamName(game.homeTeam, game.sport) },
      timing: `${game.time} · ${game.status} · Demo`,
      counts: { props: null, players: null, books: null },
    } : null };
  });
  const total = savedProps.length + savedPlayers.length + savedGames.length;
  const show = (type: Exclude<SavedFilter, 'All'>) => filter === 'All' || filter === type;

  return <div className="space-y-3">
    <DashboardPageHeader eyebrow="Personal" title="Saved Research" description="One place for bookmarked props, players, and games." actions={<span className="rounded-md bg-teal-500/[0.08] px-2.5 py-1.5 text-[10px] font-semibold text-teal-300">{total} saved</span>} />
    <div className="flex flex-wrap items-center justify-between gap-2"><SegmentedControl value={filter} options={savedFilters} onChange={setFilter} label="Saved item type" /><div className="flex gap-2 text-[9px] text-zinc-600"><span>{savedProps.length} props</span><span>{savedPlayers.length} players</span><span>{savedGames.length} games</span></div></div>
    {total === 0 ? <div className="grid min-h-64 place-items-center rounded-xl border border-dashed border-[var(--dashboard-border-strong)] text-center"><div><Bookmark className="mx-auto h-7 w-7 text-zinc-700" /><p className="mt-3 text-xs font-medium text-zinc-300">No saved research yet</p><p className="mt-1 text-[10px] text-zinc-600">Bookmark props, players, or games to find them here.</p><button onClick={() => navigate('props')} className="mt-4 rounded-md border border-teal-500/35 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-300">Browse Props</button></div></div> : <ResearchSurface className="divide-y divide-[var(--dashboard-border)]">
      {show('Props') && savedProps.map((prop) => { const player = playerById(prop!.playerId)!; const best = bestBook(prop!, 'over'); return <div key={prop!.id} className="flex min-w-0 items-center gap-3 px-3 py-3 hover:bg-[var(--dashboard-surface-hover)] sm:px-4"><button className="min-w-0 flex-1 text-left" onClick={() => openDrawer(prop!.id)}><EntityIdentity name={player.name} meta={<span className="text-teal-300">{prop!.market} · Line {prop!.line}</span>} detail={`Best: ${best.book} ${formatOdds(best.over)}`} /></button><MetricStrip compact className="hidden w-52 sm:grid" metrics={[{ label: 'L10', value: `${prop!.l10}%`, sample: 'hit rate', tone: prop!.l10 >= 60 ? 'positive' : 'warning' }, { label: 'Diff', value: `${prop!.diff >= 0 ? '+' : ''}${prop!.diff.toFixed(1)}`, sample: 'vs line', tone: prop!.diff >= 0 ? 'positive' : 'negative' }]} /><RemoveButton label={`Remove ${player.name} ${prop!.market} from saved`} onClick={() => toggleSave('props', prop!.id)} /></div>; })}
      {show('Players') && savedPlayers.map((player) => <div key={player!.id} className="flex min-w-0 items-center gap-3 px-3 py-3 hover:bg-[var(--dashboard-surface-hover)] sm:px-4"><button className="min-w-0 flex-1 text-left" onClick={() => navigate('player', { playerId: player!.id, sport: player!.sport })}><EntityIdentity name={player!.name} meta={`${player!.team} · ${player!.pos} · ${player!.sport}`} detail={`${player!.home ? 'vs' : '@'} ${player!.opponent} · ${player!.gameTime}`} /></button><RemoveButton label={`Remove ${player!.name} from saved`} onClick={() => toggleSave('players', player!.id)} /></div>)}
      {show('Games') && hasImportedGames && <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-[10px] text-zinc-500" role="status"><span>{loading ? 'Loading saved game schedules…' : freshness === 'fresh' ? 'NBA schedules · Saved in this browser' : 'Saved game schedule is unavailable or overdue; bookmarks are retained.'}</span><button onClick={retry} disabled={loading} className="rounded px-2 py-1 text-teal-300 focus-visible:ring-2 focus-visible:ring-teal-500">Reload saved games</button></div>}
      {show('Games') && savedGames.map(({ id, matchup }) => matchup
        ? <MatchupRow key={id} matchup={matchup} isSaved onSave={() => toggleSave('games', id)} />
        : <div key={id} className="flex items-center gap-3 px-4 py-3"><div className="min-w-0 flex-1"><p className="text-xs text-zinc-300">{loading && isCanonicalGameId(id) ? 'Loading saved game…' : 'Saved game unavailable'}</p><p className="mt-1 text-[10px] text-zinc-500">Your bookmark is retained. This game may be outside the imported season.</p></div><button onClick={() => navigate('game', { gameId: id })} className="text-xs text-teal-300">Open game</button><RemoveButton label="Remove unavailable game from saved" onClick={() => toggleSave('games', id)} /></div>)}
      {((filter === 'Props' && !savedProps.length) || (filter === 'Players' && !savedPlayers.length) || (filter === 'Games' && !savedGames.length)) && <div className="py-16 text-center text-xs text-zinc-500">No saved {filter.toLowerCase()} yet.</div>}
    </ResearchSurface>}
  </div>;
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick} aria-label={label} className="rounded-md p-2 text-zinc-600 hover:bg-rose-500/10 hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"><Trash2 className="h-4 w-4" /></button>;
}

const topics: Array<{ title: string; content: ReactNode }> = [
  { title: 'Getting started', content: <ol className="list-decimal space-y-2 pl-5"><li>Pick a sport from the global navigation.</li><li>Search or filter to narrow the research set.</li><li>Open a row for player context and game logs.</li><li>Add an exact provider, side, and line to Builder.</li></ol> },
  { title: 'Reading metrics', content: <div className="space-y-3"><MetricStrip metrics={[{ label: 'L5', value: '60%', sample: '3/5 hits', tone: 'positive' }, { label: 'L10', value: '50%', sample: '5/10 hits', tone: 'warning' }, { label: 'Diff', value: '+2.1', sample: 'vs line', tone: 'positive' }]} /><dl className="space-y-2"><div><dt className="font-semibold text-zinc-200">L5 / L10 / L15</dt><dd className="text-zinc-500">Historical hit percentage and visible sample size for the listed line.</dd></div><div><dt className="font-semibold text-zinc-200">Projection / Diff</dt><dd className="text-zinc-500">The demo projection and its numerical distance from the current line.</dd></div></dl></div> },
  { title: 'Controls and colors', content: <div className="space-y-3"><div className="flex flex-wrap gap-2"><span className="rounded-md border border-teal-500/35 bg-teal-500/10 px-2 py-1 text-teal-300">Selected control</span><span className="rounded-md bg-emerald-500/10 px-2 py-1 text-emerald-400">Positive result</span><span className="rounded-md bg-rose-500/10 px-2 py-1 text-rose-400">Negative result</span><span className="rounded-md bg-amber-500/10 px-2 py-1 text-amber-300">Mixed result</span></div><p>Teal marks navigation and selections. Green, red, and amber always include a text or number label so color is never the only signal.</p></div> },
  { title: 'Builder rules', content: <p>Builder groups selections by provider. Mixed-provider research never displays one actionable combined payout, and Arena Props does not place or transmit wagers.</p> },
  { title: 'Responsible research', content: <p>Hit rates describe historical performance only and do not guarantee future results. Arena Props is a research and analytics platform, not a guarantee of any outcome.</p> },
];

export function HelpPage() {
  const [active, setActive] = useState(0);
  return <div className="space-y-3"><DashboardPageHeader eyebrow="Support" title="Dashboard Guide" description="Learn the research flow, metrics, control language, and Builder rules." /><div className="hidden min-h-[480px] grid-cols-[220px_minmax(0,1fr)] overflow-hidden rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] md:grid"><nav className="border-r border-[var(--dashboard-border)] p-2" aria-label="Guide topics">{topics.map((topic, index) => <button key={topic.title} onClick={() => setActive(index)} aria-current={active === index ? 'page' : undefined} className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-[11px] font-medium ${active === index ? 'bg-teal-500/10 text-teal-300' : 'text-zinc-500 hover:bg-white/[0.025] hover:text-zinc-200'}`}><ListFilter className="h-3.5 w-3.5" />{topic.title}</button>)}</nav><article className="max-w-3xl p-6 text-sm leading-relaxed text-zinc-400"><BookOpen className="h-5 w-5 text-teal-400" /><h2 className="mt-3 text-base font-semibold text-zinc-100">{topics[active].title}</h2><div className="mt-4">{topics[active].content}</div></article></div><ResearchSurface className="divide-y divide-[var(--dashboard-border)] md:hidden">{topics.map((topic, index) => <details key={topic.title} open={index === 0} className="group px-3 py-3"><summary className="cursor-pointer list-none text-xs font-semibold text-zinc-200 marker:hidden">{topic.title}<span className="float-right text-teal-400 group-open:rotate-45">+</span></summary><div className="mt-3 text-[11px] leading-relaxed text-zinc-500">{topic.content}</div></details>)}</ResearchSurface></div>;
}
