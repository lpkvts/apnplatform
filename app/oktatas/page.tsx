import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import {
  getMemberships, getTeachingMembership, getCourses,
  getInstructorSummary,
} from '@/lib/education/data'
import { getMyCoursesWithProgress, getMyTodo, napokMulva } from '@/lib/education/student-data'
import { COURSE_STATUS_LABEL, EDU_ROLE_LABEL, type Course, type EnrolledCourse } from '@/lib/education/types'

export const dynamic = 'force-dynamic'

/** Napszaknak megfelelő köszöntés — a nap folyamán változik. */
function greet() {
  const h = new Date().getHours()
  if (h < 10) return 'Jó reggelt'
  if (h < 18) return 'Jó napot'
  return 'Jó estét'
}

export default async function OktatasPage() {
  if (!(await getFlag('education', false))) return <FeatureOff title="Oktatói mód" />

  const [memberships, teaching] = await Promise.all([getMemberships(), getTeachingMembership()])

  if (memberships.length === 0) {
    return (
      <>
        <h1 className="h1">Oktatás</h1>
        <div className="card">
          <p style={{ margin: 0 }}>
            Még nem tartozol egyetlen képzőhelyhez sem. Ha oktatóként vagy hallgatóként
            szeretnéd használni a platformot, kérd meg az intézményi kapcsolattartót,
            hogy vegyen fel.
          </p>
        </div>
      </>
    )
  }

  /* ── Hallgatói nézet ── */
  if (!teaching) {
    const [courses, todo] = await Promise.all([getMyCoursesWithProgress(), getMyTodo()])

    return (
      <>
        <h1 className="h1">Kurzusaim</h1>
        <p className="sub">
          {memberships.map((m) => m.institution?.name).filter(Boolean).join(', ')}
        </p>

        {/* Teendők: ami hátra van, a legsürgősebb elöl. A már beadott feladat
            akkor sem szerepel itt, ha újra beadható — ez a lista arról szól,
            mi hiányzik, nem arról, mit lehetne javítani. */}
        {todo.length > 0 && (
          <>
            <div className="sec-h">
              <span className="sec-t">Teendőid</span>
              <span className="sub" style={{ margin: 0, fontSize: 13 }}>{todo.length}</span>
            </div>
            {todo.map((t) => {
              const nap = napokMulva(t.due_at)
              return (
                <Link className="card klink" href={`/oktatas/feladat/${t.assignment_id}`} key={t.assignment_id}>
                  <div className="row" style={{ border: 'none', padding: 0, alignItems: 'flex-start' }}>
                    <span style={{ flex: 1 }}>
                      <b style={{ fontSize: 15 }}>{t.title}</b>
                      <span className="sub" style={{ display: 'block', margin: '2px 0 0', fontSize: 12.5 }}>
                        {t.course_title}
                      </span>
                    </span>
                    {t.due_at && (
                      <span className={`mp-badge ${t.lejart ? 'rejected' : nap !== null && nap <= 3 ? 'pending' : 'inactive'}`}>
                        {t.lejart ? 'Lejárt'
                          : nap === 0 ? 'Ma jár le'
                          : nap === 1 ? 'Holnap'
                          : `${nap} nap`}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </>
        )}

        <div className="sec-h"><span className="sec-t">Kurzusok</span></div>

        {courses.length === 0 && (
          <div className="card">
            <p style={{ margin: 0 }}>
              Még nincs kurzusod. Ha képzésen veszel részt, az oktató iratkoztat be.
            </p>
          </div>
        )}

        {courses.map((c) => (
          <Link key={c.id} className="card klink" href={`/oktatas/kurzus/${c.id}`}>
            <div className="klink-t">{c.icon ?? '📘'} {c.title}</div>
            <div className="sub" style={{ margin: '4px 0 8px' }}>
              {[c.level, c.specialty].filter(Boolean).join(' · ') || c.institution_name}
            </div>

            {c.haladas === null ? (
              <p className="sub" style={{ margin: 0, fontSize: 12.5 }}>
                A kurzuson még nincs megnyitott feladat.
              </p>
            ) : (
              <>
                <div className="ekg-prog-bar">
                  <div style={{ width: `${c.haladas}%` }} />
                </div>
                <div className="sub" style={{ marginTop: 6, fontSize: 12 }}>
                  {c.beadott} / {c.feladatok} feladat beadva
                  {c.teljesitett > 0 && ` · ${c.teljesitett} teljesítve`}
                  {c.beadott > 0 && ` · átlag ${c.atlag}%`}
                </div>
              </>
            )}
          </Link>
        ))}
      </>
    )
  }

  /* ── Oktatói nézet ── */
  const [summary, courses] = await Promise.all([
    getInstructorSummary(teaching.institution_id),
    getCourses(teaching.institution_id),
  ])

  return (
    <>
      <h1 className="h1">{greet()}!</h1>
      <p className="sub">
        {teaching.institution?.name} · {EDU_ROLE_LABEL[teaching.role]}
      </p>

      <div className="card">
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-num">{summary?.students ?? 0}</div><div className="stat-lbl">Hallgató</div></div>
          <div className="stat-card"><div className="stat-num">{summary?.courses_active ?? 0}</div><div className="stat-lbl">Aktív kurzus</div></div>
          <div className="stat-card"><div className="stat-num">{summary?.enrollments ?? 0}</div><div className="stat-lbl">Beiratkozás</div></div>
          <div className="stat-card"><div className="stat-num">{summary?.avg_progress ?? 0}%</div><div className="stat-lbl">Átlagos haladás</div></div>
        </div>
      </div>

      <Link className="btn" href="/oktatas/uj" style={{ width: '100%', marginTop: 12 }}>
        + Új kurzus létrehozása
      </Link>

      <div className="sec-h" style={{ marginTop: 18 }}>
        <span className="sec-t">Kurzusok</span>
        <span className="sec-l" style={{ marginLeft: 'auto', fontWeight: 500 }}>{courses.length}</span>
      </div>

      {courses.length === 0 && (
        <div className="card">
          <p style={{ margin: 0 }}>
            Még nincs kurzus. Az elsőt a fenti gombbal hozhatod létre — a kurzus a
            célkompetenciák megadásával indul, mert azokhoz mérjük majd a hallgatók
            teljesítményét.
          </p>
        </div>
      )}

      <div className="edu-2col">
      {courses.map((c: Course) => (
        <Link key={c.id} className="card klink" href={`/oktatas/kurzus/${c.id}`}>
          <div className="row" style={{ border: 'none', padding: 0 }}>
            <span className="klink-t">{c.icon ?? '📘'} {c.title}</span>
            <span className={`badge ${c.status === 'active' ? 'badge-uj' : ''}`}>
              {COURSE_STATUS_LABEL[c.status]}
            </span>
          </div>
          <div className="sub" style={{ margin: '4px 0 0' }}>
            {[c.level, c.specialty].filter(Boolean).join(' · ') || 'Nincs megadva szakterület'}
          </div>
        </Link>
      ))}
      </div>
    </>
  )
}
