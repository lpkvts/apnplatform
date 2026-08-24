import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isStaff } from '@/lib/roles'
import { DiseaseForm, type DiseaseData } from '@/components/disease-form'
export const dynamic = 'force-dynamic'
export default async function DiseaseEdit({ params }: { params: Promise<{ id: string }> }) {
  const { role } = await currentRole()
  if (!isStaff(role)) return <div className="card">Nincs jogosultság.</div>
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('diseases').select('*').eq('id', id).maybeSingle<DiseaseData & { status: string }>()
  if (!data) notFound()
  return (<><Link className="sh-back" href="/cms/betegsegek">‹ Betegségtár kezelése</Link><h1 className="h1">Betegség szerkesztése</h1><p className="sub">Állapot: {(data as { status?: string }).status}</p><DiseaseForm d={data} /></>)
}
