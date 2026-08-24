// Betegvizsgálat 2.0 — propedeutikai konstansok

export const MODES = {
  clinical: { label: 'Klinikai mód', icon: '🩺', sub: 'Gyors, praktikus betegvizsgálat valós munkához' },
  education: { label: 'Oktatási / gyakorló mód', icon: '🎓', sub: 'Lépésről lépésre vezetett propedeutikai tanulás' },
  practice: { label: 'Gyakorló mód', icon: '🧠', sub: 'Gyakorló beteg, szimulált eset' },
} as const

export const COMPLAINT_CATS = [
  'fájdalom', 'dyspnoe', 'láz', 'köhögés', 'palpitáció', 'szédülés', 'gyengeség',
  'hányás', 'hasmenés', 'hasi panasz', 'tudatzavar', 'neurológiai tünet', 'ödéma', 'vérzés', 'egyéb',
]

export const ACUTE_COMPLAINTS = [
  'mellkasi fájdalom', 'dyspnoe', 'hasi fájdalom', 'szédülés', 'palpitáció', 'láz', 'gyengeség', 'tudatzavar', 'egyéb panasz',
]

export const SYSTEMS = [
  { id: 'cardiovascularis', label: 'Cardiovascularis', icon: '❤️' },
  { id: 'pulmonologiai', label: 'Pulmonológiai', icon: '🫁' },
  { id: 'neurologiai', label: 'Neurológiai', icon: '🧠' },
  { id: 'abdominalis', label: 'Abdominalis', icon: '🍽️' },
  { id: 'mozgasszervi', label: 'Mozgásszervi', icon: '🦴' },
  { id: 'bor_perif', label: 'Bőr / perifériás keringés', icon: '🩹' },
]

export const OPQRST = [
  { k: 'o', label: 'O – Onset', q: 'Mikor és hogyan kezdődött?' },
  { k: 'p', label: 'P – Provokáció / enyhülés', q: 'Mi váltja ki vagy enyhíti?' },
  { k: 'q', label: 'Q – Jelleg', q: 'Milyen jellegű a panasz?' },
  { k: 'r', label: 'R – Lokalizáció / kisugárzás', q: 'Hol jelentkezik? Sugárzik-e?' },
  { k: 's', label: 'S – Súlyosság', q: 'Mennyire erős (0–10)?' },
  { k: 't', label: 'T – Időbeli lefolyás', q: 'Hogyan változott az időben?' },
] as const

export const PAST_CONDITIONS = [
  'hypertonia', 'diabetes', 'szívbetegség', 'COPD', 'asthma', 'vesebetegség',
  'neurológiai betegség', 'májbetegség', 'daganatos betegség', 'korábbi thromboembolia', 'pszichiátriai betegség',
]

export const MED_FLAGS = [
  'antikoaguláns', 'thrombocytaaggregáció-gátló', 'inzulin', 'szteroid', 'antiarrhythmiás',
]

export const FAMILY_CONDITIONS = [
  'cardiovascularis betegség', 'diabetes', 'stroke', 'daganatos betegség', 'öröklődő betegség',
]

export const ALLERGY_STATUS = [
  { v: 'none', l: 'Nincs ismert gyógyszerallergia' },
  { v: 'yes', l: 'Igen, van' },
  { v: 'unknown', l: 'Nem tisztázott' },
]

// A vizsgálat szekciói (útvonal)
export const EXAM_SECTIONS = [
  { id: 'anamnezis', label: 'Anamnézis', icon: '📝', ready: true },
  { id: 'vitalis', label: 'Vitális paraméterek', icon: '📊', ready: true },
  { id: 'altalanos', label: 'Általános fizikális vizsgálat', icon: '🩺', ready: true },
  { id: 'szervrendszer', label: 'Szervrendszeri vizsgálatok', icon: '❤️', ready: false },
  { id: 'redflag', label: 'Red flag jelzések', icon: '🚨', ready: false },
  { id: 'osszegzes', label: 'Klinikai összegzés', icon: '📄', ready: false },
  { id: 'dokumentacio', label: 'Dokumentáció / Mentor', icon: '👥', ready: false },
]

