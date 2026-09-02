'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { TeachingMode } from '@/components/teaching-mode'
import {
  saveMaterial, setMaterialVisible, deleteMaterial, type MaterialInput,
} from '@/lib/education/materials-actions'
import {
  KIND_LABEL, KIND_HINT, MODULES,
  type Material, type StudentMaterial, type MaterialKind, type DataRow,
} from '@/lib/education/materials'

/**
 * Kurzus tananyagai.
 *
 * A klinikai eset kivetíthető: az oktató teljes képernyőn megnyitja a helyzetet,
 * a betegadatokat és a kérdést, majd amikor jónak látja, felfedi a megoldást.
 * Ez a specifikáció Teaching Mode példája — eset, kérdés, majd a hozzá tartozó
 * pontozó a platform saját moduljából.
 */

const ujAnyag = (): MaterialInput => ({
  kind: 'case', title: '', vignette: null, data: [{ label: '', value: '' }],
  question: null, answer: null, module_href: null, module_label: null, visible: false,
})

export function CourseMaterials({
  courseId, materials, canManage,
}: {
  courseId: string
  materials: (Material | StudentMaterial)[]
  canManage: boolean
}) {
  const [pending, start] = useTransition()
  const [szerkeszt, setSzerkeszt] = useState<MaterialInput | null>(null)
  const [uzenet, setUzenet] = useState<{ ok: boolean; message: string } | null>(null)

  const ment = () => {
    if (!szerkeszt) return
    start(async () => {
      const r = await saveMaterial(courseId, szerkeszt)
      setUzenet(r)
      if (r.ok) setSzerkeszt(null)
    })
  }

  if (materials.length === 0 && !canManage) return null

  return (
    <>
      <div className="sec-h">
        <span className="sec-t">Tananyagok és esetek</span>
        {materials.length > 0 && (
          <span className="sub" style={{ margin: 0, fontSize: 13 }}>{materials.length}</span>
        )}
      </div>

      {uzenet && (
        <div className={uzenet.ok ? 'form-ok' : 'form-err'}>{uzenet.message}</div>
      )}

      {szerkeszt ? (
        <MaterialForm
          m={szerkeszt} setM={setSzerkeszt} onSave={ment}
          onCancel={() => setSzerkeszt(null)} pending={pending}
        />
      ) : (
        <>
          {materials.length === 0 && (
            <div className="card">
              <p style={{ margin: 0 }}>
                Még nincs tananyag. Klinikai esetet vehetsz fel betegadatokkal és kérdéssel,
                szöveges összefoglalót, vagy hivatkozást a platform meglévő moduljaira.
              </p>
            </div>
          )}

          {materials.map((m) => (
            <MaterialCard
              key={m.id} m={m} canManage={canManage} courseId={courseId}
              onEdit={() => setSzerkeszt({ ...(m as Material) })}
              setUzenet={setUzenet}
            />
          ))}

          {canManage && (
            <button className="btn ghost" style={{ width: '100%', marginTop: 8 }}
              onClick={() => setSzerkeszt(ujAnyag())}>
              + Tananyag vagy eset
            </button>
          )}
        </>
      )}
    </>
  )
}

/* ─────────── Egy tananyag ─────────── */

