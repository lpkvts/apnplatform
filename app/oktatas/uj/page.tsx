import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { getTeachingMembership, getCompetencies } from '@/lib/education/data'
import { CourseForm } from '@/components/course-form'

export const dynamic = 'force-dynamic'

export default async function UjKurzusPage() {
  if (!(await getFlag('education', false))) return <FeatureOff title="Oktatói mód" />

  const teaching = await getTeachingMembership()
  if (!teaching) redirect('/oktatas')

  const comps = await getCompetencies()

  return (
    <>
      <Link className="sh-back" href="/oktatas">‹ Oktatás</Link>
      <h1 className="h1">Új kurzus</h1>
      <p className="sub">{teaching.institution?.name}</p>
      <CourseForm institutionId={teaching.institution_id} competencies={comps} />
    </>
  )
}
