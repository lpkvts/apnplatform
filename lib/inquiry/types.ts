/**
 * Megkeresések — típusok.
 *
 * Külön a lekérdezésektől, mert a kliensoldali űrlap és a kezelőfelület is
 * használja: egy fájlban a böngészőbe kerülő kód magával hozná az
 * adatbázis-hozzáférést.
 */

export type InquiryKind = 'general' | 'institution' | 'bug' | 'suggestion'

export const KIND_LABEL: Record<InquiryKind, string> = {
  general: 'Általános kérdés',
  institution: 'Képzőhelyi érdeklődés',
  bug: 'Hibajelzés',
  suggestion: 'Javaslat',
}

export const KIND_HINT: Record<InquiryKind, string> = {
  general: 'Bármilyen kérdés a platformmal vagy a tartalommal kapcsolatban.',
  institution: 'Egyetem vagy képzőhely érdeklődése az oktatási felület iránt.',
  bug: 'Valami nem működik, vagy hibásan jelenik meg.',
  suggestion: 'Ötlet, kérés, hiányzó funkció vagy tartalom.',
}

export interface Inquiry {
  id: string
  kind: InquiryKind
  institution: string | null
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
