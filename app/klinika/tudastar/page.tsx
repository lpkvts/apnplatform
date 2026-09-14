import Link from 'next/link'
import { OldalFej } from '@/components/oldal-fej'
import { Morzsa } from '@/components/morzsa'
import { createClient } from '@/lib/supabase/server'
import { GUIDELINE_SOURCES } from '@/lib/sources/data'
import { GuidelineSearch, type GuideRow } from '@/components/guideline-search'

export default async function TudastarPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const supabase = await createClient()
  const { data } = await supabase
    .from('guidelines')
    .select('id, title, specialty, summary, from_disease_slug, source_url, source_year')
    .eq('status', 'published')
    .order('title')
    .returns<GuideRow[]>()
  const guides = data ?? []
  const today = new Date().toISOString().slice(0, 10)
  const total = GUIDELINE_SOURCES.length + guides.length

  return (
    <>
      <Morzsa elemek={[{ label: 'Klinikum', href: '/klinika' }, { label: 'Protokollok és irányelvek' }]} />
      <OldalFej cim="Protokollok és irányelvek" meta={`${total} tétel`} />
      <p className="sub" style={{ marginTop: -6, marginBottom: 14 }}>
        A kórképek adatlapjain hivatkozott források magától bekerülnek ide, ezért a
        kettő nem tud szétcsúszni. A verzió-ellenőrzés a kiadó hivatalos regiszterébe vezet.
      </p>

      <GuidelineSearch sources={GUIDELINE_SOURCES} guides={guides} today={today} initialQuery={q ?? ''} />
    </>
  )
}
