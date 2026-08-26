// Strukturált EKG-elemzés: lépések, kérdések, kontextuális segítség.
//
// Az elemzés a meglévő EKG tananyaghoz kapcsolódik: minden lépés `teach` mezője egy
// ECG-elem azonosítója (lib/ekg/data.ts), így a „2 perces ismétlés” a már meglévő
// atlasz-tartalomra visz, és onnan vissza lehet térni ugyanahhoz a lépéshez.
//
// A kérdések OKTATÁSI célúak. A rendszer egyetlen EKG-jel alapján nem állít fel
// diagnózist — a helyes válasz mindig a leletre vonatkozik, nem a betegre.

import type { EcgParams, Lead } from './render'

export type StepId =
  | 'kalibracio' | 'frekvencia' | 'ritmus' | 'p' | 'pr' | 'qrs'
  | 'tengely' | 'qt' | 'st' | 't' | 'osszegzes'

export interface AnalysisOption {
  id: string
  label: string
}

export interface AnalysisQuestion {
  id: string
  prompt: string
  options: AnalysisOption[]
  /** A helyes válasz(ok) azonosítója. Több is lehet helyes bizonyos leleteknél. */
  correct: string[]
  /** Rövid magyarázat a válasz után. */
  explain: string
  /** Mit emeljünk ki az EKG-n a kérdés alatt. */
  highlight?: HighlightKind
}

export type HighlightKind = 'rr' | 'p' | 'pr' | 'qrs' | 'st' | 't' | 'qt' | 'calib' | 'none'

export interface AnalysisStep {
  id: StepId
  no: string          // '01'
  title: string
  aim: string         // mire keressük a választ
  hint: string        // kontextuális segítség (💡)
  teach?: string      // ECG-elem azonosító a tananyagból
  teachLabel?: string // a hivatkozás megjelenő címe
  highlight: HighlightKind
}

