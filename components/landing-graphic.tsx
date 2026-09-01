/**
 * A bemutatkozó szakasz grafikája.
 *
 * A felületmakett helyett a platform lényegét mutatja: a kiterjesztett hatáskört.
 * Négy koncentrikus gyűrűszelet, középen az APN — kifelé haladva nő az orvosi
 * együttműködés mértéke. Ez egyszerre márkahű (a gyűrű a jelkép eleme) és
 * tartalmilag pontos: a 13/2025. BM rendelet négy tevékenységvégzési szintje.
 */

const LEVELS = [
  { r: 62, label: 'Önállóan', roman: 'I', color: '#22A878', count: 174 },
  { r: 92, label: 'Szupervízió mellett', roman: 'II', color: '#0891B2', count: 74 },
  { r: 122, label: 'Orvosi indikáció után', roman: 'III', color: '#B45309', count: 19 },
  { r: 152, label: 'Orvosi irányítás mellett', roman: 'IV', color: '#B91C1C', count: 7 },
]

const CX = 175
const CY = 180

/** Körív két szög között, a gyűrű adott sugarán. */
function arc(r: number, from: number, to: number) {
  const p = (deg: number) => {
    const a = (deg * Math.PI) / 180
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
  }
  const [x1, y1] = p(from)
  const [x2, y2] = p(to)
  const large = to - from > 180 ? 1 : 0
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`
}

export function LandingGraphic() {
  return (
    <div className="lg-wrap" aria-hidden="true">
      <svg viewBox="0 0 490 360" className="lg-svg">
        {/* A négy szint íve. Mindegyik ugyanabban a tartományban fut, de eltérő
            sugáron — a távolság a nagyobb orvosi együttműködést jelzi. */}
        {LEVELS.map((l, i) => (
          <g key={l.roman}>
            <path d={arc(l.r, -142, 62)} stroke={l.color} strokeWidth="9"
              strokeLinecap="round" fill="none" opacity={0.9 - i * 0.13} />
            {/* Rés a gyűrűn, ahogy a jelképen is. */}
            <path d={arc(l.r, 78, 110)} stroke={l.color} strokeWidth="9"
              strokeLinecap="round" fill="none" opacity={0.9 - i * 0.13} />
          </g>
        ))}

        {/* Középen az APN */}
        <circle cx={CX} cy={CY} r="40" fill="var(--brand)" />
        <text x={CX} y={CY - 2} textAnchor="middle" className="lg-mid">APN</text>
        <text x={CX} y={CY + 15} textAnchor="middle" className="lg-mid-s">MED</text>

        {/* Címkék a szintekhez, a gyűrűk jobb oldalán */}
        {LEVELS.map((l, i) => {
          const y = 44 + i * 34
          return (
            <g key={l.roman}>
              <line x1={CX + l.r - 4} y1={CY} x2={CX + l.r - 4} y2={CY}
                stroke={l.color} strokeWidth="0" />
              <circle cx={296} cy={y - 5} r="9" fill={l.color} />
              <text x={296} y={y - 1} textAnchor="middle" className="lg-rom">{l.roman}</text>
              <text x={312} y={y - 8} className="lg-lbl" fill="var(--ink)">{l.label}</text>
              <text x={312} y={y + 4} className="lg-cnt" fill="var(--muted)">
                {l.count} tevékenység
              </text>
            </g>
          )
        })}

        <text x={287} y={CY + 128} className="lg-src" fill="var(--muted)">
          13/2025. (IV. 17.) BM rendelet alapján
        </text>
      </svg>
    </div>
  )
}
