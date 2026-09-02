/**
 * Vérgázelemzés — referenciaértékek és számítások.
 *
 * A modul a klasszikus, lépésenkénti sav-bázis elemzést követi: a zavar
 * irányának megállapítása, az elsődleges ok azonosítása, a kompenzáció
 * megítélése, majd az anionrés és az oxigenizáció értékelése.
 *
 * A használt összefüggések tankönyvi, konszenzusos formulák (Winter-képlet,
 * kompenzációs szabályok, anionrés, delta-arány, P/F-hányados). A számítás
 * soha nem helyettesíti a klinikai képet: a lelet önmagában nem diagnózis.
 */

export type Sample = 'arterias' | 'venas'

export interface Values {
  ph: number | null
  pco2: number | null          // Hgmm
  hco3: number | null          // mmol/l
  be: number | null            // mmol/l
  po2: number | null           // Hgmm
  sao2: number | null          // %
  fio2: number | null          // tört (0,21–1,0)
  lact: number | null          // mmol/l
  na: number | null
  k: number | null
  cl: number | null
  ca: number | null            // ionizált, mmol/l
  gluk: number | null          // mmol/l
  hb: number | null            // g/l
  alb: number | null           // g/l — az anionrés korrekciójához
  /** Klinikai összefüggéshez, számításba nem megy bele. */
  kor: number | null
  legzesszam: number | null
}

export const EMPTY: Values = {
  ph: null, pco2: null, hco3: null, be: null, po2: null, sao2: null, fio2: null,
  lact: null, na: null, k: null, cl: null, ca: null, gluk: null, hb: null, alb: null,
  kor: null, legzesszam: null,
}

/** Oxigénbeviteli mód — a FiO₂ becsléséhez ad támpontot. */
export const O2_MODES = [
  { id: 'levego', label: 'Szobalevegő', fio2: 0.21 },
  { id: 'kanul2', label: 'Orrszonda 2 l/perc', fio2: 0.28 },
  { id: 'kanul4', label: 'Orrszonda 4 l/perc', fio2: 0.36 },
  { id: 'maszk5', label: 'Egyszerű maszk 5–6 l/perc', fio2: 0.4 },
  { id: 'maszk10', label: 'Rezervoáros maszk 10–15 l/perc', fio2: 0.8 },
  { id: 'egyeb', label: 'Egyéb / gépi lélegeztetés', fio2: null },
] as const

export interface RefRange {
  key: keyof Values
  label: string
  unit: string
  low: number
  high: number
  /** Vénás mintánál eltérő tartomány, ahol értelmezhető. */
  venous?: { low: number; high: number }
  step?: number
  hint?: string
}

export const REFS: RefRange[] = [
  { key: 'ph', label: 'pH', unit: '', low: 7.35, high: 7.45, venous: { low: 7.31, high: 7.41 }, step: 0.01 },
  { key: 'pco2', label: 'pCO₂', unit: 'Hgmm', low: 35, high: 45, venous: { low: 41, high: 51 }, step: 1 },
  { key: 'hco3', label: 'HCO₃⁻', unit: 'mmol/l', low: 22, high: 26, step: 0.5 },
  { key: 'be', label: 'BE', unit: 'mmol/l', low: -2, high: 2, step: 0.5 },
  { key: 'po2', label: 'pO₂', unit: 'Hgmm', low: 80, high: 100, venous: { low: 35, high: 45 }, step: 1,
    hint: 'Vénás mintából az oxigenizáció nem ítélhető meg.' },
  { key: 'sao2', label: 'SaO₂', unit: '%', low: 95, high: 100, venous: { low: 70, high: 80 }, step: 1 },
  { key: 'lact', label: 'Laktát', unit: 'mmol/l', low: 0.5, high: 2, step: 0.1 },
  { key: 'na', label: 'Nátrium', unit: 'mmol/l', low: 135, high: 145, step: 1 },
  { key: 'k', label: 'Kálium', unit: 'mmol/l', low: 3.5, high: 5.1, step: 0.1 },
  { key: 'cl', label: 'Klorid', unit: 'mmol/l', low: 98, high: 107, step: 1 },
  { key: 'ca', label: 'Ca²⁺ (ionizált)', unit: 'mmol/l', low: 1.15, high: 1.32, step: 0.01 },
  { key: 'gluk', label: 'Glükóz', unit: 'mmol/l', low: 3.9, high: 5.6, step: 0.1 },
  { key: 'hb', label: 'Hemoglobin', unit: 'g/l', low: 120, high: 170, step: 1 },
  { key: 'alb', label: 'Albumin', unit: 'g/l', low: 35, high: 52, step: 1,
    hint: 'Az anionrés korrekciójához. Alacsony albumin álnegatív anionrést ad.' },
]

