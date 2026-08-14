import type { ReactNode } from 'react'

const P: Record<string, ReactNode> = {
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
  grad: (<><path d="M12 4 2.5 9 12 14l9.5-5L12 4z" /><path d="M6.5 11v4.2c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8V11" /></>),
  chevron: (<path d="M9 6l6 6-6 6" />),
  search: (<><circle cx="11" cy="11" r="7" /><path d="M20.5 20.5 17 17" /></>),
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

export function RingLogo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="12" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round"
        strokeDasharray="56 20" transform="rotate(-90 16 16)" />
    </svg>
  )
}
