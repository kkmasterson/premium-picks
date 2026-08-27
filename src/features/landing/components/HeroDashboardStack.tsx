const chartValues = [42, 64, 55, 78, 60, 86, 70, 92, 74]

function MiniBrand() {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
      <span className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-mist">
        Premium <span className="text-gold">Picks</span>
      </span>
    </div>
  )
}

function PropsBoardScreen() {
  const rows = [
    ['J. Brunson', 'Points', '27.5', '80%'],
    ['J. Tatum', '3-Pointers', '3.5', '60%'],
    ['N. Jokic', 'Assists', '8.5', '90%'],
  ]

  return (
    <div className="hero-stack-screen hero-stack-screen--board" aria-hidden="true">
      <img
        src="/landing/projections-board.png"
        alt=""
        width="1541"
        height="868"
        draggable={false}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover object-top"
      />
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <MiniBrand />
        <div className="flex gap-1.5">
          {['NBA', 'NFL', 'MLB'].map((sport, index) => (
            <span key={sport} className={`rounded px-2 py-1 text-[8px] font-bold ${index === 0 ? 'bg-gold text-ink-950' : 'bg-white/[0.06] text-mist-muted'}`}>{sport}</span>
          ))}
        </div>
      </div>
      <div className="border-b border-white/[0.06] p-4">
        <div className="flex items-center gap-2 rounded-md border border-white/[0.07] bg-black/40 px-3 py-2 text-[9px] text-mist-muted">
          <span className="h-2 w-2 rounded-full border border-mist-muted" />
          Search players, teams, props...
        </div>
      </div>
      <div className="px-4 py-2">
        <div className="grid grid-cols-[1.2fr_1fr_0.5fr_0.5fr] border-b border-white/[0.06] py-2 text-[7px] font-semibold uppercase tracking-[0.14em] text-mist-disabled">
          <span>Player</span><span>Market</span><span>Line</span><span>L10</span>
        </div>
        {rows.map(([player, market, line, rate]) => (
          <div key={player} className="grid grid-cols-[1.2fr_1fr_0.5fr_0.5fr] items-center border-b border-white/[0.05] py-3 text-[9px]">
            <span className="font-bold text-mist">{player}</span><span className="text-mist-muted">{market}</span><span className="font-semibold text-mist-secondary">{line}</span><span className="font-bold text-pos">{rate}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlayerAnalysisScreen() {
  const navItems = ['Overview', 'Projections', 'Players', 'Props', '+EV', 'Saved']

  return (
    <div className="hero-stack-screen hero-stack-screen--main" aria-hidden="true">
      <img
        src="/landing/patrick-mahomes-player-page.png"
        alt=""
        width="1540"
        height="868"
        draggable={false}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full bg-ink-950 object-contain"
      />
      <div className="hero-stack-accent" />
      <div className="flex h-[556px]">
        <aside className="flex w-[128px] shrink-0 flex-col border-r border-white/[0.07] bg-black/35 p-3">
          <MiniBrand />
          <div className="mt-5 space-y-1">
            {navItems.map((item, index) => (
              <div
                key={item}
                className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-[9px] font-semibold ${index === 2 ? 'bg-gold/10 text-gold' : 'text-mist-muted'}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${index === 2 ? 'bg-gold' : 'bg-white/20'}`} />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5">
            <p className="text-[8px] font-bold text-mist-secondary">Research synced</p>
            <p className="mt-1 text-[7px] leading-relaxed text-mist-disabled">Lines and player context updated moments ago.</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-black/25 px-5 py-3">
            <div className="flex items-center gap-3 text-[9px] font-semibold text-mist-muted">
              <span>← Back to players</span>
              <span className="h-3 w-px bg-white/10" />
              <span className="text-mist">NBA Research</span>
            </div>
            <div className="flex gap-1.5">
              <span className="rounded-md bg-gold px-3 py-1 text-[8px] font-extrabold text-ink-950">PLAYER</span>
              <span className="rounded-md bg-white/[0.06] px-3 py-1 text-[8px] font-semibold text-mist-muted">PROPS</span>
              <span className="rounded-md bg-white/[0.06] px-3 py-1 text-[8px] font-semibold text-mist-muted">MATCHUP</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-white/[0.07] bg-gradient-to-r from-gold/20 via-gold/[0.08] to-transparent px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-[10px] font-extrabold text-gold">JB</span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold text-mist">Jalen Brunson</p>
                  <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[7px] font-bold text-mist-muted">NYK · PG</span>
                </div>
                <p className="mt-0.5 text-[9px] text-mist-muted">Tonight at Boston · 7:30 PM · Active</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-[9px] font-bold text-gold">Points 27.5</span>
              <span className="rounded-md border border-white/[0.08] bg-black/30 px-3 py-2 text-[9px] font-semibold text-mist-muted">Full game</span>
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1.6fr)_210px] gap-3 p-4">
            <div className="min-w-0">
              <div className="grid grid-cols-4 gap-2">
                {[
                  ['L5', '80%'],
                  ['L10', '70%'],
                  ['L15', '73%'],
                  ['Season', '66%'],
                ].map(([label, value], index) => (
                  <div key={label} className={`rounded-lg border p-2.5 ${index === 3 ? 'border-gold/25 bg-gold/[0.08]' : 'border-pos/20 bg-pos/[0.07]'}`}>
                    <p className="text-[7px] font-semibold uppercase tracking-[0.13em] text-mist-muted">{label}</p>
                    <p className={`mt-1 text-sm font-extrabold ${index === 3 ? 'text-gold' : 'text-pos'}`}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-lg border border-white/[0.07] bg-black/25 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-mist">Recent performance</span>
                    <span className="ml-2 text-[7px] text-mist-disabled">Last 10 games</span>
                  </div>
                  <span className="rounded border border-gold/30 bg-gold/[0.08] px-2 py-1 text-[8px] font-bold text-gold">Line 27.5</span>
                </div>
                <div className="relative mt-3 flex h-[145px] items-end gap-2 border-b border-white/[0.07]">
                  <span className="absolute inset-x-0 bottom-[56%] border-t border-dashed border-gold/55" />
                  {chartValues.map((value, index) => (
                    <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center justify-end gap-1">
                      <span className="text-[7px] font-semibold text-mist-muted">{20 + index * 2}</span>
                      <span className={`w-full max-w-9 rounded-t-sm ${index === 0 || index === 4 ? 'bg-neg/80' : 'bg-gradient-to-t from-pos/45 to-pos'}`} style={{ height: `${value * 1.22}px` }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  ['vs BOS', '32 PTS', 'Over'],
                  ['vs IND', '26 PTS', 'Under'],
                  ['vs MIA', '34 PTS', 'Over'],
                ].map(([game, result, outcome]) => (
                  <div key={game} className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.025] px-2.5 py-2">
                    <span className="text-[7px] text-mist-muted">{game}</span>
                    <span className="text-[8px] font-bold text-mist">{result}</span>
                    <span className={`text-[7px] font-bold ${outcome === 'Over' ? 'text-pos' : 'text-neg'}`}>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="rounded-lg border border-gold/25 bg-gold/[0.07] p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-gold">Line movement</p>
                  <span className="text-[8px] font-bold text-pos">Live</span>
                </div>
                <div className="mt-3 flex items-end gap-1.5">
                  {[18, 26, 22, 34, 30, 42, 38, 48].map((height, index) => (
                    <span key={`${height}-${index}`} className="flex-1 rounded-t-sm bg-gold/65" style={{ height }} />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[8px] text-mist-muted"><span>26.5</span><span className="font-bold text-gold">27.5</span></div>
              </div>
              <div className="rounded-lg border border-white/[0.07] bg-black/25 p-3">
                <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-mist-muted">Tonight's matchup</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-gold/25 bg-gold/10 text-[8px] font-extrabold text-gold">NYK</span>
                  <span className="text-[8px] text-mist-disabled">AT</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-[8px] font-extrabold text-mist">BOS</span>
                </div>
                <p className="mt-3 text-[9px] font-bold text-mist">24th vs point guards</p>
                <p className="mt-1 text-[8px] text-mist-muted">30.7 PPG allowed in last 10</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[['Season avg', '28.9'], ['Projection', '30.8']].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/[0.06] bg-white/[0.025] p-2.5">
                    <p className="text-[7px] text-mist-muted">{label}</p>
                    <p className="mt-1 text-sm font-extrabold text-mist">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContextScreen() {
  return (
    <div className="hero-stack-screen hero-stack-screen--context" aria-hidden="true">
      <img
        src="/landing/patrick-mahomes-player-page.png"
        alt=""
        width="1540"
        height="868"
        draggable={false}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover object-right"
      />
      <div className="hero-stack-accent" />
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
        <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-mist">Live context</span>
        <span className="flex items-center gap-1 text-[7px] font-bold uppercase tracking-wide text-pos"><span className="h-1.5 w-1.5 rounded-full bg-pos" />Synced</span>
      </div>
      <div className="space-y-2.5 p-4">
        <div className="rounded-lg border border-gold/25 bg-gold/[0.08] p-3">
          <p className="text-[7px] font-semibold uppercase tracking-[0.13em] text-gold">Line movement</p>
          <div className="mt-3 flex items-center gap-2">
            {[38, 52, 44, 68, 60, 78, 72].map((height, index) => (
              <span key={`${height}-${index}`} className="w-2 rounded-sm bg-gold/70" style={{ height: `${height * 0.45}px` }} />
            ))}
            <span className="ml-auto text-sm font-extrabold text-gold">27.5</span>
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.07] bg-black/25 p-3">
          <p className="text-[7px] font-semibold uppercase tracking-[0.13em] text-mist-muted">Matchup</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-gold/25 bg-gold/10 text-[8px] font-extrabold text-gold">NYK</span>
            <span className="text-[8px] text-mist-disabled">AT</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-[8px] font-extrabold text-mist">BOS</span>
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.07] bg-black/25 p-3">
          <p className="text-[7px] font-semibold uppercase tracking-[0.13em] text-mist-muted">Position defense</p>
          <p className="mt-2 text-[10px] font-bold text-mist">24th vs point guards</p>
          <p className="mt-1 text-[8px] text-mist-muted">30.7 avg in 3 meetings</p>
        </div>
      </div>
    </div>
  )
}

export function HeroDashboardStack() {
  return (
    <div className="hero-dashboard-window" role="img" aria-label="Layered Arena Props product previews featuring the real Patrick Mahomes player research page">
      <div className="hero-dashboard-beam" aria-hidden="true" />
      <div className="hero-dashboard-stack">
        <PropsBoardScreen />
        <PlayerAnalysisScreen />
        <ContextScreen />
      </div>
    </div>
  )
}
