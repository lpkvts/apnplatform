import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentRole } from '@/lib/roles'
import { getReviewQueue } from '@/lib/forrasok/data'
import { ForrasFelderites } from '@/components/forras-felderites'
import { OldalFej } from '@/components/oldal-fej'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Forrásfelderítés — APN-MED' }

/**
 * Forrásfelderítés.
 *
 * Nem keres és nem frissít: megmutatja, mely források avultak el vagy
 * maradtak régóta ellenőrizetlenül, és hol található az újabb kiadás. A
 * tényleges ellenőrzést ember végzi — így nem keletkezik téves
 * forrásmegjelölés, ami rosszabb lenne, mint az elavult.
 */
export default async function ForrasFelderitesPage() {
  const { role } = await currentRole()
  if (!['admin', 'szerkeszto', 'lektor'].includes(role ?? '')) redirect('/cms')

  const sor = await getReviewQueue()

  return (
    <>
      <Link className="sh-back" href="/cms">‹ Szerkesztés</Link>
      <OldalFej cim="Forrásfelderítés" meta={`${sor.length} forrás`} />
      <ForrasFelderites sor={sor} />
    </>
  )
}
