import type { ReactNode } from 'react'

const P: Record<string, ReactNode> = {
  /* ── Klinikai eszközök ── */
  stethoscope: (<><path d="M5 3v6a4 4 0 0 0 8 0V3" /><path d="M9 13v2a5 5 0 0 0 10 0v-2" /><circle cx="19" cy="9" r="2.2" /></>),
  clipboard: (<><rect x="5" y="4.5" width="14" height="16" rx="2.5" /><path d="M9 4.5V3h6v1.5" /><path d="M9 10h6M9 14h4" /></>),
  calculator: (<><rect x="5" y="3.5" width="14" height="17" rx="2.5" /><path d="M8.5 7.5h7" /><path d="M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" /></>),
  droplet: (<><path d="M12 3.5c3.5 4 6 6.8 6 9.7a6 6 0 0 1-12 0c0-2.9 2.5-5.7 6-9.7Z" /></>),
  pulse: (<><path d="M3 12h4l2.5-6 4 12 2.5-6h5" /></>),
  lungs: (<><path d="M12 4v9" /><path d="M9 8c-2 1-3.5 3-3.5 6v3a2 2 0 0 0 3 1.7l2-1.2a2 2 0 0 0 1-1.7V9" /><path d="M15 8c2 1 3.5 3 3.5 6v3a2 2 0 0 1-3 1.7l-2-1.2a2 2 0 0 1-1-1.7V9" /></>),
  brain: (<><path d="M12 5.5a3 3 0 0 0-5.4 1.8A2.8 2.8 0 0 0 5 12a2.8 2.8 0 0 0 1.6 4.7A3 3 0 0 0 12 18.5Z" /><path d="M12 5.5a3 3 0 0 1 5.4 1.8A2.8 2.8 0 0 1 19 12a2.8 2.8 0 0 1-1.6 4.7A3 3 0 0 1 12 18.5Z" /></>),
  compass: (<><circle cx="12" cy="12" r="8.5" /><path d="M14.8 9.2 13.4 13.4 9.2 14.8l1.4-4.2Z" /></>),
  alert: (<><path d="M12 4.5 3.5 19.5h17Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></>),
  search2: (<><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></>),

  /* ── Oktatás ── */
  layout: (<><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><path d="M3.5 9.5h17M9 9.5v10" /></>),
  courses: (<><rect x="4" y="4.5" width="16" height="15" rx="2.5" /><path d="M8 9h8M8 12.5h8M8 16h4" /></>),
  users: (<><circle cx="9" cy="9" r="3" /><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" /><path d="M16 7.2a2.8 2.8 0 0 1 0 5.6" /><path d="M17 14.4c2 .6 3.5 2.3 3.5 4.6" /></>),
  tasks: (<><rect x="4" y="4.5" width="16" height="15" rx="2.5" /><path d="M8 10l2 2 4-4" /><path d="M8 16h8" /></>),
  chart: (<><path d="M4 20V4" /><path d="M4 20h16" /><path d="M8 20v-6M12.5 20V9M17 20v-9" /></>),
  case: (<><rect x="3.5" y="7" width="17" height="12.5" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" /></>),
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6" /></>),
  handshake: (<><path d="M8 12.5 5 15.5a2 2 0 0 0 2.8 2.8l.7-.7" /><path d="M8.5 17.6 10 19a2 2 0 0 0 2.8-2.8" /><path d="M3.5 9.5 7 6h4l2 2h4l3.5 3.5" /><path d="M12.8 16.2 16 19.4a2 2 0 0 0 2.8-2.8L14 11.8" /></>),
  play: (<><circle cx="12" cy="12" r="8.5" /><path d="M10.5 9l5 3-5 3Z" /></>),
  expand: (<><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></>),

  home: (<><path d="M3 10 12 3l9 7" /><path d="M5 9.5V20h14V9.5" /></>),
  clinic: (<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><path d="M12 8.5v7M8.5 12h7" /></>),
  flask: (<><path d="M9.5 3h5M10.5 3v5.5l-4.7 8.2A2 2 0 0 0 7.5 20h9a2 2 0 0 0 1.7-3.3L13.5 8.5V3" /><path d="M8 14h8" /></>),
  ekg: (<path d="M2 12h4l2-6 4 12 2.5-7H22" />),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>),
  assessment: (<><rect x="5" y="4.5" width="14" height="16" rx="2.5" /><path d="M9 4.5a3 3 0 0 1 6 0" /><path d="M8 13h2l1.2-2.2L13 15l1-2h2" /></>),
  score: (<><path d="M5 20V11M10 20V5M15 20v-6M20 20V8" /><path d="M3 20h18" /></>),
  copilot: (<><path d="M4 5.5h16v9H9.5L5 19v-4.5H4z" /><path d="M9 10h.01M12 10h.01M15 10h.01" /></>),
  book: (<><path d="M6 4h11a1 1 0 0 1 1 1v15H7a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1z" /><path d="M6 4v14" /></>),
  bell: (<><path d="M6 9.5a6 6 0 0 1 12 0c0 4.5 2 5.5 2 5.5H4s2-1 2-5.5z" /><path d="M10 18.5a2 2 0 0 0 4 0" /></>),
  logout: (<><path d="M9.5 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h3.5" /><path d="M15 16l4.5-4L15 8" /><path d="M19.5 12h-10" /></>),
  grad: (<><path d="M12 4 2.5 9 12 14l9.5-5L12 4z" /><path d="M6.5 11v4.2c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8V11" /></>),
  chevron: (<path d="M9 6l6 6-6 6" />),
  search: (<><circle cx="11" cy="11" r="7" /><path d="M20.5 20.5 17 17" /></>),
  star: (<path d="M12 3.5l2.7 5.47 6.05.88-4.38 4.27 1.03 6.03L12 17.77l-5.42 2.85 1.03-6.03L3.25 9.85l6.05-.88z" />),
}

export function Icon({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {P[name] ?? P.home}
    </svg>
  )
}

export function CpdRing({ total, target, size = 116 }: { total: number; target: number; size?: number }) {
  const pct = target > 0 ? Math.min(100, Math.round((total / target) * 100)) : 0
  const r = (size - 16) / 2
  const c = 2 * Math.PI * r
  const off = c * (1 - pct / 100)
  const cx = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--line)" strokeWidth="11" />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--brand)" strokeWidth="11" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off} transform={`rotate(-90 ${cx} ${cx})`} />
      <text x="50%" y="45%" textAnchor="middle" fontSize="24" fontWeight="800" fill="var(--ink)">{total}</text>
      <text x="50%" y="61%" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--brand-2)">/ {target} pont</text>
    </svg>
  )
}

