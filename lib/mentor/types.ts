/**
 * Mentorprogram — típusok és választható készletek.
 *
 * Külön fájlban, mert a kliensoldali komponensek is használják: ha ezek a
 * lekérdezésekkel egy helyen lennének, a böngészőbe kerülő kód magával hozná
 * a szerveroldali adatbázis-hozzáférést is.
 */

export type Status = 'pending' | 'approved' | 'rejected' | 'inactive'

export const STATUS_LABEL: Record<Status, string> = {
  pending: 'Elbírálásra vár',
  approved: 'Jóváhagyva',
  rejected: 'Elutasítva',
  inactive: 'Inaktív',
}

/** Mentorálási témák — ezek alapján lehet keresni. */
export const TOPICS = [
  'Pályakezdés, beilleszkedés',
  'Klinikai döntéshozatal',
  'Betegvizsgálat és állapotfelmérés',
  'Akut és sürgősségi ellátás',
  'Intenzív terápia',
  'Sebkezelés',
  'Fájdalomcsillapítás',
  'Betegoktatás és edukáció',
  'Dokumentáció és jogi keretek',
  'Kutatás és publikálás',
  'Továbbtanulás, szakirányválasztás',
  'Vezetői szerep, csapatmunka',
  'Kiégés és szakmai megújulás',
] as const

/** Vállalt mentorálási formák. */
export const FORMATS = [
  'Egyszeri beszélgetés',
  'Rendszeres konzultáció',
  'Online kapcsolattartás',
  'Személyes találkozó',
  'Klinikai eset megbeszélése',
  'Írásbeli visszajelzés',
] as const

/** Szakterületek — a platform többi részével egyező megnevezésekkel. */
export const SPECIALTIES = [
  'Sürgősségi ellátás',
  'Intenzív terápia',
  'Belgyógyászat',
  'Sebészet és perioperatív ellátás',
  'Kardiológia',
  'Geriátria',
  'Onkológia',
  'Alapellátás és közösségi ápolás',
  'Otthoni szakápolás',
  'Gyermekellátás',
  'Pszichiátria',
  'Oktatás és képzés',
  'Egyéb',
] as const

export interface Mentor {
  id: string
  user_id: string
  full_name: string | null
  title: string | null
  workplace: string | null
  specialty: string
  experience_years: number | null
  bio: string | null
  topics: string[]
  interests: string[]
  formats: string[]
  contact_note: string | null
}

export interface AdminMentor extends Omit<Mentor, 'workplace' | 'interests'> {
  status: Status
  review_note: string | null
  created_at: string
  updated_at: string
}

/**
 * Szűrés a listán.
 *
 * A kereséshez ékezet-tűrő egyszerűsítést használunk, hogy a „surgossegi” is
 * találjon, és a keresés a bemutatkozásra is kiterjed.
 */
const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function filterMentors(
  list: Mentor[],
  f: { q?: string; specialty?: string; topic?: string; minYears?: number },
): Mentor[] {
  return list.filter((m) => {
    if (f.specialty && m.specialty !== f.specialty) return false
    if (f.topic && !m.topics.includes(f.topic)) return false
    if (f.minYears && (m.experience_years ?? 0) < f.minYears) return false
    if (f.q && f.q.trim().length >= 2) {
      const hay = fold([
        m.full_name, m.title, m.specialty, m.bio, m.workplace,
        ...m.topics, ...m.interests,
      ].filter(Boolean).join(' '))
      if (!hay.includes(fold(f.q.trim()))) return false
    }
    return true
  })
}
