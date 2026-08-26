import { useMemo, useState } from 'react';
import { PLAYERS, propsForPlayer } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { EmptyState, PlayerAvatar } from '@/features/dashboard/components/common';
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

  const selectCls = 'h-8 rounded-md border border-[#2a2a2a] bg-[#141414] px-2 text-xs text-zinc-200 focus:border-[#F5C542]/50 focus:outline-none';

  return (
    <div className="space-y-3">
      <h1 className="px-1 text-sm font-semibold text-zinc-200">Players {sport !== 'All' && <span className="text-zinc-500">· {sport}</span>}</h1>
      <div className="flex flex-wrap gap-1.5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search players..."
          aria-label="Search players"
          className="h-8 w-56 rounded-md border border-[#2a2a2a] bg-[#141414] px-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-[#F5C542]/50 focus:outline-none"
        />
        <select value={team ?? ''} onChange={(e) => setTeam(e.target.value || null)} className={selectCls} aria-label="Filter by team">
          <option value="">All teams</option>
          {teams.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={pos ?? ''} onChange={(e) => setPos(e.target.value || null)} className={selectCls} aria-label="Filter by position">
          <option value="">All positions</option>
          {positions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={q ? `No players or teams found for "${q}".` : 'No players match these filters.'} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#101010]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#141414] text-left text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-2.5">Player</th>
                <th className="px-3 py-2.5">Team</th>
                <th className="px-3 py-2.5">Pos</th>
                <th className="px-3 py-2.5">Today's Opponent</th>
                <th className="px-3 py-2.5 text-right">Props Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181818]">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate('player', { playerId: p.id, sport: p.sport })}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('player', { playerId: p.id, sport: p.sport })}
                  tabIndex={0}
                  className="cursor-pointer hover:bg-[#161616] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#F5C542]"
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
                  <td className="px-3 py-2.5 text-right tabular-nums text-[#F5C542]">{propsForPlayer(p.id).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
