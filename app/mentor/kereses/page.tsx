import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { getMentors } from '@/lib/mentor/data'
import { MentorKereso } from '@/components/mentor-kereso'

export const dynamic = 'force-dynamic'

export default async function MentorKeresesPage() {
  if (!(await getFlag('mentorprogram', false))) return <FeatureOff title="Mentorprogram" />
  const mentors = await getMentors()

  return (
    <>
      <Link className="sh-back" href="/mentor">‹ Mentorprogram</Link>
      <h1 className="h1">Mentort keresek</h1>
      <p className="sub">
        Szűrj szakterület, mentorálási téma vagy tapasztalat szerint, és vedd fel a
        kapcsolatot a hozzád illő szakemberrel.
      </p>
      <MentorKereso mentors={mentors} />
    </>
  )
}
