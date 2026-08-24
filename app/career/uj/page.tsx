import Link from 'next/link'
import { currentRole, isStaff } from '@/lib/roles'
import { createCareerItem } from '../actions'
import { CAT_LABEL } from '@/components/career'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'

const CATS = ['allas', 'kepzes', 'konferencia', 'palyazat', 'publikacio', 'kutatas', 'mentor']

export default async function CareerUj() {
  if (!(await getFlag('apn_career', false))) return <FeatureOff title="APN Career" />
  const { role } = await currentRole()
  if (!isStaff(role)) return <div className="card">Nincs jogosultság.</div>
  return (
    <>
      <Link className="sh-back" href="/career">‹ APN Career</Link>
      <h1 className="h1">Új lehetőség</h1>
      <form action={createCareerItem}>
        <div className="as-lbl">Kategória *</div>
        <select className="field" name="category" defaultValue="allas">
          {CATS.map((c) => <option key={c} value={c}>{CAT_LABEL[c]}</option>)}
        </select>
        <div className="as-lbl">Cím *</div>
        <input className="field" name="title" required />
        <div className="as-lbl">Szervezet</div>
        <input className="field" name="org" />
        <div className="as-lbl">Helyszín</div>
        <input className="field" name="location" placeholder="pl. Budapest / Országos / Online" />
        <div className="as-lbl">Link (jelentkezés/forrás)</div>
        <input className="field" name="url" type="url" placeholder="https://…" />
        <div className="as-lbl">Határidő</div>
        <input className="field" name="deadline" type="date" />
        <div className="as-lbl">Címkék (vesszővel)</div>
        <input className="field" name="tags" placeholder="pl. sürgősségi, továbbképzés" />
        <div className="as-lbl">Szakirány-kulcsszavak (vesszővel, ajánláshoz)</div>
        <input className="field" name="specialty" placeholder="pl. sürgősségi, geriátria" />
        <div className="as-lbl">Leírás</div>
        <textarea className="as-ta" name="description" rows={4} />
        <button className="btn" type="submit" style={{ width: '100%', marginTop: 6 }}>Mentés</button>
      </form>
    </>
  )
}
