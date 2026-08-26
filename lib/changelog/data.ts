// Platform-változásnapló.
//
// MIÉRT KELL: a platform tartalmának egy része adatbázisban él (betegségleírások,
// irányelvek, labor paraméterek) — ezek időbélyeggel érkeznek, az újdonságukat a
// rendszer automatikusan felismeri. A másik része viszont a kódban van
// (Labor Kisokos LAB tömb, forrás-regiszter, témakörök, EKG, score-ok), ami csak
// deploykor változik, és nincs hozzá adatbázis-időbélyeg.
//
// Ezért minden érdemi szállításnál ide kell egy bejegyzés. A felhasználó azt látja
// újdonságként, ami a legutóbbi megtekintése (profiles.updates_seen_at) után kelt.
//
// SZABÁLY: a `date` a tényleges szállítás napja legyen, és soha ne módosítsuk
// visszamenőleg egy már kiadott bejegyzés dátumát — különben eltűnik olyan
// felhasználóknál, akik még nem látták.

export type ChangeKind = 'verzio' | 'labor' | 'forras' | 'betegseg' | 'szakmai' | 'eszkoz'

export interface ChangeEntry {
  id: string
  date: string          // YYYY-MM-DD — a szállítás napja
  version?: string      // platform-verzió, ha ez a bejegyzés verziót zár
  kind: ChangeKind
  title: string
  body?: string
  href?: string         // hova vigyen az értesítés
}

export const APP_VERSION = '0.4.0'

// Az ikonnevek a components/icons.tsx készletéből valók.
export const CHANGE_KIND_META: Record<ChangeKind, { icon: string; label: string }> = {
  verzio: { icon: 'grad', label: 'Platform-frissítés' },
  labor: { icon: 'flask', label: 'Labor' },
  forras: { icon: 'book', label: 'Klinikai forrás' },
  betegseg: { icon: 'clinic', label: 'Betegségtár' },
  szakmai: { icon: 'book', label: 'Szakmai tartalom' },
  eszkoz: { icon: 'assessment', label: 'Eszköz' },
}

// Legfrissebb elöl.
export const CHANGELOG: ChangeEntry[] = [
  {
    id: '2026-08-26-guideline-search',
    date: '2026-08-26',
    version: '0.4.0',
    kind: 'eszkoz',
    title: 'Összesített irányelv-kereső',
    body: 'A Protokollok és irányelvek nézetben egy keresőben érhető el a forrás-regiszter és a platform irányelvei. Kereshetsz cím, kiadó, azonosító vagy témakör szerint, és minden forrásnál ellenőrizheted a kiadó hivatalos regiszterében, van-e frissebb kiadás.',
    href: '/klinika/tudastar',
  },
  {
    id: '2026-08-26-labor-vvt',
    date: '2026-08-26',
    kind: 'labor',
    title: 'Vörösvértest-paraméterek a Labor Kisokosban',
    body: 'Új elemek: RBC, hematokrit, MCH, MCHC, RDW, retikulocita (arány és abszolút szám), LDH, haptoglobin, vörösvértest-morfológia, szérumvas és TVK. Új gyors panelek: Vörösvérkép, Hemolízis. A panel-értékelés hat új mintázatot ismer fel, köztük a hemolízist és a thromboticus mikroangiopátiát.',
    href: '/klinika/labor',
  },
]

/** A megadott időpont óta kelt bejegyzések, legfrissebb elöl. */
export function changesSince(iso: string | null): ChangeEntry[] {
  if (!iso) return []
  const since = iso.slice(0, 10)
  return CHANGELOG.filter((c) => c.date > since)
}

/** A legutóbbi verziót záró bejegyzés (a főoldali „mi változott” jelzéshez). */
export function latestRelease(): ChangeEntry | null {
  return CHANGELOG.find((c) => !!c.version) ?? null
}
