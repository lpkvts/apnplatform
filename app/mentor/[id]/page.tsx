import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { getMentor } from '@/lib/mentor/data'

export const dynamic = 'force-dynamic'

export default async function MentorProfilPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getFlag('mentorprogram', false))) return <FeatureOff title="Mentorprogram" />

  const { id } = await params
  const m = await getMentor(id)
  if (!m) notFound()

  return (
    <>
      <Link className="sh-back" href="/mentor/kereses">‹ Mentorok</Link>
      <h1 className="h1">{m.full_name || 'Mentor'}</h1>
      {m.title && <p className="sub" style={{ fontSize: 15 }}>{m.title}</p>}

      <div className="card">
        <div className="mp-meta" style={{ marginTop: 0 }}>
          <span><b>Szakterület:</b> {m.specialty}</span>
          {m.experience_years != null && <span><b>Tapasztalat:</b> {m.experience_years} év</span>}
          {m.workplace && <span><b>Munkahely:</b> {m.workplace}</span>}
        </div>
        {m.bio && <p style={{ margin: '12px 0 0', fontSize: 14.5, lineHeight: 1.65 }}>{m.bio}</p>}
      </div>

      {m.topics.length > 0 && (
        <>
          <div className="sec-h"><span className="sec-t">Mentorálási témák</span></div>
          <div className="card">
            <div className="mp-tags" style={{ marginTop: 0 }}>
              {m.topics.map((t) => <span className="mp-tag" key={t}>{t}</span>)}
            </div>
          </div>
        </>
      )}

      {m.formats.length > 0 && (
        <>
          <div className="sec-h"><span className="sec-t">Milyen formában vállalja</span></div>
          <div className="card">
            <div className="mp-tags" style={{ marginTop: 0 }}>
              {m.formats.map((f) => <span className="mp-tag plain" key={f}>{f}</span>)}
            </div>
          </div>
        </>
      )}

      <div className="sec-h"><span className="sec-t">Kapcsolatfelvétel</span></div>
      <div className="card">
        {m.contact_note
          ? <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{m.contact_note}</p>
          : <p className="sub" style={{ margin: 0 }}>A mentor nem adott meg külön kérést a megkeresés módjára.</p>}
        <p className="sub" style={{ margin: '10px 0 0', fontSize: 12 }}>
          A platformon belüli üzenetküldés még nem elérhető. Addig az intézményi
          kapcsolattartón keresztül vagy a szokásos szakmai csatornákon vedd fel a kapcsolatot.
        </p>
      </div>

      <div className="safety-note" style={{ marginTop: 12 }}>
        <b>ⓘ Szakmai támogatás.</b> A mentorálás tapasztalatcsere és útmutatás. Nem
        helyettesíti a munkahelyi vezetést, és a konkrét betegre vonatkozó döntés az
        ellátó team felelőssége marad.
      </div>
    </>
  )
}