// --- Vitális paraméterek (Betegvizsgálat 2.0) ---
export const VITAL_FIELDS: { k: string; label: string; unit: string; ph: string }[] = [
  { k: 'bp_sys', label: 'Vérnyomás – systoles', unit: 'Hgmm', ph: '120' },
  { k: 'bp_dia', label: 'Vérnyomás – diastoles', unit: 'Hgmm', ph: '80' },
  { k: 'hr', label: 'Pulzus', unit: '/min', ph: '72' },
  { k: 'rr', label: 'Légzésszám', unit: '/min', ph: '16' },
  { k: 'spo2', label: 'SpO\u2082', unit: '%', ph: '98' },
  { k: 'temp', label: 'Testhőmérséklet', unit: '°C', ph: '36.6' },
  { k: 'pain', label: 'Fájdalom', unit: '0–10', ph: '0' },
  { k: 'glucose', label: 'Vércukor', unit: 'mmol/L', ph: '5.5' },
  { k: 'weight', label: 'Testsúly', unit: 'kg', ph: '70' },
  { k: 'height', label: 'Testmagasság', unit: 'cm', ph: '175' },
]

// Trendben megjelenő kulcs-vitálisok
export const VITAL_TREND: string[] = ['bp_sys', 'hr', 'rr', 'spo2', 'temp', 'glucose']

export type VitalZone = 'ok' | 'warn' | 'alert' | ''
export const ZONE_DOT: Record<string, string> = { ok: '🟢', warn: '🟡', alert: '🔴', '': '' }

// Nem diagnózis — csak vizuális jelzés. A határok később intézményileg konfigurálhatók.
export function vitalZone(k: string, raw: string | number | undefined): VitalZone {
  if (raw === undefined || raw === '' || raw === null) return ''
  const n = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(',', '.'))
  if (isNaN(n)) return ''
  const R = (ok: boolean, warn: boolean): VitalZone => (ok ? 'ok' : warn ? 'warn' : 'alert')
  switch (k) {
    case 'bp_sys': return R(n >= 100 && n <= 139, (n >= 90 && n < 100) || (n >= 140 && n < 180))
    case 'bp_dia': return R(n >= 60 && n <= 89, (n >= 50 && n < 60) || (n >= 90 && n < 110))
    case 'hr': return R(n >= 50 && n <= 100, (n >= 40 && n < 50) || (n > 100 && n <= 130))
    case 'rr': return R(n >= 12 && n <= 20, (n >= 9 && n < 12) || (n > 20 && n <= 24))
    case 'spo2': return R(n >= 95, n >= 92 && n < 95)
    case 'temp': return R(n >= 36 && n <= 37.9, (n >= 35 && n < 36) || (n >= 38 && n < 39))
    case 'pain': return R(n <= 3, n >= 4 && n <= 6)
    case 'glucose': return R(n >= 4 && n <= 7.8, (n >= 3 && n < 4) || (n > 7.8 && n <= 11))
    case 'bmi': return R(n >= 18.5 && n <= 24.9, (n >= 17 && n < 18.5) || (n >= 25 && n <= 29.9))
    default: return ''
  }
}

export function computeBmi(weight?: string, height?: string): string {
  const w = parseFloat(String(weight ?? '').replace(',', '.'))
  const h = parseFloat(String(height ?? '').replace(',', '.'))
  if (isNaN(w) || isNaN(h) || h <= 0) return ''
  return (w / Math.pow(h / 100, 2)).toFixed(1)
}

// --- Általános fizikális vizsgálat (Betegvizsgálat 2.0) ---
export const GENERAL_STATE = ['jó', 'kielégítő', 'közepes', 'rossz', 'kritikus']
export const CONSCIOUSNESS = ['éber', 'aluszékony', 'zavart', 'sopor', 'coma']
export const AVPU_OPTS = [
  { v: 'A', l: 'A – éber' }, { v: 'V', l: 'V – hangra' }, { v: 'P', l: 'P – fájdalomra' }, { v: 'U', l: 'U – nem reagál' },
]
export const NUTRITION_FLAGS = ['obesitas', 'cachexia', 'malnutritio gyanúja']
export const SKIN_COLOR = ['normál', 'sápadt', 'cyanotikus', 'icterusos', 'vörös']
export const SKIN_TEMP = ['meleg', 'normál', 'hűvös']
export const SKIN_MOIST = ['száraz', 'normál', 'nedves', 'verejtékes']
export const SKIN_TURGOR = ['normál', 'csökkent']
export const SKIN_FINDINGS = ['kiütés', 'vérzéses bőrtünet', 'seb', 'decubitus']
export const HYDRATION = ['megfelelő', 'enyhén csökkent', 'jelentősen csökkent', 'fokozott folyadékretenció jelei']
export const OEDEMA_LOC = ['nincs', 'boka', 'lábszár', 'generalizált']
export const OEDEMA_SEV = ['enyhe', 'közepes', 'jelentős']
