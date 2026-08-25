// Központi klinikai témakör-rendszer (újrahasznosítható: mellkasi fájdalom, akut dyspnoe, stb.)
// A modulok tartalmai id/név alapján kapcsolódnak — a kapcsolat kétirányúan feloldható.
import { normName } from '@/lib/disease/resolve'

export interface TopicSource {
  name: string; org?: string; year?: string; identifier?: string; url?: string
  intl?: boolean; primary?: boolean; status?: string
  lastChecked?: string   // utolsó ellenőrzés (YYYY-MM-DD)
  reviewNext?: string    // következő felülvizsgálat esedékessége (YYYY-MM-DD)
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
      { name: 'Egészségügyi szakmai irányelv az akut koronária szindrómáról', org: 'Belügyminisztérium', year: '2025', identifier: '002272-2025', intl: false, primary: true, status: 'Publikálva', lastChecked: '2026-08-25', reviewNext: '2027-08-25' },
      { name: '2023 ESC Guidelines for the management of acute coronary syndromes', org: 'European Society of Cardiology', year: '2023', intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-25', reviewNext: '2027-08-25' },
    ],
    contentStatus: '⚪ Draft — szakmai ellenőrzés alatt',
    relatedTopics: ['akut-dyspnoe'],
  },
  {
    slug: 'akut-dyspnoe',
    title: 'Akut dyspnoe',
    icon: '🌬️',
    subtitle: 'Gyors klinikai orientáció akut légszomj esetén: első felismerés, vörös zászlók, elsődleges vizsgálatok, differenciáldiagnózis, kapcsolódó diagnosztika, APN-fókusz és eszkaláció.',
    orientation: [
      'Az akut dyspnoe (légszomj) nem diagnózis, hanem szubjektív tünet, amely mögött többféle — köztük időkritikus, életveszélyes — kardiális, pulmonális és egyéb ok állhat.',
      'A kezdeti értékelés célja: a klinikai stabilitás és a légzési distressz gyors megítélése, az azonnali beavatkozást igénylő okok (pl. tüdőoedema, tüdőembólia, feszülő pneumothorax, súlyos bronchospasmus, anaphylaxia) korai felismerése.',
    ],
    redFlags: [
      'Súlyos légzési distressz, kimerülés, „néma tüdő"',
      'Csak szavankénti beszéd, segédizom-használat',
      'Tartósan alacsony vagy romló SpO₂, centrális cyanosis',
      'Haemodinamikai instabilitás, hypotensio vagy shock jelei',
      'Tudatzavar (hypoxia/hypercapnia jele)',
      'Akut szívelégtelenség / tüdőoedema jelei',
      'Egyoldali hiányzó légzési hang + instabilitás (feszülő pneumothorax gyanú)',
      'Stridor, arc-/nyelvduzzanat, csalánkiütés (anaphylaxia / felső légúti obstrukció)',
      'Tüdőembólia gyanúja (hirtelen dyspnoe, mellkasi fájdalom, aszimmetrikus lábduzzanat)',
      'Haemoptysis',
    ],
    stability: [
      'Tudatállapot', 'Légzés és légzésmintázat', 'Légzésszám', 'Légzési munka (segédizom, beszéd)',
      'Oxigénszaturáció', 'Szívfrekvencia', 'Vérnyomás', 'Perifériás perfúzió', 'Shock jelei',
    ],
    historyFeatures: [
      'Kezdet (hirtelen / fokozatos)', 'Időtartam', 'Súlyosság / terhelhetőség', 'Provokáló és enyhítő tényezők',
      'Testhelyzettel való kapcsolat (orthopnoe, PND)', 'Terheléssel való kapcsolat', 'A panasz dinamikája',
    ],
    historySymptoms: [
      'Mellkasi fájdalom', 'Palpitatio', 'Köhögés és köpet (szín, mennyiség)', 'Haemoptysis', 'Sípolás (wheezing)',
      'Láz', 'Aszimmetrikus lábduzzanat (DVT)', 'Csalánkiütés / angiooedema', 'Ortopnoe / éjszakai fulladás',
    ],
    historyNote: 'A dyspnoe gyakran több ok együttese (pl. szívelégtelenség + COPD). A hirtelen kezdet embóliára, pneumothoraxra vagy anaphylaxiára, a fokozatos romlás inkább infekcióra vagy dekompenzációra utalhat.',
    ekgHeadline: '12 elvezetéses EKG a kardiális ok és a ritmuszavar kizárásához',
    ekgNote: [
      'Akut dyspnoénál az EKG segít a kardiális ok (ischaemia, arrhythmia) és a jobbszív-terhelés (pl. tüdőembólia) megítélésében.',
      'A klinikai állapot és az EKG együttesen értékelendő.',
      'Instabilitás vagy változó kép esetén ismételt EKG indokolt.',
    ],
    laborHeadline: 'Vérgáz / SpO₂ + célzott laborok az ok szerint',
    laborKeyNote: [
      'SpO₂ minden betegnél; instabil/hypoxiás betegnél vérgáz (pH, oxigenáció, CO₂-retenció megítélése).',
      'Kardiális gyanúnál NT-proBNP/BNP és troponin; tüdőembólia gyanúnál D-dimer a klinikai valószínűség tükrében.',
      'Infekció gyanújánál CRP/fehérvérsejt; súlyos állapotban laktát.',
      'Az eredmények mindig a klinikai kontextusban értékelendők.',
    ],
    laborMore: ['Vérgáz (pH, pO₂, pCO₂)', 'NT-proBNP / BNP', 'Troponin', 'D-dimer', 'CRP / fehérvérsejt', 'Elektrolitok', 'Kreatinin / vesefunkció', 'Vérkép'],
    scoreNote: 'A klinikai súlyosság és a valószínű ok megítéléséhez: NEWS2 (romlás), CURB-65 (pneumonia), Wells/Genfi (tüdőembólia valószínűsége), qSOFA (szepszis).',
    ddx: {
      critical: ['Akut dekompenzált szívelégtelenség', 'Pulmonalis embolia', 'Pneumothorax', 'Akut asthma exacerbatio', 'Anaphylaxia'],
      cardiac: ['COPD exacerbatio', 'Pneumonia', 'Akut légzési elégtelenség', 'Akut coronaria szindróma', 'Pleuralis folyadékgyülem'],
      other: ['Metabolikus acidosis', 'Anaemia', 'Szorongás / hyperventilatio', 'Felső légúti fertőzések', 'Neuromuscularis ok'],
    },
    apnFocus: [
      'Panasz kezdete és dinamikája', 'Provokáló/enyhítő tényezők', 'Testhelyzet (orthopnoe, PND)', 'Vitális paraméterek',
      'SpO₂ és oxigénigény', 'Légzési munka és beszéd', 'Kapcsolódó tünetek', 'Releváns kórelőzmény (szív, tüdő)',
      'Aktuális gyógyszerek', 'Ismert allergiák', 'Első SpO₂/vérgáz időpontja', 'Állapotváltozás dokumentálása',
    ],
    apnWarning: 'A kezdeti normális SpO₂ vagy nem diagnosztikus lelet önmagában nem zárja ki a súlyos okot. A légzési munka, a beszédképesség és a klinikai állapot változása ismételt értékelést igényel.',
    escalation: [
      'Haemodinamikai instabilitás vagy shock jelei', 'Tartósan nem tartható vagy romló SpO₂',
      'Kimerülés, „néma tüdő", csökkenő légzési munka a distressz ellenére', 'Tudatzavar',
      'Anaphylaxia gyanúja', 'Feszülő pneumothorax gyanúja', 'Súlyos, terápiára nem reagáló bronchospasmus',
      'Más potenciálisan időkritikus ok erős gyanúja',
    ],
    escalationNote: 'Az ellátás és eszkaláció a helyi intézményi protokollok, aktuális szakmai irányelvek és kompetenciahatárok figyelembevételével történjen. Ez az oldal klinikai orientációs és döntéstámogató tanulási eszköz — nem tartalmaz gyógyszerelési vagy terápiás algoritmust.',
    oxygen: [
      'Az oxigént a cél-szaturációhoz kell titrálni, nem rutinszerűen maximumon adni.',
      'Általános cél jellemzően 94–98%; CO₂-retenció kockázatával élő betegnél (pl. COPD) jellemzően 88–92%.',
      'A túlzott oxigénadás COPD-ben ártalmas lehet — a célszaturáció betartása fontos.',
    ],
    related: {
      examSystems: ['legzo', 'eletjelek', 'cardio'],
      examLinks: [{ label: 'Célzott anamnézis (vizsgálati munkamenet)', href: '/klinika/vizsgalat/munkamenet' }],
      ekg: ['pe', 'afib', 'ischaemia', 'lbbb'],
      labor: ['bnp', 'ddimer', 'trop', 'crp', 'wbc', 'ph'],
      scores: ['news2', 'wellspe', 'geneva', 'curb65', 'qsofa'],
      diseases: ['Akut dekompenzált szívelégtelenség', 'Pulmonalis embolia', 'Pneumothorax', 'Akut asthma exacerbatio', 'COPD exacerbatio', 'Anaphylaxia', 'Pneumonia', 'Akut légzési elégtelenség'],
    },
    sources: [
      { name: 'Egészségügyi szakmai irányelv a krónikus szívelégtelenségről', org: 'Belügyminisztérium', year: '2026', identifier: '002271-2026', intl: false, primary: true, status: 'Publikálva', lastChecked: '2026-08-25', reviewNext: '2027-08-25' },
      { name: 'Egészségügyi szakmai irányelv a COPD diagnosztikájáról, kezeléséről és gondozásáról', org: 'Belügyminisztérium', year: '2024', identifier: '002230-2024', intl: false, primary: true, status: 'Publikálva', lastChecked: '2026-08-25', reviewNext: '2027-08-25' },
      { name: '2021 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure', org: 'European Society of Cardiology', year: '2021', intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-25', reviewNext: '2027-08-25' },
    ],
    contentStatus: '⚪ Draft — szakmai ellenőrzés alatt',
    relatedTopics: ['mellkasi-fajdalom'],
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
