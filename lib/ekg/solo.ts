// Önálló EKG-elemzés: strukturált válaszmezők és összehasonlítás a referenciával.
//
// ELV: a helyes választ nem külön adatként tároljuk, hanem az eset PARAMÉTEREIBŐL
// származtatjuk (lib/ekg/render.ts EcgParams). Így nem lehet eltérés a megrajzolt
// görbe és az elvárt válasz között, és egy új eset felvételekor nincs külön
// „megoldókulcs”, amit karban kellene tartani.
//
// A szabad szöveges összegzést nem pontozzuk — azt egymás mellé tesszük a
// referenciával, hogy a felhasználó maga hasonlítsa össze.

import { qtc, type EcgParams, type Lead } from './render'

export type Verdict = 'ok' | 'partial' | 'off' | 'skipped'

export const VERDICT_LABEL: Record<Verdict, string> = {
  ok: '✓ helyes',
  partial: '~ részben helyes',
  off: '✕ eltérő',
  skipped: '— nem töltötted ki',
}

/* ─────────── Elvezetés-területek ─────────── */

export type Region = 'inferior' | 'anteroseptalis' | 'lateralis'

export const REGIONS: { id: Region; label: string; leads: Lead[] }[] = [
  { id: 'inferior', label: 'Inferior (II, III, aVF)', leads: ['II', 'III', 'aVF'] },
  { id: 'anteroseptalis', label: 'Anteroseptalis (V1–V4)', leads: ['V1', 'V2', 'V3', 'V4'] },
  { id: 'lateralis', label: 'Lateralis (I, aVL, V5–V6)', leads: ['I', 'aVL', 'V5', 'V6'] },
]

/** Egy terület akkor számít érintettnek, ha legalább két elvezetésében eléri a küszöböt. */
function regionsWithSt(params: EcgParams, dir: 'up' | 'down', thresholdMm = 1): Region[] {
  const out: Region[] = []
  for (const r of REGIONS) {
    const hits = r.leads.filter((l) => {
      const v = params.st?.[l] ?? 0
      return dir === 'up' ? v >= thresholdMm : v <= -thresholdMm
    })
    if (hits.length >= 2) out.push(r.id)
  }
  return out
}

function regionsWithT(params: EcgParams, shape: 'inverted' | 'peaked' | 'flat'): Region[] {
  const out: Region[] = []
  for (const r of REGIONS) {
    const hits = r.leads.filter((l) => params.t?.[l] === shape)
    if (hits.length >= 2) out.push(r.id)
  }
  return out
}

/* ─────────── A felhasználó válaszai ─────────── */

export interface SoloAnswer {
  rhythm: string
  rate: string            // szám szövegként
  axis: string
  pr: string
  qrs: string
  qtc: string
  stDir: string           // 'none' | 'up' | 'down' | 'both'
  stRegions: Region[]
  tShape: string          // 'none' | 'inverted' | 'peaked' | 'flat'
  tRegions: Region[]
  summary: string
}

export const EMPTY_ANSWER: SoloAnswer = {
  rhythm: '', rate: '', axis: '', pr: '', qrs: '', qtc: '',
  stDir: '', stRegions: [], tShape: '', tRegions: [], summary: '',
}

/* ─────────── Választható értékek ─────────── */

export const RHYTHM_OPTIONS = [
  { id: 'sinus', label: 'Sinus ritmus' },
  { id: 'sinus-irregular', label: 'Szabálytalan sinus ritmus' },
  { id: 'afib', label: 'Pitvarfibrilláció' },
  { id: 'flutter', label: 'Pitvari flutter' },
  { id: 'vt', label: 'Kamrai tachycardia' },
  { id: 'junctional', label: 'Junkcionális vagy kamrai pótritmus' },
  { id: 'paced', label: 'Pacemaker ritmus' },
]

export const AXIS_OPTIONS = [
  { id: 'normal', label: 'Normál' }, { id: 'left', label: 'Bal tengelyeltérés' },
  { id: 'right', label: 'Jobb tengelyeltérés' }, { id: 'extreme', label: 'Extrém tengelyeltérés' },
]

export const PR_OPTIONS = [
  { id: 'short', label: 'Rövid (120 ms alatt)' },
  { id: 'normal', label: 'Élettani (120–200 ms)' },
  { id: 'long', label: 'Megnyúlt (200 ms felett)' },
  { id: 'na', label: 'Nem értelmezhető' },
]

export const QRS_OPTIONS = [
  { id: 'narrow', label: 'Keskeny (120 ms alatt)' },
  { id: 'wide', label: 'Széles (120 ms vagy több)' },
]

export const QTC_OPTIONS = [
  { id: 'short', label: 'Rövid (350 ms alatt)' },
  { id: 'normal', label: 'Élettani (kb. 350–460 ms)' },
  { id: 'long', label: 'Megnyúlt (460 ms felett)' },
]

