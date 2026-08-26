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

export type Rhythm = 'sinus' | 'sinus-irregular' | 'afib' | 'flutter' | 'vt' | 'paced' | 'junctional'
export type PShape = 'normal' | 'absent' | 'fibrillatory' | 'flutter' | 'inverted' | 'varying'
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
  avBlock?: '1' | '2a' | '2b' | '3'     // ingervezetési zavar
  noise?: number                        // alapvonal-ingadozás mértéke (0–1)
}

/* ─────────── Elvezetés-specifikus amplitúdók ─────────── */

// A QRS nettó iránya és nagysága elvezetésenként, a frontális tengely szerint.
const AXIS_GAIN: Record<Axis, Record<string, number>> = {
  normal:  { I: 0.60, II: 1.00, III: 0.50, aVR: -0.90, aVL: 0.15, aVF: 0.80 },
  left:    { I: 1.00, II: 0.10, III: -0.60, aVR: -0.70, aVL: 0.90, aVF: -0.30 },
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

/**
 * Az ütések időpontjai másodpercben.
 *
 * FONTOS: ez elvezetés-FÜGGETLEN. Korábban a szabálytalan ritmus (pitvarfibrilláció)
 * R–R szórása a görbeszintézis lead-függő álvéletlenéből jött, így ugyanaz az ütés
 * a II. és a V1 elvezetésen más időpontra esett — ami fizikailag hibás, hiszen egy
 * szívről van szó. Az ütésidőpontokat ezért közös magból számoljuk.
 */
export function beatTimes(p: EcgParams, seconds: number): number[] {
  const rr = 60 / Math.max(20, p.rate)
  const rand = rnd(Math.round(p.rate * 7 + p.qrsMs * 13 + p.prMs * 3 + 101))
  const beats: number[] = []
  let t = 0.25
  while (t < seconds + rr) {
    beats.push(t)
    let step = rr
    if (p.rhythm === 'afib' || p.rhythm === 'sinus-irregular') {
      step = rr * (0.72 + rand() * 0.56)
    }
    t += step
  }
  return beats
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
  const tCenter = qrsStart + qtS - T_HALF
  return {
    beat,
    pStart: qrsStart - prS,
    pEnd: qrsStart - prS + 2 * P_HALF,
    qrsStart,
    qrsEnd: beat + qrsS / 2,
    jPoint: beat + qrsS * 0.6,
    tStart: tCenter - T_HALF,
    tEnd: tCenter + T_HALF,
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
  const rr = 60 / Math.max(20, p.rate)             // R–R távolság (s)
  const gain = leadGain(lead, p.axis)
  const pg = P_GAIN[lead] ?? 0.5
  const qrsS = p.qrsMs / 1000
  const prS = p.prMs / 1000
  const qtS = p.qtMs / 1000
  const rand = rnd(Math.round(p.rate * 7 + p.qrsMs * 13 + lead.length * 31))

  // Az ütésidőpontok minden elvezetésen azonosak — lásd beatTimes().
  const beats = beatTimes(p, o.seconds)

  const stMm = p.st?.[lead] ?? 0
  const stMv = stMm / 10                           // 10 mm = 1 mV
  const tShape: TShape = p.t?.[lead] ?? 'normal'
  const hasQ = (p.q ?? []).includes(lead)

  for (let i = 0; i < n; i++) {
    const time = i / o.samplesPerS
    let v = 0

    // Alapvonal-ingadozás és zaj
    if (p.noise) {
      v += Math.sin(time * 2.2) * 0.02 * p.noise + (rand() - 0.5) * 0.012 * p.noise
    }

    // Pitvari aktivitás
    if (p.p === 'fibrillatory') {
      v += (rand() - 0.5) * 0.06 * (lead === 'V1' || lead === 'II' ? 1.4 : 0.7)
    } else if (p.p === 'flutter') {
      // fűrészfog: ~300/perc
      const ph = ((time * 5) % 1)
      v += (ph < 0.7 ? -ph * 0.18 : (ph - 0.7) * 0.42) * (lead === 'II' || lead === 'III' || lead === 'aVF' ? 1 : 0.4)
    }

    for (const b of beats) {
      // P-hullám. A kezdete pontosan PR-nyi távolságra van a QRS kezdetétől,
      // hogy a mért PR-intervallum megegyezzen a paraméterrel.
      const qrsStart = b - qrsS / 2
      if (p.p === 'normal' || p.p === 'inverted' || p.p === 'varying') {
        const dir = p.p === 'inverted' ? -1 : 1
        const jitter = p.p === 'varying' ? (0.8 + ((b * 7) % 1) * 0.5) : 1
        const pT = qrsStart - prS + P_HALF
        v += gauss(time, pT, 0.022, 0.13 * pg * dir * jitter)
      }

      // Q-hullám (kóros)
      if (hasQ) v += gauss(time, b - qrsS * 0.45, 0.012, -0.28 * Math.abs(gain) - 0.08)

      // QRS — a szélesség a paraméterből jön, így a mérés értelmes
      const w = qrsS / 2.6
      if (lead.startsWith('V')) {
        const c = CHEST[lead]
        v += gauss(time, b - w * 0.9, 0.0075, -0.06)                 // kis q
        v += gauss(time, b, w * 0.55, c.r * 1.25)                    // R
        v += gauss(time, b + w * 1.1, w * 0.7, c.s * 0.95)           // S
      } else {
        v += gauss(time, b - w * 0.8, 0.0075, -0.05 * Math.sign(gain || 1))
        v += gauss(time, b, w * 0.55, gain * 1.15)
        v += gauss(time, b + w * 1.0, w * 0.7, -0.22 * Math.abs(gain))
      }

      // ST-szakasz: a J-ponttól a T-hullám elejéig emelt/süllyesztett platót ad.
      // A T közepét úgy helyezzük el, hogy a T vége a QT végére essen.
      const jPoint = b + qrsS * 0.6
      const tCenterAligned = qrsStart + qtS - T_HALF
      const tStart = tCenterAligned - T_HALF
      if (stMv !== 0 && time > jPoint && time < tStart) {
        const ramp = Math.min(1, (time - jPoint) / 0.03)
        v += stMv * ramp
      }

      // T-hullám
      const tCenter = tCenterAligned
      const baseT = 0.22 * (gain === 0 ? 0.5 : Math.sign(gain)) * (0.6 + Math.abs(gain) * 0.6)
      if (tShape === 'inverted') v += gauss(time, tCenter, 0.055, -Math.abs(baseT) * 1.1)
      else if (tShape === 'peaked') v += gauss(time, tCenter, 0.032, Math.abs(baseT) * 2.1)
      else if (tShape === 'flat') v += gauss(time, tCenter, 0.06, baseT * 0.2)
      else if (tShape === 'biphasic') {
        v += gauss(time, tCenter - 0.035, 0.03, Math.abs(baseT) * 0.8)
        v += gauss(time, tCenter + 0.035, 0.03, -Math.abs(baseT) * 0.8)
      } else v += gauss(time, tCenter, 0.055, baseT)

      // Ingerképző tüske pacemaker-ritmusnál
      if (p.rhythm === 'paced') v += gauss(time, b - qrsS * 0.7, 0.002, 0.5)
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
}
