// Központi klinikai témakör-rendszer (újrahasznosítható: mellkasi fájdalom, akut dyspnoe, stb.)
// A modulok tartalmai id/név alapján kapcsolódnak — a kapcsolat kétirányúan feloldható.
import { normName } from '@/lib/disease/resolve'

export interface TopicSource {
  name: string; org?: string; year?: string; identifier?: string; url?: string
  intl?: boolean; primary?: boolean; status?: string
}
export interface TopicRelated {
  examSystems?: string[]                    // EXAM_SYSTEMS id-k (Betegvizsgálat)
  examLinks?: { label: string; href: string }[]
  ekg?: string[]                            // ECG id-k
  labor?: string[]                          // LAB id-k
  scores?: string[]                         // TESTS id-k
  diseases?: string[]                       // Betegségtár kórképnevek
}
export interface Topic {
  slug: string; title: string; icon: string; subtitle: string
  orientation: string[]
  redFlags: string[]
  stability: string[]
  historyFeatures: string[]
  historySymptoms: string[]
  historyNote?: string
  ekgHeadline: string
  ekgNote: string[]
  laborHeadline: string
  laborKeyNote: string[]
  laborMore: string[]
  scoreNote: string
  ddx: { critical: string[]; cardiac: string[]; other: string[] }
  apnFocus: string[]
  apnWarning?: string
  escalation: string[]
  escalationNote?: string
  oxygen: string[]
  related: TopicRelated
  sources: TopicSource[]
  contentStatus?: string
  relatedTopics?: string[]
}

