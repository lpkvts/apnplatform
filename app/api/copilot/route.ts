import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Gl { id: string; title: string; summary: string | null; body: { sections?: [string, string][] } | null }

const MODE_INSTRUCTION: Record<string, string> = {
  magyarazd: 'A felhasználó egy szakmai fogalom KÖZÉRTHETŐ magyarázatát kéri. Magyarázd el egyszerűen, a forrásokra támaszkodva.',
  foglald: 'A felhasználó egy irányelv APN-szintű ÖSSZEFOGLALÓJÁT kéri. Foglald össze tömören, gyakorlati fókusszal, a forrás alapján.',
  ertelmezd: 'A felhasználó laboreredmények/leletek ÉRTELMEZÉSÉHEZ kér támogatást. Adj strukturált keretet (összkép, lehetséges összefüggések, APN-fókusz, mikor kell orvos). Ez NEM diagnózis.',
  gondolkodj: 'A felhasználó egy klinikai helyzet STRUKTURÁLT VÉGIGGONDOLÁSÁT kéri. Adj rendszerezett döntéstámogatást (ABCDE, kulcskérdések, illeszkedő score-ok, red flag-ek, következő lépés). Ez NEM diagnózis.',
  forras: 'A felhasználó a HIVATALOS FORRÁST kéri egy állításhoz. Válaszolj tömören, és egyértelműen jelöld meg a forrást.',
}

const SYSTEM = `Te az "APN Copilot" vagy, egy magyar nyelvű klinikai DÖNTÉSTÁMOGATÓ asszisztens Advanced Practice Nurse-ök számára.

SZABÁLYOK:
- Mindig magyarul válaszolj, tömören, szakmailag pontosan.
- KIZÁRÓLAG a megadott, jóváhagyott forrásokból (irányelvek) dolgozz. Ha a források nem fedik a kérdést, ezt őszintén mondd meg, és ne találj ki tényeket.
- NEM állítasz fel diagnózist, és nem helyettesíted az orvosi megítélést; a válaszod döntéstámogatás.
- Soha ne kérj és ne kezelj betegazonosító adatot.
- Kompetenciahatáron túl (pl. életveszélyes eltérés, orvosi kompetenciába tartozó döntés) jelezd, hogy orvosi konzultáció szükséges.
- A válasz VÉGÉRE írj egy sort pontosan ebben a formában, felsorolva a felhasznált források azonosítóit (vesszővel), vagy "nincs", ha egyik forrást sem használtad: "FORRÁSOK: id1, id2"`

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nincs bejelentkezve.' }, { status: 401 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'A Copilot jelenleg nincs beállítva (hiányzó API-kulcs). Add meg az ANTHROPIC_API_KEY környezeti változót.' },
      { status: 503 },
    )
  }

  let body: { mode?: string; question?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Hibás kérés.' }, { status: 400 }) }
  const question = (body.question ?? '').trim()
  const mode = body.mode ?? ''
  if (!question) return NextResponse.json({ error: 'Üres kérdés.' }, { status: 400 })

  const { data: gls } = await supabase
    .from('guidelines')
    .select('id, title, summary, body')
    .eq('status', 'published')
    .returns<Gl[]>()

  const sources = (gls ?? []).map((g) => {
    const secs = (g.body?.sections ?? []).map((s) => `- ${s[0]}: ${s[1]}`).join('\n')
    return `(id:${g.id})\nCÍM: ${g.title}\nÖSSZEFOGLALÓ: ${g.summary ?? ''}\n${secs}`
  }).join('\n\n---\n\n')

  const modeLine = MODE_INSTRUCTION[mode] ?? ''
  const userMsg = `${modeLine ? modeLine + '\n\n' : ''}FELHASZNÁLÓ KÉRDÉSE:\n${question}\n\nELÉRHETŐ, JÓVÁHAGYOTT FORRÁSOK:\n${sources || '(nincs elérhető forrás)'}`

  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022'

  let text = ''
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: SYSTEM,
        messages: [{ role: 'user', content: userMsg }],
      }),
    })
    if (!res.ok) {
      const t = await res.text()
      return NextResponse.json({ error: `A modell hívása sikertelen (${res.status}).`, detail: t.slice(0, 300) }, { status: 502 })
    }
    const data = await res.json()
    text = (data.content ?? []).filter((c: { type: string }) => c.type === 'text').map((c: { text: string }) => c.text).join('\n').trim()
  } catch {
    return NextResponse.json({ error: 'Hálózati hiba a modell hívásakor.' }, { status: 502 })
  }

  // FORRÁSOK sor kinyerése + eltávolítása a megjelenítendő szövegből
  let usedIds: string[] = []
  const m = text.match(/FORRÁSOK:\s*(.+)\s*$/i)
  if (m) {
    const raw = m[1].trim()
    if (raw.toLowerCase() !== 'nincs') usedIds = raw.split(',').map((s) => s.trim()).filter(Boolean)
    text = text.replace(/\n?FORRÁSOK:\s*.+\s*$/i, '').trim()
  }
  const byId = new Map((gls ?? []).map((g) => [g.id, g.title]))
  const usedSources = usedIds
    .filter((id) => byId.has(id))
    .map((id) => ({ id, title: byId.get(id) as string }))

  return NextResponse.json({ text, sources: usedSources })
}
