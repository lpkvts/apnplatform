import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { getMemberships, getCourse, getCompetencies } from '@/lib/education/data'
import {
  getAssignment, getQuestions, getStudentQuestions, getMySubmissions, getResults,
} from '@/lib/education/assignments-data'
import { AssignmentEditor } from '@/components/assignment-editor'
import { AssignmentRunner } from '@/components/assignment-runner'

export const dynamic = 'force-dynamic'

export default async function FeladatPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getFlag('education', false))) return <FeatureOff title="Oktatói mód" />

  const { id } = await params
  const a = await getAssignment(id)
  if (!a) notFound()

  const [course, memberships] = await Promise.all([getCourse(a.course_id), getMemberships()])
  const mine = memberships.find((m) => m.institution_id === course?.institution_id)
  const canManage = mine?.role === 'instructor' || mine?.role === 'admin'

  if (canManage) {
    const [questions, results, comps] = await Promise.all([
      getQuestions(id), getResults(id), getCompetencies(),
    ])
    return (
      <>
        <Link className="sh-back" href={`/oktatas/kurzus/${a.course_id}`}>‹ {course?.title ?? 'Kurzus'}</Link>
        <h1 className="h1">{a.title}</h1>
        {a.description && <p className="sub">{a.description}</p>}
        <AssignmentEditor
          assignment={a} questions={questions} results={results} competencies={comps}
        />
      </>
    )
  }

  // ── Hallgatói nézet ──
  const [questions, subs] = await Promise.all([getStudentQuestions(id), getMySubmissions(id)])

  return (
    <>
      <Link className="sh-back" href={`/oktatas/kurzus/${a.course_id}`}>‹ {course?.title ?? 'Kurzus'}</Link>
      <h1 className="h1">{a.title}</h1>
      {a.description && <p className="sub">{a.description}</p>}
      <AssignmentRunner assignment={a} questions={questions} submissions={subs} />
    </>
  )
}
