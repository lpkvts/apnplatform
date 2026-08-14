import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { GlobalSearch } from '@/components/global-search'

export default async function KeresesPage() {
  const supabase = await createClient()
  const [g, c, d] = await Promise.all([
    supabase.from('guidelines').select('id, title, summary, specialty').eq('status', 'published'),
    supabase.from('career_items').select('id, title, category, tags, org').eq('status', 'published'),
    supabase.from('diseases').select('id, name, aliases, abbrev, specialty').eq('status', 'published'),
  ])
  return (
    <>
      <Link className="sh-back" href="/">‹ Kezdőlap</Link>
      <h1 className="h1">Keresés</h1>
      <GlobalSearch guidelines={g.data ?? []} career={c.data ?? []} diseases={d.data ?? []} />
    </>
  )
}
