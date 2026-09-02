'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import type { QKind, Option, Status } from './assignments'

export interface Res { ok: boolean; message: string; id?: string }

const s = (v: FormDataEntryValue | null) => {
  const t = typeof v === 'string' ? v.trim() : ''
  return t === '' ? null : t
}

/* ─────────── Feladat ─────────── */

export async function saveAssignment(courseId: string, form: FormData): Promise<Res> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: 'Nincs bejelentkezve.' }

  const title = s(form.get('title'))
  if (!title) return { ok: false, message: 'A feladat címe kötelező.' }

  const pass = Number(s(form.get('pass_pct')) ?? 60)
  if (!Number.isFinite(pass) || pass < 0 || pass > 100) {
    return { ok: false, message: 'A teljesítési küszöb 0 és 100 között adható meg.' }
  }
  const attemptsRaw = s(form.get('max_attempts'))
  const attempts = attemptsRaw ? Number(attemptsRaw) : null
  if (attempts !== null && (!Number.isFinite(attempts) || attempts < 1 || attempts > 20)) {
    return { ok: false, message: 'A beadások száma 1 és 20 között adható meg.' }
  }

  const id = s(form.get('id'))
  const adat = {
    course_id: courseId,
    title,
    description: s(form.get('description')),
    due_at: s(form.get('due_at')),
    max_attempts: attempts,
    pass_pct: pass,
    show_answers: form.get('show_answers') === 'on',
    updated_at: new Date().toISOString(),
  }

  const supabase = await createClient()
  const { data, error } = id
    ? await supabase.from('education_assignments').update(adat).eq('id', id).select('id').single<{ id: string }>()
    : await supabase.from('education_assignments')
        .insert({ ...adat, created_by: user.id, status: 'draft' })
        .select('id').single<{ id: string }>()

  if (error || !data) return { ok: false, message: error?.message ?? 'A mentés nem sikerült.' }

  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: id ? 'A feladat mentve.' : 'A feladat létrehozva.', id: data.id }
}

export async function setAssignmentStatus(id: string, status: Status): Promise<Res> {
  if (!['draft', 'open', 'closed'].includes(status)) {
    return { ok: false, message: 'Ismeretlen állapot.' }
  }
  const supabase = await createClient()

  // Kérdés nélküli feladatot nem engedünk megnyitni: a hallgató üres
  // feladatlapot kapna, és a beadás nulla pontot adna.
  if (status === 'open') {
    const { count } = await supabase
      .from('education_questions').select('id', { count: 'exact', head: true })
      .eq('assignment_id', id)
    if (!count) return { ok: false, message: 'Előbb vegyél fel legalább egy kérdést.' }
  }

  const { error } = await supabase
    .from('education_assignments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, message: error.message }

  revalidatePath(`/oktatas/feladat/${id}`)
  const L: Record<Status, string> = {
    draft: 'piszkozatba téve', open: 'megnyitva', closed: 'lezárva',
  }
  return { ok: true, message: `A feladat ${L[status]}.` }
}

export async function deleteAssignment(id: string, courseId: string): Promise<Res> {
  const supabase = await createClient()
  const { error } = await supabase.from('education_assignments').delete().eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: 'A feladat törölve.' }
}

/* ─────────── Kérdés ─────────── */

export interface QuestionInput {
  id?: string
  kind: QKind
  prompt: string
  options: Option[]
  accepted: string[]
  points: number
  explanation: string | null
  competency_id: string | null
}

export async function saveQuestion(assignmentId: string, q: QuestionInput): Promise<Res> {
  if (!q.prompt.trim()) return { ok: false, message: 'A kérdés szövege kötelező.' }

  if (q.kind === 'short') {
    if (q.accepted.filter((a) => a.trim()).length === 0) {
      return { ok: false, message: 'Adj meg legalább egy elfogadható választ.' }
    }
  } else {
    const jo = q.options.filter((o) => o.correct)
    if (q.options.length < 2) return { ok: false, message: 'Legalább két válaszlehetőség kell.' }
    if (jo.length === 0) return { ok: false, message: 'Jelöld meg a helyes választ.' }
    if (q.kind !== 'multi' && jo.length > 1) {
      return { ok: false, message: 'Ennél a típusnál csak egy helyes válasz lehet.' }
    }
    if (q.options.some((o) => !o.label.trim())) {
      return { ok: false, message: 'Minden válaszlehetőségnek legyen szövege.' }
    }
  }

  const supabase = await createClient()
  const adat = {
    assignment_id: assignmentId,
    kind: q.kind,
    prompt: q.prompt.trim(),
    options: q.kind === 'short' ? [] : q.options,
    accepted: q.kind === 'short' ? q.accepted.map((a) => a.trim()).filter(Boolean) : [],
    points: Math.min(20, Math.max(1, q.points)),
    explanation: q.explanation?.trim() || null,
    competency_id: q.competency_id,
  }

  if (q.id) {
    const { error } = await supabase.from('education_questions').update(adat).eq('id', q.id)
    if (error) return { ok: false, message: error.message }
  } else {
    // Az új kérdés a lista végére kerül.
    const { count } = await supabase
      .from('education_questions').select('id', { count: 'exact', head: true })
      .eq('assignment_id', assignmentId)
    const { error } = await supabase
      .from('education_questions').insert({ ...adat, ord: count ?? 0 })
    if (error) return { ok: false, message: error.message }
  }

  revalidatePath(`/oktatas/feladat/${assignmentId}`)
  return { ok: true, message: q.id ? 'A kérdés mentve.' : 'A kérdés hozzáadva.' }
}

export async function deleteQuestion(id: string, assignmentId: string): Promise<Res> {
  const supabase = await createClient()
  const { error } = await supabase.from('education_questions').delete().eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath(`/oktatas/feladat/${assignmentId}`)
  return { ok: true, message: 'A kérdés törölve.' }
}

/* ─────────── Beadás ─────────── */

/**
 * Beadás és kiértékelés.
 *
 * A pontozás az adatbázisban fut, mert a helyes válasz sosem kerül a kliensre.
 * A kliens csak azt küldi el, mit jelölt meg a hallgató.
 */
export async function submitAssignment(
  assignmentId: string,
  answers: Record<string, { picked?: string[]; text?: string }>,
): Promise<Res & { pct?: number; passed?: boolean }> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('edu_submit', {
    p_assignment: assignmentId,
    p_answers: answers,
  })
  if (error) return { ok: false, message: error.message }

  const r = (data as { pct: number; passed: boolean }[] | null)?.[0]
  revalidatePath(`/oktatas/feladat/${assignmentId}`)
  return {
    ok: true,
    message: r ? `Beadva — ${r.pct}%` : 'Beadva.',
    pct: r?.pct,
    passed: r?.passed,
  }
}

/** Oktatói szöveges visszajelzés egy beadáshoz. */
export async function saveFeedback(
  submissionId: string, assignmentId: string, feedback: string,
): Promise<Res> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('education_submissions')
    .update({ feedback: feedback.trim() || null })
    .eq('id', submissionId)
  if (error) return { ok: false, message: error.message }
  revalidatePath(`/oktatas/feladat/${assignmentId}`)
  return { ok: true, message: 'A visszajelzés mentve.' }
}
