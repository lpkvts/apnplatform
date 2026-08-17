'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface CaseState { saved?: boolean; error?: string }

export async function createCase() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data, error } = await supabase.from('clinical_cases')
    .insert({ owner_id: user.id, status: 'draft' }).select('id').single<{ id: string }>()
  if (error || !data) return
  revalidatePath('/klinika/esetek')
  redirect(`/klinika/esetek/${data.id}`)
}

export async function updateCaseCore(_prev: CaseState, formData: FormData): Promise<CaseState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nincs bejelentkezve.' }
  const id = String(formData.get('id') ?? '')
  const str = (k: string) => { const v = String(formData.get(k) ?? '').trim(); return v === '' ? null : v }
  const { data, error } = await supabase.from('clinical_cases').update({
    title: str('title') ?? 'Új klinikai eset',
    complaint: str('complaint'),
    background: str('background'),
  }).eq('id', id).eq('owner_id', user.id).select('id')
  if (error) return { error: `Adatbázis-hiba: ${error.message}` }
  if (!data || data.length === 0) return { error: 'A mentés 0 sort érintett (jogosultság?).' }
  revalidatePath(`/klinika/esetek/${id}`); revalidatePath('/klinika/esetek'); revalidatePath('/')
  return { saved: true }
}

export async function setCaseStatus(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const id = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!['draft', 'active', 'completed', 'followup', 'archived'].includes(status)) return
  await supabase.from('clinical_cases').update({ status }).eq('id', id).eq('owner_id', user.id)
  revalidatePath(`/klinika/esetek/${id}`); revalidatePath('/klinika/esetek')
}

export async function saveCaseClinical(_prev: CaseState, formData: FormData): Promise<CaseState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nincs bejelentkezve.' }
  const id = String(formData.get('id') ?? '')
  const val = (k: string) => { const v = String(formData.get(k) ?? '').trim(); return v === '' ? null : v }

  const vitals: Record<string, string> = {}
  for (const k of ['rr', 'spo2', 'sbp', 'hr', 'temp', 'avpu']) {
    const v = val(k)
    if (v) vitals[k] = v
  }
  const { data, error } = await supabase.from('clinical_cases').update({
    vitals,
    disease_id: val('disease_id'),
    context_id: val('context_id'),
  }).eq('id', id).eq('owner_id', user.id).select('id')
  if (error) return { error: `Adatbázis-hiba: ${error.message}` }
  if (!data || data.length === 0) return { error: 'A mentés 0 sort érintett (jogosultság?).' }
  revalidatePath(`/klinika/esetek/${id}`); revalidatePath('/klinika/esetek')
  return { saved: true }
}

// ---- Case-integráció: Labor / Score / EKG hozzáadása ----
import { LAB } from '@/lib/labor/data'
import { interpret, STATUS_LABEL } from '@/lib/labor/engine'
import { TESTS } from '@/lib/scores/data'
import { ECG } from '@/lib/ekg/data'

async function ownerGuard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function addCaseLab(formData: FormData) {
  const { supabase, user } = await ownerGuard()
  if (!user) return
  const caseId = String(formData.get('case_id') ?? '')
  const labId = String(formData.get('lab_id') ?? '')
  const value = String(formData.get('value') ?? '').trim()
  const lab = LAB.find((l) => l.id === labId)
  if (!caseId || !lab || value === '') return
  const st = interpret(lab, value)
  await supabase.from('clinical_case_labs').insert({
    case_id: caseId, lab_id: lab.id, name: lab.name, value, unit: lab.unit ?? null, ref: lab.ref ?? null,
    status: st !== 'unknown' ? STATUS_LABEL[st] : null, measured_on: new Date().toISOString().slice(0, 10),
  })
  revalidatePath(`/klinika/esetek/${caseId}`)
}

export async function addCaseScore(formData: FormData) {
  const { supabase, user } = await ownerGuard()
  if (!user) return
  const caseId = String(formData.get('case_id') ?? '')
  const scoreId = String(formData.get('score_id') ?? '')
  const value = String(formData.get('value') ?? '').trim()
  const band = String(formData.get('band') ?? '').trim()
  const t = TESTS.find((x) => x.id === scoreId)
  if (!caseId || !t) return
  await supabase.from('clinical_case_scores').insert({
    case_id: caseId, score_id: t.id, score_name: t.name,
    value: value === '' ? null : Number(value.replace(',', '.')), band: band || null,
  })
  revalidatePath(`/klinika/esetek/${caseId}`)
}

export async function addCaseEkg(formData: FormData) {
  const { supabase, user } = await ownerGuard()
  if (!user) return
  const caseId = String(formData.get('case_id') ?? '')
  const ekgId = String(formData.get('ekg_id') ?? '')
  const note = String(formData.get('note') ?? '').trim()
  const assessment = String(formData.get('assessment') ?? '').trim()
  const e = ECG.find((x) => x.id === ekgId)
  if (!caseId || !e) return
  await supabase.from('clinical_case_ekgs').insert({
    case_id: caseId, ekg_id: e.id, name: e.name, category: e.cat, note: note || null, assessment: assessment || null,
  })
  revalidatePath(`/klinika/esetek/${caseId}`)
}

export async function removeCaseChild(formData: FormData) {
  const { supabase, user } = await ownerGuard()
  if (!user) return
  const table = String(formData.get('table') ?? '')
  const id = String(formData.get('id') ?? '')
  const caseId = String(formData.get('case_id') ?? '')
  if (!['clinical_case_labs', 'clinical_case_scores', 'clinical_case_ekgs'].includes(table)) return
  await supabase.from(table).delete().eq('id', id)
  revalidatePath(`/klinika/esetek/${caseId}`)
}

export async function saveSummary(_prev: CaseState, formData: FormData): Promise<CaseState> {
  const { supabase, user } = await ownerGuard()
  if (!user) return { error: 'Nincs bejelentkezve.' }
  const id = String(formData.get('id') ?? '')
  const summary = String(formData.get('summary') ?? '')
  const { data, error } = await supabase.from('clinical_cases').update({ summary }).eq('id', id).eq('owner_id', user.id).select('id')
  if (error) return { error: `Adatbázis-hiba: ${error.message}` }
  if (!data || data.length === 0) return { error: 'A mentés 0 sort érintett (jogosultság?).' }
  revalidatePath(`/klinika/esetek/${id}`)
  return { saved: true }
}

export async function saveSbar(_prev: CaseState, formData: FormData): Promise<CaseState> {
  const { supabase, user } = await ownerGuard()
  if (!user) return { error: 'Nincs bejelentkezve.' }
  const id = String(formData.get('id') ?? '')
  const sbar = {
    s: String(formData.get('s') ?? ''), b: String(formData.get('b') ?? ''),
    a: String(formData.get('a') ?? ''), r: String(formData.get('r') ?? ''),
  }
  const { data, error } = await supabase.from('clinical_cases').update({ sbar }).eq('id', id).eq('owner_id', user.id).select('id')
  if (error) return { error: `Adatbázis-hiba: ${error.message}` }
  if (!data || data.length === 0) return { error: 'A mentés 0 sort érintett (jogosultság?).' }
  revalidatePath(`/klinika/esetek/${id}`)
  return { saved: true }
}