/** A strukturált elemzés rögzített sorrendje. */
export const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    id: 'kalibracio', no: '01', title: 'Kalibráció',
    aim: 'Ellenőrizd a papírsebességet, az erősítést és a felvétel minőségét, mert enélkül minden további mérés bizonytalan.',
    hint: 'A szabványos beállítás 25 mm/s papírsebesség és 10 mm/mV erősítés. A kalibrációs jel ilyenkor 10 mm magas és 0,2 s széles. Fél erősítésnél (5 mm/mV) minden amplitúdó feleakkorának látszik.',
    teach: 'approach', teachLabel: 'Az EKG-elemzés menete',
    highlight: 'calib',
  },
  {
    id: 'frekvencia', no: '02', title: 'Frekvencia',
    aim: 'Határozd meg a kamrai frekvenciát, és szabálytalan ritmusnál becsüld meg az átlagot.',
    hint: 'Szabályos ritmusnál 300 osztva az R–R távolságban lévő nagy kockák számával. Szabálytalan ritmusnál számold meg a QRS-eket egy 10 másodperces csíkon, és szorozd hattal.',
    teach: 'approach', teachLabel: 'Frekvenciaszámítás',
    highlight: 'rr',
  },
  {
    id: 'ritmus', no: '03', title: 'Ritmus',
    aim: 'Szabályos vagy szabálytalan a kamrai ritmus, és honnan indul az ingerület?',
    hint: 'A szabályosságot az egymást követő R–R távolságok összehasonlításával vizsgálhatod. Segít, ha egy papírszélre két szomszédos R-csúcsot bejelölsz, és végigcsúsztatod a csíkon.',
    teach: 'normal', teachLabel: 'Normál sinusritmus',
    highlight: 'rr',
  },
  {
    id: 'p', no: '04', title: 'P-hullám',
    aim: 'Van-e P-hullám, minden QRS-t megelőz-e, és milyen az alakja?',
    hint: 'A P-hullámot a II. elvezetésben és a V1-ben érdemes keresni. Élettanilag pozitív a II-ben és negatív az aVR-ben. Hiányzó vagy szabálytalan pitvari aktivitás pitvarfibrillációra, a fűrészfog-mintázat flutterre utalhat.',
    teach: 'afib', teachLabel: 'Pitvari ritmuszavarok',
    highlight: 'p',
  },
  {
    id: 'pr', no: '05', title: 'PR-intervallum',
    aim: 'Mérd meg a P-hullám kezdetétől a QRS kezdetéig tartó időt.',
    hint: 'Élettanilag 120–200 ms (3–5 kis kocka). A tartósan megnyúlt PR elsőfokú AV-blokkra utal. Ha a PR fokozatosan nyúlik és kimarad egy QRS, az Wenckebach-jelenség.',
    teach: 'av1', teachLabel: 'AV-blokkok',
    highlight: 'pr',
  },
  {
    id: 'qrs', no: '06', title: 'QRS-komplexus',
    aim: 'Mérd meg a szélességét, és nézd meg az alakját, az amplitúdóját és a kóros Q-hullámokat.',
    hint: 'A normál QRS 120 ms-nál keskenyebb (3 kis kocka). A széles QRS kamrai eredetre, szárblokkra, pacemaker-ingerlésre vagy elektroliteltérésre utalhat. A V1 és a V6 alakja segít a szárblokk oldalának eldöntésében.',
    teach: 'lbbb', teachLabel: 'Tawara-szár blokkok',
    highlight: 'qrs',
  },
  {
    id: 'tengely', no: '07', title: 'Elektromos tengely',
    aim: 'Határozd meg a frontális tengelyállást az I. és az aVF elvezetés nettó iránya alapján.',
    hint: 'Ha az I. és az aVF is pozitív, a tengely normális. Pozitív I. és negatív aVF bal tengelyeltérést, negatív I. és pozitív aVF jobb tengelyeltérést jelez. Ha mindkettő negatív, extrém tengelyeltérésről van szó.',
    teach: 'axis', teachLabel: 'Tengelyállások',
    highlight: 'qrs',
  },
  {
    id: 'qt', no: '08', title: 'QT és QTc',
    aim: 'Mérd meg a QT-időt, és korrigáld a frekvenciára.',
    hint: 'A QT a QRS kezdetétől a T-hullám végéig tart. Mivel a frekvenciával változik, korrigálni kell — a Bazett-képlet szerint QTc = QT osztva az R–R négyzetgyökével. A megnyúlt QTc ritmuszavar-kockázatot jelent.',
    teach: 'hypoca', teachLabel: 'QT-eltérések',
    highlight: 'qt',
  },
  {
    id: 'st', no: '09', title: 'ST-szakasz',
    aim: 'Keress ST-elevációt vagy -depressziót, és határozd meg, mely elvezetésekben látod.',
    hint: 'Az ST-szakaszt a J-ponttól értékeljük, az izoelektromos vonalhoz viszonyítva. Az eltérés lokalizációja irányt ad: II, III, aVF inferior; V1–V4 anteroseptalis; I, aVL, V5–V6 lateralis. Mindig keress reciprok eltérést is.',
    teach: 'stemi', teachLabel: 'ST-eleváció',
    highlight: 'st',
  },
  {
    id: 't', no: '10', title: 'T-hullám',
    aim: 'Nézd meg a T-hullámok irányát, alakját és amplitúdóját.',
    hint: 'A T-hullám élettanilag a QRS fő irányával egyezik, és aVR-ben negatív. A V1-ben és a III-ban az inverzió lehet élettani is. A csúcsos, magas T hyperkalaemiára, a mély inverzió ischaemiára utalhat.',
    teach: 'hyperk', teachLabel: 'Hyperkalaemia',
    highlight: 't',
  },
  {
    id: 'osszegzes', no: '11', title: 'Összegzés',
    aim: 'Foglald össze a leletet, és fogalmazd meg, mit jelent a beteg klinikai állapotának tükrében.',
    hint: 'A jó összegzés leíró: ritmus, frekvencia, tengely, intervallumok, majd az eltérések és azok lokalizációja. A klinikai következtetés mindig a panasszal és az állapottal együtt értelmezendő — az EKG önmagában nem diagnózis.',
    teach: 'approach', teachLabel: 'Az EKG-elemzés menete',
    highlight: 'none',
  },
]

