import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Kurzusfájl megnyitása.
 *
 * A tároló nem nyilvános: a letöltés rövid élettartamú, aláírt hivatkozáson
 * keresztül történik. A jogosultságot a nyilvántartás lekérdezése érvényesíti
 * — ha a felhasználó nem látja a sort, hivatkozást sem kap.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: file } = await supabase
    .from('education_files')
    .select('path')
    .eq('id', id)
    .maybeSingle<{ path: string }>()

  if (!file) {
    return NextResponse.json({ error: 'A fájl nem érhető el.' }, { status: 404 })
  }

  const { data } = await supabase.storage
    .from('kurzus-fajlok')
    .createSignedUrl(file.path, 60 * 5)

  if (!data?.signedUrl) {
    return NextResponse.json({ error: 'A hivatkozás nem hozható létre.' }, { status: 500 })
  }

  return NextResponse.redirect(data.signedUrl)
}
