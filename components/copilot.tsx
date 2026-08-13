'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Gl { id: string; title: string; summary: string | null }
interface Msg { role: 'user' | 'ai'; text: string; kind?: string; note?: string; actions?: { href: string; label: string }[] }

const MODES = [
  { id: 'magyarazd', label: 'Magyarázd el', ph: 'Milyen fogalmat magyarázzak el egyszerűen? (pl. mi az a NEWS2)', hint: 'Szakmai fogalom közérthető magyarázata.' },
  { id: 'foglald', label: 'Foglald össze', ph: 'Melyik irányelvet foglaljam össze APN-szinten?', hint: 'Irányelv APN-szintű összefoglalója, forrással.' },
  { id: 'ertelmezd', label: 'Értelmezd', ph: 'Milyen leleteket értelmezzek? (pl. CRP 84, Hb 108)', hint: 'Laboreredmények értelmezésének támogatása — nem diagnózis.' },
  { id: 'gondolkodj', label: 'Gondolkodj velem', ph: 'Írd le a klinikai helyzetet — végiggondoljuk együtt.', hint: 'Esetalapú, strukturált döntéstámogatás — nem diagnózis.' },
  { id: 'forras', label: 'Mutasd a forrást', ph: 'Mihez keressek hivatalos forrást?', hint: 'Minden állításhoz a hivatalos, jóváhagyott forrás.' },
]

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

function findGl(gl: Gl[], keys: string[]): Gl | null {
  return gl.find((x) => { const t = norm(`${x.title} ${x.summary ?? ''}`); return keys.some((k) => t.includes(k)) }) ?? null
}

function reply(raw: string, mode: string | null, gl: Gl[]): Msg {
  const q = norm(raw)
  if (mode === 'ertelmezd') {
    return {
      role: 'ai', kind: 'Laborértelmezés — támogatás',
      text: 'Strukturált támogatás a beírt értékekhez (nem diagnózis):\n• Összkép: az eltérések iránya és nagyságrendje.\n• Lehetséges összefüggések: a mintázatok — megerősítés nélkül.\n• APN-fókusz: mit érdemes megfigyelni, dokumentálni.\n• További megfontolható vizsgálat.\n• Mikor kell orvos: kritikus eltérés vagy gyors romlás esetén.',
      note: 'Döntéstámogató keret, nem automatikus diagnózis; a konkrét értékek klinikai kontextusban értékelendők.',
      actions: [{ href: '/klinika/tesztek', label: 'Klinikai tesztek' }],
    }
  }
  if (mode === 'gondolkodj') {
    return {
      role: 'ai', kind: 'Gondolkodjunk együtt — döntéstámogatás',
      text: 'Strukturált végiggondolás (nem diagnózis):\n• ABCDE / vitális: van-e azonnali életveszélyre utaló jel?\n• Kulcskérdések: kezdet, lefolyás, kísérő tünetek, rizikófaktorok.\n• Illeszkedő score-ok a Score Hubban.\n• Red flag-ek: mi zárná ki a biztonságos várakozást?\n• Következő lépés: megfigyelés, vizsgálat vagy orvosi konzultáció.',
      note: 'Döntéstámogatás, nem orvosi diagnózis; kompetenciahatáron túl orvosi konzultáció szükséges.',
      actions: [{ href: '/klinika/ertekeles', label: 'Új betegértékelés' }, { href: '/klinika/tesztek', label: 'Score Hub' }],
    }
  }
  let g: Gl | null = null
  let txt = ''
  if (/copd|obstruktiv|tudo|inhal|legz/.test(q)) { g = findGl(gl, ['copd', 'obstruktiv']); txt = 'A COPD gondozásában kulcs a helyes inhalációs technika, az adherencia és a gyógyszerbiztonsági ellenőrzés. A teljes, érvényes ajánlás a hivatalos forrásban olvasható.' }
  else if (/asztma/.test(q)) { g = findGl(gl, ['asztma']); txt = 'A felnőttkori asztma ellátása a diagnosztikát, a lépcsőzetes kezelést és a rendszeres gondozást foglalja magában. A részletek a hivatalos irányelvben.' }
  else if (/szivelegtelen|sziv|kardio/.test(q)) { g = findGl(gl, ['szivelegtelen', 'szív']); txt = 'A krónikus szívelégtelenség gondozása a tünetek és testsúly követését, a terápiahűséget és a korai romlás felismerését igényli.' }
  else if (/artroz|terd|izulet/.test(q)) { g = findGl(gl, ['artroz', 'térd', 'mozgasszerv']); txt = 'A térdízületi artrózis ellátása konzervatív és sebészeti elemeket is tartalmaz; a mozgásterápia és a fájdalomcsillapítás szerepe hangsúlyos.' }
  else if (/cukor|diabet|retinopath/.test(q)) { g = findGl(gl, ['diabet', 'retinopath', 'cukor']); txt = 'A diabéteszes szövődmények esetén a rendszeres szűrés és a korai felismerés kulcsfontosságú.' }
  else if (/taplal|malnutri/.test(q)) { g = findGl(gl, ['taplal', 'malnutri']); txt = 'A tápláltsági állapot szűrése az alapellátásban validált eszközökkel történik; az eltérések korai jelzése fontos.' }
  else { txt = 'A jóváhagyott, hivatalos szakmai irányelvek alapján tudok válaszolni. Pontosítsd a kérdést, vagy nyisd meg a Tudástárat a forrás megtekintéséhez.' }

  let kind = 'Válasz'
  let note: string | undefined
  if (mode === 'magyarazd') { kind = 'Magyarázat'; note = 'Közérthető magyarázat; a részletekért lásd a hivatalos forrást.' }
  else if (mode === 'foglald') kind = 'Összefoglaló'
  else if (mode === 'forras') kind = 'Forrás'

  const actions = g
    ? [{ href: `/klinika/tudastar/${g.id}`, label: 'Forrás megnyitása' }]
    : [{ href: '/klinika/tudastar', label: 'Tudástár' }]
  return { role: 'ai', kind, text: txt, note, actions }
}

