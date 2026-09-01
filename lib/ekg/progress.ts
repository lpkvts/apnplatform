'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { EKG_COMPETENCES, competenceForStep, type StepId } from '@/lib/ekg/analysis'

/**
 * EKG feladatok eredményének mentése.
 *
 * A válaszokat kompetencia-területhez rendelve tároljuk, mert a fejlődés csak
 * így követhető: nem az számít, hány esetet oldott meg valaki, hanem hogy mely
 * területeken téved rendszeresen.
 */

export type Verdict = 'ok' | 'partial' | 'off'
export type Mode = 'guided' | 'solo' | 'practice' | 'exam'

export interface AnswerInput {
  /** Elemzési lépés (vezetett és önálló mód), ebből származik a kompetencia. */
  step?: StepId
  /** Atlasz-elem címkéje (gyakorló és vizsga mód), ebből is származhat. */
  tag?: string
  verdict: Verdict
  usedHint?: boolean
}

/** Melyik kompetenciába tartozik egy válasz. */
function competenceOf(a: AnswerInput): string | null {
  if (a.step) return competenceForStep(a.step)?.id ?? null
  if (a.tag) return EKG_COMPETENCES.find((c) => c.tags.includes(a.tag!))?.id ?? null
  return null
}

export async function saveEkgAttempt(
  mode: Mode,
  caseId: string | null,
  answers: AnswerInput[],
): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  // Csak azokat a válaszokat tartjuk meg, amelyek besorolhatók valamelyik
  // kompetenciába — a besorolatlan válasz nem mond semmit a fejlődésről.
  const rows = answers
    .map((a) => ({ comp: competenceOf(a), a }))
    .filter((x): x is { comp: string; a: AnswerInput } => !!x.comp)

  const ok = answers.filter((a) => a.verdict === 'ok').length
  const partial = answers.filter((a) => a.verdict === 'partial').length
  const hints = answers.filter((a) => a.usedHint).length
  const pct = answers.length
    ? Math.round(((ok + partial * 0.5) / answers.length) * 100)
    : 0

  const { data: attempt, error } = await supabase
    .from('ekg_attempts')
    .insert({
      owner_id: user.id,
      mode,
      case_id: caseId,
      answered: answers.length,
      correct_count: ok,
      partial_count: partial,
      hint_count: hints,
      score_pct: pct,
    })
    .select('id')
    .single<{ id: string }>()

  if (error || !attempt) return { ok: false }

  if (rows.length) {
    await supabase.from('ekg_answers').insert(
      rows.map(({ comp, a }) => ({
        attempt_id: attempt.id,
        owner_id: user.id,
        competence: comp,
        verdict: a.verdict,
        used_hint: !!a.usedHint,
      })),
    )
  }

  revalidatePath('/klinika/ekg')
  revalidatePath('/klinika/ekg/fejlodes')
  return { ok: true }
}

/* ─────────── Lekérdezések ─────────── */

export interface CompetenceRow {
  competence: string
  total: number
  pct: number
  last_at: string | null
}

export async function getEkgCompetences(): Promise<CompetenceRow[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('ekg_competence_summary')
  return (data as CompetenceRow[] | null) ?? []
}

export interface EkgProgress {
  attempts: number
  avg_pct: number
  last_at: string | null
  streak_days: number
}

export async function getEkgProgress(): Promise<EkgProgress | null> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('ekg_progress_summary')
  return (data as EkgProgress[] | null)?.[0] ?? null
}