/** Élettanilag lehetetlen értékek kiszűrése — elgépelés ellen. */
export const LIMITS: Partial<Record<keyof Values, { min: number; max: number }>> = {
  ph: { min: 6.5, max: 8.0 },
  pco2: { min: 5, max: 150 },
  hco3: { min: 2, max: 60 },
  be: { min: -35, max: 35 },
  po2: { min: 10, max: 700 },
  sao2: { min: 20, max: 100 },
  lact: { min: 0, max: 30 },
  na: { min: 90, max: 190 },
  k: { min: 1, max: 10 },
  cl: { min: 50, max: 160 },
  ca: { min: 0.3, max: 3 },
  gluk: { min: 0.5, max: 60 },
  hb: { min: 20, max: 250 },
  alb: { min: 5, max: 70 },
  kor: { min: 0, max: 120 },
  legzesszam: { min: 4, max: 70 },
}

export function validate(key: keyof Values, v: number | null): string | null {
  if (v == null) return null
  const l = LIMITS[key]
  if (!l) return null
  if (v < l.min || v > l.max) return `Élettanilag nem értelmezhető érték (${l.min}–${l.max}).`
  return null
}

export const refOf = (key: keyof Values, sample: Sample) => {
  const r = REFS.find((x) => x.key === key)!
  return sample === 'venas' && r.venous ? { ...r, ...r.venous } : r
}

/* ─────────── Értelmezés ─────────── */

export type Severity = 'ok' | 'warn' | 'alert'

export interface Finding {
  id: string
  title: string
  detail: string
  severity: Severity
}

export interface Interpretation {
  /** Rövid, egy mondatos összegzés. */
  summary: string
  findings: Finding[]
  /** Amit a számítás nem tud eldönteni — a klinikai képre tartozik. */
  caveats: string[]
}

const near = (v: number, lo: number, hi: number) => v >= lo && v <= hi

