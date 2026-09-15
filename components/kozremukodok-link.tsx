import Link from 'next/link'
import { getFlag } from '@/lib/flags'

/**
 * Hivatkozás a közreműködők oldalára.
 *
 * Több helyről elérhető, mert a köszönetnyilvánítás csak akkor ér valamit,
 * ha meg is találják. A modul kikapcsolt állapotában nem jelenik meg —
 * így nem keletkezik hivatkozás egy elérhetetlen oldalra.
 */
export async function KozremukodokLink({
  valtozat = 'sor',
}: {
  /** „sor” a listák közé, „lablec” a diszkrét, oldal alji megjelenéshez. */
  valtozat?: 'sor' | 'lablec'
}) {
  if (!(await getFlag('kozremukodok', false))) return null

  if (valtozat === 'lablec') {
    return (
      <p className="kozr-lablec">
        <Link href="/kozremukodok">Közreműködők</Link>
        <span>Akik a tartalmat lektorálják és a platformot építik</span>
      </p>
    )
  }

  return (
    <Link className="lst-sor" href="/kozremukodok">
      <span className="lst-fo">
        <b>Közreműködők</b>
        <span>Akik a tartalmat lektorálják és a platformot építik</span>
      </span>
      <span className="lst-meta">köszönet</span>
    </Link>
  )
}
