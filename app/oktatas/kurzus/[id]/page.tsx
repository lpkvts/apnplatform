import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import {
  getCourse, getCourseStudents, getCourseCompetencies, getMemberships,
  COURSE_STATUS_LABEL,
} from '@/lib/education/data'
import { CourseAdmin } from '@/components/course-admin'
import { getAssignments } from '@/lib/education/assignments-data'
import { CourseAssignments } from '@/components/course-assignments'
import { getMaterials, getStudentMaterials } from '@/lib/education/materials-data'
import { CourseMaterials } from '@/components/course-materials'
import { getCourseGroups } from '@/lib/education/student-data'

export const dynamic = 'force-dynamic'

export default async function KurzusPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getFlag('education', false))) return <FeatureOff title="Oktatói mód" />

  const { id } = await params
  const course = await getCourse(id)
  if (!course) notFound()

  const memberships = await getMemberships()
  const mine = memberships.find((m) => m.institution_id === course.institution_id)
  const canManage = mine?.role === 'instructor' || mine?.role === 'admin'

  const [students, comps, assignments, materials] = await Promise.all([
    canManage ? getCourseStudents(id) : Promise.resolve([]),
    getCourseCompetencies(id),
    getAssignments(id),
    // Az oktató az előkészítés alatt lévőket is látja, a hallgató csak a közzétettet.
    canManage ? getMaterials(id) : getStudentMaterials(id),
  ])
  const groups = canManage ? await getCourseGroups(id) : []

  return (
    <>
      <Link className="sh-back" href="/oktatas">‹ Oktatás</Link>
      <h1 className="h1">{course.icon ?? '📘'} {course.title}</h1>
      <p className="sub">
        {[course.level, course.specialty, COURSE_STATUS_LABEL[course.status]]
          .filter(Boolean).join(' · ')}
      </p>

      {course.description && (
        <div className="card"><p style={{ margin: 0 }}>{course.description}</p></div>
      )}

      {(course.starts_on || course.ends_on) && (
        <div className="card">
          <div className="row" style={{ border: 'none', padding: 0 }}>
            <span className="sub" style={{ margin: 0 }}>Időtartam</span>
            <b>{[course.starts_on, course.ends_on].filter(Boolean).join(' — ')}</b>
          </div>
        </div>
      )}

      {comps.length > 0 && (
        <>
          <div className="sec-h"><span className="sec-t">Célkompetenciák</span></div>
          <div className="card">
            <div className="sh-chips">
              {comps.map((c) => <span className="sh-chip on" key={c.id}>{c.name}</span>)}
            </div>
            <p className="sub" style={{ margin: '10px 0 0', fontSize: 12 }}>
              A kurzus feladatainak eredménye ezekhez a területekhez rendelődik.
            </p>
          </div>
        </>
      )}

      <CourseMaterials courseId={id} materials={materials} canManage={canManage} />

      <CourseAssignments
        courseId={id} assignments={assignments} canManage={canManage}
      />

      {canManage && assignments.length > 0 && (
        <Link className="btn ghost" href={`/oktatas/kurzus/${id}/elemzes`}
          style={{ width: '100%', marginTop: 10 }}>
          📊 Csoportelemzés
        </Link>
      )}

      {canManage ? (
        <CourseAdmin course={course} students={students} groups={groups} />
      ) : (
        <>
          <div className="sec-h"><span className="sec-t">Tartalom</span></div>
          <div className="card">
            <p style={{ margin: 0 }}>
              A kurzus tananyaga és feladatai hamarosan elérhetők lesznek itt. Addig a
              klinikai modulok — betegvizsgálat, labor, EKG — szabadon használhatók.
            </p>
          </div>
          <Link className="btn ghost" href="/klinika" style={{ width: '100%', marginTop: 12 }}>
            Klinikai mag megnyitása
          </Link>
        </>
      )}
    </>
  )
}
