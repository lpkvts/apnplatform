import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentRole, isStaff } from '@/lib/roles'
import { getForrasAttekintes } from '@/lib/forrasok/attekintes'
import { ForrasAttekintes } from '@/components/forras-attekintes'

export const dynamic = 'force-dynamic'

export default async function ForrasAttekintesPage() {
  const { role } = await currentRole()
  if (!isStaff(role)) redirect('/cms')

  const { tetelek, osszegzes } = await getForrasAttekintes()

  return (
    <>
      <Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link>
      <h1 className="h1">Forrásáttekintés</h1>
      <p className="sub">
        A platformon megjelenő összes evidenciaforrás egy helyen — modulonként,
        kereshetően. Megmutatja, mire épülnek a szakmai állítások, és hol vékony
        a lefedettség.
      </p>
      <ForrasAttekintes tetelek={tetelek} osszegzes={osszegzes} />
    </>
  )
}
