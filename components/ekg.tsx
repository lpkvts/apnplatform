'use client'
import { RelatedDiseases } from '@/components/related-diseases'
import { TopicBacklinks } from '@/components/topic-backlinks'
import type { DzLite } from '@/lib/disease/resolve'

import { useState } from 'react'
import Link from 'next/link'
import { FavStar } from '@/components/favorites-context'
import { ECG, EKG_CATS, type EcgItem } from '@/lib/ekg/data'
import { ECG_WAVES } from '@/lib/ekg/waves'

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const SEV_CLS: Record<string, string> = { 'Enyhe': 'sev-low', 'Közepes': 'sev-mid', 'Súlyos': 'sev-high', 'Életveszélyes': 'sev-crit' }
const QUIZ = ECG.filter((e) => e.quiz !== false)
const ekgName = (id: string) => ECG.find((e) => e.id === id)?.name ?? id

function shuffle<T>(a: T[]): T[] {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[r[i], r[j]] = [r[j], r[i]] }
  return r
}
function options(correct: string): string[] {
  const pool = QUIZ.filter((e) => e.id !== correct).map((e) => e.id)
  return shuffle([correct, ...shuffle(pool).slice(0, 3)])
}

function Trace({ wave }: { wave?: string }) {
  const w = wave ? ECG_WAVES[wave] : undefined
  if (!w) return null
  return (
    <svg className="ecg-svg" viewBox={`0 0 ${w.w} 150`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="eg" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0H0V8" fill="none" stroke="#f2ccd2" strokeWidth="0.6" /></pattern></defs>
      <rect width="100%" height="100%" fill="#fffdfd" /><rect width="100%" height="100%" fill="url(#eg)" />
      <polyline points={w.pts} fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
function UL({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null
  return (<div style={{ marginTop: 8 }}><b style={{ fontSize: 13 }}>{title}</b><ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>{items.map((x, i) => <li key={i}>{x}</li>)}</ul></div>)
}

type Mode = 'atlas' | 'practice' | 'exam'
interface Prac { qid: string; opts: string[]; picked: string | null }
interface Exam { order: string[]; opts: string[][]; idx: number; picks: string[]; score: number; done: boolean }

export function Ekg({ initialOpen, examEnabled = false, lookup = [] }: { initialOpen?: string; examEnabled?: boolean; lookup?: DzLite[] }) {
  const [mode, setMode] = useState<Mode>('atlas')
  const [prac, setPrac] = useState<Prac | null>(null)
  const [exam, setExam] = useState<Exam | null>(null)
  const [best, setBest] = useState<number | null>(null)

  function newPractice() {
    const pick = QUIZ[Math.floor(Math.random() * QUIZ.length)]
    setPrac({ qid: pick.id, opts: options(pick.id), picked: null })
  }
  function goMode(m: Mode) {
    setMode(m)
    if (m === 'practice' && !prac) newPractice()
  }
  function startExam() {
    const n = Math.min(20, QUIZ.length)
    const order = shuffle(QUIZ.map((e) => e.id)).slice(0, n)
    setExam({ order, opts: order.map((id) => options(id)), idx: 0, picks: [], score: 0, done: false })
  }
  function examAnswer(id: string) {
    if (!exam) return
    const correct = exam.order[exam.idx]
    const picks = [...exam.picks, id]
    const score = exam.score + (id === correct ? 1 : 0)
    if (exam.idx + 1 >= exam.order.length) {
      const pct = Math.round((score / exam.order.length) * 100)
      setBest((b) => (b == null || pct > b ? pct : b))
      setExam({ ...exam, picks, score, done: true })
    } else {
      setExam({ ...exam, picks, score, idx: exam.idx + 1 })
    }
  }

  const MODES: Mode[] = examEnabled ? ['atlas', 'practice', 'exam'] : ['atlas', 'practice']
  const activeMode: Mode = mode === 'exam' && !examEnabled ? 'atlas' : mode
  const ModeBar = () => (
    <div className="ekg-modebar">
      {MODES.map((m) => (
        <button key={m} className={`seg ${mode === m ? 'on' : ''}`} onClick={() => goMode(m)}>
          {m === 'atlas' ? 'Atlasz' : m === 'practice' ? 'Gyakorló' : 'Vizsga'}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">EKG Tudástár</h1>
      <ModeBar />
      {activeMode === 'atlas' && <Atlas initialOpen={initialOpen} lookup={lookup} />}
      {activeMode === 'practice' && prac && <Practice p={prac} onPick={(id) => setPrac({ ...prac, picked: id })} onNext={newPractice} />}
      {activeMode === 'exam' && examEnabled && <ExamView exam={exam} best={best} onStart={startExam} onAnswer={examAnswer} />}
    </>
  )
}

function Practice({ p, onPick, onNext }: { p: Prac; onPick: (id: string) => void; onNext: () => void }) {
  const e = ECG.find((x) => x.id === p.qid)!
  const answered = p.picked != null
  const ok = p.picked === p.qid
  return (
    <div className="ekg-quiz">
      <div className="eq-h">Milyen eltérést látsz az EKG-n?</div>
      <div className="card" style={{ padding: 8 }}><Trace wave={e.wave} /></div>
      <div className="eq-opts">
        {p.opts.map((id) => {
          let cls = ''
          if (answered) { if (id === p.qid) cls = 'right'; else if (id === p.picked) cls = 'wrong' }
          return <button key={id} className={`eq-opt ${cls}`} disabled={answered} onClick={() => !answered && onPick(id)}>{ekgName(id)}</button>
        })}
      </div>
      {answered && (
        <>
          <div className={`eq-fb ${ok ? 'ok' : 'no'}`}>{ok ? '✔ Helyes!' : '❌ Nem talált'} — {e.name}</div>
          {e.ai && <div className="eq-expl">{e.ai}{e.memory && <div className="eq-mem">🧠 {e.memory}</div>}</div>}
          <button className="btn" style={{ marginTop: 12 }} onClick={onNext}>Következő EKG</button>
        </>
      )}
    </div>
  )
}

function ExamView({ exam, best, onStart, onAnswer }: { exam: Exam | null; best: number | null; onStart: () => void; onAnswer: (id: string) => void }) {
  if (!exam) return (
    <div className="ekg-quiz">
      <div className="eq-h">Vizsga mód</div>
      <p className="sub">{Math.min(20, QUIZ.length)} véletlenszerű EKG. Válaszd ki a helyes felismerést; a végén pontszámot kapsz.</p>
      {best != null && <div className="eq-best">⭐ Eddigi legjobb: {best}%</div>}
      <button className="btn" style={{ marginTop: 10 }} onClick={onStart}>Vizsga indítása</button>
    </div>
  )
  if (exam.done) {
    const pct = Math.round((exam.score / exam.order.length) * 100)
    return (
      <div className="ekg-quiz">
        <div className="eq-h">Eredmény</div>
        <div className={`exam-score ${pct >= 70 ? 'good' : pct >= 50 ? 'mid' : 'low'}`}>{exam.score} / {exam.order.length} · {pct}%</div>
        {best != null && <div className="eq-best">⭐ Legjobb eddig: {best}%</div>}
        <div className="exam-rev">
          {exam.order.map((id, i) => {
            const ok = exam.picks[i] === id
            return (
              <div className={`er-row ${ok ? 'ok' : 'no'}`} key={i}>
                <span>{ok ? '✔' : '✗'}</span>
                <span className="err-n">{ekgName(id)}</span>
                {!ok && <span className="err-p">válaszod: {ekgName(exam.picks[i])}</span>}
              </div>
            )
          })}
        </div>
        <button className="btn" style={{ marginTop: 12 }} onClick={onStart}>Új vizsga</button>
      </div>
    )
  }
  const e = ECG.find((x) => x.id === exam.order[exam.idx])!
  return (
    <div className="ekg-quiz">
      <div className="eq-h">Kérdés {exam.idx + 1} / {exam.order.length} <span className="eq-prog">Pont: {exam.score}</span></div>
      <div className="ekg-prog-bar"><div style={{ width: `${Math.round((exam.idx / exam.order.length) * 100)}%` }} /></div>
      <div className="card" style={{ padding: 8 }}><Trace wave={e.wave} /></div>
      <div className="eq-opts">
        {exam.opts[exam.idx].map((oid) => <button key={oid} className="eq-opt" onClick={() => onAnswer(oid)}>{ekgName(oid)}</button>)}
      </div>
    </div>
  )
}

function Atlas({ initialOpen, lookup = [] }: { initialOpen?: string; lookup?: DzLite[] }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Összes')
  const [openId, setOpenId] = useState<string | null>(initialOpen ?? null)
  const open = openId ? ECG.find((e) => e.id === openId) ?? null : null
  if (open) return <EcgDetail e={open} onBack={() => setOpenId(null)} lookup={lookup} />
  const nq = norm(q.trim())
  const list = ECG.filter((e) => {
    const inCat = cat === 'Összes' || e.cat === cat
    const inQ = !nq || norm(`${e.name} ${e.kw ?? ''} ${e.cat}`).includes(nq)
    return nq ? inQ : inCat && inQ
  })
  const cats = ['Összes', ...EKG_CATS]
  return (
    <>
      <p className="sub">{ECG.length} EKG-kép · felismerés, kritériumok, APN-teendők</p>
      <input className="field" placeholder="Keresés: név, tünet, kategória…" value={q} onChange={(e) => setQ(e.target.value)} />
      {!nq && <div className="sh-chips">{cats.map((c) => <button key={c} className={c === cat ? 'sh-chip on' : 'sh-chip'} onClick={() => setCat(c)}>{c}</button>)}</div>}
      <div>
        {list.map((e) => (
          <button key={e.id} className="sh-row" onClick={() => setOpenId(e.id)}>
            <span className="sh-row-main"><span className="sh-row-name">{e.name}</span><span className="sh-row-sub">{e.cat}</span></span>
            {e.sev && <span className={`ekg-sev ${SEV_CLS[e.sev] ?? ''}`}>{e.sev}</span>}
            <FavStar type="ekg" id={e.id} />
            <span className="sh-chev">›</span>
          </button>
        ))}
        {list.length === 0 && <p className="sub">Nincs találat.</p>}
      </div>
    </>
  )
}

function EcgDetail({ e, onBack, lookup = [] }: { e: EcgItem; onBack: () => void; lookup?: DzLite[] }) {
  const urgent = e.urgent && e.urgent.trim() && e.urgent.trim() !== '—'
  return (
    <>
      <button className="sh-back" onClick={onBack}>‹ Vissza a listához</button>
      <h2 className="h1" style={{ fontSize: 20 }}>{e.name}</h2>
      <p className="sub">{e.cat}{e.freq ? ` · ${e.freq}` : ''}{e.sev ? ` · ${e.sev}` : ''}</p>
      {e.wave && <div className="card" style={{ padding: 8 }}><Trace wave={e.wave} /></div>}
      <div className="card"><p style={{ margin: 0 }}>{e.desc}</p>{e.apnRel && <p className="sub" style={{ margin: '8px 0 0' }}><b>APN-relevancia:</b> {e.apnRel}</p>}</div>
      {urgent && <div className="sh-urgent">⚠ {e.urgent}</div>}
      {e.features && e.features.length > 0 && <div className="card"><b>🔍 Felismerés — jellemzők</b><UL title="" items={e.features} /></div>}
      {e.algo && e.algo.length > 0 && <div className="card"><b>🧭 Diagnosztikus lépések</b><ol style={{ margin: '6px 0 0', paddingLeft: 18 }}>{e.algo.map((x, i) => <li key={i}>{x}</li>)}</ol></div>}
      {e.apn && e.apn.length > 0 && <div className="sh-apn"><b>APN teendők</b><ul>{e.apn.map((x, i) => <li key={i}>{x}</li>)}</ul></div>}
      {e.signif && e.signif.trim() && <div className="card"><b>💡 Klinikai jelentőség</b><p style={{ margin: '6px 0 0' }}>{e.signif}</p></div>}
      {e.mistakes && e.mistakes.length > 0 && <div className="card"><b>⚠ Gyakori hibák</b><UL title="" items={e.mistakes} /></div>}
      {e.memory && <div className="kb-relnote">🧠 Memóriakampó: {e.memory}</div>}
      {e.diseases && e.diseases.length > 0 && <RelatedDiseases names={e.diseases} lookup={lookup} showAkut={!!(e.tags && e.tags.includes("surgos"))} title="Kapcsolódó kórképek" />}
      <TopicBacklinks kind="ekg" id={e.id} />
      <p className="sh-disc">Oktató-döntéstámogató referencia; a valós EKG mindig klinikai kontextusban, orvosi megerősítéssel értékelendő.</p>
    </>
  )
}
