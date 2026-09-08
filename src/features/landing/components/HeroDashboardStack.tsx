import { ArrowLeft, Bookmark, ChevronDown, History, ListFilter, ListPlus, Search, SlidersHorizontal, Swords, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { PlayerAvatar } from '@/features/dashboard/components/common'
import { SportsbookLogo } from '@/features/dashboard/components/SportsbookLogo'
import { TeamBadge } from '@/features/dashboard/components/EntityMedia'
import { playerMediaForName } from '@/features/dashboard/media-fixtures'

const recentGames = [12.5, 21.5, 12.5, 24.5, 12.5, 26, 17, 25, 25, 16, 25.5, 16.5, 25.5, 16]

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
      <span className="text-[10px] font-bold leading-none text-white">Arena <span className="text-gold">Props</span><small className="mt-1 block text-[5px] uppercase tracking-[0.18em] text-zinc-600">Premium Picks</small></span>
    </div>
  )
}

function MiniTopNav() {
  return (
    <div className="flex h-11 items-center gap-4 border-b border-white/[0.07] bg-[#080909] px-3">
      <Brand />
      <div className="flex flex-1 items-center gap-3 overflow-hidden text-[8px] font-semibold text-zinc-500">
        <span>All</span><span className="relative py-3 text-teal-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-teal-400">NBA</span><span>NFL</span><span>MLB</span><span>NHL</span><span>WNBA</span><span>NCAAB</span>
      </div>
      <span className="grid h-6 w-6 place-items-center rounded-full bg-teal-400 text-[8px] font-bold text-ink-950">JD</span>
    </div>
  )
}

