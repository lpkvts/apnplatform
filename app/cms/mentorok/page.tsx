import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentRole, isAdmin } from '@/lib/roles'
import { getFlag } from '@/lib/flags'
import { getAdminMentors } from '@/lib/mentor/data'
import { MentorAdmin } from '@/components/mentor-admin'

export const dynamic = 'force-dynamic'

export default async function CmsMentorokPage() {
  const { role } = await currentRole()
  if (!isAdmin(role)) redirect('/cms')

  const [mentors, bekapcsolva] = await Promise.all([
    getAdminMentors(),
    getFlag('mentorprogram', false),
  ])
  const fuggo = mentors.filter((m) => m.status === 'pending').length

  return (
    <>
      <Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link>
      <h1 className="h1">Mentorprogram</h1>
      <p className="sub">
        Jelentkezések elbírálása és a mentorprofilok kezelése.
        {fuggo > 0 && ` Jelenleg ${fuggo} profil vár elbírálásra.`}
      </p>

      {!bekapcsolva && (
        <div className="safety-note">
          <b>ⓘ A modul jelenleg kikapcsolva.</b> A felhasználók nem látják a
          Mentorprogramot, de a profilok megmaradnak, és bekapcsoláskor azonnal
          elérhetők. A kapcsoló a Beállítások oldalon található.
        </div>
      )}

      <MentorAdmin mentors={mentors} />
    </>
  )
}
