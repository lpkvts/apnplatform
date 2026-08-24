import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isStaff } from '@/lib/roles'
import { SourcesManager } from '@/components/sources-manager'
import type { SourceData } from '@/components/source-form'
export const dynamic = 'force-dynamic'
export default async function ForrasokPage() {
  const { role } = await currentRole()
  if (!isStaff(role)) return <><h1 className="h1">Források</h1><div className="card">Ehhez szerkesztő/lektor/admin jog szükséges.</div></>
  const supabase = await createClient()
  const { data } = await supabase.from('clinical_sources').select('*').order('status').order('next_review', { nullsFirst: false }).returns<SourceData[]>()
  const today = new Date().toISOString().slice(0, 10)
  return (<><Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link><h1 className="h1">Klinikai források</h1><p className="sub">Evidenciaforrások központi nyilvántartása: irányelvek, standardok, verziók és felülvizsgálati dátumok.</p><SourcesManager items={data ?? []} today={today} /></>)
}
