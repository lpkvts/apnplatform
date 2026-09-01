// 12 elvezetéses EKG-görbe generálása paraméterekből.
//
// MIÉRT GENERÁLT: a meglévő ECG_WAVES elemenként egyetlen, előszámított görbét tárol —
// az atlasz nézethez ez elég. Az elemzéshez viszont 12 elvezetés kell, mérhető
// intervallumokkal és elvezetésenként eltérő ST/T eltéréssel. Ezt paraméteres
// szintézissel oldjuk meg: így egy új eset néhány sor adat, nem ezer pont.
//
// A görbék OKTATÁSI célra készülnek: felismerhetők és mérhetők, de nem valódi
// betegfelvételek, és nem alkalmasak diagnosztikai célra.

export const LEADS = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'] as const
export type Lead = (typeof LEADS)[number]

export type Rhythm = 'sinus' | 'sinus-irregular' | 'afib' | 'flutter' | 'vt' | 'paced' | 'junctional' | 'vfib'
export type Bundle = 'lbbb' | 'rbbb'
export type AvBlock = '1' | '2a' | '2b' | '3'
export type PShape = 'normal' | 'absent' | 'fibrillatory' | 'flutter' | 'inverted' | 'varying' | 'flattened'
export type Axis = 'normal' | 'left' | 'right' | 'extreme'
export type TShape = 'normal' | 'inverted' | 'peaked' | 'flat' | 'biphasic'

export interface EcgParams {
  rate: number                          // kamrai frekvencia (/perc)
  rhythm: Rhythm
  p: PShape
  prMs: number                          // PR-intervallum (ms); 0 ha nincs P
  qrsMs: number                         // QRS-szélesség (ms)
  axis: Axis
  qtMs: number                          // mért QT (ms)
  st?: Partial<Record<Lead, number>>    // ST-eltérés mm-ben (+ eleváció, − depresszió)
  t?: Partial<Record<Lead, TShape>>
  q?: Lead[]                            // kóros Q-hullámmal járó elvezetések
  avBlock?: AvBlock                     // ingervezetési zavar
  atrialRate?: number                   // pitvari frekvencia AV-blokknál (alap: 78)
  bundle?: Bundle                       // szárblokk-morfológia
  ectopic?: number[]                    // hányadik ütés kamrai extrasystole (0-alapú)
  noise?: number                        // alapvonal-ingadozás mértéke (0–1)
}

/* ─────────── Elvezetés-specifikus amplitúdók ─────────── */

// A QRS nettó iránya és nagysága elvezetésenként, a frontális tengely szerint.
const AXIS_GAIN: Record<Axis, Record<string, number>> = {
  normal:  { I: 0.60, II: 1.00, III: 0.50, aVR: -0.90, aVL: 0.15, aVF: 0.80 },
  left:    { I: 1.00, II: 0.28, III: -0.55, aVR: -0.70, aVL: 0.90, aVF: -0.32 },
  right:   { I: -0.50, II: 0.60, III: 1.00, aVR: -0.30, aVL: -0.90, aVF: 0.90 },
  extreme: { I: -0.60, II: -0.80, III: -0.50, aVR: 0.60, aVL: 0.20, aVF: -0.90 },
}

// Mellkasi elvezetések: R-progresszió V1→V6 (r = R amplitúdó, s = S mélység).
const CHEST: Record<string, { r: number; s: number }> = {
  V1: { r: 0.15, s: -0.90 }, V2: { r: 0.30, s: -0.95 }, V3: { r: 0.60, s: -0.60 },
  V4: { r: 0.95, s: -0.35 }, V5: { r: 1.00, s: -0.20 }, V6: { r: 0.85, s: -0.10 },
}

// P-hullám relatív amplitúdója elvezetésenként (aVR-ben élettanilag negatív).
const P_GAIN: Record<string, number> = {
  I: 0.7, II: 1.0, III: 0.4, aVR: -0.8, aVL: 0.3, aVF: 0.8,
  V1: 0.4, V2: 0.5, V3: 0.4, V4: 0.4, V5: 0.4, V6: 0.3,
}

