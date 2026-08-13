import Link from 'next/link'
import { currentRole, isStaff } from '@/lib/roles'
import { GuidelineForm } from '@/components/guideline-form'

export default async function UjPage() {
  const { role } = await currentRole()
  if (!isStaff(role)) return <div className="card">Nincs jogosultság.</div>
  return (
    <>
      <Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link>
      <h1 className="h1">Új irányelv</h1>
      <p className="sub">Létrehozás piszkozatként — publikálás előtt lektorálás szükséges.</p>
      <GuidelineForm />
    </>
  )
}
