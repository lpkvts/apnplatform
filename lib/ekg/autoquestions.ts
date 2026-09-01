import {
  deriveTruth, RHYTHM_OPTIONS, AXIS_OPTIONS, PR_OPTIONS, QRS_OPTIONS, QTC_OPTIONS,
  ST_DIR_OPTIONS, T_OPTIONS, REGIONS,
} from './solo'
import type { AnalysisQuestion, StepId } from './analysis'
import type { EcgParams } from './render'

/**
 * Kérdés előállítása az eset paramétereiből.
 *
 * A vezetett elemzésben nem minden esethez van kézzel megírt kérdés minden
 * lépéshez. Ahol nincs, ott korábban a referenciaszöveg jelent meg — vagyis a
 * rendszer kimondta a választ, mielőtt a felhasználó gondolkodhatott volna
 * rajta. Ez különösen a tengelyállásnál volt zavaró.
 *
 * Ezek a kérdések a görbe paramétereiből származnak, ugyanabból a forrásból,
 * amelyből maga a görbe rajzolódik — így nem keletkezhet eltérés a kép és a
 * helyes válasz között.
 */

/** Négy frekvencia-tartomány; a helyes az, amelyikbe a tényleges érték esik. */
const RATE_BANDS = [
  { id: 'r1', label: '60/perc alatt (bradycardia)', test: (r: number) => r < 60 },
  { id: 'r2', label: '60–100/perc között', test: (r: number) => r >= 60 && r <= 100 },
  { id: 'r3', label: '100–150/perc között', test: (r: number) => r > 100 && r <= 150 },
  { id: 'r4', label: '150/perc felett', test: (r: number) => r > 150 },
]