function leadGain(lead: Lead, axis: Axis): number {
  if (lead in AXIS_GAIN[axis]) return AXIS_GAIN[axis][lead]
  return CHEST[lead].r + CHEST[lead].s * -0.35 // mellkasi nettó irány közelítése
}

/* ─────────── Görbeszintézis ─────────── */

// Determinisztikus álvéletlen: ugyanaz a paraméter mindig ugyanazt a görbét adja,
// így a mérési feladatok reprodukálhatók.
function rnd(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const gauss = (t: number, center: number, width: number, amp: number) =>
  amp * Math.exp(-((t - center) ** 2) / (2 * width ** 2))

// A P- és T-hullám fél szélessége másodpercben. A görbeszintézis és a mérőjelek
// ugyanezt használják, így a rárajzolt jelölés pontosan a hullámra esik.
const P_HALF = 0.055
const T_HALF = 0.11

/** A T-hullám fél szélessége az adott ütéshez, a rendelkezésre álló időhöz igazítva. */
function tHalf(qtS: number, qrsS: number): number {
  return Math.max(0.03, Math.min(T_HALF, (qtS - qrsS) * 0.45))
}

/**
 * Az ütések időpontjai másodpercben.
 *
 * FONTOS: ez elvezetés-FÜGGETLEN. Korábban a szabálytalan ritmus (pitvarfibrilláció)
 * R–R szórása a görbeszintézis lead-függő álvéletlenéből jött, így ugyanaz az ütés
 * a II. és a V1 elvezetésen más időpontra esett — ami fizikailag hibás, hiszen egy
 * szívről van szó. Az ütésidőpontokat ezért közös magból számoljuk.
 */
export interface Beat {
  t: number            // az R-csúcs időpontja
  wide: boolean        // kamrai eredetű (széles) komplexus
  early?: boolean      // korai ütés (extrasystole)
}

/**
 * A ritmus időzítése: mikor van P-hullám és mikor QRS.
 *
 * A kettőt külön kell kezelni, mert AV-blokkban a pitvarok és a kamrák
 * függetlenül működhetnek. A visszaadott `prOf` megmondja, melyik P-hez
 * milyen PR-rel tartozik QRS — ebből rajzolható a Wenckebach-jelenség.
 */
export interface Timing {
  pTimes: number[]
  beats: Beat[]
  prOf: Map<number, number>   // P-időpont → PR (s), ha van átvezetés
}

export function timing(p: EcgParams, seconds: number): Timing {
  const rr = 60 / Math.max(20, p.rate)
  const rand = rnd(Math.round(p.rate * 7 + p.qrsMs * 13 + p.prMs * 3 + 101))
  const pTimes: number[] = []
  const beats: Beat[] = []
  const prOf = new Map<number, number>()
  const wideBase = p.qrsMs >= 120 || p.rhythm === 'vt' || p.rhythm === 'paced'

  // ── Kamrafibrilláció: nincs szervezett aktivitás ──
  if (p.rhythm === 'vfib') return { pTimes, beats, prOf }

  // ── AV-blokkok: a pitvari ütem független ──
  if (p.avBlock === '2a' || p.avBlock === '2b' || p.avBlock === '3') {
    const aRate = p.atrialRate ?? 78
    const pp = 60 / aRate
    let t = 0.22
    let i = 0
    while (t < seconds + pp) {
      pTimes.push(t)
      if (p.avBlock === '2a') {
        // Wenckebach: a PR ciklusonként nyúlik, majd egy QRS kimarad.
        const step = i % 4
        if (step < 3) {
          const pr = (p.prMs + step * 55) / 1000
          prOf.set(t, pr)
          beats.push({ t: t + pr + p.qrsMs / 2000, wide: wideBase })
        }
      } else if (p.avBlock === '2b') {
        // Mobitz II: állandó PR, hirtelen kimaradó QRS.
        if (i % 4 !== 3) {
          const pr = p.prMs / 1000
          prOf.set(t, pr)
          beats.push({ t: t + pr + p.qrsMs / 2000, wide: wideBase })
        }
      }
      t += pp
      i++
    }
    if (p.avBlock === '3') {
      // Teljes blokk: a kamrákat saját, lassabb pótritmus tartja fenn.
      let b = 0.35
      while (b < seconds + rr) { beats.push({ t: b, wide: wideBase }); b += rr }
    }
    return { pTimes, beats, prOf }
  }

  // ── Szabályos és szabálytalan ritmusok ──
  const ect = new Set(p.ectopic ?? [])
  let t = 0.25
  let i = 0
  while (t < seconds + rr) {
    const isEct = ect.has(i)
    beats.push({ t, wide: isEct ? true : wideBase, early: isEct })
    if (!isEct && p.prMs > 0 && p.p !== 'absent' && p.p !== 'fibrillatory' && p.p !== 'flutter') {
      const pr = p.prMs / 1000
      const pt = t - p.qrsMs / 2000 - pr
      if (pt > 0) { pTimes.push(pt); prOf.set(pt, pr) }
    }
    let step = rr
    if (p.rhythm === 'afib' || p.rhythm === 'sinus-irregular') step = rr * (0.72 + rand() * 0.56)
    // Az extrasystole korán érkezik, utána kompenzációs szünet következik.
    if (ect.has(i + 1)) step *= 0.62
    else if (isEct) step *= 1.42
    t += step
    i++
  }
  return { pTimes, beats, prOf }
}

/** Az ütések (R-csúcsok) időpontjai. Elvezetés-független. */
export function beatTimes(p: EcgParams, seconds: number): number[] {
  return timing(p, seconds).beats.map((b) => b.t)
}

/**
 * Egy ütés mérési pontjai másodpercben. A generált görbével egyező geometria —
 * így a rárajzolt mérőjelek pontosan oda esnek, ahol a hullámok vannak.
 */
export interface Landmarks {
  beat: number
  pStart: number; pEnd: number
  qrsStart: number; qrsEnd: number
  jPoint: number
  tStart: number; tEnd: number
  qtEnd: number
}

export function landmarks(p: EcgParams, beat: number): Landmarks {
  const qrsS = p.qrsMs / 1000
  const prS = p.prMs / 1000
  const qtS = p.qtMs / 1000
  const qrsStart = beat - qrsS / 2
  const th = tHalf(qtS, qrsS)
  const tCenter = qrsStart + qtS - th
  return {
    beat,
    pStart: qrsStart - prS,
    pEnd: qrsStart - prS + 2 * P_HALF,
    qrsStart,
    qrsEnd: beat + qrsS / 2,
    jPoint: beat + qrsS * 0.75,
    tStart: tCenter - th,
    tEnd: tCenter + th,
    qtEnd: qrsStart + qtS,
  }
}

export interface RenderOptions {
  seconds?: number     // ábrázolt időtartam (alap: 2.5 s)
  mmPerS?: number      // papírsebesség (alap: 25)
  mmPerMv?: number     // erősítés (alap: 10)
  unitsPerMm?: number  // SVG-egység / mm (alap: 4)
  samplesPerS?: number
}

const DEF: Required<RenderOptions> = { seconds: 2.5, mmPerS: 25, mmPerMv: 10, unitsPerMm: 4, samplesPerS: 200 }

/**
 * Egy elvezetés mintavett feszültségértékei mV-ban.
 * Az idő másodpercben, a nulla az alapvonal.
 */
export function leadSamples(lead: Lead, p: EcgParams, opt: RenderOptions = {}): number[] {
  const o = { ...DEF, ...opt }
  const n = Math.round(o.seconds * o.samplesPerS)
  const out = new Array<number>(n).fill(0)
  const gain = leadGain(lead, p.axis)
  const pg = P_GAIN[lead] ?? 0.5
  const qrsS = p.qrsMs / 1000
  const qtS = p.qtMs / 1000
  const rand = rnd(Math.round(p.rate * 7 + p.qrsMs * 13 + lead.length * 31 + lead.charCodeAt(0)))

  const stMm = p.st?.[lead] ?? 0
  const stMv = stMm / 10
  const tShape: TShape = p.t?.[lead] ?? 'normal'
  const hasQ = (p.q ?? []).includes(lead)
  const chest = lead.startsWith('V')
  const c = chest ? CHEST[lead] : null

  const { pTimes, beats } = timing(p, o.seconds)

  // ── Kamrafibrilláció: kaotikus, felismerhető komplexus nélkül ──
  if (p.rhythm === 'vfib') {
    // Durva hullámú kamrafibrilláció: néhány rögzített frekvencia keveréke, lassú
    // fázismodulációval. A frekvenciát nem mintánként randomizáljuk — az magas
    // frekvenciás zajt adna, ami inkább műtermékre hasonlít, mint fibrillációra.
    const ph = rand() * 6.28
    const amp = 0.75 + Math.abs(gain) * 0.45
    for (let i = 0; i < n; i++) {
      const t = i / o.samplesPerS
      const wobble = Math.sin(2 * Math.PI * 0.55 * t + ph)
      out[i] = amp * (
        0.42 * Math.sin(2 * Math.PI * 4.6 * t + 0.9 * wobble + ph) +
        0.20 * Math.sin(2 * Math.PI * 6.9 * t + ph * 1.7) +
        0.13 * Math.sin(2 * Math.PI * 3.1 * t + ph * 0.4)
      )
    }
    return out
  }

  for (let i = 0; i < n; i++) {
    const time = i / o.samplesPerS
    let v = 0

    if (p.noise) {
      v += Math.sin(time * 2.2) * 0.02 * p.noise + (rand() - 0.5) * 0.012 * p.noise
    }

    // Pitvari aktivitás rendezetlen formái
    if (p.p === 'fibrillatory') {
      v += (rand() - 0.5) * 0.06 * (lead === 'V1' || lead === 'II' ? 1.4 : 0.7)
    } else if (p.p === 'flutter') {
      const ph = ((time * 5) % 1)
      v += (ph < 0.7 ? -ph * 0.18 : (ph - 0.7) * 0.42) * (lead === 'II' || lead === 'III' || lead === 'aVF' ? 1 : 0.4)
    }

    // ── P-hullámok ──
    if (p.p === 'normal' || p.p === 'inverted' || p.p === 'varying' || p.p === 'flattened') {
      const dir = p.p === 'inverted' ? -1 : 1
      // A P-hullám az élettani tartomány felső részét kapja (kb. 2 mm a II.
      // elvezetésben). Az alsó határon rajzolva a képernyőn alig lenne
      // kivehető a jóval magasabb QRS mellett, és a „van-e P-hullám” kérdés
      // megválaszolhatatlanná válna.
      const base = p.p === 'flattened' ? 0.05 : 0.20
      for (const pt of pTimes) {
        if (Math.abs(time - (pt + P_HALF)) > 0.16) continue
        const jitter = p.p === 'varying' ? (0.75 + ((pt * 7) % 1) * 0.55) : 1
        v += gauss(time, pt + P_HALF, 0.026, base * pg * dir * jitter)
      }
    }

    // ── Kamrai komplexusok ──
    for (const b of beats) {
      if (Math.abs(time - b.t) > qtS + 0.25) continue
      const w = (b.wide ? Math.max(qrsS, 0.14) : qrsS) / 2.6
      const qrsStart = b.t - (b.wide ? Math.max(qrsS, 0.14) : qrsS) / 2

      if (hasQ && !b.wide) v += gauss(time, b.t - w * 0.95, 0.016, -0.30 * Math.abs(gain) - 0.22)

      if (b.wide && b.early) {
        // Kamrai extrasystole: széles, bizarr, a fő iránnyal ellentétes komplexus.
        const dir = -Math.sign(gain || 1)
        v += gauss(time, b.t, w * 0.9, dir * 1.05)
        v += gauss(time, b.t + w * 1.6, w * 1.1, -dir * 0.42)
        v += gauss(time, b.t + qtS * 0.5, 0.07, -dir * 0.45)   // diszkordáns T
        continue
      }

      if (p.bundle === 'rbbb' && !b.early) {
        // Jobb szárblokk: a V1–V2 elvezetésben rsR', a lateralisokban széles S.
        if (lead === 'V1' || lead === 'V2') {
          v += gauss(time, b.t - w * 1.1, w * 0.5, 0.35)         // r
          v += gauss(time, b.t - w * 0.1, w * 0.5, -0.45)        // s
          v += gauss(time, b.t + w * 1.0, w * 0.6, 1.05)         // R'
        } else if (lead === 'I' || lead === 'V5' || lead === 'V6' || lead === 'aVL') {
          v += gauss(time, b.t, w * 0.55, Math.max(Math.abs(gain), 0.75) * 1.15)
          v += gauss(time, b.t + w * 1.6, w * 1.05, -0.38)       // elhúzódó, de sekélyebb S
        } else {
          v += gauss(time, b.t, w * 0.6, gain * 1.05)
          v += gauss(time, b.t + w * 1.3, w * 0.8, -0.28 * Math.abs(gain))
        }
      } else if (p.bundle === 'lbbb' && !b.early) {
        // Bal szárblokk: a V1–V2 elvezetésben mély, széles QS, a lateralisokban
        // széles, bevágott R.
        if (lead === 'V1' || lead === 'V2' || lead === 'V3') {
          v += gauss(time, b.t + w * 0.2, w * 1.15, -0.95)
        } else if (lead === 'I' || lead === 'V5' || lead === 'V6' || lead === 'aVL') {
          v += gauss(time, b.t - w * 0.55, w * 0.7, 0.58)
          v += gauss(time, b.t + w * 0.75, w * 0.7, 0.66)        // bevágott, kétcsúcsú R
        } else {
          const g = Math.sign(gain || 1) * Math.max(Math.abs(gain), 0.6)
          v += gauss(time, b.t, w * 0.9, g * 0.95)
        }
      } else if (chest && c) {
        v += gauss(time, b.t - w * 0.9, 0.0075, -0.06)
        v += gauss(time, b.t, w * 0.55, c.r * 1.25)
        v += gauss(time, b.t + w * 1.1, w * 0.7, c.s * 0.95)
      } else {
        // Széles komplexusnál minimális amplitúdót tartunk, hogy a ritmuscsíkon
        // is megszámolható legyen — bal tengelyeltérésnél a II. elvezetés
        // egyébként majdnem lapos lenne.
        const g = b.wide ? Math.sign(gain || 1) * Math.max(Math.abs(gain), 0.85) : gain
        v += gauss(time, b.t - w * 0.8, 0.0075, -0.05 * Math.sign(g || 1))
        v += gauss(time, b.t, w * 0.55, g * 1.15)
        v += gauss(time, b.t + w * 1.0, w * 0.7, -0.22 * Math.abs(g))
      }

      // ── ST-szakasz ──
      const jPoint = b.t + qrsS * 0.75
      const th = tHalf(qtS, b.wide ? Math.max(qrsS, 0.14) : qrsS)
      const tCenter = qrsStart + qtS - th
      const tStart = tCenter - th
      const tEndAll = tCenter + th
      if (stMv !== 0 && time > jPoint && time < tEndAll) {
        // Felfutás a J-ponttól, majd lecsengés a T végén — így az emelt szakasz
        // és a T-hullám összefüggő egészet alkot, ahogy a valóságban is.
        const up = Math.min(1, (time - jPoint) / 0.025)
        const down = Math.min(1, (tEndAll - time) / 0.05)
        v += stMv * up * down
      }

      // ── T-hullám ──
      // Szárblokknál a repolarizáció a QRS fő irányával ellentétes.
      let baseT = 0.22 * (gain === 0 ? 0.5 : Math.sign(gain)) * (0.6 + Math.abs(gain) * 0.6)
      if (p.bundle === 'lbbb') baseT = (lead === 'V1' || lead === 'V2' || lead === 'V3') ? 0.3 : -0.3
      if (p.bundle === 'rbbb' && (lead === 'V1' || lead === 'V2')) baseT = -0.28

      const tw = th / 2   // a gauss szórása a fél szélesség fele
      if (tShape === 'inverted') v += gauss(time, tCenter, tw, -Math.abs(baseT) * 1.1)
      else if (tShape === 'peaked') v += gauss(time, tCenter, tw * 0.6, Math.abs(baseT) * 2.1)
      else if (tShape === 'flat') v += gauss(time, tCenter, tw * 1.1, baseT * 0.2)
      else if (tShape === 'biphasic') {
        v += gauss(time, tCenter - tw * 0.65, tw * 0.55, Math.abs(baseT) * 0.8)
        v += gauss(time, tCenter + tw * 0.65, tw * 0.55, -Math.abs(baseT) * 0.8)
      } else v += gauss(time, tCenter, tw, baseT)

      // Ingerképző tüske pacemaker-ritmusnál
      if (p.rhythm === 'paced') v += gauss(time, qrsStart - 0.012, 0.002, 0.5)
    }

    out[i] = v
  }
  return out
}

/** Mintasorozat SVG polyline-ponttá alakítása egy adott dobozban. */
export function toPolyline(
  samples: number[], width: number, height: number, opt: RenderOptions = {},
): string {
  const o = { ...DEF, ...opt }
  const mid = height / 2
  const yScale = o.mmPerMv * o.unitsPerMm      // mV → SVG-egység
  const step = width / (samples.length - 1)
  const pts: string[] = []
  for (let i = 0; i < samples.length; i++) {
    const x = (i * step).toFixed(1)
    const y = (mid - samples[i] * yScale).toFixed(1)
    pts.push(`${x},${y}`)
  }
  return pts.join(' ')
}

/** Egy elvezetés kész polyline-ja adott dobozmérethez. */
export function leadPath(lead: Lead, p: EcgParams, width: number, height: number, opt: RenderOptions = {}): string {
  const o = { ...DEF, ...opt }
  const seconds = width / (o.mmPerS * o.unitsPerMm)
  return toPolyline(leadSamples(lead, p, { ...o, seconds }), width, height, o)
}

/* ─────────── Számított értékek a tanuláshoz ─────────── */

/** Bazett-korrigált QT. Oktatási közelítés — a klinikai értékelés mindig kontextusfüggő. */
export function qtc(qtMs: number, rate: number): number {
  const rr = 60 / Math.max(20, rate)
  return Math.round(qtMs / Math.sqrt(rr))
}

export const AXIS_LABEL: Record<Axis, string> = {
  normal: 'Normál tengely (kb. −30° és +90° között)',
  left: 'Bal tengelyeltérés (−30° alatt)',
  right: 'Jobb tengelyeltérés (+90° felett)',
  extreme: 'Extrém tengelyeltérés („északnyugati” tengely)',
}

export const RHYTHM_LABEL: Record<Rhythm, string> = {
  sinus: 'Sinus ritmus',
  'sinus-irregular': 'Szabálytalan sinus ritmus',
  afib: 'Pitvarfibrilláció',
  flutter: 'Pitvari flutter',
  vt: 'Kamrai tachycardia',
  paced: 'Pacemaker ritmus',
  junctional: 'Junkcionális ritmus',
  vfib: 'Kamrafibrilláció',
}