export function Copilot({ guidelines }: { guidelines: Gl[] }) {
  const [mode, setMode] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const md = MODES.find((m) => m.id === mode)

  function send() {
    const v = input.trim()
    if (!v) return
    setMsgs((m) => [...m, { role: 'user', text: v }, reply(v, mode, guidelines)])
    setInput('')
  }

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">APN Copilot</h1>
      <p className="sub">Célzott, forrásalapú döntéstámogatás — nem diagnózis.</p>

      <div className="cop-modes">
        {MODES.map((m) => (
          <button key={m.id} className={mode === m.id ? 'cop-mode on' : 'cop-mode'}
            onClick={() => setMode(mode === m.id ? null : m.id)}>{m.label}</button>
        ))}
      </div>
      {md && <div className="cop-hint">ℹ️ {md.hint}</div>}

      <div className="cop-convo">
        {msgs.length === 0 && (
          <p className="sub">Válassz funkciót, vagy írj be egy kérdést. A válaszok a jóváhagyott Tudástár-tartalomból, forrásmegjelöléssel készülnek.</p>
        )}
        {msgs.map((m, i) =>
          m.role === 'user' ? (
            <div className="cop-user" key={i}>{m.text}</div>
          ) : (
            <div className="cop-ai" key={i}>
              <div className="cop-kind">{m.kind}</div>
              {m.text.split('\n').map((p, j) => <p key={j} style={{ margin: '4px 0' }}>{p}</p>)}
              {m.note && <p className="cop-note">{m.note}</p>}
              {m.actions && (
                <div className="cop-acts">
                  {m.actions.map((a, j) => <Link key={j} className="btn ghost sm" href={a.href}>{a.label}</Link>)}
                </div>
              )}
            </div>
          ),
        )}
      </div>

      <div className="cop-inputbar">
        <input className="field" style={{ marginBottom: 0 }} value={input}
          placeholder={md ? md.ph : 'Kérdezz…'}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }} />
        <button className="btn" onClick={send}>Küldés</button>
      </div>
      <p className="sh-disc">Döntéstámogatás — nem helyettesíti a klinikai megítélést, és nem állít fel diagnózist. Ne adj meg betegazonosító adatot.</p>
    </>
  )
}