export const stepById = (id: StepId) => ANALYSIS_STEPS.find((s) => s.id === id)

/* ─────────── Esetek ─────────── */

export interface EcgCase {
  id: string
  title: string
  vignette: string          // klinikai kontextus
  age: number
  sex: 'férfi' | 'nő'
  params: EcgParams
  tags: string[]            // kompetencia-címkék a személyre szabott gyakorláshoz
  /** Lépésenkénti kérdések. Minden lépéshez 1–2. */
  questions: Partial<Record<StepId, AnalysisQuestion[]>>
  /** A referenciaelemzés lépésenként — az önálló mód ehhez hasonlít. */
  reference: Partial<Record<StepId, string>>
  /** Kiemelt eltérések magyarázata. */
  findings: CaseFinding[]
  /** Evidence-panel: mire épül a magyarázat. */
  evidence: CaseEvidence[]
  difficulty: 'kezdő' | 'haladó' | 'gyakorlott'
}

export interface CaseFinding {
  title: string
  what: string        // Mit látunk?
  where: string       // Hol látjuk?
  meaning: string     // Mit jelenthet?
  ddx: string[]       // Differenciáldiagnosztika
  why: string         // Miért fontos?
  leads?: Lead[]      // vizuális kiemeléshez
}

/**
 * Szakmai háttér egy esethez.
 *
 * A hivatkozás a KÖZPONTI FORRÁS-REGISZTERRE mutat (lib/sources/data.ts), nem
 * másolja a forrás adatait. Így a kiadás éve, az utolsó ellenőrzés dátuma és a
 * visszavonás ténye egy helyen tartható karban, és a verzió-ellenőrzés
 * automatikusan kiterjed az EKG-esetekre is.
 */
export interface CaseEvidence {
  /** GuidelineSource azonosító a lib/sources/data.ts regiszterből. */
  sourceId: string
  /** Miért releváns ez a forrás ennél az esetnél. */
  note?: string
  /** Bizonyíték szintje, ha az adott ajánlásnál értelmezhető. */
  level?: string
}

/* ─────────── Kompetencia-területek ─────────── */

export interface Competence {
  id: string
  label: string
  /** Mely elemzési lépések válaszai számítanak bele. */
  steps: StepId[]
  /** Mely eset-címkék tartoznak ide. */
  tags: string[]
}

export const EKG_COMPETENCES: Competence[] = [
  { id: 'ritmus', label: 'Ritmusfelismerés', steps: ['ritmus', 'p'], tags: ['sinus', 'afib', 'flutter', 'vt', 'paced'] },
  { id: 'frekvencia', label: 'Frekvencia meghatározása', steps: ['frekvencia'], tags: ['brady', 'tachy'] },
  { id: 'avblokk', label: 'AV-blokkok', steps: ['pr'], tags: ['av1', 'av2a', 'av2b', 'av3'] },
  { id: 'vezetes', label: 'Vezetési zavarok', steps: ['qrs'], tags: ['lbbb', 'rbbb'] },
  { id: 'tengely', label: 'Tengelyállás', steps: ['tengely'], tags: ['axis'] },
  { id: 'stt', label: 'ST-T eltérések', steps: ['st', 't'], tags: ['stemi', 'nstemi', 'ischaemia', 'pericarditis'] },
  { id: 'qt', label: 'QT és elektrolitok', steps: ['qt'], tags: ['hyperk', 'hypok', 'hypoca', 'hyperca'] },
]

export const competenceForStep = (step: StepId): Competence | undefined =>
  EKG_COMPETENCES.find((c) => c.steps.includes(step))
