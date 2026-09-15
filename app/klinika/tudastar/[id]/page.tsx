import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { KbDetail } from '@/components/kb-detail'
import { relatedScores } from '@/lib/kb/related'
import type { Guideline } from '@/lib/kb/types'

export default async function GuidelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  // Az útvonal a belső azonosítót és a külső azonosítót is elfogadja. A
  // kórképekből átvezetett források „korkep:<slug>” alakú külső
  // azonosítót kapnak, és a rájuk mutató hivatkozások azzal dolgoznak.
  const belso = /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(id)
  const { data } = await supabase
    .from('guidelines')
    .select('id, external_id, title, specialty, summary, body, version, from_disease_slug, source_url, source_year')
    .eq(belso ? 'id' : 'external_id', decodeURIComponent(id))
    .eq('status', 'published')
    .maybeSingle<Guideline>()

  if (!data) notFound()

  const related = relatedScores(data.title, data.summary ?? '').map((t) => ({
    id: t.id, name: t.name, abbr: t.abbr,
  }))

  return <KbDetail g={data} related={related} />
}
