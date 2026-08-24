export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isStaff } from '@/lib/roles'
import type { Profile } from '@/lib/types'
import { getFlag } from '@/lib/flags'

const ROLE_LABEL: Record<string, string> = {
  apn: 'APN', szerkeszto: 'Szerkesztő', lektor: 'Lektor', admin: 'Adminisztrátor',
}

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="row">
      <span className="sub" style={{ margin: 0 }}>{label}</span>
      <b style={{ textAlign: 'right' }}>{value != null && value !== '' ? value : '—'}</b>
    </div>
  )
}

export default async function ProfilPage() {
  const [careerEnabled, passportEnabled] = await Promise.all([getFlag('apn_career', false), getFlag('kompetencia_passport', false)])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { role } = await currentRole()
  const { data: p } = await supabase.from('profiles').select('*').eq('id', user?.id ?? '').single<Profile>()

  const initial = (p?.full_name?.trim()?.[0] ?? user?.email?.[0] ?? 'A').toUpperCase()

  return (
    <>
      <h1 className="h1">Profil</h1>

      <div className="card prof-head">
        <div className="prof-av">{initial}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="prof-name">{p?.full_name || 'Felhasználó'}</div>
          <div className="sub" style={{ margin: '2px 0 0' }}>{p?.apn_type || p?.specialty || 'APN'}</div>
          <div className="sub" style={{ margin: '2px 0 0', fontSize: 12 }}>{user?.email}</div>
        </div>
        <span className="cms-badge s-published">{ROLE_LABEL[role ?? 'apn'] ?? role}</span>
      </div>

      <div className="sec-h"><span className="sec-t">Szakmai adatok</span><Link className="sec-l" href="/profil/szerkesztes">Szerkesztés</Link></div>
      <div className="card">
        <Field label="APN szakirány" value={p?.apn_type} />
        <Field label="Szakterület" value={p?.specialty} />
        <Field label="Beosztás" value={p?.title} />
        <Field label="Munkahely" value={p?.workplace} />
        <Field label="Végzettség" value={p?.qualification} />
        <Field label="Végzettség éve" value={p?.qual_year} />
        <Field label="Nyilvántartási szám" value={p?.registration_no} />
        <div className="row" style={{ borderBottom: 'none' }}>
          <span className="sub" style={{ margin: 0 }}>Telefon</span>
          <b style={{ textAlign: 'right' }}>{p?.phone || '—'}</b>
        </div>
      </div>

      {passportEnabled && (
        <Link className="card klink" href="/kompetenciak">
          <div className="klink-t">📈 Kompetencia-passzport</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>Kompetenciaszintek és fejlődési terv</div>
        </Link>
      )}

      {careerEnabled && (
        <Link className="card klink" href="/career">
          <div className="klink-t">💼 APN Career</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>Állások, képzések, konferenciák, pályázatok</div>
        </Link>
      )}

      {isStaff(role) && (
        <>
          <div className="sec-h"><span className="sec-t">Adminisztráció</span></div>
          <Link className="card klink" href="/cms">
            <div className="klink-t">🛠️ Tartalomkezelés (CMS)</div>
            <div className="sub" style={{ margin: '4px 0 0' }}>Irányelvek — piszkozat → lektorálás → publikálás</div>
          </Link>
          <Link className="card klink" href="/ertesitesek">
            <div className="klink-t">🔔 Értesítések / lektorálási sor</div>
            <div className="sub" style={{ margin: '4px 0 0' }}>Lektorálásra váró és felülvizsgálatra esedékes tartalmak</div>
          </Link>
        </>
      )}

      <form action={signOut} style={{ marginTop: 8 }}>
        <button className="btn ghost" type="submit" style={{ width: '100%' }}>Kijelentkezés</button>
      </form>
    </>
  )
}
