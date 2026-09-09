// Az EKG atlasz elemeinek paraméterezése a 12 elvezetéses megjelenítőhöz.
//
// A gyakorló és a vizsga mód korábban egyetlen sematikus vonalat mutatott. Ez a
// felismerés tanulására kevés: a szárblokk oldalát, az ST-eltérés lokalizációját
// vagy a tengelyállást csak több elvezetésből lehet megítélni.
//
// Minden bejegyzés az `ECG` tömb egy azonosítójához tartozik (lib/ekg/data.ts).
// A görbék OKTATÁSI célra készülnek: felismerhetők és mérhetők, de nem valódi
// betegfelvételek.

import type { EcgParams } from './render'

export const ECG_PARAMS: Record<string, EcgParams> = {
  normal: {
    rate: 72, rhythm: 'sinus', p: 'normal', prMs: 160, qrsMs: 90, axis: 'normal', qtMs: 380, noise: 0.2,
  },
  brady: {
    rate: 46, rhythm: 'sinus', p: 'normal', prMs: 165, qrsMs: 92, axis: 'normal', qtMs: 430, noise: 0.2,
  },
  tachy: {
    rate: 122, rhythm: 'sinus', p: 'normal', prMs: 135, qrsMs: 86, axis: 'normal', qtMs: 285, noise: 0.25,
  },
  afib: {
    rate: 116, rhythm: 'afib', p: 'fibrillatory', prMs: 0, qrsMs: 88, axis: 'normal', qtMs: 330, noise: 0.35,
  },
  aflutter: {
    // A QT gyors ritmusnál élettanilag rövidül; 150/perc mellett a 255 ms
    // frekvenciakorrekció után élettani tartományban marad.
    rate: 150, rhythm: 'flutter', p: 'flutter', prMs: 0, qrsMs: 90, axis: 'normal', qtMs: 255, noise: 0.2,
  },
  svt: {
    // Keskeny QRS, nagyon szapora, szabályos ritmus; a P-hullám a QRS-be olvad.
    rate: 186, rhythm: 'sinus', p: 'absent', prMs: 0, qrsMs: 84, axis: 'normal', qtMs: 230, noise: 0.2,
  },
  vt: {
    rate: 168, rhythm: 'vt', p: 'absent', prMs: 0, qrsMs: 165, axis: 'extreme', qtMs: 260, noise: 0.25,
    t: { I: 'inverted', II: 'inverted', V5: 'inverted', V6: 'inverted' },
  },
  vfib: {
    rate: 300, rhythm: 'vfib', p: 'absent', prMs: 0, qrsMs: 0, axis: 'normal', qtMs: 0, noise: 0.4,
  },
  pvc: {
    // Sinusritmus, minden harmadik ütés kamrai extrasystole.
    rate: 74, rhythm: 'sinus', p: 'normal', prMs: 160, qrsMs: 92, axis: 'normal', qtMs: 380,
    ectopic: [2, 5], noise: 0.2,
  },
  av1: {
    rate: 62, rhythm: 'sinus', p: 'normal', prMs: 265, qrsMs: 90, axis: 'normal', qtMs: 400, noise: 0.2,
  },
  av2a: {
    rate: 58, rhythm: 'sinus', p: 'normal', prMs: 180, qrsMs: 92, axis: 'normal', qtMs: 400,
    avBlock: '2a', atrialRate: 82, noise: 0.2,
  },
  av2b: {
    rate: 58, rhythm: 'sinus', p: 'normal', prMs: 180, qrsMs: 128, axis: 'normal', qtMs: 400,
    avBlock: '2b', atrialRate: 80, noise: 0.2,
  },
  av3: {
    rate: 38, rhythm: 'junctional', p: 'normal', prMs: 0, qrsMs: 140, axis: 'left', qtMs: 470,
    avBlock: '3', atrialRate: 84, noise: 0.25,
  },
  rbbb: {
    rate: 76, rhythm: 'sinus', p: 'normal', prMs: 160, qrsMs: 145, axis: 'normal', qtMs: 400,
    bundle: 'rbbb', noise: 0.2,
  },
  lbbb: {
    rate: 74, rhythm: 'sinus', p: 'normal', prMs: 165, qrsMs: 155, axis: 'left', qtMs: 430,
    bundle: 'lbbb', noise: 0.2,
  },
  axis: {
    // Jobb tengelyeltérés: az I. elvezetés nettó negatív, az aVF pozitív.
    rate: 78, rhythm: 'sinus', p: 'normal', prMs: 155, qrsMs: 92, axis: 'right', qtMs: 370, noise: 0.2,
  },
  ischaemia: {
    rate: 84, rhythm: 'sinus', p: 'normal', prMs: 160, qrsMs: 90, axis: 'normal', qtMs: 380,
    st: { V4: -1.6, V5: -1.8, V6: -1.5, I: -1.0, aVL: -0.9 },
    t: { V4: 'inverted', V5: 'inverted', V6: 'inverted', I: 'inverted' },
    noise: 0.25,
  },
  stemi: {
    rate: 88, rhythm: 'sinus', p: 'normal', prMs: 158, qrsMs: 92, axis: 'normal', qtMs: 370,
    st: { V1: 2.4, V2: 4.6, V3: 5.0, V4: 3.4, I: 0.9, aVL: 1.1, III: -1.4, aVF: -1.1 },
    t: { V2: 'peaked', V3: 'peaked', V4: 'peaked' },
    q: ['V1', 'V2'], noise: 0.25,
  },
  nstemi: {
    rate: 92, rhythm: 'sinus', p: 'normal', prMs: 155, qrsMs: 90, axis: 'normal', qtMs: 380,
    st: { V2: -2.0, V3: -2.2, V4: -1.8, V5: -1.2 },
    t: { V2: 'biphasic', V3: 'inverted', V4: 'inverted', V5: 'inverted' },
    noise: 0.25,
  },
  hyperk: {
    rate: 52, rhythm: 'sinus', p: 'flattened', prMs: 235, qrsMs: 150, axis: 'normal', qtMs: 390,
    t: { I: 'peaked', II: 'peaked', III: 'peaked', aVF: 'peaked', V2: 'peaked', V3: 'peaked', V4: 'peaked', V5: 'peaked' },
    noise: 0.2,
  },
  hypok: {
    // A lapos T mellett az U-hullám a legjellemzőbb jel: a T után jelenik meg,
    // és összeolvadhat vele — ez adja a látszólag megnyúlt QT képét.
    rate: 64, rhythm: 'sinus', p: 'normal', prMs: 180, qrsMs: 94, axis: 'normal', qtMs: 440,
    st: { V4: -1.0, V5: -1.1, V6: -0.9, II: -0.7 },
    t: { II: 'flat', V3: 'flat', V4: 'flat', V5: 'flat', V6: 'flat' },
    u: { II: 1.6, V3: 2.0, V4: 2.2, V5: 1.8, V6: 1.4 },
    noise: 0.2,
  },
  hyperca: {
    // Rövid QT, az ST-szakasz gyakorlatilag eltűnik.
    rate: 70, rhythm: 'sinus', p: 'normal', prMs: 160, qrsMs: 90, axis: 'normal', qtMs: 290, noise: 0.2,
  },
  hypoca: {
    // Megnyúlt QT elsősorban az ST-szakasz megnyúlása miatt, megtartott T-alakkal.
    rate: 68, rhythm: 'sinus', p: 'normal', prMs: 160, qrsMs: 90, axis: 'normal', qtMs: 530, noise: 0.2,
  },
  pe: {
    rate: 114, rhythm: 'sinus', p: 'normal', prMs: 148, qrsMs: 94, axis: 'right', qtMs: 330,
    st: { V1: 0.8, III: 0.6 },
    t: { V1: 'inverted', V2: 'inverted', V3: 'inverted', III: 'inverted' },
    q: ['III'], noise: 0.3,
  },
  pericarditis: {
    // Diffúz, konkáv ST-eleváció reciprok eltérés nélkül; az aVR-ben depresszió.
    rate: 96, rhythm: 'sinus', p: 'normal', prMs: 155, qrsMs: 90, axis: 'normal', qtMs: 330,
    st: { I: 1.2, II: 1.6, III: 0.9, aVF: 1.3, V3: 1.5, V4: 1.6, V5: 1.4, V6: 1.1, aVR: -1.2 },
    // A PR-depresszió a pericarditis másik kulcsjegye — ez különíti el a
    // STEMI-től. Az aVR-ben fordítva: ott a PR elevált.
    pr: { I: -0.8, II: -1.0, aVF: -0.7, V4: -0.8, V5: -0.7, V6: -0.6, aVR: 0.8 },
    noise: 0.25,
  },
  pacemaker: {
    rate: 72, rhythm: 'paced', p: 'absent', prMs: 0, qrsMs: 155, axis: 'left', qtMs: 420,
    bundle: 'lbbb', noise: 0.2,
  },
  digoxin: {
    // Jellegzetes, teknőszerű ST-depresszió lapos vagy fordított T-vel.
    rate: 58, rhythm: 'sinus', p: 'normal', prMs: 215, qrsMs: 92, axis: 'normal', qtMs: 330,
    st: { V5: -1.4, V6: -1.3, II: -1.0, I: -0.8 },
    t: { V5: 'inverted', V6: 'inverted', II: 'flat' },
    noise: 0.2,
  },
  pediatric: {
    // Gyermekkori sajátosság: gyors alapfrekvencia, jobb kamrai túlsúly, V1–V3 T-inverzió.
    rate: 118, rhythm: 'sinus', p: 'normal', prMs: 120, qrsMs: 72, axis: 'right', qtMs: 300,
    t: { V1: 'inverted', V2: 'inverted', V3: 'inverted' },
    noise: 0.25,
  },
}

