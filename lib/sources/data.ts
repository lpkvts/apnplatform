// Központi forrás-regiszter: a platformon hivatkozott protokollok / szakmai irányelvek egy helyen.
// Ez az egyetlen forrás-igazság — a témakörök és kórképek ezekre hivatkoznak, a Tudástár innen jeleníti meg kategóriánként.
// Új hivatkozott forrás felvételekor ide kell beírni; a Protokollok és irányelvek nézetben automatikusan megjelenik.

export interface GuidelineSource {
  id: string
  title: string
  org: string
  year: string
  identifier?: string
  url?: string
  category: string        // kategória (szakterület)
  intl?: boolean
  primary?: boolean
  status?: string
  lastChecked?: string    // utolsó ellenőrzés (YYYY-MM-DD)
  reviewNext?: string     // következő felülvizsgálat (YYYY-MM-DD)
  usedIn?: string[]       // mely témakörök / kórképek hivatkozzák
  registry?: RegistryKey  // melyik hivatalos regiszterben ellenőrizhető a legfrissebb verzió
  registryUrl?: string    // a kiadó saját irányelv-gyűjtőoldala — CSAK ellenőrzött, valóban létező link
  supersededBy?: string   // ha újabb kiadás váltotta fel: az új forrás azonosítója
  versionNote?: string    // verzióval kapcsolatos megjegyzés (pl. "2024-es fókuszált frissítéssel")
}

// Hivatalos regiszterek, ahol egy irányelv aktuális verziója ellenőrizhető.
// FONTOS: ide csak ellenőrzött, valóban létező hivatkozás kerülhet. Kitalált URL nem.
// A kereső ezekből épít "Verzió ellenőrzése" gombot; regiszter nélküli forrásnál
// csak a javasolt keresőkifejezés jelenik meg, link nélkül.
export type RegistryKey = 'eszk' | 'okfo' | 'neak'

export const REGISTRIES: Record<RegistryKey, { label: string; url: string; note: string }> = {
  eszk: {
    label: 'Egészségügyi Szakmai Kollégium — Irányelvek',
    url: 'https://kollegium.okfo.gov.hu/iranyelvek',
    note: 'Tagozat és kifejezés szerint kereshető. Az „Érvényesség vége” oszlop mutatja, ha az irányelv lejárt.',
  },
  okfo: {
    label: 'OKFŐ — Egészségügyi Közlönyben megjelent irányelvek',
    url: 'https://okfo.gov.hu/Hirek/szakmai-iranyelvek',
    note: 'A megjelenés helye és ideje itt ellenőrizhető.',
  },
  neak: {
    label: 'NEAK — szakmai irányelvek nyilvántartása',
    url: 'https://www.neak.gov.hu/felso_menu/szakmai_oldalak/szakmai_iranyelvek/szakmai_iranyelvek',
    note: 'Az érvényes irányelvek azonosító szerinti listája.',
  },
}

