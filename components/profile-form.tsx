'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { updateProfile, type ProfileState } from '@/app/profil/actions'
import type { Profile } from '@/lib/types'

const APN_TYPES = [
  '', 'Általános APN', 'Sürgősségi APN', 'Intenzív terápiás APN', 'Geriátriai APN',
  'Onkológiai APN', 'Kardiológiai APN', 'Pszichiátriai APN', 'Diabetológiai APN',
  'Alapellátási APN', 'Sebészeti APN', 'Neonatológiai/gyermek APN', 'Egyéb',
]

export function ProfileForm({ p }: { p: Profile | null }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile, {})
  return (
    <form action={action}>
      <div className="as-lbl">Teljes név</div>
      <input className="field" name="full_name" defaultValue={p?.full_name ?? ''} />

      <div className="as-lbl">APN szakirány</div>
      <select className="field" name="apn_type" defaultValue={p?.apn_type ?? ''}>
        {APN_TYPES.map((t) => <option key={t} value={t}>{t || '— válassz —'}</option>)}
      </select>

      <div className="as-lbl">Szakterület (szabad szöveg)</div>
      <input className="field" name="specialty" defaultValue={p?.specialty ?? ''} placeholder="pl. belgyógyászat, sürgősségi" />

      <div className="as-lbl">Beosztás</div>
      <input className="field" name="title" defaultValue={p?.title ?? ''} placeholder="pl. vezető APN" />

      <div className="as-lbl">Munkahely</div>
      <input className="field" name="workplace" defaultValue={p?.workplace ?? ''} placeholder="pl. Kaposi Mór Oktató Kórház" />

      <div className="as-lbl">Végzettség megnevezése</div>
      <input className="field" name="qualification" defaultValue={p?.qualification ?? ''} placeholder="pl. ápolás MSc / APN szakirány" />

      <div className="as-lbl">Végzettség éve</div>
      <input className="field" name="qual_year" type="number" inputMode="numeric" defaultValue={p?.qual_year ?? ''} placeholder="pl. 2023" />

      <div className="as-lbl">Működési nyilvántartási szám</div>
      <input className="field" name="registration_no" defaultValue={p?.registration_no ?? ''} />

      <div className="as-lbl">Telefon</div>
      <input className="field" name="phone" defaultValue={p?.phone ?? ''} />

      <button className="btn" type="submit" disabled={pending} style={{ width: '100%', marginTop: 6 }}>
        {pending ? 'Mentés…' : 'Mentés'}
      </button>

      {state.saved && (
        <p className="form-ok">Mentve ✓ <Link href="/profil">Vissza a profilhoz</Link></p>
      )}
      {state.error && <p className="form-err">Nem sikerült menteni: {state.error}</p>}
    </form>
  )
}
