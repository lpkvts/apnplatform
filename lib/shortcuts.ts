// Kezdőlapi gyorsindítók katalógusa — a felhasználó ezekből választhat (menu típusú kedvenc)
export interface Shortcut { key: string; href: string; label: string; icon: string }
export const SHORTCUTS: Shortcut[] = [
  { key: 'vizsgalat', href: '/klinika/vizsgalat', label: 'Betegvizsgálat', icon: 'assessment' },
  { key: 'esetek', href: '/klinika/esetek', label: 'Eseteim', icon: 'clinic' },
  { key: 'ertekeles', href: '/klinika/ertekeles', label: 'Új betegértékelés', icon: 'assessment' },
  { key: 'score', href: '/klinika/tesztek', label: 'Score Hub', icon: 'score' },
  { key: 'labor', href: '/klinika/labor', label: 'Labor', icon: 'flask' },
  { key: 'vergaz', href: '/klinika/vergaz', label: 'Vérgáz', icon: 'flask' },
  { key: 'ekg', href: '/klinika/ekg', label: 'EKG', icon: 'ekg' },
  { key: 'betegsegtar', href: '/betegsegtar', label: 'Betegségtár', icon: 'clinic' },
  { key: 'tudastar', href: '/klinika/tudastar', label: 'Tudástár', icon: 'book' },
  { key: 'kontextus', href: '/kontextus', label: 'Klinikai kontextus', icon: 'book' },
  { key: 'kedvencek', href: '/kedvencek', label: 'Kedvenceim', icon: 'star' },
  { key: 'kompterkep', href: '/kompetenciaterkep', label: 'Kompetenciatérkép', icon: 'grad' },
  { key: 'oktatas', href: '/oktatas', label: 'Oktatás', icon: 'grad' },
  { key: 'profil', href: '/profil', label: 'Profil', icon: 'user' },
]

// Csempe-akcentusok. Egy helyen, hogy a kezdőlap és a testreszabás ugyanazt mutassa.
//
// Elv: a zöld a márka színe — az eredeti zöld csempék (Labor, Tudástár) változatlanok,
// és új csempéhez nem osztunk zöldet. A többi szín külön színcsaládból való, hogy
// egymás mellett is megkülönböztethetők legyenek. Az ikon a színt kapja, a háttér
// ugyanennek a 10%-os változatát ('1A' utótag), így világos alapon is olvasható marad.
export const SHORTCUT_ACCENTS: Record<string, string> = {
  // ── eredeti színek (nem változnak) ──
  '/klinika/labor': '#22C55E',        // zöld — márkaszín, marad
  '/klinika/vergaz': '#0EA5E9',       // égkék — légzés és sav-bázis
  '/klinika/tudastar': '#0F5B46',     // sötétzöld — márkaszín, marad
  '/betegsegtar/akut': '#EF4444',     // piros — sürgősség
  '/klinika/vizsgalat': '#885CF6',    // lila
  '/betegsegtar': '#3B82F6',          // kék
  '/klinika/ekg': '#F97316',          // narancs
  '/klinika/tesztek': '#FACC15',      // sárga

  // ── új színek a korábban szín nélküli csempéknek ──
  '/klinika/esetek': '#0891B2',       // cián — esetek, előzmények
  '/klinika/ertekeles': '#DB2777',    // pink — új betegértékelés
  '/kontextus': '#A16207',            // borostyán-barna — klinikai kontextus
  '/kedvencek': '#7C3AED',            // ibolya — kedvencek
  '/kompetenciaterkep': '#0891B2',    // cián — szakmai keretrendszer
  '/oktatas': '#7C3AED',              // ibolya — oktatási réteg
  '/profil': '#64748B',               // pala — nem klinikai tartalom, szándékosan semleges

  // ── további útvonalak, ha csempeként kerülnek fel ──
  '/betegsegtar/panasz': '#0EA5E9',   // égszínkék — panasz alapján
  '/klinika/copilot': '#6366F1',      // indigó — copilot
  '/cpd': '#C026D3',                  // fukszia — szakmai fejlődés
  '/fejlodes': '#C026D3',
  '/kereses': '#475569',              // sötét pala — keresés
  '/klinika/elozmenyek': '#0891B2',
  '/kompetenciak': '#A16207',
  '/career': '#DB2777',
  '/ertesitesek': '#64748B',
  '/ujdonsagok': '#64748B',
}

/** Egy útvonal akcentusszíne, vagy null, ha nincs hozzárendelve. */
export function accentFor(href: string): string | null {
  return SHORTCUT_ACCENTS[href] ?? null
}

/** Inline stílus a csempe ikonjához. Szín nélküli útvonalnál az alapértelmezett marad. */
/**
 * Sötétebb árnyalat az akcentushoz.
 *
 * A telített szín a saját halvány hátterén gyakran olvashatatlan — a sárga
 * fehéren mindössze 1,5:1. A sötétítés mértéke ezért a szín világosságához
 * igazodik: a világos színek többet kapnak, így mindegyik eléri a szövegre
 * elvárt kontrasztot.
 */
function sotetit(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  // Érzékelt világosság — a zöldre a szem a legérzékenyebb.
  const vil = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  const arany = Math.min(0.62, Math.max(0.28, vil * 0.72))
  const f = (c: number) => Math.round(c * (1 - arany)).toString(16).padStart(2, '0')
  return '#' + f(r) + f(g) + f(b)
}

export function accentStyle(href: string): { color: string; background: string } | undefined {
  const c = accentFor(href)
  return c ? { color: sotetit(c), background: c + '1F' } : undefined
}
