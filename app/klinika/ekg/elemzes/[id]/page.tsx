import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EKG_CASES, caseById } from '@/lib/ekg/cases'
import { EKG_COMPETENCES } from '@/lib/ekg/analysis'
import { getEkgCompetences } from '@/lib/ekg/progress'
import { GuidedAnalysis } from '@/components/ekg-guided'
import { SoloAnalysis } from '@/components/ekg-solo'

export const dynamic = 'force-dynamic'

function CaseList({ mode, title, lead }: { mode: string; title: string; lead: string }) {
  return (
    <>
      <Link className="sh-back" href="/klinika/ekg/elemzes">‹ EKG elemzés</Link>
      <h1 className="h1">{title}</h1>
      <p className="sub">{lead}</p>
      {EKG_CASES.map((c) => (
        <Link key={c.id} className="card klink" href={`/klinika/ekg/elemzes/${c.id}?mod=${mode}`}>
          <div className="klink-t">{c.title}</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>
            {c.age} éves {c.sex} · {c.difficulty} · {c.tags.slice(0, 3).join(', ')}
          </div>
        </Link>
      ))}
    </>
  )
}

export default async function EsetElemzesPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ mod?: string; terulet?: string }>
}) {
  const { id } = await params
  const { mod, terulet } = await searchParams

  if (id === 'vezetett') {
    return <CaseList mode="vezetett" title="Vezetett elemzés"
      lead="Válassz esetet, és a rendszer lépésről lépésre végigvezet a strukturált elemzésen." />
  }

  if (id === 'onallo') {
    return <CaseList mode="onallo" title="Önálló elemzés"
      lead="Segítség nélkül elemzed az EKG-t, majd összeveted a válaszodat a referenciaelemzéssel." />
  }

  if (id === 'gyakorlas') {
    const rows = await getEkgCompetences()
    const byId = new Map(rows.map((r) => [r.competence, r]))

    // A leggyengébb terület kerül előre. Ha a kérés megnevez egy területet
    // (a fejlődés nézetből érkezve), az élvez elsőbbséget.
    const wanted = terulet && EKG_COMPETENCES.some((c) => c.id === terulet) ? terulet : null
    const ranked = [...EKG_COMPETENCES].sort((a, b) => {
      const pa = byId.get(a.id)?.pct ?? -1
      const pb = byId.get(b.id)?.pct ?? -1
      if (pa === -1 && pb === -1) return 0
      if (pa === -1) return -1   // a nem gyakorolt terület előre
      if (pb === -1) return 1
      return pa - pb
    })
    const focus = wanted ? EKG_COMPETENCES.find((c) => c.id === wanted)! : ranked[0]
    const stat = byId.get(focus.id)

    // Azok az esetek, amelyek címkéje a kiválasztott területhez tartozik.
    const cases = EKG_CASES.filter((c) => c.tags.some((t) => focus.tags.includes(t)))
    const fallback = cases.length ? cases : EKG_CASES

    return (
      <>
        <Link className="sh-back" href="/klinika/ekg/elemzes">‹ EKG elemzés</Link>
        <h1 className="h1">Személyre szabott gyakorlás</h1>

        <div className="card">
          <b style={{ fontSize: 15 }}>{focus.label}</b>
          <div className="sub" style={{ marginTop: 4 }}>
            {stat
              ? `Ezen a területen ${stat.pct}%-os az eredményed, ${stat.total} válasz alapján.`
              : 'Ezt a területet még nem gyakoroltad — érdemes itt kezdeni.'}
          </div>
        </div>

        {cases.length === 0 && (
          <p className="sub">
            Ehhez a területhez még nincs önálló eset. Addig a gyakorló mód kérdései
            segítenek: ott minden atlasz-elem szerepel.
          </p>
        )}

        <div className="sec-h"><span className="sec-t">Javasolt esetek</span></div>
        {fallback.slice(0, 4).map((c) => (
          <Link key={c.id} className="card klink" href={`/klinika/ekg/elemzes/${c.id}`}>
            <div className="klink-t">{c.title}</div>
            <div className="sub" style={{ margin: '4px 0 0' }}>
              {c.age} éves {c.sex} · {c.difficulty} · {c.tags.slice(0, 3).join(', ')}
            </div>
          </Link>
        ))}

        <div className="row" style={{ border: 'none', gap: 8, marginTop: 12 }}>
          <Link className="btn ghost" href="/klinika/ekg/fejlodes" style={{ flex: 1 }}>Fejlődésem</Link>
          <Link className="btn" href="/klinika/ekg" style={{ flex: 1 }}>Gyakorló kérdések</Link>
        </div>
      </>
    )
  }

  const ecgCase = caseById(id)
  if (!ecgCase) notFound()

  const solo = mod === 'onallo'

  return (
    <>
      <Link className="sh-back" href="/klinika/ekg/elemzes">‹ EKG elemzés</Link>
      <h1 className="h1">{ecgCase.title}</h1>

      {/* Módváltó — ugyanaz az eset mindkét módban elvégezhető */}
      <div className="ekg-modebar">
        <Link className={`seg ${!solo ? 'on' : ''}`} href={`/klinika/ekg/elemzes/${ecgCase.id}`}>🔰 Vezetett</Link>
        <Link className={`seg ${solo ? 'on' : ''}`} href={`/klinika/ekg/elemzes/${ecgCase.id}?mod=onallo`}>🧠 Önálló</Link>
      </div>

      {solo ? <SoloAnalysis ecgCase={ecgCase} /> : <GuidedAnalysis ecgCase={ecgCase} />}
    </>
  )
}
