import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isStaff } from '@/lib/roles'
import { GuidelineForm } from '@/components/guideline-form'

interface GRow {
  id: string; title: string; summary: string | null; specialty: string[] | null
  version: string | null; review_on: string | null; expires_on: string | null
  ai_generated: boolean; status: string; body: { sections?: [string, string][] } | null
}

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { role } = await currentRole()
  if (!isStaff(role)) return <div className="card">Nincs jogosultság.</div>
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('guidelines')
    .select('id, title, summary, specialty, version, review_on, expires_on, ai_generated, status, body')
    .eq('id', id)
    .maybeSingle<GRow>()
  if (!data) notFound()

  return (
    <>
      <Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link>
      <h1 className="h1">Irányelv szerkesztése</h1>
      <p className="sub">Állapot: {data.status}</p>
      <GuidelineForm g={data} />
    </>
  )
}
