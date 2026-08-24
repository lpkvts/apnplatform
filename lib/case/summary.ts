import { ASSESS_VITALS } from '@/lib/assessment/data'
import { vitalFlag } from '@/lib/assessment/logic'
export interface CaseDoc { title: string; complaint?: string | null; background?: string | null; vitals?: Record<string, string> | null; diseaseName?: string | null; contextName?: string | null; labs: { name?: string | null; value?: string | null; unit?: string | null; status?: string | null }[]; scores: { score_name?: string | null; value?: number | null; band?: string | null }[]; ekgs: { name?: string | null; category?: string | null; note?: string | null; assessment?: string | null }[]; decision?: string | null; problems?: string[] | null; red_flags?: string[] | null }
const MISSING = '— nincs rögzítve'
const AVPU: Record<string, string> = { A: 'éber (A)', V: 'hangra (V)', P: 'fájdalomra (P)', U: 'nem reagál (U)' }
function vitalLines(v?: Record<string, string> | null): string[] {
  if (!v) return []
  const out: string[] = []
  for (const def of ASSESS_VITALS) { const val = v[def.k]; if (val) { const fl = vitalFlag(def.k, val); const tag = fl === 'red' ? ' [kritikus]' : fl === 'amber' ? ' [eltérés]' : ''; out.push(`${def.label}: ${val} ${def.unit}${tag}`) } }
  if (v.avpu) out.push(`Tudat: ${AVPU[v.avpu] ?? v.avpu}`)
  return out
}
export function buildSummary(d: CaseDoc): string {
  const L: string[] = []
  L.push(`BETEGÉRTÉKELÉS — ${d.title}`, '')
  L.push(`Fő panasz: ${d.complaint || MISSING}`); L.push(`Releváns anamnézis: ${d.background || MISSING}`)
  const dc = [d.diseaseName, d.contextName].filter(Boolean).join(' · '); L.push(`Betegség / kontextus: ${dc || MISSING}`, '')
  const vl = vitalLines(d.vitals); L.push('Vitális paraméterek:'); L.push(vl.length ? vl.map((x) => `  • ${x}`).join('\n') : `  ${MISSING}`); L.push('')
  L.push('Releváns labor:'); L.push(d.labs.length ? d.labs.map((l) => `  • ${l.name}: ${l.value ?? ''}${l.unit ? ' ' + l.unit : ''}${l.status ? ` (${l.status})` : ''}`).join('\n') : `  ${MISSING}`); L.push('')
  L.push('Score-ok:'); L.push(d.scores.length ? d.scores.map((s) => `  • ${s.score_name}: ${s.value ?? '—'}${s.band ? ` · ${s.band}` : ''}`).join('\n') : `  ${MISSING}`); L.push('')
  L.push('EKG:'); L.push(d.ekgs.length ? d.ekgs.map((e) => `  • ${e.name}${e.category ? ` (${e.category})` : ''}${e.note ? ` — ${e.note}` : ''}`).join('\n') : `  ${MISSING}`); L.push('')
  L.push(`APN problémák: ${(d.problems && d.problems.length) ? d.problems.join(', ') : MISSING}`)
  L.push(`Vörös zászlók: ${(d.red_flags && d.red_flags.length) ? d.red_flags.join(', ') : MISSING}`)
  L.push(`Döntéstámogatás: ${d.decision || MISSING}`)
  return L.join('\n')
}
export interface Sbar { s: string; b: string; a: string; r: string }
export function buildSbar(d: CaseDoc): Sbar {
  const vl = vitalLines(d.vitals); const abnormalV = vl.filter((x) => /\[/.test(x)); const abnormalL = d.labs.filter((l) => l.status && !/normál/i.test(l.status))
  const s = [`${d.title}.`, d.complaint ? `Fő panasz: ${d.complaint}.` : `Fő panasz: ${MISSING}.`, vl.length ? `Aktuális vitálisok: ${vl.join('; ')}.` : `Vitálisok: ${MISSING}.`].join(' ')
  const b = [d.background ? `Anamnézis: ${d.background}.` : `Anamnézis: ${MISSING}.`, d.diseaseName ? `Kapcsolódó betegség: ${d.diseaseName}.` : ''].filter(Boolean).join(' ')
  const aParts: string[] = []
  aParts.push(abnormalV.length ? `Eltérő vitálisok: ${abnormalV.join('; ')}.` : 'Vitálisokban rögzített eltérés nincs.')
  aParts.push(abnormalL.length ? `Kóros laborok: ${abnormalL.map((l) => `${l.name} ${l.value ?? ''}${l.unit ? ' ' + l.unit : ''} (${l.status})`).join('; ')}.` : 'Rögzített kóros labor nincs.')
  aParts.push(d.scores.length ? `Score-ok: ${d.scores.map((x) => `${x.score_name} ${x.value ?? ''}`.trim()).join('; ')}.` : 'Rögzített score nincs.')
  aParts.push(d.ekgs.length ? `EKG: ${d.ekgs.map((e) => e.name).join('; ')}.` : 'Rögzített EKG-lelet nincs.')
  const a = aParts.join(' ')
  const rParts: string[] = []
  if (d.red_flags && d.red_flags.length) rParts.push(`Vörös zászló(k): ${d.red_flags.join(', ')} — sürgős értékelés mérlegelendő.`)
  if (d.decision) rParts.push(`Rögzített döntéstámogatás: ${d.decision}`)
  if (rParts.length === 0) rParts.push('Rögzített javaslat/döntéstámogatás nincs; a következő lépések a teljes klinikai kép és a vonatkozó irányelv alapján határozandók meg.')
  rParts.push('A klinikai döntés végső felelőssége a megfelelő szakemberé.')
  return { s, b, a, r: rParts.join(' ') }
}
