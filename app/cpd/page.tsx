import { createClient } from '@/lib/supabase/server'
import { addCpdEntry } from './actions'
import type { CpdEntry } from '@/lib/types'

export default async function CpdPage() {
  const supabase = await createClient()
  const year = new Date().getFullYear()

  const { data: entries } = await supabase
    .from('cpd_entries')
    .select('*')
    .eq('activity_year', year)
    .order('activity_date', { ascending: false })
    .returns<CpdEntry[]>()

  const { data: goal } = await supabase
    .from('cpd_goals')
    .select('target_points')
    .eq('year', year)
    .maybeSingle<{ target_points: number }>()

  const total = (entries ?? []).reduce((s, e) => s + Number(e.points), 0)
  const target = goal?.target_points ?? 50

  return (
    <>
      <h1 className="h1">Szakmai fejlődésem (CPD)</h1>
      <p className="sub">
        {year} · {total} / {target} pont
      </p>

      <div className="card">
        <strong>Új CPD-bejegyzés</strong>
        <form action={addCpdEntry} style={{ marginTop: 10 }}>
          <input className="field" name="title" placeholder="Tevékenység megnevezése" required />
          <input
            className="field"
            name="points"
            type="number"
            step="0.5"
            min="0"
            placeholder="Pont"
          />
          <input className="field" name="activity_date" type="date" />
          <button className="btn" type="submit">
            Hozzáadás
          </button>
        </form>
      </div>

      <div className="card">
        <strong>Bejegyzések ({year})</strong>
        {(entries ?? []).length === 0 ? (
          <p className="sub" style={{ marginTop: 8 }}>
            Még nincs bejegyzés erre az évre.
          </p>
        ) : (
          (entries ?? []).map((e) => (
            <div className="row" key={e.id}>
              <span>
                {e.title}
                <br />
                <span className="sub" style={{ margin: 0 }}>
                  {e.activity_date}
                </span>
              </span>
              <strong>{Number(e.points)} pont</strong>
            </div>
          ))
        )}
      </div>
    </>
  )
}
