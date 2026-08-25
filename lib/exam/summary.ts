import { VITAL_FIELDS, SYSTEM_EXAMS, examRedFlags } from './data'

type Any = Record<string, unknown>
const asArr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : v ? [String(v)] : [])

export function buildExamSummary(d: {
  title?: string; anamnesis?: Any; vitals?: unknown; general_exam?: Any; systems?: Record<string, Record<string, string | string[]>>; red_flags?: string[]
}): string {
  const out: string[] = []
  const a = (d.anamnesis ?? {}) as Any

  // Anamnézis
  const an: string[] = []
  if (a.complaint) an.push(`Vezető panasz: ${a.complaint}`)
  const past = asArr(a.past); if (past.length) an.push(`Korábbi betegségek: ${past.join(', ')}${a.past_other ? `, ${a.past_other}` : ''}`)
  const meds = Array.isArray(a.meds) ? (a.meds as Any[]) : []
  if (meds.length) an.push(`Gyógyszerek (${meds.length}): ${meds.map((m) => m.name).filter(Boolean).join(', ')}`)
  const mf = asArr(a.med_flags); if (mf.length) an.push(`Kiemelt gyógyszercsoport: ${mf.join(', ')}`)
  if (a.allergy_status === 'yes') an.push(`Allergia: ${a.allergy_agent ?? 'igen'}${a.allergy_reaction ? ` (${a.allergy_reaction})` : ''}`)
  else if (a.allergy_status === 'none') an.push('Allergia: nincs ismert')
  if (an.length) out.push('ANAMNÉZIS\n' + an.join('\n'))

  // Vitálisok (utolsó mérés)
  if (Array.isArray(d.vitals) && d.vitals.length) {
    const m = (d.vitals as Record<string, string>[])[d.vitals.length - 1]
    const parts: string[] = []
    if (m.bp_sys || m.bp_dia) parts.push(`RR ${m.bp_sys ?? '–'}/${m.bp_dia ?? '–'} Hgmm`)
    for (const f of VITAL_FIELDS) {
      if (['bp_sys', 'bp_dia', 'weight', 'height'].includes(f.k)) continue
      if (m[f.k]) parts.push(`${f.label.split(' ')[0]} ${m[f.k]}${f.k === 'spo2' ? '%' : ''}`)
    }
    if (m.bmi) parts.push(`BMI ${m.bmi}`)
    if (parts.length) out.push('VITÁLIS PARAMÉTEREK\n' + parts.join(' · '))
  }

  // Általános állapot
  const g = (d.general_exam ?? {}) as Any
  const ge: string[] = []
  if (g.general_state) ge.push(`Általános állapot: ${g.general_state}`)
  if (g.consciousness) ge.push(`Tudat: ${g.consciousness}${g.avpu ? ` (AVPU ${g.avpu})` : ''}`)
  const skin: string[] = []
  for (const k of ['skin_color', 'skin_temp', 'skin_moist', 'skin_turgor']) if (g[k]) skin.push(String(g[k]))
  const sf = asArr(g.skin_findings); if (sf.length) skin.push(...sf)
  if (skin.length) ge.push(`Bőr: ${skin.join(', ')}`)
  if (g.hydration) ge.push(`Hydratatio: ${g.hydration}`)
  const oed = asArr(g.oedema).filter((x) => x !== 'nincs'); if (oed.length) ge.push(`Oedema: ${oed.join(', ')}${g.oedema_severity ? ` (${g.oedema_severity})` : ''}`)
  if (ge.length) out.push('ÁLTALÁNOS FIZIKÁLIS VIZSGÁLAT\n' + ge.join('\n'))

  // Szervrendszerek
  const ss = d.systems ?? {}
  for (const sd of SYSTEM_EXAMS) {
    const grp = ss[sd.id]; if (!grp) continue
    const lines: string[] = []
    for (const gg of sd.groups) {
      const v = grp[gg.id]
      const arr = asArr(v)
      if (arr.length) lines.push(`${gg.label}: ${arr.join(', ')}`)
    }
    if (lines.length) out.push(`${sd.label.toUpperCase()} VIZSGÁLAT\n` + lines.join('\n'))
  }

  // Red flags
  const rf = examRedFlags(d)
  if (rf.total > 0) out.push('RED FLAG JELZÉSEK\n' + [...rf.vitals, ...rf.general, ...rf.systems].map((x) => `• ${x}`).join('\n'))

  out.push('Megjegyzés: strukturált vizsgálati összefoglaló, nem orvosi diagnózis.')
  return out.join('\n\n')
}

// Panaszhoz kapcsolódó, RELEVÁNS modulok (nem rendel vizsgálatot)
interface Related { labs: string[]; ekg: boolean; diseases: string[] }
const MAP: Record<string, Related> = {
  'dyspnoe': { labs: ['SpO₂', 'vérgáz', 'CRP', 'Hb', 'BNP / NT-proBNP'], ekg: true, diseases: ['COPD exacerbatio', 'Pneumonia', 'Szívelégtelenség', 'Pulmonalis embolia'] },
  'mellkasi fájdalom': { labs: ['Troponin', 'D-dimer', 'Hb'], ekg: true, diseases: ['Akut coronaria szindróma', 'Pulmonalis embolia', 'Pericarditis'] },
  'palpitáció': { labs: ['TSH', 'ionok (K, Mg)', 'Hb'], ekg: true, diseases: ['Pitvarfibrilláció', 'Supraventricularis tachycardia'] },
  'hasi': { labs: ['CRP', 'fehérvérsejt', 'lipáz', 'májenzimek', 'vizelet'], ekg: false, diseases: ['Akut has', 'Pancreatitis', 'Cholecystitis'] },
  'láz': { labs: ['CRP', 'fehérvérsejt', 'procalcitonin', 'vér-/vizeletkultúra'], ekg: false, diseases: ['Szepszis', 'Pneumonia', 'Húgyúti infekció'] },
  'tudatzavar': { labs: ['vércukor', 'ionok', 'vérgáz', 'vesefunkció'], ekg: true, diseases: ['Hypoglykaemia', 'Stroke', 'Szepszis'] },
  'szédülés': { labs: ['Hb', 'vércukor', 'ionok'], ekg: true, diseases: ['Ritmuszavar', 'Orthostaticus hypotensio'] },
}
export function relatedExamModules(d: { anamnesis?: Any; focus?: string | null; exam_type?: string | null }): Related | null {
  const hay = `${(d.anamnesis?.complaint ?? '')} ${(d.anamnesis?.complaint_cat ?? '')} ${d.focus ?? ''}`.toLowerCase()
  for (const key of Object.keys(MAP)) if (hay.includes(key)) return MAP[key]
  return null
}
