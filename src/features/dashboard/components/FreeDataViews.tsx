import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useDirectory, useOdds } from '../free-data';
import { DashboardPageHeader, DashboardToolbar, ResearchSurface } from './dashboard-ui';
import { EmptyState } from './common';

export function FreeArtwork({ url, name, fallback }: { url?: string | null; name: string; fallback: string }) {
  const [failed, setFailed] = useState<string | null>(null);
  return url && failed !== url ? <img src={url} alt={name} loading="lazy" onError={() => setFailed(url)} className="h-9 w-9 shrink-0 object-contain" /> : <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-white/5 text-[10px] text-zinc-400">{fallback}</span>;
}
export function NbaDirectory() {
  const { value, loading, retry } = useDirectory();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'players' | 'teams'>('players');
  const [teamId, setTeamId] = useState('');
  const [page, setPage] = useState(0);
  const data = value?.data;
  const teams = new Map(data?.teams.map((t) => [t.id, t]));
  const search = query.toLowerCase().trim();
  const players = data?.players.filter((p) => (!teamId || p.teamId === teamId) && `${p.name} ${teams.get(p.teamId ?? '')?.name ?? ''}`.toLowerCase().includes(search)) ?? [];
  const teamList = data?.teams.filter((t) => `${t.name} ${t.abbreviation} ${t.city}`.toLowerCase().includes(search)) ?? [];
  const count = tab === 'players' ? players.length : teamList.length;
  const currentPage = Math.min(page, Math.max(0, Math.ceil(count / 50) - 1));
  return <div className="space-y-3">
    <DashboardPageHeader eyebrow="NBA directory" title="Players & teams" description="Imported player identities and team details. Includes historical players; team associations do not confirm an active roster." />
    {data && <div className="flex items-center gap-2 text-xs text-zinc-400"><FreeArtwork url={data.leagueImage} name="NBA league badge" fallback="NBA" /><span>{data.players.length.toLocaleString()} player records · {data.teams.length} current, historical and guest team records</span></div>}
    <DashboardToolbar className="flex flex-wrap items-center gap-2">
      {(['players', 'teams'] as const).map((t) => <button key={t} onClick={() => { setTab(t); setPage(0); }} aria-pressed={tab === t} className={`rounded-md border px-3 py-2 text-xs ${tab === t ? 'border-teal-500/40 text-teal-300' : 'border-white/10 text-zinc-400'}`}>{t === 'players' ? 'Players' : 'Teams'}</button>)}
      <input aria-label="Search NBA directory" placeholder="Search players or teams…" value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} className="min-w-0 flex-1 rounded border border-white/10 bg-transparent px-3 py-2 text-xs text-white" />
      {tab === 'players' && <select aria-label="Filter directory by team" value={teamId} onChange={(e) => { setTeamId(e.target.value); setPage(0); }} className="max-w-full rounded border border-white/10 bg-[#111] px-2 py-2 text-xs text-zinc-300"><option value="">All team associations</option>{data?.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>}
      <button onClick={retry} className="text-xs text-teal-300">Reload saved data</button>
    </DashboardToolbar>
    <p role="status" className="text-xs text-zinc-400">{loading ? 'Loading directory…' : !data ? 'Directory unavailable. No demo records are substituted.' : `${count.toLocaleString()} results · ${value?.freshness === 'stale' ? 'Refresh overdue' : 'Imported'} ${new Date(data.observedAt).toLocaleString()}${data.complete ? '' : ' · Initial import in progress; coverage is incomplete'}`}</p>
    {data && <ResearchSurface className="divide-y divide-white/5">
      {tab === 'players' ? players.slice(currentPage * 50, currentPage * 50 + 50).map((p) => <div key={p.id} className="flex items-center gap-3 px-4 py-3"><FreeArtwork url={p.image} name={p.name} fallback={p.name.split(' ').map((n) => n[0]).slice(0, 2).join('')} /><div className="min-w-0"><p className="text-sm font-semibold text-white">{p.name}</p><p className="text-xs text-zinc-500">{teams.get(p.teamId ?? '')?.name ?? 'Team unavailable'} · {p.position || 'Position unavailable'}{p.height && ` · ${p.height}`}{p.country && ` · ${p.country}`}</p></div></div>) : teamList.slice(currentPage * 50, currentPage * 50 + 50).map((t) => <div key={t.id} className="flex items-center gap-3 px-4 py-3"><FreeArtwork url={t.image} name={t.name} fallback={t.abbreviation} /><div><p className="text-sm font-semibold text-white">{t.name}</p><p className="text-xs text-zinc-500">{[t.city, t.conference, t.division].filter(Boolean).join(' · ')}{t.venue && ` · Home venue: ${t.venue}`}</p></div></div>)}
      {!count && <EmptyState title="No directory entries match your search." />}
    </ResearchSurface>}
    {count > 50 && <div className="flex items-center gap-4 text-xs text-zinc-400"><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)} className="text-teal-300 disabled:opacity-30">Previous</button><span>Page {currentPage + 1} of {Math.ceil(count / 50)}</span><button disabled={(currentPage + 1) * 50 >= count} onClick={() => setPage(currentPage + 1)} className="text-teal-300 disabled:opacity-30">Next</button></div>}
    <p className="text-[11px] text-zinc-500">Game logs, hit rates, projections, injuries and active-roster status are unavailable in this feed. Artwork: <a href="https://www.thesportsdb.com" target="_blank" rel="noreferrer" className="text-teal-300">TheSportsDB</a>.</p>
  </div>;
}

