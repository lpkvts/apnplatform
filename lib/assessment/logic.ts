import { ASSESS_VITALS, ASSESS_DOMAINS, ASSESS_PROBLEMS } from './data'

export interface AssessState {
  step: number
  domain: string | null
  complaint: string
  f: { anamnez: string; meds: string; allergy: string; physical: string; lab: string; ekg: string; next: string }
  vit: { rr: string; spo2: string; sbp: string; hr: string; temp: string }
  consc: string
  problems: number[]
}

export function assessInit(): AssessState {
  return {
    step: 0, domain: null, complaint: '',
    f: { anamnez: '', meds: '', allergy: '', physical: '', lab: '', ekg: '', next: '' },
    vit: { rr: '', spo2: '', sbp: '', hr: '', temp: '' },
    consc: 'A', problems: [],
  }
}

export function vitalFlag(k: string, val: string): '' | 'amber' | 'red' {
  const n = parseFloat(String(val ?? '').replace(',', '.'))
  if (isNaN(n)) return ''
  if (k === 'rr') return n <= 8 || n >= 25 ? 'red' : n < 9 || n > 20 ? 'amber' : ''
  if (k === 'spo2') return n <= 91 ? 'red' : n < 96 ? 'amber' : ''
  if (k === 'sbp') return n <= 90 || n >= 220 ? 'red' : n < 100 ? 'amber' : ''
  if (k === 'hr') return n <= 40 || n >= 131 ? 'red' : n < 50 || n > 110 ? 'amber' : ''
  if (k === 'temp') return n <= 35 || n >= 39.1 ? 'red' : n < 36 || n > 38 ? 'amber' : ''
  return ''
}

export function assessRisk(as: AssessState): { reds: string[]; ambers: string[] } {
  const reds: string[] = []
  const ambers: string[] = []
  ASSESS_VITALS.forEach((v) => {
    const fl = vitalFlag(v.k, (as.vit as Record<string, string>)[v.k])
    const val = (as.vit as Record<string, string>)[v.k]
    if (fl === 'red') reds.push(`${v.label} ${val} ${v.unit}`)
    else if (fl === 'amber') ambers.push(`${v.label} ${val} ${v.unit}`)
  })
  if (as.consc && as.consc !== 'A') reds.push(`Tudat: ${as.consc} (nem éber)`)
  return { reds, ambers }
}

export function assessSummary(as: AssessState): string {
  const d = ASSESS_DOMAINS.find((x) => x.id === as.domain)
  const r = assessRisk(as)
  const vit = ASSESS_VITALS.map((v) => {
    const val = (as.vit as Record<string, string>)[v.k]
    return val ? `${v.label}: ${val} ${v.unit}` : null
  }).filter(Boolean).join(' · ') || '—'
  let ds = ''
  try { ds = new Date().toLocaleString('hu-HU') } catch { ds = '' }
  const L = [
    'ÚJ BETEGÉRTÉKELÉS — APN összefoglaló', `Dátum: ${ds}`, '',
    `S – Panasz: ${d ? d.label : '—'}${as.complaint ? ` — ${as.complaint}` : ''}`,
    `B – Anamnézis: ${as.f.anamnez || '—'}`,
    `   Gyógyszerek: ${as.f.meds || '—'} | Allergia: ${as.f.allergy || '—'}`,
    `A – Vitális: ${vit} | Tudat (ACVPU): ${as.consc}`,
    `   Fizikális: ${as.f.physical || '—'}`,
    `   Labor: ${as.f.lab || '—'} | EKG: ${as.f.ekg || '—'}`,
  ]
  if (r.reds.length) L.push(`   ⚠ Kritikus eltérés: ${r.reds.join('; ')}`)
  if (r.ambers.length) L.push(`   Figyelendő: ${r.ambers.join('; ')}`)
  L.push(`R – APN problémák: ${as.problems.length ? as.problems.map((i) => ASSESS_PROBLEMS[i]).join('; ') : '—'}`)
  L.push(`   Következő lépések: ${as.f.next || '—'}`)
  L.push('', 'Megjegyzés: döntéstámogató összefoglaló, nem orvosi diagnózis.')
  return L.join('\n')
}