/** A megadott értékekből származó elemzés. */
export function interpret(v: Values, sample: Sample): Interpretation | null {
  const { ph, pco2, hco3 } = v
  if (ph == null || pco2 == null || hco3 == null) return null

  const f: Finding[] = []
  const caveats: string[] = []
  let summary = ''

  // Az anionrést előre kiszámoljuk: a légzési zavar kompenzációjának
  // megítéléséhez is szükség van rá. Emelkedett anionrés mellett a bikarbonát
  // csökkenését nem a kompenzáció magyarázza, hanem társuló savtöbblet.
  const agRawPre = v.na != null && v.cl != null ? v.na - (v.cl + hco3) : null
  const agPre = agRawPre != null && v.alb != null
    ? agRawPre + 2.5 * ((40 - v.alb) / 10)
    : agRawPre
  const agMagas = agPre != null && agPre > 16

  if (sample === 'venas') {
    caveats.push(
      'Vénás mintáról van szó: a pH és a pCO₂ eltérő tartományban értékelendő, '
      + 'az oxigenizáció pedig nem ítélhető meg.',
    )
  }

  /* 1. A zavar iránya */
  const acidosis = ph < 7.35
  const alkalosis = ph > 7.45
  const normalPh = !acidosis && !alkalosis

  /* 2. Az elsődleges zavar */
  const respAcid = pco2 > 45
  const respAlk = pco2 < 35
  const metAcid = hco3 < 22
  const metAlk = hco3 > 26

  let primary: 'ma' | 'mal' | 'ra' | 'ral' | 'kevert' | 'normal' = 'normal'

  if (acidosis) {
    if (metAcid && respAcid) primary = 'kevert'
    else if (metAcid) primary = 'ma'
    else if (respAcid) primary = 'ra'
    else primary = 'kevert'
  } else if (alkalosis) {
    if (metAlk && respAlk) primary = 'kevert'
    else if (metAlk) primary = 'mal'
    else if (respAlk) primary = 'ral'
    else primary = 'kevert'
  } else if (metAcid || metAlk || respAcid || respAlk) {
    // Élettani pH mellett is lehet zavar. Ha a pCO₂ és a HCO₃⁻ azonos irányba
    // tér el, teljesen kompenzált állapotról van szó, és az elsődleges ok a
    // pH finom eltéréséből megállapítható: 7,40 alatt acidózis, felette
    // alkalózis irányú. Ilyen a krónikus légzési elégtelenség tipikus képe.
    const bothUp = pco2 > 45 && hco3 > 26
    const bothDown = pco2 < 35 && hco3 < 22
    if (bothUp) primary = ph < 7.4 ? 'ra' : 'mal'
    else if (bothDown) primary = ph > 7.4 ? 'ral' : 'ma'
    else primary = 'kevert'
  }
  // Teljesen kompenzált állapot: a pH visszatért a tartományba.
  const kompenzalt = normalPh && primary !== 'normal' && primary !== 'kevert'

  const NAME: Record<typeof primary, string> = {
    ma: 'Metabolikus acidózis',
    mal: 'Metabolikus alkalózis',
    ra: 'Respiratorikus acidózis',
    ral: 'Respiratorikus alkalózis',
    kevert: 'Kevert vagy kompenzált sav-bázis zavar',
    normal: 'Élettani sav-bázis állapot',
  }

  f.push({
    id: 'iranyt',
    title: kompenzalt ? `${NAME[primary]} — teljesen kompenzált` : NAME[primary],
    detail: normalPh
      ? (kompenzalt
        ? `A pH ${ph.toFixed(2)} — visszatért a tartományba, de a pCO₂ ${pco2} Hgmm és a HCO₃⁻ ${hco3} mmol/l `
          + 'egyaránt eltér: a szervezet teljesen kiegyenlítette a zavart. Ez tartós, krónikus állapotra jellemző.'
        : `A pH ${ph.toFixed(2)} — a tartományon belül. A pCO₂ és a HCO₃⁻ eltérése kevert zavarra utal.`)
      : `A pH ${ph.toFixed(2)}: ${acidosis ? 'acidózis' : 'alkalózis'}. `
        + `pCO₂ ${pco2} Hgmm, HCO₃⁻ ${hco3} mmol/l.`,
    severity: primary === 'normal' ? 'ok' : ph < 7.2 || ph > 7.55 ? 'alert' : 'warn',
  })

  /* 3. Kompenzáció */
  if (primary === 'ma') {
    const exp = 1.5 * hco3 + 8
    const inRange = near(pco2, exp - 2, exp + 2)
    f.push({
      id: 'komp',
      title: inRange ? 'A légzési kompenzáció megfelelő'
        : pco2 > exp + 2 ? 'Elégtelen légzési kompenzáció — társuló respiratorikus acidózis'
        : 'A kompenzációnál nagyobb mértékű hypocapnia — társuló respiratorikus alkalózis',
      detail: `Winter-képlet: a várt pCO₂ ${(exp - 2).toFixed(0)}–${(exp + 2).toFixed(0)} Hgmm, `
        + `a mért ${pco2} Hgmm.`,
      severity: inRange ? 'ok' : 'warn',
    })
  } else if (primary === 'mal') {
    const exp = 0.7 * hco3 + 20
    const inRange = near(pco2, exp - 5, exp + 5)
    f.push({
      id: 'komp',
      title: inRange ? 'A légzési kompenzáció megfelelő' : 'A kompenzáció eltér a várttól — társuló légzési zavar',
      detail: `A várt pCO₂ ${(exp - 5).toFixed(0)}–${(exp + 5).toFixed(0)} Hgmm, a mért ${pco2} Hgmm.`,
      severity: inRange ? 'ok' : 'warn',
    })
  } else if (primary === 'ra' || primary === 'ral') {
    const d = (pco2 - 40) / 10
    const acuteExp = 24 + (primary === 'ra' ? 1 : -2) * d * (primary === 'ra' ? 1 : -1)
    const chronExp = 24 + (primary === 'ra' ? 3.5 : -4) * d * (primary === 'ra' ? 1 : -1)
    const dAcute = Math.abs(hco3 - acuteExp)
    const dChron = Math.abs(hco3 - chronExp)
    // A két becslés közül a közelebbi dönt; ha alig különböznek, nem foglalunk állást.
    const koztes = Math.abs(dAcute - dChron) < 1.5
    if (agMagas && hco3 < 22) {
      // A bikarbonát csökkenését emelkedett anionrés mellett savtöbblet okozza,
      // nem a légzési zavar kompenzációja — ez önálló, második zavar.
      f.push({
        id: 'komp',
        title: 'Társuló, emelkedett anionrésű metabolikus acidózis',
        detail: `A bikarbonát ${hco3} mmol/l, az anionrés viszont emelkedett. A csökkenést így nem `
          + 'a légzési zavar kompenzációja magyarázza, hanem egyidejű savtöbblet: kevert zavarról van szó. '
          + 'Ez a kép jellemző például szalicilát hatására vagy sepsisre.',
        severity: 'warn',
      })
    } else {
      f.push({
        id: 'komp',
        title: koztes ? 'Akut és krónikus között — a klinikai kép dönt'
          : dChron < dAcute ? 'Krónikus (részben kompenzált) állapotra utal'
          : 'Akut állapotra utal',
        detail: `A HCO₃⁻ akut zavarnál kb. ${acuteExp.toFixed(0)}, krónikusnál kb. ${chronExp.toFixed(0)} mmol/l `
          + `körül várható; a mért ${hco3} mmol/l.`,
        severity: 'warn',
      })
    }
    caveats.push('Az akut és krónikus elkülönítés a vérgázból önmagában nem biztos: az anamnézis és a korábbi leletek döntenek.')
  }

  /* 4. Anionrés */
  if (v.na != null && v.cl != null) {
    const agRaw = v.na - (v.cl + hco3)
    const ag = v.alb != null ? agRaw + 2.5 * ((40 - v.alb) / 10) : agRaw
    // A 12-es küszöb laboronként eltér, ezért a közvetlenül fölötte lévő
    // sávot határértékként jelöljük, nem kategorikusan emelkedettként.
    const magas = ag > 16
    const hatar = ag > 12 && ag <= 16
    f.push({
      id: 'ag',
      title: magas ? 'Emelkedett anionrés' : hatar ? 'Határérték körüli anionrés' : 'Élettani anionrés',
      detail: `Anionrés ${agRaw.toFixed(1)} mmol/l`
        + (v.alb != null ? `, albuminra korrigálva ${ag.toFixed(1)} mmol/l` : '')
        + `. ${magas
          ? 'Emelkedett anionrés mellett laktát, ketontestek, veseelégtelenség vagy toxin állhat a háttérben.'
          : hatar
            ? 'A küszöb laboronként eltér, ezért ez a sáv önmagában nem dönt el semmit — a klinikai kép és a laktát segít.'
            : 'Élettani anionrés mellett a bikarbonátvesztés (hasmenés, vesetubuláris eltérés) jön szóba.'}`,
      severity: magas ? 'warn' : 'ok',
    })
    if (v.alb == null) {
      caveats.push('Albumin megadásával az anionrés pontosabban értékelhető: alacsony albumin álnegatív irányba tolja.')
    }

    // Delta-arány: csak emelkedett anionrésű metabolikus acidózisnál értelmes.
    if ((magas || hatar) && hco3 < 22) {
      const delta = (ag - 12) / (24 - hco3)
      f.push({
        id: 'delta',
        title: delta < 1 ? 'Társuló élettani anionrésű acidózis valószínű'
          : delta > 2 ? 'Társuló metabolikus alkalózis vagy krónikus légzési zavar valószínű'
          : 'Tiszta, emelkedett anionrésű metabolikus acidózis',
        detail: `Delta-arány ${delta.toFixed(1)}. Az 1 és 2 közötti érték felel meg az önmagában álló, `
          + 'emelkedett anionrésű acidózisnak.',
        severity: delta < 1 || delta > 2 ? 'warn' : 'ok',
      })
    }
  } else {
    caveats.push('Nátrium és klorid megadásával kiszámítható az anionrés, ami a metabolikus acidózis okát szűkíti.')
  }

  /* 5. Laktát */
  if (v.lact != null) {
    f.push({
      id: 'lact',
      title: v.lact >= 4 ? 'Jelentősen emelkedett laktát'
        : v.lact > 2 ? 'Emelkedett laktát' : 'Élettani laktát',
      detail: `${v.lact} mmol/l. `
        + (v.lact > 2
          ? 'Szöveti hypoperfúzióra utalhat, de gyógyszer, májelégtelenség és görcsroham is emelheti.'
          : 'A tartományon belül.'),
      severity: v.lact >= 4 ? 'alert' : v.lact > 2 ? 'warn' : 'ok',
    })
  }

  /* 6. Oxigenizáció */
  if (sample === 'arterias' && v.po2 != null) {
    if (v.fio2 != null && v.fio2 > 0) {
      const pf = v.po2 / v.fio2
      f.push({
        id: 'pf',
        title: pf < 100 ? 'Súlyosan csökkent oxigenizáció'
          : pf < 200 ? 'Közepesen csökkent oxigenizáció'
          : pf < 300 ? 'Enyhén csökkent oxigenizáció' : 'Megtartott oxigenizáció',
        detail: `P/F-hányados ${pf.toFixed(0)} (pO₂ ${v.po2} Hgmm, FiO₂ ${(v.fio2 * 100).toFixed(0)}%). `
          + 'A 300 alatti érték az ARDS-besorolás egyik feltétele, de önmagában nem elegendő hozzá.',
        severity: pf < 200 ? 'alert' : pf < 300 ? 'warn' : 'ok',
      })

      // Alveolo-arteriális gradiens tengerszinten, légköri nyomáson.
      const pAO2 = v.fio2 * (760 - 47) - pco2 / 0.8
      const aa = pAO2 - v.po2
      const szobalevego = v.fio2 <= 0.3

      if (szobalevego) {
        f.push({
          id: 'aa',
          title: aa > 20 ? 'Emelkedett alveolo-arteriális gradiens' : 'Élettani alveolo-arteriális gradiens',
          detail: `A-a gradiens kb. ${aa.toFixed(0)} Hgmm. `
            + (aa > 20
              ? 'Emelkedett gradiens mellett tüdőparenchyma-eltérés, söntkeringés vagy embólia jön szóba.'
              : 'Élettani gradiens mellett a hypoventiláció vagy a belélegzett oxigén alacsony aránya a valószínűbb ok.')
            + ' A gradiens életkorral nő: hozzávetőleges felső határa az életkor negyede plus négy.',
          severity: aa > 20 ? 'warn' : 'ok',
        })
      } else {
        f.push({
          id: 'aa',
          title: 'Az A-a gradiens emelt oxigénadagolás mellett nem minősíthető',
          detail: `A számított érték kb. ${aa.toFixed(0)} Hgmm, de a szokásos 20 Hgmm-es felső határ `
            + 'csak szobalevegőn érvényes. Emelt belélegzett oxigénarány mellett a gradiens '
            + 'élettanilag is jóval magasabb, ezért itt a P/F-hányados a használható mutató.',
          severity: 'ok',
        })
      }
    } else {
      caveats.push('FiO₂ megadásával kiszámítható a P/F-hányados és az alveolo-arteriális gradiens.')
    }
  }

  /* Összegzés */
  const alerts = f.filter((x) => x.severity === 'alert').length
  summary = primary === 'normal' && alerts === 0
    ? (agMagas
      // Élettani pH és élettani bikarbonát mellett is állhat fenn zavar: az
      // emelkedett anionrés ilyenkor az egyetlen jel, ami elárulja.
      ? 'A pH élettani, az anionrés viszont emelkedett — rejtett, egymást kioltó kevert zavar valószínű.'
      : 'A megadott értékek alapján nincs érdemi sav-bázis eltérés.')
    : `${NAME[primary]}${alerts > 0 ? ' — sürgős értékelést igénylő eltéréssel' : ''}.`

  caveats.push('A számítás a megadott értékeken alapul. A lelet önmagában nem diagnózis: a klinikai kép, az anamnézis és a mintavétel körülményei együtt értelmezendők.')

  return { summary, findings: f, caveats }
}

