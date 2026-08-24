import Link from 'next/link'
import { currentRole, isStaff } from '@/lib/roles'
import { StubImportForm } from '@/components/stub-import-form'
export const dynamic = 'force-dynamic'
export default async function ImportPage() {
  const { role } = await currentRole()
  if (!isStaff(role)) return <div className="card">Nincs jogosultság.</div>
  return (<><Link className="sh-back" href="/cms/betegsegek">‹ Betegségtár kezelése</Link><h1 className="h1">Katalógus-import</h1><p className="sub">Tömeges betegség-stub létrehozása listából. A stubok azonnal megjelennek a Betegségtárban „fejlesztés alatt" jelöléssel; a tartalmuk később, a szerkesztőben tölthető fel.</p><StubImportForm /></>)
}
