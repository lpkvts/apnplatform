import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isStaff } from '@/lib/roles'
import { CAT_LABEL } from '@/components/career'
import { deleteCareerItem } from '../actions'

interface Row {
  id: string; category: string; title: string; org: string | null; location: string | null
  url: string | null; description: string | null; tags: string[] | null; deadline: string | null
}

export default async function CareerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { role } = await currentRole()
  const supabase = await createClient()
  const { data } = await supabase.from('career_items')
    .select('id, category, title, org, location, url, description, tags, deadline')
    .eq('id', id).maybeSingle<Row>()
  if (!data) notFound()

  return (
    <>
      <Link className="sh-back" href="/career">‹ APN Career</Link>
      <span className="cms-badge s-published" style={{ display: 'inline-block', marginBottom: 8 }}>{CAT_LABEL[data.category]}</span>
      <h1 className="h1">{data.title}</h1>
      <p className="sub">
        {data.org ?? ''}{data.location ? ` · ${data.location}` : ''}{data.deadline ? ` · határidő: ${data.deadline}` : ''}
      </p>

      {data.description && <div className="card"><p style={{ margin: 0 }}>{data.description}</p></div>}

      {data.tags && data.tags.length > 0 && (
        <div className="sh-chips">{data.tags.map((t) => <span key={t} className="sh-chip">{t}</span>)}</div>
      )}

      {data.url && (
        <a className="btn" href={data.url} target="_blank" rel="noopener" style={{ width: '100%', marginTop: 6 }}>
          Megnyitás / jelentkezés
        </a>
      )}

      {isStaff(role) && (
        <form action={deleteCareerItem} style={{ marginTop: 12 }}>
          <input type="hidden" name="id" value={data.id} />
          <button className="btn ghost sm" type="submit">Törlés</button>
        </form>
      )}
      <p className="sh-disc">A tartalmat szerkesztők gondozzák; a jelentkezési feltételeket mindig a hivatalos forrásnál ellenőrizd.</p>
    </>
  )
}
