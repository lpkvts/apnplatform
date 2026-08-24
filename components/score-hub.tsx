'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TESTS, TEST_CATS, type Test, type TestItem } from '@/lib/scores/data'
import { FavStar } from '@/components/favorites-context'
import { testScore, testComplete, testBand } from '@/lib/scores/engine'

type AnsMap = Record<number, number | number[]>

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const RISK_CLS: Record<string, string> = {
  low: 'r-low',
  mid: 'r-mid',
  high: 'r-high',
  crit: 'r-crit',
}

export function ScoreHub() {
  const sp = useSearchParams()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Összes')
  const [openId, setOpenId] = useState<string | null>(sp.get('open'))
  const [answers, setAnswers] = useState<Record<string, AnsMap>>({})

  const open = openId ? TESTS.find((t) => t.id === openId) ?? null : null

  if (open) {
    return (
      <TestDetail
        t={open}
        a={answers[open.id] ?? {}}
        onBack={() => setOpenId(null)}
        onChange={(next) => setAnswers((s) => ({ ...s, [open.id]: next }))}
      />
    )
  }

  const nq = norm(q.trim())
  const list = TESTS.filter((t) => {
    const inCat = cat === 'Összes' || t.cats.includes(cat)
    const inQ =
      !nq ||
      norm(`${t.name} ${t.abbr ?? ''} ${t.kw ?? ''} ${t.specialty ?? ''}`).includes(nq)
    return (nq ? inQ : inCat && inQ)
  })

  const cats = ['Összes', ...TEST_CATS]

  return (
    <>
      <h1 className="h1">Klinikai tesztek és skálák</h1>
      <p className="sub">{TESTS.length} skála · pontozás, rizikósáv, APN-teendők</p>

      <input
        className="field"
        placeholder="Keresés: név, rövidítés, tünet…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {!nq && (
        <div className="sh-chips">
          {cats.map((c) => (
            <button
              key={c}
              className={c === cat ? 'sh-chip on' : 'sh-chip'}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div>
        {list.map((t) => (
          <button key={t.id} className="sh-row" onClick={() => setOpenId(t.id)}>
            <span className="sh-row-main">
              <span className="sh-row-name">{t.name}</span>
              <span className="sh-row-sub">
                {t.abbr ? `${t.abbr} · ` : ''}
                {t.specialty ?? ''}
              </span>
            </span>
            <FavStar type="score" id={t.id} />
            <span className="sh-chev">›</span>
          </button>
        ))}
        {list.length === 0 && <p className="sub">Nincs találat.</p>}
      </div>
    </>
  )
}

function TestDetail({
  t,
  a,
  onBack,
  onChange,
}: {
  t: Test
  a: AnsMap
  onBack: () => void
  onChange: (next: AnsMap) => void
}) {
  const setRadio = (i: number, v: number) => onChange({ ...a, [i]: v })
  const setNum = (i: number, val: string) => {
    const next = { ...a }
    if (val === '') delete next[i]
    else next[i] = Number(val)
    onChange(next)
  }
  const toggleCheck = (i: number, v: number) => {
    const arr = Array.isArray(a[i]) ? [...(a[i] as number[])] : []
    const p = arr.indexOf(v)
    if (p >= 0) arr.splice(p, 1)
    else arr.push(v)
    onChange({ ...a, [i]: arr })
  }

  const complete = !t.refOnly && testComplete(t, a)
  const score = complete ? testScore(t, a) : 0
  const band = complete ? testBand(t, score) : null
  const apn = band?.apn ?? t.apn

  return (
    <>
      <button className="sh-back" onClick={onBack}>
        ‹ Vissza a listához
      </button>
      <h1 className="h1">{t.name}</h1>
      <p className="sub">
        {t.abbr ? `${t.abbr} · ` : ''}
        {t.scoreType ?? ''}
      </p>

      <div className="card">
        {t.purpose && (
          <p>
            <b>Mi a célja?</b> {t.purpose}
          </p>
        )}
        {t.when && (
          <p className="sub" style={{ margin: '6px 0 0' }}>
            <b>Mikor:</b> {t.when}
          </p>
        )}
        {t.contra && (
          <p className="sub" style={{ margin: '6px 0 0' }}>
            <b>Korlátok:</b> {t.contra}
          </p>
        )}
      </div>

      {t.refOnly ? (
        <div className="card">
          <b>Értelmezés (referencia)</b>
          <ul>
            {t.bands.map((b, i) => (
              <li key={i}>
                <b>{b.label}:</b> {b.advice}
              </li>
            ))}
          </ul>
          <p className="sub" style={{ marginBottom: 0 }}>
            Ehhez a skálához strukturált referencia érhető el; az interaktív kitöltés
            később kerül be.
          </p>
        </div>
      ) : (
        <>
          <div className="card">
            <b>Kitöltés — automatikus pontozás</b>
            {(t.items ?? []).map((it, i) => (
              <ItemRow
                key={i}
                it={it}
                i={i}
                a={a}
                onRadio={setRadio}
                onNum={setNum}
                onCheck={toggleCheck}
              />
            ))}
          </div>

          {complete && band ? (
            <div className={`sh-result ${RISK_CLS[band.risk] ?? ''}`}>
              <div className="sh-res-top">
                <div className="sh-res-score">
                  {score}
                  <span> pont</span>
                </div>
                <div className="sh-res-band">{band.label}</div>
              </div>
              {band.advice && <p className="sh-res-adv">{band.advice}</p>}
              {band.notify && (
                <div className="sh-urgent">⚠ Orvos értesítése: {band.notify}</div>
              )}
              {t.flag && <div className="sh-urgent">⚠ {t.flag}</div>}
              {apn && apn.length > 0 && (
                <div className="sh-apn">
                  <b>APN teendők</b>
                  <ul>
                    {apn.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="sh-disc">
                Döntéstámogató összefoglaló; nem helyettesíti a klinikai megítélést.
              </p>
              <button className="btn ghost sm" onClick={() => onChange({})}>
                Újrakezdés
              </button>
            </div>
          ) : (
            <p className="sub">Válaszold meg a tételeket az automatikus kiértékeléshez.</p>
          )}
        </>
      )}
    </>
  )
}

function ItemRow({
  it,
  i,
  a,
  onRadio,
  onNum,
  onCheck,
}: {
  it: TestItem
  i: number
  a: AnsMap
  onRadio: (i: number, v: number) => void
  onNum: (i: number, val: string) => void
  onCheck: (i: number, v: number) => void
}) {
  const v = a[i]
  if (it.type === 'num') {
    return (
      <div className="sh-item">
        <div className="sh-q">
          {it.q}
          {it.help ? <span className="sh-help"> — {it.help}</span> : null}
        </div>
        <div className="sh-numwrap">
          <input
            className="field"
            type="number"
            inputMode="decimal"
            style={{ maxWidth: 140, marginBottom: 0 }}
            value={v != null ? String(v) : ''}
            placeholder={it.ph ?? 'érték'}
            onChange={(e) => onNum(i, e.target.value)}
          />
          {it.unit ? <span className="sh-unit">{it.unit}</span> : null}
        </div>
      </div>
    )
  }
  const isChk = it.type === 'check'
  const opts =
    it.type === 'slider'
      ? Array.from({ length: (it.max ?? 10) + 1 }, (_, n) => ({ l: String(n), v: n }))
      : it.opts ?? []
  return (
    <div className="sh-item">
      <div className="sh-q">{it.q}</div>
      <div className={it.type === 'slider' ? 'sh-opts slider' : 'sh-opts'}>
        {opts.map((o, oi) => {
          const on = isChk
            ? Array.isArray(v) && (v as number[]).includes(o.v)
            : v === o.v
          return (
            <button
              key={oi}
              className={on ? 'sh-opt on' : 'sh-opt'}
              onClick={() => (isChk ? onCheck(i, o.v) : onRadio(i, o.v))}
            >
              {o.l}
            </button>
          )
        })}
      </div>
    </div>
  )
}
