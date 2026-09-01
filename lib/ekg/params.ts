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
    rate: 122, rhythm: 'sinus', p: 'normal', prMs: 135, qrsMs: 86, axis: 'normal', qtMs: 320, noise: 0.25,
  },
  afib: {
    rate: 116, rhythm: 'afib', p: 'fibrillatory', prMs: 0, qrsMs: 88, axis: 'normal', qtMs: 330, noise: 0.35,
  },
  aflutter: {
    rate: 150, rhythm: 'flutter', p: 'flutter', prMs: 0, qrsMs: 90, axis: 'normal', qtMs: 300, noise: 0.2,
  },
  svt: {
    // Keskeny QRS, nagyon szapora, szabályos ritmus; a P-hullám a QRS-be olvad.
    rate: 186, rhythm: 'sinus', p: 'absent', prMs: 0, qrsMs: 84, axis: 'normal', qtMs: 260, noise: 0.2,
  },
  vt: {
    rate: 168, rhythm: 'vt', p: 'absent', prMs: 0, qrsMs: 165, axis: 'extreme', qtMs: 340, noise: 0.25,
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
    rate: 64, rhythm: 'sinus', p: 'normal', prMs: 180, qrsMs: 94, axis: 'normal', qtMs: 520,
    st: { V4: -1.0, V5: -1.1, V6: -0.9, II: -0.7 },
    t: { II: 'flat', V3: 'flat', V4: 'flat', V5: 'flat', V6: 'flat' },
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
    rate: 96, rhythm: 'sinus', p: 'normal', prMs: 155, qrsMs: 90, axis: 'normal', qtMs: 350,
    st: { I: 1.2, II: 1.6, III: 0.9, aVF: 1.3, V3: 1.5, V4: 1.6, V5: 1.4, V6: 1.1, aVR: -1.2 },
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
  lbbb: ['V1', 'V2', 'V5', 'V6'],
  stemi: ['V1', 'V2', 'V3', 'V4'],
  nstemi: ['V2', 'V3', 'V4'],
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
