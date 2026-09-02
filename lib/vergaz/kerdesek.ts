import { interpret, type Values, type Sample } from './data'

/**
 * A „Gondolkodj végig" mód kérdései.
 *
 * A kérdések a megadott értékekből származnak, ugyanabból a számításból,
 * amelyből az elemzés is — így nem fordulhat elő, hogy a helyes válasz eltér
 * attól, amit a rendszer az elemzésben mond.
 */

export interface Kerdes {
  id: string
  kerdes: string
  opciok: { id: string; label: string }[]
  helyes: string
  magyarazat: string
}

export function kerdesek(v: Values, sample: Sample): Kerdes[] {
  const r = interpret(v, sample)
  if (!r || v.ph == null || v.pco2 == null || v.hco3 == null) return []
  const { ph, pco2, hco3 } = v
  const k: Kerdes[] = []

  /* 1. A pH iránya */
  k.push({
    id: 'ph',
    kerdes: 'Mit látsz először a pH alapján?',
    opciok: [
      { id: 'acid', label: 'Acidaemia' },
      { id: 'alk', label: 'Alkalaemia' },
      { id: 'norm', label: 'Élettani tartomány' },
    ],
    helyes: ph < 7.35 ? 'acid' : ph > 7.45 ? 'alk' : 'norm',
    magyarazat: `A pH ${ph.toFixed(2)}. `
      + (ph < 7.35 ? 'A 7,35 alatti érték acidaemia.'
        : ph > 7.45 ? 'A 7,45 feletti érték alkalaemia.'
        : 'A tartományon belül van — ez azonban nem zárja ki a kompenzált vagy kevert zavart.'),
  })

  /* 2. Melyik érték magyarázza */
  const respIrany = pco2 > 45 ? 'sav' : pco2 < 35 ? 'lug' : 'semleges'
  const metIrany = hco3 < 22 ? 'sav' : hco3 > 26 ? 'lug' : 'semleges'
  const phIrany = ph < 7.4 ? 'sav' : 'lug'
  const respMagyaraz = respIrany === phIrany
  const metMagyaraz = metIrany === phIrany

  k.push({
    id: 'ok',
    kerdes: 'Mi magyarázza elsődlegesen a pH eltérését?',
    opciok: [
      { id: 'pco2', label: 'A pCO₂ (légzési eredet)' },
      { id: 'hco3', label: 'A HCO₃⁻ (anyagcsere-eredet)' },
      { id: 'mindketto', label: 'Mindkettő — kevert zavar' },
    ],
    helyes: respMagyaraz && metMagyaraz ? 'mindketto' : respMagyaraz ? 'pco2' : 'hco3',
    magyarazat: `A pCO₂ ${pco2} Hgmm, a HCO₃⁻ ${hco3} mmol/l. `
      + 'Azt az értéket keressük, amelyik a pH-val azonos irányba mozdult el: '
      + 'acidózisban az emelkedett pCO₂ vagy a csökkent bikarbonát. '
      + (respMagyaraz && metMagyaraz
        ? 'Itt mindkettő ugyanabba az irányba billenti a pH-t, ami kevert zavarra utal.'
        : ''),
  })

  /* 3. Kompenzáció */
  const komp = r.findings.find((x) => x.id === 'komp')
  if (komp) {
    const megfelelo = komp.title.includes('megfelelő')
    k.push({
      id: 'komp',
      kerdes: 'Megfelelő mértékű-e az ellenirányú válasz?',
      opciok: [
        { id: 'igen', label: 'Igen, a várt tartományban' },
        { id: 'nem', label: 'Nem — társuló zavar is fennáll' },
        { id: 'nem-egyert', label: 'Nem egyértelmű' },
      ],
      helyes: megfelelo ? 'igen' : komp.title.includes('között') ? 'nem-egyert' : 'nem',
      magyarazat: komp.detail,
    })
  }

  /* 4. Anionrés */
  const ag = r.findings.find((x) => x.id === 'ag')
  if (ag) {
    k.push({
      id: 'ag',
      kerdes: 'Hogyan alakul az anionrés?',
      opciok: [
        { id: 'magas', label: 'Emelkedett' },
        { id: 'hatar', label: 'Határérték körüli' },
        { id: 'normal', label: 'Élettani' },
      ],
      helyes: ag.title.includes('Emelkedett') ? 'magas'
        : ag.title.includes('Határérték') ? 'hatar' : 'normal',
      magyarazat: ag.detail,
    })
  }

  /* 5. Oxigenizáció */
  const pf = r.findings.find((x) => x.id === 'pf')
  if (pf) {
    k.push({
      id: 'oxi',
      kerdes: 'Milyen az oxigenizáció a P/F-hányados alapján?',
      opciok: [
        { id: 'jo', label: 'Megtartott (300 felett)' },
        { id: 'enyhe', label: 'Enyhén csökkent (200–300)' },
        { id: 'kozep', label: 'Közepesen csökkent (100–200)' },
        { id: 'sulyos', label: 'Súlyosan csökkent (100 alatt)' },
      ],
      helyes: pf.title.includes('Megtartott') ? 'jo'
        : pf.title.includes('Enyhén') ? 'enyhe'
        : pf.title.includes('Közepesen') ? 'kozep' : 'sulyos',
      magyarazat: pf.detail,
    })
  }

  return k
}
