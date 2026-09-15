export interface GuidelineBody {
  sections: [string, string][]
  refs: string[]
  source_name: string
  source_url: string
  updated: string
  validity: string
  version: string
  evidence: string
}
export interface Guideline {
  id: string
  external_id: string | null
  title: string
  specialty: string[] | null
  summary: string | null
  body: GuidelineBody
  version: string | null
  /** Ha kórképből származik, annak azonosítója — a visszahivatkozáshoz. */
  from_disease_slug?: string | null
  source_url?: string | null
  source_year?: string | null
  /** Az irányelv-család azonosítója: minden kiadás ugyanahhoz tartozik. */
  family?: string | null
  /** Ha felváltották, a hatályos kiadás azonosítója. */
  superseded_by?: string | null
  status?: string | null
}

/** Egy irányelv korábbi kiadása a verziótörténetben. */
export interface GuidelineVersion {
  id: string
  title: string
  source_year: string | null
  source_url: string | null
  status: string | null
}
export interface RelatedScore { id: string; name: string; abbr?: string }
