import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isStaff } from '@/lib/roles'
export const dynamic = 'force-dynamic'

export default async function CmsPage() {
  const { role } = await currentRole()
  if (!isStaff(role)) {
    return (<><h1 className="h1">Tartalomkezelés (CMS)</h1><div className="card">Ehhez szerkesztő/lektor/admin jogosultság szükséges.</div></>)
  }
  const supabase = await createClient()
  const [{ count: gl }, { count: dis }] = await Promise.all([
    supabase.from('guidelines').select('id', { count: 'exact', head: true }),
    supabase.from('diseases').select('id', { count: 'exact', head: true }),
  ])
  return (
    <>
      <h1 className="h1">Tartalomkezelés</h1>
      <p className="sub">Klinikai tartalmak, evidencia és beállítások egy helyen.</p>

      <Link className="card klink" href="/cms/iranyelvek">
        <div className="klink-t">📋 Irányelvek kezelése</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>{gl ?? 0} irányelv · piszkozat → lektorálás → publikálás</div>
      </Link>
      <Link className="card klink" href="/cms/betegsegek">
        <div className="klink-t">🩺 Betegségtár kezelése</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>{dis ?? 0} kórkép · létrehozás, szerkesztés, lektorálás, import</div>
      </Link>
      <Link className="card klink" href="/cms/tartalomfigyelo">
        <div className="klink-t">📡 Tartalomfigyelő</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Felülvizsgálatra esedékes és lejárt tartalmak</div>
      </Link>
      <Link className="card klink" href="/cms/forrasok">
        <div className="klink-t">📚 Klinikai források</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Evidenciaforrások nyilvántartása és verziói</div>
      </Link>
      <Link className="card klink" href="/cms/audit">
        <div className="klink-t">🧾 Audit napló</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Ki, mit, mikor módosított</div>
      </Link>
      <Link className="card klink" href="/cms/felhasznalok">
        <div className="klink-t">👥 Felhasználók</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Regisztrált felhasználók listája (admin)</div>
      </Link>
      <Link className="card klink" href="/cms/mentorok">
        <div className="klink-t">🤝 Mentorprogram</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Jelentkezések elbírálása és mentorprofilok</div>
      </Link>

      <Link className="card klink" href="/cms/beallitasok">
        <div className="klink-t">⚙️ Beállítások</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Modulrészek ki-/bekapcsolása (admin)</div>
      </Link>
    </>
  )
}