export const GUIDELINE_SOURCES: GuidelineSource[] = [
  // ── Kardiológia ─────────────────────────────
  {
    id: 'bm-002272-2025-acs', title: 'Egészségügyi szakmai irányelv az akut koronária szindrómáról',
    org: 'Belügyminisztérium', year: '2025', identifier: '002272-2025', registry: 'eszk', category: 'Kardiológia',
    intl: false, primary: true, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Mellkasi fájdalom', 'Akut koronária szindróma'],
  },
  {
    id: 'esc-2023-acs', title: '2023 ESC Guidelines for the management of acute coronary syndromes',
    org: 'European Society of Cardiology', year: '2023', category: 'Kardiológia',
    intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Mellkasi fájdalom', 'Akut koronária szindróma'],
  },
  {
    id: 'bm-002271-2026-hf', title: 'Egészségügyi szakmai irányelv a krónikus szívelégtelenségről',
    org: 'Belügyminisztérium', year: '2026', identifier: '002271-2026', registry: 'eszk', category: 'Kardiológia',
    intl: false, primary: true, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Akut dyspnoe'],
  },
  {
    id: 'esc-2021-hf', title: '2021 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure',
    org: 'European Society of Cardiology', year: '2021', category: 'Kardiológia',
    intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Akut dyspnoe'],
  },
  // ── Pulmonológia ────────────────────────────
  {
    id: 'bm-002230-2024-copd', title: 'Egészségügyi szakmai irányelv a COPD diagnosztikájáról, kezeléséről és gondozásáról',
    org: 'Belügyminisztérium', year: '2024', identifier: '002230-2024', registry: 'eszk', category: 'Pulmonológia',
    intl: false, primary: true, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Akut dyspnoe', 'COPD exacerbatio'],
  },
  {
    id: 'esc-2019-pe', title: '2019/2024 ESC Guidelines for acute pulmonary embolism',
    org: 'European Society of Cardiology', year: '2019', category: 'Pulmonológia',
    intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Akut dyspnoe', 'Mellkasi fájdalom', 'Pulmonalis embolia'],
  },
  {
    id: 'bts-ers-ptx', title: 'BTS / ERS pneumothorax ajánlások',
    org: 'British Thoracic Society / European Respiratory Society', year: 'aktuális', category: 'Pulmonológia',
    intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Pneumothorax'],
  },
  // ── Sebészet / akut has ─────────────────────
  {
    id: 'wses-2020-appendicitis', title: 'Diagnosis and treatment of acute appendicitis: 2020 update of the WSES Jerusalem guidelines',
    org: 'World Society of Emergency Surgery', year: '2020', category: 'Sebészet',
    intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Akut hasi fájdalom', 'Akut appendicitis'],
  },
  {
    id: 'wses-2020-cholecystitis', title: '2020 WSES updated guidelines for the diagnosis and treatment of acute calculus cholecystitis',
    org: 'World Society of Emergency Surgery', year: '2020', category: 'Sebészet',
    intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Akut hasi fájdalom', 'Akut cholecystitis'],
  },
  {
    id: 'tg18-biliary', title: 'Tokyo Guidelines 2018 (TG18) — akut cholangitis és cholecystitis diagnosztikája, súlyossági besorolása',
    org: 'Japanese Society of Hepato-Biliary-Pancreatic Surgery', year: '2018', category: 'Sebészet',
    intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Akut hasi fájdalom', 'Akut cholecystitis', 'Cholangitis'],
  },
  {
    id: 'esc-2018-syncope', title: '2018 ESC Guidelines for the diagnosis and management of syncope',
    org: 'European Society of Cardiology', year: '2018', category: 'Kardiológia',
    intl: true, primary: true, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Eszméletvesztés', 'Vasovagalis syncope'],
  },
  // ── Infektológia / szepszis ─────────────────
  {
    id: 'nice-ng253-sepsis-16plus', title: 'Suspected sepsis in people aged 16 or over: recognition, diagnosis and early management (NG253)',
    org: 'National Institute for Health and Care Excellence', year: '2025', identifier: 'NG253', category: 'Infektológia',
    intl: true, primary: true, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Láz', 'Szepszis'],
    versionNote: 'A NICE 2025 novemberében a korábbi NG51-et három irányelvre bontotta: NG253 (16 év felett), NG254 (16 év alatt), NG255 (terhesség).',
  },
  {
    id: 'nice-ng254-sepsis-under16', title: 'Suspected sepsis in under 16s: recognition, diagnosis and early management (NG254)',
    org: 'National Institute for Health and Care Excellence', year: '2025', identifier: 'NG254', category: 'Infektológia',
    intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Láz', 'Szepszis'],
  },
  {
    id: 'ssc-2021', title: 'Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock',
    org: 'Society of Critical Care Medicine / ESICM', year: '2021', category: 'Infektológia',
    intl: true, primary: false, status: 'Publikálva', lastChecked: '2026-08-26', reviewNext: '2027-08-26',
    usedIn: ['Láz', 'Szepszis'],
  },
  {
    id: 'nice-ng51-sepsis', title: 'Sepsis: recognition, diagnosis and early management (NG51)',
    org: 'National Institute for Health and Care Excellence', year: '2016', identifier: 'NG51', category: 'Infektológia',
    intl: true, primary: false, status: 'Visszavonva', lastChecked: '2026-08-26', reviewNext: '2026-08-26',
    supersededBy: 'NG253 / NG254 / NG255 (2025)',
    versionNote: 'Nem használandó. 2025 novemberében három új irányelv váltotta fel — az erre hivatkozó korábbi anyagok felülvizsgálandók.',
  },
]

export function sourcesByCategory(): [string, GuidelineSource[]][] {
  const map: Record<string, GuidelineSource[]> = {}
  for (const s of GUIDELINE_SOURCES) (map[s.category] ??= []).push(s)
  return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0], 'hu'))
}

// A verzió-ellenőrzéshez javasolt keresőkifejezés.
// Magyar irányelvnél az azonosító a legpontosabb; egyébként a cím eleje a kiadóval.
export function checkQuery(s: GuidelineSource): string {
  if (s.identifier) return s.identifier
  const short = s.title.length > 60 ? s.title.slice(0, 60).replace(/\s+\S*$/, '') : s.title
  return s.intl ? `${short} ${s.org}` : short
}

// A forráshoz tartozó regiszter-hivatkozás, ha rögzítve van. Egyébként null —
// ilyenkor a felület nem ajánl linket, csak a keresőkifejezést mutatja.
export function registryFor(s: GuidelineSource): { label: string; url: string; note: string } | null {
  if (s.registryUrl) return { label: `${s.org} — irányelvek`, url: s.registryUrl, note: 'A kiadó saját gyűjtőoldala.' }
  if (s.registry) return REGISTRIES[s.registry]
  return null
}
