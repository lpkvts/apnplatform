'use server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface ExamState { saved?: boolean; error?: string }

async function owner() { const supabase = await createClient(); const user = await getCurrentUser(); return { supabase, user } }

export async function createExamSession(formData: FormData) {
  const { supabase, user } = await owner(); if (!user) return
  const mode = String(formData.get('mode') ?? 'clinical')
  const exam_type = String(formData.get('exam_type') ?? '') || null
  const focus = String(formData.get('focus') ?? '') || null
  const titleBase = mode === 'education' ? 'Oktatási vizsgálat' : mode === 'practice' ? 'Gyakorló vizsgálat' : 'Betegvizsgálat'
  const title = focus ? `${titleBase} · ${focus}` : titleBase
  const anamnesis = focus && exam_type === 'acute' ? { complaint: focus } : {}
  const { data, error } = await supabase.from('exam_sessions').insert({ owner_id: user.id, mode, exam_type, focus, title, anamnesis }).select('id').single<{ id: string }>()
  if (error || !data) return
  revalidatePath('/klinika/vizsgalat'); redirect(`/klinika/vizsgalat/${data.id}`)
}

export async function saveAnamnesis(_prev: ExamState, formData: FormData): Promise<ExamState> {
  const { supabase, user } = await owner(); if (!user) return { error: 'Nincs bejelentkezve.' }
  const id = String(formData.get('id') ?? '')
  let anamnesis: unknown = {}
  try { anamnesis = JSON.parse(String(formData.get('anamnesis') ?? '{}')) } catch { return { error: 'Hibás adat.' } }
  const { data, error } = await supabase.from('exam_sessions').update({ anamnesis }).eq('id', id).eq('owner_id', user.id).select('id')
  if (error) return { error: `Adatbázis-hiba: ${error.message}` }
  if (!data || data.length === 0) return { error: 'A mentés 0 sort érintett (jogosultság?).' }
  revalidatePath(`/klinika/vizsgalat/${id}`); return { saved: true }
}


export async function saveVitals(_prev: ExamState, formData: FormData): Promise<ExamState> {
  const { supabase, user } = await owner(); if (!user) return { error: 'Nincs bejelentkezve.' }
  const id = String(formData.get('id') ?? '')
  let vitals: unknown = []
  try { vitals = JSON.parse(String(formData.get('vitals') ?? '[]')) } catch { return { error: 'Hibás adat.' } }
  const { data, error } = await supabase.from('exam_sessions').update({ vitals }).eq('id', id).eq('owner_id', user.id).select('id')
  if (error) return { error: `Adatbázis-hiba: ${error.message}` }
  if (!data || data.length === 0) return { error: 'A mentés 0 sort érintett (jogosultság?).' }
  revalidatePath(`/klinika/vizsgalat/${id}`); return { saved: true }
}


export async function saveGeneralExam(_prev: ExamState, formData: FormData): Promise<ExamState> {
  const { supabase, user } = await owner(); if (!user) return { error: 'Nincs bejelentkezve.' }
  const id = String(formData.get('id') ?? '')
  let general_exam: unknown = {}
  try { general_exam = JSON.parse(String(formData.get('general_exam') ?? '{}')) } catch { return { error: 'Hibás adat.' } }
  const { data, error } = await supabase.from('exam_sessions').update({ general_exam }).eq('id', id).eq('owner_id', user.id).select('id')
  if (error) return { error: `Adatbázis-hiba: ${error.message}` }
  if (!data || data.length === 0) return { error: 'A mentés 0 sort érintett (jogosultság?).' }
  revalidatePath(`/klinika/vizsgalat/${id}`); return { saved: true }
}


export async function saveSystems(_prev: ExamState, formData: FormData): Promise<ExamState> {
  const { supabase, user } = await owner(); if (!user) return { error: 'Nincs bejelentkezve.' }
  const id = String(formData.get('id') ?? '')
  let systems: unknown = {}
  let red_flags: string[] = []
  try {
    systems = JSON.parse(String(formData.get('systems') ?? '{}'))
    red_flags = JSON.parse(String(formData.get('red_flags') ?? '[]'))
  } catch { return { error: 'Hibás adat.' } }
  const { data, error } = await supabase.from('exam_sessions').update({ systems, red_flags }).eq('id', id).eq('owner_id', user.id).select('id')
  if (error) return { error: `Adatbázis-hiba: ${error.message}` }
  if (!data || data.length === 0) return { error: 'A mentés 0 sort érintett (jogosultság?).' }
  revalidatePath(`/klinika/vizsgalat/${id}`); return { saved: true }
}


export async function saveSummary(_prev: ExamState, formData: FormData): Promise<ExamState> {
  const { supabase, user } = await owner(); if (!user) return { error: 'Nincs bejelentkezve.' }
  const id = String(formData.get('id') ?? '')
  const summary = String(formData.get('summary') ?? '')
  const { data, error } = await supabase.from('exam_sessions').update({ summary }).eq('id', id).eq('owner_id', user.id).select('id')
  if (error) return { error: `Adatbázis-hiba: ${error.message}` }
  if (!data || data.length === 0) return { error: 'A mentés 0 sort érintett (jogosultság?).' }
  revalidatePath(`/klinika/vizsgalat/${id}`); return { saved: true }
}

export async function setExamStatus(formData: FormData) {
  const { supabase, user } = await owner(); if (!user) return
  const id = String(formData.get('id') ?? ''); const status = String(formData.get('status') ?? '')
  if (!['active', 'completed', 'archived'].includes(status)) return
  await supabase.from('exam_sessions').update({ status }).eq('id', id).eq('owner_id', user.id)
  revalidatePath(`/klinika/vizsgalat/${id}`); revalidatePath('/klinika/vizsgalat')
}
