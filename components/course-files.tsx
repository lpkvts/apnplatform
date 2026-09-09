'use client'

import { useState, useTransition } from 'react'
import { Icon } from '@/components/icons'
import {
  uploadCourseFile, setFileVisible, deleteCourseFile, type Res,
} from '@/lib/education/files-actions'
import {
  meret, fajlIkon, ALLOWED, ALLOWED_LABEL, MAX_BYTES, type CourseFile,
} from '@/lib/education/files'

/**
 * A kurzushoz csatolt fájlok.
 *
 * A hallgató a közzétett fájlokat látja és tölti le; az oktató feltölt,
 * elrejt és töröl. A letöltés rövid élettartamú hivatkozáson keresztül
 * történik, amit a szerver ad ki a jogosultság ellenőrzése után.
 */
export function CourseFiles({
  courseId, files, canManage,
}: {
  courseId: string
  files: CourseFile[]
  canManage: boolean
}) {
  const [pending, start] = useTransition()
  const [res, setRes] = useState<Res | null>(null)
  const [uj, setUj] = useState(false)
  const [nev, setNev] = useState('')

  if (files.length === 0 && !canManage) return null

  return (
    <>
      <div className="sec-h">
        <span className="sec-t">Fájlok</span>
        {files.length > 0 && (
          <span className="sub" style={{ margin: 0, fontSize: 13 }}>{files.length}</span>
        )}
      </div>

      {res && <div className={res.ok ? 'form-ok' : 'form-err'}>{res.message}</div>}

      {files.length === 0 && !uj && (
        <div className="card">
          <p style={{ margin: 0 }}>
            {canManage
              ? 'Még nincs feltöltött fájl. Jegyzet, diasor, protokoll vagy bármilyen dokumentum csatolható a kurzushoz.'
              : 'A kurzushoz még nincs megosztott fájl.'}
          </p>
        </div>
      )}

      {files.length > 0 && (
        <div className="lst">
          {files.map((f) => (
            <div className="lst-sor" key={f.id} style={{ cursor: 'default' }}>
              <span className="lst-ik"><Icon name={fajlIkon(f.mime)} size={18} /></span>
              <span className="lst-fo">
                <b>{f.name}</b>
                <span>
                  {meret(f.size_bytes)}
                  {f.description && ` · ${f.description}`}
                  {canManage && !f.visible && ' · nem látható'}
                </span>
              </span>
              <span className="lst-veg">
                <a className="btn ghost sm" href={`/api/kurzus-fajl/${f.id}`}
                  target="_blank" rel="noopener">
                  Megnyitás
                </a>
                {canManage && (
                  <>
                    <button className="btn ghost sm" disabled={pending}
                      onClick={() => start(async () =>
                        setRes(await setFileVisible(f.id, courseId, !f.visible)))}>
                      {f.visible ? 'Elrejtés' : 'Közzététel'}
                    </button>
                    <button className="sec-l" disabled={pending}
                      style={{ background: 'none', border: 0, font: 'inherit', fontSize: 13, color: 'var(--alert)', cursor: 'pointer' }}
                      onClick={() => start(async () =>
                        setRes(await deleteCourseFile(f.id, courseId, f.path)))}>
                      Törlés
                    </button>
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {canManage && (
        uj ? (
          <form className="card" style={{ marginTop: 10 }}
            action={(fd) => start(async () => {
              const r = await uploadCourseFile(courseId, fd)
              setRes(r)
              if (r.ok) { setUj(false); setNev('') }
            })}>
            <label className="sub lbl-req" htmlFor="cf-file">Fájl</label>
            <input className="field" id="cf-file" name="file" type="file" required
              accept={ALLOWED.join(',')}
              onChange={(e) => setNev(e.target.files?.[0]?.name ?? '')} />
            <p className="sub" style={{ margin: '-8px 0 14px', fontSize: 'var(--t-caption)' }}>
              Legfeljebb {Math.round(MAX_BYTES / 1024 / 1024)} MB. Elfogadott: {ALLOWED_LABEL}.
            </p>

            <label className="sub" htmlFor="cf-desc">Rövid leírás</label>
            <input className="field" id="cf-desc" name="description"
              placeholder="Mire való ez a fájl?" />

            <label className="row" style={{ border: 'none', padding: '0 0 14px', cursor: 'pointer' }}>
              <span>
                <input type="checkbox" name="visible" defaultChecked style={{ marginRight: 8 }} />
                Látható a hallgatóknak
              </span>
            </label>

            <div className="row" style={{ border: 'none', padding: 0, gap: 8 }}>
              <button className="btn ghost" type="button" style={{ flex: 1 }}
                onClick={() => { setUj(false); setNev('') }} disabled={pending}>
                Mégsem
              </button>
              <button className="btn" type="submit" style={{ flex: 2 }} disabled={pending || !nev}>
                {pending ? 'Feltöltés…' : 'Feltöltés'}
              </button>
            </div>
          </form>
        ) : (
          <button className="btn ghost" style={{ width: '100%', marginTop: 8 }}
            onClick={() => setUj(true)}>
            + Fájl feltöltése
          </button>
        )
      )}
    </>
  )
}
