import Link from 'next/link'

/**
 * Oktatói oldalsó navigáció.
 *
 * A specifikáció szerint az intézményi felület ne a mobilos elrendezés
 * felnagyítása legyen, hanem saját, desktop-orientált munkafelület. Az állandó
 * oldalsó navigáció ennek a legfontosabb eleme: a szerkezet mindig látszik, és
 * a munka közben nem kell visszalépkedni.
 *
 * Kis képernyőn nem jelenik meg — ott az alsó navigáció marad, ahogy a
 * hallgatói és a klinikai használatnál.
 */

export interface SidebarCourse {
  id: string
  title: string
  icon: string | null
  status: string
}

export function EduSidebar({
  institution, role, courses, admin = false,
}: {
  institution: string
  role: string
  courses: SidebarCourse[]
  /** Intézményi adminisztrátor: neki a tagságkezelés is elérhető. */
  admin?: boolean
}) {
  return (
    <aside className="edu-side">
      <div className="edu-side-fej">
        <span className="edu-side-inst">{institution}</span>
        <span className="edu-side-role">{role}</span>
      </div>

      <nav className="edu-side-nav">
        <Link href="/oktatas" className="edu-side-l">
          <span aria-hidden="true">▦</span> Áttekintés
        </Link>
        <Link href="/oktatas/uj" className="edu-side-l">
          <span aria-hidden="true">＋</span> Új kurzus
        </Link>
        {/* A tagságkezelés csak adminisztrátornak: az oktató nem oszthat
            jogosultságot, mert azzal saját magát is előléptethetné. */}
        {admin && (
          <Link href="/oktatas/tagok" className="edu-side-l">
            <span aria-hidden="true">◎</span> Tagok
          </Link>
        )}
      </nav>

      {courses.length > 0 && (
        <>
          <div className="edu-side-cim">Kurzusok</div>
          <nav className="edu-side-nav">
            {courses.map((c) => (
              <Link key={c.id} href={`/oktatas/kurzus/${c.id}`}
                className="edu-side-l" data-course={c.id}>
                <span aria-hidden="true">{c.icon ?? '📘'}</span>
                <span className="edu-side-t">{c.title}</span>
                {c.status === 'draft' && <i className="edu-side-jel">piszkozat</i>}
              </Link>
            ))}
          </nav>
        </>
      )}
    </aside>
  )
}