/** Van-e 12 elvezetéses görbe ehhez az atlasz-elemhez. */
export const hasParams = (id: string): boolean => id in ECG_PARAMS

export const paramsFor = (id: string): EcgParams | null => ECG_PARAMS[id] ?? null

/**
 * Mely elvezetésekben látszik legjobban az adott eltérés.
 * A válasz utáni kiemeléshez — hogy a felismerés helyhez kötődjön.
 */
export const ECG_FOCUS: Record<string, string[]> = {
  afib: ['II', 'V1'],
  aflutter: ['II', 'III', 'aVF'],
  rbbb: ['V1', 'V2', 'V6'],
  lbbb: ['V1', 'V2', 'V3', 'V5', 'V6'],
  stemi: ['V1', 'V2', 'V3', 'V4'],
  nstemi: ['V2', 'V3', 'V4', 'V5'],
  ischaemia: ['V4', 'V5', 'V6'],
  pericarditis: ['II', 'V4', 'V5', 'aVR'],
  pe: ['III', 'V1', 'V2', 'V3'],
  hyperk: ['II', 'V3', 'V4'],
  hypok: ['II', 'V4', 'V5'],
  hypoca: ['II', 'V5'],
  hyperca: ['II', 'V5'],
  digoxin: ['V5', 'V6'],
  axis: ['I', 'aVF'],
  av1: ['II'],
  av2a: ['II'],
  av2b: ['II'],
  av3: ['II'],
  pvc: ['II', 'V1'],
  pediatric: ['V1', 'V2', 'V3'],
}

