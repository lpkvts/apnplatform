import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ECG } from '@/lib/ekg/data'

/**
 * EKG-lelet fotójának strukturált átnézése — béta.
 *
 * Két dolog határozza meg a megvalósítást.
 *
 * Az első: ez nem diagnosztikai eszköz. A válasz megfigyeléseket sorol és
 * kérdéseket vet fel, nem kórismét mond ki. Egy fotóból készült elemzés
 * technikai okokból is bizonytalan — a kalibráció, az elmosódás, a papír
 * gyűrődése mind torzít —, a klinikai kép pedig teljesen hiányzik belőle.
 *
 * A második: a kép nem kerül tárolásra. A kérésben megy át, a válasz után
 * eldobódik. A betegazonosító kitakarását a felület kéri a feltöltés előtt.
 */

const SYSTEM = `Te egy EKG-átnézést segítő szakmai asszisztens vagy magyar nyelven,
kiterjesztett hatáskörű ápolók (APN) számára.

MIT CSINÁLSZ
Egy feltöltött EKG-lelet fotóján végigmész a szokásos elemzési lépéseken, és
leírod, MIT LÁTSZ. Kérdéseket vetsz fel, amelyeket a klinikussal együtt kell
megválaszolni.

MIT NEM CSINÁLSZ — ezek megszegése súlyos hiba
- NEM állítasz fel diagnózist. Soha nem írod le, hogy "ez X betegség".
- NEM adsz terápiás javaslatot, gyógyszert, dózist.
- NEM mondod, hogy valami "kizárható" vagy "normális, nincs teendő".
- NEM állítasz olyat, amit a képen nem látsz tisztán.

A BIZONYTALANSÁG KEZELÉSE — ez a legfontosabb
A fotóból készült átnézés technikailag korlátozott. Ha a kép elmosódott,
levágott, ferde, rossz megvilágítású, vagy a kalibrációs jel nem látszik,
ezt MONDD KI, és jelezd, mely megállapítás bizonytalan emiatt.
Ha egy elvezetés nem olvasható, írd le, hogy nem olvasható — ne találgass.

VÁLASZ SZERKEZETE — pontosan ezekkel a címkékkel, ebben a sorrendben:

KÉPMINŐSÉG: mennyire olvasható a lelet, mi korlátozza az átnézést. Ha a
kalibráció (25 mm/s, 10 mm/mV) nem azonosítható, ezt külön jelezd.

MIT LÁTOK: a szokásos lépések szerint — ritmus, frekvencia, P-hullám,
PR-táv, QRS-szélesség, tengely, ST-szakasz, T-hullám. Amit nem lehet
megítélni, ott ezt írd.

AMI FIGYELMET ÉRDEMEL: a szembetűnő eltérések, elvezetésenként megnevezve.
Ha semmi ilyet nem látsz, írd: "A képen nem azonosítottam szembetűnő eltérést."

MILYEN IRÁNYBA VEZET: mely lehetőségek jönnek szóba a látottak alapján —
lehetőségként, nem állításként. Fogalmazz így: "ez a kép felveti…",
"ilyenkor szóba jön…".

MI HIÁNYZIK A MEGÍTÉLÉSHEZ: milyen klinikai adat kellene — panasz, időbeliség,
vitális paraméterek, korábbi EKG, labor.

SÜRGŐSSÉG: ha a kép olyan eltérést mutat, ami azonnali orvosi értékelést
indokol, ezt írd ki egyértelműen, elöl. Ha nem, írd: "A képen nem láttam
azonnali beavatkozást indokoló eltérést — ez nem zárja ki a sürgős állapotot."

A válasz végén mindig: "Ez az átnézés nem lelet és nem diagnózis. Az EKG
szakorvosi értékelése és a klinikai kép együtt dönt."`

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nincs bejelentkezve.' }, { status: 401 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'A szolgáltatás jelenleg nem elérhető.' }, { status: 503 },
    )
  }

  const form = await req.formData()
  const file = form.get('image')
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Nem érkezett kép.' }, { status: 400 })
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: 'A kép túl nagy (legfeljebb 8 MB).' }, { status: 400 })
  }
  const OK_TYPE = ['image/jpeg', 'image/png', 'image/webp']
  if (!OK_TYPE.includes(file.type)) {
    return NextResponse.json({ error: 'Csak JPEG, PNG vagy WEBP kép tölthető fel.' }, { status: 400 })
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString('base64')

  // A platform saját EKG-atlaszának tételei: az átnézés ezekre a
  // megnevezésekre támaszkodik, hogy a felhasználó tovább tudjon lépni
  // a meglévő tananyagra.
  const atlasz = (ECG as { name: string; cat: string }[])
    .map((e) => `${e.name} (${e.cat})`).join(', ')

  const kontextus = form.get('context')
  const kieg = typeof kontextus === 'string' && kontextus.trim()
    ? `\n\nA felhasználó által megadott klinikai összefüggés: ${kontextus.trim()}`
    : '\n\nA felhasználó nem adott meg klinikai összefüggést.'

  try {
    const valasz = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1800,
        system: SYSTEM,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: file.type, data: base64 },
            },
            {
              type: 'text',
              text: `Nézd át ezt az EKG-leletet a megadott szerkezet szerint.${kieg}\n\n`
                + `A platform EKG-atlaszában szereplő megnevezések, amelyekre hivatkozhatsz: ${atlasz}`,
            },
          ],
        }],
      }),
    })

    if (!valasz.ok) {
      return NextResponse.json(
        { error: 'Az átnézés nem sikerült. Próbáld újra később.' }, { status: 502 },
      )
    }

    const data = await valasz.json()
    const szoveg = (data.content ?? [])
      .filter((r: { type: string }) => r.type === 'text')
      .map((r: { text: string }) => r.text)
      .join('\n')

    return NextResponse.json({ text: szoveg })
  } catch {
    return NextResponse.json({ error: 'Az átnézés nem sikerült.' }, { status: 502 })
  }
}
