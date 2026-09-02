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
  institution, role, courses, active,
}: {
  institution: string
  role: string
  courses: SidebarCourse[]
  /** Az aktuális kurzus azonosítója, ha kurzus-oldalon vagyunk. */
  active?: string
}) {
  return (
    <aside className="edu-side">
      <div className="edu-side-fej">
        <span className="edu-side-inst">{institution}</span>
        <span className="edu-side-role">{role}</span>
      </div>

      <nav className="edu-side-nav">
        <Link href="/oktatas" className={`edu-side-l ${!active ? 'on' : ''}`}>
          <span aria-hidden="true">▦</span> Áttekintés
        </Link>
        <Link href="/oktatas/uj" className="edu-side-l">
          <span aria-hidden="true">＋</span> Új kurzus
        </Link>
      </nav>

      {courses.length > 0 && (
        <>
          <div className="edu-side-cim">Kurzusok</div>
          <nav className="edu-side-nav">
            {courses.map((c) => (
              <Link key={c.id} href={`/oktatas/kurzus/${c.id}`}
                className={`edu-side-l ${active === c.id ? 'on' : ''}`}>
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