function MaterialCard({
  m, canManage, courseId, onEdit, setUzenet,
}: {
  m: Material | StudentMaterial
  canManage: boolean
  courseId: string
  onEdit: () => void
  setUzenet: (u: { ok: boolean; message: string }) => void
}) {
  const [pending, start] = useTransition()
  const [nyitva, setNyitva] = useState(false)
  const teljes = m as Material
  const rejtett = canManage && teljes.visible === false

  return (
    <div className="card" style={rejtett ? { borderStyle: 'dashed' } : undefined}>
      <div className="row" style={{ border: 'none', padding: 0, alignItems: 'flex-start' }}>
        <span style={{ flex: 1 }}>
          <b style={{ fontSize: 15.5 }}>{m.title}</b>
          <span className="sub" style={{ display: 'block', margin: '2px 0 0', fontSize: 12 }}>
            {KIND_LABEL[m.kind]}
          </span>
        </span>
        {rejtett && <span className="mp-badge pending">Nem látható</span>}
      </div>

      {m.kind === 'module' && m.module_href && (
        <Link className="btn ghost sm" href={m.module_href} style={{ marginTop: 10 }}>
          {m.module_label ?? 'Modul megnyitása'} →
        </Link>
      )}

      {m.kind === 'note' && m.vignette && (
        <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {m.vignette}
        </p>
      )}

      {m.kind === 'case' && (
        <>
          {m.vignette && (
            <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.6 }}>{m.vignette}</p>
          )}

          {m.data.length > 0 && (
            <div className="edu-adat">
              {m.data.map((r, i) => (
                <div key={i} className={r.flag ? `el ${r.flag}` : undefined}>
                  <span>{r.label}</span>
                  <b>{r.value}{r.flag === 'high' ? ' ↑' : r.flag === 'low' ? ' ↓' : ''}</b>
                </div>
              ))}
            </div>
          )}

          {m.question && (
            <p className="edu-kerdes"><b>Kérdés.</b> {m.question}</p>
          )}

          <div className="row" style={{ border: 'none', padding: '12px 0 0', gap: 8, flexWrap: 'wrap' }}>
            {/* Kivetítés: az eset teljes képernyőn, a megoldás külön felfedve. */}
            <TeachingMode title={m.title} subtitle={KIND_LABEL[m.kind]}>
              <EsetVetites m={m} canManage={canManage} />
            </TeachingMode>

            {m.module_href && (
              <Link className="btn ghost sm" href={m.module_href}>
                {m.module_label ?? 'Kapcsolódó modul'} →
              </Link>
            )}

            {canManage && teljes.answer && (
              <button className="btn ghost sm" onClick={() => setNyitva(!nyitva)}>
                {nyitva ? 'Megoldás elrejtése' : 'Megoldás'}
              </button>
            )}
          </div>

          {nyitva && teljes.answer && (
            <p className="vg-tanulsag" style={{ marginTop: 10 }}>{teljes.answer}</p>
          )}
        </>
      )}

      {canManage && (
        <div className="row" style={{ border: 'none', padding: '12px 0 0', gap: 8 }}>
          <button className="btn ghost sm" onClick={onEdit}>Szerkesztés</button>
          <button className="btn ghost sm" disabled={pending}
            onClick={() => start(async () =>
              setUzenet(await setMaterialVisible(m.id, courseId, !teljes.visible)))}>
            {teljes.visible ? 'Elrejtés' : 'Közzététel'}
          </button>
          <button className="sec-l" disabled={pending}
            style={{ background: 'none', border: 0, font: 'inherit', fontSize: 13, color: 'var(--alert)', cursor: 'pointer' }}
            onClick={() => start(async () => setUzenet(await deleteMaterial(m.id, courseId)))}>
            Törlés
          </button>
        </div>
      )}
    </div>
  )
}