export const ST_DIR_OPTIONS = [
  { id: 'none', label: 'Nincs jelentős ST-eltérés' },
  { id: 'up', label: 'ST-eleváció' },
  { id: 'down', label: 'ST-depresszió' },
  { id: 'both', label: 'Eleváció és reciprok depresszió is' },
]

export const T_OPTIONS = [
  { id: 'none', label: 'Nincs jelentős T-eltérés' },
  { id: 'inverted', label: 'T-inverzió' },
  { id: 'peaked', label: 'Magas, csúcsos T' },
  { id: 'flat', label: 'Lapos T' },
]

/* ─────────── Helyes válasz származtatása ─────────── */

export interface Truth {
  rhythm: string
  rate: number
  axis: string
  pr: string
  prMs: number
  qrs: string
  qrsMs: number
  qtc: string
  qtcMs: number
  stDir: string
  stRegions: Region[]
  tShape: string
  tRegions: Region[]
}

export function deriveTruth(p: EcgParams): Truth {
  const up = regionsWithSt(p, 'up')
  const down = regionsWithSt(p, 'down')
  const stDir = up.length && down.length ? 'both' : up.length ? 'up' : down.length ? 'down' : 'none'

  // T-eltérés: a leggyakoribb kóros alakot vesszük vezetőnek.
  let tShape = 'none'
  let tRegions: Region[] = []
  for (const shape of ['inverted', 'peaked', 'flat'] as const) {
    const r = regionsWithT(p, shape)
    if (r.length > tRegions.length) { tShape = shape; tRegions = r }
  }

  const qtcMs = qtc(p.qtMs, p.rate)
  const prMs = p.prMs

  return {
    rhythm: p.rhythm,
    rate: p.rate,
    axis: p.axis,
    pr: prMs === 0 ? 'na' : prMs < 120 ? 'short' : prMs > 200 ? 'long' : 'normal',
    prMs,
    qrs: p.qrsMs >= 120 ? 'wide' : 'narrow',
    qrsMs: p.qrsMs,
    qtc: qtcMs < 350 ? 'short' : qtcMs > 460 ? 'long' : 'normal',
    qtcMs,
    stDir,
    stRegions: [...new Set([...up, ...down])],
    tShape,
    tRegions,
  }
}

/* ─────────── Összehasonlítás ─────────── */

/** Ritmusoknál a közeli válaszok részben helyesnek számítanak. */
const RHYTHM_NEAR: Record<string, string[]> = {
  sinus: ['sinus-irregular'],
  'sinus-irregular': ['sinus', 'afib'],
  afib: ['sinus-irregular', 'flutter'],
  flutter: ['afib'],
  vt: ['junctional'],
  junctional: ['vt', 'paced'],
  paced: ['junctional'],
}

function regionVerdict(picked: Region[], truth: Region[]): Verdict {
  if (truth.length === 0 && picked.length === 0) return 'ok'
  const hit = picked.filter((r) => truth.includes(r)).length
  if (hit === truth.length && picked.length === truth.length) return 'ok'
  if (hit > 0) return 'partial'
  return 'off'
}

export interface CompareRow {
  key: string
  label: string
  mine: string
  reference: string
  verdict: Verdict
  note?: string
}

const regionLabel = (rs: Region[]) =>
  rs.length ? rs.map((r) => REGIONS.find((x) => x.id === r)!.label.split(' (')[0]).join(', ') : 'nincs'

const optLabel = (opts: { id: string; label: string }[], id: string) =>
  opts.find((o) => o.id === id)?.label ?? (id || '—')

