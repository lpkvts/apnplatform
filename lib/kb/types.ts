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
}
export interface RelatedScore { id: string; name: string; abbr?: string }