function PropsBoardScreen() {
  const rows = [
    ['Jalen Brunson', 'Points', '27.5', '80%', true],
    ['Jayson Tatum', '3-Pointers', '3.5', '40%', false],
    ['Nikola Jokic', 'Assists', '8.5', '90%', true],
  ] as const

  return (
    <div className="hero-stack-screen hero-stack-screen--board" aria-hidden="true">
      <MiniTopNav />
      <div className="flex h-[345px]">
        <aside className="w-[112px] shrink-0 border-r border-white/[0.06] bg-[#0b0b0b] p-2">
          <p className="px-2 py-2 text-[6px] font-bold uppercase tracking-[0.18em] text-zinc-700">Research</p>
          {[['Props', ListFilter], ['Players', Users], ['Saved', Bookmark]].map(([label, Icon], index) => (
            <div key={String(label)} className={`mb-1 flex items-center gap-2 rounded px-2 py-2 text-[8px] font-semibold ${index === 0 ? 'bg-white/[0.055] text-white shadow-[inset_2px_0_0_#14b8a6]' : 'text-zinc-600'}`}><Icon className={`h-3 w-3 ${index === 0 ? 'text-teal-400' : ''}`} />{String(label)}</div>
          ))}
        </aside>
        <div className="min-w-0 flex-1 p-3">
          <div className="flex items-center gap-2 rounded-md border border-white/[0.08] bg-[#111515] px-3 py-2 text-[8px] text-zinc-600"><Search className="h-3 w-3" />Search players, teams, games, or props…</div>
          <div className="mt-2 flex gap-1.5">{['Game', 'Player', 'Prop', 'Sportsbooks'].map((item) => <span key={item} className="flex items-center gap-1 rounded border border-white/[0.07] bg-[#111515] px-2 py-1.5 text-[7px] text-zinc-500">{item}<ChevronDown className="h-2.5 w-2.5" /></span>)}</div>
          <div className="mt-2 overflow-hidden rounded-lg border border-white/[0.06]">
            <div className="grid grid-cols-[1.3fr_1fr_.55fr_.55fr_.38fr] bg-[#0b0d0d] px-2 py-1.5 text-[6px] uppercase tracking-wider text-zinc-700"><span>Player · Prop</span><span>Book · Line</span><span>Projection</span><span>L10</span><span /></div>
            {rows.map(([name, market, line, rate, positive], index) => (
              <div key={name} className={`grid grid-cols-[1.3fr_1fr_.55fr_.55fr_.38fr] items-center border-t border-white/[0.045] px-2 py-2 ${index % 2 ? 'bg-[#121515]' : 'bg-[#0d1010]'}`}>
                <div className="flex items-center gap-1.5"><PlayerAvatar name={name} size="xs" /><span><strong className="block text-[8px] text-zinc-100">{name}</strong><small className="text-[6px] text-zinc-600">{market}</small></span></div>
                <div className="flex items-center gap-1"><SportsbookLogo shortName="DK" compact /><span className="text-[8px] text-zinc-300">{line}</span></div>
                <span className="text-center text-[8px] font-bold text-zinc-200">{positive ? '+1.4' : '-0.8'}</span>
                <span className={`py-2 text-center text-[8px] font-bold ${positive ? 'bg-[#66ff33]/[0.12] text-[#66ff33]' : 'bg-[#ff5252]/[0.12] text-[#ff5252]'}`}>{rate}</span>
                <span className="mx-auto grid h-6 w-6 place-items-center rounded bg-teal-500/10 text-teal-300"><ListPlus className="h-3 w-3" /></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlayerAnalysisScreen() {
  const jalenHeadshot = playerMediaForName('Jalen Brunson')?.headshotUrl
  const movement = [
    ['23.5', 'DK', '+0.5', '45s ago', 'up'],
    ['22.5', 'FD', '-0.5', '5m ago', 'down'],
    ['23', 'MGM', '—', '9m ago', 'flat'],
    ['23', 'CZR', '—', '13m ago', 'flat'],
    ['23', 'DK', '—', '17m ago', 'flat'],
  ] as const

  return (
    <div className="hero-stack-screen hero-stack-screen--main" aria-hidden="true">
      <div className="hero-stack-accent" />
      <div className="h-[568px] bg-[#080a0a] p-3">
        <div className="flex items-center gap-1 text-[7px] text-zinc-500"><ArrowLeft className="h-2.5 w-2.5" />Back to Props</div>

        <section className="relative mt-2 grid h-[122px] grid-cols-[132px_minmax(0,1fr)] overflow-hidden rounded-lg border border-white/[0.07] bg-[#0f1211]">
          <div className="relative overflow-hidden border-r border-white/[0.055] bg-[radial-gradient(circle_at_40%_100%,rgba(20,184,166,0.2),transparent_68%)]">
            <div className="absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#0f1211] to-transparent" />
            {jalenHeadshot ? <img src={jalenHeadshot} alt="" className="absolute bottom-0 -left-2 h-[132px] w-[146px] max-w-none object-contain object-bottom drop-shadow-[0_8px_14px_rgba(0,0,0,0.55)]" /> : <div className="grid h-full place-items-center"><PlayerAvatar name="Jalen Brunson" size="lg" /></div>}
          </div>
          <div className="min-w-0 p-3">
            <div className="flex items-start justify-between">
              <div><p className="text-[6px] font-semibold uppercase tracking-[0.18em] text-teal-400/80">Player analytics</p><h3 className="mt-1 text-[15px] font-bold text-zinc-50">Jalen Brunson</h3><p className="text-[7px] text-zinc-500">NBA · Basketball player · #11</p></div>
              <span className="rounded border border-white/[0.08] px-2 py-1 text-[6px] text-zinc-500"><Bookmark className="mr-1 inline h-2.5 w-2.5" />Save Player</span>
            </div>
            <div className="mt-2 grid grid-cols-5 divide-x divide-white/[0.05] overflow-hidden rounded-md border border-white/[0.055] bg-black/10">
              {[['Position', 'PG'], ['Team', 'NYK'], ['Opponent', '@ BOS'], ['Game', 'Today · 4:05 PM'], ['L10 lean', 'O 50% / U 50%']].map(([label, value], index) => <div key={label} className="px-2 py-1.5"><p className="text-[5px] font-semibold uppercase tracking-wider text-zinc-700">{label}</p><p className={`mt-0.5 truncate text-[7px] font-semibold ${index === 4 ? 'text-teal-300' : 'text-zinc-300'}`}>{value}</p></div>)}
            </div>
            <p className="mt-1.5 text-[6px] text-zinc-600">@ BOS · Today 4:05 PM · <span className="text-teal-300">Scheduled</span></p>
          </div>
        </section>

        <div className="mt-2.5 grid grid-cols-[minmax(0,2.65fr)_230px] gap-2.5">
          <section className="min-w-0 overflow-hidden rounded-lg border border-white/[0.07] bg-[#0f1111]">
            <div className="flex items-center gap-1 border-b border-white/[0.055] px-2 py-1.5">
              <div className="flex rounded border border-white/[0.07] bg-[#090b0b] p-0.5 text-[6px] font-semibold"><span className="rounded bg-teal-500/15 px-2 py-1 text-teal-300">Primary</span><span className="px-2 py-1 text-zinc-600">Alternate</span></div>
              <div className="ml-1 flex min-w-0 flex-1 gap-1 overflow-hidden">{['MIN', 'PTS', 'REBS', 'O-REB', 'D-REB', 'ASTS', 'PA', 'PR', 'RA', 'PRA'].map((market) => <span key={market} className={`relative shrink-0 px-1.5 py-1 text-[6px] font-semibold ${market === 'PTS' ? 'text-teal-300 after:absolute after:inset-x-1 after:bottom-0 after:h-px after:bg-teal-400' : 'text-zinc-600'}`}>{market}</span>)}</div>
            </div>
            <div className="flex items-center gap-1 border-b border-white/[0.055] px-2 py-1.5">
              <div className="w-[70px] border-r border-white/[0.06] pr-2"><p className="text-[5px] uppercase tracking-wider text-zinc-700">Selected prop</p><p className="text-[8px] font-bold text-zinc-100">Points</p></div>
              <div className="flex rounded border border-white/[0.07] bg-[#111313] p-0.5 text-[6px]"><span className="rounded bg-teal-500/15 px-2 py-1 text-teal-300">Full Game</span><span className="px-1.5 py-1 text-zinc-600">1Q</span><span className="px-1.5 py-1 text-zinc-600">1H</span><span className="px-1.5 py-1 text-zinc-600">2H</span></div>
              <div className="flex items-center rounded border border-white/[0.08] bg-[#111313] px-1.5 py-1 text-[6px] text-zinc-600">Line <span className="mx-2 text-[10px] font-bold text-white">23</span>＋</div>
              <div className="flex items-center gap-1 rounded border border-white/[0.08] bg-[#111313] px-2 py-1"><span className="grid h-4 w-6 place-items-center rounded bg-teal-500/10 text-[5px] font-bold text-teal-300">ALL</span><span className="text-[6px] font-semibold text-zinc-200">All Books</span><ChevronDown className="h-2.5 w-2.5 text-zinc-600" /></div>
              <span className="ml-auto flex items-center gap-1 rounded border border-white/[0.08] px-2 py-1 text-[6px] text-zinc-500"><SlidersHorizontal className="h-2.5 w-2.5" />Filters</span>
            </div>
            <div className="grid grid-cols-5 divide-x divide-white/[0.055] border-b border-white/[0.055]">
              {[['L5', '40%', '2/5'], ['L10', '50%', '5/10'], ['L15', '36%', '5/14'], ['Season', '36%', '5/14'], ['H2H', '36%', '1/4']].map(([label, value, sample], index) => <div key={label} className="flex items-baseline justify-center gap-1 py-1.5"><span className="text-[5px] uppercase text-zinc-700">{label}</span><strong className={`text-[8px] ${index === 1 ? 'text-amber-300' : index === 0 ? 'text-amber-400' : 'text-[#ff5252]'}`}>{value}</strong><small className="text-[5px] text-zinc-700">{sample}</small></div>)}
            </div>
            <div className="flex items-center justify-between border-b border-white/[0.05] px-2.5 py-1.5"><span className="text-[7px] font-semibold text-zinc-200">Recent Points</span><div className="flex gap-2 text-[5px] text-zinc-600"><span>L5</span><span>L10</span><span className="rounded bg-teal-500/15 px-1.5 py-0.5 text-teal-300">L15</span><span>Season</span></div></div>
            <div className="relative mx-2.5 mt-2 flex h-[172px] items-end gap-1.5 border-b border-white/[0.06] bg-teal-500/[0.035] px-1">
              <span className="absolute inset-x-0 bottom-[66%] border-t-2 border-dashed border-teal-400"><span className="absolute right-1 -top-3 rounded border border-teal-400/50 bg-[#0c2522] px-3 py-1 text-[7px] font-bold text-teal-200">LINE 23</span></span>
              {recentGames.map((value, index) => {
                const over = value > 23
                return <div key={`${value}-${index}`} className="flex min-w-0 flex-1 flex-col items-center justify-end"><span className="mb-1 text-[6px] font-bold text-zinc-200">{value}</span><span className={`w-full rounded-t-[3px] ${over ? 'bg-gradient-to-t from-emerald-700 to-emerald-400' : 'bg-gradient-to-t from-red-900 to-red-400'}`} style={{ height: `${Math.max(26, value * 4.6)}px` }}><small className="mt-1 block text-center text-[6px] font-black text-black">{over ? 'O' : 'U'}</small></span></div>
              })}
            </div>
            <div className="grid grid-cols-7 px-2.5 py-1 text-center text-[5px] text-zinc-600">{['Feb 14', 'Feb 2', 'Feb 4', 'Jan 6', 'Jan 8', 'Jan 10', 'Dec 12'].map((date) => <span key={date}>{date}</span>)}</div>
          </section>

          <aside className="space-y-2">
            <section className="overflow-hidden rounded-lg border border-white/[0.07] bg-[#101212]">
              <div className="grid grid-cols-2 border-b border-white/[0.06]"><span className="flex items-center justify-center gap-1 border-b-2 border-teal-400 py-2 text-[7px] font-semibold text-teal-300"><TrendingUp className="h-2.5 w-2.5" />Line Movement</span><span className="flex items-center justify-center gap-1 py-2 text-[7px] text-zinc-600"><History className="h-2.5 w-2.5" />Prop History</span></div>
              <div className="px-2.5 py-2"><div className="grid grid-cols-[42px_1fr_45px_42px] pb-1 text-[5px] uppercase tracking-wider text-zinc-700"><span>Line</span><span>App</span><span>Move</span><span className="text-right">Time</span></div>{movement.map(([line, book, move, time, direction]) => <div key={`${book}-${time}`} className="grid grid-cols-[42px_1fr_45px_42px] items-center border-t border-white/[0.05] py-1.5 text-[6px]"><strong className="text-zinc-200">{line}</strong><span className="flex items-center gap-1"><SportsbookLogo shortName={book} compact /><small className="text-zinc-500">{book}</small></span><span className={direction === 'up' ? 'text-emerald-400' : direction === 'down' ? 'text-red-400' : 'text-zinc-600'}>{direction === 'up' && <TrendingUp className="mr-0.5 inline h-2 w-2" />}{direction === 'down' && <TrendingDown className="mr-0.5 inline h-2 w-2" />}{move}</span><span className="text-right text-zinc-600">{time}</span></div>)}</div>
            </section>
            <section className="grid grid-cols-5 gap-1 rounded-lg border border-white/[0.07] bg-[#101212] p-1.5">{['Matchup', 'Defense', 'Shooting', 'Similar', 'Injuries'].map((item, index) => <span key={item} className={`flex flex-col items-center gap-1 rounded px-1 py-2 text-[5px] ${index === 0 ? 'bg-teal-500/10 text-teal-300' : 'text-zinc-600'}`}>{index === 0 ? <Swords className="h-3 w-3" /> : <span className="h-3 w-3 rounded-full border border-current" />}{item}</span>)}</section>
            <section className="rounded-lg border border-white/[0.07] bg-[#101212] p-2.5"><p className="text-[7px] font-semibold text-zinc-200">Matchup Context</p><div className="mt-2 flex items-center gap-2"><TeamBadge team="NYK" sport="NBA" className="h-7 w-7" /><span className="text-[6px] text-zinc-600">at</span><TeamBadge team="BOS" sport="NBA" className="h-7 w-7" /><div className="ml-auto text-right"><p className="text-[7px] font-bold text-zinc-300">BOS 24th vs PG</p><p className="text-[5px] text-zinc-600">Fixed matchup sample</p></div></div></section>
          </aside>
        </div>
        <div className="mt-2 flex items-center justify-end gap-1.5 text-[6px] font-semibold uppercase tracking-[0.12em] text-teal-300"><span className="h-1.5 w-1.5 rounded-full bg-teal-400" />Fixed Mock Data · No live connection</div>
      </div>
    </div>
  )
}

function ContextScreen() {
  return (
    <div className="hero-stack-screen hero-stack-screen--context" aria-hidden="true">
      <div className="hero-stack-accent" />
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-[#080909] px-4 py-3"><span className="text-[8px] font-bold uppercase tracking-[0.14em] text-zinc-300">Builder</span><span className="rounded-full bg-teal-500/10 px-2 py-1 text-[7px] font-bold text-teal-300">2 selections</span></div>
      <div className="space-y-2.5 p-4">
        {[['Jalen Brunson', 'Points · Over 27.5', '-115'], ['Nikola Jokic', 'Assists · Over 8.5', '-130']].map(([name, market, odds]) => <div key={name} className="rounded-lg border border-white/[0.065] bg-[#0d1010] p-3"><div className="flex items-center gap-2"><PlayerAvatar name={name} size="xs" /><span><strong className="block text-[9px] text-zinc-100">{name}</strong><small className="text-[7px] text-zinc-600">{market}</small></span><span className="ml-auto text-[9px] font-bold text-teal-300">{odds}</span></div><div className="mt-2 flex items-center justify-between border-t border-white/[0.05] pt-2"><SportsbookLogo shortName="DK" compact /><span className="text-[7px] text-zinc-600">Fixed preview</span></div></div>)}
        <div className="rounded-lg border border-teal-500/20 bg-teal-500/[0.055] p-3 text-center"><ListPlus className="mx-auto h-4 w-4 text-teal-300" /><p className="mt-2 text-[8px] font-bold text-zinc-200">Connected research workspace</p><p className="mt-1 text-[7px] leading-relaxed text-zinc-600">No wager placement or live account connection.</p></div>
      </div>
    </div>
  )
}

export function HeroDashboardStack() {
  return (
    <div className="hero-dashboard-window" role="img" aria-label="Layered fixed-data Arena Props previews matching the current dashboard interface">
      <div className="hero-dashboard-beam" aria-hidden="true" />
      <div className="hero-dashboard-stack">
        <PropsBoardScreen />
        <PlayerAnalysisScreen />
        <ContextScreen />
      </div>
    </div>
  )
}
