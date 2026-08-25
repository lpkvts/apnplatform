'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { updateProfile, type ProfileState } from '@/app/profil/actions'
import type { Profile } from '@/lib/types'

// Magyarországon, egyetemi képzésben elérhető APN-szakirányok
const APN_TYPES: { v: string; l: string }[] = [
  { v: '', l: '— válassz —' },
  { v: 'Geriátriai APN', l: '👴 Geriátriai' },
  { v: 'Közösségi / alapellátási APN', l: '🏘️ Közösségi (alapellátás)' },
  { v: 'Sürgősségi / akut ellátási APN', l: '🚨 Sürgősségi (akut ellátás)' },
  { v: 'Intenzív / kritikus betegellátási APN', l: '💓 Intenzív (kritikus betegellátás)' },
  { v: 'Perioperatív / műtéti betegellátási APN', l: '🏥 Perioperatív (műtéti betegellátás)' },
  { v: 'Extrakorporális és mechanikus keringéstámogató APN', l: '🔄 Extrakorporális és mechanikus keringéstámogató' },
]

export function ProfileForm({ p }: { p: Profile | null }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile, {})
  return (
    <form action={action}>
      <div className="as-lbl">Teljes név</div>
      <input className="field" name="full_name" defaultValue={p?.full_name ?? ''} />

      <div className="as-lbl">APN szakirány</div>
      <select className="field" name="apn_type" defaultValue={p?.apn_type ?? ''}>
        {APN_TYPES.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
      </select>

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
