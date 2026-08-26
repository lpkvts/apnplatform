import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { GUIDELINE_SOURCES } from '@/lib/sources/data'
import { GuidelineSearch, type GuideRow } from '@/components/guideline-search'

export default async function TudastarPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guidelines')
    .select('id, title, specialty, summary')
    .eq('status', 'published')
    .order('title')
    .returns<GuideRow[]>()
  const guides = data ?? []
  const today = new Date().toISOString().slice(0, 10)
  const total = GUIDELINE_SOURCES.length + guides.length

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">Protokollok és irányelvek</h1>
      <p className="sub">
        Szakmai irányelvek, protokollok és a platformon hivatkozott források egy keresőben — {total} tétel.
        A verzió-ellenőrzés a kiadó hivatalos regiszterébe vezet.
      </p>

      <GuidelineSearch sources={GUIDELINE_SOURCES} guides={guides} today={today} />
    </>
  )
}
