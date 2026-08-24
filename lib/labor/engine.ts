import type { LabItem } from './data'

export type LabStatus = 'normal' | 'low' | 'high' | 'crit-low' | 'crit-high' | 'unknown'

function classify(n: number, lo: number | null, hi: number | null, critLo: number | null, critHi: number | null): LabStatus {
  if (critLo != null && n <= critLo) return 'crit-low'
  if (critHi != null && n >= critHi) return 'crit-high'
  if (lo != null && n < lo) return 'low'
  if (hi != null && n > hi) return 'high'
  return 'normal'
}

export function interpret(l: LabItem, raw: string): LabStatus {
  const n = parseFloat(String(raw).replace(',', '.'))
  if (isNaN(n)) return 'unknown'
  return classify(n, l.lo, l.hi, l.critLo, l.critHi)
}

// Nem-specifikus értelmezés: külön férfi és nő eredmény (a kritikus határok közösek).
export function interpretSex(l: LabItem, raw: string): { m: LabStatus; f: LabStatus } | null {
  if (!l.sex) return null
  const n = parseFloat(String(raw).replace(',', '.'))
  if (isNaN(n)) return { m: 'unknown', f: 'unknown' }
  return {
    m: classify(n, l.sex.m.lo, l.sex.m.hi, l.critLo, l.critHi),
    f: classify(n, l.sex.f.lo, l.sex.f.hi, l.critLo, l.critHi),
  }
}

export const STATUS_LABEL: Record<LabStatus, string> = {
  normal: 'Normál tartomány',
  low: 'Alacsony',
  high: 'Magas',
  'crit-low': 'Kritikusan alacsony',
  'crit-high': 'Kritikusan magas',
  unknown: '',
}

export function statusRisk(s: LabStatus): 'low' | 'mid' | 'high' | 'crit' | '' {
  if (s === 'normal') return 'low'
  if (s === 'low' || s === 'high') return 'mid'
  if (s === 'crit-low' || s === 'crit-high') return 'crit'
  return ''
}
