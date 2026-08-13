import type { LabItem } from './data'

export type LabStatus = 'normal' | 'low' | 'high' | 'crit-low' | 'crit-high' | 'unknown'

export function interpret(l: LabItem, raw: string): LabStatus {
  const n = parseFloat(String(raw).replace(',', '.'))
  if (isNaN(n)) return 'unknown'
  if (l.critLo != null && n <= l.critLo) return 'crit-low'
  if (l.critHi != null && n >= l.critHi) return 'crit-high'
  if (l.lo != null && n < l.lo) return 'low'
  if (l.hi != null && n > l.hi) return 'high'
  return 'normal'
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
