import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface Row { id: string; title: string; specialty: string[] | null; summary: string | null }

export default async function TudastarPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guidelines')
    .select('id, title, specialty, summary')
    .eq('status', 'published')
    .order('title')
    .returns<Row[]>()

  const items = data ?? []

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">Tudástár</h1>
      <p className="sub">Irányelvek, protokollok és források egy helyen · {items.length} publikált tétel, APN-szintű összefoglalóval</p>

      {items.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0 }}>Nincs publikált tartalom.</p>
          <p className="sub" style={{ marginBottom: 0 }}>Futtasd a <code>0005_guidelines.sql</code> migrációt.</p>
        </div>
      ) : (
        items.map((g) => (
          <Link className="card klink" key={g.id} href={`/klinika/tudastar/${g.id}`}>
            <div className="klink-t" style={{ fontSize: 15 }}>{g.title}</div>
            {g.summary && <div className="sub" style={{ margin: '4px 0 0' }}>{g.summary}</div>}
            {g.specialty && g.specialty.length > 0 && (
              <div className="sub" style={{ margin: '6px 0 0', color: 'var(--teal-700)' }}>{g.specialty.join(' · ')}</div>
            )}
          </Link>
        ))
      )}
    </>
  )
}
