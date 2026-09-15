import { useMemo, useState } from 'react';
import { PLAYERS, propsForPlayer } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { EmptyState, PlayerAvatar } from '@/features/dashboard/components/common';
import { DashboardPageHeader, DashboardToolbar, EntityIdentity, ResearchSurface } from '@/features/dashboard/components/dashboard-ui';
import { cn } from '@/lib/utils';

export function PlayersPage() {
  const { sport, navigate } = useDashboard();
  const [q, setQ] = useState('');
  const [team, setTeam] = useState<string | null>(null);
  const [pos, setPos] = useState<string | null>(null);

  const pool = useMemo(() => PLAYERS.filter((p) => sport === 'All' || p.sport === sport), [sport]);
  const teams = useMemo(() => [...new Set(pool.map((p) => p.team))].sort(), [pool]);
  const positions = useMemo(() => [...new Set(pool.map((p) => p.pos))].sort(), [pool]);

  const filtered = pool.filter((p) =>
    (!q || p.name.toLowerCase().includes(q.toLowerCase())) &&
    (!team || p.team === team) &&
    (!pos || p.pos === pos),
  );

  const selectCls = 'h-8 rounded-md border border-[var(--dashboard-border-strong)] bg-[var(--dashboard-surface-raised)] px-2 text-xs text-zinc-200 focus:border-teal-500/50 focus:outline-none';

  return (
    <div className="space-y-3">
      <DashboardPageHeader eyebrow="Research" title={`Players${sport !== 'All' ? ` · ${sport}` : ''}`} description="Find a player, review today's matchup, and open their full market research workspace." />
      <p className="px-1 text-[11px] text-zinc-500">Demo research · Team assignments, matchups and prop counts shown here are sample data.</p>
      <DashboardToolbar className="flex flex-wrap gap-1.5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search players..."
          aria-label="Search players"
          className="h-8 min-w-0 flex-1 rounded-md border border-[var(--dashboard-border-strong)] bg-[var(--dashboard-surface-raised)] px-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/50 focus:outline-none sm:max-w-xs"
        />
        <select value={team ?? ''} onChange={(e) => setTeam(e.target.value || null)} className={selectCls} aria-label="Filter by team">
          <option value="">All teams</option>
          {teams.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={pos ?? ''} onChange={(e) => setPos(e.target.value || null)} className={selectCls} aria-label="Filter by position">
          <option value="">All positions</option>
          {positions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </DashboardToolbar>

      {filtered.length === 0 ? (
        <EmptyState title={q ? `No players or teams found for "${q}".` : 'No players match these filters.'} />
      ) : (
        <ResearchSurface>
          <table className="hidden w-full text-sm md:table">
            <thead>
              <tr className="bg-white/[0.02] text-left text-[10px] uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-2.5">Player</th>
                <th className="px-3 py-2.5">Team</th>
                <th className="px-3 py-2.5">Pos</th>
                <th className="px-3 py-2.5">Today's Opponent</th>
                <th className="px-3 py-2.5 text-right">Props Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--dashboard-border)]">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate('player', { playerId: p.id, sport: p.sport })}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('player', { playerId: p.id, sport: p.sport })}
                  tabIndex={0}
                  className="cursor-pointer hover:bg-[var(--dashboard-surface-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-teal-500"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <PlayerAvatar name={p.name} size="sm" />
                      <span className="font-medium text-zinc-100">{p.name}</span>
                      {sport === 'All' && <span className={cn('rounded bg-[#1d1d1d] px-1 text-[10px] font-semibold text-zinc-400')}>{p.sport}</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-zinc-400">{p.team}</td>
                  <td className="px-3 py-2.5 text-zinc-400">{p.pos}</td>
                  <td className="px-3 py-2.5 text-zinc-400">{p.home ? 'vs' : '@'} {p.opponent} · {p.gameTime}</td>
                  <td className="px-3 py-2.5 text-right"><span className="rounded-md bg-teal-500/[0.08] px-2 py-1 text-[11px] font-semibold tabular-nums text-teal-300">{propsForPlayer(p.id).length} props</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="divide-y divide-[var(--dashboard-border)] md:hidden">
            {filtered.map((p) => <button key={p.id} onClick={() => navigate('player', { playerId: p.id, sport: p.sport })} className="flex w-full min-w-0 items-center gap-3 px-3 py-3 text-left hover:bg-[var(--dashboard-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500"><EntityIdentity name={p.name} meta={`${p.team} · ${p.pos}${sport === 'All' ? ` · ${p.sport}` : ''}`} detail={`${p.home ? 'vs' : '@'} ${p.opponent} · ${p.gameTime}`} /><span className="ml-auto shrink-0 rounded-md bg-teal-500/[0.08] px-2 py-1 text-[10px] font-semibold tabular-nums text-teal-300">{propsForPlayer(p.id).length} props</span></button>)}
          </div>
        </ResearchSurface>
      )}
    </div>
  );
}
