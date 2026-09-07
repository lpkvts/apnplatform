import { createClient } from '@/lib/supabase/server'
import { TOPICS } from '@/lib/topics/data'

/**
 * A platform teljes forrásállományának áttekintése.
 *
 * A források több helyen élnek: egy részük az adatbázisban, ahol
 * szerkeszthető, más részük a kódban, a klinikai tartalommal együtt. Ez az
 * összeállítás mindkettőt megmutatja, mert a kérdés — „mire épül a
 * platformon megjelenő szakmai állítás?" — csak együtt válaszolható meg.
 *
 * A kódban lévő források nem szerkeszthetők a felületről. Ez tudatos: azok
 * a tartalommal egy helyen állnak, és együtt is kell változniuk vele.
 */

export type Eredet = 'adatbazis' | 'kod'

export interface ForrasTetel {
  /** Melyik modulhoz tartozik. */
  modul: string
  /** Mihez kapcsolódik — betegség, téma, irányelv neve. */
  hovatartozas: string | null
  cim: string
  szervezet: string | null
  ev: string | null
  url: string | null
  /** Nemzetközi vagy hazai forrás. */
  nemzetkozi: boolean | null
  eredet: Eredet
  /** Ha adatbázisból jön, hol szerkeszthető. */
  szerkesztes: string | null
}

export interface ForrasOsszegzes {
  ossz: number
  adatbazisbol: number
  kodbol: number
  hivatkozassal: number
  modulok: { nev: string; db: number; eredet: Eredet }[]
}

/**
 * A kódban tárolt források összegyűjtése.
 *
 * Jelenleg az akut témák tartalmaznak forráshivatkozást. A többi klinikai
 * modul — skálák, labor, EKG — a leírásban hivatkozik, de nincs strukturált
 * forrásmezője; ez a következő tartalmi kör feladata.
 */
function kodForrasok(): ForrasTetel[] {
  const ki: ForrasTetel[] = []

  for (const t of TOPICS) {
    for (const s of t.sources ?? []) {
      ki.push({
        modul: 'Akut állapotok',
        hovatartozas: t.title,
        cim: s.name,
        szervezet: s.org ?? null,
        ev: s.year ?? null,
        url: null,
        nemzetkozi: s.intl ?? null,
        eredet: 'kod',
        szerkesztes: null,
      })
    }
  }

  return ki
}

export async function getForrasAttekintes(): Promise<{
  tetelek: ForrasTetel[]
  osszegzes: ForrasOsszegzes
}> {
  const supabase = await createClient()

  const [klinikai, iranyelvek, betegsegek, apn] = await Promise.all([
    supabase.from('clinical_sources')
      .select('title, publisher, year, url, status').order('title'),
    supabase.from('guidelines')
      .select('title, org, year, source_url, status')
      .eq('status', 'published').order('title'),
    supabase.from('diseases')
      .select('name, sources').eq('status', 'published'),
    supabase.from('apn_sources')
      .select('title, org, url, country_id'),
  ])

  const tetelek: ForrasTetel[] = []

  for (const s of (klinikai.data ?? []) as Record<string, string>[]) {
    tetelek.push({
      modul: 'Klinikai források', hovatartozas: null,
      cim: s.title, szervezet: s.publisher ?? null, ev: s.year ?? null,
      url: s.url ?? null, nemzetkozi: null,
      eredet: 'adatbazis', szerkesztes: '/cms/forrasok',
    })
  }

  for (const g of (iranyelvek.data ?? []) as Record<string, string>[]) {
    tetelek.push({
      modul: 'Irányelvek', hovatartozas: null,
      cim: g.title, szervezet: g.org ?? null, ev: g.year ?? null,
      url: g.source_url ?? null, nemzetkozi: null,
      eredet: 'adatbazis', szerkesztes: '/cms/iranyelvek',
    })
  }

  for (const d of (betegsegek.data ?? []) as { name: string; sources: unknown }[]) {
    const lista = Array.isArray(d.sources) ? d.sources : []
    for (const s of lista as Record<string, string>[]) {
      if (!s?.name && !s?.title) continue
      tetelek.push({
        modul: 'Betegségtár', hovatartozas: d.name,
        cim: s.name ?? s.title, szervezet: s.org ?? null, ev: s.year ?? null,
        url: s.url ?? null, nemzetkozi: null,
        eredet: 'adatbazis', szerkesztes: '/cms/betegsegek',
      })
    }
  }

  for (const a of (apn.data ?? []) as Record<string, string>[]) {
    tetelek.push({
      modul: 'APN World', hovatartozas: null,
      cim: a.title, szervezet: a.org ?? null, ev: null,
      url: a.url ?? null, nemzetkozi: true,
      eredet: 'adatbazis', szerkesztes: '/cms/apn-world',
    })
  }

  tetelek.push(...kodForrasok())

  // Modulonkénti összesítés — ebből látszik, hol vékony a lefedettség.
  const modulTerkep = new Map<string, { db: number; eredet: Eredet }>()
  for (const t of tetelek) {
    const meglevo = modulTerkep.get(t.modul)
    modulTerkep.set(t.modul, { db: (meglevo?.db ?? 0) + 1, eredet: t.eredet })
  }

  return {
    tetelek,
    osszegzes: {
      ossz: tetelek.length,
      adatbazisbol: tetelek.filter((t) => t.eredet === 'adatbazis').length,
      kodbol: tetelek.filter((t) => t.eredet === 'kod').length,
      hivatkozassal: tetelek.filter((t) => t.url).length,
      modulok: [...modulTerkep.entries()]
        .map(([nev, v]) => ({ nev, ...v }))
        .sort((a, b) => b.db - a.db),
    },
  }
}
