// Gyakorló mód: klinikai kontextus és tévesztési párok.
//
// MIÉRT KONTEXTUS: az EKG-t a valóságban sosem önmagában nézzük. Egy rövid
// bemutatás megváltoztatja a gondolkodást — a 40/perces pulzus melletti szédülés
// más súlyú, mint ugyanaz a görbe panasz nélkül —, és közelebb viszi a gyakorlást
// a tényleges munkához.
//
// MIÉRT TÉVESZTÉSI PÁROK: a véletlenszerű válaszlehetőségek olcsó kérdéseket adnak.
// Ha a kamrafibrilláció mellett normál EKG és elsőfokú AV-blokk szerepel, a
// találgatás is működik. A valódi tanulás ott van, ahol a kórképek egymásra
// hasonlítanak: jobb és bal szárblokk, Wenckebach és Mobitz II, ST-eleváció és
// pericarditis. Ezért minden elemhez azokat a kórképeket soroljuk fel, amelyekkel
// a gyakorlatban is összetéveszthető.

/**
 * Nehézségi szint. Nem az elméleti bonyolultság, hanem az dönti el, mennyire
 * könnyű összetéveszteni: a kamrafibrilláció súlyos kórkép, felismerni mégis
 * egyszerű, míg a hypo- és hypercalcaemia elkülönítése finom munka.
 */
export type Level = 'kezdo' | 'halado' | 'gyakorlott'

export const LEVEL_LABEL: Record<Level, string> = {
  kezdo: 'Kezdő', halado: 'Haladó', gyakorlott: 'Gyakorlott',
}

/**
 * Második lépcső: hol látszik az eltérés. A puszta alakfelismerés kevés —
 * a lokalizáció adja a klinikai jelentést. Csak ott van értelme, ahol a hely
 * ténylegesen informatív; ritmuszavaroknál nem.
 */
export interface Localize {
  question: string
  options: { id: string; label: string }[]
  correct: string
  explain: string
}

export interface PracticeMeta {
  /** Rövid klinikai bemutatás a kérdés előtt. */
  vignette: string
  /** Kórképek, amelyekkel a gyakorlatban összetéveszthető — ezek lesznek a csalik. */
  confuse: string[]
  /** Mire figyelj legközelebb — a válasz után jelenik meg. */
  tip?: string
  level: Level
  localize?: Localize
}