/* ─────────── Vezetett elemzés lépései ─────────── */

export interface Step {
  id: string
  title: string
  question: string
  hint: string
}

export const STEPS: Step[] = [
  { id: 'ph', title: 'A pH iránya', question: 'Acidózis, alkalózis vagy élettani tartomány?',
    hint: 'A 7,35 alatti érték acidózis, a 7,45 feletti alkalózis. Élettani pH mellett is állhat fenn kompenzált vagy kevert zavar.' },
  { id: 'ok', title: 'Az elsődleges ok', question: 'Légzési vagy anyagcsere-eredetű a zavar?',
    hint: 'Nézd meg, melyik érték mozdul a pH-val azonos irányba: acidózisban az emelkedett pCO₂ légzési, a csökkent HCO₃⁻ anyagcsere-eredetre utal.' },
  { id: 'komp', title: 'A kompenzáció', question: 'Megfelelő mértékű-e az ellenirányú válasz?',
    hint: 'Metabolikus acidózisnál a Winter-képlet adja a várt pCO₂-t. Ha a mért érték ettől eltér, társuló légzési zavar is fennáll.' },
  { id: 'ag', title: 'Anionrés', question: 'Emelkedett-e az anionrés?',
    hint: 'Anionrés = Na⁻(Cl+HCO₃). Emelkedett érték laktát, ketontestek, veseelégtelenség vagy toxin irányába visz. Albuminra korrigálandó.' },
  { id: 'oxi', title: 'Oxigenizáció', question: 'Megtartott-e az oxigénfelvétel?',
    hint: 'A P/F-hányados és az alveolo-arteriális gradiens együtt mutatja meg, hogy a hypoxia hátterében hypoventiláció vagy tüdőeltérés áll-e.' },
]

export const SOURCE_NOTE =
  'A használt összefüggések tankönyvi, konszenzusos formulák: Winter-képlet, '
  + 'kompenzációs szabályok, anionrés és albumin-korrekció, delta-arány, '
  + 'P/F-hányados és alveolo-arteriális gradiens.'
