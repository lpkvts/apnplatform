import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentRole, isAdmin } from '@/lib/roles'
import { getInquiries } from '@/lib/inquiry/data'
import { InquiryAdmin } from '@/components/inquiry-admin'

export const dynamic = 'force-dynamic'

export default async function ErdeklodesekPage() {
  const { role } = await currentRole()
  if (!isAdmin(role)) redirect('/cms')

  const list = await getInquiries()
  const ujak = list.filter((i) => i.status === 'new').length

  return (
    <>
      <Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link>
      <h1 className="h1">Képzőhelyi megkeresések</h1>
      <p className="sub">
        A nyitóoldalról érkező érdeklődések.
        {ujak > 0 && ` Jelenleg ${ujak} új megkeresés vár válaszra.`}
      </p>
      <InquiryAdmin list={list} />
    </>
  )
}
