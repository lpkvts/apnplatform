import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { GlobalSearch } from '@/components/global-search'
import { getFlag } from '@/lib/flags'

export const dynamic = 'force-dynamic'

/**
 * Központi keresés.
 *
 * Minden modul tartalma egy helyen kereshető. A kikapcsolt modulok
 * találatai nem jelennek meg: azok zárt oldalra vinnének.
 */
export default async function KeresesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q: initialQuery } = await searchParams
  const supabase = await createClient()

  const [careerEnabled, gyogyszerEnabled, apnWorldEnabled] = await Promise.all([
    getFlag('apn_career', false),
    getFlag('gyogyszertar', false),
    getFlag('apn_world', false),
  ])

  const [g, c, d, drugs, countries] = await Promise.all([
    supabase.from('guidelines').select('id, title, summary, specialty').eq('status', 'published'),
    supabase.from('career_items').select('id, title, category, tags, org').eq('status', 'published'),
    supabase.from('diseases').select('id, name, aliases, abbrev, specialty').eq('status', 'published'),
    // A kikapcsolt modult le sem kérdezzük — fölösleges kör lenne.
    gyogyszerEnabled
      ? supabase.from('drug_substances')
          .select('slug, name, name_intl, atc, indications')
          .eq('publish_status', 'published')
      : Promise.resolve({ data: [] }),
    apnWorldEnabled
      ? supabase.from('apn_countries')
          .select('code, name, name_en, flag, region')
          .eq('publish_status', 'published')
      : Promise.resolve({ data: [] }),
  ])

  return (
    <>
      <Link className="sh-back" href="/">‹ Kezdőlap</Link>
      <h1 className="h1">Keresés</h1>
      <GlobalSearch
        guidelines={g.data ?? []}
        career={careerEnabled ? (c.data ?? []) : []}
        diseases={d.data ?? []}
        drugs={drugs.data ?? []}
        countries={countries.data ?? []}
        initialQuery={initialQuery ?? ''}
      />
    </>
  )
}
