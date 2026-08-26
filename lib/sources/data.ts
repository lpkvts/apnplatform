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
}

export const GUIDELINE_SOURCES: GuidelineSource[] = [
  // ── Kardiológia ─────────────────────────────
  {
    id: 'bm-002272-2025-acs', title: 'Egészségügyi szakmai irányelv az akut koronária szindrómáról',
    org: 'Belügyminisztérium', year: '2025', identifier: '002272-2025', category: 'Kardiológia',
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
    org: 'Belügyminisztérium', year: '2026', identifier: '002271-2026', category: 'Kardiológia',
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
    org: 'Belügyminisztérium', year: '2024', identifier: '002230-2024', category: 'Pulmonológia',
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
]

export function sourcesByCategory(): [string, GuidelineSource[]][] {
  const map: Record<string, GuidelineSource[]> = {}
  for (const s of GUIDELINE_SOURCES) (map[s.category] ??= []).push(s)
  return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0], 'hu'))
}