export function autoQuestion(step: StepId, p: EcgParams): AnalysisQuestion | null {
  const t = deriveTruth(p)
  const opts = (list: { id: string; label: string }[]) => list.map((o) => ({ id: o.id, label: o.label }))

  switch (step) {
    case 'tengely':
      return {
        id: `auto-${step}`,
        prompt: 'Milyen a frontális tengelyállás?',
        options: opts(AXIS_OPTIONS),
        correct: [t.axis],
        explain: `Az I. és az aVF elvezetés nettó iránya együtt adja meg a tengelyt. Itt: ${
          AXIS_OPTIONS.find((o) => o.id === t.axis)?.label.toLowerCase() ?? t.axis}.`,
        highlight: 'qrs',
      }

    case 'frekvencia': {
      const band = RATE_BANDS.find((b) => b.test(t.rate)) ?? RATE_BANDS[1]
      return {
        id: `auto-${step}`,
        prompt: 'Milyen tartományba esik a kamrai frekvencia?',
        options: RATE_BANDS.map((b) => ({ id: b.id, label: b.label })),
        correct: [band.id],
        explain: `A kamrai frekvencia kb. ${t.rate}/perc.`,
        highlight: 'rr',
      }
    }

    case 'qrs':
      return {
        id: `auto-${step}`,
        prompt: 'Milyen széles a QRS-komplexus?',
        options: opts(QRS_OPTIONS),
        correct: [t.qrs],
        explain: `A QRS kb. ${t.qrsMs} ms. A 120 ms a határ: efölött széles, ami kamrai eredetre vagy ingervezetési zavarra utal.`,
        highlight: 'qrs',
      }

    case 'pr':
      return {
        id: `auto-${step}`,
        prompt: 'Hogyan értékeled a PR-intervallumot?',
        options: opts(PR_OPTIONS),
        correct: [t.pr],
        explain: t.prMs > 0
          ? `A PR kb. ${t.prMs} ms. Élettani tartomány: 120–200 ms.`
          : 'Itt nincs értelmezhető PR-intervallum, mert nincs állandó kapcsolat a pitvari és a kamrai működés között.',
        highlight: 'pr',
      }

    case 'qt':
      return {
        id: `auto-${step}`,
        prompt: 'Hogyan értékeled a QT-időt a frekvenciára korrigálva?',
        options: opts(QTC_OPTIONS),
        correct: [t.qtc],
        explain: `A mért QT ${p.qtMs} ms, a frekvenciára korrigált QTc kb. ${t.qtcMs} ms.`
          + (p.rate > 100 || p.rate < 50
            ? ' Szélsőséges frekvencián a korrekció torzít, ezért a szomszédos kategória is védhető.'
            : ''),
        highlight: 'qt',
      }

    case 'ritmus': {
      // A csalik a helyeshez legközelebb álló ritmusok, nem véletlenszerűek.
      const NEAR: Record<string, string[]> = {
        sinus: ['sinus-irregular', 'afib', 'junctional'],
        'sinus-irregular': ['sinus', 'afib', 'flutter'],
        afib: ['flutter', 'sinus-irregular', 'sinus'],
        flutter: ['afib', 'sinus', 'vt'],
        vt: ['junctional', 'paced', 'flutter'],
        junctional: ['paced', 'sinus', 'vt'],
        paced: ['junctional', 'vt', 'sinus'],
        vfib: ['vt', 'flutter', 'afib'],
      }
      const picks = [t.rhythm, ...(NEAR[t.rhythm] ?? []).slice(0, 3)]
      const list = RHYTHM_OPTIONS.filter((o) => picks.includes(o.id))
      if (list.length < 2) return null
      return {
        id: `auto-${step}`,
        prompt: 'Milyen a ritmus?',
        options: opts(list),
        correct: [t.rhythm],
        explain: `A ritmus: ${RHYTHM_OPTIONS.find((o) => o.id === t.rhythm)?.label.toLowerCase() ?? t.rhythm}.`,
        highlight: 'rr',
      }
    }

    case 'st': {
      const hol = t.stRegions.length
        ? ' Területe: ' + t.stRegions
            .map((r) => REGIONS.find((x) => x.id === r)!.label.split(' (')[0].toLowerCase())
            .join(', ') + '.'
        : ''
      return {
        id: `auto-${step}`,
        prompt: 'Látsz-e jelentős ST-eltérést?',
        options: opts(ST_DIR_OPTIONS),
        correct: [t.stDir],
        explain: `${ST_DIR_OPTIONS.find((o) => o.id === t.stDir)?.label ?? ''}.${hol}`
          + ' A területi érintettséghez legalább két szomszédos elvezetés eltérése kell.',
        highlight: 'st',
      }
    }

    case 't': {
      const hol = t.tRegions.length
        ? ' Területe: ' + t.tRegions
            .map((r) => REGIONS.find((x) => x.id === r)!.label.split(' (')[0].toLowerCase())
            .join(', ') + '.'
        : ''
      return {
        id: `auto-${step}`,
        prompt: 'Milyenek a T-hullámok?',
        options: opts(T_OPTIONS),
        correct: [t.tShape],
        explain: `${T_OPTIONS.find((o) => o.id === t.tShape)?.label ?? ''}.${hol}`,
        highlight: 't',
      }
    }

    case 'p': {
      // A P-hullám formáját a paraméter írja le; a csalik a többi lehetséges alak.
      const MAP: Record<string, { id: string; label: string }> = {
        normal: { id: 'normal', label: 'Élettani P-hullám minden QRS előtt' },
        absent: { id: 'absent', label: 'Nincs felismerhető P-hullám' },
        fibrillatory: { id: 'fibrillatory', label: 'Rendezetlen, hullámzó alapvonal' },
        flutter: { id: 'flutter', label: 'Fűrészfog-mintázat' },
        inverted: { id: 'inverted', label: 'Fordított (negatív) P-hullám' },
        varying: { id: 'varying', label: 'Változó alakú vagy amplitúdójú P-hullámok' },
        flattened: { id: 'flattened', label: 'Ellaposodott P-hullámok' },
      }
      const helyes = MAP[p.p]
      if (!helyes) return null
      const csalik = ['normal', 'absent', 'fibrillatory', 'flutter', 'varying']
        .filter((k) => k !== p.p).slice(0, 3).map((k) => MAP[k])
      return {
        id: `auto-${step}`,
        prompt: 'Milyen a pitvari aktivitás?',
        options: opts([helyes, ...csalik].sort((a, b) => a.id.localeCompare(b.id))),
        correct: [helyes.id],
        explain: `${helyes.label}. A P-hullámot a II. elvezetésben és a V1-ben érdemes keresni.`,
        highlight: 'p',
      }
    }

    default:
      // A kalibrációnak és az összegzésnek nincs egyértelmű, mérhető válasza.
      return null
  }
}
