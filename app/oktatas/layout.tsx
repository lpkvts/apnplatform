import { getFlag } from '@/lib/flags'
import { getTeachingMembership, getCourses } from '@/lib/education/data'
import { EDU_ROLE_LABEL } from '@/lib/education/types'
import { EduSidebar } from '@/components/edu-sidebar'
import { EduShell } from '@/components/edu-shell'

/**
 * Az oktatói felület elrendezése.
 *
 * Saját szegmens-elrendezés, nem a gyökér része: így oldalváltáskor
 * automatikusan eltűnik, amikor a felhasználó kilép az oktatási szakaszból.
 * A gyökér elrendezés ugyanis csak egyszer fut le, ezért az oldalsáv
 * korábban a kezdőlapon is bennragadt volna.
 *
 * Az oldalsáv csak oktatóknak és intézményi adminisztrátoroknak jelenik meg;
 * a hallgató ugyanazt a reszponzív felületet kapja, mint az egyéni használatnál.
 */
export default async function OktatasLayout({ children }: { children: React.ReactNode }) {
  const eduOn = await getFlag('education', false)
  const tagsag = eduOn ? await getTeachingMembership() : null

  if (!tagsag) return <>{children}</>

  const courses = await getCourses(tagsag.institution_id)

  return (
    <EduShell
      sidebar={
        <EduSidebar
          institution={tagsag.institution?.name ?? 'Intézmény'}
          role={EDU_ROLE_LABEL[tagsag.role]}
          courses={courses.map((c) => ({
            id: c.id, title: c.title, icon: c.icon, status: c.status,
          }))}
        admin={tagsag.role === 'admin'}
          />
      }
    >
      {children}
    </EduShell>
  )
}
