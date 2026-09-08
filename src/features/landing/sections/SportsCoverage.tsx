import { useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/features/landing/hooks/Reveal'
import { sports } from '@/features/landing/data'
import { SportVenue, sportVenues } from '@/features/landing/components/SportVenue'

export function SportsCoverage() {
  const [selectedId, setSelectedId] = useState(sports[0].id)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selected = sports.find((sport) => sport.id === selectedId) ?? sports[0]
  const venue = sportVenues[selected.id]

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const last = sports.length - 1
    let next = index
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = last
    setSelectedId(sports[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="sports" className="arena-sports" data-venue={venue.type}>
      <div className="container-site">
        <Reveal className="arena-sports-heading"><div><p className="arena-kicker">Across the arena</p><h2>Different games.<br /><span>Same curiosity.</span></h2></div><p>From the hardwood to the server.<br />Explore 12 sports and esports in one familiar workspace.</p></Reveal>
        <div role="tablist" aria-label="Sport research previews" className="arena-sport-tabs">
          {sports.map((sport, index) => <button key={sport.id} ref={(node) => { tabRefs.current[index] = node }} type="button" role="tab" id={`sport-tab-${sport.id}`} aria-selected={selectedId === sport.id} aria-controls="sport-preview-panel" tabIndex={selectedId === sport.id ? 0 : -1} onClick={() => setSelectedId(sport.id)} onKeyDown={(event) => onTabKeyDown(event, index)}>{sport.abbr}</button>)}
        </div>
        <div id="sport-preview-panel" role="tabpanel" aria-labelledby={`sport-tab-${selectedId}`} className="arena-sport-detail">
          <div className="arena-venue" key={selected.id}>
            <div className="arena-venue-label"><strong>{selected.abbr}</strong><span>{venue.label}</span></div>
            <SportVenue type={venue.type} />
            <span className="arena-venue-caption">{['moba', 'tactical', 'valorant'].includes(venue.type) ? 'Illustrated map · Not an official game map' : 'Every game has its own landscape.'}</span>
          </div>
          <div className="arena-sport-copy"><p className="arena-kicker">{selected.league}</p><h3>{selected.name}</h3><p>{selected.summary}</p><div className="arena-market-list">{selected.markets.map((market) => <span key={market}>{market}</span>)}</div><Link to={`/dashboard/props?sport=${selected.abbr}`} className="arena-text-link">Explore {selected.abbr} Props <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        </div>
        <p className="arena-coverage-note">Current preview coverage. Availability at launch depends on confirmed data coverage.</p>
      </div>
    </section>
  )
}