export const PRACTICE_META: Record<string, PracticeMeta> = {
  normal: {
    vignette: '34 éves nő, üzemorvosi szűrés. Panaszmentes, terhelhetősége jó.',
    confuse: ['brady', 'tachy', 'av1'],
    tip: 'Élettani lelet felismerése ugyanolyan fontos, mint a kórosé — enélkül minden apró eltérés riasztónak tűnik.',
    level: 'kezdo',
  },
  brady: {
    vignette: '71 éves férfi, fáradékonyság. Pulzus 46/perc, vérnyomás 118/70 Hgmm. Béta-blokkolót szed.',
    confuse: ['normal', 'av1', 'av3'],
    tip: 'Sinus bradycardiánál minden QRS-t P-hullám előz meg, állandó PR-rel. Ha a P-k és a QRS-ek függetlenek, teljes AV-blokkról van szó.',
    level: 'kezdo',
  },
  tachy: {
    vignette: '28 éves nő, lázas állapot második napja. Pulzus 120/perc, testhő 38,7 °C.',
    confuse: ['svt', 'aflutter', 'afib'],
    tip: 'Sinus tachycardiánál a P-hullám még felismerhető, és a frekvencia fokozatosan változik. A hirtelen kezdődő, 150 fölötti szabályos ritmus inkább supraventricularis eredetre utal.',
    level: 'kezdo',
  },
  afib: {
    vignette: '76 éves nő, szívdobogásérzés tegnap este óta. Pulzus egyenetlen, kb. 115/perc.',
    confuse: ['aflutter', 'tachy', 'pvc'],
    tip: 'A „szabálytalanul szabálytalan” ritmus és az egységes P-hullám hiánya együtt adja a képet. Flutternél a kamrai ritmus jellemzően szabályos.',
    level: 'kezdo',
  },
  aflutter: {
    vignette: '66 éves férfi, egyenletesnek érzett szapora szívverés. Pulzus 150/perc, szabályos.',
    confuse: ['afib', 'svt', 'tachy'],
    tip: 'A makacsul 150/perc körüli szabályos ritmus mindig felveti a 2:1 átvezetésű fluttert — keresd a fűrészfogat a II, III és aVF elvezetésben.',
    level: 'halado',
  },
  svt: {
    vignette: '31 éves nő, hirtelen kezdődött szívdobogásérzés. Pulzus 185/perc, szabályos.',
    confuse: ['aflutter', 'tachy', 'vt'],
    tip: 'Keskeny QRS, nagyon szapora, szabályos ritmus, felismerhető P-hullám nélkül. Ha a QRS széles, kamrai eredetet kell először mérlegelni.',
    level: 'halado',
  },
  vt: {
    vignette: '64 éves férfi, mellkasi nyomás és szédülés. Pulzus 170/perc, vérnyomás 88/54 Hgmm.',
    confuse: ['svt', 'vfib', 'pvc'],
    tip: 'Széles QRS-ű tachycardiát mindig kamrai eredetűnek tekintünk, amíg az ellenkezője be nem bizonyosodik — különösen ismert szívbetegség mellett.',
    level: 'halado',
  },
  vfib: {
    vignette: 'Összeesett beteg, nem reagál, légzés és tapintható pulzus nincs.',
    confuse: ['vt', 'aflutter', 'pvc'],
    tip: 'Nincs felismerhető QRS, csak kaotikus hullámzás. Ha a beteg nem reagál és nincs pulzus, azonnali újraélesztés indul — a monitor értelmezésére nem várunk.',
    level: 'kezdo',
  },
  pvc: {
    vignette: '52 éves férfi, alkalmankénti „kihagyó” szívverés érzése. Pulzus 74/perc.',
    confuse: ['vt', 'av2b', 'afib'],
    tip: 'A beékelt széles komplexus előtt nincs P-hullám, utána kompenzációs szünet következik. Három egymást követő már kamrai tachycardia.',
    level: 'kezdo',
  },
  av1: {
    vignette: '58 éves nő, rutin EKG. Panaszmentes, pulzus 62/perc.',
    confuse: ['normal', 'av2a', 'av2b'],
    tip: 'Minden P-hullámot QRS követ, csak a PR hosszabb 200 ms-nál. Ha bármelyik QRS kimarad, már másodfokú blokkról van szó.',
    level: 'kezdo',
  },
  av2a: {
    vignette: '69 éves férfi, alkalmankénti szédülés. Pulzus egyenetlen, kb. 55/perc.',
    confuse: ['av2b', 'av1', 'av3'],
    tip: 'A PR ütésről ütésre nyúlik, majd egy QRS kimarad, és a ciklus újraindul. Mérd meg a kimaradás előtti és utáni PR-t — ez különbözteti meg a Mobitz II-től.',
    level: 'halado',
  },
  av2b: {
    vignette: '73 éves nő, terhelésre jelentkező szédülés, egy alkalommal eszméletvesztés.',
    confuse: ['av2a', 'av3', 'av1'],
    tip: 'A PR állandó, a QRS előjel nélkül marad ki. Ez a forma instabilabb a Wenckebachnál, mert teljes blokkba mehet át.',
    level: 'halado',
  },
  av3: {
    vignette: '78 éves nő, ismétlődő szédülés, ma reggel rövid eszméletvesztés. Pulzus 38/perc.',
    confuse: ['av2b', 'brady', 'av2a'],
    tip: 'A P-hullámok és a QRS-ek saját ütemben, egymástól függetlenül jelennek meg. Keress olyan P-t, ami közvetlenül a QRS előtt van, mégsem tartozik hozzá.',
    level: 'halado',
  },
  rbbb: {
    vignette: '61 éves férfi, terhelésre jelentkező nehézlégzés. Pulzus 76/perc.',
    confuse: ['lbbb', 'pacemaker', 'vt'],
    tip: 'A V1-ben kettős csúcsú, rsR-alakú komplexus, a lateralis elvezetésekben elhúzódó S. A jobb szárblokk önmagában gyakran ártalmatlan.',
    level: 'halado',
    localize: {
      question: 'Melyik elvezetésben látod a jellegzetes, kettős csúcsú rsR alakot?',
      options: [
        { id: 'v12', label: 'V1–V2' },
        { id: 'v56', label: 'V5–V6' },
        { id: 'inf', label: 'II, III, aVF' },
        { id: 'avr', label: 'aVR' },
      ],
      correct: 'v12',
      explain: 'A V1–V2 elvezetésben. A lateralis elvezetésekben ehhez elhúzódó S-hullám társul.',
    },
  },
  lbbb: {
    vignette: '68 éves nő, ismert szívelégtelenség, romló terhelhetőség. Pulzus 74/perc.',
    confuse: ['rbbb', 'pacemaker', 'vt'],
    tip: 'A V1–V3 elvezetésben mély, széles QS, a V5–V6-ban széles, bevágott R. Új keletű bal szárblokk mellkasi fájdalommal együtt sürgős értékelést igényel.',
    level: 'halado',
    localize: {
      question: 'Hol látod a mély, széles QS-komplexust?',
      options: [
        { id: 'v13', label: 'V1–V3' },
        { id: 'v56', label: 'V5–V6' },
        { id: 'inf', label: 'II, III, aVF' },
        { id: 'avl', label: 'aVL' },
      ],
      correct: 'v13',
      explain: 'A V1–V3 elvezetésben. A V5–V6-ban ezzel szemben széles, bevágott R-hullám látszik.',
    },
  },
  ischaemia: {
    vignette: '59 éves férfi, terhelésre jelentkező mellkasi szorítás, nyugalomban enyhül.',
    confuse: ['nstemi', 'hypok', 'digoxin'],
    tip: 'Vízszintes vagy lefelé tartó ST-depresszió a lateralis elvezetésekben. A digoxin okozta teknőszerű depressziótól az alak és a gyógyszer-anamnézis különíti el.',
    level: 'halado',
    localize: {
      question: 'Mely területen látod az ST-depressziót?',
      options: [
        { id: 'inf', label: 'Inferior (II, III, aVF)' },
        { id: 'ant', label: 'Anteroseptalis (V1–V4)' },
        { id: 'lat', label: 'Lateralis (I, aVL, V5–V6)' },
        { id: 'diff', label: 'Diffúzan, több területen' },
      ],
      correct: 'lat',
      explain: 'A V4–V6 és az I, aVL elvezetésben — ez a lateralis terület.',
    },
  },
  stemi: {
    vignette: '58 éves férfi, egy órája tartó nyomó mellkasi fájdalom, verejtékezés, halálfélelem.',
    confuse: ['pericarditis', 'ischaemia', 'nstemi'],
    tip: 'Az eleváció területhez kötött, és reciprok depresszió kíséri. A pericarditis diffúz, konkáv elevációt ad reciprok eltérés nélkül, aVR-ben depresszióval.',
    level: 'kezdo',
    localize: {
      question: 'Mely területen látod az ST-elevációt?',
      options: [
        { id: 'inf', label: 'Inferior (II, III, aVF)' },
        { id: 'ant', label: 'Anteroseptalis (V1–V4)' },
        { id: 'lat', label: 'Lateralis (I, aVL, V5–V6)' },
        { id: 'diff', label: 'Diffúzan, több területen' },
      ],
      correct: 'ant',
      explain: 'Az eleváció a V1–V4 elvezetésben látszik, ami az anteroseptalis falat képezi le. Az inferior elvezetésekben reciprok depresszió kíséri.',
    },
  },
  nstemi: {
    vignette: '67 éves nő, nyugalmi mellkasi fájdalom, emelkedett troponinszint.',
    confuse: ['ischaemia', 'stemi', 'hypok'],
    tip: 'ST-depresszió és T-inverzió ST-eleváció nélkül. A troponin dönti el, hogy infarktusról vagy instabil anginaról van-e szó — az EKG önmagában nem.',
    level: 'gyakorlott',
    localize: {
      question: 'Hol a legkifejezettebb az ST-depresszió és a T-inverzió?',
      options: [
        { id: 'inf', label: 'Inferior (II, III, aVF)' },
        { id: 'ant', label: 'Anteroseptalis (V1–V4)' },
        { id: 'lat', label: 'Lateralis (I, aVL, V5–V6)' },
        { id: 'diff', label: 'Diffúzan, több területen' },
      ],
      correct: 'ant',
      explain: 'A V2–V5 elvezetésben, tehát az anterior területen. A lokalizáció itt is irányt ad, még ST-eleváció hiányában is.',
    },
  },
  hyperk: {
    vignette: '58 éves férfi, művesekezelés kihagyása után gyengeség, izomgyengeség.',
    confuse: ['hypok', 'vt', 'av1'],
    tip: 'Magas, keskeny alapú, csúcsos T-hullám a legkorábbi jel. A QRS szélesedése súlyosabb fokozatot jelez.',
    level: 'kezdo',
    localize: {
      question: 'Hol a legfeltűnőbb a magas, csúcsos T-hullám?',
      options: [
        { id: 'chest', label: 'A mellkasi elvezetésekben' },
        { id: 'avr', label: 'Csak az aVR-ben' },
        { id: 'inf', label: 'Csak az inferior elvezetésekben' },
        { id: 'v1', label: 'Csak a V1-ben' },
      ],
      correct: 'chest',
      explain: 'Jellemzően a mellkasi elvezetésekben a legkifejezettebb, de több elvezetésben megjelenik. A P-hullám ellaposodása és a QRS szélesedése a súlyosbodást jelzi.',
    },
  },
  hypok: {
    vignette: '71 éves nő, vízhajtó szedése mellett hasmenés, lábikragörcsök.',
    confuse: ['hyperk', 'hypoca', 'digoxin'],
    tip: 'Lapos T, ST-depresszió és U-hullám a jellegzetes hármas. A magnéziumot is ellenőrizni kell, mert alacsony szintje mellett a káliumpótlás hatástalan marad.',
    level: 'gyakorlott',
    localize: {
      question: 'Hol a legfeltűnőbb a lapos T és az ST-depresszió?',
      options: [
        { id: 'inf', label: 'Inferior (II, III, aVF)' },
        { id: 'ant', label: 'Anteroseptalis (V1–V4)' },
        { id: 'lat', label: 'Lateralis (I, aVL, V5–V6)' },
        { id: 'diff', label: 'Diffúzan, több területen' },
      ],
      correct: 'lat',
      explain: 'A lateralis elvezetésekben a legkifejezettebb, de a kép jellemzően több elvezetésben megjelenik.',
    },
  },
  hyperca: {
    vignette: '64 éves férfi, daganatos alapbetegség, zavartság és székrekedés.',
    confuse: ['hypoca', 'normal', 'hypok'],
    tip: 'Rövid QT az ST-szakasz megrövidülése miatt — a T-hullám szinte közvetlenül a QRS után kezdődik.',
    level: 'gyakorlott',
  },
  hypoca: {
    vignette: '46 éves nő, pajzsmirigyműtét után szájkörüli zsibbadás, izomgörcsök.',
    confuse: ['hyperca', 'hypok', 'normal'],
    tip: 'Megnyúlt QT, de a T-hullám alakja megtartott — a nyúlás az ST-szakaszból ered. Hypokalaemiában a T is ellaposodik.',
    level: 'gyakorlott',
  },
  pe: {
    vignette: '44 éves nő, két hete térdműtét. Hirtelen nehézlégzés, szúró mellkasi fájdalom, SpO₂ 91%.',
    confuse: ['stemi', 'rbbb', 'tachy'],
    tip: 'A sinus tachycardia a leggyakoribb, de a legkevésbé specifikus jel. A jobbszív-terhelés jelei támogatják a gyanút, de a normális EKG nem zárja ki a kórképet.',
    level: 'gyakorlott',
    localize: {
      question: 'Mely elvezetésekben látod a T-inverziót?',
      options: [
        { id: 'v13', label: 'V1–V3' },
        { id: 'v46', label: 'V4–V6' },
        { id: 'inf', label: 'II, III, aVF' },
        { id: 'lat', label: 'I, aVL' },
      ],
      correct: 'v13',
      explain: 'A V1–V3 elvezetésben — ez a jobbszív-terhelés egyik leggyakoribb jele. A III. elvezetésben szintén megjelenhet.',
    },
  },
  pericarditis: {
    vignette: '32 éves férfi, előrehajolva enyhülő mellkasi fájdalom, néhány napja vírusos felső légúti panasz.',
    confuse: ['stemi', 'ischaemia', 'normal'],
    tip: 'Diffúz, konkáv ST-eleváció több területen, reciprok depresszió nélkül, az aVR-ben depresszióval. Az infarktus elevációja területhez kötött.',
    level: 'gyakorlott',
    localize: {
      question: 'Hogyan oszlik el az ST-eleváció?',
      options: [
        { id: 'inf', label: 'Inferior (II, III, aVF)' },
        { id: 'ant', label: 'Anteroseptalis (V1–V4)' },
        { id: 'lat', label: 'Lateralis (I, aVL, V5–V6)' },
        { id: 'diff', label: 'Diffúzan, több területen' },
      ],
      correct: 'diff',
      explain: 'Több területen egyszerre, reciprok depresszió nélkül. Ez a diffúz elrendeződés különíti el az infarktus területhez kötött elevációjától; az aVR-ben depresszió látható.',
    },
  },
  pacemaker: {
    vignette: '80 éves férfi, két éve beültetett pacemaker. Rutin ellenőrzés, panaszmentes.',
    confuse: ['lbbb', 'vt', 'av3'],
    tip: 'Keresd a keskeny ingerképző tüskét közvetlenül a széles komplexus előtt. Jobb kamrai ingerlésnél a kép bal szárblokkra emlékeztet.',
    level: 'halado',
  },
  digoxin: {
    vignette: '77 éves nő, pitvarfibrilláció miatt digoxint szed. Rutin ellenőrzés.',
    confuse: ['ischaemia', 'hypok', 'nstemi'],
    tip: 'A jellegzetes teknőszerű ST-depresszió a hatás jele, nem a mérgezésé. A toxicitást a klinikai kép és a szint dönti el, nem az EKG alakja.',
    level: 'gyakorlott',
    localize: {
      question: 'Mely elvezetésekben látod a teknőszerű ST-depressziót?',
      options: [
        { id: 'inf', label: 'Inferior (II, III, aVF)' },
        { id: 'ant', label: 'Anteroseptalis (V1–V4)' },
        { id: 'lat', label: 'Lateralis (I, aVL, V5–V6)' },
        { id: 'diff', label: 'Diffúzan, több területen' },
      ],
      correct: 'lat',
      explain: 'A V5–V6 és az I, II elvezetésben, tehát a lateralis területen — ott, ahol a QRS fő iránya pozitív.',
    },
  },
  pediatric: {
    vignette: '3 éves kisfiú, rutin vizsgálat műtét előtt. Pulzus 118/perc.',
    confuse: ['tachy', 'pe', 'axis'],
    tip: 'A gyors alapfrekvencia, a jobb kamrai túlsúly és a V1–V3 T-inverzió ebben az életkorban élettani — felnőttnél ugyanez kóros lenne.',
    level: 'gyakorlott',
  },
  axis: {
    vignette: '55 éves férfi, ismert krónikus tüdőbetegség. Rutin EKG.',
    confuse: ['pe', 'rbbb', 'normal'],
    tip: 'Az I. elvezetés nettó negatív, az aVF pozitív — jobb tengelyeltérés. A két elvezetés iránya együtt dönt.',
    level: 'halado',
    localize: {
      question: 'Melyik két elvezetés iránya dönti el a frontális tengelyállást?',
      options: [
        { id: 'i_avf', label: 'I és aVF' },
        { id: 'ii_iii', label: 'II és III' },
        { id: 'v1_v6', label: 'V1 és V6' },
        { id: 'avr_avl', label: 'aVR és aVL' },
      ],
      correct: 'i_avf',
      explain: 'Az I. és az aVF elvezetés. Ha mindkettő pozitív, a tengely normális; itt az I. negatív és az aVF pozitív, ami jobb tengelyeltérést jelent.',
    },
  },
}

export const practiceMeta = (id: string): PracticeMeta | null => PRACTICE_META[id] ?? null

/**
 * Válaszlehetőségek: elsősorban a valóságban is összetéveszthető kórképek.
 * Ha kevés a tévesztési pár, véletlen elemekkel egészítjük ki.
 */
export function practiceOptions(correct: string, pool: string[], shuffleFn: <T>(a: T[]) => T[]): string[] {
  const meta = PRACTICE_META[correct]
  const near = (meta?.confuse ?? []).filter((id) => id !== correct && pool.includes(id))
  const picked = shuffleFn(near).slice(0, 3)
  if (picked.length < 3) {
    const rest = shuffleFn(pool.filter((id) => id !== correct && !picked.includes(id)))
    picked.push(...rest.slice(0, 3 - picked.length))
  }
  return shuffleFn([correct, ...picked])
}