export function compareSolo(answer: SoloAnswer, p: EcgParams): CompareRow[] {
  const t = deriveTruth(p)
  const rows: CompareRow[] = []

  const simple = (
    key: string, label: string, mine: string, ref: string,
    opts: { id: string; label: string }[], near?: string[],
  ) => {
    const verdict: Verdict = !mine ? 'skipped' : mine === ref ? 'ok' : (near ?? []).includes(mine) ? 'partial' : 'off'
    rows.push({ key, label, mine: optLabel(opts, mine), reference: optLabel(opts, ref), verdict })
  }

  simple('rhythm', 'Ritmus', answer.rhythm, t.rhythm, RHYTHM_OPTIONS, RHYTHM_NEAR[t.rhythm])

  // Frekvencia: tűréssel, mert a leolvasás közelítő
  const rateNum = parseInt(answer.rate.replace(/\D/g, ''), 10)
  const rateVerdict: Verdict = !answer.rate || isNaN(rateNum)
    ? 'skipped'
    : Math.abs(rateNum - t.rate) <= Math.max(5, t.rate * 0.1) ? 'ok'
      : Math.abs(rateNum - t.rate) <= Math.max(12, t.rate * 0.2) ? 'partial' : 'off'
  rows.push({
    key: 'rate', label: 'Frekvencia',
    mine: answer.rate ? `${answer.rate}/perc` : '—', reference: `kb. ${t.rate}/perc`,
    verdict: rateVerdict,
    note: 'A leolvasás közelítő, ezért a referenciától kis eltérés is helyesnek számít.',
  })

  simple('axis', 'Tengely', answer.axis, t.axis, AXIS_OPTIONS)
  simple('pr', 'PR-intervallum', answer.pr, t.pr, PR_OPTIONS)
  rows[rows.length - 1].reference += t.prMs ? ` — kb. ${t.prMs} ms` : ''

  simple('qrs', 'QRS-szélesség', answer.qrs, t.qrs, QRS_OPTIONS)
  rows[rows.length - 1].reference += ` — kb. ${t.qrsMs} ms`

  simple('qtc', 'QT / QTc', answer.qtc, t.qtc, QTC_OPTIONS)
  const qtcRow = rows[rows.length - 1]
  qtcRow.reference += ` — QTc kb. ${t.qtcMs} ms (mért QT ${p.qtMs} ms)`
  // A Bazett-képlet szélsőséges frekvencián torzít: gyors ritmusnál túl-, lassúnál
  // alulkorrigál. Ilyenkor a szomszédos kategória is elfogadható válasz, és a
  // felhasználót figyelmeztetjük a korlátra — ez maga is fontos tanulság.
  if (p.rate > 100 || p.rate < 50) {
    if (qtcRow.verdict === 'off' || qtcRow.verdict === 'partial') qtcRow.verdict = 'partial'
    if (qtcRow.verdict === 'partial' && answer.qtc) {
      const order = ['short', 'normal', 'long']
      const d = Math.abs(order.indexOf(answer.qtc) - order.indexOf(t.qtc))
      if (d <= 1) qtcRow.verdict = 'ok'
    }
    qtcRow.note = p.rate > 100
      ? 'Gyors frekvencián a Bazett-képlet túlkorrigál, ezért a számított QTc hosszabbnak látszhat a valósnál. Itt a szomszédos kategória is elfogadható válasz.'
      : 'Lassú frekvencián a Bazett-képlet alulkorrigál, ezért a számított QTc rövidebbnek látszhat a valósnál. Itt a szomszédos kategória is elfogadható válasz.'
  }

  // ST: az irány és a terület együtt dönt
  const stDirOk = answer.stDir === t.stDir
  const stRegVerdict = regionVerdict(answer.stRegions, t.stRegions)
  const stVerdict: Verdict = !answer.stDir ? 'skipped'
    : t.stDir === 'none' && answer.stDir === 'none' ? 'ok'
      : stDirOk && stRegVerdict === 'ok' ? 'ok'
        : stDirOk || stRegVerdict === 'partial' ? 'partial' : 'off'
  rows.push({
    key: 'st', label: 'ST-szakasz',
    mine: answer.stDir ? `${optLabel(ST_DIR_OPTIONS, answer.stDir)} — ${regionLabel(answer.stRegions)}` : '—',
    reference: `${optLabel(ST_DIR_OPTIONS, t.stDir)} — ${regionLabel(t.stRegions)}`,
    verdict: stVerdict,
  })

  const tShapeOk = answer.tShape === t.tShape
  const tRegVerdict = regionVerdict(answer.tRegions, t.tRegions)
  const tVerdict: Verdict = !answer.tShape ? 'skipped'
    : t.tShape === 'none' && answer.tShape === 'none' ? 'ok'
      : tShapeOk && tRegVerdict === 'ok' ? 'ok'
        : tShapeOk || tRegVerdict === 'partial' ? 'partial' : 'off'
  rows.push({
    key: 't', label: 'T-hullám',
    mine: answer.tShape ? `${optLabel(T_OPTIONS, answer.tShape)} — ${regionLabel(answer.tRegions)}` : '—',
    reference: `${optLabel(T_OPTIONS, t.tShape)} — ${regionLabel(t.tRegions)}`,
    verdict: tVerdict,
  })

  return rows
}

/** Az elemzés összesített eredménye. A kihagyott mezők nem számítanak bele. */
export function soloScore(rows: CompareRow[]): { pct: number; ok: number; partial: number; off: number; answered: number } {
  const answered = rows.filter((r) => r.verdict !== 'skipped')
  const ok = answered.filter((r) => r.verdict === 'ok').length
  const partial = answered.filter((r) => r.verdict === 'partial').length
  const off = answered.filter((r) => r.verdict === 'off').length
  const pct = answered.length ? Math.round(((ok + partial * 0.5) / answered.length) * 100) : 0
  return { pct, ok, partial, off, answered: answered.length }
}
