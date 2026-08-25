import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { GlobalSearch } from '@/components/global-search'
import { getFlag } from '@/lib/flags'

export const dynamic = 'force-dynamic'

export default async function KeresesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: initialQuery } = await searchParams
  const supabase = await createClient()
  const [g, c, d] = await Promise.all([
    supabase.from('guidelines').select('id, title, summary, specialty').eq('status', 'published'),
    supabase.from('career_items').select('id, title, category, tags, org').eq('status', 'published'),
    supabase.from('diseases').select('id, name, aliases, abbrev, specialty').eq('status', 'published'),
  ])
  const careerEnabled = await getFlag('apn_career', false)
  return (
    <>
      <Link className="sh-back" href="/">‹ Kezdőlap</Link>
      <h1 className="h1">Keresés</h1>
      <GlobalSearch guidelines={g.data ?? []} career={careerEnabled ? (c.data ?? []) : []} diseases={d.data ?? []} initialQuery={initialQuery ?? ''} />
    </>
  )
}
