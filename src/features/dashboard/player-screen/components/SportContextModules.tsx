import { useState } from 'react';
import type { ReactNode } from 'react';
import { PlayerAvatar } from '@/features/dashboard/components/common';
import { cn } from '@/lib/utils';
import { BASKETBALL_SHOT_ZONE_POSITIONS, positionSoccer433, type BasketballShotZoneId } from '../spatialLayouts';
import type { ContextModuleKey, MarketSnapshot, PlayerResearchViewModel } from '../types';

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return <section className="rounded-lg border border-[#242424] bg-[#0c0c0c] p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-xs font-semibold text-zinc-200">{title}</h3>{subtitle && <p className="mt-0.5 text-[10px] text-zinc-600">{subtitle}</p>}</div></div>{children}</section>;
}

function Matchup({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  const [first] = viewModel.contextual.winProbability;
  if (viewModel.sportPayload.family === 'tennis') {
    const h2h = viewModel.sportPayload.h2h;
    return <div className="space-y-3"><Card title="Head-to-Head Matchup" subtitle="Direct meetings"><div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 text-center"><div data-testid="h2h-player" className="flex min-w-0 flex-col items-center"><PlayerAvatar name={viewModel.player.name} size="md" /><p className="mt-2 w-full truncate text-xs font-semibold text-zinc-200">{viewModel.player.name}</p><p className="text-xl font-bold text-emerald-400">{h2h.playerWins}</p></div><span className="self-center text-xs font-bold text-zinc-600">VS</span><div data-testid="h2h-opponent" className="flex min-w-0 flex-col items-center"><PlayerAvatar name={viewModel.player.opponent} size="md" /><p className="mt-2 w-full truncate text-xs font-semibold text-zinc-200">{viewModel.player.opponent}</p><p className="text-xl font-bold text-red-400">{h2h.opponentWins}</p></div></div></Card></div>;
  }
  const esports = viewModel.profile.family === 'esports';
  return <div className="space-y-3"><Card title={esports ? 'Series Win Predictor' : 'Win Predictor'} subtitle="Current event projection"><div className="mt-4 flex items-center gap-3"><div className="text-center"><p className="text-xl font-bold text-emerald-400">{first}%</p><p className="text-[10px] text-zinc-500">{viewModel.player.team}</p></div><div className="flex h-3 flex-1 overflow-hidden rounded-full bg-red-500/70"><span className="bg-emerald-500" style={{ width: `${first}%` }} /></div><div className="text-center"><p className="text-xl font-bold text-red-400">{100 - first}%</p><p className="text-[10px] text-zinc-500">{viewModel.player.opponent}</p></div></div></Card><Card title={esports ? 'Match and Score Odds' : 'Matchup Odds'} subtitle="Mock provider consensus"><div className="mt-3 grid grid-cols-3 gap-2">{(esports ? ['Moneyline', '2-0 Score', '2-1 Score'] : ['Moneyline', 'Spread', 'Total']).map((label, index) => <div key={label} className="rounded bg-[#151515] p-2 text-center"><p className="text-[9px] text-zinc-600">{label}</p><p className="mt-1 text-sm font-bold text-[#F5C542]">{index === 0 ? '-120' : esports ? index === 1 ? '+210' : '+165' : index === 1 ? '-2.5' : 'O 42.5'}</p></div>)}</div></Card></div>;
}

function Defense({ viewModel, market }: { viewModel: PlayerResearchViewModel; market: MarketSnapshot }) {
  const rank = viewModel.contextual.opponentRank;
  return <div className="space-y-3"><Card title={`Defense vs ${viewModel.player.pos}`} subtitle={`${market.definition.market} allowed per game`}><div className="mt-3 flex items-start justify-between"><div><p className="text-3xl font-black text-white">{viewModel.contextual.opponentAllowed.toFixed(1)}</p><p className="text-[10px] text-zinc-500">Opponent average allowed</p></div><div className="text-right"><p className="text-3xl font-black text-[#F5C542]">#{rank}</p><p className="text-[10px] text-zinc-500">{rank < 10 ? 'Tougher defense' : rank > 20 ? 'Weaker defense' : 'League average'}</p></div></div><div className="mt-4 h-2 rounded-full bg-gradient-to-r from-red-500 via-[#F5C542] to-emerald-500"><span className="block h-4 w-1 -translate-y-1 rounded bg-white" style={{ marginLeft: `${Math.min(96, (rank / 30) * 100)}%` }} /></div><div className="mt-4 grid grid-cols-3 gap-2">{['Season', 'Last 10', 'Last 5'].map((sample, index) => <div key={sample} className="rounded bg-[#151515] p-2 text-center"><p className="text-[9px] text-zinc-600">{sample}</p><p className="text-sm font-bold text-zinc-200">#{Math.max(1, rank + index - 1)}</p></div>)}</div></Card><Card title="Offense vs Defense" subtitle="Role-aware rank comparison"><div className="mt-3 space-y-3">{[market.definition.market, ...viewModel.profile.supportingStats.slice(0, 4)].map((label, index) => <div key={label}><div className="mb-1 flex justify-between text-[10px]"><span className="text-zinc-400">{label}</span><span className="text-zinc-600">#{8 + index * 3} vs #{Math.min(30, rank + index)}</span></div><div className="flex h-1.5 overflow-hidden rounded-full"><span className="bg-emerald-500" style={{ width: `${58 - index * 4}%` }} /><span className="flex-1 bg-red-500" /></div></div>)}</div></Card></div>;
}

function Shooting() {
  const zones: Array<{ id: BasketballShotZoneId; label: string; pct: number; rank: number }> = [
    { id: 'rim', label: 'Rim', pct: 48, rank: 7 },
    { id: 'left-wing', label: 'Left wing', pct: 18, rank: 21 },
    { id: 'center', label: 'Center', pct: 12, rank: 14 },
    { id: 'right-wing', label: 'Right wing', pct: 16, rank: 25 },
    { id: 'left-corner', label: 'Left corner', pct: 3, rank: 10 },
    { id: 'right-corner', label: 'Right corner', pct: 3, rank: 10 },
  ];
  return <Card title="Shot Profile vs Opponent Defense" subtitle="Player distribution with opponent defensive rank"><div role="group" aria-label="Basketball shot zones, basket at bottom" className="relative mx-auto mt-4 aspect-[1.35] max-w-sm overflow-hidden rounded-md border-2 border-[#4a3f20] bg-[#15130d]">
    <div className="absolute inset-x-[8%] bottom-0 h-[82%] rounded-t-[50%] border border-b-0 border-[#594c26]" />
    <div className="absolute inset-x-[37%] bottom-0 h-[42%] border border-[#594c26]" />
    <div className="absolute bottom-[17%] left-1/2 h-[13%] w-[20%] -translate-x-1/2 rounded-t-full border border-[#594c26]" />
    <div className="absolute bottom-[7%] left-1/2 h-0.5 w-[13%] -translate-x-1/2 bg-[#75642f]" />
    <div className="absolute bottom-[10%] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border border-[#F5C542]/50" />
    {zones.map((zone) => {
      const point = BASKETBALL_SHOT_ZONE_POSITIONS[zone.id];
      return <div key={zone.id} data-testid={`shot-zone-${zone.id}`} data-spatial-zone={zone.id} style={{ left: `${point.x}%`, top: `${point.y}%` }} className="absolute w-[68px] -translate-x-1/2 -translate-y-1/2 rounded-md border border-[#F5C542]/25 bg-black/80 px-1 py-1.5 text-center shadow-lg shadow-black/30 sm:w-[78px]"><p className="text-xs font-bold text-[#F5C542]">{zone.pct}%</p><p className="text-[7px] leading-tight text-zinc-400">{zone.label}</p><p className="text-[7px] leading-tight text-zinc-600">Defense #{zone.rank}</p></div>;
    })}
  </div><div className="mt-4 space-y-2">{['Interior scoring is neutral against this defense.', 'Right-wing attempts provide the strongest opportunity.', 'Corner volume remains below the player baseline.'].map((text, index) => <div key={text} className="flex items-center justify-between gap-3 rounded bg-[#151515] px-3 py-2 text-[10px] text-zinc-400"><span>{text}</span><span className={cn('shrink-0 rounded px-1.5 py-0.5 font-bold', index === 1 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#F5C542]/10 text-[#F5C542]')}>{index === 1 ? 'LEAN OVER' : 'NEUTRAL'}</span></div>)}</div></Card>;
}

function Similar({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  const resolved = viewModel.contextual.similarPlayers.filter((item) => item.line !== null);
  const overCount = resolved.filter((item) => item.value > (item.line ?? Infinity)).length;
  return <Card title={`Comparable ${viewModel.roleLabel}s`} subtitle={`${overCount} of ${resolved.length} over available lines`}><div className="mt-3 divide-y divide-[#202020]">{viewModel.contextual.similarPlayers.map((player) => { const over = player.line !== null && player.value > player.line; return <div key={player.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 py-2 text-xs"><div><p className="text-zinc-300">{player.name}</p><p className="text-[9px] text-zinc-600">{player.usage} {player.usageLabel}</p></div><span className="tabular-nums text-zinc-500">{player.value} / {player.line ?? 'N/A'}</span><span className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold', player.line === null ? 'bg-zinc-500/10 text-zinc-500' : over ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400')}>{player.line === null ? 'N/A' : over ? 'OVER' : 'UNDER'}</span></div>; })}</div></Card>;
}

function Injuries({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  return <div className="space-y-2">{viewModel.contextual.injuries.map((injury) => <article key={injury.name} className="rounded-lg border border-[#242424] bg-[#0c0c0c] p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-zinc-200">{injury.name}</p><p className="text-[10px] text-zinc-600">{injury.position} · Latest report</p></div><span className="rounded bg-red-500/15 px-2 py-1 text-[9px] font-bold uppercase text-red-400">{injury.status}</span></div><p className="mt-2 text-[10px] leading-relaxed text-zinc-500">{injury.note}</p><div className="mt-3 flex gap-1">{['Without', 'With', 'Stats'].map((label) => <button key={label} className="rounded border border-[#2a2a2a] px-2 py-1 text-[9px] text-zinc-500 hover:text-[#F5C542]">{label}</button>)}</div></article>)}</div>;
}

function Rankings({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  return <Card title="Season Standings" subtitle={viewModel.player.sport === 'NCAAF' || viewModel.player.sport === 'NCAAB' ? 'League-specific rankings unavailable · structural preview' : 'Current competition'}><div className="mt-3 max-h-72 overflow-y-auto"><table className="w-full text-xs"><thead className="sticky top-0 bg-[#0c0c0c] text-[9px] uppercase text-zinc-600"><tr><th className="py-2 text-left">Rank</th><th className="text-left">Team</th><th>W-L</th><th>PCT</th><th>STRK</th></tr></thead><tbody className="divide-y divide-[#202020]">{viewModel.rankings.map((row) => <tr key={row.rank} className={row.current ? 'bg-[#F5C542]/[0.06] text-[#F5C542]' : 'text-zinc-400'}><td className="py-2">{row.rank}</td><td className="font-semibold">{row.team}</td><td className="text-center">{row.record}</td><td className="text-center">{row.pct}</td><td className="text-center">{row.streak}</td></tr>)}</tbody></table></div></Card>;
}

function BaseballLineups({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  if (viewModel.sportPayload.family !== 'baseball') return null;
  const payload = viewModel.sportPayload;
  return <div className="space-y-3"><Card title="Starting Pitchers" subtitle="Projected starters"><div className="mt-3 grid grid-cols-2 gap-2">{payload.startingPitchers.map((pitcher) => <div key={pitcher.team} className="rounded bg-[#151515] p-3"><p className="text-[9px] font-bold text-[#F5C542]">{pitcher.team}</p><p className="mt-1 text-xs font-semibold text-zinc-200">{pitcher.name}</p><p className="text-[9px] text-zinc-500">{pitcher.hand} · {pitcher.era.toFixed(2)} ERA · {pitcher.strikeouts} K</p></div>)}</div></Card><Card title="Batting Order & Stats" subtitle="Projected lineup"><div className="mt-3 divide-y divide-[#202020]">{payload.battingOrder.map((batter) => <div key={`${batter.team}-${batter.order}`} className="grid grid-cols-[20px_34px_1fr_auto] gap-2 py-2 text-xs"><span className="text-zinc-600">{batter.order}</span><span className="font-bold text-[#F5C542]">{batter.team}</span><span className="text-zinc-300">{batter.name} <span className="text-zinc-600">· {batter.position}</span></span><span className="tabular-nums text-zinc-400">{batter.average}</span></div>)}</div></Card></div>;
}

function PitchArsenal({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  const [pitch, setPitch] = useState('All');
  if (viewModel.sportPayload.family !== 'baseball') return null;
  const rows = pitch === 'All' ? viewModel.sportPayload.pitchArsenal : viewModel.sportPayload.pitchArsenal.filter((item) => item.pitch === pitch);
  return <Card title="Pitch Arsenal" subtitle="Pitch mix and opponent performance"><div className="no-scrollbar mt-3 flex gap-1 overflow-x-auto">{['All', ...viewModel.sportPayload.pitchArsenal.map((item) => item.pitch)].map((item) => <button key={item} onClick={() => setPitch(item)} aria-pressed={pitch === item} className={cn('shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold', pitch === item ? 'border-[#F5C542]/40 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#292929] text-zinc-500')}>{item}</button>)}</div><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[420px] text-xs"><thead><tr className="text-[9px] uppercase text-zinc-600"><th className="py-2 text-left">Pitch</th><th>Usage</th><th>Velo</th><th>Whiff</th><th>Opp AVG</th></tr></thead><tbody className="divide-y divide-[#202020]">{rows.map((row) => <tr key={row.pitch}><td className="py-2 font-semibold text-zinc-300">{row.pitch}</td><td className="text-center text-[#F5C542]">{row.usage}%</td><td className="text-center text-zinc-400">{row.velocity}</td><td className="text-center text-emerald-400">{row.whiff}%</td><td className="text-center text-zinc-400">{row.opponentAverage}</td></tr>)}</tbody></table></div><div className="mt-4 rounded border border-[#242424] bg-[#151515] p-3"><p className="text-[10px] font-semibold text-zinc-300">Batters vs selected arsenal</p><p className="mt-1 text-[9px] text-zinc-500">Opponent sample remains aligned to the selected pitch filter. Empty samples render N/A instead of reverting to All.</p></div></Card>;
}

function Weather({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  if (viewModel.sportPayload.family !== 'baseball') return null;
  const weather = viewModel.sportPayload.weather;
  return <Card title="Ballpark Weather" subtitle="Scheduled first-pitch conditions"><div className="mt-4 text-center"><p className="text-4xl font-black text-white">{weather.temperature}°F</p><p className="mt-1 text-xs text-emerald-400">{weather.summary}</p></div><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded bg-[#151515] p-3"><p className="text-[9px] text-zinc-600">Wind</p><p className="mt-1 text-xs font-semibold text-zinc-200">{weather.wind}</p></div><div className="rounded bg-[#151515] p-3"><p className="text-[9px] text-zinc-600">Precipitation</p><p className="mt-1 text-xs font-semibold text-zinc-200">{weather.precipitation}%</p></div></div></Card>;
}

function SoccerLineups({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  const [team, setTeam] = useState(viewModel.player.team);
  if (viewModel.sportPayload.family !== 'soccer') return null;
  const lineup = viewModel.sportPayload.formations[team] ?? [];
  const positionedLineup = positionSoccer433(lineup);
  return <Card title="Full-Pitch Lineups" subtitle="Projected 4-3-3 · attacking toward the top goal"><div className="mt-3 flex gap-1">{Object.keys(viewModel.sportPayload.formations).map((item) => <button key={item} onClick={() => setTeam(item)} aria-pressed={team === item} className={cn('rounded-full border px-3 py-1 text-[10px] font-semibold', team === item ? 'border-[#F5C542]/40 bg-[#F5C542]/10 text-[#F5C542]' : 'border-[#303030] text-zinc-500')}>{item}</button>)}</div>{viewModel.sportPayload.projectedLineup && <div className="mt-3 rounded border border-amber-500/30 bg-amber-500/[0.06] p-2 text-[9px] leading-relaxed text-amber-300">Confirmed lineups are unavailable. This formation uses the most recent projected selection.</div>}<div role="group" aria-label="Soccer 4-3-3 formation, attacking upward" className="relative mt-3 min-h-[420px] overflow-hidden rounded-lg border border-emerald-700/40 bg-[#0d2518]">
    <div className="absolute inset-x-0 top-1/2 border-t border-white/20" />
    <div className="absolute left-1/2 top-1/2 aspect-square w-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
    <div className="absolute inset-x-[22%] top-0 h-[16%] border border-t-0 border-white/20" />
    <div className="absolute inset-x-[22%] bottom-0 h-[16%] border border-b-0 border-white/20" />
    <div className="absolute left-1/2 top-0 h-1.5 w-[24%] -translate-x-1/2 bg-white/15" />
    <div className="absolute bottom-0 left-1/2 h-1.5 w-[24%] -translate-x-1/2 bg-white/15" />
    <span className="absolute right-2 top-2 text-[8px] font-semibold uppercase tracking-wider text-white/30">Attack ↑</span>
    {positionedLineup.map(({ player, point, roleIndex }) => <div key={player.name} data-testid={`formation-slot-${player.position.toLowerCase()}-${roleIndex}`} data-formation-role={player.position} style={{ left: `${point.x}%`, top: `${point.y}%` }} className="absolute w-[72px] -translate-x-1/2 -translate-y-1/2 text-center"><div className={cn('mx-auto grid h-7 w-7 place-items-center rounded-full border text-[9px] font-bold shadow-md shadow-black/40', player.current ? 'border-[#F5C542] bg-[#F5C542] text-black' : 'border-emerald-400/40 bg-black/75 text-zinc-200')}>{player.position}</div><p className={cn('mt-1 truncate rounded bg-black/45 px-1 py-0.5 text-[8px]', player.current ? 'font-bold text-[#F5C542]' : 'text-zinc-300')}>{player.name}</p></div>)}
  </div></Card>;
}

function Form({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  const rows = viewModel.sportPayload.family === 'soccer' ? viewModel.sportPayload.form.map((item) => ({ title: item.opponent, meta: item.date, result: item.result, score: item.score })) : viewModel.sportPayload.family === 'tennis' ? viewModel.sportPayload.form.map((item) => ({ title: item.event, meta: item.surface, result: item.result, score: item.score })) : [];
  return <Card title="Recent Form" subtitle="Last five events"><div className="mt-3 divide-y divide-[#202020]">{rows.map((row, index) => <div key={`${row.title}-${index}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2 text-xs"><div><p className="text-zinc-300">{row.title}</p><p className="text-[9px] text-zinc-600">{row.meta}</p></div><span className={row.result === 'W' ? 'font-bold text-emerald-400' : 'font-bold text-red-400'}>{row.result}</span><span className="tabular-nums text-zinc-400">{row.score}</span></div>)}</div></Card>;
}

function TeamStats({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  if (viewModel.sportPayload.family !== 'soccer') return null;
  return <Card title="Team Stats Comparison" subtitle={`${viewModel.player.team} vs ${viewModel.player.opponent}`}><div className="mt-3 space-y-3">{viewModel.sportPayload.teamStats.map((row) => <div key={row.label}><div className="mb-1 grid grid-cols-[32px_1fr_32px] text-[10px]"><span className="text-emerald-400">{row.playerTeam}</span><span className="text-center text-zinc-500">{row.label}</span><span className="text-right text-red-400">{row.opponent}</span></div><div className="flex h-1.5 overflow-hidden rounded-full"><span className="bg-emerald-500" style={{ width: `${(row.playerTeam / (row.playerTeam + row.opponent)) * 100}%` }} /><span className="flex-1 bg-red-500" /></div></div>)}</div></Card>;
}

function TennisH2H({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  if (viewModel.sportPayload.family !== 'tennis') return null;
  const h2h = viewModel.sportPayload.h2h;
  return <Card title="Head-to-Head" subtitle={`${h2h.playerWins}-${h2h.opponentWins} career record`}><div className="mt-3 divide-y divide-[#202020]">{h2h.meetings.map((item) => <div key={`${item.event}-${item.score}`} className="grid grid-cols-[1fr_auto] gap-3 py-2 text-xs"><div><p className="text-zinc-300">{item.event}</p><p className="text-[9px] text-zinc-600">{item.surface} · {item.score}</p></div><span className={item.result === 'W' ? 'font-bold text-emerald-400' : 'font-bold text-red-400'}>{item.result}</span></div>)}</div></Card>;
}

function AdvancedAverages({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  if (viewModel.sportPayload.family !== 'tennis') return null;
  return <Card title="Advanced Averages" subtitle="Overall, venue, and opponent splits"><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[360px] text-xs"><thead><tr className="text-[9px] uppercase text-zinc-600"><th className="py-2 text-left">Metric</th><th>Overall</th><th>Venue</th><th>Opponent</th></tr></thead><tbody className="divide-y divide-[#202020]">{viewModel.sportPayload.averages.map((row) => <tr key={row.label}><td className="py-2 text-zinc-300">{row.label}</td><td className="text-center text-zinc-400">{row.overall}</td><td className="text-center text-[#F5C542]">{row.venue}</td><td className="text-center text-zinc-400">{row.opponent}</td></tr>)}</tbody></table></div><p className="mt-3 text-[9px] text-zinc-600">Abbreviations: 1st = first serve · BP = break points · UE = unforced errors</p></Card>;
}

function EsportsMaps({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  if (viewModel.sportPayload.family !== 'esports') return null;
  return <Card title="Map Picks and Availability" subtitle="Projected series order"><div className="mt-3 space-y-2">{viewModel.sportPayload.mapStats.map((map, index) => <div key={map.map} className="flex items-center justify-between rounded border border-[#242424] bg-[#151515] p-3"><div><p className="text-xs font-semibold text-zinc-200">{map.map}</p><p className="text-[9px] text-zinc-600">{index < 2 ? index === 0 ? `${viewModel.player.team} pick` : `${viewModel.player.opponent} pick` : 'Decider / later map'}</p></div><span className={cn('rounded px-2 py-1 text-[9px] font-bold', map.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-500')}>{map.available ? 'AVAILABLE' : 'ODDS N/A'}</span></div>)}</div></Card>;
}

function EsportsPlayerStats({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  if (viewModel.sportPayload.family !== 'esports') return null;
  return <div className="space-y-3"><Card title="Player Stats" subtitle="Per-map performance"><div className="mt-3 grid grid-cols-2 gap-2">{viewModel.sportPayload.favorites.map((item) => <div key={item.name} className="rounded bg-[#151515] p-3"><p className="text-[9px] text-zinc-600">{viewModel.player.sport === 'LOL' ? item.name : `${item.name} profile`}</p><p className="mt-1 text-lg font-bold text-[#F5C542]">{item.winRate}%</p><p className="text-[9px] text-zinc-500">{item.games} maps</p></div>)}</div></Card><Card title={viewModel.player.sport === 'LOL' ? 'Favorite Heroes' : 'Map Stats'}><div className="mt-3 divide-y divide-[#202020]">{viewModel.sportPayload.mapStats.map((map) => <div key={map.map} className="grid grid-cols-[1fr_auto_auto_auto] gap-3 py-2 text-xs"><div><p className="text-zinc-300">{map.map}</p><p className="text-[9px] text-zinc-600">{map.played} played</p></div><span className="text-[#F5C542]">{map.primary}</span><span className="text-zinc-400">{map.ratio}</span><span className="text-zinc-500">{map.assists} A</span></div>)}</div></Card></div>;
}

function EsportsTeamForm({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  if (viewModel.sportPayload.family !== 'esports') return null;
  return <div className="space-y-3"><Card title="Recent Team Form" subtitle="Last five series"><div className="mt-3 divide-y divide-[#202020]">{viewModel.sportPayload.teamForm.map((item) => <div key={`${item.date}-${item.opponent}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2 text-xs"><div><p className="text-zinc-300">vs {item.opponent}</p><p className="text-[9px] text-zinc-600">{item.date} · {item.event}</p></div><span className={item.result === 'W' ? 'font-bold text-emerald-400' : 'font-bold text-red-400'}>{item.result}</span><span className="text-zinc-400">{item.score}</span></div>)}</div></Card><Card title="Rosters"><div className="mt-3 grid grid-cols-2 gap-3">{Object.entries(viewModel.sportPayload.rosters).map(([team, roster]) => <div key={team}><p className="mb-2 text-[10px] font-bold text-[#F5C542]">{team}</p>{roster.map((player) => <div key={player.name} className="border-t border-[#202020] py-2"><p className="text-[10px] text-zinc-300">{player.name}</p><p className="text-[8px] text-zinc-600">{player.role ?? 'Role unavailable'}</p></div>)}</div>)}</div></Card></div>;
}

function Unavailable({ viewModel }: { viewModel: PlayerResearchViewModel }) {
  const reason = viewModel.sportPayload.family === 'hockey' ? viewModel.sportPayload.unavailableReason : viewModel.profile.proxyNotice ?? 'This module is not validated.';
  return <Card title="Analysis Awaiting Reference" subtitle={reason}><div className="mt-4 space-y-2">{['Shared history remains available', 'Line Movement remains available', 'No borrowed sport-specific analysis'].map((item) => <div key={item} className="flex items-center justify-between rounded bg-[#151515] px-3 py-2 text-xs"><span className="text-zinc-400">{item}</span><span className="font-semibold text-[#F5C542]">AVAILABLE</span></div>)}</div></Card>;
}

export function ContextModuleContent({ mode, viewModel, market }: { mode: ContextModuleKey; viewModel: PlayerResearchViewModel; market: MarketSnapshot }) {
  if (mode === 'matchup') return <Matchup viewModel={viewModel} />;
  if (mode === 'defense') return <Defense viewModel={viewModel} market={market} />;
  if (mode === 'shooting') return <Shooting />;
  if (mode === 'similar') return <Similar viewModel={viewModel} />;
  if (mode === 'injuries') return <Injuries viewModel={viewModel} />;
  if (mode === 'rankings') return <Rankings viewModel={viewModel} />;
  if (mode === 'pitch-arsenal') return <PitchArsenal viewModel={viewModel} />;
  if (mode === 'weather') return <Weather viewModel={viewModel} />;
  if (mode === 'lineups') return viewModel.profile.family === 'baseball' ? <BaseballLineups viewModel={viewModel} /> : <SoccerLineups viewModel={viewModel} />;
  if (mode === 'form') return <Form viewModel={viewModel} />;
  if (mode === 'player-stats') return viewModel.profile.family === 'soccer' ? <TeamStats viewModel={viewModel} /> : <EsportsPlayerStats viewModel={viewModel} />;
  if (mode === 'head-to-head') return <TennisH2H viewModel={viewModel} />;
  if (mode === 'advanced-averages') return <AdvancedAverages viewModel={viewModel} />;
  if (mode === 'maps') return <EsportsMaps viewModel={viewModel} />;
  if (mode === 'team-form') return <EsportsTeamForm viewModel={viewModel} />;
  return <Unavailable viewModel={viewModel} />;
}
