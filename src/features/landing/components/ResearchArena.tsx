import { useState } from 'react'

const angles = [
  { label: 'The line', value: '27.5', unit: 'POINTS', title: 'A number is just the beginning.', copy: 'Compare the same market across books.', note: 'J. BRUNSON / POINTS', position: 'line' },
  { label: 'The form', value: '7/10', unit: 'OVER THE LINE', title: 'Give the number a little history.', copy: 'Read recent results against the same line.', note: 'LAST 10 / SAMPLE RESULTS', position: 'form' },
  { label: 'The matchup', value: 'NYK', unit: 'AT BOSTON', title: 'Put the performance in context.', copy: 'Bring the opponent into your research.', note: 'NEW YORK / BOSTON', position: 'matchup' },
]

export function ResearchArena() {
  const [selected, setSelected] = useState(0)
  const angle = angles[selected]

  return (
    <div className={`research-arena research-arena--${angle.position}`}>
      <div className="arena-art-top"><span>THE RESEARCH ARENA</span><span>01 — 03</span></div>
      <div className="arena-sculpture">
        <svg className="arena-orbits" viewBox="0 0 620 500" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="arena-metal" x1="80" y1="60" x2="500" y2="480" gradientUnits="userSpaceOnUse"><stop stopColor="#ffda75" /><stop offset=".32" stopColor="#aa8434" /><stop offset=".58" stopColor="#208d7c" /><stop offset="1" stopColor="#73f6d7" /></linearGradient>
            <radialGradient id="arena-floor"><stop stopColor="#14745b" stopOpacity=".45" /><stop offset="1" stopColor="#080909" stopOpacity="0" /></radialGradient>
          </defs>
          <ellipse cx="310" cy="290" rx="285" ry="185" fill="url(#arena-floor)" />
          <g transform="rotate(-26 310 260)">
            {[0, 1, 2, 3, 4, 5, 6].map((ring) => <ellipse key={ring} cx="310" cy={260 + ring * 6} rx={265 - ring * 12} ry={175 - ring * 10} stroke="url(#arena-metal)" strokeOpacity={ring === 0 ? 1 : .3 + ring * .045} strokeWidth={ring === 0 ? 1.8 : 1} />)}
            <ellipse cx="310" cy="260" rx="278" ry="188" stroke="#36554e" strokeDasharray="1 11" />
            <ellipse cx="310" cy="260" rx="265" ry="175" pathLength="100" strokeDasharray="20 80" stroke="#61f4d0" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse className="arena-orbit-accent" cx="310" cy="260" rx="265" ry="175" pathLength="100" strokeDasharray="22 78" stroke="#ffda75" strokeWidth="3" strokeLinecap="round" />
          </g>
          <path d="M68 145h91l31 29M463 116h79v47M450 380l30 30h69" stroke="#497067" strokeWidth="1" />
          <circle cx="190" cy="174" r="4" fill="#67e8cb" /><circle cx="463" cy="116" r="4" fill="#67e8cb" /><circle cx="450" cy="380" r="4" fill="#d6b976" />
          <path d="M310 56v18M301 65h18M89 376v12M83 382h12M546 282v12M540 288h12" stroke="#43605a" />
        </svg>
        <span className="arena-coordinate arena-coordinate--line">01 / LINE</span>
        <span className="arena-coordinate arena-coordinate--form">02 / FORM</span>
        <span className="arena-coordinate arena-coordinate--matchup">03 / MATCHUP</span>
        <div className="arena-center" aria-live="polite">
          <span className="arena-center-note">{angle.note}</span>
          <strong key={angle.value}>{angle.value}</strong>
          <span className="arena-center-unit">{angle.unit}</span>
          <span className="arena-center-rule" />
          <span className="arena-center-caption">ONE PROP. EVERY ANGLE.</span>
        </div>
      </div>
      <div className="arena-angle-picker" role="group" aria-label="Explore research angles">
        {angles.map((item, index) => <button type="button" key={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.label}</button>)}
      </div>
      <div className="arena-angle-description" aria-live="polite"><strong>{angle.title}</strong><p>{angle.copy}</p></div>
      <p className="arena-illustration-note">Illustrative research example · No live data</p>
    </div>
  )
}
