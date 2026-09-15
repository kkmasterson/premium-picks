import { Bookmark } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import type { MatchupSummary } from '@/features/dashboard/matchup-view';
import { MetricStrip } from './dashboard-ui';
import { TeamBadge } from './EntityMedia';
import { FreeArtwork } from './FreeDataViews';

export function MatchupRow({ matchup, isSaved, onSave }: { matchup: MatchupSummary; isSaved: boolean; onSave: () => void }) {
  const { id, sport, away, home, timing, counts } = matchup;
  const title = `${away.name} at ${home.name}`;
  return <article className="group flex min-w-0 items-center gap-3 px-3 py-3.5 transition-colors hover:bg-[var(--dashboard-surface-hover)] sm:px-4">
    <Link to={`/dashboard/matchups/${encodeURIComponent(id)}`} aria-label={`${title}, ${timing}`} className="grid min-w-0 flex-1 gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 md:grid-cols-[minmax(0,1.5fr)_minmax(186px,1fr)] md:items-center">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex shrink-0 -space-x-1.5" aria-hidden="true">
          {matchup.imported ? <><FreeArtwork url={away.image} name={away.name} fallback={away.abbreviation} /><FreeArtwork url={home.image} name={home.name} fallback={home.abbreviation} /></> : <><TeamBadge team={away.abbreviation} name={away.name} sport={sport} className="h-9 w-9 bg-[#111515]" /><TeamBadge team={home.abbreviation} name={home.name} sport={sport} className="h-9 w-9 bg-[#111515]" /></>}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-white sm:text-base">{away.abbreviation} <span className="text-zinc-600">@</span> {home.abbreviation}</p>
          <p className="truncate text-[10px] text-zinc-500" title={title}>{title}</p>
          <p className="mt-1 text-[10px] font-medium text-teal-300">{timing} · {sport}</p>
        </div>
      </div>
      <MetricStrip compact metrics={[
        { label: 'Props', value: counts.props ?? '—', sample: counts.props === null ? 'unavailable' : matchup.imported ? 'observed' : 'available', tone: counts.props === null ? undefined : 'active' },
        { label: 'Players', value: counts.players ?? '—', sample: counts.players === null ? 'unavailable' : 'covered' },
        { label: 'Books', value: counts.books ?? '—', sample: counts.books === null ? 'unavailable' : 'providers' },
      ]} />
    </Link>
    <button onClick={onSave} aria-label={`${isSaved ? 'Remove game from saved' : 'Save game'}: ${title}, ${timing}`} aria-pressed={isSaved} className="shrink-0 rounded-md border border-[var(--dashboard-border)] p-2 text-zinc-600 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60">
      <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current text-teal-300')} />
    </button>
  </article>;
}
