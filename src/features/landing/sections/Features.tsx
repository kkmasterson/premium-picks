import { SectionHeader } from '@/features/landing/components/SectionHeader'
import { Reveal } from '@/features/landing/hooks/Reveal'
import { lineComparison, matchupRows, propRows, trendGames } from '@/features/landing/data'
import { PlayerAvatar } from '@/features/dashboard/components/common'
import { SportsbookLogo } from '@/features/dashboard/components/SportsbookLogo'
import { TeamBadge } from '@/features/dashboard/components/EntityMedia'

const fullNames: Record<string, string> = {
  'J. Brunson': 'Jalen Brunson',
  'T. Haliburton': 'Tyrese Haliburton',
  'A. Davis': 'Anthony Davis',
  'S. Gilgeous-Alexander': 'Shai Gilgeous-Alexander',
}

function hitClass(v: number) {
  return v >= 50 ? 'text-pos' : 'text-neg'
}

/* ---------- Mini visuals ---------- */

function PropsTableVisual() {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-ink-950">
      <table className="w-full min-w-[440px] text-[11px]">
        <thead>
          <tr className="border-b border-line text-[9px] uppercase tracking-[0.14em] text-mist-muted">
            {['Player · Prop', 'Book', 'Projection', 'L5', 'L10', 'Season'].map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium first:pl-4 last:pr-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {propRows.slice(0, 4).map((r, index) => (
            <tr key={r.player} className="border-b border-line/50 last:border-0">
              <td className="px-3 py-2 pl-4"><span className="flex items-center gap-2"><PlayerAvatar name={fullNames[r.player] ?? r.player} size="xs" /><span><strong className="block text-mist">{r.player}</strong><small className="text-[8px] text-mist-muted">{r.prop}</small></span></span></td>
              <td className="px-3 py-2"><span className="flex items-center gap-1.5"><SportsbookLogo shortName={index % 2 ? 'FD' : 'DK'} compact /><span className="text-mist-secondary">{r.line}</span></span></td>
              <td className="px-3 py-2 font-medium text-mist">{r.avg}</td>
              <td className={`px-3 py-2 font-semibold ${hitClass(r.l5)}`}>{r.l5}%</td>
              <td className={`px-3 py-2 font-semibold ${hitClass(r.l10)}`}>{r.l10}%</td>
              <td className={`px-3 py-2 pr-4 font-semibold ${hitClass(r.season)}`}>{r.season}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FiltersVisual() {
  const filters = [
    ['Sport', 'NBA'],
    ['Game', 'NYK @ BOS'],
    ['Player', 'All Players'],
    ['Props', 'Points'],
    ['Sportsbooks', '15 selected'],
    ['Min Odds', '-200'],
    ['Max Odds', '+150'],
    ['Hit Rate', '≥ 60%'],
    ['Date', 'Today'],
  ]
  return (
    <div className="rounded-lg border border-line bg-ink-950 p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {filters.map(([k, v]) => (
          <div key={k} className="rounded-md border border-line bg-ink-850 px-3 py-2">
            <p className="text-[9px] uppercase tracking-[0.14em] text-mist-muted">{k}</p>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-mist">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-md border border-teal-500/30 bg-teal-500/[0.07] px-3 py-2">
        <span className="text-[11px] font-medium text-teal-300">38 matching props found</span>
        <span className="text-[10px] text-mist-muted">Filters applied: 6</span>
      </div>
    </div>
  )
}

function TrendsVisual() {
  const max = 40
  const line = 27.5
  return (
    <div className="rounded-lg border border-line bg-ink-950 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-mist">J. Brunson · Points · Last 8</span>
        <span className="rounded border border-teal-500/40 bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
          Line {line}
        </span>
      </div>
      <div className="relative flex h-32 items-end justify-between gap-2 border-b border-line pb-0">
        {/* line marker */}
        <div
          className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-teal-400/50"
          style={{ bottom: `${(line / max) * 100}%` }}
          aria-hidden="true"
        />
        {trendGames.map((g) => (
          <div key={g.label} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[9px] font-semibold text-mist-muted">{g.value}</span>
            <div
              className={`w-full max-w-[26px] rounded-t-sm ${g.over ? 'bg-pos/80' : 'bg-neg/70'}`}
              style={{ height: `${(g.value / max) * 96}px` }}
            />
            <span className="text-[9px] text-mist-disabled">{g.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[10px] text-mist-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-pos/80" /> Over
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-neg/70" /> Under
        </span>
        <span className="ml-auto font-semibold text-pos">5/8 over (63%)</span>
      </div>
    </div>
  )
}

function LineComparisonVisual() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ink-950">
      <div className="border-b border-line bg-ink-850 px-4 py-2">
        <span className="text-[11px] font-semibold text-mist">J. Brunson · Points</span>
      </div>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-line text-[9px] uppercase tracking-[0.14em] text-mist-muted">
            {['Sportsbook', 'Line', 'Over', 'Under'].map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium first:pl-4 last:pr-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lineComparison.map((l) => (
            <tr
              key={l.book}
              className={`border-b border-line/50 last:border-0 ${l.best ? 'bg-teal-500/[0.06]' : ''}`}
            >
              <td className="px-3 py-2 pl-4 font-semibold text-mist">
                <span className="inline-flex items-center gap-2"><SportsbookLogo shortName={l.book === 'Book A' ? 'DK' : l.book === 'Book B' ? 'FD' : l.book === 'Book C' ? 'MGM' : 'CZR'} compact />{l.book}</span>
                {l.best && (
                  <span className="ml-2 rounded border border-teal-500/35 bg-teal-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-teal-300">
                    Best Price
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-mist">{l.line}</td>
              <td className={`px-3 py-2 font-medium ${l.best ? 'text-pos' : 'text-mist-secondary'}`}>{l.over}</td>
              <td className="px-3 py-2 pr-4 text-mist-secondary">{l.under}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MatchupVisual() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ink-950">
      {matchupRows.map((m) => (
        <div key={m.opponent} className="flex items-center gap-3 border-b border-line/50 px-4 py-3 last:border-0">
          <TeamBadge team={m.opponent} sport="NBA" className="h-9 w-9" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-mist">
              {m.posDefense} <span className="font-normal text-mist-muted">· {m.meetings}</span>
            </p>
            <p className="text-[10px] text-mist-muted">Avg {m.avg} pts in meetings</p>
          </div>
          <span className={`text-[12px] font-bold ${hitClass(m.hitRate)}`}>{m.hitRate}%</span>
        </div>
      ))}
    </div>
  )
}

function ProjectionsVisual() {
  return (
    <div className="rounded-lg border border-line bg-ink-950 p-5">
      <p className="text-[11px] font-semibold text-mist">S. Gilgeous-Alexander · Points</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-mist-muted">AP Projection</p>
          <p className="mt-1 text-3xl font-extrabold text-teal-300">34.8</p>
        </div>
        <div className="pb-1 text-right">
          <p className="text-[9px] uppercase tracking-[0.14em] text-mist-muted">Sportsbook Line</p>
          <p className="mt-1 text-2xl font-bold text-mist-secondary">31.5</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-700">
        <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-teal-800 via-teal-500 to-teal-300" />
      </div>
      <div className="mt-4 flex items-center justify-between rounded-md border border-pos/30 bg-pos/10 px-3 py-2">
        <span className="text-[11px] font-medium text-mist-secondary">Difference</span>
        <span className="text-sm font-extrabold text-pos">+3.3</span>
      </div>
    </div>
  )
}

function DiscrepanciesVisual() {
  const rows = [
    { player: 'J. Brunson', market: 'Points', spread: '2.0', strength: 'Strong' },
    { player: 'P. Mahomes', market: 'Pass Yds', spread: '8.5', strength: 'Watch' },
    { player: 'A. Judge', market: 'Total Bases', spread: '0.5', strength: 'Strong' },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ink-950">
      <div className="flex items-center justify-between border-b border-line bg-ink-850 px-4 py-2.5">
        <span className="text-[11px] font-semibold text-mist">Largest line gaps</span>
        <span className="rounded border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-teal-300">Scan</span>
      </div>
      {rows.map((row) => (
        <div key={row.player} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line/50 px-4 py-3 last:border-0">
          <div>
            <p className="text-[11px] font-semibold text-mist">{row.player} · {row.market}</p>
            <p className="mt-0.5 text-[10px] text-mist-muted">Sportsbook range · {row.spread}</p>
          </div>
          <span className={`rounded-md border px-2 py-1 text-[10px] font-bold ${row.strength === 'Strong' ? 'border-pos/25 bg-pos/10 text-pos' : 'border-teal-500/25 bg-teal-500/10 text-teal-300'}`}>{row.strength}</span>
        </div>
      ))}
    </div>
  )
}

function ResearchSignalsVisual() {
  return (
    <div className="rounded-lg border border-line bg-ink-950 p-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          ['Popular', 'Community'],
          ['Saved', 'Your board'],
          ['Builder', '3 selections'],
        ].map(([title, detail], index) => (
          <div key={title} className={`rounded-lg border p-3 ${index === 2 ? 'border-teal-500/35 bg-teal-500/10' : 'border-line bg-ink-850'}`}>
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold ${index === 2 ? 'bg-teal-400 text-ink-950' : 'bg-ink-700 text-mist-secondary'}`}>{index + 1}</span>
            <p className="mt-3 text-[11px] font-bold text-mist">{title}</p>
            <p className="mt-0.5 text-[9px] text-mist-muted">{detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-md border border-pos/25 bg-pos/10 px-3 py-2 text-center text-[10px] font-semibold text-pos">Move from discovery to a saved research decision</div>
    </div>
  )
}

/* ---------- Feature cards ---------- */

const features = [
  {
    title: 'Player Props Research',
    copy: 'View player props alongside recent performance, averages, hit rates, and sportsbook lines.',
    visual: <PropsTableVisual />,
  },
  {
    title: 'Advanced Filters',
    copy: 'Filter by sport, game, player, prop market, sportsbook, odds, date, and hit rate.',
    visual: <FiltersVisual />,
  },
  {
    title: 'Player Trends',
    copy: 'See game-by-game performance and how frequently a player has cleared the current line.',
    visual: <TrendsVisual />,
  },
  {
    title: 'Line Comparison',
    copy: 'Compare the same prop across multiple sportsbooks without opening each sportsbook individually.',
    visual: <LineComparisonVisual />,
  },
  {
    title: 'Matchup Insights',
    copy: 'Review matchup context, opponent history, and relevant defensive information.',
    visual: <MatchupVisual />,
  },
  {
    title: 'Projections',
    copy: 'Compare Arena Props projections against current sportsbook lines and historical performance.',
    visual: <ProjectionsVisual />,
  },
  {
    title: 'Line Discrepancies',
    copy: 'Surface meaningful differences between available lines so the best research starting points rise to the top.',
    visual: <DiscrepanciesVisual />,
  },
  {
    title: 'Popular, Saved & Pick Builder',
    copy: 'Combine community momentum, your saved research, and a persistent selection builder in one workflow.',
    visual: <ResearchSignalsVisual />,
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-line bg-ink-900 py-20 md:py-28">
      <div className="container-site">
        <SectionHeader
          eyebrow="The Full Research Stack"
          title="Core Capabilities Are Already in the Arena"
          copy="The baseline tools people expect from leading prop-research platforms are connected with Arena Props discovery, saving, and pick-building workflows."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 100}>
              <article className="group card-surface flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/30 md:p-7">
                <h3 className="text-xl font-bold text-mist">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-muted">{f.copy}</p>
                <div className="mt-6 flex-1">{f.visual}</div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-10 text-center">
          <p className="text-sm text-mist-muted">
            MVP build track: <span className="text-mist-secondary">+EV engine, arbitrage scanner, line movement detection, user alerts, injury impact models, and market movement alerts.</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
