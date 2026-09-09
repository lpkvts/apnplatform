import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase/user'
import { getTeachingMembership } from '@/lib/education/data'
import { getMembers } from '@/lib/education/members'
import { EduTagok } from '@/components/edu-tagok'
import { Morzsa } from '@/components/morzsa'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tagok — APN-MED Education',
  description: 'Az intézmény oktatóinak és hallgatóinak kezelése.',
}

/**
 * Az intézmény tagjai.
 *
 * Csak intézményi adminisztrátor éri el. Az adatbázis maga is ellenőrzi a
 * jogosultságot, ez a szűrés az útvonalon csak azért van, hogy a felhasználó
 * ne egy üres, használhatatlan felületet lásson.
 */
export default async function TagokPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const tagsag = await getTeachingMembership()
  if (!tagsag) redirect('/oktatas')

  if (tagsag.role !== 'admin') {
    return (
      <>
        <Morzsa elemek={[{ label: 'Education', href: '/oktatas' }, { label: 'Tagok' }]} />
        <h1 className="h1">Tagok</h1>
        <div className="card empty">
          <b>Nincs jogosultságod</b>
          <p>
            A tagok kezelése az intézmény adminisztrátorának feladata. Ha oktatói
            jogosultságra van szükséged, kérd az intézményed adminisztrátorától.
          </p>
          <Link className="btn ghost sm" href="/oktatas" style={{ marginTop: 10 }}>
            Vissza az Educationhöz
          </Link>
        </div>
      </>
    )
  }

  const tagok = await getMembers(tagsag.institution.id)

  return (
    <>
      <Morzsa elemek={[{ label: 'Education', href: '/oktatas' }, { label: 'Tagok' }]} />
      <h1 className="h1">Tagok és jogosultságok</h1>
      <EduTagok
        institutionId={tagsag.institution.id}
        intezmenyNev={tagsag.institution.name}
        tagok={tagok}
        sajatId={user.id}
      />
    </>
  )
}
