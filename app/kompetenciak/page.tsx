import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProgressBar } from '@/components/progress-bar'
import type { Competency, CompetencyProgress } from '@/lib/types'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'

const STATUS_LABEL: Record<CompetencyProgress['status'], string> = {
  not_started: 'Nem kezdett',
  in_progress: 'Folyamatban',
  achieved: 'Teljesítve',
}

export default async function KompetenciakPage() {
  if (!(await getFlag('kompetencia_passport', false))) return <FeatureOff title="Kompetencia Passport" />
  const supabase = await createClient()

  // Egyszerű, egyértelmű lekérdezések, majd JS-oldali összefésülés
  // (elkerüljük a beágyazott join kétértelműségét).
  const { data: comps } = await supabase
    .from('competencies')
    .select('*')
    .order('sort_order')
    .returns<Competency[]>()

  const { data: progress } = await supabase
    .from('competency_progress')
    .select('*')
    .returns<CompetencyProgress[]>()

  const byId = new Map((progress ?? []).map((p) => [p.competency_id, p]))

  return (
    <>
      <Link className="sh-back" href="/profil">‹ Profil</Link>
      <h1 className="h1">Kompetencia-passzport</h1>
      <p className="sub">A klinikai és gondozási kompetenciáid aktuális szintje.</p>

      {(comps ?? []).map((c) => {
        const p = byId.get(c.id)
        const level = p?.level ?? 0
        const status = p?.status ?? 'not_started'
        return (
          <div className="card" key={c.id}>
            <div className="row" style={{ border: 'none', paddingBottom: 6 }}>
              <strong>{c.name}</strong>
              <span className="sub" style={{ margin: 0 }}>
                {level}% · {STATUS_LABEL[status]}
              </span>
            </div>
            <ProgressBar value={level} />
            {c.domain ? (
              <p className="sub" style={{ margin: '8px 0 0' }}>
                {c.domain}
              </p>
            ) : null}
          </div>
        )
      })}

      {(comps ?? []).length === 0 ? (
        <p className="sub">
          Még nincs kompetencia-katalógus — futtasd a seed migrációt (0003_seed.sql).
        </p>
      ) : null}
    </>
  )
}
