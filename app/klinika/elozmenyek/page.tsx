import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface Assessment {
  id: string
  domain: string | null
  complaint: string | null
  summary: string | null
  created_at: string
}

export default async function ElozmenyekPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('assessments')
    .select('id, domain, complaint, summary, created_at')
    .order('created_at', { ascending: false })
    .returns<Assessment[]>()

  const items = data ?? []

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">Előzmények</h1>
      <p className="sub">Korábbi mentett betegértékeléseid.</p>

      {items.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0 }}>Még nincs mentett értékelés.</p>
          <p className="sub" style={{ marginBottom: 0 }}>
            Készíts egyet az <Link href="/klinika/ertekeles">Új betegértékelés</Link> folyamatban.
          </p>
        </div>
      ) : (
        items.map((a) => (
          <details className="card" key={a.id}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
              {a.domain || 'Értékelés'}
              <span className="sub" style={{ display: 'block', margin: '4px 0 0', fontWeight: 400 }}>
                {new Date(a.created_at).toLocaleString('hu-HU')}
                {a.complaint ? ` · ${a.complaint}` : ''}
              </span>
            </summary>
            <pre className="as-summary" style={{ marginTop: 10, whiteSpace: 'pre-wrap' }}>{a.summary}</pre>
          </details>
        ))
      )}
    </>
  )
}
