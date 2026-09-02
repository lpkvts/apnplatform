import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { getMyMentorProfile } from '@/lib/mentor/data'
import { MentorUrlap } from '@/components/mentor-urlap'

export const dynamic = 'force-dynamic'

export default async function MentorJelentkezesPage() {
  if (!(await getFlag('mentorprogram', false))) return <FeatureOff title="Mentorprogram" />
  const sajat = await getMyMentorProfile()

  return (
    <>
      <Link className="sh-back" href="/mentor">‹ Mentorprogram</Link>
      <h1 className="h1">{sajat ? 'Mentorprofilom' : 'Mentor leszek'}</h1>
      <p className="sub">
        {sajat
          ? 'A profilod szerkesztése. Tartalmi módosítás után a profil újra elbírálásra kerül.'
          : 'Oszd meg, miben tudsz segíteni. A jelentkezésed adminisztrátori jóváhagyás után jelenik meg a mentorok között.'}
      </p>
      <MentorUrlap letezo={sajat} />
    </>
  )
}