/**
 * Az APN-MED jelkép: nyitott gyűrű, jobb oldalon két réssel.
 *
 * Két változatban létezik, mert a méret dönti el, mi fér el benne:
 *  - `withText` nélkül csak a gyűrű — ezt használjuk ott, ahol a név úgyis
 *    ott áll mellette (fejléc, nyitóoldal), vagy ahol kicsi a hely.
 *  - `withText` mellett a gyűrűbe kerül az APN MED felirat is. Ez körülbelül
 *    64 képpont alatt már olvashatatlan, ezért csak nagyobb méretben van értelme.
 *
 * A szín a márkaváltozóból jön, így sötét háttéren is felülírható a currentColor
 * beállításával.
 */
export function RingLogo({
  size = 26, withText = false, color = 'var(--brand)',
}: {
  size?: number
  withText?: boolean
  color?: string
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {/* Hosszú ív: a jobb felső réstől a bal oldalon át a jobb alsó résig. */}
      <path
        d="M45.8 10A26 26 0 1 0 49.4 51.3"
        stroke={color} strokeWidth="6" strokeLinecap="round"
      />
      {/* Rövid ív a jobb oldalon, a két rés között. */}
      <path
        d="M52.5 16A26 26 0 0 1 54.5 45"
        stroke={color} strokeWidth="6" strokeLinecap="round"
      />
      {withText && (
        <g fill={color}>
          <text
            x="32" y="34" textAnchor="middle"
            fontSize="15.5" fontWeight="700" letterSpacing="0.5"
            fontFamily="Inter, system-ui, sans-serif"
          >
            APN
          </text>
          <text
            x="32" y="47" textAnchor="middle"
            fontSize="11" fontWeight="600" letterSpacing="1.6"
            fontFamily="Inter, system-ui, sans-serif"
          >
            MED
          </text>
        </g>
      )}
    </svg>
  )
}
