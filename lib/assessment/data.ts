export interface AssessDomain { id: string; label: string; scores: string[] }
export interface AssessVital { k: string; label: string; unit: string; ph: string }

export const ASSESS_STEPS = [
  'Panasz', 'Anamnézis', 'Vitális paraméterek', 'Fizikális vizsgálat', 'Labor', 'EKG',
  'Rizikóbecslés', 'Klinikai score-ok', 'APN problémák', 'Döntéstámogatás',
  'Következő lépések', 'Dokumentáció',
]

export const ASSESS_DOMAINS: AssessDomain[] = [
  { id: 'altalanos', label: 'Általános állapotromlás', scores: ['news2', 'qsofa', 'gcs'] },
  { id: 'legzo', label: 'Légúti panasz / nehézlégzés', scores: ['news2', 'curb65', 'cat', 'mmrc'] },
  { id: 'mellkas', label: 'Mellkasi fájdalom', scores: ['heart', 'timi', 'wellspe'] },
  { id: 'neuro', label: 'Neurológiai tünet / gyengeség', scores: ['fast', 'cincinnati', 'abcd2', 'gcs'] },
  { id: 'fertozes', label: 'Láz / fertőzésgyanú', scores: ['qsofa', 'centor', 'curb65'] },
  { id: 'fajdalom', label: 'Fájdalom', scores: ['vas', 'nrs', 'wongbaker', 'flacc'] },
  { id: 'mentalis', label: 'Hangulat / mentális panasz', scores: ['phq9', 'gad7', 'audit', 'cage'] },
  { id: 'eses', label: 'Esés / mobilitás (geriátria)', scores: ['morse', 'hendrich', 'tug', 'cfs'] },
  { id: 'seb', label: 'Bőr / seb / immobilitás', scores: ['braden', 'norton'] },
  { id: 'taplal', label: 'Fogyás / tápláltság', scores: ['must', 'nrs2002', 'mnasf', 'bmi'] },
  { id: 'egyeb', label: 'Egyéb / nem sorolható', scores: ['news2', 'vas', 'bmi'] },
]

export const ASSESS_VITALS: AssessVital[] = [
  { k: 'rr', label: 'Légzésszám', unit: '/perc', ph: 'pl. 18' },
  { k: 'spo2', label: 'SpO₂', unit: '%', ph: 'pl. 97' },
  { k: 'sbp', label: 'Szisztolés RR', unit: 'Hgmm', ph: 'pl. 120' },
  { k: 'hr', label: 'Pulzus', unit: '/perc', ph: 'pl. 78' },
  { k: 'temp', label: 'Testhőmérséklet', unit: '°C', ph: 'pl. 36,6' },
]

export const ASSESS_PROBLEMS = [
  'Akut állapotromlás kockázata', 'Légzési nehezítettség / hypoxia', 'Keringési instabilitás',
  'Fájdalom', 'Elesés kockázata', 'Bőrintegritás veszélye (decubitus)',
  'Tápláltsági / folyadékhiány', 'Fertőzés jelei', 'Szorongás / hangulati zavar',
  'Öngondoskodás hiánya', 'Betegoktatási igény', 'Gyógyszerelési probléma',
]