/** Az eset kivetített alakja — nagyobb léptékben, a megoldás külön felfedve. */
function EsetVetites({ m, canManage }: { m: Material | StudentMaterial; canManage: boolean }) {
  const [megoldas, setMegoldas] = useState(false)
  const teljes = m as Material

  return (
    <>
      {m.vignette && (
        <div className="card">
          <p style={{ margin: 0, fontSize: '1.05em', lineHeight: 1.65 }}>{m.vignette}</p>
        </div>
      )}

      {m.data.length > 0 && (
        <div className="card">
          <div className="edu-adat nagy">
            {m.data.map((r, i) => (
              <div key={i} className={r.flag ? `el ${r.flag}` : undefined}>
                <span>{r.label}</span>
                <b>{r.value}{r.flag === 'high' ? ' ↑' : r.flag === 'low' ? ' ↓' : ''}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {m.question && (
        <div className="card" style={{ borderLeft: '4px solid var(--brand)' }}>
          <p style={{ margin: 0, fontSize: '1.15em', fontWeight: 700, lineHeight: 1.5 }}>
            {m.question}
          </p>
        </div>
      )}

      {m.module_href && (
        <Link className="btn" href={m.module_href} style={{ marginTop: 4 }}>
          {m.module_label ?? 'Kapcsolódó modul megnyitása'} →
        </Link>
      )}

      {canManage && teljes.answer && (
        megoldas ? (
          <div className="card" style={{ borderLeft: '4px solid var(--ok)', marginTop: 16 }}>
            <b style={{ fontSize: '.9em', color: 'var(--ok)' }}>MEGOLDÁS</b>
            <p style={{ margin: '8px 0 0', fontSize: '1em', lineHeight: 1.65 }}>{teljes.answer}</p>
          </div>
        ) : (
          <button className="btn ghost" style={{ marginTop: 16 }} onClick={() => setMegoldas(true)}>
            Megoldás felfedése
          </button>
        )
      )}
    </>
  )
}

/* ─────────── Szerkesztő ─────────── */

function MaterialForm({
  m, setM, onSave, onCancel, pending,
}: {
  m: MaterialInput
  setM: (m: MaterialInput) => void
  onSave: () => void
  onCancel: () => void
  pending: boolean
}) {
  const sorValt = (i: number, mezo: keyof DataRow, ertek: string) => {
    const uj = [...m.data]
    uj[i] = { ...uj[i], [mezo]: ertek || undefined } as DataRow
    setM({ ...m, data: uj })
  }

  return (
    <div className="card">
      <label className="sub">Típus</label>
      <div className="sh-chips" style={{ marginBottom: 6 }}>
        {(Object.keys(KIND_LABEL) as MaterialKind[]).map((k) => (
          <button key={k} type="button" className={`sh-chip ${m.kind === k ? 'on' : ''}`}
            onClick={() => setM({ ...m, kind: k })}>{KIND_LABEL[k]}</button>
        ))}
      </div>
      <p className="sub" style={{ margin: '0 0 14px', fontSize: 12 }}>{KIND_HINT[m.kind]}</p>

      <label className="sub">Cím</label>
      <input className="field" value={m.title} onChange={(e) => setM({ ...m, title: e.target.value })}
        placeholder={m.kind === 'case' ? 'pl. Akut pancreatitis — 55 éves férfi' : 'A tananyag címe'} />

      {m.kind !== 'module' && (
        <>
          <label className="sub">{m.kind === 'case' ? 'Klinikai helyzet' : 'Szöveg'}</label>
          <textarea className="field" rows={m.kind === 'case' ? 3 : 6}
            value={m.vignette ?? ''} onChange={(e) => setM({ ...m, vignette: e.target.value })}
            placeholder={m.kind === 'case'
              ? '55 éves férfi, néhány órája kezdődő, övszerűen kisugárzó hasi fájdalom…'
              : 'A tananyag tartalma'} />
        </>
      )}

      {m.kind === 'case' && (
        <>
          <label className="sub">Betegadatok és leletek</label>
          {m.data.map((r, i) => (
            <div className="row" key={i} style={{ border: 'none', padding: '0 0 8px', gap: 8 }}>
              <input className="field" style={{ margin: 0, flex: 1 }} value={r.label}
                onChange={(e) => sorValt(i, 'label', e.target.value)} placeholder="pl. Lipáz" />
              <input className="field" style={{ margin: 0, flex: 1 }} value={r.value}
                onChange={(e) => sorValt(i, 'value', e.target.value)} placeholder="pl. 1240 U/l" />
              <button type="button" className={`sh-chip ${r.flag ? 'on' : ''}`} style={{ flex: 'none' }}
                onClick={() => sorValt(i, 'flag',
                  r.flag === 'high' ? 'low' : r.flag === 'low' ? '' : 'high')}
                title="Eltérés jelölése">
                {r.flag === 'high' ? '↑' : r.flag === 'low' ? '↓' : '—'}
              </button>
              {m.data.length > 1 && (
                <button type="button" className="sec-l" style={{ background: 'none', border: 0, cursor: 'pointer', flex: 'none', color: 'var(--muted)' }}
                  onClick={() => setM({ ...m, data: m.data.filter((_, j) => j !== i) })}
                  aria-label="Sor törlése">✕</button>
              )}
            </div>
          ))}
          <button type="button" className="btn ghost sm" style={{ marginBottom: 14 }}
            onClick={() => setM({ ...m, data: [...m.data, { label: '', value: '' }] })}>
            + Sor
          </button>

          <label className="sub">Kérdés a csoportnak</label>
          <input className="field" value={m.question ?? ''}
            onChange={(e) => setM({ ...m, question: e.target.value })}
            placeholder="pl. Milyen súlyossági pontozót alkalmaznál?" />

          <label className="sub">Megoldás — csak te látod, kivetítéskor felfeded</label>
          <textarea className="field" rows={3} value={m.answer ?? ''}
            onChange={(e) => setM({ ...m, answer: e.target.value })}
            placeholder="A várt válasz és a magyarázat" />
        </>
      )}

      <label className="sub">Kapcsolódó modul</label>
      <select className="field" value={m.module_href ?? ''}
        onChange={(e) => {
          const mod = MODULES.find((x) => x.href === e.target.value)
          setM({ ...m, module_href: mod?.href ?? null, module_label: mod?.label ?? null })
        }}>
        <option value="">Nincs</option>
        {MODULES.map((x) => <option key={x.href} value={x.href}>{x.label}</option>)}
      </select>
      <p className="sub" style={{ margin: '-8px 0 14px', fontSize: 11.5 }}>
        A platform saját eszközére mutat — a hallgató ugyanazt használja, mint a napi munkában.
      </p>

      <label className="row" style={{ border: 'none', padding: '0 0 14px', cursor: 'pointer' }}>
        <span>
          <input type="checkbox" checked={m.visible} style={{ marginRight: 8 }}
            onChange={(e) => setM({ ...m, visible: e.target.checked })} />
          Látható a hallgatóknak
        </span>
      </label>

      <div className="row" style={{ border: 'none', padding: 0, gap: 8 }}>
        <button className="btn ghost" style={{ flex: 1 }} onClick={onCancel} disabled={pending}>Mégsem</button>
        <button className="btn" style={{ flex: 2 }} onClick={onSave} disabled={pending}>
          {pending ? 'Mentés…' : 'Mentés'}
        </button>
      </div>
    </div>
  )
}
