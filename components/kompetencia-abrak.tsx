/**
 * A kompetenciaszintek együttműködési képlete ábrán.
 *
 * A négy szint közötti különbség nem a tevékenység nehézsége, hanem az, hogy ki
 * indikálja és milyen orvosi együttműködés mellett történik. Ezt egy mondatban
 * nehéz megjegyezni, ábrán viszont egy pillantás.
 */

interface FlowProps { color: string }

const R = 15          // a szereplőt jelölő kör sugara
const cy = 30

/** Egy szereplő: kitöltött kör az APN-nek, körvonalas a többinek. */
function Actor({ x, label, color, filled = false }: {
  x: number; label: string; color: string; filled?: boolean
}) {
  return (
    <g>
      <circle cx={x} cy={cy} r={R} fill={filled ? color : 'transparent'}
        stroke={color} strokeWidth="1.6" />
      {/* Egyszerű alak: fej és váll */}
      <circle cx={x} cy={cy - 4} r="4.2" fill={filled ? '#fff' : color} />
      <path d={`M${x - 7} ${cy + 9}a7 7 0 0 1 14 0`} fill={filled ? '#fff' : color} />
      <text x={x} y={cy + R + 12} textAnchor="middle" className="ka-lbl" fill={color}>
        {label}
      </text>
    </g>
  )
}

function Arrow({ x1, x2, color, dashed = false, both = false }: {
  x1: number; x2: number; color: string; dashed?: boolean; both?: boolean
}) {
  const id = `ah-${Math.round(x1)}-${Math.round(x2)}-${color.replace('#', '')}`
  return (
    <>
      <defs>
        <marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0l7 3.5L0 7z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={cy} x2={x2} y2={cy} stroke={color} strokeWidth="1.6"
        strokeDasharray={dashed ? '4 3' : undefined}
        markerEnd={`url(#${id})`} markerStart={both ? `url(#${id})` : undefined} />
    </>
  )
}

/** I. szint — az APN saját indikáció alapján, közvetlenül. */
export function FlowSolo({ color }: FlowProps) {
  return (
    <svg viewBox="0 0 200 58" className="ka-flow" role="img" aria-label="APN közvetlenül a beteghez">
      <Actor x={32} label="APN" color={color} filled />
      <Arrow x1={52} x2={116} color={color} />
      <Actor x={136} label="Beteg" color="var(--muted)" />
    </svg>
  )
}

/** II. szint — a döntés az APN-é, a szupervizor utólag kap tájékoztatást. */
export function FlowSupervised({ color }: FlowProps) {
  return (
    <svg viewBox="0 0 250 96" className="ka-flow" role="img"
      aria-label="APN a beteghez, mellette szakorvosi szupervízió utólagos tájékoztatással">
      <g transform="translate(0,30)">
        <Actor x={32} label="APN" color={color} filled />
        <Arrow x1={52} x2={116} color={color} />
        <Actor x={136} label="Beteg" color="var(--muted)" />
      </g>
      {/* A szaggatott vonal a szupervízió felé: utólagos, nem folyamatos. */}
      <path d="M32 28V16h150" stroke={color} strokeWidth="1.4" strokeDasharray="4 3" fill="none" />
      <text x="188" y="20" className="ka-side" fill={color}>szakorvosi</text>
      <text x="188" y="31" className="ka-side" fill={color}>szupervízió</text>
      <text x="32" y="10" textAnchor="middle" className="ka-side" fill="var(--muted)">utólag</text>
    </svg>
  )
}

/** III. szint — az orvos indikál, utána az APN önállóan végzi. */
export function FlowIndication({ color }: FlowProps) {
  return (
    <svg viewBox="0 0 260 58" className="ka-flow" role="img"
      aria-label="Orvosi indikáció, majd önálló APN-végrehajtás">
      <Actor x={30} label="Orvos" color={color} />
      <Arrow x1={50} x2={78} color={color} />
      <rect x={80} y={cy - 13} width="86" height="26" rx="7"
        fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.2" />
      <text x={123} y={cy - 1} textAnchor="middle" className="ka-box" fill={color}>indikáció vagy</text>
      <text x={123} y={cy + 9} textAnchor="middle" className="ka-box" fill={color}>egyeztetés</text>
      <Arrow x1={168} x2={196} color={color} />
      <Actor x={216} label="APN önállóan" color={color} filled />
    </svg>
  )
}

/** IV. szint — az orvos személyesen irányít, jelen van vagy közreműködik. */
export function FlowDirect({ color }: FlowProps) {
  return (
    <svg viewBox="0 0 260 74" className="ka-flow" role="img"
      aria-label="Orvos és APN együtt a betegnél, személyes irányítás mellett">
      <Actor x={32} label="Orvos" color={color} />
      <Arrow x1={52} x2={106} color={color} both />
      <Actor x={126} label="APN" color={color} filled />
      <Arrow x1={146} x2={200} color={color} both />
      <Actor x={220} label="Beteg" color="var(--muted)" />
      <path d="M32 62h188" stroke={color} strokeWidth="1.3" strokeDasharray="4 3" fill="none" />
      <text x={126} y={72} textAnchor="middle" className="ka-side" fill={color}>
        személyes irányítás, jelenlét vagy közreműködés
      </text>
    </svg>
  )
}

export function LevelFlow({ level, color }: { level: 1 | 2 | 3 | 4; color: string }) {
  if (level === 1) return <FlowSolo color={color} />
  if (level === 2) return <FlowSupervised color={color} />
  if (level === 3) return <FlowIndication color={color} />
  return <FlowDirect color={color} />
}

/* ─────────── Az APN szerepe a betegellátásban ─────────── */

const ROLES = [
  { icon: '🩺', label: 'Betegvizsgálat' },
  { icon: '🔬', label: 'Diagnosztika' },
  { icon: '💊', label: 'Terápia' },
  { icon: '🤲', label: 'Szakápolás' },
  { icon: '💬', label: 'Betegedukáció' },
  { icon: '🧭', label: 'Betegút' },
  { icon: '👥', label: 'Teammunka' },
]

/** Hét terület, ahol az APN tudása megjelenik a betegellátásban. */
export function RoleStrip() {
  return (
    <div className="ka-roles">
      {ROLES.map((r) => (
        <div className="ka-role" key={r.label}>
          <span aria-hidden="true">{r.icon}</span>
          <b>{r.label}</b>
        </div>
      ))}
    </div>
  )
}
