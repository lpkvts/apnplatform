import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { evbol, forrasKor, evekSzama, HATAR_EV } from '@/lib/forrasok/kor'

/**
 * Forrásblokk a klinikai tartalmak alján.
 *
 * Három dolgot tesz, amit a korábbi, egyszerű szövegmező nem tudott.
 *
 * Megnyithatóvá teszi a forrást, ha van hivatkozás. Jelzi, ha a forrás öt
 * évnél régebbi — ez nem minősítés, hanem felhívás az ellenőrzésre. És
 * összeköti a platform irányelvtárával: ha a forrás ott is szerepel, oda
 * mutat, mert ott a teljes összefoglaló olvasható.
 */

export interface ForrasAdat {
  source_name?: string
  source_url?: string
  version?: string
  updated?: string
  evidence?: string
}

/**
 * Egyezés keresése az irányelvtárban.
 *
 * A cím alapján keresünk, mert az azonosítók nem közösek. Az egyezés nem
 * lehet pontos: a hivatkozások megfogalmazása eltér, ezért a cím első
 * jellemző szavaira szűrünk.
 */
async function iranyelvKereses(cim: string): Promise<{ id: string; title: string } | null> {
  const supabase = await createClient()
  // A leghosszabb, tartalmas szó jó szűrő: a rövid kötőszavak túl sok találatot adnának.
  const kulcs = cim
    .split(/[\s,–—-]+/)
    .filter((sz) => sz.length >= 6 && !/^\d+$/.test(sz))
    .sort((a, b) => b.length - a.length)[0]
  if (!kulcs) return null

  const { data } = await supabase
    .from('guidelines')
    .select('id, title')
    .eq('status', 'published')
    .ilike('title', `%${kulcs}%`)
    .limit(1)
    .maybeSingle<{ id: string; title: string }>()
  return data
}

export async function ForrasBlokk({ b, reviewOn }: { b: ForrasAdat; reviewOn?: string | null }) {
  const ev = evbol(b.version, b.source_name, b.updated)
  const kor = forrasKor(ev)
  const evek = evekSzama(ev)
  const iranyelv = b.source_name ? await iranyelvKereses(b.source_name) : null

  return (
    <>
      <div className="row">
        <span className="sub" style={{ margin: 0 }}>Forrás</span>
        <span style={{ textAlign: 'right', flex: 1 }}>
          {b.source_url ? (
            <a href={b.source_url} target="_blank" rel="noopener" className="fb-link">
              {b.source_name || 'Forrás megnyitása'} <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <b>{b.source_name || '—'}</b>
          )}
        </span>
      </div>

      {/* Ha a forrás a platform irányelvtárában is szerepel, oda mutatunk:
          ott a teljes szakmai összefoglaló olvasható. */}
      {iranyelv && (
        <div className="row">
          <span className="sub" style={{ margin: 0 }}>A platformon</span>
          <Link href={`/klinika/tudastar/${iranyelv.id}`} className="fb-link" style={{ textAlign: 'right' }}>
            {iranyelv.title} →
          </Link>
        </div>
      )}

      <div className="row">
        <span className="sub" style={{ margin: 0 }}>Verzió</span>
        <b>{b.version || '—'}</b>
      </div>

      <div className="row">
        <span className="sub" style={{ margin: 0 }}>A forrás kora</span>
        <span style={{ textAlign: 'right' }}>
          {kor === 'ismeretlen' ? (
            <b>—</b>
          ) : (
            <span className={`st ${kor === 'friss' ? 'st-passed' : 'st-failed'}`}>
              {ev} · {evek} éve
            </span>
          )}
        </span>
      </div>

      <div className="row">
        <span className="sub" style={{ margin: 0 }}>Utolsó frissítés</span>
        <b>{b.updated || '—'}</b>
      </div>

      <div className="row">
        <span className="sub" style={{ margin: 0 }}>Következő felülvizsgálat</span>
        <b>{reviewOn || '—'}</b>
      </div>

      <div className="row" style={{ borderBottom: 'none' }}>
        <span className="sub" style={{ margin: 0 }}>Bizonyíték</span>
        <b style={{ textAlign: 'right' }}>{b.evidence || '—'}</b>
      </div>

      {kor === 'regebbi' && (
        <p className="fb-figy">
          Ez a forrás {HATAR_EV} évnél régebbi. Ez önmagában nem jelenti, hogy elavult —
          egyes területeken évtizedekig nem születik új ajánlás. Érdemes viszont ellenőrizni,
          megjelent-e azóta frissebb változat.
        </p>
      )}
    </>
  )
}
