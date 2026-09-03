/**
 * Képzőhelyi megkeresés — típusok.
 *
 * Külön a lekérdezésektől, mert a kliensoldali kezelőfelület is használja:
 * egy fájlban a böngészőbe kerülő kód magával hozná az adatbázis-hozzáférést.
 */

export interface Inquiry {
  id: string
  institution: string
  contact_name: string
  email: string
  phone: string | null
  student_count: string | null
  message: string | null
  status: 'new' | 'contacted' | 'closed'
  admin_note: string | null
  created_at: string
}

export const INQ_STATUS_LABEL: Record<Inquiry['status'], string> = {
  new: 'Új',
  contacted: 'Megkeresve',
  closed: 'Lezárva',
}
