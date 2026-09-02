/**
 * Fogalommagyarázatok a vérgázmodulhoz.
 *
 * A felületen minden fontos érték mellett elérhető: mit mér, miért fontos, és
 * mi állhat az eltérés hátterében. A felsorolások lehetőségeket sorolnak, nem
 * diagnózist — az ok megállapítása a klinikai képen múlik.
 */

export interface Fogalom {
  key: string
  cim: string
  mit: string
  miert: string
  /** Két irányban: mi emeli, mi csökkenti. */
  fel?: { cim: string; okok: string[] }
  le?: { cim: string; okok: string[] }
  megjegyzes?: string
}

export const FOGALMAK: Fogalom[] = [
  {
    key: 'ph', cim: 'pH',
    mit: 'A vér hidrogénion-koncentrációjának mérőszáma. Élettani tartománya artériás vérben 7,35–7,45.',
    miert: 'Ez mondja meg, melyik irányban billent el a sav-bázis egyensúly. A pH-t a szervezet szűk határok között tartja, mert az enzimműködés és a keringés is érzékeny rá.',
    le: {
      cim: 'Acidaemia (pH < 7,35)',
      okok: [
        'Légzési eredet: csökkent alveoláris ventiláció, szén-dioxid-visszatartás',
        'Anyagcsere-eredet: savtermelés (laktát, ketontestek), savürítési zavar, bikarbonátvesztés',
      ],
    },
    fel: {
      cim: 'Alkalaemia (pH > 7,45)',
      okok: [
        'Légzési eredet: hyperventiláció',
        'Anyagcsere-eredet: savvesztés (hányás, gyomorszonda), bikarbonátbevitel, diuretikum, hypokalaemia',
      ],
    },
    megjegyzes: 'Élettani pH mellett is fennállhat sav-bázis zavar: teljesen kompenzált vagy egymást kioltó, kevert állapotban.',
  },
  {
    key: 'pco2', cim: 'pCO₂',
    mit: 'A vérben oldott szén-dioxid parciális nyomása. Artériás vérben 35–45 Hgmm.',
    miert: 'A sav-bázis egyensúly légzési oldalát mutatja. A szén-dioxid kiürítése a percventilációtól függ, ezért a pCO₂ gyakorlatilag a légzés hatékonyságának mérőszáma.',
    fel: {
      cim: 'Emelkedett (hypercapnia)',
      okok: [
        'Csökkent légzési meghajtás: gyógyszerhatás, központi idegrendszeri ok',
        'Légúti akadály vagy tüdőbetegség: COPD, súlyos asthma',
        'Légzőizom-gyengeség, mellkasfali korlátozottság',
        'Kompenzáció metabolikus alkalózisban',
      ],
    },
    le: {
      cim: 'Csökkent (hypocapnia)',
      okok: [
        'Hyperventiláció: fájdalom, szorongás, láz, hypoxia',
        'Kompenzáció metabolikus acidózisban',
        'Tüdőembólia, korai sepsis',
      ],
    },
  },
  {
    key: 'hco3', cim: 'HCO₃⁻ (bikarbonát)',
    mit: 'A vér legfontosabb pufferanyagának koncentrációja, élettani tartománya 22–26 mmol/l.',
    miert: 'A sav-bázis egyensúly anyagcsere-oldalát mutatja. Lassabban változik, mint a pCO₂, ezért a tartós, krónikus folyamatokat jelzi.',
    fel: {
      cim: 'Emelkedett',
      okok: [
        'Metabolikus alkalózis: hányás, gyomorszonda, diuretikum, mineralokortikoid-túlsúly',
        'Krónikus légzési acidózis vesekompenzációja',
      ],
    },
    le: {
      cim: 'Csökkent',
      okok: [
        'Metabolikus acidózis: savtermelés vagy bikarbonátvesztés',
        'Krónikus légzési alkalózis vesekompenzációja',
      ],
    },
  },
  {
    key: 'be', cim: 'Base excess (BE)',
    mit: 'Azt fejezi ki, mennyi savval vagy lúggal lehetne a vért élettani pH-ra állítani szabványos körülmények között. Tartománya −2 és +2 mmol/l között.',
    miert: 'A sav-bázis zavar anyagcsere-összetevőjét mutatja a légzési hatástól függetlenül. Negatív érték savtöbbletre, pozitív lúgtöbbletre utal.',
    megjegyzes: 'A BE és a bikarbonát ugyanazt az oldalt írja le két módon: együtt mozognak, ezért az egyik önmagában is elég a tájékozódáshoz.',
  },
  {
    key: 'po2', cim: 'pO₂',
    mit: 'A vérben oldott oxigén parciális nyomása. Artériás vérben, szobalevegőn 80–100 Hgmm.',
    miert: 'Az oxigénfelvétel hatékonyságát mutatja. Önmagában viszont keveset mond: mindig a belélegzett oxigén arányával együtt értékelendő.',
    le: {
      cim: 'Csökkent (hypoxaemia)',
      okok: [
        'Ventilációs-perfúziós eltérés: tüdőgyulladás, tüdőödéma, atelektázia',
        'Söntkeringés',
        'Hypoventiláció (ilyenkor a pCO₂ is emelkedett)',
        'Diffúziós zavar',
        'Alacsony belélegzett oxigénarány',
      ],
    },
    megjegyzes: 'Vénás mintából az oxigenizáció nem ítélhető meg.',
  },
  {
    key: 'sao2', cim: 'SaO₂ (oxigénszaturáció)',
    mit: 'A hemoglobin oxigénnel telített hányada, élettani értéke 95% felett.',
    miert: 'A szövetekhez jutó oxigén mennyiségét a szaturáció és a hemoglobinszint együtt határozza meg. Alacsony hemoglobin mellett a magas szaturáció is kevés oxigént jelenthet.',
    megjegyzes: 'Az oxigén-disszociációs görbe miatt 90% körüli szaturációnál már meredeken esik a pO₂: a további kis csökkenés nagy romlást jelent.',
  },
  {
    key: 'lact', cim: 'Laktát',
    mit: 'Az anaerob anyagcsere terméke. Élettani értéke 0,5–2 mmol/l.',
    miert: 'Emelkedése szöveti oxigénhiányra vagy fokozott anyagcsere-igényre utalhat, és a súlyosság megítélésében is szerepet kap.',
    fel: {
      cim: 'Emelkedett',
      okok: [
        'Szöveti hypoperfúzió: sokk bármely formája',
        'Hypoxia',
        'Fokozott anyagcsere-igény: görcsroham, jelentős izommunka',
        'Csökkent lebontás: májelégtelenség',
        'Gyógyszerek és toxinok: metformin, béta-agonisták, alkohol',
      ],
    },
    megjegyzes: 'Az emelkedett laktát önmagában nem bizonyít betegséget, és a mintavétel körülményei is befolyásolják.',
  },
  {
    key: 'ag', cim: 'Anionrés',
    mit: 'A mért kationok és anionok különbsége: nátrium mínusz a klorid és a bikarbonát összege. Élettani értéke kb. 8–12 mmol/l, laboronként eltérő.',
    miert: 'Metabolikus acidózisban megmutatja, hogy savtöbblet vagy bikarbonátvesztés áll-e a háttérben. Ez szűkíti az okok körét.',
    fel: {
      cim: 'Emelkedett anionrés',
      okok: [
        'Laktát-acidózis',
        'Ketoacidózis: cukorbetegség, éhezés, alkohol',
        'Veseelégtelenség',
        'Toxinok: metanol, etilénglikol, szalicilát',
      ],
    },
    le: {
      cim: 'Élettani anionrés metabolikus acidózisban',
      okok: [
        'Bikarbonátvesztés: hasmenés, hasi sipoly',
        'Vesetubuláris acidózis',
        'Nagy mennyiségű fiziológiás sóoldat bevitele',
      ],
    },
    megjegyzes: 'Alacsony albumin álnegatív irányba tolja: minden 10 g/l albuminhiány kb. 2,5 mmol/l-rel csökkenti a mért anionrést, ezért korrekció szükséges.',
  },
  {
    key: 'delta', cim: 'Delta-arány',
    mit: 'Az anionrés emelkedésének és a bikarbonát csökkenésének aránya emelkedett anionrésű metabolikus acidózisban.',
    miert: 'Megmutatja, hogy az acidózis önmagában áll-e, vagy társul hozzá másik zavar is. Az 1 és 2 közötti érték felel meg a tiszta, emelkedett anionrésű acidózisnak.',
    megjegyzes: '1 alatti érték társuló, élettani anionrésű acidózisra, 2 feletti társuló metabolikus alkalózisra vagy krónikus légzési acidózisra utalhat.',
  },
  {
    key: 'pf', cim: 'P/F-hányados',
    mit: 'Az artériás oxigénnyomás és a belélegzett oxigénarány hányadosa.',
    miert: 'Az oxigenizációt a belélegzett oxigén mennyiségétől függetlenítve mutatja meg, ezért összehasonlíthatóvá teszi a különböző oxigénadagolás mellett vett mintákat.',
    megjegyzes: 'A 300 alatti érték az ARDS-besorolás egyik feltétele, de önmagában nem elegendő hozzá: a klinikai kép, az időbeliség és a képalkotás is szükséges.',
  },
  {
    key: 'aa', cim: 'Alveolo-arteriális gradiens',
    mit: 'A számított alveoláris és a mért artériás oxigénnyomás különbsége.',
    miert: 'Elkülöníti a hypoxia okát: élettani gradiens mellett hypoventiláció vagy alacsony belélegzett oxigénarány, emelkedett gradiens mellett tüdőeltérés vagy söntkeringés a valószínűbb.',
    megjegyzes: 'A szokásos 20 Hgmm-es felső határ csak szobalevegőn érvényes, és a gradiens az életkorral nő. Emelt oxigénadagolás mellett a P/F-hányados a használható mutató.',
  },
  {
    key: 'fio2', cim: 'FiO₂',
    mit: 'A belélegzett levegő oxigénaránya. Szobalevegőn 21%.',
    miert: 'Enélkül a pO₂ nem értelmezhető: a 70 Hgmm szobalevegőn és 80% oxigén mellett gyökeresen mást jelent.',
    megjegyzes: 'Orrszonda és egyszerű maszk mellett a tényleges FiO₂ csak becsülhető, mert függ a beteg légzési mintázatától.',
  },
]

export const fogalom = (key: string) => FOGALMAK.find((f) => f.key === key)
