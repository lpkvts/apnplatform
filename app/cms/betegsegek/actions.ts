'use server'

import { createClient } from '@/lib/supabase/server'
import { currentRole, STAFF, PUBLISHERS, type Role } from '@/lib/roles'
import { revalidatePath } from 'next/cache'

export interface DiseaseSaveState { saved?: boolean; error?: string; id?: string }

const lines = (v: FormDataEntryValue | null) => String(v ?? '').split('\n').map((s) => s.trim()).filter(Boolean)
const commas = (v: FormDataEntryValue | null) => String(v ?? '').split(',').map((s) => s.trim()).filter(Boolean)
const str = (v: FormDataEntryValue | null) => { const s = String(v ?? '').trim(); return s === '' ? null : s }

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60)
}

export async function saveDisease(_prev: DiseaseSaveState, formData: FormData): Promise<DiseaseSaveState> {
  const { userId, role } = await currentRole()
  if (!userId || !STAFF.includes(role as Role)) return { error: 'Nincs jogosultság.' }
  const supabase = await createClient()

  const id = str(formData.get('id'))
  const name = str(formData.get('name'))
  if (!name) return { error: 'A név kötelező.' }
  const slug = str(formData.get('slug')) || slugify(name)

  const body = {
    brief_what: str(formData.get('brief_what')) ?? '', brief_why: str(formData.get('brief_why')) ?? '',
    when: lines(formData.get('when')), examine: lines(formData.get('examine')),
    labs: str(formData.get('labs')) ?? '', ekg: str(formData.get('ekg')) ?? '',
    imaging: str(formData.get('imaging')) ?? '', scores: str(formData.get('scores')) ?? '',
    red_flags: lines(formData.get('red_flags')), apn_focus: lines(formData.get('apn_focus')),
    treatment: lines(formData.get('treatment')), followup: lines(formData.get('followup')),
    source_name: str(formData.get('source_name')) ?? '', source_url: str(formData.get('source_url')) ?? '',
    version: str(formData.get('version')) ?? '', updated: new Date().toISOString().slice(0, 10),
    evidence: str(formData.get('evidence')) ?? '',
  }

  // DDx: soronként "Név" vagy "Név | slug"
  const ddx = lines(formData.get('ddx')).map((l) => {
    const [nm, sl] = l.split('|').map((x) => x.trim())
    return sl ? { name: nm, slug: sl } : { name: nm }
  })
  // Reviewerek: soronként "Név | szakterület | szerep | dátum"
  const reviewers = lines(formData.get('reviewers')).map((l) => {
    const [nm, sp, rl, dt] = l.split('|').map((x) => x.trim())
    return { name: nm, specialty: sp || null, role: rl || null, date: dt || null }
  })
  const apn_approach = {
    anamnesis: str(formData.get('apn_anamnesis')), physical: str(formData.get('apn_physical')),
    data: str(formData.get('apn_data')), thinking: str(formData.get('apn_thinking')),
    consultation: str(formData.get('apn_consultation')), escalation: str(formData.get('apn_escalation')),
  }
  const block_sources: Record<string, string> = {}
  for (const k of ['labor', 'ekg', 'kezeles']) { const v = str(formData.get(`bs_${k}`)); if (v) block_sources[k] = v }

  const row = {
    name, slug,
    aliases: commas(formData.get('aliases')), abbrev: str(formData.get('abbrev')),
    specialty: str(formData.get('specialty')), context_id: str(formData.get('context_id')),
    score_ids: commas(formData.get('score_ids')), lab_ids: commas(formData.get('lab_ids')),
    ekg_ids: commas(formData.get('ekg_ids')), guideline_kw: commas(formData.get('guideline_kw')),
    version: str(formData.get('version')), review_on: str(formData.get('review_on')), expires_on: str(formData.get('expires_on')),
    ai_generated: formData.get('ai_generated') === 'on', body,
    epidemiology: str(formData.get('epidemiology')), pathophysiology: str(formData.get('pathophysiology')),
    ddx, apn_approach, reviewers, block_sources,
    evidence_levels: formData.getAll('evidence_levels').map((x) => String(x)),
    validation_status: str(formData.get('validation_status')),
  }

  if (id) {
    const { data, error } = await supabase.from('diseases').update(row).eq('id', id).select('id')
    if (error) return { error: `Adatbázis-hiba: ${error.message}` }
    if (!data || data.length === 0) return { error: 'A mentés 0 sort érintett (jogosultság?).' }
    revalidatePath('/cms/betegsegek'); revalidatePath('/betegsegtar')
    return { saved: true, id }
  } else {
    const { data, error } = await supabase.from('diseases').insert({ ...row, status: 'draft', created_by: userId }).select('id')
    if (error) return { error: `Adatbázis-hiba: ${error.message}` }
    revalidatePath('/cms/betegsegek')
    return { saved: true, id: data?.[0]?.id }
  }
}

export async function transitionDisease(formData: FormData) {
  const { userId, role } = await currentRole()
  if (!userId || !STAFF.includes(role as Role)) return
  const supabase = await createClient()
  const id = String(formData.get('id') ?? '')
  const action = String(formData.get('action') ?? '')
  const { data: d } = await supabase.from('diseases').select('status').eq('id', id).maybeSingle<{ status: string }>()
  if (!d) return
  const patch: Record<string, unknown> = {}
  if (action === 'submit' && d.status === 'draft') patch.status = 'review'
  else if (action === 'reject' && d.status === 'review') patch.status = 'draft'
  else if (action === 'publish' && d.status === 'review') { if (!PUBLISHERS.includes(role as Role)) return; patch.status = 'published'; patch.reviewed_by = userId }
  else if (action === 'expire' && d.status === 'published') { if (!PUBLISHERS.includes(role as Role)) return; patch.status = 'expired' }
  else if (action === 'revoke') { if (!PUBLISHERS.includes(role as Role)) return; patch.status = 'draft' }
  else return
  await supabase.from('diseases').update(patch).eq('id', id)
  revalidatePath('/cms/betegsegek'); revalidatePath('/betegsegtar')
}
