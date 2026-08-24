'use server'
import { createClient } from '@/lib/supabase/server'
import { currentRole, STAFF, type Role } from '@/lib/roles'
import { revalidatePath } from 'next/cache'

export interface ImportState { done?: boolean; error?: string; created?: number; skipped?: number; total?: number }

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60)
}

export async function importStubs(_prev: ImportState, formData: FormData): Promise<ImportState> {
  const { userId, role } = await currentRole()
  if (!userId || !STAFF.includes(role as Role)) return { error: 'Nincs jogosultság.' }
  const supabase = await createClient()
  const raw = String(formData.get('list') ?? '')
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return { error: 'A lista üres.' }

  // Sorformátum: "Név | Szakterület | BNO" (a szakterület és BNO opcionális)
  const parsed = lines.map((l) => {
    const [name, specialty, bno] = l.split('|').map((x) => x.trim())
    return { name, specialty: specialty || null, bno: bno || null, slug: slugify(name) }
  }).filter((p) => p.name && p.slug)

  // Meglévő slugok kiszűrése (nem írjuk felül a meglévőket)
  const slugs = parsed.map((p) => p.slug)
  const { data: existing } = await supabase.from('diseases').select('slug').in('slug', slugs).returns<{ slug: string }[]>()
  const have = new Set((existing ?? []).map((x) => x.slug))

  const seen = new Set<string>()
  const rows = parsed.filter((p) => !have.has(p.slug) && !seen.has(p.slug) && seen.add(p.slug)).map((p) => ({
    name: p.name, slug: p.slug, specialty: p.specialty, bno: p.bno,
    is_stub: true, status: 'published', validation_status: 'draft',
    aliases: [], score_ids: [], lab_ids: [], ekg_ids: [], guideline_kw: [],
    body: {}, ddx: [], apn_approach: {}, evidence_levels: [], reviewers: [], block_sources: {},
    ai_generated: false, created_by: userId,
  }))

  let created = 0
  if (rows.length > 0) {
    const { data, error } = await supabase.from('diseases').insert(rows).select('id')
    if (error) return { error: `Adatbázis-hiba: ${error.message}` }
    created = data?.length ?? 0
  }
  revalidatePath('/cms/betegsegek'); revalidatePath('/betegsegtar/betegsegek'); revalidatePath('/betegsegtar')
  return { done: true, created, skipped: parsed.length - created, total: parsed.length }
}
