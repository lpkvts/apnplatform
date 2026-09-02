import { EMPTY, type Values, type Sample } from './data'

/**
 * Gyakorló esetek a vérgázmodulhoz.
 *
 * A felhasználó először csak a klinikai helyzetet és az értékeket látja, és
 * maga elemzi. A megoldás — a várt megállapítások és a tanulság — csak utána
 * nyílik meg. Az értékek úgy vannak összeállítva, hogy a modul számításai
 * ténylegesen az adott képet adják ki.
 */

export type Szint = 'kezdo' | 'halado' | 'expert'

export const SZINT_LABEL: Record<Szint, string> = {
  kezdo: 'Kezdő',
  halado: 'Haladó',
  expert: 'Összetett',
}

export interface Eset {
  id: string
  szint: Szint
  cim: string
  /** A klinikai helyzet — ennyit lát az elemzés előtt. */
  vignetta: string
  sample: Sample
  values: Values
  /** A várt megállapítások, saját szavakkal. */
  megoldas: string[]
  /** Amit érdemes megjegyezni az esetből. */
  tanulsag: string
}

const v = (x: Partial<Values>): Values => ({ ...EMPTY, ...x })

export const ESETEK: Eset[] = [
  /* ── Kezdő ── */
  {
    id: 'resp-acidosis', szint: 'kezdo', cim: 'Álmosság, felszínes légzés',
    vignetta: '68 éves férfi, műtét utáni első nap. Erős fájdalomcsillapítás mellett álmos, '
      + 'a légzése felszínes, légzésszám 9/perc. Szobalevegőn.',
    sample: 'arterias',
    values: v({ ph: 7.26, pco2: 62, hco3: 26, po2: 62, sao2: 90, fio2: 0.21, kor: 68, legzesszam: 9 }),
    megoldas: [
      'Acidaemia: a pH 7,26.',
      'A pCO₂ emelkedett, a bikarbonát élettani — az eltérés légzési eredetű.',
      'A bikarbonát nem emelkedett meg érdemben, ami akut folyamatra utal: a vesekompenzáció napok alatt alakul ki.',
      'A pO₂ is csökkent, de az alveolo-arteriális gradiens élettani — hypoventiláció áll a háttérben, nem tüdőeltérés.',
    ],
    tanulsag: 'Ha a hypoxia mellett a pCO₂ emelkedett és a gradiens élettani, a probléma a légzés mennyisége, '
      + 'nem a tüdő gázcseréje. Ilyenkor az oxigénadagolás javítja a számot, de nem oldja meg az okot.',
  },
  {
    id: 'resp-alkalosis', szint: 'kezdo', cim: 'Szapora légzés, zsibbadó ujjak',
    vignetta: '24 éves nő, hirtelen kezdődő szapora légzés, mellkasi szorítás, ujjbegyzsibbadás. '
      + 'Légzésszám 30/perc, láztalan, szobalevegőn.',
    sample: 'arterias',
    values: v({ ph: 7.52, pco2: 27, hco3: 22, po2: 105, sao2: 99, fio2: 0.21, kor: 24, legzesszam: 30 }),
    megoldas: [
      'Alkalaemia: a pH 7,52.',
      'A pCO₂ csökkent — légzési eredetű alkalózis.',
      'A bikarbonát alig csökkent, ami akut folyamatra utal.',
      'Az oxigenizáció megtartott.',
    ],
    tanulsag: 'Akut légzési alkalózisban a bikarbonát nem csökken jelentősen: minden 10 Hgmm pCO₂-esésre kb. '
      + '2 mmol/l. A nagyobb csökkenés tartós hyperventilációra vagy társuló anyagcsere-zavarra utal.',
  },
  {
    id: 'met-acidosis', szint: 'kezdo', cim: 'Több napja tartó hasmenés',
    vignetta: '34 éves nő, négy napja tartó bőséges hasmenés, gyengeség. Vérnyomás 105/65 Hgmm, '
      + 'pulzus 96/perc, szobalevegőn.',
    sample: 'arterias',
    values: v({ ph: 7.29, pco2: 31, hco3: 15, na: 138, cl: 114, k: 3.1, alb: 40, lact: 1.4, kor: 34 }),
    megoldas: [
      'Acidaemia: a pH 7,29.',
      'A bikarbonát csökkent — anyagcsere-eredetű acidózis.',
      'A pCO₂ a Winter-képlet szerint várt tartományban van: a légzési kompenzáció megfelelő.',
      'Az anionrés élettani, a klorid emelkedett — bikarbonátvesztésre utal, ami illik a hasmenéshez.',
      'A laktát élettani, ami a hypoperfúzió ellen szól.',
    ],
    tanulsag: 'Az anionrés dönti el, merre kell tovább gondolkodni: élettani anionrés mellett bikarbonátvesztés, '
      + 'emelkedett mellett savtöbblet a valószínű.',
  },
  {
    id: 'met-alkalosis', szint: 'kezdo', cim: 'Ismétlődő hányás',
    vignetta: '52 éves férfi, három napja ismétlődő hányás, semmit nem tart magában. '
      + 'Száraz nyálkahártyák, pulzus 104/perc.',
    sample: 'arterias',
    values: v({ ph: 7.51, pco2: 47, hco3: 36, na: 140, cl: 92, k: 3.0, alb: 40, kor: 52 }),
    megoldas: [
      'Alkalaemia: a pH 7,51.',
      'A bikarbonát emelkedett — anyagcsere-eredetű alkalózis.',
      'A pCO₂ enyhén emelkedett: a légzési kompenzáció megfelelő.',
      'A klorid és a kálium is alacsony, ami a gyomorsav-vesztés jellemző kísérője.',
    ],
    tanulsag: 'A hányással járó metabolikus alkalózist a kálium- és kloridhiány tartja fenn. '
      + 'A pótlásuk nélkül a sav-bázis zavar sem rendeződik.',
  },

  /* ── Haladó ── */
  {
    id: 'copd', szint: 'halado', cim: 'COPD, rosszabbodó nehézlégzés',
    vignetta: '71 éves férfi, ismert COPD. Három napja fokozódó nehézlégzés, gennyes köpet. '
      + 'Orrszondán 2 l/perc oxigént kap. Nyugalomban is fullad, de éber, együttműködő.',
    sample: 'arterias',
    values: v({ ph: 7.33, pco2: 68, hco3: 35, po2: 58, sao2: 89, fio2: 0.28, kor: 71, legzesszam: 24 }),
    megoldas: [
      'Enyhe acidaemia: a pH 7,33.',
      'A pCO₂ jelentősen emelkedett — légzési eredet.',
      'A bikarbonát 35 mmol/l: ez jóval több, mint amit akut emelkedés magyarázna, tehát krónikus, részben kompenzált állapot.',
      'Az oxigenizáció csökkent, a P/F-hányados 207.',
    ],
    tanulsag: 'A krónikus és az akut légzési acidózis a bikarbonát mértékéből különíthető el. '
      + 'A krónikus állapotra rárakódó akut romlás („akut a krónikuson") a leggyakoribb kép: '
      + 'a bikarbonát krónikusan magas, a pH mégis savas irányba mozdul.',
  },
  {
    id: 'dka', szint: 'halado', cim: 'Szomjazás, hasi fájdalom, mély légzés',
    vignetta: '19 éves nő, két napja fokozódó szomjúság, bő vizeletürítés, hányinger, hasi fájdalom. '
      + 'Mély, sóhajtó légzés. Vércukra a helyszíni mérés szerint magas.',
    sample: 'arterias',
    values: v({ ph: 7.13, pco2: 17, hco3: 6, na: 134, cl: 96, k: 5.4, gluk: 28, lact: 1.8, alb: 40, kor: 19, legzesszam: 32 }),
    megoldas: [
      'Súlyos acidaemia: a pH 7,11.',
      'A bikarbonát nagyon alacsony — anyagcsere-eredetű acidózis.',
      'A pCO₂ 17 Hgmm, ami a Winter-képlet szerinti tartományban van: a légzési kompenzáció megfelelő. Ez a mély, sóhajtó légzés.',
      'Az anionrés jelentősen emelkedett, a laktát élettani — ketontestek állnak a háttérben.',
      'A delta-arány 1 és 2 között: önmagában álló, emelkedett anionrésű acidózis.',
      'A kálium a felső tartományban van, de a teljes testkészlet ilyenkor jellemzően kimerült.',
    ],
    tanulsag: 'A normálisnak látszó vagy magas kálium ketoacidózisban megtévesztő: az acidózis a káliumot a sejtekből '
      + 'a vérbe tolja. A kezelés megkezdésekor gyorsan eshet, ezért szoros követést igényel.',
  },
  {
    id: 'sepsis', szint: 'halado', cim: 'Láz, zavartság, alacsony vérnyomás',
    vignetta: '77 éves nő, két napja láz és zavartság. Vérnyomás 84/50 Hgmm, pulzus 118/perc, '
      + 'légzésszám 28/perc. Rezervoáros maszkon kap oxigént.',
    sample: 'arterias',
    values: v({ ph: 7.22, pco2: 25, hco3: 11, po2: 76, sao2: 94, fio2: 0.8, na: 137, cl: 101, k: 4.6, lact: 6.8, alb: 22, kor: 77, legzesszam: 28 }),
    megoldas: [
      'Acidaemia: a pH 7,21.',
      'A bikarbonát alacsony, a pCO₂ a várt tartományban — anyagcsere-eredet megfelelő légzési kompenzációval.',
      'Az anionrés a nyers számítás szerint 25, albuminra korrigálva még magasabb: az alacsony albumin elfedte volna a valódi mértéket.',
      'A laktát 6,8 mmol/l — jelentősen emelkedett.',
      'A P/F-hányados 95, ami súlyosan csökkent oxigenizáció.',
    ],
    tanulsag: 'Alacsony albumin mellett az anionrés korrekció nélkül félrevezet. Minden 10 g/l albuminhiány '
      + 'kb. 2,5 mmol/l-rel csökkenti a mért értéket — kritikus állapotú betegnél ez rendszeresen előfordul.',
  },

  /* ── Összetett ── */
  {
    id: 'kevert-1', szint: 'expert', cim: 'Hányás és romló vesefunkció',
    vignetta: '64 éves férfi, egy hete tartó hányás, csökkenő vizeletmennyiség. '
      + 'Kiszáradt, aluszékony. Ismert krónikus vesebetegség.',
    sample: 'arterias',
    values: v({ ph: 7.38, pco2: 38, hco3: 22, na: 140, cl: 88, k: 3.2, alb: 38, lact: 1.5, kor: 64 }),
    megoldas: [
      'A pH élettani — első ránézésre nincs eltérés.',
      'Az anionrés viszont 30 mmol/l: jelentősen emelkedett, ami savtöbbletre utal.',
      'A delta-arány jóval 2 fölött van: az emelkedett anionrésű acidózis mellett metabolikus alkalózis is fennáll.',
      'A két zavar kioltja egymást a pH-ban, de mindkettő fennáll: a hányás okozta alkalózis és a veseelégtelenség okozta acidózis.',
    ],
    tanulsag: 'Az élettani pH nem zárja ki a sav-bázis zavart. Az anionrés kiszámítása minden esetben indokolt, '
      + 'mert kevert zavarnál ez az egyetlen jel, ami elárulja a rejtett folyamatot.',
  },
  {
    id: 'kevert-2', szint: 'expert', cim: 'Görcsroham után',
    vignetta: '41 éves férfi, tanúk szerint néhány perces általános görcsroham. '
      + 'Az esemény után tíz perccel vett minta. Postiktális, szapora légzésű.',
    sample: 'arterias',
    values: v({ ph: 7.19, pco2: 52, hco3: 19, na: 141, cl: 103, k: 4.8, lact: 9.2, alb: 42, kor: 41 }),
    megoldas: [
      'Acidaemia: a pH 7,19.',
      'A pCO₂ emelkedett ÉS a bikarbonát csökkent — mindkettő az acidózis irányába mutat, tehát kevert zavar.',
      'Az anionrés emelkedett, a laktát 9,2 mmol/l: az izomtevékenység okozta laktát-acidózis.',
      'A légzési összetevő a görcsroham alatti elégtelen légzésből ered.',
    ],
    tanulsag: 'Ha a pCO₂ és a bikarbonát ellentétes irányba tér el a várttól — vagyis mindkettő ugyanabba az irányba '
      + 'billenti a pH-t —, kevert zavarról van szó, nem kompenzációról. A görcsroham utáni laktát jellemzően '
      + 'egy órán belül rendeződik, ezért az ismételt mérés informatív.',
  },
  {
    id: 'kevert-3', szint: 'expert', cim: 'Szalicilát-túladagolás gyanúja',
    vignetta: '29 éves nő, fülzúgás, hányinger, szapora légzés. A hozzátartozó szerint nagy mennyiségű '
      + 'fájdalomcsillapítót vehetett be. Éber, nyugtalan.',
    sample: 'arterias',
    values: v({ ph: 7.44, pco2: 22, hco3: 15, na: 139, cl: 102, k: 3.4, lact: 2.6, alb: 40, kor: 29, legzesszam: 34 }),
    megoldas: [
      'A pH a tartomány felső részén — látszólag rendben.',
      'A pCO₂ jelentősen csökkent, a bikarbonát is alacsony: mindkettő eltér.',
      'Az anionrés emelkedett: emelkedett anionrésű metabolikus acidózis áll fenn.',
      'A pCO₂ viszont alacsonyabb annál, mint amit a kompenzáció indokolna — egyidejű légzési alkalózis is fennáll.',
      'Ez a kettősség jellemző a szalicilát hatására: egyszerre serkenti a légzőközpontot és okoz anyagcsere-acidózist.',
    ],
    tanulsag: 'Ha a kompenzáció nagyobb mértékű a vártnál, az nem „jó kompenzáció", hanem önálló második zavar. '
      + 'A Winter-képlet éppen ezt teszi felismerhetővé.',
  },
]

export const esetekSzint = (sz: Szint) => ESETEK.filter((e) => e.szint === sz)
