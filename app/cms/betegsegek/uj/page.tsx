import Link from 'next/link'
import { currentRole, isStaff } from '@/lib/roles'
import { DiseaseForm } from '@/components/disease-form'
export const dynamic = 'force-dynamic'
export default async function DiseaseUj() {
  const { role } = await currentRole()
  if (!isStaff(role)) return <div className="card">Nincs jogosultság.</div>
  return (<><Link className="sh-back" href="/cms/betegsegek">‹ Betegségtár kezelése</Link><h1 className="h1">Új betegség</h1><p className="sub">Létrehozás piszkozatként — publikálás előtt lektorálás szükséges.</p><DiseaseForm /></>)
}
