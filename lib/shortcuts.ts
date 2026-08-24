// Kezdőlapi gyorsindítók katalógusa — a felhasználó ezekből választhat (menu típusú kedvenc)
export interface Shortcut { key: string; href: string; label: string; icon: string }
export const SHORTCUTS: Shortcut[] = [
  { key: 'vizsgalat', href: '/klinika/vizsgalat', label: 'Betegvizsgálat', icon: 'assessment' },
  { key: 'esetek', href: '/klinika/esetek', label: 'Eseteim', icon: 'clinic' },
  { key: 'ertekeles', href: '/klinika/ertekeles', label: 'Új betegértékelés', icon: 'assessment' },
  { key: 'score', href: '/klinika/tesztek', label: 'Score Hub', icon: 'score' },
  { key: 'labor', href: '/klinika/labor', label: 'Labor', icon: 'flask' },
  { key: 'ekg', href: '/klinika/ekg', label: 'EKG', icon: 'ekg' },
  { key: 'betegsegtar', href: '/betegsegtar', label: 'Betegségtár', icon: 'clinic' },
  { key: 'tudastar', href: '/klinika/tudastar', label: 'Tudástár', icon: 'book' },
  { key: 'kontextus', href: '/kontextus', label: 'Klinikai kontextus', icon: 'book' },
  { key: 'kedvencek', href: '/kedvencek', label: 'Kedvenceim', icon: 'star' },
  { key: 'profil', href: '/profil', label: 'Profil', icon: 'user' },
]
