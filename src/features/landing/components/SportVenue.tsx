import { useId } from 'react'

export const sportVenues: Record<string, { type: string; label: string }> = {
  nba: { type: 'basketball', label: 'On the hardwood' },
  wnba: { type: 'basketball', label: 'On the hardwood' },
  ncaab: { type: 'basketball', label: 'On the hardwood' },
  nfl: { type: 'football', label: 'Between the end zones' },
  ncaaf: { type: 'football', label: 'Between the end zones' },
  mlb: { type: 'baseball', label: 'Around the diamond' },
  nhl: { type: 'hockey', label: 'On the ice' },
  soccer: { type: 'soccer', label: 'Across the pitch' },
  tennis: { type: 'tennis', label: 'Inside the lines' },
  lol: { type: 'moba', label: 'Through the lanes' },
  cs2: { type: 'tactical', label: 'Every angle covered' },
  valorant: { type: 'valorant', label: 'Beyond the next corner' },
}

/** Original decorative environments, not live positions or official game maps. */
export function SportVenue({ type }: { type: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="arena-venue-art" viewBox="0 0 640 400" fill="none" aria-hidden="true">
      <defs>
        <pattern id={`${id}-wood`} width="80" height="22" patternUnits="userSpaceOnUse"><rect width="80" height="22" fill="#b87937" /><path d="M0 21h80M40 0v21" stroke="#efc580" strokeOpacity=".25" /><path d="M0 8h35M45 15h32" stroke="#77491c" strokeOpacity=".15" /></pattern>
        <pattern id={`${id}-grass`} width="80" height="400" patternUnits="userSpaceOnUse"><rect width="80" height="400" fill="#226947" /><rect width="40" height="400" fill="#2b7851" /></pattern>
        <linearGradient id={`${id}-ice`} x1="50" y1="30" x2="580" y2="360" gradientUnits="userSpaceOnUse"><stop stopColor="#e1f6fc" /><stop offset="1" stopColor="#79adc7" /></linearGradient>
        <linearGradient id={`${id}-map`} x1="0" y1="0" x2="640" y2="400" gradientUnits="userSpaceOnUse"><stop stopColor={type === 'valorant' ? '#33346b' : '#6d5636'} /><stop offset="1" stopColor={type === 'valorant' ? '#18263e' : '#342e25'} /></linearGradient>
        <filter id={`${id}-shadow`} x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="15" floodOpacity=".45" /></filter>
      </defs>
      <g filter={`url(#${id}-shadow)`}>
        {type === 'basketball' && <>
          <rect x="35" y="35" width="570" height="330" rx="8" fill="#704629" />
          <rect x="52" y="52" width="536" height="296" fill={`url(#${id}-wood)`} stroke="#ffe4b5" strokeWidth="2" />
          <path d="M320 52v296" stroke="#fff0cf" strokeWidth="2" /><circle cx="320" cy="200" r="48" stroke="#fff0cf" strokeWidth="2" />
          <g stroke="#fff0cf" strokeWidth="2"><path d="M52 133h98v134H52M588 133h-98v134h98" fill="#563f34" fillOpacity=".7" /><circle cx="150" cy="200" r="42" /><circle cx="490" cy="200" r="42" /><path d="M52 78h34a140 140 0 0 1 0 244H52M588 78h-34a140 140 0 0 0 0 244h34" /><path d="M77 181v38M563 181v38" strokeWidth="4" /></g>
          <circle cx="87" cy="200" r="8" stroke="#ffdcc0" strokeWidth="2" /><circle cx="553" cy="200" r="8" stroke="#ffdcc0" strokeWidth="2" />
        </>}
        {type === 'football' && <>
          <rect x="30" y="35" width="580" height="330" rx="8" fill="#173f30" />
          <rect x="48" y="55" width="544" height="290" fill={`url(#${id}-grass)`} stroke="#deeee0" strokeWidth="2" />
          <path d="M48 55h45v290H48zM547 55h45v290h-45z" fill="#12392e" /><path d="M93 55v290M547 55v290" stroke="#deeee0" strokeWidth="2" />
          {Array.from({ length: 9 }, (_, i) => <g key={i}><path d={`M${138.4 + i * 45.4} 55v290`} stroke="#d8ecda" strokeOpacity=".7" /><text x={138.4 + i * 45.4} y="95" fill="#eff9e9" fontSize="14" textAnchor="middle" fontFamily="monospace">{i < 5 ? (i + 1) * 10 : (9 - i) * 10}</text><text x={138.4 + i * 45.4} y="320" fill="#eff9e9" fontSize="14" textAnchor="middle" fontFamily="monospace">{i < 5 ? (i + 1) * 10 : (9 - i) * 10}</text></g>)}
          {Array.from({ length: 49 }, (_, i) => <path key={i} d={`M${102 + i * 9.08} 165v9m0 52v9`} stroke="#eff9e9" strokeOpacity=".6" />)}
          <path d="M65 167v66m-9-66h18m-18 66h18M575 167v66m-9-66h18m-18 66h18" stroke="#edc76b" strokeWidth="3" />
        </>}
        {type === 'soccer' && <>
          <rect x="30" y="35" width="580" height="330" rx="8" fill="#174e35" />
          <rect x="50" y="55" width="540" height="290" fill={`url(#${id}-grass)`} stroke="#eef8d8" strokeWidth="2" />
          <g stroke="#eef8d8" strokeWidth="2"><path d="M320 55v290M50 110h85v180H50M590 110h-85v180h85M50 157h32v86H50M590 157h-32v86h32" /><circle cx="320" cy="200" r="48" /><path d="M135 166a42 42 0 0 1 0 68M505 166a42 42 0 0 0 0 68M50 175H36v50h14M590 175h14v50h-14" /></g>
          <g fill="#eef8d8"><circle cx="320" cy="200" r="3" /><circle cx="108" cy="200" r="3" /><circle cx="532" cy="200" r="3" /></g>
        </>}
        {type === 'hockey' && <>
          <rect x="30" y="35" width="580" height="330" rx="115" fill="#263e58" />
          <rect x="45" y="50" width="550" height="300" rx="100" fill={`url(#${id}-ice)`} stroke="#f7fbff" strokeWidth="3" />
          <path d="M320 50v300" stroke="#b74760" strokeWidth="3" strokeDasharray="8 5" /><path d="M218 50v300M422 50v300" stroke="#4479a7" strokeWidth="4" />
          <circle cx="320" cy="200" r="46" stroke="#547aa4" strokeWidth="2" />
          {[145, 495].map(x => <g key={x} stroke="#b65b6c" strokeWidth="2"><circle cx={x} cy="123" r="32" /><circle cx={x} cy="277" r="32" /><circle cx={x} cy="123" r="3" fill="#b65b6c" /><circle cx={x} cy="277" r="3" fill="#b65b6c" /></g>)}
          <path d="M96 65v270M544 65v270" stroke="#b74760" strokeWidth="2" /><path d="M96 175a25 25 0 0 1 0 50M544 175a25 25 0 0 0 0 50" fill="#78c5dc" stroke="#b74760" /><path d="M96 183H81v34h15M544 183h15v34h-15" stroke="#a13e54" strokeWidth="3" />
        </>}
        {type === 'tennis' && <>
          <rect x="35" y="35" width="570" height="330" rx="8" fill="#33526a" />
          <rect x="92" y="72" width="456" height="256" fill="#346b9b" stroke="#f4f7ed" strokeWidth="2" />
          <g stroke="#f4f7ed" strokeWidth="2"><path d="M92 105h456M92 295h456M208 105v190M432 105v190M208 200h224" /></g>
          <path d="M320 58v284" stroke="#112a3b" strokeWidth="8" /><path d="M320 58v284" stroke="#f8f9f3" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="453" cy="256" r="5" fill="#d8ed78" />
        </>}
        {type === 'baseball' && <>
          <path d="M320 363 67 136Q320-65 573 136Z" fill="#246344" stroke="#76a76d" strokeWidth="3" />
          <path d="M320 335 100 135M320 335 540 135" stroke="#e8ebc7" strokeWidth="2" />
          <path d="M320 335 210 225Q207 128 320 126Q433 128 430 225Z" fill="#b78051" />
          <path d="m320 165 85 85-85 85-85-85Z" fill="#377d4d" />
          <path d="m320 165 85 85-85 85-85-85Z" stroke="#eadcc0" strokeWidth="2" />
          <circle cx="320" cy="249" r="17" fill="#c29469" /><path d="M313 249h14" stroke="#fff3df" strokeWidth="3" />
          {[[320,165],[405,250],[235,250]].map(([x,y]) => <rect key={`${x}-${y}`} x={x-5} y={y-5} width="10" height="10" transform={`rotate(45 ${x} ${y})`} fill="#fff3df" />)}
          <path d="M313 330h14v7l-7 6-7-6Z" fill="#fff3df" />
          <path d="M132 129Q320 2 508 129" stroke="#3b8355" strokeWidth="24" strokeOpacity=".65" />
        </>}
        {type === 'moba' && <>
          <rect x="66" y="30" width="508" height="340" rx="12" fill="#183b35" stroke="#366e55" strokeWidth="2" />
          <path d="M95 327V65h450M95 327h450V65M95 327 545 65" stroke="#82a76b" strokeWidth="18" strokeLinejoin="round" />
          <path d="M155 44Q375 125 285 210T500 360" stroke="#368aaa" strokeWidth="22" /><path d="M155 44Q375 125 285 210T500 360" stroke="#66c8ce" strokeWidth="3" strokeOpacity=".55" />
          {[[166,160],[195,246],[415,145],[445,254],[350,95],[288,308]].map(([x,y]) => <path key={`${x}-${y}`} d={`m${x} ${y-23} 24 42h-48Z`} fill="#245744" stroke="#497a56" />)}
          <path d="m95 297 30 30-30 30-30-30Z" fill="#5ddcdd" /><path d="m545 35 30 30-30 30-30-30Z" fill="#ed8095" />
          {[[95,155],[95,242],[225,327],[422,327],[235,65],[423,65],[545,161],[545,255]].map(([x,y], i) => <circle key={`${x}-${y}`} cx={x} cy={y} r="7" fill={i < 4 ? '#70d9dd' : '#ed91a2'} stroke="#d9ebd2" strokeWidth="2" />)}
        </>}
        {(type === 'tactical' || type === 'valorant') && <>
          <rect x="45" y="35" width="550" height="330" rx="10" fill={`url(#${id}-map)`} stroke={type === 'valorant' ? '#7272b5' : '#b89565'} />
          <path d="M110 305V85h165v87h93V85h166v220H368v-74h-93v74Z" stroke={type === 'valorant' ? '#828dd5' : '#c3ac80'} strokeWidth="30" strokeLinejoin="round" />
          <g fill={type === 'valorant' ? '#262a50' : '#493e2e'} stroke={type === 'valorant' ? '#a3a7db' : '#d4bb89'} strokeWidth="2"><path d="M145 117h84v91h-84ZM406 119h91v88h-91ZM152 248h77v29h-77ZM409 248h78v28h-78Z" /><path d="M293 73h57v64h-57ZM293 268h57v64h-57Z" /></g>
          <circle cx="187" cy="160" r="25" fill={type === 'valorant' ? '#db6d9b' : '#dfa953'} fillOpacity=".5" /><circle cx="451" cy="160" r="25" fill="#65bfb7" fillOpacity=".5" />
          <text x="187" y="166" textAnchor="middle" fill="#fff0cb" fontSize="19" fontFamily="monospace">A</text><text x="451" y="166" textAnchor="middle" fill="#b6fff0" fontSize="19" fontFamily="monospace">B</text>
          <path d={type === 'valorant' ? 'M271 212 320 171l49 41-49 43Z' : 'M271 194h98v22h-98Z'} fill={type === 'valorant' ? '#a77be1' : '#d5bf8d'} fillOpacity=".45" />
          <circle cx="109" cy="304" r="6" fill="#86ddd0" /><circle cx="533" cy="304" r="6" fill="#ed9e86" />
        </>}
      </g>
    </svg>
  )
}