export const TOPICS: Topic[] = [
  {
    slug: 'mellkasi-fajdalom',
    title: 'Mellkasi fájdalom',
    icon: '💔',
    subtitle: 'Gyors klinikai orientáció akut mellkasi fájdalom esetén: első felismerés, vörös zászlók, elsődleges vizsgálatok, differenciáldiagnózis, kapcsolódó diagnosztika, APN-fókusz és eszkaláció.',
    orientation: [
      'Az akut mellkasi fájdalom nem diagnózis, hanem tünet, amely mögött többféle állapot állhat — köztük időkritikus, potenciálisan életveszélyes kórképek.',
      'A kezdeti értékelés célja: a klinikai stabilitás gyors megítélése, az akut koronária szindróma felismerése vagy kizárása, és az egyéb életveszélyes differenciáldiagnózisok korai felismerése.',
    ],
    redFlags: [
      'Elhúzódó vagy visszatérő akut mellkasi fájdalom',
      'Haemodinamikai instabilitás',
      'Hypotensio vagy shock jelei',
      'Jelentős ritmuszavar',
      'Akut szívelégtelenség vagy pulmonalis oedema jelei',
      'Syncope',
      'Tudatzavar',
      'Perzisztáló ST-eleváció vagy jelentős ischaemiás EKG-eltérés',
      'Akut aortaszindróma gyanúja',
      'Tüdőembólia gyanúja',
      'Feszülő pneumothorax gyanúja',
    ],
    stability: [
      'Tudatállapot', 'Légzés', 'Légzésszám', 'Szívfrekvencia', 'Vérnyomás',
      'Oxigénszaturáció', 'Perifériás perfúzió', 'Shock jelei', 'Akut szívelégtelenség jelei',
    ],
    historyFeatures: [
      'Kezdet', 'Időtartam', 'Intenzitás', 'Lokalizáció', 'Kisugárzás', 'Fájdalom jellege',
      'Terheléssel való kapcsolat', 'Légzéssel való kapcsolat', 'Testhelyzettel való kapcsolat', 'A panasz változása',
    ],
    historySymptoms: [
      'Dyspnoe', 'Epigastriális panasz', 'Karba sugárzó fájdalom', 'Nyak- vagy állkapocstáji fájdalom',
      'Verejtékezés', 'Hányinger', 'Hányás', 'Syncope', 'Palpitatio',
    ],
    historyNote: 'Akut koronária szindróma nem minden esetben klasszikus mellkasi fájdalommal jelentkezik. Dyspnoe, epigastriális panasz, illetve kar-, nyak- vagy állkapocstáji fájdalom is lehet figyelmeztető tünet.',
    ekgHeadline: '12 elvezetéses EKG mielőbb',
    ekgNote: [
      'Akut mellkasi panasz esetén az EKG első vonalbeli diagnosztikai eszköz.',
      'A klinikai állapot és az EKG eredménye együttesen értékelendő.',
      'Szükség esetén ismételt EKG-k készítése indokolt.',
    ],
    laborHeadline: 'hs-cTn — magas szenzitivitású troponin',
    laborKeyNote: [
      'Mielőbbi mintavétel.',
      'Az eredmény klinikai kontextusban értékelendő.',
      'Kérdéses esetekben sorozatos troponinmérés szükséges lehet.',
      'Ahol az intézményi protokoll alkalmazza, 0/1 vagy 0/2 órás algoritmus használható.',
    ],
    laborMore: ['Vérkép', 'Kreatinin / vesefunkció', 'Elektrolitok', 'Vércukor', 'Májfunkció', 'HbA1c', 'Lipidparaméterek'],
    scoreNote: 'GRACE Score — kardiovaszkuláris kockázat és prognózis strukturált becslésére használható pontrendszer (ACS mortalitási kockázat).',
    ddx: {
      critical: ['Akut koronária szindróma', 'Akut aortaszindróma / aortadissectio', 'Tüdőembólia', 'Feszülő pneumothorax'],
      cardiac: ['Akut szívelégtelenség', 'Pericarditis', 'Jelentős ritmuszavar', 'Takotsubo-szindróma', 'Jelentős billentyűbetegség'],
      other: ['Pneumonia', 'Pleuritis', 'Gastrooesophagealis eredet', 'Egyéb gastrointestinalis ok', 'Pancreatitis', 'Musculoskeletalis eredet', 'Trauma', 'Egyéb nem kardiális ok'],
    },
    apnFocus: [
      'Panasz pontos kezdete', 'Panasz jellemzői', 'Panasz dinamikája', 'Vitális paraméterek', 'Klinikai stabilitás',
      'Első EKG időpontja', 'Ismételt EKG-k', 'Kapcsolódó tünetek', 'Releváns kórelőzmény', 'Korábbi kardiológiai események',
      'Aktuális gyógyszerek', 'Vérzéses kockázatot befolyásoló információk', 'Ismert allergiák', 'Állapotváltozás dokumentálása',
    ],
    apnWarning: 'A normális vagy nem diagnosztikus első vizsgálati eredmény önmagában nem zárja ki a súlyos akut állapotot. A beteg klinikai állapota és annak változása ismételt értékelést igényel.',
    escalation: [
      'Haemodinamikai instabilitás', 'Shock jelei', 'Perzisztáló vagy jelentős ischaemiás EKG-eltérés',
      'Jelentős ritmuszavar', 'Akut szívelégtelenség jelei', 'Syncope vagy tudatzavar',
      'Akut koronária szindróma erős gyanúja', 'Más potenciálisan időkritikus mellkasi kórkép gyanúja',
    ],
    escalationNote: 'Az ellátás és eszkaláció a helyi intézményi protokollok, aktuális szakmai irányelvek és kompetenciahatárok figyelembevételével történjen. Ez az oldal klinikai orientációs és döntéstámogató tanulási eszköz — nem tartalmaz gyógyszerelési vagy terápiás algoritmust.',
    oxygen: [
      'Hypoxaemia esetén indokolt lehet.',
      'Normoxaemiás betegnél a rutin oxigénadás nem javasolt.',
    ],
    related: {
      examSystems: ['eletjelek', 'cardio', 'legzo'],
      examLinks: [{ label: 'Célzott anamnézis (vizsgálati munkamenet)', href: '/klinika/vizsgalat/munkamenet' }],
      ekg: ['stemi', 'nstemi', 'ischaemia', 'pe', 'pericarditis'],
      labor: ['trop', 'krea', 'k', 'gluk', 'ldl'],
      scores: ['grace', 'heart', 'timi'],
      diseases: ['Akut koronária szindróma', 'Tüdőembólia', 'Akut aortaszindróma', 'Pneumothorax'],
    },
    sources: [
      { name: 'Egészségügyi szakmai irányelv az akut koronária szindrómáról', org: 'Belügyminisztérium', year: '2025', identifier: '002272-2025', intl: false, primary: true, status: 'Publikálva' },
      { name: '2023 ESC Guidelines for the management of acute coronary syndromes', org: 'European Society of Cardiology', year: '2023', intl: true, primary: false, status: 'Publikálva' },
    ],
    contentStatus: '⚪ Draft — szakmai ellenőrzés alatt',
    relatedTopics: [],
  },
]

const nn = (s: string) => normName(s)

export function findTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug)
}
export function topicForAcuteName(name: string): Topic | undefined {
  const n = nn(name)
  return TOPICS.find((t) => nn(t.title) === n)
}
// Fordított kapcsolat: mely témakörökhöz tartozik egy adott modul-tartalom
export function topicsForContent(kind: 'ekg' | 'labor' | 'scores' | 'examSystems', id: string): Topic[] {
  return TOPICS.filter((t) => (t.related[kind] ?? []).includes(id))
}
export function topicsForDisease(name: string): Topic[] {
  const n = nn(name)
  return TOPICS.filter((t) => (t.related.diseases ?? []).some((d) => nn(d) === n || nn(d).includes(n) || n.includes(nn(d))))
}
