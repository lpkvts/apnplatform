'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { revalidatePath } from 'next/cache'

export interface AssessmentPayload {
  domain: string | null
  complaint: string
  consciousness: string
  problems: string[]
  vitals: Record<string, string>
  fields: Record<string, string>
  summary: string
}

export async function saveAssessment(data: AssessmentPayload) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Nincs bejelentkezve.' }
  const { error } = await supabase.from('assessments').insert({
    user_id: user.id,
    domain: data.domain,
    complaint: data.complaint,
    consciousness: data.consciousness,
    problems: data.problems,
    vitals: data.vitals,
    fields: data.fields,
    summary: data.summary,
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath('/klinika/elozmenyek')
  return { ok: true }
}

export interface ScorePayload {
  test_id: string
  test_name: string
  score: number
  band_label: string
  risk: string
  answers: Record<string, unknown>
}

export async function saveScore(data: ScorePayload) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Nincs bejelentkezve.' }
  const { error } = await supabase.from('score_results').insert({
    user_id: user.id,
    test_id: data.test_id,
    test_name: data.test_name,
    score: data.score,
    band_label: data.band_label,
    risk: data.risk,
    answers: data.answers,
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath('/klinika/elozmenyek')
  return { ok: true }
}
