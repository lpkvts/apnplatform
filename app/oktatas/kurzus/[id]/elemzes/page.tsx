import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { getCourse, getMemberships } from '@/lib/education/data'
import {
  getCourseCompetencyStats, getCourseQuestionStats,
  getCourseStudentStats, getCourseSummary,
} from '@/lib/education/analytics'
import { CourseAnalytics } from '@/components/course-analytics'

export const dynamic = 'force-dynamic'

export default async function ElemzesPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getFlag('education', false))) return <FeatureOff title="Oktatói mód" />

  const { id } = await params
  const course = await getCourse(id)
  if (!course) notFound()

  const memberships = await getMemberships()
  const mine = memberships.find((m) => m.institution_id === course.institution_id)
  if (mine?.role !== 'instructor' && mine?.role !== 'admin') redirect(`/oktatas/kurzus/${id}`)

  const [comps, questions, students, summary] = await Promise.all([
    getCourseCompetencyStats(id),
    getCourseQuestionStats(id),
    getCourseStudentStats(id),
    getCourseSummary(id),
  ])

  return (
    <>
      <Link className="sh-back" href={`/oktatas/kurzus/${id}`}>‹ {course.title}</Link>
      <h1 className="h1">Csoportelemzés</h1>
      <p className="sub">
        Hol tart a csoport, mely szakmai területen kell visszatérni, és ki maradt le.
      </p>
      <CourseAnalytics
        comps={comps} questions={questions} students={students} summary={summary}
      />
    </>
  )
}
