/**
 * Kurzusfájlok — típusok és korlátok.
 *
 * A megengedett típusok szándékosan szűkek: oktatási anyag jellemzően
 * dokumentum, táblázat, diasor vagy kép. A futtatható állomány kizárása
 * nem elméleti óvatosság — a megosztott fájl mindenkihez eljut.
 */

export interface CourseFile {
  id: string
  course_id: string
  path: string
  name: string
  mime: string | null
  size_bytes: number | null
  description: string | null
  visible: boolean
  created_at: string
}

/** Legfeljebb húsz megabájt: ennél nagyobb anyagot érdemes megosztóra tenni. */
export const MAX_BYTES = 20 * 1024 * 1024

export const ALLOWED = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/png', 'image/jpeg', 'image/webp',
  'text/plain', 'text/csv',
]

export const ALLOWED_LABEL = 'PDF, Word, Excel, PowerPoint, kép (PNG, JPEG, WEBP), szöveg, CSV'

/** Olvasható méret — a bájtszám önmagában semmit nem mond. */
export function meret(b: number | null): string {
  if (!b) return ''
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} kB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

/** Ikonnév a fájltípushoz. */
export function fajlIkon(mime: string | null): string {
  if (!mime) return 'clipboard'
  if (mime === 'application/pdf') return 'book'
  if (mime.startsWith('image/')) return 'layout'
  if (mime.includes('spreadsheet') || mime.includes('excel') || mime === 'text/csv') return 'chart'
  if (mime.includes('presentation') || mime.includes('powerpoint')) return 'courses'
  return 'clipboard'
}

/**
 * Biztonságos fájlnév a tárolóhoz.
 *
 * Az ékezetes és szóközös nevek a tárolóban gondot okoznak, ezért egyszerű
 * alakra hozzuk — az eredeti név a nyilvántartásban megmarad.
 */
export function tisztitNev(nev: string): string {
  const EKEZET: Record<string, string> = {
    á: 'a', é: 'e', í: 'i', ó: 'o', ö: 'o', ő: 'o', ú: 'u', ü: 'u', ű: 'u',
    Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ö: 'O', Ő: 'O', Ú: 'U', Ü: 'U', Ű: 'U',
  }
  return nev
    .replace(/[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/g, (c) => EKEZET[c] ?? c)
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}