/**
 * Miért éppen ezeket az elvezetéseket kell nézni.
 *
 * A kiemelés önmagában megmutatja, hol az eltérés — de nem tanít meg
 * felismerni. Az elvezetések nem véletlenszerűek: mindegyik a szív egy
 * meghatározott területére „néz rá”, és ebből következik, hogy melyik
 * kórkép hol látszik.
 *
 * Az elvezetések és a szívterületek megfeleltetése a nemzetközi
 * kardiológiai irányelvek szerinti, standard hozzárendelés.
 */
export const ECG_FOCUS_REASON: Record<string, string> = {
  afib:
    'A II. elvezetés mutatja a legtisztábban a pitvari tevékenységet, a V1 pedig a jobb pitvar fölött fekszik. Pitvarfibrillációban éppen az a lényeg, hogy itt sem látszik rendezett P-hullám — csak szabálytalan alapvonal-hullámzás. A hiány a lelet.',

  aflutter:
    'A II, III és aVF elvezetések alulról néznek a szívre, és ezek a pitvari ingerhullámot a legjobban rajzolják ki. A pitvarlebegés fűrészfog-mintázata itt a legfelismerhetőbb — más elvezetésben elmosódhat, és a kép egyszerű szapora ritmusnak látszik.',

  rbbb:
    'A V1 és V2 a jobb kamra fölött fekszik, ezért itt látszik a jobb szár blokkjára jellemző kettős csúcs, a nyúlfül alakú komplexus. A V6 azért kell mellé, mert ott a széles, elhúzódó S-hullám erősíti meg a kórismét — a két lelet együtt biztos.',

  lbbb:
    'A bal szár blokkjában a bal kamra késve aktiválódik. Ez a bal kamra fölötti elvezetésekben — V5, V6 — széles, bevágott R-hullámot ad, míg a V1 és V2 fölött mély, széles negatív komplexust. A két oldal együtt adja ki a képet.',

  stemi:
    'A V1–V4 a szív elülső falára néz, amit a bal elülső leszálló koszorúér lát el. Az itt megjelenő ST-eleváció ezért az elülső fal elzáródására utal. Az elvezetések és a koszorúerek megfeleltetése teszi lehetővé, hogy az EKG-ból az elzáródás helyére következtessünk.',

  nstemi:
    'Ugyanaz az elülső terület, mint a STEMI-nél — de itt ST-depresszió és T-inverzió látszik eleváció helyett. A lokalizáció ilyenkor is irányt ad, még ha a kép nem is teljes elzáródásra utal.',

  ischaemia:
    'A V4–V6 a szív oldalsó-csúcsi területére néz. A terheléses vagy nyugalmi ischaemia itt jelentkezik a leggyakrabban, mert ez a terület a legérzékenyebb a keringés csökkenésére.',

  pericarditis:
    'A pericarditis a szívburok egészét érinti, ezért az ST-eleváció nem egy koszorúér területére korlátozódik, hanem diffúz — ezt mutatja a II, V4 és V5 együttese. Az aVR azért kulcsfontosságú, mert az szemből, ellentétes irányból néz a szívre: ott depresszió látszik. Ez a kettősség — diffúz eleváció és aVR-depresszió — különíti el a szívinfarktustól, ahol az eltérés egy területre esik, és van reciprok jel.',

  pe:
    'A tüdőembólia a jobb szívfelet terheli meg hirtelen. A III. elvezetésben ezért jelenik meg Q-hullám és T-inverzió, az I. elvezetésben pedig S-hullám — ez a klasszikus mintázat. A V1–V3 a jobb kamra fölötti terület: az itteni T-inverzió a jobb kamra terhelésének jele. Fontos: a mintázat hiánya nem zárja ki a tüdőembóliát, és a leggyakoribb EKG-lelet valójában a sinus tachycardia.',

  hyperk:
    'A magas káliumszint a szívizomsejtek repolarizációját gyorsítja, ami magas, csúcsos, keskeny alapú T-hullámot ad. Ez a mellkasi elvezetésekben — V3, V4 — a legfeltűnőbb, mert ott a T-hullám amplitúdója eleve nagyobb. A II. elvezetés a P-hullám ellaposodásának megítéléséhez kell, ami a folyamat előrehaladtát jelzi.',

  hypok:
    'Az alacsony kálium a repolarizációt nyújtja meg. A T-hullám ellaposodik, és utána megjelenik az U-hullám — ez a V4 és V5 elvezetésben a legjobban látható. A kettő összeolvadhat, ami látszólagos QT-megnyúlást ad; ezért fontos tudni, hogy nem a QT nyúlt meg, hanem U-hullám jelent meg.',

  hypoca:
    'Az alacsony kalciumszint a szívizom plató-fázisát nyújtja meg, ami az ST-szakasz megnyúlásában jelenik meg — a T-hullám alakja közben változatlan marad. Ez a II. és V5 elvezetésben ítélhető meg a legmegbízhatóbban, ahol az ST-szakasz jól elkülönül.',

  hyperca:
    'A magas kalciumszint fordítva hat: rövidíti a plató-fázist, ezért az ST-szakasz megrövidül vagy eltűnik, és a T-hullám szinte közvetlenül a QRS után következik. Ugyanazok az elvezetések alkalmasak a megítélésére, mint az alacsony kalciumnál.',

  digoxin:
    'A digoxin jellegzetes, lefelé homorú ST-depressziót okoz — ezt szokás „bajusz” alakúnak nevezni. A V5 és V6 elvezetésben látszik a legjobban, ahol az R-hullám a legmagasabb. Fontos: ez a kép a szer hatását jelzi, nem a mérgezését — a kettő nem ugyanaz.',

  axis:
    'A tengelyállás megítéléséhez elég két elvezetés: az I. balra néz, az aVF lefelé. A két komplexus fő iránya együtt megadja, merre mutat az elektromos tengely. Ha mindkettő pozitív, a tengely élettani tartományban van.',

  av1:
    'Az ingervezetési zavarok megítéléséhez a II. elvezetés a legalkalmasabb, mert itt a P-hullám a legtisztábban látszik, és a PR-táv pontosan mérhető. Az első fokú blokknál minden P-hullámot QRS követ, csak késve.',

  av2a:
    'Ugyanaz az elv: a II. elvezetésben követhető végig, hogyan nyúlik a PR-táv ütésről ütésre, amíg egy QRS ki nem marad. Ez a fokozatos nyúlás különíti el a Mobitz I. típust a II. típustól.',

  av2b:
    'A II. elvezetésben látszik, hogy a PR-táv állandó marad, és a QRS váratlanul, előjel nélkül marad ki. Ez a különbség a Mobitz I-hez képest, és ez teszi a II. típust veszélyesebbé: bármikor teljes blokkba mehet át.',

  av3:
    'A teljes blokknál a pitvarok és a kamrák egymástól függetlenül működnek. A II. elvezetésben követhető, hogy a P-hullámok és a QRS-ek saját, egymástól eltérő ütemben jelennek meg — ez a függetlenség maga a lelet.',

  pvc:
    'A II. elvezetés a normál ütések és a korai, széles komplexusok összehasonlítására alkalmas: itt látszik a különbség az alakban és a szélességben. A V1 azt segít eldönteni, melyik kamrából indul a korai ütés — ez a morfológiából következtethető ki.',

  pediatric:
    'Gyermekkorban a jobb kamra viszonylagosan nagyobb, mint felnőttben, ezért a jobb kamra fölötti elvezetésekben — V1–V3 — magas R-hullám és inverz T-hullám élettani. Ezek felnőttnél kórosak lennének; a gyermek EKG-ját ezért nem szabad felnőtt mércével értékelni.',
}

