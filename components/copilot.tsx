'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SafetyNote, UrgencyBanner, StructuredAnswer, parseSections } from '@/components/safety'

interface Src { id: string; title: string }
interface Msg { role: 'user' | 'ai'; text: string; sources?: Src[]; error?: boolean; sections?: Record<string, string>; urgent?: boolean }

const MODES = [
  { id: 'magyarazd', label: 'Magyarázd el', ph: 'Milyen fogalmat magyarázzak el egyszerűen? (pl. mi az a NEWS2)', hint: 'Szakmai fogalom közérthető magyarázata.' },
  { id: 'foglald', label: 'Foglald össze', ph: 'Melyik irányelvet foglaljam össze APN-szinten?', hint: 'Irányelv APN-szintű összefoglalója, forrással.' },
  { id: 'ertelmezd', label: 'Értelmezd', ph: 'Milyen leleteket értelmezzek? (pl. CRP 84, Hb 108)', hint: 'Laboreredmények értelmezésének támogatása — nem diagnózis.' },
  { id: 'gondolkodj', label: 'Gondolkodj velem', ph: 'Írd le a klinikai helyzetet — végiggondoljuk együtt.', hint: 'Esetalapú, strukturált döntéstámogatás — nem diagnózis.' },
  { id: 'forras', label: 'Mutasd a forrást', ph: 'Mihez keressek hivatalos forrást?', hint: 'Minden állításhoz a hivatalos, jóváhagyott forrás.' },
]

export function Copilot({ initialQuery }: { initialQuery?: string }) {
  const [mode, setMode] = useState<string | null>(null)
  const [input, setInput] = useState(initialQuery ?? '')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)
  const md = MODES.find((m) => m.id === mode)

  async function send() {
    const v = input.trim()
    if (!v || loading) return
    setMsgs((m) => [...m, { role: 'user', text: v }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode, question: v }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMsgs((m) => [...m, { role: 'ai', text: data.error || 'Hiba történt.', error: true }])
      } else {
        const text = data.text || '(üres válasz)'
        const sections = parseSections(text) ?? undefined
        const urgent = /sürg[őo]s|azonnal|életvesz/i.test(text)
        setMsgs((m) => [...m, { role: 'ai', text, sections, urgent, sources: data.sources ?? [] }])
      }
    } catch {
      setMsgs((m) => [...m, { role: 'ai', text: 'Hálózati hiba. Próbáld újra.', error: true }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">APN Copilot</h1>
      <p className="sub">Célzott, forrásalapú döntéstámogatás a jóváhagyott irányelvekből — nem diagnózis.</p>

      <div className="cop-modes">
        {MODES.map((m) => (
          <button key={m.id} className={mode === m.id ? 'cop-mode on' : 'cop-mode'}
            onClick={() => setMode(mode === m.id ? null : m.id)}>{m.label}</button>
        ))}
      </div>
      {md && <div className="cop-hint">ℹ️ {md.hint}</div>}

      <div className="cop-convo">
        {msgs.length === 0 && !loading && (
          <p className="sub">Válassz funkciót, vagy írj be egy kérdést. A válaszok a jóváhagyott Tudástár-tartalomból készülnek, forrásmegjelöléssel.</p>
        )}
        {msgs.map((m, i) =>
          m.role === 'user' ? (
            <div className="cop-user" key={i}>{m.text}</div>
          ) : (
            <div className={`cop-ai ${m.error ? 'cop-err' : ''}`} key={i}>
              {m.urgent && !m.error && <UrgencyBanner />}
              {m.sections
                ? <StructuredAnswer sections={m.sections} />
                : m.text.split('\n').map((p, j) => <p key={j} style={{ margin: '4px 0' }}>{p}</p>)}
              {m.sources && m.sources.length > 0 && (
                <div className="cop-acts">
                  {m.sources.map((s) => (
                    <Link key={s.id} className="btn ghost sm" href={`/klinika/tudastar/${s.id}`}>📄 {s.title}</Link>
                  ))}
                </div>
              )}
            </div>
          ),
        )}
        {loading && <div className="cop-ai"><p style={{ margin: 0, color: 'var(--slate-400)' }}>Gondolkodom…</p></div>}
      </div>

      <div className="cop-inputbar">
        <input className="field" style={{ marginBottom: 0 }} value={input} disabled={loading}
          placeholder={md ? md.ph : 'Kérdezz…'}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }} />
        <button className="btn" onClick={send} disabled={loading}>{loading ? '…' : 'Küldés'}</button>
      </div>
      <SafetyNote />
    </>
  )
}