const probability = (n: number | null) => n === null ? '—' : `${(100 * n).toFixed(1)}%`;
export function LiveOdds({ eventId }: { eventId?: string }) {
  const { value, loading, retry } = useOdds(eventId);
  const [market, setMarket] = useState('');
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(timer); }, []);
  const snapshot = value?.data?.current;
  const quotes = snapshot?.quotes.filter((q) => !market || q.market === market).sort((a, b) => a.market.localeCompare(b.market) || a.subject.localeCompare(b.subject) || a.side.localeCompare(b.side) || (a.line ?? 0) - (b.line ?? 0) || b.decimal - a.decimal) ?? [];
  const markets = [...new Set(snapshot?.quotes.map((q) => q.market))];
  return <ResearchSurface className="space-y-3 p-3 sm:p-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-bold text-white">Sportsbook comparison</h2><button onClick={retry} className="text-xs text-teal-300">Reload saved odds</button></div>
    <p role="status" className="text-xs text-zinc-400">{loading ? 'Loading observed odds…' : !snapshot ? 'No sportsbook snapshot has been collected for this game.' : `Observed ${new Date(snapshot.observedAt).toLocaleString()} · ${value?.freshness === 'stale' || now - Date.parse(snapshot.observedAt) > 900000 ? 'Stale prices' : 'Recent snapshot'} · Limited coverage`}</p>
    {!eventId && snapshot && <Link to={`/dashboard/matchups/${snapshot.eventId}`} className="inline-block text-xs text-teal-300">Open the sampled NBA game →</Link>}
    {snapshot && <>
      <select aria-label="Filter sportsbook market" value={market} onChange={(e) => setMarket(e.target.value)} className="max-w-full rounded border border-white/10 bg-[#111] px-3 py-2 text-xs text-zinc-300"><option value="">All observed markets</option>{markets.map((m) => <option key={m}>{m}</option>)}</select>
      {quotes.length ? <div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-xs"><thead className="text-zinc-500"><tr>{['Market / selection', 'Book', 'Line', 'Decimal price', 'Implied', 'No-vig', 'Consensus', 'Disagreement'].map((h) => <th className="p-2 font-medium" key={h}>{h}</th>)}</tr></thead><tbody>{quotes.map((q, i) => {
        const stale = value?.freshness === 'stale' || now - Date.parse(q.updatedAt) > 900000 || now - Date.parse(q.updatedAt) < -30000;
        return <tr key={`${q.book}-${q.market}-${q.subject}-${q.side}-${q.line}-${i}`} className="border-t border-white/5 text-zinc-300"><td className="p-2"><span className="block text-white">{q.subject === 'Game' ? q.side : `${q.subject} · ${q.side}`}</span><span className="text-zinc-500">{q.market}</span></td><td className="p-2">{q.book}<span className="block text-[10px] text-zinc-500">{stale ? 'Stale · ' : ''}{new Date(q.updatedAt).toLocaleTimeString()}</span></td><td className="p-2">{q.line ?? '—'}</td><td className={`p-2 ${q.best && !stale ? 'font-bold text-teal-300' : ''}`}>{q.decimal.toFixed(2)}{q.best && !stale && <span className="block text-[10px]">Best observed</span>}</td><td className="p-2">{probability(q.implied)}</td><td className="p-2">{probability(q.noVig)}</td><td className="p-2">{probability(q.consensus)}</td><td className="p-2">{q.disagreement === null ? '—' : `${(q.disagreement * 100).toFixed(1)} pp`}</td></tr>;
      })}</tbody></table></div> : <EmptyState title="The sampled markets returned no prices. Player props may not be offered yet." />}
      <p className="text-[11px] text-zinc-500">Best price compares the same selection and line. Consensus averages complete two-sided, no-vig book probabilities; disagreement is their range. These are market calculations, not predictions or true EV. Player names are sportsbook labels, not verified roster links.</p>
      <details className="text-xs text-zinc-400"><summary className="cursor-pointer text-teal-300">Observed history & changes ({value?.data?.history.length ?? 0} snapshots)</summary><div className="mt-3 space-y-2">{(value?.data?.history.length ?? 0) < 2 && <p>History begins with our first collection. A second observation is needed to detect changes.</p>}{value?.data?.alerts.map((a) => <p key={a.id}>{new Date(a.observedAt).toLocaleString()} · {a.description}</p>)}{value?.data?.history.map((h) => <details key={h.observedAt}><summary className="cursor-pointer">{new Date(h.observedAt).toLocaleString()} · {h.quotes.length} prices</summary><ul className="mt-2 space-y-1">{h.quotes.filter((q) => !market || q.market === market).map((q, i) => <li key={i}>{q.book} · {q.subject} {q.market} {q.side} {q.line ?? ''} · {q.decimal.toFixed(2)}</li>)}</ul></details>)}</div></details>
    </>}
    <p className="text-[11px] text-zinc-500">This proof samples one game, at most once per six hours, within a monthly credit cap. Reloading reads stored data. L5/L10/L15, projections, confidence and true EV remain unavailable.</p>
  </ResearchSurface>;
}
