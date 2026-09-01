import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { currentRole, isStaff } from '@/lib/roles'
import { Career, type CareerItem } from '@/components/career'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'

export const dynamic = 'force-dynamic'

export default async function CareerPage() {
  if (!(await getFlag('apn_career', false))) return <FeatureOff title="APN Career" />
  const supabase = await createClient()
  const user = await getCurrentUser()
  const { role } = await currentRole()

  const { data: items } = await supabase
    .from('career_items')
    .select('id, category, title, org, location, deadline, tags, specialty')
    .eq('status', 'published').order('created_at', { ascending: false })
    .returns<CareerItem[]>()

  const { data: p } = await supabase.from('profiles').select('apn_type, specialty').eq('id', user?.id ?? '')
    .maybeSingle<{ apn_type: string | null; specialty: string | null }>()
  const profileKw = [p?.apn_type ?? '', p?.specialty ?? '']
    .join(' ').replace(/APN/gi, ' ').split(/[\s,/]+/).filter((w) => w.length > 2)

  return (
    <>
      <div className="row" style={{ border: 'none' }}>
        <h1 className="h1" style={{ margin: 0 }}>APN Career</h1>
        {isStaff(role) && <Link className="btn sm" href="/career/uj">+ Új</Link>}
      </div>
      <p className="sub">Állások, képzések, konferenciák, pályázatok, kutatás és mentorálás.</p>
      <Career items={items ?? []} profileKw={profileKw} />
    </>
  )
}
