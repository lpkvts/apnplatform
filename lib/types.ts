// Kézzel karbantartott DB-típusok (a séma bővülésekor frissítendő,
// vagy generálható: supabase gen types typescript).
export type Role = 'apn' | 'szerkeszto' | 'lektor' | 'admin'

export interface Profile {
  id: string
  full_name: string | null
  specialty: string | null
  role: Role
  registration_no: string | null
  apn_type: string | null
  title: string | null
  workplace: string | null
  qualification: string | null
  qual_year: number | null
  phone: string | null
}

export interface Competency {
  id: string
  code: string
  name: string
  domain: string | null
  sort_order: number
}

export interface CompetencyProgress {
  id: string
  user_id: string
  competency_id: string
  level: number
  status: 'not_started' | 'in_progress' | 'achieved'
}

export interface CpdEntry {
  id: string
  user_id: string
  title: string
  points: number
  activity_date: string
  activity_year: number
  activity_type_id: string | null
}
